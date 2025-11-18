document.addEventListener('DOMContentLoaded', () => { 
    const API_BASE_URL = "http://localhost:8081/api/pets";

    // const formModeTitle = document.getElementById('formModeTitle');
    const petIDInput = document.getElementById('petId');
    const fileUpload = document.getElementById('fileUpload');
    const uploadArea = document.querySelector('.upload-area');
    const uploadPrompt = document.getElementById('upload-prompt');
    const imagePreview = document.getElementById('imagePreview');
    // let uploadedImageBase64 = null; 

    const typeGroup = document.getElementById('typeGroup');
    const genderGroup = document.getElementById('genderGroup');

    // const calendarIcon = document.getElementById('calendarIcon');
    const petDobInput = document.getElementById('petDob');

    const petNameInput = document.getElementById('petName');
    const petBreedSelect = document.getElementById('petBreed');
    
    // const resetBasicBtn = document.getElementById('resetBasicInfo');
    // const resetHealthBtn = document.getElementById('resetHealthInfo');

    const foodAllergyInput = document.getElementById('foodAllergy');
    const diseaseInput = document.getElementById('disease');
    const sterilizedCheck = document.getElementById('sterilized');
    const vaccinatedCheck = document.getElementById('vaccinated');
    const petWeightInput = document.getElementById('petWeight');

    const saveButton = document.getElementById('saveButton');
    // --- 0. อ่านค่าจาก URL ---
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get('mode') || 'add'; // default 'add'
    const petIdToEdit = urlParams.get('id');

    let currentPetId = null; //for edit mode


    // --- 2. Image Upload Logic ---
    fileUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                imagePreview.src = event.target.result;
                imagePreview.style.display = 'block';
                uploadPrompt.style.display = 'none';
                // uploadedImageBase64 = event.target.result;
                clearError(uploadArea.parentElement); 
            };
            reader.readAsDataURL(file);
        }
    });

    // --- 3. Button Group Toggle Logic ---
    function handleGroupToggle(groupElement) {
        const buttons = groupElement.querySelectorAll('.selection-btn');
        buttons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault(); 
                buttons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                clearError(groupElement.closest('.form-group'));
            });
        });
    }
    handleGroupToggle(typeGroup);
    handleGroupToggle(genderGroup);

    // --- 4. Calendar Icon Click ---
    // calendarIcon.addEventListener('click', () => {
    //     try { petDobInput.showPicker(); } catch (error) { console.warn("Browser doesn't support showPicker()", error); }
    // });
    // petDobInput.addEventListener('change', () => clearError(petDobInput.closest('.form-group')));

    // --- 5. Reset Buttons Logic ---
    // resetBasicBtn.addEventListener('click', (e) => { /* ... reset code ... */ });
    // resetHealthBtn.addEventListener('click', (e) => { /* ... reset code ... */ });

    // --- 6. Validation Logic ---
    function showError(formGroup, message) {
        formGroup.classList.add('invalid');
        const err = formGroup.querySelector('.error-message');
        if (err) err.textContent = message;
    }
    function clearError(formGroup) {
        formGroup.classList.remove('invalid');
        const err = formGroup.querySelector('.error-message');
        if (err) err.textContent = "";
    }
    // function clearAllErrorsInCard(cardElement) { /* ... code ... */ }
    function clearAllErrors() {
        document.querySelectorAll('.invalid').forEach(el => clearError(el));
    }
    function calculateAge(dobString) { /* ... code ... */ }
    function validateForm() {
        clearAllErrors();
        let ok = true;

        if(!petIDInput.value.trim()) {
            showError(petIDInput.closest('.form-group'), "Please enter Pet ID.");
            let ok = false;
        }
        if (!petNameInput.value.trim()) {
            showError(petNameInput.closest('.form-group'), "Please enter Pet Name.");
            ok = false;
        }

        // Type
        if (!typeGroup.querySelector('.selection-btn.active')) {
            showError(typeGroup.closest('.form-group'), "Please select Type.");
            ok = false;
        }

        // Gender
        if (!genderGroup.querySelector('.selection-btn.active')) {
            showError(genderGroup.closest('.form-group'), "Please select Gender.");
            ok = false;
        }

        // DOB
        if (!petDobInput.value) {
            showError(petDobInput.closest('.form-group'), "Please select Birth Date.");
            ok = false;
        }

        // Image
        const hasExistingImage = imagePreview.src && !imagePreview.src.includes('placeholder.jpg');
        if (fileUpload.files.length === 0 && !hasExistingImage) {
            showError(uploadArea.parentElement, "Please upload a photo.");
            ok = false;
        }

        return ok;
    }

    // --- 7. Populate Form for Edit ---
    // function populateForm(petData) {
    //     petNameInput.value = petData.name || '';
    //     petBreedSelect.value = petData.breed || '';
    //     petDobInput.value = petData.dob || ''; 
    //     foodAllergyInput.value = petData.foodAllergy || '';
    //     diseaseInput.value = petData.disease || '';
    //     petWeightInput.value = petData.weight || '';
    //     sterilizedCheck.checked = petData.sterilisation;
    //     vaccinatedCheck.checked = petData.vaccine;

    //     typeGroup.querySelectorAll('.selection-btn').forEach(btn => {
    //         btn.classList.remove('active');
    //         if (btn.dataset.value === petData.type) btn.classList.add('active');
    //     });

    //     genderGroup.querySelectorAll('.selection-btn').forEach(btn => {
    //         btn.classList.remove('active');
    //         if (btn.dataset.value === petData.gender) btn.classList.add('active');
    //     });

    //     if (petData.image) {
    //         uploadedImageBase64 = petData.image;
    //         imagePreview.src = petData.image;
    //         imagePreview.style.display = 'block';
    //         uploadPrompt.style.display = 'none';
    //     }
    // }

    async function loadPetData(petId) {
        try {
            const response = await fetch(`${API_BASE_URL}/${petId}`);
            if (!response.ok) throw new Error('Could not fetch pet data');
            const pet = await response.json();
            
            currentPetId = petId;
            petIDInput.value = pet.petID;
            petIDInput.readOnly = true;

            petNameInput.value = pet.name || '';
            petDobInput.value = pet.birthDate || '';
            petWeightInput.value = pet.weight || '';
            petBreedSelect.value = pet.breed || '';
            diseaseInput.value = pet.disease || '';
            foodAllergyInput.value = pet.foodAllergy || '';
            sterilizedCheck.checked = pet.sterilisation || false;
            vaccinatedCheck.checked = pet.vaccine || false;

            if (pet.image) {
                imagePreview.src = `http://localhost:8081${pet.image}`;
                imagePreview.style.display = 'block';
                uploadPrompt.style.display = 'none';
            }

            // Type / Gender
            typeGroup.querySelectorAll('.selection-btn').forEach(btn => {
                btn.classList.remove('active');
                if (btn.dataset.value === pet.type) btn.classList.add('active');
            });
            genderGroup.querySelectorAll('.selection-btn').forEach(btn => {
                btn.classList.remove('active');
                if (btn.dataset.value === pet.gender) btn.classList.add('active');
            });

            saveButton.textContent = "Update";
            saveButton.disabled = false;
        } catch (error) {
            console.error('Failed to load pet data:', error);
            alert('Error: Could not load pet data. Returning to add mode.');
        }
    }

    // --- 8. Save Button Logic ---
    saveButton.addEventListener('click', async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const petData = {
            id: currentPetId || null,
            petID: petIDInput.value.trim(),
            type: typeGroup.querySelector('.selection-btn.active').dataset.value,
            name: petNameInput.value.trim(),
            gender: genderGroup.querySelector('.selection-btn.active').dataset.value,
            breed: petBreedSelect.value,
            birthDate: petDobInput.value,
            weight: petWeightInput.value ? parseFloat(petWeightInput.value) : 0,
            sterilisation: sterilizedCheck.checked,
            vaccine: vaccinatedCheck.checked,
            disease: diseaseInput.value.trim(),
            foodAllergy: foodAllergyInput.value.trim(),
            image: fileUpload.files.length === 0 ? imagePreview.src.replace('http://localhost:8081', '') : null
            // image: uploadedImageBase64,
        };
        const formData = new FormData();
        formData.append('pet', new Blob([JSON.stringify(petData)], { type: 'application/json' }));
        if (fileUpload.files.length > 0) {
            formData.append('file', fileUpload.files[0]);
        }

        const url = currentPetId ? `${API_BASE_URL}/${currentPetId}` : API_BASE_URL;
        const method = currentPetId ? 'PUT' : 'POST';

        try {
            saveButton.disabled = true;
            saveButton.textContent = currentPetId ? 'Updating...' : 'Saving...';

            const response = await fetch(url, { method, body: formData });
            if (!response.ok) {
                const txt = await response.text();
                throw new Error(txt);
            }

            const result = await response.json();
            alert(`Pet ${result.petID} ${currentPetId ? 'updated' : 'added'} successfully!`);
            // window.location.href = 'allpet.html'; // redirect if needed
        } catch (err) {
            console.error(err);
            alert('Failed to save pet. Check console for details.');
        } finally {
            saveButton.disabled = false;
            saveButton.textContent = currentPetId ? 'Update' : 'Save';
        }
    });

    // --- Initialize ---
    if (mode === 'edit' && petIdToEdit) {
        loadPetData(petIdToEdit);
        saveButton.textContent = 'Update';
    } else {
        petIDInput.readOnly = false;
        saveButton.textContent = 'Save';
    }
});

