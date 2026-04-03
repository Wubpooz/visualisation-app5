Unique acl00 codes: 69
Unique acl18 codes: 56
Exact string overlap: 16 codes only
(AC0, AC01, AC03, AC2, AC212, AC321, AC35, AC36, AC38, AC511, AC52, AC611, AC81, AC812, AC936, TOTAL)
acl00-only codes: 53
acl18-only codes: 40


2000/2010 edge codes needing explicit handling:
NSP (18,270 rows)
AC_NP_SEC (792)
AC_NP_MAIN (396)
AC_PNP_MAIN (396)
These can go to OTHER/UNKNOWN bucket.


Wave-specific (not directly mergeable as-is):  
acl00 (2000/2010 only)
acl18 (2020 only)
hhstatus (2000/2010 only)
hhcomp (2020 only)
isced97 (2000/2010 only)
isced11 (2020 only)
tra_mode (2000/2010 only, very sparse)
status_flag (2020 only, only value seen: u)

create coarse level (LOW, MEDIUM, HIGH, TOTAL) from both isced97 and isced11


Partially compatible (needs filtering/recode):   
age: partial overlap (shared only TOTAL, Y45-64, Y65-74, Y_GE65)
daysweek: 2000 uses coarse bins, 2020 has extra detail (D1-4, D5, D6, D7)
month: shared monthly codes + TOTAL; 2020 adds rolling periods (M01-03, etc.)
geo: 2020 is a subset of 2000/2010
Shared geos: AT, BG, DE, EE, FI, NO, RS

restrict to shared value domains for age, daysweek, month, geo
