function responsive(){

  // If you don't have this it will create multiple svg
  var svgArea = d3.select("body").select("svg");
  // remove if there is already svg
  if (!svgArea.empty()) {
    svgArea.remove();}
  
  // ------------ Now time to create our new svg that is responsive
  var svgWidth = window.innerWidth;
  var svgHeight = window.innerHeight/2;

  var groupWidth = svgWidth/1.2;
  var groupHeight = svgHeight/1.2;
  
  // Lets append svg tag with attr as created above into <div id="scatter">
  var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

  // now chart that will go inside svg box. group them together so they can be 
  // moved all at once
  var scatterChartGroup = svg.append("g")
    .attr("transform", `translate(50, ${svgHeight/20})`)

  // --------------- Loading Data
  // Since we are using d3 version 5.
  d3.csv("assets/data/data.csv").then(successCall, error);
  function error(error) {throw err;}
  // if no error run this function
  function successCall(fulldata){
    console.log(fulldata);

    // since d3.csv read everything into string, convert numbers to int
    fulldata.forEach(function(data){
      data.healthcare = +data.healthcare;
      data.smokes = +data.smokes;
      data.age = +data.age;
      data.poverty = +data.poverty;
    });
    
    // ------------------ Part I: Scatter plot Healthcare(y) vs. Poverty(x)
    
    // just for me to find our min and max of healthcare data
    var pov = fulldata.map(d => d.poverty);
    console.log(d3.extent(pov));
    // min is 9.2 so lets start x-axis from 8
    var xScale = d3.scaleLinear()
    .domain([8, d3.max(pov) + 2])
    .range([0, groupWidth])


    var hc = fulldata.map(d => d.healthcare);
    console.log(d3.extent(hc));
    var yScale = d3.scaleLinear()
    // min is 4.6
      .domain([0, d3.max(hc)])
      .range([groupHeight, 0])

    // Creating axis with our scale
    var xAxis = d3.axisBottom(xScale)
    var yAxis = d3.axisLeft(yScale)

    scatterChartGroup.append("g")
      .attr("transform", `translate(0, ${groupHeight})`)
      .call(xAxis);
    scatterChartGroup.append("g")
      .call(yAxis);

    // NOTE: scatterChartGroup consist of 3 groups x,y-axis, and chart
    var innerChartScatter = scatterChartGroup.selectAll("circle")
      .data(fulldata)
      .enter()
      .append("circle")
      .attr("cx", d => xScale(d.poverty))
      .attr("cy", d => yScale(d.healthcare))
      .attr("r", 10)
      .attr("fill", "green")
      .attr("opacity", 0.4)
      .attr("stroke", "yellow")

    // Appending text to circles
    // --------------------- Q: Any other way?
    var innerDataScatter = scatterChartGroup.selectAll()
      .data(fulldata)
      .enter()
      .append("text")
      .attr("x", d => xScale(d.poverty))
      .attr("y", d => yScale(d.healthcare) + 3) // +3 to move it down a bit.
      .style("fill", "white")
      .style("font-size", "10px")
      .style("text-anchor", "middle")
      .text(d => d.abbr) // fulldata have abbr for each city in U.S.


      // axes Labels: y-axis
      scatterChartGroup.append("text")
      .classed("aText", true)
      .attr("transform", "rotate(-90)")
      .attr("x", -(groupHeight/2))
      .attr("y", 0 - 50)
      .attr("dy", "1em")
      .attr("text-anchor", "middle")
      .text("% of people lacking HealthCare");

      // axes Labels: x-axis
      scatterChartGroup.append("text")
        .classed("aText", true) // give it a class to get style from css
        .attr("transform", `translate(${groupWidth/2}, ${groupHeight + 35 })`)
        .text("Poverty rate (%)")

  }; // end of successCall

};



responsive();
d3.select(window).on("resize", responsive);