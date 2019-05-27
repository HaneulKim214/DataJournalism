function responsive(){
  // If you don't have this it will create multiple svg
  var svgArea = d3.select("body").select("svg");
  // remove if there is already svg
  if (!svgArea.empty()) {
    svgArea.remove();}

  // ------------ Now time to create our new svg that is responsive
  var svgWidth = window.innerWidth;
  var svgHeight = window.innerHeight/1.5;

  var groupWidth = svgWidth/1.3;
  var groupHeight = svgHeight/1.3;

  // Lets append svg tag with attr as created above into <div id="scatter">
  var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

  // now chart that will go inside svg box. group them together so they can be 
  // moved all at once
  var scatterChartGroup = svg.append("g")
    .attr("transform", `translate(100, ${svgHeight/20})`)

  // -------------- Setting initial data
  var CurrentXLabel = "poverty"; // need to be name of key so it can be called in changeXscale function 
  var CurrentYLabel = "healthcare";

  // ------------ Function for changing x-Axis label scale
  function changeXscale(fulldata, clicked_xLabel){
    var xArray = fulldata.map(d => d[clicked_xLabel]);
    // Creating new scale with data that corresponds to clicked Label
    console.log(fulldata, clicked_xLabel, xArray);
    var newXscale = d3.scaleLinear()
      .domain([d3.min(xArray) * 0.8 , d3.max(xArray * 1.2)]) // since we don't want our first and last point to be at very end.
      .range([0, groupHeight]);

    return newXscale;
  }

  function changeXAxis(clicked_xScale, xAxis) {
    // when this function is called transition current to new axis
    xAxis.transition()
      .duration(1000)
      .call(d3.axisBottom(clicked_xScale)) //new one with new scale
  };

  // --------------- Loading Data
  // Since we are using d3 version 5.
  d3.csv("assets/data/data.csv").then(successCall, error);
  function error(error) {throw err;}
  // if no error run this function
  function successCall(fulldata){

    // since d3.csv read everything into string, convert numbers to int
    fulldata.forEach(function(data){
      // y-axes
      data.obesity = +data.obesity;
      data.smokes = +data.smokes;
      data.healthcare = +data.healthcare;

      // goes in x-axes
      data.poverty = +data.poverty;
      data.age = +data.age;
      data.income = +data.income;
    });
    
    // ------------------ Setting Inital scale, axis, circles, and Text on circles
    var xScale = changeXscale(fulldata, CurrentXLabel);
    console.log(xScale(fulldata[1][CurrentXLabel]));

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
      .attr("cx", d => xScale(d[CurrentXLabel]))
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
      .attr("x", d => xScale(d[CurrentXLabel]))
      .attr("y", d => yScale(d.healthcare) + 3) // +3 to move it down a bit.
      .style("fill", "white")
      .style("font-size", "10px")
      .style("text-anchor", "middle")
      .text(d => d.abbr) // fulldata have abbr for each city in U.S.

    // ----------- group for all three x-axes labels
    var xAxesGroup = scatterChartGroup.append("g")
      .attr("transform", `translate(${groupWidth/2}, ${groupHeight + 35 })`);
    
    // add x-axis label to xAxesGroup, assign it to name so it can be called
    var xLabelPoverty = xAxesGroup.append("text")
      .classed("aText", true) // give it a class to get style from css
      .attr("value", "poverty")
      .text("Poverty rate (%)")
    
    var xLabelAge = xAxesGroup.append("text")
      .classed("aText", true) // give it a class to get style from css
      .attr("y", 25)
      .attr("value", "age")
      .text("Age (Median)")

    var xLabelIncome = xAxesGroup.append("text")
      .classed("aText", true) // give it a class to get style from css
      .attr("y", 50)
      .attr("value", "income")
      .text("Household Income (Median)")
    
    // ------------ group all y-axes labels
    var yAxesGroup = scatterChartGroup.append("g")
      .attr("transform", `translate(0,${groupHeight/2})`);

    var yLabelHealth = yAxesGroup.append("text")
      .classed("aText", true)
      .attr("transform", "rotate(-90)")
      .attr("y", -25)
      .attr("value", "healthcare") // so it can be reached on event listener
      .text("population lacking HealthCare (%)")
    var yLabelSmoke = yAxesGroup.append("text")
      .classed("aText", true)
      .attr("transform", "rotate(-90)")
      .attr("y", -50)
      .attr("value", "smokes")
      .text("Smoking population (%)")
    var yLabelObese = yAxesGroup.append("text")
      .classed("aText", true)
      .attr("transform", "rotate(-90)")
      .attr("y", -75)
      .attr("value", "obesity")
      .text("Obese (%)")

    // // axes Labels: y-axis
    // scatterChartGroup.append("text")
    //   .classed("aText", true)
    //   .attr("transform", "rotate(-90)")
    //   .attr("x", -(groupHeight/2))
    //   .attr("y", 0 - 50)
    //   .attr("dy", "1em")
    //   .attr("text-anchor", "middle")
    //   .text("% of people lacking HealthCare");

    // Event listener for xAxes labels
    xAxesGroup.selectAll("text").on("click", function(){ // run this function when any xAxes label clicked
      var clicked_xLabel = d3.select(this).attr("value");
      if (clicked_xLabel != CurrentXLabel){
        console.log(`You've clicked ${clicked_xLabel}`)

        // now clicked axis become current one.
        CurrentXAxis = clicked_xLabel;
        // updating xScale, xAxis, Circles, and text
        var clicked_xScale = changeXscale(fulldata, clicked_xLabel);

        var clicked_XAxis = changeXAxis(clicked_xScale, xAxis);
      }
    });
  }; // end of successCall

};



responsive();
d3.select(window).on("resize", responsive);