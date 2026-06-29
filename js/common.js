const contactForm = document.getElementById("contactForm");
const contactsList = document.getElementById("contactsList");

if (contactForm) {

    displayContacts();

    contactForm.addEventListener("submit", (e) => {

        e.preventDefault();

        let contacts =
            JSON.parse(localStorage.getItem("contacts")) || [];

        if (contacts.length >= 5) {
            alert("Maximum 5 emergency contacts allowed.");
            return;
        }

        const name =
            document.getElementById("contactName").value.trim();

        const phone =
            document.getElementById("contactPhone").value.trim();

        contacts.push({
            id: Date.now(),
            name,
            phone
        });

        localStorage.setItem(
            "contacts",
            JSON.stringify(contacts)
        );

        contactForm.reset();

        displayContacts();

    });

}

function displayContacts() {

    if (!contactsList) return;

    let contacts =
        JSON.parse(localStorage.getItem("contacts")) || [];

    contactsList.innerHTML = "";

    if (contacts.length === 0) {

        contactsList.innerHTML =
            `<div class="activity-card">
                No emergency contacts added yet.
             </div>`;

        return;
    }

    contacts.forEach(contact => {

        contactsList.innerHTML += `
            <div class="contact-card">

                <div>
                    <h3>${contact.name}</h3>
                    <p>${contact.phone}</p>
                </div>

                <button
                    class="delete-btn"
                    onclick="deleteContact(${contact.id})">

                    Delete

                </button>

            </div>
        `;
    });

}

function deleteContact(id){

    let contacts =
        JSON.parse(localStorage.getItem("contacts")) || [];

    contacts =
        contacts.filter(contact => contact.id !== id);

    localStorage.setItem(
        "contacts",
        JSON.stringify(contacts)
    );

    displayContacts();

}
// REPORTS

const reportForm = document.getElementById("reportForm");
const reportsList = document.getElementById("reportsList");

if (reportForm) {

    displayReports();

    reportForm.addEventListener("submit", (e) => {

        e.preventDefault();

        let reports =
            JSON.parse(localStorage.getItem("reports")) || [];

        const report = {
            id: Date.now(),
            type: document.getElementById("incidentType").value,
            location: document.getElementById("incidentLocation").value,
            description: document.getElementById("incidentDescription").value,
            date: new Date().toLocaleString()
        };

        reports.push(report);

        localStorage.setItem(
            "reports",
            JSON.stringify(reports)
        );

        reportForm.reset();

        displayReports();

    });

}

function displayReports() {

    if (!reportsList) return;

    let reports =
        JSON.parse(localStorage.getItem("reports")) || [];

    reportsList.innerHTML = "";

    if (reports.length === 0) {

        reportsList.innerHTML = `
            <div class="activity-card">
                No reports submitted yet.
            </div>
        `;

        return;
    }

    reports.reverse().forEach(report => {

        reportsList.innerHTML += `
            <div class="report-card">

                <h3>${report.type}</h3>

                <p><strong>Location:</strong>
                ${report.location}</p>

                <p>${report.description}</p>

                <small>${report.date}</small>

                <button class="delete-btn"
                        onclick="deleteReport(${report.id})">
                    Delete
                </button>

            </div>
        `;
    });

}

function deleteReport(id){

    let reports =
        JSON.parse(localStorage.getItem("reports")) || [];

    reports =
        reports.filter(report => report.id !== id);

    localStorage.setItem(
        "reports",
        JSON.stringify(reports)
    );

    displayReports();

}