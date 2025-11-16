document.addEventListener('DOMContentLoaded', () => {



    // --- 1. ตัวแปรหลัก (Master Data) และ API URL ---

    let allPets = [];

    const API_URL = "http://localhost:8081/api/pets";



    // --- 2. DOM Selections ---

    const tableBody = document.getElementById('petTableBody');

    const petCount = document.getElementById('petCount');

    const searchInput = document.getElementById('searchInput');

    const pendingToggle = document.getElementById('pendingToggle');

    // ... (Elements อื่น ๆ) ...

    const filterButton = document.getElementById('filterButton');

    const filterModal = document.getElementById('filterModal');

    const closeFilterModal = document.getElementById('closeFilterModal');

    const applyFilterBtn = document.getElementById('applyFilterBtn');

    const resetFilterBtn = document.getElementById('resetFilterBtn');

    const statusFilter = document.getElementById('statusFilter');

    const typeFilter = document.getElementById('typeFilter');

    const breedFilter = document.getElementById('breedFilter');

    const deleteModal = document.getElementById('deleteModal');

    const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');

    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');

    let petIdToDelete = null;





    // --- 3. Helper Functions (Image/Toggle) ---

    // ... (โค้ด Image Upload Preview และ Button Toggle ไม่เปลี่ยนแปลง) ...



    // 🟢 แก้ไข: updatePetCount ถูกย้ายมาไว้ก่อน fetchPets

    function updatePetCount(count) {

        petCount.textContent = `There are ${count} pets in total`;

    }



    // 🔴 แก้ไข: renderTable ถูกย้ายมาไว้ก่อน fetchPets

    function renderTable(pets) {

        tableBody.innerHTML = '';



        if (pets.length === 0) {

            tableBody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 20px;">No pets found.</td></tr>';

            return;

        }



        pets.forEach(pet => {

            // 🔴 ใช้ pet.status โดยตรง (ซึ่งถ้าไม่มีจะใช้ 'No Request')

            const displayStatus = pet.status || 'No Request';

            const statusClass = displayStatus.toLowerCase().replace(' ', '-');

            let statusTagHTML = '';



            switch (displayStatus) {

                case 'Pending':

                    statusTagHTML = `<a href="requests.html?id=${pet.id}" class="status-tag status-pending">${displayStatus}</a>`;

                    break;

                case 'Approved':

                    statusTagHTML = `<a href="request-status.html?id=${pet.id}&status=Approved" class="status-tag status-approved">${displayStatus}</a>`;

                    break;

                case 'Completed':

                    statusTagHTML = `<a href="request-status.html?id=${pet.id}&status=Completed" class="status-tag status-completed">${displayStatus}</a>`;

                    break;

                default:

                    statusTagHTML = `<span class="status-tag status-${statusClass}">${displayStatus}</span>`;

            }

           

            const tr = document.createElement('tr');

            const displayId = pet.petID || pet.id;

           const petImageUrl = `http://localhost:8081${pet.image || '/images/placeholder.jpg'}`;



            tr.innerHTML = `

                <td>${displayId}</td>

                <td>

                    <a href="petdetail.html?id=${pet.id}" class="pet-name-cell">

                        <img src="${petImageUrl}" alt="${pet.name}" class="pet-profile-img">

                        <span>${pet.name}</span>

                    </a>

                </td>

                <td>${pet.type || ''}</td>

                <td>${pet.breed || ''}</td>

                <td>${statusTagHTML}</td>

                <td class="action-col action-col-edit">

                    <a href="addpet.html?mode=edit&id=${pet.id}">

                        <button class="action-button edit-btn">

                            <i class="fa-solid fa-pencil"></i> Edit

                        </button>

                    </a>

                </td>

                <td class="action-col action-col-delete">

                    <button class="action-button delete-btn" data-id="${pet.id}">

                        <i class="fa-solid fa-trash-can"></i> Delete

                    </button>

                </td>

            `;

            tableBody.appendChild(tr);

        });

    }

   

    // 🔴 แก้ไข: confirmDelete ถูกย้ายมาไว้ก่อน applyFilters

    async function confirmDelete() {

        if (petIdToDelete) {

            try {

                const response = await fetch(`${API_URL}/${petIdToDelete}`, { method: 'DELETE' });

                if (response.ok) {

                    allPets = allPets.filter(pet => pet.id !== petIdToDelete);

                    applyFilters();

                    alert(`Pet ID ${petIdToDelete} successfully deleted.`);

                } else {

                    const errorText = await response.text();

                    alert(`Failed to delete pet: ${response.status} - ${errorText}`);

                }

            } catch (error) {

                alert('Error connecting to server during deletion.');

                console.error('Delete error:', error);

            }

            hideModal(deleteModal);

            petIdToDelete = null;

        }

    }

   

    // 🔴 ฟังก์ชัน fetchPetStatuses ถูก Comment ออกไปชั่วคราว

    /* async function fetchPetStatuses() {

       // ... (โค้ดถูก Comment เพื่อแยกปัญหา)

    }

    */



    // 🔴 แก้ไข: applyFilters ถูกย้ายมาไว้ก่อน initializeApp

    function applyFilters() {

        // ... (โค้ด Filter Logic ที่เหลือ) ...

        const searchText = searchInput.value.toLowerCase();

        const pendingToggle = document.getElementById('pendingToggle'); // ต้องแน่ใจว่าได้มีการเรียก DOM element เหล่านี้

        const statusFilter = document.getElementById('statusFilter');

        const typeFilter = document.getElementById('typeFilter');

        const breedFilter = document.getElementById('breedFilter');

       

        const pendingOnly = pendingToggle.checked;

        const status = statusFilter.value;

        const type = typeFilter.value;

        const breed = breedFilter.value;

        let filteredPets = allPets;

       

        if (pendingOnly) {

            filteredPets = filteredPets.filter(pet => (pet.status || 'No Request') === 'Pending');

        }

        // ... (โค้ด filter ที่เหลือ) ...

        if (searchText) {

            filteredPets = filteredPets.filter(pet =>

                pet.name.toLowerCase().includes(searchText)

            );

        }

        if (status) {

            filteredPets = filteredPets.filter(pet => pet.status === status);

        }

        if (type) {

            filteredPets = filteredPets.filter(pet => pet.type === type);

        }

        if (breed) {

            filteredPets = filteredPets.filter(pet => pet.breed === breed);

        }



        renderTable(filteredPets);

        updatePetCount(filteredPets.length);

    }





    // --- 5. Data Fetching Function ---



    // 🔴 แก้ไข: fetchPets ถูกย้ายมาไว้ก่อน initializeApp

    async function fetchPets() {

        try {

            const response = await fetch(API_URL);

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const data = await response.json();

            allPets = data;



            // 🔴 ลบการเรียก fetchPetStatuses() ออกไปแล้ว



            // 🟢 กำหนดสถานะเริ่มต้นให้กับ Pet แต่ละตัว

            allPets.forEach(pet => {

                pet.status = 'No Request';

            });



            renderTable(allPets);

            updatePetCount(allPets.length);



        } catch (error) {

            console.error("Could not fetch pets:", error);

            tableBody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 20px; color: red;">Failed to load data from server.</td></tr>';

            updatePetCount(0);

        }

    }



    // --- 6. Event Listeners ---

    // ... (Listeners อื่นๆ) ...

    searchInput.addEventListener('input', applyFilters);

    pendingToggle.addEventListener('change', applyFilters);

   

    // --- 7. Initialization ---

    // 🔴 แก้ไข: initializeApp และการเรียกใช้ ถูกย้ายมาอยู่ท้ายสุด

    function initializeApp() {

        fetchPets();

    }

   

    // 🔴 (ต้องแน่ใจว่าฟังก์ชัน Modal เช่น hideModal, showModal, handleDeleteClick ถูกประกาศไว้ก่อนหน้านี้ในโค้ดต้นฉบับของคุณ)



    initializeApp();

});