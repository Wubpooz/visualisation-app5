from __future__ import annotations

import argparse
import re
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
from pathlib import Path

import yaml

NS = {
    "m": "http://www.sdmx.org/resources/sdmxml/schemas/v2_1/message",
    "s": "http://www.sdmx.org/resources/sdmxml/schemas/v2_1/structure",
    "c": "http://www.sdmx.org/resources/sdmxml/schemas/v2_1/common",
}
XML_LANG = "{http://www.w3.org/XML/1998/namespace}lang"


def normalize_space(value: str | None) -> str:
    return " ".join((value or "").split())


def extract_localized_texts(parent: ET.Element, tag: str) -> dict[str, str]:
    out: dict[str, str] = {}
    for node in parent.findall(tag, NS):
        lang = node.attrib.get(XML_LANG, "und")
        out[lang] = normalize_space("".join(node.itertext()))
    return out


def tokenize_acl_codes(fragment: str) -> list[str]:
    chunk = normalize_space(fragment)
    chunk = re.sub(r"\band\b", ",", chunk, flags=re.IGNORECASE)
    chunk = chunk.replace(";", ",")

    codes: list[str] = []
    seen: set[str] = set()

    for token in chunk.split(","):
        cleaned = token.strip().strip(".")
        if not cleaned:
            continue

        cleaned = cleaned.replace("+", "")
        cleaned = re.sub(r"[^A-Za-z0-9_\-]", "", cleaned)
        if not cleaned:
            continue

        cleaned_upper = cleaned.upper()
        if cleaned_upper.startswith("ACL"):
            cleaned_upper = "AC" + cleaned_upper[3:]

        if cleaned_upper.startswith("AC"):
            code = cleaned_upper
        elif re.fullmatch(r"\d[\d_\-]*", cleaned_upper):
            code = f"AC{cleaned_upper}"
        else:
            continue

        if code not in seen:
            seen.add(code)
            codes.append(code)

    return codes


def parse_component_codes(explan_label_en: str) -> tuple[list[str], list[str]]:
    text = normalize_space(explan_label_en)
    if not text:
        return [], []

    includes: list[str] = []
    excludes: list[str] = []

    include_match = re.search(
        r"includes\s+the\s+ACL\s+groups?\s+(.+?)(?:\s+except\b.*)?$",
        text,
        flags=re.IGNORECASE,
    )
    if include_match:
        includes = tokenize_acl_codes(include_match.group(1))

    exclude_match = re.search(
        r"\bexcept\s+(?:the\s+)?(?:ACL\s+)?groups?\s+(.+)$",
        text,
        flags=re.IGNORECASE,
    )
    if exclude_match:
        excludes = tokenize_acl_codes(exclude_match.group(1))

    return includes, excludes


def infer_code_level(code: str) -> str:
    if code == "TOTAL":
        return "total"

    if not code.startswith("AC"):
        return "special"

    body = code[2:]
    if re.fullmatch(r"\d", body):
        return "major_division"
    if re.fullmatch(r"\d{2}", body):
        return "division"
    if re.fullmatch(r"\d{3}", body):
        return "group"
    return "aggregate_or_special"


def parse_annotation(ann: ET.Element) -> tuple[str, dict[str, object], dict[str, str]]:
    ann_type = normalize_space(ann.findtext("c:AnnotationType", default="", namespaces=NS))
    ann_title = normalize_space(ann.findtext("c:AnnotationTitle", default="", namespaces=NS))
    ann_texts = extract_localized_texts(ann, "c:AnnotationText")

    entry: dict[str, object] = {}
    if ann_title:
        entry["title"] = ann_title
    if ann_texts:
        entry["text"] = ann_texts

    return ann_type, entry, ann_texts


def parse_annotations(code_el: ET.Element) -> tuple[dict[str, list[dict[str, object]]], dict[str, str]]:
    grouped: dict[str, list[dict[str, object]]] = {}
    explan_label: dict[str, str] = {}

    for ann in code_el.findall("c:Annotations/c:Annotation", NS):
        ann_type, entry, ann_texts = parse_annotation(ann)

        if ann_type:
            grouped.setdefault(ann_type, []).append(entry)

        if ann_type == "EXPLAN_LABEL" and ann_texts:
            explan_label["en"] = ann_texts.get("en", explan_label.get("en", ""))
            for lang, value in ann_texts.items():
                explan_label.setdefault(lang, value)

    if not explan_label.get("en"):
        explan_label.pop("en", None)

    return grouped, explan_label


def build_acl18_mapping(xml_path: Path) -> dict[str, object]:
    root = ET.parse(xml_path).getroot()
    codelist = root.find(".//s:Codelist[@id='ACL18']", NS)
    if codelist is None:
        raise ValueError("ACL18 codelist not found in XML.")

    codelist_names = extract_localized_texts(codelist, "c:Name")
    codelist_descriptions = extract_localized_texts(codelist, "c:Description")

    codes_map: dict[str, dict[str, object]] = {}

    for code_el in codelist.findall("s:Code", NS):
        code_id = code_el.attrib.get("id", "")
        if not code_id:
            continue

        names = extract_localized_texts(code_el, "c:Name")
        annotations, explan_label = parse_annotations(code_el)
        explan_label_en = explan_label.get("en", "")
        includes, excludes = parse_component_codes(explan_label_en)

        codes_map[code_id] = {
            "kind": "activity_code",
            "level": infer_code_level(code_id),
            "urn": code_el.attrib.get("urn", ""),
            "name": names,
            "is_aggregate": bool(includes or excludes or code_id.endswith("_X_021")),
            "aggregate_components": includes,
            "aggregate_exclusions": excludes,
            "explan_label": explan_label,
            "annotations": annotations,
        }

    return {
        "schema_version": "1.0",
        "generated_at_utc": datetime.now(timezone.utc).isoformat(),
        "source": {
            "file": str(xml_path.as_posix()),
            "codelist_id": codelist.attrib.get("id", ""),
            "agency_id": codelist.attrib.get("agencyID", ""),
            "version": codelist.attrib.get("version", ""),
            "urn": codelist.attrib.get("urn", ""),
            "name": codelist_names,
            "description": codelist_descriptions,
        },
        "code_count": len(codes_map),
        "codes": codes_map,
    }


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Generate ACL18 code mapping YAML from SDMX XML.")
    parser.add_argument(
        "--input",
        type=Path,
        default=Path("docs") / "ESTAT_ACL18_5.1.xml",
        help="Path to ACL18 SDMX XML file.",
    )
    parser.add_argument(
        "--output",
        type=Path,
        default=Path("docs") / "ACL18_code_mapping.yml",
        help="Output YAML file path.",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    mapping = build_acl18_mapping(args.input)

    args.output.parent.mkdir(parents=True, exist_ok=True)
    with args.output.open("w", encoding="utf-8") as f:
        yaml.safe_dump(
            mapping,
            f,
            sort_keys=False,
            allow_unicode=True,
            width=1000,
            default_flow_style=False,
        )

    print(f"Wrote {args.output} with {mapping['code_count']} codes")


if __name__ == "__main__":
    main()
