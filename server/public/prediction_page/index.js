  function get(str) {
    return [str, document.getElementById(str).value];
  }

  function update_input_object(str, value) {
    if (str === 'dsgn' || str === 'ral' || str === 'fsc') {
      input_obj[mp[str]] = parseInt(value);
    } else {
      input_obj[mp[str]] = value;
    }
    //console.log(input_obj);
  }
  let run_count=0
  function update_slider(str){
    const slider = document.getElementById(str);
    const display = document.getElementById(str + "_display");
    display.value = slider.value;
  }
  const input_obj = {
    'Gender': 'Male',
    'Company Type': 'Service',
    'WFH Setup Available': 'No',
    'Designation': 0,
    'Resource Allocation': 0,
    'Mental Fatigue Score' : 0
  };
  const output_obj = {
    'outputValue' : 0.00
  }
  const mp = {
    'M': 'Gender',
    'F': 'Gender',
    'srvc': 'Company Type',
    'pdt': 'Company Type',
    'wfhy': 'WFH Setup Available',
    'wfhn': 'WFH Setup Available',
    'dsgn': 'Designation',
    'ral': 'Resource Allocation',
    'fsc' : 'Mental Fatigue Score'
  };
  const form = document.getElementById('input_data_form');
  let submitClicked = false;
  form.addEventListener('submit', (event) => {
    submitClicked=true
    document.getElementById('no-run').innerText=''
    
    event.preventDefault();
    fetch('/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(input_obj)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        document.getElementById('result').innerHTML=''
        return response.json()
      })
      .then((out)=>{
        console.log(out)
          document.getElementById('sres').innerText=out['res']
      })
      .catch(error => {
        console.error('There was a problem saving the data:', error);
      });
  });
  const runButton = document.getElementById('run-btn');
  const resdiv = document.getElementById('result')
  const rdot  = document.getElementById('rdot')
  const rtext = document.getElementById('run-text')
  const resultText = document.getElementById('st-result')
  let animation = undefined
if (runButton) {
  runButton.addEventListener('click', () =>{
    // Code to execute when the button is clicked
    if(!submitClicked){
        document.getElementById('no-run').innerText='Please submit the data before clicking run'
    }else{
      submitClicked=false
      document.getElementById('sres').innerText=''
      if(resdiv.style.display===''){
      resdiv.style.display='block'
      rtext.style.display='block'
      rdot.style.display='block'
      }
      else{
        rtext.style.display='block'
        rdot.style.display='block'
      }
      animation=anime({
        targets:'#rdot',
        easing:'linear',
        loop:true,
        direction:'alternate',
        translateX:200,
      })
      fetch('/run-python-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body:JSON.stringify(input_obj)
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        console.log('Python script executed successfully');
        rtext.style.display='none'
        rdot.style.display='none'
        return response.json()
      }).then((out)=>{
          let res1=''
          
          if(out.outputValue >= 0.0 && out.outputValue <= 0.3){
               res1 = 'Low'
          } 
          else if(out.outputValue > 0.3 && out.outputValue <= 0.7){
            res1= 'Moderate' //</h3></h3><br><h3>Based on this classification, you can use the following mitigation strategies:</h3><br>'
            //console.log(res1)
          }
          else if(out.outputValue >0.7 && out.outputValue <=1.0){
            res1='Extreme'
          }
          resdiv.innerHTML += `<h3 class="st-res1">The Predicted Stress Levels for the given Employee Data is : <span id="stress_output">${res1}</span><span id="emoji"></span></h3>`
          resdiv.innerHTML += '<h3 class="mstr">Based on this classification, you can use the following mitigation strategies:</h3><br>'
          if(res1 === 'Low'){
            document.getElementById('stress_output').style.color='green'
            document.getElementById('emoji').innerText=`😃 ${out.outputValue*100}%`
            resdiv.innerHTML +='<ul><li>There is no immediate action necessary, CONGRATULATIONS...</li></ul>'
          }
          else if(res1==='Moderate'){
            document.getElementById('stress_output').style.color='orangered'
            document.getElementById('emoji').innerText=`🙁 ${out.outputValue*100}%`
            resdiv.innerHTML +='<ul><li>Incorporate balancing mechanisims in the company structure, like sports or meditation</li><li>Offer Time management workshops to help employees manage their timetables</li></ul><br>'
          }else if(res1 === 'Extreme'){
            document.getElementById('stress_output').style.color='red'
            document.getElementById('emoji').innerText=`🤕 ${out.outputValue *100}%`
            resdiv.innerHTML += '<ul><li>Reduce workload for the individual employee </li><li>Offer team building workshops to help employees raise their voice before burning out of stress</li></ul><br>'
          }
          animation.pause()
        }).catch((err)=>{
          console.log(err)
        })
      }
  })
}     
else {
console.error('Could not find the run button.');
}
