const btn = document.getElementById('getData')
function get(df,y){
  return [
  df.filter(item => item['Gender'] === 'Male').reduce((acc, item) => acc + parseFloat(item[y]), 0),
  df.filter(item => item['Gender'] === 'Female').reduce((acc, item) => acc + parseFloat(item[y]), 0) 
]
}
btn.addEventListener('click',()=>{
    fetch('/dataset').then((res)=>{
      if(!res.ok){
        console.error('Error from server while requesting dataset')
      }
      return res.json()
    }).then((jsondata)=>{
      flag=true
      const y_axis= document.getElementById('gselect').value
      const total_value = 11040
      const m=jsondata.filter(item => item['Gender'] === 'Male').length
      const f=jsondata.filter(item => item['Gender'] === 'Female').length
        const values = jsondata.map(datum => datum['Gender']); // replace "columnName" with the actual name of the column in your dataset
        const trace = {
        x: values,
        type: 'histogram'
    };
    //let x=jsondata.filter(item => item['Gender'] === 'Male').reduce((acc, item) => acc + parseFloat(item['AvgDailyHours']), 0) / jsondata.filter(item => item['Gender'] === 'Male').length
    //console.log(x.length)
    const hist_layout = {
      title: 'Histogram for Gender distribution',
      font:{size:18}
    };
    var hist_data = [ trace ];
    var config = {responsive: true}
    const bar_trace = {
        x: ['Male', 'Female'], // X axis data
        y: [jsondata.filter(item => item['Gender'] === 'Male').reduce((acc, item) => acc + parseFloat(item[y_axis]), 0) / m,
        jsondata.filter(item => item['Gender'] === 'Female').reduce((acc, item) => acc + parseFloat(item[y_axis]), 0) /f,
      ],
        type: 'bar', // Set chart type as bar
      };
      const bar_data = [bar_trace];
      
      const bar_layout = {
        title: `${y_axis} by Gender`,
        xaxis: {
          title: 'Gender',
        },
        yaxis: {
          title: y_axis,
        },
        color:'blue',
        barmode:'group',
        width:500
      };
      var pie_data = [{
        values: get(jsondata,y_axis),
        labels: ['Male', 'Female'],
        type: 'pie'
      }];
      var pie_layout = {
        title: `Gender Distribution for ${y_axis}`,
        height: 400,
        width: 500
      };
      
      Plotly.newPlot('plot' , hist_data, hist_layout,config);
      Plotly.newPlot('pie', pie_data, pie_layout,config);
      Plotly.newPlot('bar' , bar_data, bar_layout,config);
    }).catch((err)=>{
        console.log(err)
    })  
})