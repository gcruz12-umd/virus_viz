//import {legend} from "@d3/color-legend"
//
function linearRegression(y,x){
    var lr = {};
    var n = y.length;
    var sum_x = 0;
    var sum_y = 0;
    var sum_xy = 0;
    var sum_xx = 0;
    var sum_yy = 0;

    for (var i = 0; i < y.length; i++) {
        if (typeof x[i] === "number"){
            sum_x += x[i];
            sum_y += y[i];
            sum_xy += (x[i]*y[i]);
            sum_xx += (x[i]*x[i]);
            sum_yy += (y[i]*y[i]);
        }
    } 
    lr['slope'] = (n * sum_xy - sum_x * sum_y) / (n*sum_xx - sum_x * sum_x);
    lr['intercept'] = (sum_y - lr.slope * sum_x)/n;
    lr['r2'] = Math.pow((n*sum_xy - sum_x*sum_y)/Math.sqrt((n*sum_xx-sum_x*sum_x)*(n*sum_yy-sum_y*sum_y)),2);

    return lr;
}

function continuous(selector_id, colorscale) {
    d3.select("g").remove();
    var legendheight = 200,
        legendwidth = 80,
        margin = {top: 10, right: 60, bottom: 10, left: 2};
  
    var canvas = d3.select(selector_id)
      .style("height", legendheight + "px")
      .style("width", legendwidth + "px")
      .style("position", "relative")
      .append("canvas")
      .attr("height", legendheight - margin.top - margin.bottom)
      .attr("width", 1)
      .style("height", (legendheight - margin.top - margin.bottom) + "px")
      .style("width", (legendwidth - margin.left - margin.right) + "px")
      .style("border", "1px solid #000")
      .style("position", "absolute")
      .style("top", (margin.top) + "px")
      .style("left", (margin.left) + "px")
      .node();
  
    var ctx = canvas.getContext("2d");
  
    var legendscale = d3.scaleLinear()
      .range([1, legendheight - margin.top - margin.bottom])
      .domain(colorscale.domain());
  
    // image data hackery based on http://bl.ocks.org/mbostock/048d21cf747371b11884f75ad896e5a5
    var image = ctx.createImageData(1, legendheight);
    d3.range(legendheight).forEach(function(i) {
      var c = d3.rgb(colorscale(legendscale.invert(i)));
      image.data[4*i] = c.r;
      image.data[4*i + 1] = c.g;
      image.data[4*i + 2] = c.b;
      image.data[4*i + 3] = 255;
    });
    ctx.putImageData(image, 0, 0);
  
    // A simpler way to do the above, but possibly slower. keep in mind the legend width is stretched because the width attr of the canvas is 1
    // See http://stackoverflow.com/questions/4899799/whats-the-best-way-to-set-a-single-pixel-in-an-html5-canvas
    /*
    d3.range(legendheight).forEach(function(i) {
      ctx.fillStyle = colorscale(legendscale.invert(i));
      ctx.fillRect(0,i,1,1);
    });
    */
  
    var legendaxis = d3.axisRight()
      .scale(legendscale)
      .tickSize(6)
      .ticks(8);
  
    var svg = d3.select(selector_id)
      .append("svg")
      .attr("height", (legendheight) + "px")
      .attr("width", (legendwidth) + "px")
      .style("position", "absolute")
      .style("left", "0px")
      .style("top", "0px")
  
    svg
      .append("g")
      .attr("class", "axis")
      .attr("transform", "translate(" + (legendwidth - margin.left - margin.right + 3) + "," + (margin.top) + ")")
      .call(legendaxis);
};

//d3.select("#selected-dropdown").text("Unemployed 2019");

var tooltip = d3.select("#tooltip")
            .style("position", "absolute")
            .style("z-index", "10")
            .style("visibility", "hidden")
            .text("a simple tooltip");

