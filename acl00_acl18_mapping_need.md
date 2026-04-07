# ACL00 to ACL18 Mapping: Need for Manual Review
## Full acl00 tags not present in acl18 (53)
AC02, AC0A, AC1A, AC1B, AC1_2_TR, AC1_TR, AC21A, AC22, AC3, AC313, AC31A, AC32A, AC331, AC332, AC33A, AC342, AC343, AC344, AC34A, AC37_39, AC38A, AC38B, AC3_TR, AC3_X_38, AC4-8, AC4-8A, AC4-8NSP, AC41, AC42, AC43, AC51A, AC51B, AC53, AC6A, AC733, AC7A, AC7B, AC811, AC82, AC83, AC90NSP, AC913, AC938, AC99NSP, AC9A, AC9B, AC9C, AC9D, AC9E, AC_NP_MAIN, AC_NP_SEC, AC_PNP_MAIN, NSP

## Suggested ACL18 candidate matches (top-1 per code)
These are heuristic suggestions (code-structure similarity + token overlap), so treat as migration candidates, not final truth:
AC02 → AC02
AC0A → AC0
AC1A → AC1
AC1B → AC1
AC1_2_TR → AC1_2
AC1_TR → AC1
AC21A → AC21
AC22 → AC22
AC3 → AC3
AC313 → AC313
AC31A → AC31
AC32A → AC32
AC331 → AC331
AC332 → AC332
AC33A → AC33
AC342 → AC342
AC343 → AC343
AC344 → AC344
AC34A → AC34
AC37_39 → AC39
AC38A → AC38
AC38B → AC38
AC3_TR → AC3
AC3_X_38 → AC3_713_X_38
AC4-8 → AC4
AC4-8A → AC4
AC4-8NSP → AC4
AC41 → AC41
AC42 → AC42
AC43 → AC43
AC51A → AC51
AC51B → AC51
AC53 → AC53
AC6A → AC6
AC733 → AC733
AC7A → AC7
AC7B → AC7
AC811 → AC811
AC82 → AC82
AC83 → AC83
AC90NSP → AC980
AC913 → AC939
AC938 → AC938
AC99NSP → AC999
AC9A → AC9
AC9B → AC9
AC9C → AC9
AC9D → AC9
AC9E → AC9
AC_NP_MAIN → AC_NP_MAIN
AC_NP_SEC → AC_NP_SEC
AC_PNP_MAIN → AC_PNP_MAIN
NSP → AC_NP_TOT


### High-confidence (direct or very close)
AC02, AC22, AC313, AC331, AC332, AC342, AC343, AC344, AC733, AC811, AC82, AC83, AC938, AC_NP_MAIN, AC_NP_SEC, AC_PNP_MAIN

### Needs manual review (ambiguous / aggregate / NSP-like)
AC0A, AC1A, AC1B, AC1_2_TR, AC1_TR, AC21A, AC31A, AC32A, AC33A, AC34A, AC37_39, AC38A, AC38B, AC3_TR, AC3_X_38, AC4-8, AC4-8A, AC4-8NSP, AC51A, AC51B, AC6A, AC7A, AC7B, AC90NSP, AC913, AC99NSP, AC9A, AC9B, AC9C, AC9D, AC9E, NSP



## Final Mapping Decision
⚠️ In ACL00, main and second jobs are separately tagged, while in ACL18 they are combined.  

Automatic mapping (reviewed and accepted):  
- AC02 → AC02 ✔️
- AC22 → AC22 ✔️
- AC313 → AC312 ✔️
- AC331 → AC331 ✔️
- AC332 → AC332 ✔️
- AC342 → AC342 ✔️
- AC343 → AC343 ✔️
- AC344 → AC344 ✔️
- AC733 → AC733 ✔️
- AC811 → AC811 ✔️ (minor description change)
- AC82 → AC82 ✔️ (minor description change)
- AC83 → AC83 ✔️ (minor description change)
- AC938 → AC938 ✔️ (minor description change)
- AC_NP_MAIN → AC_NP_MAIN ✔️
- AC_NP_SEC → AC_NP_SEC ✔️
- AC_PNP_MAIN → AC_PNP_MAIN ✔️


