// SHOW / HIDE PASSWORD

const togglePassword = document.getElementById("togglePassword");
const password = document.getElementById("password");

if (togglePassword) {

    togglePassword.addEventListener("click", () => {

        const type =
            password.getAttribute("type") === "password"
            ? "text"
            : "password";

        password.setAttribute("type", type);

        togglePassword.classList.toggle("fa-eye");
        togglePassword.classList.toggle("fa-eye-slash");

    });

}

// LOGIN FORM

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", (e) => {

        e.preventDefault();

        const email = document.getElementById("email").value.trim();
        const pass = document.getElementById("password").value.trim();

        if (email === "" || pass === "") {
            alert("Please fill all fields.");
            return;
        }

        // Temporary login for Phase 1

        localStorage.setItem("loggedInUser", email);

        alert("Login Successful!");

        window.location.href = "dashboard.html";

    });

}
// SIGNUP STEP 1

const signupStep1Form =
    document.getElementById("signupStep1Form");

if (signupStep1Form) {

    signupStep1Form.addEventListener("submit", (e) => {

        e.preventDefault();

        const userData = {

            firstName:
                document.getElementById("firstName").value.trim(),

            lastName:
                document.getElementById("lastName").value.trim(),

            phone:
                document.getElementById("phone").value.trim(),

            age:
                document.getElementById("age").value.trim(),

            gender:
                document.getElementById("gender").value

        };

        localStorage.setItem(
            "signupData",
            JSON.stringify(userData)
        );

        window.location.href = "signup-step2.html";

    });

}
// SIGNUP STEP 2

const signupStep2Form =
    document.getElementById("signupStep2Form");

if (signupStep2Form) {

    const toggleSignupPassword =
        document.getElementById("toggleSignupPassword");

    const signupPassword =
        document.getElementById("signupPassword");

    toggleSignupPassword.addEventListener("click", () => {

        const type =
            signupPassword.type === "password"
            ? "text"
            : "password";

        signupPassword.type = type;

        toggleSignupPassword.classList.toggle("fa-eye");
        toggleSignupPassword.classList.toggle("fa-eye-slash");
    });

    signupStep2Form.addEventListener("submit", (e) => {

        e.preventDefault();

        const email =
            document.getElementById("signupEmail").value.trim();

        const password =
            document.getElementById("signupPassword").value;

        const confirmPassword =
            document.getElementById("confirmPassword").value;

        if (password !== confirmPassword) {

            alert("Passwords do not match!");
            return;
        }

        let userData =
            JSON.parse(localStorage.getItem("signupData")) || {};

        userData.email = email;
        userData.password = password;

        localStorage.setItem(
            "signupData",
            JSON.stringify(userData)
        );

        window.location.href = "create-username.html";

    });

}
// CREATE USERNAME

const usernameForm = document.getElementById("usernameForm");

if (usernameForm) {

    usernameForm.addEventListener("submit", (e) => {

        e.preventDefault();

        const username =
            document.getElementById("username").value.trim();

        if (username.length < 4) {

            alert("Username must contain at least 4 characters.");
            return;
        }

        let userData =
            JSON.parse(localStorage.getItem("signupData")) || {};

        userData.username = username;

        localStorage.setItem(
            "signupData",
            JSON.stringify(userData)
        );

        window.location.href = "setup-pin.html";

    });

}
// SETUP PIN

const pinForm = document.getElementById("pinForm");

if (pinForm) {

    pinForm.addEventListener("submit", (e) => {

        e.preventDefault();

        const pin =
            document.getElementById("pin").value.trim();

        const confirmPin =
            document.getElementById("confirmPin").value.trim();

        if (!/^\d{4}$/.test(pin)) {

            alert("PIN must contain exactly 4 digits.");
            return;
        }

        if (pin !== confirmPin) {

            alert("PINs do not match.");
            return;
        }

        let userData =
            JSON.parse(localStorage.getItem("signupData")) || {};

        userData.pin = pin;

        // Save complete user

        localStorage.setItem(
            "user",
            JSON.stringify(userData)
        );

        // Optional: clear temporary signup data

        localStorage.removeItem("signupData");

        alert("Registration Successful!");

        window.location.href = "dashboard.html";

    });

}