document.addEventListener('DOMContentLoaded', () => {

    // --- 1. ตัวแปรหลัก (Master Data) และ API URL ---
    let allPets = [];
    const API_URL = "http://localhost:8081/api/pets";
    const STATUS_API_URL = "http://localhost:8081/api/userform/statuses"; // 🔴 Endpoint สำหรับ Status

    // --- 2. DOM Selections ---
    const tableBody = document.getElementById('petTableBody');
    const petCount = document.getElementById('petCount');
    const searchInput = document.getElementById('searchInput');
    const pendingToggle = document.getElementById('pendingToggle');
    const deleteModal = document.getElementById('deleteModal');
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    let petIdToDelete = null;

    // 🟢 (ต้องแน่ใจว่า Elements อื่นๆ เช่น filterButton, typeGroup มี ID ถูกต้อง)
    
    // --- 3. Modal Helper Functions (ต้องถูกกำหนดก่อนใช้งาน) ---
    // (***ฟังก์ชันเหล่านี้จำเป็นต้องมีในไฟล์ของคุณ***)
    function showModal(modal) { modal.classList.remove('modal-hidden'); }
    function hideModal(modal) { modal.classList.add('modal-hidden'); }
    
    // 🟢 ฟังก์ชัน Modal สำหรับปุ่ม Delete (ถูกเรียกจาก onclick ใน HTML)
    window.openDeleteModal = (id) => {
        petIdToDelete = id.toString(); // เก็บ ID เป็น String
        showModal(deleteModal); 
    };

    // --- 4. Core Utility Functions ---

    function updatePetCount(count) {
        petCount.textContent = `There are ${count} pets in total`;
    }

    // 🔴 ฟังก์ชันดึง Status และ Mapping
    async function fetchPetStatuses() {
        try {
            const response = await fetch(STATUS_API_URL);
            if (!response.ok) throw new Error(`HTTP status: ${response.status}`);
            const statuses = await response.json(); 

            allPets.forEach(pet => {
                // แปลง ID Long เป็น String เพื่อให้เปรียบเทียบกับ petId (String) จาก API ได้
                const petIdString = pet.id ? pet.id.toString() : pet.id; 
                
                // ค้นหาจาก petID (String) หรือ id (Long/String)
                const statusObj = statuses.find(s => 
                    s.petId === pet.petID || s.petId === petIdString
                );
                
                if (statusObj) {
                   pet.status = statusObj.status; 
                }
            });

        } catch (error) {
            console.error("Error fetching pet statuses:", error);
            // ปล่อยให้โค้ดทำงานต่อไปด้วยสถานะเริ่มต้นที่กำหนดไว้
        }
    }
    
    // 🔴 ฟังก์ชันลบข้อมูล (ถูกเรียกเมื่อกดยืนยันใน Modal)
    async function confirmDelete() {
        if (petIdToDelete) {
            try {
                const response = await fetch(`${API_URL}/${petIdToDelete}`, { method: 'DELETE' });
                if (response.ok) {
                    allPets = allPets.filter(pet => pet.id.toString() !== petIdToDelete); // 🔴 เปรียบเทียบ ID เป็น String
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


    // 🔴 ฟังก์ชันแสดงตาราง (Render Table)
    function renderTable(pets) {
        tableBody.innerHTML = ''; 
        if (pets.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 20px;">No pets found.</td></tr>';
            return;
        }

        pets.forEach(pet => {
            // 🟢 การสร้าง Status Tag
            const displayStatus = pet.status || 'No Request';
            const statusClass = displayStatus.toLowerCase().replace(' ', '-'); 
            let statusTagHTML = '';
            
            switch (displayStatus) {
                case 'Pending':
                    statusTagHTML = `<a href="requests.html?id=${pet.id}" class="status-tag status-pending">${displayStatus}</a>`;
                    break;
                // ... (Approved และ Completed เหมือนเดิม) ...
                default:
                    statusTagHTML = `<span class="status-tag status-${statusClass}">${displayStatus}</span>`;
            }

            const tr = document.createElement('tr');
            const displayId = pet.petID || pet.id; 
            // 🟢 การสร้าง Absolute URL สำหรับรูปภาพ
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
                    <button class="action-button delete-btn" data-id="${pet.id}" onclick="openDeleteModal(${pet.id})">
                        <i class="fa-solid fa-trash-can"></i> Delete
                    </button>
                </td>
            `;
            tableBody.appendChild(tr);
        });
    }
    
    // 🔴 ฟังก์ชัน Filter และ Search
    function applyFilters() {
        // ... (โค้ด Filter Logic ที่คุณมีอยู่) ...
        const searchText = searchInput.value.toLowerCase();
        // ... (การดึงค่าจาก DOM filters) ...
        
        // (สมมติว่าคุณมี Logic การกรองที่ถูกต้อง)
        let filteredPets = allPets.filter(pet => {
            // Logic การกรอง...
            return pet.name.toLowerCase().includes(searchText);
        });
        
        renderTable(filteredPets);
        updatePetCount(filteredPets.length);
    }


    // --- 5. Data Fetching Function ---

    async function fetchPets() {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json(); 
            allPets = data;

            // 🟢 1. กำหนดสถานะเริ่มต้น
            allPets.forEach(pet => {
                 pet.status = 'No Request';
            });
            
            // 🟢 2. เรียกดึง Status และ Mapping
            await fetchPetStatuses(); 

            renderTable(allPets);
            updatePetCount(allPets.length);

        } catch (error) {
            console.error("Could not fetch pets:", error);
            tableBody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 20px; color: red;">Failed to load data from server.</td></tr>';
            updatePetCount(0);
        }
    }
    
    // --- 6. Event Listeners ---
    // 🟢 การผูก Event สำหรับ Modal ยืนยันการลบ
    confirmDeleteBtn.addEventListener('click', confirmDelete);

    // ... (Listeners อื่นๆ) ...
    
    // --- 7. Initialization ---
    function initializeApp() {
        fetchPets();
    }
    
    initializeApp();
});