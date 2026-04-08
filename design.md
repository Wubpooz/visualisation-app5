# Design
## Notes
- Keep same color for the same category across all charts
- Use a color palette that is colorblind-friendly and has good contrast for better readability
- Specify that it's the whole of Europe

## Layout
At the top of the page, there is a title that describes the visualization. Below the title, there is a brief description of what the visualization shows and how to interpret it.  

Then a "parallel set" of categories partition for each age group. The age groups can be selected from tabs/slider/idk, and the categories are colored differently. The years are the y-lines on the chart. It should start with 2000 and have steps for each year present in the data. Below the charts, there is a legend that explains the colors of the categories. When a category becomes more important than the one before it, it should go up in the order so that for each year you have the order of the categories from the most important to the least important. The width of the lines should be proportional to the percentage of time spent on that category for that age group and year. The lines should be smooth and visually appealing, and there should be a clear separation between the different categories. There should also be a small description below the chart that explains any notable trends or changes in the categories over time.    
![alt text](image.png)
⚠️ Make sure that the smallest categories are visibles vs Sleep, eating etc  

After that a detail line chart for each category, showing the trend over time for each age group. You can select the category using a button list, and the line chart updates to show the selected category. The x-axis of the line chart represents the years, and the y-axis represents the percentage of time spent on that category. Each age group is represented by a different colored line, and there is a legend to explain the colors. The labels for each group are placed at the end of the lines for easy identification. There is also a small description below the line chart that explains the trends and any notable changes over time. Maybe we can add a separator between the categories for which we observed a interesting trend.    


Latest, in another section is a waffle chart for the time repartition between alone/shared/other for each year. The age group can be selected using a "tab list of age groups" below the chart, and the chart updates to show the selected age group. The x-axis of the chart represents the years, and the y-axis represents the percentage of time spent alone/shared/other. The share of time should be always shown as a percentage to be easily identifiable.  


## Data choices


## Interactivity
