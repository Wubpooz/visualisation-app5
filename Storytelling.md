# Storytelling
## Guidelines
1. Be clear 
2. Emphasize the important parts 
3. Acknowledge assumptions and ambiguity 
4. Avoid overstating results

**Questions to ask yourself:**  
- What point did you try to make? 
- What layout did you choose?  
- Did you put a title?  
- Did you put a subtitle? 
- Did you highlight any data? 
- Did you add anything else to help communicate?

**Know your context:**  
- Audience:
  - What do they want to know? 
  - What do they need to do? 
    accept | agree | begin | believe | change | collaborate | commence | 
    create | defend | desire | differentiate | do | empathize | empower | 
    encourage | engage | establish | examine | facilitate | familiarize | form 
    | implement | include...
- Message: In a single sentence find what your message is, and in 3 minutes find what your audience needs to know.

**Use signs to illustrate and prompt recognition**:  
  Icon: Physically resembles what it stands for
  Index: Implies / points to something (correlation)
  Symbol: Points to something; relationship has to be learned


Descriptive titles and annotations can be the difference between a chart and a story  

Indicate that scroll is possible.  

&nbsp;  

---

&nbsp;  
## Story
_pre-title_: Eurostat · Harmonised European Time Use Surveys · Whole of Europe · 2000 – 2020  
_title_: How Europe Spends Its Time 
_line_   
_problematic_: As a social species, how is the loneliness epidemic happening, and can we see it in the evolution of our time use?  

&nbsp;  
First Chart (streamgraph of categories by age group and survey year):  
- Title: The Daily Rhythm of Europe
- Message: Tracking how daily activities shifted across four generations and two decades in Europe revealed the rise of computing and evolving social patterns. Despite the digital surge however, most activities remained remarkably stable, with clear age-based specificities.
- Age group pills
- Graph
- Graph comment: Categories reorder vertically as their prominence shifts across survey years. Category bands widths follow a square-root scale to ensure that small categories remain visible. Hover or focus for actual share of the day values.
- Annotations:  
  - For young Europeans there was a significant shift of their time usage as computing time became prominent from 2000 to 2010 before coming back down in 2020. By 2020 socialising time nearly doubled, possibly reflecting expanded digital social interactions, while commuting dropped sharply (which could be a reflection of changing work patterns or a survey limitation).
  - Early-to-mid adult Europeans show the most balanced distribution. Computing rose sharply from 2000 to 2010 too, while commuting remained very high. Childcare climbed steadily during this two decade period.
  - The middle-aged adults group show strong stability across two decades. Computing grew steadily from near-zero to a visible share, while social activities picked up in 2020. Household cleaning gradually declined.
  - Retirees spend the most time walking and reading, and the least time commuting. The most striking change was the significant rise in socialising.

_line_  

&nbsp;  
Second Chart (line chart by category):  
- Title: Activity Deep Dive
- Message: The youngest cohort embraced computing and socialising, while older Europeans maintained traditional activities like walking and reading. The data suggests a complex interplay between technology adoption and enduring lifestyle habits across generations. 
- Graph
- Graph comment: Pick a category to compare how its share of daily time evolved for each age group between 2000 and 2020.
- Category pills
- Annotations:
  - **Reading books** declined across most age groups, but the 65+ cohort bucked the trend with an increase from 10.5 to 15.3 min/day by 2020. The gap between oldest and youngest readers widened dramatically.
  - **Socialising** remained relatively stable until 2020, when all age groups — especially 10–24 year-olds — saw sharp increases, perhaps reflecting expanded survey definitions of social interaction.
  - **Entertainment and culture** stayed remarkably stable across two decades and age groups, hovering between 4 and 11 min/day — a quiet constant amid rapid change.
  - **Walking & hiking** shows a clear age gradient: older Europeans walk significantly more. The 65+ group consistently spent 20+ min/day walking, roughly double the rate of younger groups.
  - **Cleaning** time gradually decreased for most groups, with the 65+ cohort maintaining the highest levels throughout. The decline is sharpest for 25–44-year-olds.
  - **Childcare activities** peak sharply for the 25–44 group and are nearly zero for 65+. The 25–44 group saw a notable increase from 13.6 to 20 min/day by 2020. Childcare activities peaks in this group — five times more than any other cohort
  - **Commute time** is near-zero for retirees but substantial for working-age groups. Younger Europeans saw a marked decline by 2020, while the 25–44 group maintained the highest commute times.

_line_  

&nbsp;  
Third Chart (waffle chart, alone vs shared by age group):  
- Title: Digital Isolation, or New Social Norms?  
- Message: How daily time divides between solitary, social, and other contexts across survey years. Each square represents one percentage point.
- Age group pills
- Graph
- Graph comment: **Alone** activities include computing, cleaning, and commuting. **Shared** activities include socialising, entertainment, childcare, walking, and employment. Classification derived from the modal social context of each activity across all survey waves, ignoring unclassified entries.
- Annotation: 


_line_

&nbsp;  

Acknowledgment:
Data: Eurostat HETUS (Harmonised European Time Use Surveys) · Covers participating European countries across three survey waves (2000, 2010, 2020)  

Built with D3.js  


### Acknowledgements
pk pas de catégorie other for time spent
axis can't be the same height but have the same step size
