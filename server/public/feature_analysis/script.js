fetch('/cm').then((res) => {
        if(!res.ok){
            console.error('error')
        }
        return res.json()
    }).then((d) => {
        const matrix=d;
        console.log(matrix);
        const labels = ['Gender', 'Company Type', 'WFH Setup Available','Mental Fatigue Score','Designation','Resource Allocaion'];

// Create the trace for the heatmap
const trace = {
  x: labels,
  y: labels,
  z: matrix,
  type: 'heatmap',
  colorscale: 'RdBu' //Jet,Portland
};

// Define the layout of the plot
const layout = {
  title: 'Confusion Matrix',
  xaxis: {
    title: 'Predicted Labels'
  },
  yaxis: {
    title: 'Actual Labels'
  }
};
// Create the plot and save it to an HTML file
Plotly.newPlot('cm', [trace], layout, { responsive: true });
}).catch((err) => {
    console.log(err);
});
window.addEventListener('load',()=>{
    anime({
        direction:'alternate',
        easing:'linear',
        loop:true,
        targets : '#bar',
        translateX:100,
    })
})