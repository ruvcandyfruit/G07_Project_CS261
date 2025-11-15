document.addEventListener('DOMContentLoaded', () => {

    // --- 0. อ่านค่าจาก URL ---
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get('mode') || 'add'; // ถ้าไม่บอก mode ให้ถือว่าเป็น 'add'
    const petIdToEdit = urlParams.get('id');

    // --- 1. DOM Selections (เหมือนเดิม) ---
    const formModeTitle = document.getElementById('formModeTitle');
    const fileUpload = document.getElementById('fileUpload');
    const uploadArea = document.querySelector('.upload-area');
    const uploadPrompt = document.getElementById('upload-prompt');
    const imagePreview = document.getElementById('imagePreview');
    let uploadedImageBase64 = null; 

    const typeGroup = document.getElementById('typeGroup');
    const genderGroup = document.getElementById('genderGroup');

    const calendarIcon = document.getElementById('calendarIcon');
    const petDobInput = document.getElementById('petDob');

    const petNameInput = document.getElementById('petName');
    const petBreedSelect = document.getElementById('petBreed');
    
    const resetBasicBtn = document.getElementById('resetBasicInfo');
    const resetHealthBtn = document.getElementById('resetHealthInfo');

    const foodAllergyInput = document.getElementById('foodAllergy');
    const diseaseInput = document.getElementById('disease');
    const sterilizedCheck = document.getElementById('sterilized');
    const vaccinatedCheck = document.getElementById('vaccinated');
    const petWeightInput = document.getElementById('petWeight');

    const saveButton = document.getElementById('saveButton');

    // --- 2. Image Upload Logic (เหมือนเดิม) ---
    // (*** ลบ uploadArea.addEventListener('click', ...)
    fileUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                imagePreview.src = event.target.result;
                imagePreview.style.display = 'block';
                uploadPrompt.style.display = 'none';
                uploadedImageBase64 = event.target.result;
                clearError(uploadArea.parentElement); 
            };
            reader.readAsDataURL(file);
        }
    });

    // --- 3. Button Group Toggle Logic (เหมือนเดิม) ---
    function handleGroupToggle(groupElement) {
        const buttons = groupElement.querySelectorAll('.selection-btn');
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault(); 
                buttons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                clearError(groupElement.closest('.form-group'));
            });
        });
    }
    handleGroupToggle(typeGroup);
    handleGroupToggle(genderGroup);

    // --- 4. Calendar Icon Click (เหมือนเดิม) ---
    calendarIcon.addEventListener('click', () => {
        try { petDobInput.showPicker(); } catch (error) { console.warn("Browser doesn't support showPicker()", error); }
    });
    petDobInput.addEventListener('change', () => clearError(petDobInput.closest('.form-group')));

    // --- 5. Reset Buttons Logic (เหมือนเดิม) ---
    resetBasicBtn.addEventListener('click', (e) => { /* ... โค้ด Reset เดิม ... */ });
    resetHealthBtn.addEventListener('click', (e) => { /* ... โค้ด Reset เดิม ... */ });

    // --- 6. Validation Logic (เหมือนเดิม) ---
    function showError(formGroup, message) { /* ... โค้ด Error เดิม ... */ }
    function clearError(formGroup) { /* ... โค้ด Error เดิม ... */ }
    function clearAllErrorsInCard(cardElement) { /* ... โค้ด Error เดิม ... */ }
    function clearAllErrors() { /* ... โค้ด Error เดิม ... */ }
    function validateForm() { /* ... โค้ด Validation เดิม ... */ return true; } // สมมติว่าผ่าน
    function calculateAge(dobString) { /* ... โค้ดคำนวณอายุเดิม ... */ }


    // --- [ใหม่] ฟังก์ชันสำหรับดึงข้อมูลมาเติมฟอร์ม ---
    function populateForm(petData) {
        petNameInput.value = petData.name || '';
        petBreedSelect.value = petData.breed || '';
        
        // สมมติว่า API คืนค่า dob เป็น 'YYYY-MM-DD'
        petDobInput.value = petData.dob || ''; 
        
        foodAllergyInput.value = petData.foodAllergy || '';
        diseaseInput.value = petData.disease || '';
        petWeightInput.value = petData.weight || '';
        sterilizedCheck.checked = petData.sterilisation;
        vaccinatedCheck.checked = petData.vaccine;

        // เติมค่าปุ่ม Type
        typeGroup.querySelectorAll('.selection-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.value === petData.type) {
                btn.classList.add('active');
            }
        });

        // เติมค่าปุ่ม Gender
        genderGroup.querySelectorAll('.selection-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.value === petData.gender) {
                btn.classList.add('active');
            }
        });
        
        // เติมรูปภาพ
        if (petData.image) {
            uploadedImageBase64 = petData.image; // เก็บ URL หรือ Base64 เดิมไว้
            imagePreview.src = petData.image;
            imagePreview.style.display = 'block';
            uploadPrompt.style.display = 'none';
        }
    }

    // --- [ใหม่] ฟังก์ชันสำหรับโหลดข้อมูลสัตว์ (ตอน Edit) ---
    async function loadPetDataForEdit(petId) {
        // *** ให้เปลี่ยน '/api/pet-detail/' เป็น Endpoint GET ของคุณ ***
        try {
            const response = await fetch(`/api/pet-detail/${petId}`); // เช่น GET /api/pet-detail/abc-123
            if (!response.ok) {
                throw new Error('Could not fetch pet data');
            }
            const petData = await response.json();
            
            // เติมข้อมูลลงฟอร์ม
            populateForm(petData);

        } catch (error) {
            console.error('Failed to load pet data:', error);
            alert('Error: Could not load pet data. Returning to add mode.');
            // ถ้าโหลดไม่ผ่าน ก็กลับไป Add Mode
            formModeTitle.textContent = 'Add Pet';
        }
    }

    // --- 7. Save Button (*** อัปเดตครั้งใหญ่ ***) ---
    saveButton.addEventListener('click', async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            console.error('Validation Failed');
            return;
        }
        
        // 7.2 รวบรวมข้อมูล
        const petData = {
            petID: (mode === 'edit' ? petIdToEdit : crypto.randomUUID()),
            type: typeGroup.querySelector('.selection-btn.active').dataset.value,
            image: uploadedImageBase64, 
            name: petNameInput.value.trim(),
            
            // --- นี่คือส่วนที่แก้ไข ---
            // ลบบรรทัด age: ออก
            // age: calculateAge(petDobInput.value), // [ลบบรรทัดนี้]
            
            // เพิ่มบรรทัด dob: เข้าไปแทน
            dob: petDobInput.value, // นี่คือ 'YYYY-MM-DD' จากช่อง <input type="date">
            // --- จบส่วนแก้ไข ---
            
            gender: genderGroup.querySelector('.selection-btn.active').dataset.value,
            breed: petBreedSelect.value,
            weight: petWeightInput.value ? parseFloat(petWeightInput.value) : 0,
            sterilisation: sterilizedCheck.checked,
            vaccine: vaccinatedCheck.checked,
            disease: diseaseInput.value.trim(),
            foodAllergy: foodAllergyInput.value.trim()
        };
        
        // --- 7.3 [ใหม่] แยก Logic การ Save ---
        
        if (mode === 'edit') {
            // ----- EDIT MODE (UPDATE ข้อมูล) -----
            petData.petID = petIdToEdit; // ใส่ ID เดิมของสัตว์
            console.log('--- Updating Pet (PUT) ---');
            console.log(petData);

            // *** ให้เปลี่ยน '/api/pet-detail/' เป็น Endpoint UPDATE (PUT) ของคุณ ***
            try {
                saveButton.textContent = 'Updating...';
                saveButton.disabled = true;

                const response = await fetch(`/api/pet-detail/${petIdToEdit}`, { 
                    method: 'PUT', // หรือ 'PATCH'
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(petData)
                });

                if (!response.ok) { throw new Error(`API Error: ${response.statusText}`); }

                alert('Pet profile updated successfully!');
                // window.location.href = '/all-pet.html'; // กลับไปหน้า All Pet

            } catch (error) {
                console.error('Failed to update pet:', error);
                alert('Error: Could not update pet profile.');
            } finally {
                saveButton.textContent = 'Save';
                saveButton.disabled = false;
            }

        } else {
            // ----- ADD MODE (CREATE ใหม่) -----
            petData.petID = crypto.randomUUID(); // สร้าง ID ใหม่
            console.log('--- Creating new Pet (POST) ---');
            console.log(petData);

            // (นี่คือโค้ด POST เดิมของคุณ)
            try {
                saveButton.textContent = 'Saving...';
                saveButton.disabled = true;

                const response = await fetch('/api/pet-detail', { // Endpoint POST
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(petData)
                });

                if (!response.ok) { throw new Error(`API Error: ${response.statusText}`); }
                
                alert('Pet profile saved successfully!');
                // (อาจจะล้างฟอร์ม หรือกลับไปหน้า All Pet)
                
            } catch (error) {
                console.error('Failed to save pet details:', error);
                alert('Error: Could not save pet profile.');
            } finally {
                saveButton.textContent = 'Save';
                saveButton.disabled = false;
            }
        }
    });
    
    // --- 8. ล้าง Error เมื่อ User พิมพ์ (เหมือนเดิม) ---
    [petNameInput, petBreedSelect].forEach(input => {
        input.addEventListener('input', () => clearError(input.closest('.form-group')));
    });

    // --- 9. [ใหม่] Logic ตอนเริ่มโหลดหน้า ---
    if (mode === 'edit') {
        formModeTitle.textContent = 'Edit Pet'; // เปลี่ยนหัวข้อ
        loadPetDataForEdit(petIdToEdit); // โหลดข้อมูลมาเติมฟอร์ม
    } else {
        formModeTitle.textContent = 'Add Pet'; // ตั้งค่าหัวข้อ (default)
        // ไม่ต้องทำอะไร ฟอร์มจะว่างเปล่ารอรับข้อมูลใหม่
    }
});