function buildMetadata(sample) {

  var sampledata=`/metadata/${sample}`;
    d3.json(sampledata).then((sample) => {
      var samplemeta= d3.select("#sample-metadata");
      samplemeta.html("");
      Object.defineProperties(sample).forEach(([key,value]) => {
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
        x: colors,
        y: datafigures,
        mode: 'markers',
        marker: {size: datafigures, color: colors}
      }];
      var layout= {
        title: "Belly Button Bacteria Count",
        xaxis: {title: "OTU - ID"}
      };
      Plotly.newPlot('bubble', trace, layout);
    d3.json(datafigures).then((data) => {
      var trace1= {
        values: data.sample_values.slice(0,10),
        labels: data.otu_ids,
        type: "pie",
        hole: .5
      };
      var dataa=[trace1];
      var layout= {
        title: "Pie chart"
      };
      Plotly.newPlot('pie', dataa, layout);
    })
    })
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
