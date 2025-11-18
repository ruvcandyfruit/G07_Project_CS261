// --- Redirect ถ้าไม่ใช่ ADMIN ---
(function enforceAdmin() {
  try {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!user || user.role !== 'ADMIN') {
      window.location.href = '/index.html';
    }
  } catch (_) {
    window.location.href = '/index.html';
  }
})();

document.addEventListener('DOMContentLoaded', () => {

    // -------------------------------
    // 1. Read Pet ID From Query Params
    // -------------------------------
    const urlParams = new URLSearchParams(window.location.search);
    const petId = urlParams.get('id') || urlParams.get('pet_id');

    // -------------------------------
    // 2. DOM ELEMENTS
    // -------------------------------
    const petImageEl = document.getElementById('petImage');
    const petNameDisplayEl = document.getElementById('petNameDisplay');
    const statusValueEl = document.getElementById('statusValue');
    const deleteBtn = document.getElementById('deleteBtn');
    const editBtn = document.getElementById('editBtn');
    const backBtn = document.getElementById('backBtn');

    // Pet info
    const petIDEl = document.getElementById('petID');
    const petNameEl = document.getElementById('petName');
    const petTypeEl = document.getElementById('petType');
    const petGenderEl = document.getElementById('petGender');
    const petBreedEl = document.getElementById('petBreed');
    const petAgeEl = document.getElementById('petAge');
    const petSterilizationEl = document.getElementById('petSterilization');
    const petVaccineEl = document.getElementById('petVaccine');
    const petDiseaseEl = document.getElementById('petDisease');
    const petFoodAllergyEl = document.getElementById('petFoodAllergy');

    // Owner info
    const ownerInfoSection = document.getElementById('ownerInfoSection');
    const noOwnerMessage = document.getElementById('noOwnerMessage');

    const ownerFirstname = document.getElementById('ownerFirstname');
    const ownerLastname = document.getElementById('ownerLastname');
    const ownerDob = document.getElementById('ownerDob');
    const ownerPhone = document.getElementById('ownerPhone');
    const ownerEmail = document.getElementById('ownerEmail');
    const ownerOccupation = document.getElementById('ownerOccupation');
    const ownerAddress = document.getElementById('ownerAddress');
    const ownerResidenceType = document.getElementById('ownerResidenceType');
    const ownerExperience = document.getElementById('ownerExperience');
    const ownerReason = document.getElementById('ownerReason');

    // Delete modal
    const deleteModal = document.getElementById('deleteModal');
    const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');

    let CURRENT_PET_ID = null;

    // -------------------------------
    // 3. Helper - Age Calculator
    // -------------------------------
    function calculateAge(dobString) {
        if (!dobString) return "N/A";
        const dob = new Date(dobString);
        const diff = Date.now() - dob.getTime();
        return Math.abs(new Date(diff).getUTCFullYear() - 1970);
    }

    function showModal(m) { m.classList.remove("modal-hidden"); }
    function hideModal(m) { m.classList.add("modal-hidden"); }

    // -------------------------------
    // 4. Populate PET Information
    // -------------------------------
    function populatePetInfo(pet) {

        const finalImageUrl = pet.image
            ? `http://localhost:8081${pet.image}`
            : "images/placeholder.jpg";

        petImageEl.innerHTML = `<img src="${finalImageUrl}" alt="${pet.name}">`;

        petNameDisplayEl.textContent = pet.name;

        const status = pet.status ? pet.status.toUpperCase() : "NO_FORM";
        statusValueEl.textContent = status;
        statusValueEl.className = `status-value ${status.toLowerCase()}`;

        const idField = pet.id || pet.petID;

        petIDEl.textContent = `รหัสประจำตัว : ${idField}`;
        petNameEl.textContent = `ชื่อ : ${pet.name}`;
        petTypeEl.textContent = `ชนิด : ${pet.type}`;
        petGenderEl.textContent = `เพศ : ${pet.gender}`;
        petBreedEl.textContent = `สายพันธุ์ : ${pet.breed}`;
        petAgeEl.textContent = `อายุ : ${calculateAge(pet.dob)} ปี`;
        petSterilizationEl.textContent = `การทำหมัน : ${pet.sterilisation ? "ทำแล้ว" : "ยังไม่ทำ"}`;
        petVaccineEl.textContent = `การฉีดวัคซีน : ${pet.vaccine ? "ครบ" : "ไม่ครบ"}`;
        petDiseaseEl.textContent = `โรคประจำตัว : ${pet.disease || "ไม่มี"}`;
        petFoodAllergyEl.textContent = `แพ้อาหาร : ${pet.foodAllergy || "ไม่มี"}`;
    }

    // -------------------------------
    // 5. Populate OWNER Info
    // -------------------------------
    function populateOwnerInfo(owner) {
        ownerFirstname.textContent = owner.firstName || owner.firstname;
        ownerLastname.textContent = owner.lastName || owner.lastname;
        ownerDob.textContent = owner.dob || owner.birthdate;
        ownerPhone.textContent = owner.phone;
        ownerEmail.textContent = owner.email;
        ownerOccupation.textContent = owner.occupation;
        ownerAddress.textContent = owner.address;
        ownerResidenceType.textContent = owner.residenceType;
        ownerExperience.textContent = owner.experience || owner.petExperience;
        ownerReason.textContent = owner.reason || owner.adoptionReason;
    }

    // -------------------------------
    // 6. MAIN LOADING LOGIC
    // -------------------------------
    async function loadData(petId) {
        if (!petId) {
            alert("Pet ID not found");
            window.location.href = "allpet.html";
            return;
        }

        CURRENT_PET_ID = petId;

        try {
            // -------- Load PET --------
            const petRes = await fetch(`http://localhost:8081/api/pets/${petId}`);
            if (!petRes.ok) {
                console.error("Pet API error:", petRes.status, petRes.statusText);
                alert("Pet not found");
                window.location.href = "allpet.html";
                return; 
            }
            const pet = await petRes.json();
            pet.dob =
                pet.birthDate ||
                pet.birthdate ||
                pet.dob ||
                null;

            try {
                populatePetInfo(pet);
            } catch (err) {
                console.error("Error rendering pet info:", err);
            }

            // -------- Load related forms (adoption requests) --------
            const reqRes = await fetch(`http://localhost:8081/api/userform/admin/pet/${petId}`);
            if (!reqRes.ok) {
                console.warn("No adoption forms found.");
                noOwnerMessage.classList.remove("hidden");
                return; // not a fatal error—just no owner
            }
            const requests = await reqRes.json();

            const approved = requests.find(r =>
                r.status === "APPROVED" || r.status === "COMPLETED"
            );

            if (approved) {
                populateOwnerInfo(approved);
                ownerInfoSection.classList.remove("hidden");
            } else {
                noOwnerMessage.classList.remove("hidden");
            }

        } catch (err) {
            console.error(err);
            alert("Failed to load pet data");
        }
    }

    // -------------------------------
    // 7. BUTTON EVENTS
    // -------------------------------
    editBtn.addEventListener("click", () => {
        if (CURRENT_PET_ID)
            window.location.href = `addpet.html?mode=edit&id=${CURRENT_PET_ID}`;
    });

    backBtn.addEventListener("click", () => {
        window.location.href = "allpet.html";
    });

    deleteBtn.addEventListener("click", () => showModal(deleteModal));

    cancelDeleteBtn.addEventListener("click", () => hideModal(deleteModal));

    confirmDeleteBtn.addEventListener("click", async () => {
        if (!CURRENT_PET_ID) return;

        try {
            await fetch(`http://localhost:8081/api/pets/${CURRENT_PET_ID}`, {
                method: "DELETE"
            });

            alert("Pet deleted");
            window.location.href = "allpet.html";

        } catch (e) {
            console.error(e);
            alert("Failed to delete");
        }
    });

    // -------------------------------
    // 8. INIT
    // -------------------------------
    loadData(petId);
});
