function validateForm() {
  console.log("validating form");
  var username = document.forms["loginForm"]["username"].value;
  var password = document.forms["loginForm"]["password"].value;
  if (username == "" || password == "") {
    alert("Please fill in all fields.");
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
      homePage();
     //window.location.href = '/home.html';


    })
    .catch(function (error) {
      alert(error)
    });

}
let form = document.querySelector('form');
form.addEventListener("submit", function (event) {
  event.preventDefault();
  validateForm();
});
// 
function homePage() {
  /*   document.getElementById("text").innerHTML = "Welcome to the home page";
   */
  const token = localStorage.getItem('jwt');

  console.log(token);
  // Construct the GraphQL query
  const query = `
{
  user {
    id
    login
  }
}
`;

  // Send the GraphQL query to the endpoint
  axios.post('https://01.gritlab.ax/api/graphql-engine/v1/graphql', {
      query
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      // Handle the response
      console.log(response);
      console.log(response["data"]["data"]["user"][0]["login"]);
    })
    .catch(error => {
      // Handle the error
      console.error(error);
    });
}