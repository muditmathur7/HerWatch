// DISPLAY USERNAME

const user =
    JSON.parse(localStorage.getItem("user"));

const usernameDisplay =
    document.getElementById("usernameDisplay");

if(user && usernameDisplay){
    usernameDisplay.textContent =
        user.firstName || "User";
}

// SOS BUTTON

const sosBtn = document.getElementById("sosBtn");

if(sosBtn){

    sosBtn.addEventListener("click", ()=>{

        alert(
            "🚨 Emergency Alert Triggered!\n\nYour trusted contacts will be notified."
        );

    });

}

// LOGOUT

const logoutBtn =
    document.getElementById("logoutBtn");

if(logoutBtn){

    logoutBtn.addEventListener("click", ()=>{

        localStorage.removeItem("loggedInUser");

        alert("Logged Out Successfully");

    });

}