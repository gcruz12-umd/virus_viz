d3.select("#selected-dropdown").text("Unemployed 2019");
var tooltip = d3.select("#tooltip")
            .style("position", "absolute")
            .style("z-index", "10")
            .style("visibility", "hidden")
            .style("background", "#000")
            .text("a simple tooltip");

d3.select("select")
    .on("change",function(d){
        d3.select("svg").remove();

        var selected = d3.select("#d3-dropdown").node().value;
        //console.log( selected );
        
        var width = 960
        var height = 600
        var padding = 20
        
        //var color;
        
        //var state_color;
        
        var projection = d3.geoAlbers()
            .precision(0)
            .scale(height * 2).translate([width / 2, height / 2])
        
        var path = d3.geoPath().projection(projection)
        
        var svg = d3.select('body')
            .append('svg')
            .attr('width', width)
            .attr('height', height)
        
        d3.queue()
            .defer(d3.csv, 'data/data.csv', function (d) {
                return {
                    id: +(d.state + d.county),
                    state: d.state,
                    county: d.county,
                    unemployment: +d.Unemployed_2019,
                    highschool: +d.high_school_diploma
                }
            })
            .defer(d3.json, 'data/us-states.json')
            .defer(d3.json, 'data/us-counties.json')
            .awaitAll(initialize)
        
        function initialize(error, results) {
            if (error) { throw error }

            var data = results[0]
            //console.log(data)
            
            //MAKING ARRAYS FOR DIFFERENT VARIABLES
            var municipalities_array = [];
            var states_array = [];

            //MAKING ARRAYS FOR STATE AND NATIONAL LEVEL CASES AND DEATHS

            //FIRST CASES
            var municipalities_array_cases = [];
            var states_array_cases = [];
            
            //THEN DEATHS
            var municipalities_array_deaths = [];
            var states_array_deaths = [];

            var states = topojson.feature(results[1], results[1].objects.states).features
            var counties = topojson.feature(results[2], results[2].objects.counties).features
        
            states.forEach(function (f) {
                f.properties = data.find(function (d) { return d.id === f.id })
                municipalities_array.push(f.properties)
            })
            
        
            counties.forEach(function (f) {
                f.properties = data.find(function (d) { return d.id === f.id }) || {}
                states_array.push(f.properties);
            })

            
            function build_state_color_array(variable){
                var i;
                var list_of_vars = [];

                for (i = 0; i < municipalities_array.length; i++){
                    list_of_vars.push(municipalities_array[i][variable]);
                }

                return list_of_vars
            }

            function build_county_color_array(variable){
                var i;
                var list_of_vars = [];

                for (i = 0; i < states_array.length; i++){
                    list_of_vars.push(states_array[i][variable]);
                }

                return list_of_vars
            }

            function determine_outliers(state=true){ 
                var placeholder;

                if (selected === "Unemployed 2019"){
                    placeholder = "unemployment";
                } else if (selected === "high school diploma"){
                    placeholder = "highschool";
                }

                // Copy the values, rather than operating on references to existing values

                var someArray; 
                if (state === true) {
                    someArray = build_state_color_array(placeholder)
                } else {
                    someArray = build_county_color_array(placeholder)
                }

                if(someArray.length < 4)
                    return someArray;

                let values, q1, q3, iqr, maxValue, minValue;

                values = someArray.slice().sort( (a, b) => a - b);//copy array fast and sort
                console.log(values)

                if((values.length / 4) % 1 === 0){//find quartiles
                    q1 = 1/2 * (values[(values.length / 4)] + values[(values.length / 4) + 1]);
                    q3 = 1/2 * (values[(values.length * (3 / 4))] + values[(values.length * (3 / 4)) + 1]);
                } else {
                    q1 = values[Math.floor(values.length / 4 + 1)];
                    q3 = values[Math.ceil(values.length * (3 / 4) + 1)];
                }
                console.log(q1,q3)
                // Then find min and max values
                iqr = q3 - q1;
                maxValue = q3 + iqr*1.5;
                minValue = q1 - iqr*1.5;
                
                console.log([minValue, maxValue])
                return [minValue, maxValue]
            }

            var color = d3.scaleThreshold()
                .domain(determine_outliers())  
                .range(["blue","red"]); 
            
            var state_color = d3.scaleThreshold()
                .domain(determine_outliers(false))  
                .range(["blue","red"]); 

            function get_attribute(d){
                var placeholder;

                if (selected === "Unemployed 2019"){
                    placeholder = d.properties.unemployment;
                } else if (selected === "high school diploma"){
                    placeholder = d.properties.highschool;
                }
                //console.log(placeholder)
                return placeholder;
            }
        
        
            var statePaths = svg.selectAll('.state')
                .data(states)
                .enter().append('path')
                .attr('class', 'state')
                .attr('d', path)
                .style('fill', function (d) { return color(get_attribute(d))})
                .on('click', function (d) { stateZoom(d.id) })
                //.text(function(d) { get_attribute(d) })
                .on("mouseover", function(d){tooltip.text(get_attribute(d)); return tooltip.style("visibility", "visible");})
                .on("mousemove", function(){return tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");})
                .on("mouseout", function(){return tooltip.style("visibility", "hidden");});
        
            function usZoom() {
                var t = d3.transition().duration(800)
        
                projection.scale(height * 2).translate([width / 2, height / 2])
        
                statePaths.transition(t)
                    .attr('d', path)
                    .style('fill', function (d) { return color(get_attribute(d)) })
        
                svg.selectAll('.county')
                    .data([])
                    .exit().transition(t)
                    .attr('d', path)
                    .style('opacity', 0)
                    .remove()
            }
        
            function stateZoom(id) {
                var state = states.find(function (d) { return d.id === id })
                //console.log(state)

                var stateCounties = counties.filter(function (d) {
                    return d.id > id && d.id < id + 1000
                })
        
                var t = d3.transition().duration(800)
        
                var countyPaths = svg.selectAll('.county')
                    .data(stateCounties, function (d) { return d.id })
        
                var enterCountyPaths = countyPaths.enter().append('path')
                    .attr('class', 'county')
                    .attr('d', path)
                    .style('fill', function (d) { return state_color(get_attribute(d)) })
                    .style('opacity', 0)
                    .on('click', function () { usZoom() })
                    .on("mouseover", function(d){tooltip.text(get_attribute(d)); return tooltip.style("visibility", "visible");})
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
    })
