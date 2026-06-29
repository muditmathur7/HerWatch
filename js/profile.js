const user = JSON.parse(localStorage.getItem("user"));

if(user){

    document.getElementById("profileName").textContent =
        `${user.firstName} ${user.lastName}`;

    document.getElementById("profileUsername").textContent =
        user.username || "-";

    document.getElementById("profileEmail").textContent =
        user.email || "-";

    document.getElementById("profilePhone").textContent =
        user.phone || "-";

    document.getElementById("profileAge").textContent =
        user.age || "-";

    document.getElementById("profileGender").textContent =
        user.gender || "-";

}