# INST760 Final Project

## COVID in the US: Identifying outliers
### Identifying social factors that play an important role in the transmission of COVID-19 using state and county demographic data.

**Project Link**

https://gcruz12-umd.github.io/virus_viz/

**Background**

As it stands, the data is being gathered from the NYTimes COVID data tracker (https://raw.githubusercontent.com/nytimes/COVID-19-data/master/us-counties.csv). This data contains the total case and death counts for each county in the continental US.

This data was then joined with County level datasets from US Department of Government's Economic Research Service. (https://catalog.data.gov/dataset/county-level-data-sets).

The purpose of this chloropleth map is to demonstrate to the user states/counties where the association between the chosen variable and total COVID deaths or cases for the state/counties deviate high or low from the expected amount. Because of this, the intended audience of this visualization is public officials that are aiming to use high level data like this, along with low level boots-on-the-ground knowledge in order to make data driven decisions. 

The expected amount is defined as the predicted count of deaths after creating a linear model where the criterion variable is the count of instances (cases or deaths, chosen by user), and the predictor variable is the variable chosen by the user at the dropdown.

To determine the Standard Error as a percentage, the following formula is used: 

*SE = (actual_value - predicted_value) / actual_value*

In order to create the graph, the Standard Errors(as percentages) are determined for each respective municipality in relation to the scope (ie, states at the national level, county at the state levels). The hue is determined by gathering all the Standard Errors for all municipalities in scope and determining the values of what would be the edges of the outliers. These were determined by using the following formulas:

*IQR = Q3 – Q1*

*Lower Limit = Q1 - (1.5 \* IQR)*

*Upper Limit = Q3 + (1.5 \* IQR)*

**Instructions**

In order to use this visualization first select a variable(socioeconomic factor) that you would like to analyze. We will call this variable X. You will then have to select an instance type (cases/deaths). This will be the Y value that the linear model will try to predict from the X value.

    Note: States colored more towards yellow mean that those states have more instances (cases or deaths) than expected given the quantity of X variable.

To switch scope to states, simply click on the state of interest. The color ranges will change since all of the counties will have variances relative to each other.

    Note: You can move from state to state by clicking outside of the state you are currently zoomed into without zooming out to the national level.

To zoom out to the national level simply click anywhere in the state.

**Data Sources**

All of the data used by the script to create the visualization can be found in the *data* directory.

In order to see the raw data and to take a look at the Tableau Prep file that was used to manipulate the data you can look in the *source_data* directory.

**Connection to Initial Proposal**

Originally, the goal of the final project was to create a visualization that would visualize county level data along with state level information. This system would be designed to let users pick the metric that they wanted to look for outliers in. Users should also have the ability to move from state to state and compare county to county information as needed. 

Per the original final project proposal:  *"The final version of the dashboard will add the ability for users to displace multiple metrics at the same time and compare two states in relation to each other. This should happen either by preserving the county abstraction or by aggregating to the state level. This is determined by the user."*

Unfortunately this was not the case for the actual final version of the visualization. Instead, this final version presents a tooltip when a user hovers over a particular state. By allowing this functionality, users are able to compare states as needed, however, the data itself is not being presented in one chunk off to the side of the visualization for comparison between states. The reason being that this functionality would break the ability for the visualization to zoom out to the national level when clicked. If we could allow users to click and select a county/state, they would not be able to then zoom in and out. It was preferable to have users gain the ability of navigation than of selection.

All other proposed functionality is present however. This includes aggregating data by state/county levels, seeing outliers, getting information on standard error when hovering over and being able to move around the visualization. 

Additionally, the presence of the choices of socioeconomic factors is important since this is listed in the proposal.

**Future Work**

Per the proposal:

*Further work in this area could involve tying in live data so that the data is tied in with real live data sources that can verify past or present information. Additionally, dashboards can be connected with other socioeconomic data or even geographical or human activity data. Having information on mobility or business data could add a deeper understanding of the data and could make it easier to identify trends or potential problem spots.*

For more information on the proposal please visit the *proposal* directory in the root of this repository.