//         if (mode === 'edit') {
//             try {
//                 saveButton.textContent = 'Updating...';
//                 saveButton.disabled = true;

//                 const response = await fetch(`/api/pet-detail/${petIdToEdit}`, {
//                     method: 'PUT',
//                     headers: { 'Content-Type': 'application/json' },
//                     body: JSON.stringify(petData)
//                 });

//                 if (!response.ok) throw new Error(`API Error: ${response.statusText}`);

//                 alert('Pet profile updated successfully!');
//             } catch (error) {
//                 console.error('Failed to update pet:', error);
//                 alert('Error: Could not update pet profile.');
//             } finally {
//                 saveButton.textContent = 'Save';
//                 saveButton.disabled = false;
//             }

//         } else {
//             try {
//                 saveButton.textContent = 'Saving...';
//                 saveButton.disabled = true;

//                 const response = await fetch('/api/pet-detail', {
//                     method: 'POST',
//                     headers: { 'Content-Type': 'application/json' },
//                     body: JSON.stringify(petData)
//                 });

//                 if (!response.ok) throw new Error(`API Error: ${response.statusText}`);

//                 alert('Pet profile saved successfully!');
//             } catch (error) {
//                 console.error('Failed to save pet details:', error);
//                 alert('Error: Could not save pet profile.');
//             } finally {
//                 saveButton.textContent = 'Save';
//                 saveButton.disabled = false;
//             }
//         }
//     });

//     // --- 9. Clear Errors on Input ---
//     [petNameInput, petBreedSelect].forEach(input => {
//         input.addEventListener('input', () => clearError(input.closest('.form-group')));
//     });

//     // --- 10. Load Edit Mode Data ---
//     if (mode === 'edit' && petIdToEdit) {
//         loadPetDataForEdit(petIdToEdit);
//         saveButton.textContent = 'Update';
//     }
// });
