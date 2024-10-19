// Splash screen functionality
window.onload = function() {
    // Splash screen fade out after 2 seconds
    setTimeout(() => {
      document.getElementById('splash').style.display = 'none';
      document.getElementById('mainContent').style.display = 'flex';
    }, 2000);
  
    // Redirect to the signup page (Step 1) on "Sign Up" button click
    document.getElementById('signUpButton').addEventListener('click', () => {
      window.location.href = 'signup-step1.html'; // First sign-up page (Step 1)
    });

    // Redirect to the login page on "Log In" button click
    document.getElementById('loginButton').addEventListener('click', () => {
        window.location.href = 'login.html'; // Redirect to login page
      });
  };
  
  // Validation and navigation between forms
  
  // Sign Up Step 1 - Email and OTP Validation
  document.getElementById('form-step-1').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const otp = document.getElementById('otp').value;
  
    // Validate email and OTP
    if (validateEmail(email) && otp !== '') {
      window.location.href = 'signup-step2.html'; // Redirect to Step 2
    } else {
      alert('Please enter a valid email and OTP.');
    }
  });
  
  // Validate email format
  function validateEmail(email) {
    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return re.test(email);
  }
  
  // Sign Up Step 2 - Personal Information Validation
  document.getElementById('form-step-2').addEventListener('submit', function(event) {
    event.preventDefault();
  
    const firstName = document.getElementById('first-name').value;
    const lastName = document.getElementById('last-name').value;
    const age = document.getElementById('age').value;
    const phone = document.getElementById('phone').value;
  
    // Validate all fields are filled
    if (firstName !== '' && lastName !== '' && age !== '' && phone !== '') {
      window.location.href = 'create-username.html'; // Redirect to Create Username page
    } else {
      alert('Please fill in all fields.');
    }
  });
  
  // OTP send functionality (Step 2)
  document.getElementById('send-otp').addEventListener('click', function() {
    alert('OTP sent to your phone number!');
  });
  
  // Create Username - Final Step
  function validateForm() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
  
    // Check if username and password are filled
    if (!username || !password) {
      alert("All fields are mandatory!");
      return false;
    }
    
    // alert('Account created successfully!');
    // return true;
  }
