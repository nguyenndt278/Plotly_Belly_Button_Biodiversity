function buildMetadata(sample) {

  var sampledata=`/metadata/${sample}`;
    d3.json(sampledata).then((sample) => {
      var samplemeta= d3.select("#sample-metadata");
      samplemeta.html("");
      Object.entries(sample).forEach(([key,value]) => {
        var row= samplemeta.append("p");
        row.text(`${key}: ${value}`)})
      });
    }

function buildCharts(sample) {
  var plotdata= `/samples/${sample}`;
    d3.json(plotdata).then((data) => {
      var datafigures= data.sample_values;
      var colors= data.otu_ids;
      var trace=[{
        x: data.otu_ids,
        y: data.sample_values,
        mode: 'markers',
        marker: {size: datafigures, color: colors}
      }];
      var layout= {
        title: "Belly Button Bacteria Count",
        xaxis: {title: "OTU - ID"}
      };
      Plotly.newPlot('bubble', trace, layout);

      var top_ids = data.otu_ids.slice(0,10);
      var top_values = data.sample_values.slice(0,10);
      var trace1 = [{
      labels: top_ids, 
      values: top_values,
      type: "pie"
    }];
      var layout_pie= {
        title: "Pie chart"
      };
      Plotly.newPlot('pie', trace1, layout_pie);
    });
    }

function init() {
  var selector = d3.select("#selDataset");
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  buildCharts(newSample);
  buildMetadata(newSample);
}

init();
