function validateForm() {
  console.log("validating form");
  
  // Get the form data using FormData
  const form = document.querySelector('form');
  console.log("tseifbdfjglkdjfg")
  const formData = new FormData(form);
  
  // Get the username and password fields from the form data
  const username = formData.get('username');
  const password = formData.get('password');
  
  // Check if the fields are empty
  if (username === "" || password === "") {
    alert("Please fill in all fields.");
    return;
  }
  const response = axios.post("https://01.gritlab.ax/api/auth/signin", {},
      {
        auth: {
          username: username,
          password: password
        },
        headers: {
          'Content-type': 'application/json'
        }
      }).then(function (response) {
      var token = response.data;
      // Store the token in local storage
      localStorage.setItem('jwt', token);
      // Redirect to the home page
      console.log("redirecting to home page");
     window.location.href = './home.html';
    })
    .catch(function (error) {
      console.log(error);
      alert(error)
    });

}
let form = document.querySelector('form');
form.addEventListener("submit", function (event) {
  event.preventDefault();
  validateForm();
});
// 
console.log("hello world");