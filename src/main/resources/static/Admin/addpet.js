document.addEventListener('DOMContentLoaded', () => {
    const typeGroup = document.getElementById('typeGroup');
    const genderGroup = document.getElementById('genderGroup');
    const imagePreview = document.getElementById('imagePreview');
    const fileUpload = document.getElementById('fileUpload');
    const uploadPrompt = document.getElementById('upload-prompt');
    const uploadArea = document.querySelector('.upload-area');

    const birthDate = document.getElementById('petDob');
    const name = document.getElementById('petName');
    const breed = document.getElementById('petBreed');
    const petID = document.getElementById('petId');
    const foodAllergy = document.getElementById('foodAllergy');
    const disease = document.getElementById('disease');
    const sterilisation = document.getElementById('sterilized');
    const vaccine = document.getElementById('vaccinated');
    const weight = document.getElementById('petWeight');

    const saveButton = document.getElementById('saveButton');

    fileUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                imagePreview.src = event.target.result;
                imagePreview.style.display = 'block';
                uploadPrompt.style.display = 'none';
            };
            reader.readAsDataURL(file);
        }
    });

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

    function showError(formGroup, message) { /* ... */ }
    function clearError(formGroup) { /* ... */ }
    function clearAllErrors() { /* ... */ }
    function validateForm() {
        clearAllErrors();
        let ok = true;
        
        if (petID.value.trim() === "") {
            showError(petID.closest('.form-group'), "Please enter Pet ID.");
            ok = false;
        }
        if (name.value.trim() === "") {
            showError(name.closest('.form-group'), "Please enter pet name.");
            ok = false;
        }
        if (!typeGroup.querySelector('.selection-btn.active')) {
            showError(typeGroup.closest('.form-group'), "Please select type.");
            ok = false;
        }
        if (breed.value.trim() === "") {
            showError(breed.closest('.form-group'), "Please enter breed.");
            ok = false;
        }
        if (!genderGroup.querySelector('.selection-btn.active')) {
            showError(genderGroup.closest('.form-group'), "Please select gender.");
            ok = false;
        }
        if (!birthDate.value) {
            showError(birthDate.closest('.form-group'), "Please select birth date.");
            ok = false;
        }
        if (fileUpload.files.length === 0) {
            showError(uploadArea.parentElement, "Please upload a photo.");
            ok = false;
        }

        return ok;
    }
    saveButton.addEventListener('click', async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

   
       const petData = {
    id: null, 
 
    petID: petID.value.trim(), 
    
    type: typeGroup.querySelector('.selection-btn.active').dataset.value,
    name: name.value.trim(),
    gender: genderGroup.querySelector('.selection-btn.active').dataset.value,
    breed: breed.value.trim(),
    birthDate: birthDate.value, 
     weight: weight.value ? parseFloat(weight.value) : 0,
    sterilisation: sterilisation.checked,
    vaccine: vaccine.checked,
    disease: disease.value.trim(),
    foodAllergy: foodAllergy.value.trim(),
};

        const formData = new FormData();
        const petJsonBlob = new Blob([JSON.stringify(petData)], {
            type: 'application/json'
        });
        formData.append('pet', petJsonBlob); 
        if (fileUpload.files.length > 0) {
             formData.append('file', fileUpload.files[0]); 
        }

         try {
        saveButton.disabled = true;
        saveButton.textContent = "Saving...";

        const url = `http://localhost:8081/api/pets/${petIdToUpdate}`;
        
        const response = await fetch(url, {
            method: "PUT",
            body: formData 
        });

            const result = await response.json();
            alert(`Saved Pet ID ${result.id} to Database! Image URL: ${result.image}`);
            console.log(result);
        } catch (err) {
            if (err.message.includes("timestamp")) {
                alert("Server Error: Check console for full details.");
                console.error("Full Backend Error Response:", err.message);
            } else {
                alert("Error: " + err.message);
            }
        } finally {
            saveButton.disabled = false;
            saveButton.textContent = "Save";
        }
    });
});