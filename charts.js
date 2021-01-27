function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var sample_values = data.sample;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultArray2 = data.metadata.filter(sampleObj => sampleObj.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var firstSample = resultArray2[0];
  
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var resultArray3 = data.samples.filter(sampleObj => sampleObj.id == sample)[0];
    
    var otu = resultArray3.otu_ids.slice(0,10).reverse()
    var otu2 = resultArray3.otu_ids

    var samples1 = resultArray3.sample_values.slice(0,10).reverse()
    var samples2 = resultArray3.sample_values
    var labels2 = resultArray3.otu_labels

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    // var yticks = 

    // 8. Create the trace for the bar chart. 
    var trace = {
      x: samples1, 
      y: otu.map(d => `OTUID ${d}`),
      type: "bar",
      orientation : "h"
    }
    var data = [trace];
    // // 9. Create the layout for the bar chart. 
    var layout = {
      title: "Top 10 Bacteria Cultures Found"   
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", data, layout);

    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: otu2,
      y: samples2,
      text: labels2,
      mode: "markers",
      marker: {color:otu2, size:samples2}
    }];

    // 2. Create the layout for the bubble chart.
   var bubbleDataLayout = {
     title: "Bacteria Cultures per sample",
     xaxis: { title: "OTU ID" },
     
   };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleDataLayout );
    });
}
