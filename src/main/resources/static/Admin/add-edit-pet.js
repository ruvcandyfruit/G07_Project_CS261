document.addEventListener('DOMContentLoaded', () => { 

    // --- 0. อ่านค่าจาก URL ---
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get('mode') || 'add'; // default 'add'
    const petIdToEdit = urlParams.get('id');

    // --- 1. DOM Selections ---
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

    // --- 2. Image Upload Logic ---
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

    // --- 3. Button Group Toggle Logic ---
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

    // --- 4. Calendar Icon Click ---
    // calendarIcon.addEventListener('click', () => {
    //     try { petDobInput.showPicker(); } catch (error) { console.warn("Browser doesn't support showPicker()", error); }
    // });
    // petDobInput.addEventListener('change', () => clearError(petDobInput.closest('.form-group')));

    // --- 5. Reset Buttons Logic ---
    resetBasicBtn.addEventListener('click', (e) => { /* ... reset code ... */ });
    resetHealthBtn.addEventListener('click', (e) => { /* ... reset code ... */ });

    // --- 6. Validation Logic ---
    function showError(formGroup, message) { /* ... code ... */ }
    function clearError(formGroup) { /* ... code ... */ }
    function clearAllErrorsInCard(cardElement) { /* ... code ... */ }
    function clearAllErrors() { /* ... code ... */ }
    function validateForm() { /* ... code ... */ return true; } 
    function calculateAge(dobString) { /* ... code ... */ }

    // --- 7. Populate Form for Edit ---
    function populateForm(petData) {
        petNameInput.value = petData.name || '';
        petBreedSelect.value = petData.breed || '';
        petDobInput.value = petData.dob || ''; 
        foodAllergyInput.value = petData.foodAllergy || '';
        diseaseInput.value = petData.disease || '';
        petWeightInput.value = petData.weight || '';
        sterilizedCheck.checked = petData.sterilisation;
        vaccinatedCheck.checked = petData.vaccine;

        typeGroup.querySelectorAll('.selection-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.value === petData.type) btn.classList.add('active');
        });

        genderGroup.querySelectorAll('.selection-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.value === petData.gender) btn.classList.add('active');
        });

        if (petData.image) {
            uploadedImageBase64 = petData.image;
            imagePreview.src = petData.image;
            imagePreview.style.display = 'block';
            uploadPrompt.style.display = 'none';
        }
    }

    async function loadPetDataForEdit(petId) {
        try {
            const response = await fetch(`/api/pet-detail/${petId}`);
            if (!response.ok) throw new Error('Could not fetch pet data');
            const petData = await response.json();
            populateForm(petData);
        } catch (error) {
            console.error('Failed to load pet data:', error);
            alert('Error: Could not load pet data. Returning to add mode.');
            formModeTitle.textContent = 'Add Pet';
        }
    }

    // --- 8. Save Button Logic ---
    saveButton.addEventListener('click', async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const petData = {
            petID: (mode === 'edit' ? petIdToEdit : crypto.randomUUID()),
            type: typeGroup.querySelector('.selection-btn.active').dataset.value,
            image: uploadedImageBase64, 
            name: petNameInput.value.trim(),
            dob: petDobInput.value,
            gender: genderGroup.querySelector('.selection-btn.active').dataset.value,
            breed: petBreedSelect.value,
            weight: petWeightInput.value ? parseFloat(petWeightInput.value) : 0,
            sterilisation: sterilizedCheck.checked,
            vaccine: vaccinatedCheck.checked,
            disease: diseaseInput.value.trim(),
            foodAllergy: foodAllergyInput.value.trim()
        };

        if (mode === 'edit') {
            try {
                saveButton.textContent = 'Updating...';
                saveButton.disabled = true;

                const response = await fetch(`/api/pet-detail/${petIdToEdit}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(petData)
                });

                if (!response.ok) throw new Error(`API Error: ${response.statusText}`);

                alert('Pet profile updated successfully!');
            } catch (error) {
                console.error('Failed to update pet:', error);
                alert('Error: Could not update pet profile.');
            } finally {
                saveButton.textContent = 'Save';
                saveButton.disabled = false;
            }

        } else {
            try {
                saveButton.textContent = 'Saving...';
                saveButton.disabled = true;

                const response = await fetch('/api/pet-detail', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(petData)
                });

                if (!response.ok) throw new Error(`API Error: ${response.statusText}`);

                alert('Pet profile saved successfully!');
            } catch (error) {
                console.error('Failed to save pet details:', error);
                alert('Error: Could not save pet profile.');
            } finally {
                saveButton.textContent = 'Save';
                saveButton.disabled = false;
            }
        }
    });

    // --- 9. Clear Errors on Input ---
    [petNameInput, petBreedSelect].forEach(input => {
        input.addEventListener('input', () => clearError(input.closest('.form-group')));
    });

    // --- 10. Load Edit Mode Data ---
    if (mode === 'edit' && petIdToEdit) {
        loadPetDataForEdit(petIdToEdit);
        saveButton.textContent = 'Update';
    }
});
