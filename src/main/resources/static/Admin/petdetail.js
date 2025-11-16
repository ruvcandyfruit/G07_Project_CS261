document.addEventListener('DOMContentLoaded', () => {

    // --- 1. DOM Selections ---
    const petImageEl = document.getElementById('petImage');
    const petNameDisplayEl = document.getElementById('petNameDisplay');
    const statusValueEl = document.getElementById('statusValue');
    const deleteBtn = document.getElementById('deleteBtn');
    const editBtn = document.getElementById('editBtn');
    const backBtn = document.getElementById('backBtn');

    // Pet Info
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

    // Owner Info
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

    // Delete Modal
    const deleteModal = document.getElementById('deleteModal');
    const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');

    let CURRENT_PET_ID = null;

    // --- 2. Helper Functions ---
    
    // (ฟังก์ชันคำนวณอายุ)
    function calculateAge(dobString) {
        if (!dobString) return "N/A";
        const dob = new Date(dobString);
        const diff_ms = Date.now() - dob.getTime();
        const age_dt = new Date(diff_ms);
        return Math.abs(age_dt.getUTCFullYear() - 1970);
    }
    
    // (ฟังก์ชันแสดง Modal)
    function showModal(modal) {
        modal.classList.remove('modal-hidden');
    }
    function hideModal(modal) {
        modal.classList.add('modal-hidden');
    }

    // --- 3. Data Population Functions ---
    
    function populatePetInfo(pet) {
        petImageEl.innerHTML = `<img src="${pet.imageUrl}" alt="${pet.name}">`;
        petNameDisplayEl.textContent = pet.name;
        
        statusValueEl.textContent = pet.pet_status;
        statusValueEl.className = `status-value ${pet.pet_status.toLowerCase()}`;

        petIDEl.textContent = `รหัสประจำตัว : ${pet.id}`;
        petNameEl.textContent = `ชื่อ : ${pet.name}`;
        petTypeEl.textContent = `ชนิด : ${pet.type}`;
        petGenderEl.textContent = `เพศ : ${pet.gender}`;
        petBreedEl.textContent = `สายพันธุ์ : ${pet.breed}`;
        petAgeEl.textContent = `อายุ : ${calculateAge(pet.dob)} ปี`;
        
        petSterilizationEl.textContent = `การทำหมัน : ${pet.sterilisation ? 'ทำแล้ว' : 'ยังไม่ทำ'}`;
        petVaccineEl.textContent = `การฉีดวัคซีน : ${pet.vaccine ? 'ครบ' : 'ไม่ครบ'}`;
        petDiseaseEl.textContent = `โรคประจำตัว : ${pet.disease || 'ไม่มี'}`;
        petFoodAllergyEl.textContent = `แพ้อาหาร : ${pet.foodAllergy || 'ไม่มี'}`;
    }

    function populateOwnerInfo(owner) {
        ownerFirstname.textContent = owner.firstname;
        ownerLastname.textContent = owner.lastname;
        ownerDob.textContent = owner.birthdate;
        ownerPhone.textContent = owner.phone;
        ownerEmail.textContent = owner.email;
        ownerOccupation.textContent = owner.occupation;
        ownerAddress.textContent = owner.address;
        ownerResidenceType.textContent = owner.residenceType;
        ownerExperience.textContent = owner.petExperience;
        ownerReason.textContent = owner.adoptionReason;
    }

    // --- 4. Main Data Loading Function ---
    async function loadData(petId) {
        if (!petId) {
            alert('ไม่พบ ID ของสัตว์เลี้ยง');
            window.location.href = 'allpet.html';
            return;
        }
        
        CURRENT_PET_ID = petId;

        try {
            // [!! ในโลกจริง: แก้ Endpoint !!]
            // 4.1 ดึงข้อมูลสัตว์
            // const petResponse = await fetch(`/api/pets/${petId}`);
            // const petData = await petResponse.json();

            // [!! Mock Pet Data (สำหรับ Test) !!]
            const petData = {
                id: petId,
                name: "จินตรา",
                imageUrl: "images/sample-pet.jpg",
                type: "แมว",
                gender: "ผู้",
                breed: "ไม่ทราบ",
                dob: "2020-01-01",
                sterilisation: true,
                vaccine: true,
                disease: "ไม่มี",
                foodAllergy: "ปลาดุกปั่นป่น",
                pet_status: "Completed", // [!! ลองเปลี่ยนเป็น 'Pending' หรือ 'Approved' เพื่อเทส !!]
                associated_request_id: "R123" // (ID ของคำขอที่ Approved/Completed)
            };
            
            // 4.2 เติมข้อมูลสัตว์ (ทำเสมอ)
            populatePetInfo(petData);
            
            // 4.3 (สำคัญ) Logic การซ่อน/แสดง
            if (petData.pet_status === 'Approved' || petData.pet_status === 'Completed') {
                
                // [!! ในโลกจริง: แก้ Endpoint !!]
                // ดึงข้อมูลผู้รับเลี้ยง
                // const ownerResponse = await fetch(`/api/request-details/${petData.associated_request_id}`);
                // const ownerData = await ownerResponse.json();

                // [!! Mock Owner Data (สำหรับ Test) !!]
                const ownerData = {
                    firstname: "สมหญิง", lastname: "จริงใจ", birthdate: "10/10/1990",
                    phone: "081-234-5678", email: "somying@example.com",
                    occupation: "โปรแกรมเมอร์", address: "123 กทม.",
                    residenceType: "ทาวน์เฮาส์", petExperience: "เคยเลี้ยงแมว 2 ตัว",
                    adoptionReason: "น้องน่ารักมากค่ะ"
                };

                populateOwnerInfo(ownerData);
                ownerInfoSection.classList.remove('hidden'); // [!! แสดง !!]
                
            } else {
                // (สถานะ No Request, Pending, Closed)
                noOwnerMessage.classList.remove('hidden'); // [!! แสดง !!]
            }

        } catch (error) {
            console.error('Failed to load data:', error);
            alert('ไม่สามารถโหลดข้อมูลได้');
        }
    }

    // --- 5. Button Event Listeners ---
    
    // (ปุ่ม Edit)
    editBtn.addEventListener('click', () => {
        if (CURRENT_PET_ID) {
            window.location.href = `add-edit-pet.html?mode=edit&id=${CURRENT_PET_ID}`;
        }
    });

    // (ปุ่มย้อนกลับ)
    backBtn.addEventListener('click', () => {
        window.location.href = 'allpet.html';
    });

    // (ปุ่ม Delete - เปิด Modal)
    deleteBtn.addEventListener('click', () => {
        showModal(deleteModal);
    });
    
    // (ปุ่ม Cancel ใน Modal)
    cancelDeleteBtn.addEventListener('click', () => {
        hideModal(deleteModal);
    });

    // (ปุ่ม Confirm Delete)
    confirmDeleteBtn.addEventListener('click', async () => {
        if (!CURRENT_PET_ID) return;

        try {
            // [!! ในโลกจริง: แก้ Endpoint !!]
            // const response = await fetch(`/api/pets/${CURRENT_PET_ID}`, { method: 'DELETE' });
            
            // (จำลองว่าลบสำเร็จ)
            console.log(`Sending DELETE request for pet: ${CURRENT_PET_ID}`);
            
            alert('ลบข้อมูลสัตว์เรียบร้อยแล้ว');
            hideModal(deleteModal);
            window.location.href = 'allpet.html'; // เด้งกลับหน้าหลัก

        } catch (error) {
            console.error('Failed to delete pet:', error);
            alert('เกิดข้อผิดพลาดในการลบ');
        }
    });

    // --- 6. เริ่มการทำงาน ---
    const urlParams = new URLSearchParams(window.location.search);
    const petId = urlParams.get('id') || urlParams.get('pet_id');
    
    loadData(petId);
});