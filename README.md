# INST760 Final Project

## COVID in the US: Identifying outliers
### Identifying social factors that play an important role in the transmission of COVID-19 using state and county demographic data.

**Link**

https://gcruz12-umd.github.io/virus_viz/

**Background**

As it stands, the data is being gathered from the NYTimes COVID data tracker (https://raw.githubusercontent.com/nytimes/COVID-19-data/master/us-counties.csv). This data contains the total case and death counts for each county in the continental US.

This data was then joined with County level datasets from US Department of Government's Economic Research Service. (https://catalog.data.gov/dataset/county-level-data-sets).

The purpose of this chloropleth map is to demonstrate to the user states/counties where the association between the chosen variable and total COVID deaths or cases for the state/counties deviate high or low from the expected amount.

The expected amount is defined as the predicted count of deaths after creating a linear model where the criterion variable is the count of instances (cases or deaths, chosen by user), and the predictor variable is the variable chosen by the user at the dropdown.

To determine the Standard Error as a percentage, the following formula is used: 

*SE = (actual_value - predicted_value) / actual_value*

In order to create the graph, the Standard Errors(as percentages) are determined for each respective municipality in relation to the scope (ie, states at the national level, county at the state levels). The hue is determined by gathering all the Standard Errors for all municipalities in scope and determining the values of what would be the edges of the outliers. These were determined by using the following fomula:

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