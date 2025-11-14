document.addEventListener('DOMContentLoaded', () => {

    // --- 1. DOM Selections ---
    const fileUpload = document.getElementById('fileUpload');
    const uploadArea = document.querySelector('.upload-area');
    const uploadPrompt = document.getElementById('upload-prompt');
    const imagePreview = document.getElementById('imagePreview');
    let uploadedImageBase64 = null; // ใชเก็บรูปภาพเพื่อส่ง API

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

    // --- 2. Image Upload Logic ---
    // เมื่อคลิกที่พื้นที่อัปโหลด ให้ไป trigger input file ที่ซ่อนอยู่
    uploadArea.addEventListener('click', (e) => {
        // ป้องกันการคลิกซ้ำซ้อน
        if (e.target.id !== 'fileUpload') {
            fileUpload.click();
        }
    });

    fileUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            
            reader.onload = (event) => {
                // แสดงรูปตัวอย่าง
                imagePreview.src = event.target.result;
                imagePreview.style.display = 'block';
                uploadPrompt.style.display = 'none'; // ซ่อน icon และข้อความ
                
                // เก็บข้อมูลรูปภาพเป็น Base64 (ตัดส่วน "data:image/jpeg;base64,")
                uploadedImageBase64 = event.target.result;
                
                // ล้าง error (ถ้ามี)
                clearError(uploadArea.parentElement); 
            };
            
            reader.readAsDataURL(file);
        }
    });

    // --- 3. Button Group Toggle Logic (Type & Gender) ---
    function handleGroupToggle(groupElement) {
        const buttons = groupElement.querySelectorAll('.selection-btn');
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault(); // ป้องกันพฤติกรรม default ของปุ่ม
                // เอา active ออกจากปุ่มอื่น
                buttons.forEach(btn => btn.classList.remove('active'));
                // เพิ่ม active ให้ปุ่มที่คลิก
                button.classList.add('active');
                // ล้าง error
                clearError(groupElement.closest('.form-group'));
            });
        });
    }

    handleGroupToggle(typeGroup);
    handleGroupToggle(genderGroup);

    // --- 4. Calendar Icon Click ---
    // (เราเปลี่ยนเป็น type="date" แล้ว ซึ่งส่วนใหญ่จะเปิดปฏิทินเอง)
    // แต่ถ้าอยากให้ icon คลิกได้จริงๆ:
    calendarIcon.addEventListener('click', () => {
        try {
            petDobInput.showPicker(); // API ของ browser สำหรับเปิดปฏิทิน
        } catch (error) {
            console.warn("Browser doesn't support showPicker()", error);
            // ถ้าไม่รองรับ ก็ปล่อยให้ user คลิกที่ช่อง input เอง
        }
    });
    // ล้าง error เมื่อมีการเลือกวันที่
    petDobInput.addEventListener('change', () => clearError(petDobInput.closest('.form-group')));

    // --- 5. Reset Buttons Logic ---
    resetBasicBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Reset Basic Info
        petNameInput.value = '';
        petBreedSelect.selectedIndex = 0; // กลับไปที่ "Select Breed"
        petDobInput.value = '';
        
        // Reset Type Group (กลับไปที่ Cat)
        typeGroup.querySelectorAll('.selection-btn').forEach(btn => btn.classList.remove('active'));
        typeGroup.querySelector('[data-value="Cat"]').classList.add('active');
        
        // Reset Gender Group (ล้างทั้งหมด)
        genderGroup.querySelectorAll('.selection-btn').forEach(btn => btn.classList.remove('active'));
        
        // Reset Image Upload
        imagePreview.style.display = 'none';
        uploadPrompt.style.display = 'block';
        fileUpload.value = null; // ล้างค่าใน input file
        uploadedImageBase64 = null;

        // ล้าง error ทั้งหมดใน card นี้
        clearAllErrorsInCard(resetBasicBtn.closest('.card'));
    });

    resetHealthBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Reset Health Info
        foodAllergyInput.value = '';
        diseaseInput.value = '';
        petWeightInput.value = '';
        sterilizedCheck.checked = false;
        vaccinatedCheck.checked = false;

        // ล้าง error ทั้งหมดใน card นี้
        clearAllErrorsInCard(resetHealthBtn.closest('.card'));
    });

    // --- 6. Validation Logic ---
    
    // ฟังก์ชันแสดง Error
    function showError(formGroup, message) {
        formGroup.classList.add('invalid');
        const errorDiv = formGroup.querySelector('.error-message');
        if (errorDiv) {
            errorDiv.textContent = message;
        }
    }

    // ฟังก์ชันล้าง Error
    function clearError(formGroup) {
        if (formGroup) {
            formGroup.classList.remove('invalid');
            const errorDiv = formGroup.querySelector('.error-message');
            if (errorDiv) {
                errorDiv.textContent = '';
            }
        }
    }
    
    // ฟังก์ชันล้าง Error ทั้งหมดใน Card
    function clearAllErrorsInCard(cardElement) {
        cardElement.querySelectorAll('.form-group.invalid').forEach(clearError);
    }
    
    // ฟังก์ชันล้าง Error ทั้งหมดในหน้า
    function clearAllErrors() {
        document.querySelectorAll('.form-group.invalid').forEach(clearError);
    }

    // ฟังก์ชันตรวจสอบ Form
    function validateForm() {
        clearAllErrors();
        let isValid = true;

        // 1. Pet Name
        if (petNameInput.value.trim() === '') {
            showError(petNameInput.closest('.form-group'), 'Please enter pet name.');
            isValid = false;
        }
        
        // 2. Type
        if (!typeGroup.querySelector('.selection-btn.active')) {
            showError(typeGroup.closest('.form-group'), 'Please select pet type.');
            isValid = false;
        }

        // 3. Breed
        if (petBreedSelect.value === '') {
            showError(petBreedSelect.closest('.form-group'), 'Please select breed.');
            isValid = false;
        }

        // 4. Date of Birth
        if (petDobInput.value === '') {
            showError(petDobInput.closest('.form-group'), 'Please select date of birth.');
            isValid = false;
        }
        
        // 5. Gender
        if (!genderGroup.querySelector('.selection-btn.active')) {
            showError(genderGroup.closest('.form-group'), 'Please select gender.');
            isValid = false;
        }
        
        // (Optional: ตรวจสอบรูปภาพด้วยก็ได้)
        // if (!uploadedImageBase64) {
        //     showError(uploadArea.parentElement, 'Please upload a photo.');
        //     isValid = false;
        // }

        return isValid;
    }
    
    // Helper: คำนวณอายุจากวันเกิด
    function calculateAge(dobString) {
        if (!dobString) return 0;
        const dob = new Date(dobString);
        const diff_ms = Date.now() - dob.getTime();
        const age_dt = new Date(diff_ms); 
        return Math.abs(age_dt.getUTCFullYear() - 1970);
    }

    // --- 7. Save Button (API Call) ---
    saveButton.addEventListener('click', async (e) => {
        e.preventDefault();
        
        // 7.1 ตรวจสอบ Validation
        if (!validateForm()) {
            console.error('Validation Failed');
            return; // หยุดทำงานถ้า Form ไม่ผ่าน
        }
        
        // 7.2 รวบรวมข้อมูล
        const petData = {
            petID: crypto.randomUUID(), // สร้าง ID ชั่วคราว (ปกติ server จะสร้าง)
            type: typeGroup.querySelector('.selection-btn.active').dataset.value,
            image: uploadedImageBase64, // ส่งเป็น Base64 string (หรือ null ถ้าไม่บังคับ)
            name: petNameInput.value.trim(),
            age: calculateAge(petDobInput.value), // คำนวณอายุ
            gender: genderGroup.querySelector('.selection-btn.active').dataset.value,
            breed: petBreedSelect.value,
            weight: petWeightInput.value ? parseFloat(petWeightInput.value) : 0,
            sterilisation: sterilizedCheck.checked,
            vaccine: vaccinatedCheck.checked,
            disease: diseaseInput.value.trim(),
            foodAllergy: foodAllergyInput.value.trim()
        };
        
        console.log('--- Data to be sent to API ---');
        console.log(petData);
        
        // 7.3 ส่งข้อมูลไป API (จำลอง)
        // *** ให้เปลี่ยน '/api/pet-detail' เป็น Endpoint จริงของคุณ ***
        try {
            // (ใส่ Loading... spinner ตรงนี้)
            saveButton.textContent = 'Saving...';
            saveButton.disabled = true;

            const response = await fetch('/api/pet-detail', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(petData)
            });

            if (!response.ok) {
                // ถ้า Server ตอบกลับมาว่า Error
                throw new Error(`API Error: ${response.statusText}`);
            }

            const result = await response.json();
            console.log('API Success:', result);
            
            // เมื่อสำเร็จ
            alert('Pet profile saved successfully!');
            // (อาจจะ redirect ไปหน้า All Pet หรือล้างฟอร์ม)
            // resetBasicBtn.click(); // ล้างฟอร์ม
            // resetHealthBtn.click();
            
        } catch (error) {
            console.error('Failed to save pet details:', error);
            alert('Error: Could not save pet profile. Please try again.');
        } finally {
            // (เอา Loading... spinner ออก)
            saveButton.textContent = 'Save';
            saveButton.disabled = false;
        }
    });
    
    // --- 8. ล้าง Error เมื่อ User พิมพ์ ---
    [petNameInput, petBreedSelect].forEach(input => {
        input.addEventListener('input', () => clearError(input.closest('.form-group')));
    });
});