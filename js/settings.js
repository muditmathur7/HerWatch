// DARK MODE

const darkToggle =
    document.getElementById("darkModeToggle");

if (darkToggle) {

    darkToggle.addEventListener("change", () => {

        document.body.classList.toggle("dark-mode");

        localStorage.setItem(
            "darkMode",
            document.body.classList.contains("dark-mode")
        );

    });

}

// LOAD DARK MODE

if (localStorage.getItem("darkMode") === "true") {

    document.body.classList.add("dark-mode");

    if (darkToggle)
        darkToggle.checked = true;
}

// ABOUT BUTTON

const aboutBtn = document.getElementById("aboutBtn");
const aboutCard = document.getElementById("aboutCard");

if (aboutBtn && aboutCard) {

    aboutCard.style.display = "none";

    aboutBtn.addEventListener("click", () => {

        if (aboutCard.style.display === "none") {
            aboutCard.style.display = "block";
        } else {
            aboutCard.style.display = "none";
        }

    });

}

// LOGOUT

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener("click", () => {

        localStorage.removeItem("loggedInUser");

        alert("Logged Out Successfully");

    });

}