document.addEventListener("DOMContentLoaded", () => {
    loadPetRequestCounts();
});

/* ------------------------------------------
   1) LOAD PET REQUEST COUNTS
------------------------------------------- */
async function loadPetRequestCounts() {
    try {
        const response = await fetch("http://localhost:8081/api/userform/admin/pet-requests");

        if (!response.ok) {
            throw new Error("Failed to fetch pet request counts");
        }

        const data = await response.json();

        const container = document.querySelector("#petList");
        container.innerHTML = "";

        if (data.length === 0) {
            container.innerHTML = "<p>No pets found.</p>";
            return;
        }

        // Load each row
        data.forEach(async (petCount) => {
            // Fetch pet details
            const petResponse = await fetch(`http://localhost:8081/api/pets/${petCount.petId}`);
            const pet = await petResponse.json();

            const card = document.createElement("div");
            card.classList.add("pet-card");

            card.innerHTML = `
                <img src="${pet.image ? `http://localhost:8081${pet.image}` : 'images/placeholder.jpg'}" width="150">
                <h3>${pet.name}</h3>
                <p><strong>Requests:</strong> ${petCount.count}</p>
                <button onclick="viewRequests(${pet.id})">View Requests</button>
            `;

            container.appendChild(card);
        });

    } catch (err) {
        console.error(err);
        alert("❌ Error loading data. Please try again.");
    }
}

/* ------------------------------------------
   2) VIEW ALL REQUESTS FOR ONE PET
------------------------------------------- */
async function viewRequests(petId) {
    try {
        console.log("Requesting petId:", petId);
        const response = await fetch(`http://localhost:8081/api/userform/admin/pet/${petId}/requests`);

        if (!response.ok) {
            throw new Error("Failed to load adoption requests");
        }

        const requests = await response.json();
            console.log("Response:", requests);

        const container = document.querySelector("#requestList");
        container.innerHTML = ""; // clear previous

        if (requests.length === 0) {
            container.innerHTML = `<p>No adoption requests yet for this pet.</p>`;
            return;
        }

        // Display each applicant
        requests.forEach(r => {
            const card = document.createElement("div");
            card.classList.add("request-card");

            card.innerHTML = `
                <h3>${r.firstName} ${r.lastName}</h3>
                <p><strong>Email:</strong> ${r.email}</p>
                <p><strong>Phone:</strong> ${r.phone}</p>
                <p><strong>Status:</strong> ${r.status}</p>

                <button onclick="approveRequest(${r.id})" class="approve-btn">Approve</button>
                <button onclick="rejectRequest(${r.id})" class="reject-btn">Reject</button>
            `;

            container.appendChild(card);
        });

    } catch (err) {
        console.error(err);
        alert("❌ Could not load request list.");
    }
}

/* ------------------------------------------
   3) APPROVE REQUEST
------------------------------------------- */
async function approveRequest(formId) {
    const admin = JSON.parse(localStorage.getItem("user"));
    if (!admin || admin.role !== "ADMIN") {
        alert("❌ Only admins can approve.");
        return;
    }

    const response = await fetch(`http://localhost:8081/api/userform/${formId}/status`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "X-USER-ID": admin.id
        },
        body: JSON.stringify({ status: "APPROVED" })
    });

    if (!response.ok) {
        alert("❌ Failed to approve request.");
        return;
    }

    alert("✅ Request approved!");
    loadPetRequestCounts();
}

/* ------------------------------------------
   4) REJECT REQUEST
------------------------------------------- */
async function rejectRequest(formId) {
    const admin = JSON.parse(localStorage.getItem("user"));
    if (!admin || admin.role !== "ADMIN") {
        alert("❌ Only admins can reject.");
        return;
    }

    const response = await fetch(`http://localhost:8081/api/userform/${formId}/status`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "X-USER-ID": admin.id
        },
        body: JSON.stringify({ status: "REJECTED" })
    });

    if (!response.ok) {
        alert("❌ Failed to reject request.");
        return;
    }

    alert("❌ Request rejected.");
    loadPetRequestCounts();
}