//d3.select("select")
//    .on("change",function(d){
function create_viz(){    
        d3.selectAll("svg").remove();

        var selected = d3.select("#d3-dropdown").node().value;
        var selected_cases = d3.select("#d3-dropdown_cases").node().value;
        
        
        var width = 960
        var height = 600
        var padding = 20
        
        //var color;
        
        //var state_color;
        
        var projection = d3.geoAlbers()
            .precision(0)
            .scale(height * 2).translate([width / 2, height / 2])
        
        var path = d3.geoPath().projection(projection)
        
        var svg = d3.select('#map')
            .append('svg')
            .attr('width', width)
            .attr('height', height)
        
        if (selected_cases === "Deaths"){
            d3.queue()
            .defer(d3.csv, 'data/data.csv', function (d) {
                return {
                    id: +(d.state + d.county),
                    state: d.state,
                    county: d.county,
                    unemployment: +d.Unemployed_2019,
                    highschool: +d.high_school_diploma,
                    cases: +d.cases,
                    deaths: +d.deaths,
                    labor_force: +d.Civilian_labor_force_2019,
                    R_NET_MIG_2019: +d.R_NET_MIG_2019,
                    county_name: d.County_name
                }
            })
            .defer(d3.json, 'data/us-states.json')
            .defer(d3.json, 'data/us-counties.json')
            .awaitAll(initialize)
        } else {
        d3.queue()
            .defer(d3.csv, 'data/data.csv', function (d) {
                return {
                    id: +(d.state + d.county),
                    state: d.state,
                    county: d.county,
                    unemployment: +d.Unemployed_2019,
                    highschool: +d.high_school_diploma,
                    cases: +d.deaths,
                    deaths: +d.cases,
                    labor_force: +d.Civilian_labor_force_2019,
                    R_NET_MIG_2019: +d.R_NET_MIG_2019,
                    county_name: d.County_name
                }
            })
            .defer(d3.json, 'data/us-states.json')
            .defer(d3.json, 'data/us-counties.json')
            .awaitAll(initialize)
        }
        function initialize(error, results) {
            if (error) { throw error }

            var data = results[0]
            //console.log(data)
            
            //MAKING ARRAYS FOR DIFFERENT VARIABLES
            var municipalities_array = [];
            var states_array = [];


            var states = topojson.feature(results[1], results[1].objects.states).features
            var counties = topojson.feature(results[2], results[2].objects.counties).features
            //console.log(topojson.feature(results[1], results[1].objects.states))

            states.forEach(function (f) {
                f.properties = data.find(function (d) { return d.id === f.id })
                //console.log(f.properties)
                municipalities_array.push(f.properties)
            })
            
        
            counties.forEach(function (f) {
                f.properties = data.find(function (d) { return d.id === f.id }) || {}
                states_array.push(f.properties);
            })

            //console.log("here are the states", states_array)
            //console.log(states, counties)
            var states_array_deaths;
            var municipalities_array_deaths;
            var states_array_cases;
            var municipalities_array_cases;
            
            function cases_deaths(id){
                var i;

                var deaths_state = [];
                var deaths_county = [];

                var cases_state = [];
                var cases_county = [];

                for (i = 0; i < municipalities_array.length; i++){
                    cases_state.push(municipalities_array[i]["cases"]);
                    deaths_state.push(municipalities_array[i]["deaths"]);
                }

                for (i = 0; i < states_array.length; i++){
                    if (states_array[i].id > id && states_array[i].id < id + 1000){
                        cases_county.push(states_array[i]["cases"]);
                        deaths_county.push(states_array[i]["deaths"]);
                    }
                }

                return {"state_deaths": deaths_state,
                        "state_cases" : cases_state,
                        "county_deaths": deaths_county,
                        "county_cases": cases_county}
            }

            //MAKING ARRAYS FOR STATE AND NATIONAL LEVEL CASES AND DEATHS
            var case_nums = cases_deaths()
            //console.log(case_nums)
            //FIRST CASES
            //var municipalities_array_cases = case_nums["state_cases"];
            //var states_array_cases = case_nums["county_cases"];
            
            //THEN DEATHS
            //var municipalities_array_deaths = case_nums["state_deaths"];
            //var states_array_deaths = case_nums["county_deaths"];

            
            function build_state_color_array(variable){
                var i;
                var list_of_vars = [];

                for (i = 0; i < municipalities_array.length; i++){
                    list_of_vars.push(municipalities_array[i][variable]);
                }

                return list_of_vars
            }

            function build_county_color_array(variable, id){
                var i;
                var list_of_vars = [];

                for (i = 0; i < states_array.length; i++){
                    //console.log(id, states_array[i].id)
                    if (states_array[i].id > id && states_array[i].id < id + 1000){
                        //console.log(id, states_array[i].id)
                        list_of_vars.push(states_array[i][variable]);
                    }
                }

                return list_of_vars
            }

            var regression_coefficients;
            function determine_outliers(d, state=true){ 
                var placeholder;

                if (selected === "Unemployed 2019"){
                    placeholder = "unemployment";
                } else if (selected === "high school diploma"){
                    placeholder = "highschool";
                
                } else if (selected === "Labor Force"){
                    placeholder = "labor_force";

                } else if (selected === "2019 Net Migration"){
                    placeholder = "R_NET_MIG_2019";
                }

                console.log(placeholder)

                // Copy the values, rather than operating on references to existing values
                var cases_array;
                var someArray; 
                if (state === true) {
                    someArray = build_state_color_array(placeholder);
                    cases_array = cases_deaths()["state_deaths"];
                } else if (state === false){
                    someArray = build_county_color_array(placeholder, d);
                    cases_array = cases_deaths(d)["county_deaths"]
                    //console.log(cases_array)
                    //cases_array = cases_array.filter(function (item) {
                    //    return item.id > id && item.id < id + 1000
                    //})
                }

                regression_coefficients = linearRegression(cases_array, someArray)
                //console.log(cases_array, someArray)
                //console.log(regression_coefficients)
                var predicted_values = someArray.map(i => i * regression_coefficients.slope + regression_coefficients.intercept);
                
                var child = document.createElement('p');
                child.setAttribute("id", "formula");
                child.innerHTML = "Expected = " + placeholder + " * " + regression_coefficients.slope + " + " + regression_coefficients.intercept;
                d3.selectAll("#formula").remove();
                document.getElementById('stats').appendChild(child);

                var i;
                var variances = [];
                for (i = 0; i<predicted_values.length; i++){
                    //console.log(states_array_deaths[i])
                    variances.push((cases_array[i] - predicted_values[i])/cases_array[i]);
                }
                //console.log(variances)

                let values, q1, q3, iqr, maxValue, minValue;

                values = variances.slice().sort( (a, b) => a - b);//copy array fast and sort
                //values = predicted_values
                //console.log(values)

                if((values.length / 4) % 1 === 0){//find quartiles
                    q1 = 1/2 * (values[(values.length / 4)] + values[(values.length / 4) + 1]);
                    q3 = 1/2 * (values[(values.length * (3 / 4))] + values[(values.length * (3 / 4)) + 1]);
                } else {
                    q1 = values[Math.floor(values.length / 4 + 1)];
                    q3 = values[Math.ceil(values.length * (3 / 4) + 1)];
                }
                //console.log(q1,q3)
                // Then find min and max values
                iqr = q3 - q1;
                maxValue = q3 + iqr*1.5;
                minValue = q1 - iqr*1.5;

                var child = document.createElement('p');
                child.setAttribute("id", "outlier");
                child.innerHTML = "Outlier Edge Values = " + minValue + " to " + maxValue;
                d3.selectAll("#outlier").remove();
                document.getElementById('stats').appendChild(child);
                
                //console.log([minValue, maxValue])

                var colorScale1 = d3.scaleSequential(d3.interpolatePlasma)
                    .domain([minValue, maxValue]);
                continuous("#legend1", colorScale1);

                return [minValue, maxValue]
            }

            function get_variance_of_attr(actual,i){
                var predicted = i * regression_coefficients.slope + regression_coefficients.intercept;
                //console.log(actual, i, predicted, (predicted - actual)/actual)
                return (predicted - actual)/actual
            }

            var color = d3.scaleSequential(d3.interpolatePlasma).domain(determine_outliers())  
                //.range(["blue","red"]); 

            function get_attribute(d){
                var placeholder;

                if (selected === "Unemployed 2019"){
                    placeholder = d.properties.unemployment;
                } else if (selected === "high school diploma"){
                    placeholder = d.properties.highschool;
                } else if (selected === "Labor Force"){
                    placeholder = d.properties.labor_force;
                } else if (selected === "2019 Net Migration"){
                    placeholder = d.properties.R_NET_MIG_2019;
                }
                
                //console.log(placeholder)
                return placeholder;
            }

            function get_text(d){
                var placeholder;

                if (selected === "Unemployed 2019"){
                    placeholder = d.properties.unemployment;
                } else if (selected === "high school diploma"){
                    placeholder = d.properties.highschool;
                } else if (selected === "Labor Force"){
                    placeholder = d.properties.labor_force;
                } else if (selected === "2019 Net Migration"){
                    placeholder = d.properties.R_NET_MIG_2019;
                }

                //console.log(placeholder)
                return d.properties.county_name + "  |  " + selected + ":"+ placeholder + "  |  " + "Instances : " + d.properties.deaths + " | Variance = " + get_variance_of_attr(d.properties.deaths,get_attribute(d));
            }
        
            var statePaths = svg.selectAll('.state')
                .data(states)
                .enter().append('path')
                .attr('class', 'state')
                .attr('d', path)
                .style('fill', function (d) { return color(get_variance_of_attr(d.properties.deaths,get_attribute(d)))})
                .on('click', function (d) { stateZoom(d.id) })
                //.text(function(d) { get_attribute(d) })
                .on("mouseover", function(d){tooltip.text(get_text(d)); return tooltip.style("visibility", "visible");})
                .on("mousemove", function(){return tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");})
                .on("mouseout", function(){return tooltip.style("visibility", "hidden");});
                
            function usZoom() {
                color = d3.scaleSequential(d3.interpolatePlasma).domain(determine_outliers())  
                var t = d3.transition().duration(800)
        
                projection.scale(height * 2).translate([width / 2, height / 2])
        
                statePaths.transition(t)
                    .attr('d', path)
                    .style('fill', function (d) { return color(get_variance_of_attr(d.properties.deaths,get_attribute(d)))})
        
                svg.selectAll('.county')
                    .data([])
                    .exit().transition(t)
                    .attr('d', path)
                    .style('opacity', 0)
                    .remove()
            }
        
            function stateZoom(id) {
                var state_color = d3.scaleSequential(d3.interpolatePlasma).domain(determine_outliers(id, false))  
                //.range(["blue","red"]);

                var state = states.find(function (d) { return d.id === id })
                //console.log(state)

                var stateCounties = counties.filter(function (d) {
                    return d.id > id && d.id < id + 1000
                })
        
                var t = d3.transition().duration(400)
        
                var countyPaths = svg.selectAll('.county')
                    .data(stateCounties, function (d) { return d.id })
        
                var enterCountyPaths = countyPaths.enter().append('path')
                    .attr('class', 'county')
                    .attr('d', path)
                    .style('fill', function (d) { return state_color(get_variance_of_attr(d.properties.deaths,get_attribute(d)))})
                    .style('opacity', 0)
                    .on('click', function () { usZoom() })
                    .on("mouseover", function(d){tooltip.text(get_text(d)); return tooltip.style("visibility", "visible");})
                    .on("mousemove", function(){return tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");})
                    .on("mouseout", function(){return tooltip.style("visibility", "hidden");});
        
                projection.fitExtent(
                    [[padding, padding], [width - padding, height - padding]],
                    state
                )
        
                statePaths.transition(t)
                    .attr('d', path)
                    .style('fill', '#444')
        
                enterCountyPaths.transition(t)
                    .attr('d', path)
                    .style('opacity', 1)
        
                countyPaths.exit().transition(t)
                    .attr('d', path)
                    .style('opacity', 0)
                    .remove()
            }
        }
    }