Manual review:  
- AC0A → AC0_X_021 ✔️
- AC1A → AC111 ✔️
- AC1B → AC12 ✔️ (minor description change)
- AC100 → AC1 ✔️ (broader)
- AC11 → AC11 ✔️ (broader, includes main and second jobs)
- AC111 → AC111 ✔️ (broader, includes main and second jobs)
- AC112 → AC121 ✔️ (broader, includes main and second jobs)
- AC12 → AC11 ✔️ (broader, includes main and second jobs)
- AC121 → AC111 ✔️ (broader, includes main and second jobs)
- AC122 → AC121 ✔️ (broader, includes main and second jobs)
- AC13 → AC12 ✔️
- AC130 → AC129 ✔️
- AC131 → AC121 ✔️ (broader, includes main and second jobs)
- AC139 → AC129 ✔️ (broader but acceptable)
- AC1_2_TR → AC1_2 ✔️
- AC1_TR → AC11-12 ✔️
- AC21A → AC21_X_212 ✔️
- AC31A → AC31_X_312 ✔️
- AC32A → AC32_X_321 ✔️
- AC33A → AC33 ✔️ (incomplete but enough)
- AC34A → AC341_349 ✔️ (good enough)
- AC340 → AC349 ✔️
- AC37_39 → AC37 ✔️ (broader but acceptable)
- AC38A → AC38_X_382-383 ✔️
- AC38B → AC382_383 ✔️
- AC3_TR → AC3_713_936 ✔️ (broader but acceptable)
- AC3_X_38 → AC3_713_X_38 ✔️ (broader but acceptable)
- AC4-8 → AC4-8_998_X_713 ✔️ (broader but acceptable)
- AC4-8A → AC4-8_998_X_713_821 ✔️ (broader but acceptable)
- AC4-8NSP → AC998 ✔️
- AC51A → AC512_513_519 ✔️ (broader but acceptable)
- AC51B → AC519 ✔️
- AC6A → AC6_X_611 ✔️
- AC7A → AC72 ✔️
- AC7B → AC71 + AC731 + AC732 => HAVE To **create AC71_731_732**  
- AC90NSP → AC900 ✔️
- AC913 → AC910 ✔️
- AC99NSP → AC999 ✔️
- AC9A → AC9_X_910 ✔️
- AC9B → AC920 ✔️
- AC9C → AC939 or AC938_939 (if childcare included)
- AC9D → AC940-980 ✔️
- AC9E → AC910_920 ✔️
- NSP → AC9 ✔️ (approximate)

&nbsp;  

---

&nbsp;  

## Full Review and Mappings
- AC0A → AC0_X_021
- AC000 → AC039
- AC0A → AC0_X_021
- AC010 → AC11
- AC030 → AC039


- AC1A → AC111
- AC1B → AC12
- AC100 → AC1
- AC11 → AC11
- AC111 → AC111
- AC112 → AC121
- AC12 → AC11
- AC121 → AC111
- AC122 → AC121
- AC13 → AC12
- AC130 → AC129
- AC131 → AC121
- AC139 → AC129
- AC1_2_TR → AC1_2
- AC1_TR → AC11-12

- AC21A → AC21_X_212
- AC22 → AC22
- AC200 → AC219
- AC210 → AC219

- AC310 → AC31
- AC312 → AC311
- AC313 → AC312
- AC314 → AC313
- AC319 → AC31
- AC31A → AC31_X_312
- AC320 → AC329
- AC32A → AC32_X_321
- AC330 → AC33
- AC333 → AC713
- AC33A → AC33
- AC34A → AC341_349
- AC340 → AC349
- AC313 → AC312
- AC331 → AC331
- AC332 → AC332
- AC34A → AC34
- AC340 → AC349
- AC342 → AC342
- AC343 → AC343
- AC344 → AC344
- AC350 → AC359
- AC360 → AC369
- AC363 → AC032
- AC37_39 → AC37
- AC380 → AC389
- AC38A → AC38_X_382-383
- AC38B → AC382_383
- AC3_TR → AC3_713_936
- AC3_X_38 → AC3_713_X_38

- AC400 → AC4
- AC410 → AC41
- AC412 → AC411
- AC419 → AC41
- AC420 → AC429
- AC421 → AC429
- AC422 → AC429
- AC423 → AC429
- AC424 → AC421
- AC425 → AC429
- AC426 → AC422
- AC427 → AC424
- AC428 → AC425 
- AC430 → AC439
- AC41A → AC439
- AC42A → AC439
- AC43A → AC432
- AC4-8 → AC4-8_998_X_713
- AC4-8A → AC4-8_998_X_713_821
- AC4-8NSP → AC998
- AC427 → AC424

- AC51A → AC512_513_519
- AC51B → AC519
- AC52A → AC52
- AC500 → AC5
- AC510 → AC519
- AC520 → AC529
- AC522A → AC522
- AC523H → AC523

- AC6A → AC6_X_611
- AC600 → AC619
- AC610 → AC61
- AC616 → AC615
- AC617 → AC616
- AC620 → AC62
- AC622 → AC621
- AC629 → AC62

- AC7A → AC72
- AC7B → AC711_712_719_731_732_739
- AC700 → AC719
- AC710 → AC71
- AC712 → AC711
- AC713 → AC711
- AC720 → AC719
- AC721 → AC712
- AC722 → AC721
- AC723 → AC722
- AC724 → AC515
- AC725 → AC729
- AC726 → AC719
- AC729 → AC719
- AC730 → AC739
- AC734 → AC731

- AC800 → AC8
- AC811 → AC811
- AC810 → AC819
- AC822 → AC821
- AC830 → AC831
- AC832 → AC831

- AC90NSP → AC900
- AC901 → AC900
- AC911 → AC910
- AC912 → AC910
- AC913 → AC910
- AC921 → AC920
- AC922 → AC920
- AC931 → AC939
- AC941 → AC940
- AC942 → AC950
- AC943 → AC940-980
- AC951 → AC950
- AC952 → AC960
- AC961 → AC900
- AC971 → AC900
- AC981 → AC980
- AC982 → AC900
- AC99NSP → AC999
- AC9A → AC9_X_910
- AC9B → AC920
- AC9C → AC939
- AC9D → AC940-980
- AC9E → AC910_920

- NSP → AC9 (approximate)
- AC_NP_MAIN → AC_NP_MAIN
- AC_NP_SEC → AC_NP_SEC
- AC_PNP_MAIN → AC_PNP_MAIN


**All other fields map directly (e.g. AC0 to AC0)**