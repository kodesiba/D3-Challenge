// define SVG and clear existing
var svgArea = d3.select("body").select("svg");
    if (!svgArea.empty()) {
    svgArea.remove();
};

// set SVG dimenstions and Chart dimensions
var margin = {
    top: 50,
    right: 50,
    bottom: 50,
    left: 50
};

var svgWidth = window.innerWidth - margin.left - margin.right;
var svgHeight = window.innerHeight - margin.top - margin.bottom;

var chartHeight = svgHeight - margin.top - margin.bottom;
var chartWidth = svgWidth - margin.left - margin.right;

// append svg and group
var svg = d3.select("#scatter")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// bring in data and create initial plot
d3.csv("assets/data/data.csv").then(function(data) {
    data.forEach(d =>{
        d.poverty = +d.poverty;
        d.healthcare = +d.healthcare;
    });

    // create scales
    var xscalemin = +d3.min(data.map(d => d.poverty)).toFixed(0);
    var xscalemax = +d3.max(data.map(d => d.poverty)).toFixed(0);
    var xscalerng = +((xscalemax - xscalemin) / 5).toFixed(0);
    
    var xScale = d3.scaleLinear()
        .domain([xscalemin - xscalerng, xscalemax + xscalerng])
        .range([0, chartWidth]);

    var yscalemin = +d3.min(data.map(d => d.healthcare)).toFixed(0);
    var yscalemax = +d3.max(data.map(d => d.healthcare)).toFixed(0);
    var yscalerng = +((yscalemax - yscalemin) / 5).toFixed(0);

    var yScale = d3.scaleLinear()
        .domain([yscalemin - yscalerng, (yscalemax + yscalerng)])
        .range([chartHeight, 0]);
    
    // create axes
    var yAxis = d3.axisLeft(yScale);
    var xAxis = d3.axisBottom(xScale);

    // set x to the bottom of the chart
    chartGroup.append("g")
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(xAxis);

    // set y to the left of the chart
    chartGroup.append("g")  
        .call(yAxis);

    // append circles to data points, add text, add tooltips
    var circlesGroup = chartGroup.append('g')
        .attr('id', 'chartCircles')

    var circleElements = circlesGroup.selectAll('g')
        .data(data)
        .enter()
        .append('g')
        .attr("transform", d => `translate(${xScale(d.poverty)}, ${yScale(d.healthcare)})`)

    circleElements.append("circle")
        .attr("r", "15")
        .attr("fill", "lightblue")
        .attr('stroke','white');

    circleElements.append("text")
        .attr('text-anchor','middle')
        .attr('dy', '4.5px')
        .attr('fill','white')
        .attr('stroke','white')
        .attr('stroke-width','1.5')
        .text(d => d.abbr);
        
    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([30,-70])
        .html(function(d) {
        return (`${d.state}<br>Poverty: ${d.poverty}%<br>Healthcare: ${d.healthcare}%`);
        });

    circlesGroup.call(toolTip);

    circleElements
        .on("mouseover", function(data) {
            toolTip.show(data, this);
        })
        .on("mouseout", function(data, index) {
            toolTip.hide(data);
        });

    // append yaxis text
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (chartHeight / 2))
        .attr("dy", "1em")
        .classed("axis-text yaxis", true)
        .text("Lacks Healthcare (%)");

    // append xaxis text
    chartGroup.append("text")
        .attr("y", 20 + chartHeight)
        .attr("x", 0 + (chartWidth / 2))
        .attr("dy", "1em")
        .classed("axis-text xaxis", true)
        .text("In Poverty (%)");
        
})