const input_obj = {
  'username' : undefined,
  'password' :undefined,
  'email':undefined,
  'gender':undefined
}
const container = document.querySelector(".container"),
      pwShowHide = document.querySelectorAll(".showHidePw"),
      pwFields = document.querySelectorAll(".password"),
      signUp = document.querySelector(".signup-link"),
      login = document.querySelector(".login-link");

//   js code to show/hide password and change icon
pwShowHide.forEach(eyeIcon =>{
        eyeIcon.addEventListener("click", ()=>{
            pwFields.forEach(pwField =>{
                if(pwField.type ==="password"){
                    pwField.type = "text";

                    pwShowHide.forEach(icon =>{
                        icon.classList.replace("uil-eye-slash", "uil-eye");
                    })
                }else{
                    pwField.type = "password";

                    pwShowHide.forEach(icon =>{
                        icon.classList.replace("uil-eye", "uil-eye-slash");
                    })
                }
            }) 
        })
    })

    // js code to appear signup and login form
    signUp.addEventListener("click", ()=>{
        container.classList.add("active");
    });
    login.addEventListener("click", ()=>{
        container.classList.remove("active");
    });
const sup_btn = document.getElementById('signup_form')
const sin_btn = document.getElementById('login_form')
sup_btn.addEventListener('submit', (event) =>{
  const responseElem = document.getElementById('server-responseR');
    event.preventDefault()
    //console.log('entered login fetch')
    fetch('/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(input_obj)
      }).then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json()
        
      }).then(output => {
        const message = output.data;
        responseElem.textContent = message
    }).then((res) =>{
      if(res.ok){
        responseElem.textContent=''
      }
    })
      .catch(error => {
        console.error('There was a problem siging up', error);
      });
})
sin_btn.addEventListener('submit', (event) =>{
    event.preventDefault()
    fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(input_obj)
  
      }).then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json()
      }).then(output => {
        const message = output.data;
        const responseElem = document.getElementById('server-responseL');
        responseElem.textContent = message
        //document.body.appendChild(responseElem); // add element to the webpage
      
    })
    .catch(error => {
        console.error('There was a problem loging in', error);
    });
})