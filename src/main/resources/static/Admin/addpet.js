document.addEventListener('DOMContentLoaded', () => {

    const API_BASE_URL = "http://localhost:8081/api/pets"; 
    
    // --- DOM Selections ---
    const petIDInput = document.getElementById('petId'); 
    const saveButton = document.getElementById('saveButton');
    
    
    // 🟢 Elements ที่ใช้ใน Validation/Preview
    const typeGroup = document.getElementById('typeGroup');
    const genderGroup = document.getElementById('genderGroup');
    const imagePreview = document.getElementById('imagePreview');
    const fileUpload = document.getElementById('fileUpload');
    const uploadPrompt = document.getElementById('upload-prompt');
    const uploadArea = document.querySelector('.upload-area'); 
    const birthDate = document.getElementById('petDob');
    const name = document.getElementById('petName');
    const breed = document.getElementById('petBreed');
    const foodAllergy = document.getElementById('foodAllergy');
    const disease = document.getElementById('disease');
    const sterilisation = document.getElementById('sterilized');
    const vaccine = document.getElementById('vaccinated');
    const weight = document.getElementById('petWeight');

 
    let currentPetLongId = null; 

    fileUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        
        if (file) {
            const reader = new FileReader();
            
            reader.onload = (event) => {
           ฃ
                imagePreview.src = event.target.result; 
                imagePreview.style.display = 'block';
                uploadPrompt.style.display = 'none';
            };
            reader.readAsDataURL(file);
        }
    });

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
    function clearAllErrors() { 
        document.querySelectorAll('.invalid').forEach(el => clearError(el));
    }
   
    function validateForm() {
        clearAllErrors();
        let ok = true;
        
     
        const hasExistingImage = imagePreview.src && !imagePreview.src.includes('placeholder.jpg');

     
        if (petIDInput.value.trim() === "") {
            showError(petIDInput.closest('.form-group'), "Please enter Pet ID.");
            ok = false;
        }
       

    
        if (fileUpload.files.length === 0) {
          
            if (!hasExistingImage) { 
                showError(uploadArea.parentElement, "Please upload a photo.");
                ok = false;
            }
          
        }

        return ok;
    }
    


 
    const urlParams = new URLSearchParams(window.location.search);
    const idFromUrl = urlParams.get('id'); 

    if (idFromUrl) {
        currentPetLongId = idFromUrl; 
        saveButton.textContent = "Loading...";
        saveButton.disabled = true;
        loadPetData(currentPetLongId);
    } else {
        alert("Error: Pet ID is missing. Cannot proceed with editing.");
        petIDInput.readOnly = true; 
    }
  
    async function loadPetData(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/${id}`);
            if (!response.ok) throw new Error('Failed to fetch pet details.');
            const petDetails = await response.json();

         
            petIDInput.value = petDetails.petID; 
            petIDInput.readOnly = true; 
            
         
            document.getElementById('petName').value = petDetails.name || '';
            document.getElementById('petDob').value = petDetails.birthDate || ''; 
            document.getElementById('petWeight').value = petDetails.weight || '';
            document.getElementById('disease').value = petDetails.disease || '';
            document.getElementById('foodAllergy').value = petDetails.foodAllergy || '';
            document.getElementById('petBreed').value = petDetails.breed || ''; 


           
            document.getElementById('sterilized').checked = petDetails.sterilisation || false;
            document.getElementById('vaccinated').checked = petDetails.vaccine || false;

           
            if (petDetails.image) {
                const petImageUrl = `http://localhost:8081${petDetails.image}`;
                document.getElementById('imagePreview').src = petImageUrl;
                document.getElementById('imagePreview').style.display = 'block';
                document.getElementById('upload-prompt').style.display = 'none';
            }

         
            const typeButton = document.querySelector(`#typeGroup button[data-value="${petDetails.type}"]`);
            if (typeButton) {
                document.querySelectorAll('#typeGroup .selection-btn').forEach(btn => btn.classList.remove('active'));
                typeButton.classList.add('active');
            }
            const genderButton = document.querySelector(`#genderGroup button[data-value="${petDetails.gender}"]`);
            if (genderButton) {
                document.querySelectorAll('#genderGroup .selection-btn').forEach(btn => btn.classList.remove('active'));
                genderButton.classList.add('active');
            }

            saveButton.textContent = "Update";
            saveButton.disabled = false;

        } catch (error) {
            console.error("Error loading data:", error);
            alert("Could not load pet data for editing.");
            saveButton.textContent = "Load Failed";
        }
    }


    saveButton.addEventListener('click', async (e) => {
        e.preventDefault();
   
        if (!currentPetLongId || !validateForm()) return; 

       
        const petData = {
            id: currentPetLongId, 
            petID: petIDInput.value.trim(), 
            type: document.querySelector('#typeGroup .selection-btn.active').dataset.value,
            name: document.getElementById('petName').value.trim(),
            gender: document.querySelector('#genderGroup .selection-btn.active').dataset.value,
            breed: document.getElementById('petBreed').value.trim(),
            birthDate: document.getElementById('petDob').value,
            weight: document.getElementById('petWeight').value ? parseFloat(document.getElementById('petWeight').value) : 0,
            sterilisation: document.getElementById('sterilized').checked,
            vaccine: document.getElementById('vaccinated').checked,
            disease: document.getElementById('disease').value.trim(),
            foodAllergy: document.getElementById('foodAllergy').value.trim(),
            
        
            image: fileUpload.files.length === 0 ? document.getElementById('imagePreview').src.replace('http://localhost:8081', '') : null, 
        };

        const formData = new FormData();
        const petJsonBlob = new Blob([JSON.stringify(petData)], { type: 'application/json' });
        
        formData.append('pet', petJsonBlob); 
        if (fileUpload.files.length > 0) {
             formData.append('file', fileUpload.files[0]); 
        }

      
        const url = `${API_BASE_URL}/${currentPetLongId}`; 
        
        try {
            saveButton.disabled = true;
            saveButton.textContent = "Updating...";

            const response = await fetch(url, {
                method: "PUT",
                body: formData 
            });

            if (!response.ok) {
                 const txt = await response.text();
                 throw new Error(txt);
            }

            const result = await response.json();
            alert(`Pet ${result.petID} updated successfully!`);
            console.log(result);
       
        } catch (err) {
            console.error("Full Backend Error Response:", err.message);
            alert(`Server Error (PUT): Check console for full details.`);
        } finally {
            saveButton.disabled = false;
            saveButton.textContent = "Update";
        }
    });
    
 
});