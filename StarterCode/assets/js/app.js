// @TODO: YOUR CODE HERE!
var file = "assets/data/data.csv"
// Since we are using d3 version 5.
d3.csv(file).then(successHandle, errorHandle);

// Use error handling function to append data and SVG objects
// If error exist it will be only visible in console
function errorHandle(error) {
  throw err;
}

// Function takes in argument statesData
function successHandle(statesData) {
    console.log(statesData);
};


// ---------------------- Part I: Scatter plot Healthcare vs. Poverty 