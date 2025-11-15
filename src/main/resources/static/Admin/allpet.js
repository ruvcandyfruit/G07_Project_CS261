document.addEventListener('DOMContentLoaded', () => {

    // --- 1. จำลองฐานข้อมูล ---
    // (ในโลกจริง ข้อมูลนี้จะมาจาก fetch('/api/pets'))
    const mockPetData = [
        { id: '0001', name: 'พยัคฆ์เสี้ยววาน', imageUrl: 'https://i.pravatar.cc/150?img=1', type: 'Cat', breed: 'Persian', status: 'No Request' },
        { id: '0002', name: 'น้องเหมียว', imageUrl: 'https://i.pravatar.cc/150?img=2', type: 'Cat', breed: 'Persian', status: 'Pending' },
        { id: '0003', name: 'เจ้าสี่ขา', imageUrl: 'https://i.pravatar.cc/150?img=3', type: 'Dog', breed: 'Golden Retriever', status: 'Approved' },
        { id: '0004', name: 'ส้มซ่า', imageUrl: 'https://i.pravatar.cc/150?img=4', type: 'Cat', breed: 'Siam', status: 'Completed' },
        { id: '0005', name: 'ด่างทับทิม', imageUrl: 'https://i.pravatar.cc/150?img=5', type: 'Dog', breed: 'Mixed', status: 'Closed' },
        { id: '0006', name: 'มณี', imageUrl: 'https://i.pravatar.cc/150?img=6', type: 'Cat', breed: 'Persian', status: 'No Request' },
        { id: '0007', name: 'โกลดี้', imageUrl: 'https://i.pravatar.cc/150?img=7', type: 'Dog', breed: 'Golden Retriever', status: 'Pending' },
    ];
    
    // --- 2. ตัวแปรเก็บข้อมูลหลัก (Master Data) ---
    let allPets = []; 

    // --- 3. DOM Selections ---
    const tableBody = document.getElementById('petTableBody');
    const petCount = document.getElementById('petCount');
    const searchInput = document.getElementById('searchInput');
    const pendingToggle = document.getElementById('pendingToggle');
    
    // Filter Modal
    const filterButton = document.getElementById('filterButton');
    const filterModal = document.getElementById('filterModal');
    const closeFilterModal = document.getElementById('closeFilterModal');
    const applyFilterBtn = document.getElementById('applyFilterBtn');
    const resetFilterBtn = document.getElementById('resetFilterBtn');
    const statusFilter = document.getElementById('statusFilter');
    const typeFilter = document.getElementById('typeFilter');
    const breedFilter = document.getElementById('breedFilter');

    // Delete Modal
    const deleteModal = document.getElementById('deleteModal');
    const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    let petIdToDelete = null;

    // --- 4. ฟังก์ชันหลักในการแสดงผลตาราง ---
    function renderTable(pets) {
        tableBody.innerHTML = ''; // ล้างตารางเก่า

        if (pets.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 20px;">No pets found.</td></tr>';
            return;
        }

        pets.forEach(pet => {
            const tr = document.createElement('tr');
            
            // สร้าง CSS class สำหรับ status
            const statusClass = pet.status.toLowerCase().replace(' ', '-'); // 'No Request' -> 'no-request'
            
            // สร้างปุ่ม View Request ให้เปลี่ยนสีตาม Status
            let viewRequestClass = '';
            if (pet.status === 'Pending') {
                viewRequestClass = 'pending';
            }

            tr.innerHTML = `
                <td>${pet.id}</td>
                <td>
                    <a href="petdetail.html?id=${pet.id}" class="pet-name-cell">
                        <img src="${pet.imageUrl}" alt="${pet.name}" class="pet-profile-img">
                        <span>${pet.name}</span>
                    </a>
                </td>
                <td>${pet.type}</td>
                <td>${pet.breed}</td>
                <td><span class="status-tag status-${statusClass}">${pet.status}</span></td>
                <td class="actions-cell">
                    <button class="action-button view-request-btn ${viewRequestClass}">View Request</button>
                    <a href="add-edit-pet.html?mode=edit&id=${pet.id}">
                        <button class="action-button edit-btn">Edit</button>
                    </a>
                    <button class="action-button delete-btn" data-id="${pet.id}">Delete</button>
                </td>
            `;
            tableBody.appendChild(tr);
        });
    }

    // --- 5. ฟังก์ชันอัปเดตจำนวนสัตว์ ---
    function updatePetCount(count) {
        petCount.textContent = `There are ${count} pets in total`;
    }

    // --- 6. ฟังก์ชัน Filter และ Search (หัวใจหลัก) ---
    function applyFilters() {
        // 6.1. ดึงค่าจาก Filter ทั้งหมด
        const searchText = searchInput.value.toLowerCase();
        const pendingOnly = pendingToggle.checked;
        const status = statusFilter.value;
        const type = typeFilter.value;
        const breed = breedFilter.value;

        // 6.2. เริ่มต้นด้วยข้อมูลทั้งหมด
        let filteredPets = allPets;

        // 6.3. กรองด้วย Toggle ก่อน (ถ้าเปิด)
        if (pendingOnly) {
            filteredPets = filteredPets.filter(pet => pet.status === 'Pending');
        }

        // 6.4. กรองด้วย Search (ค้นหาจากชื่อ)
        if (searchText) {
            filteredPets = filteredPets.filter(pet => 
                pet.name.toLowerCase().includes(searchText)
            );
        }

        // 6.5. กรองด้วย Modal (Status)
        if (status) {
            filteredPets = filteredPets.filter(pet => pet.status === status);
        }

        // 6.6. กรองด้วย Modal (Type)
        if (type) {
            filteredPets = filteredPets.filter(pet => pet.type === type);
        }

        // 6.7. กรองด้วย Modal (Breed)
        if (breed) {
            filteredPets = filteredPets.filter(pet => pet.breed === breed);
        }
        
        // 6.8. แสดงผลลัพธ์
        renderTable(filteredPets);
        updatePetCount(filteredPets.length);
    }

    // --- 7. ฟังก์ชันจัดการ Modal ---
    function showModal(modal) {
        modal.classList.remove('modal-hidden');
    }
    function hideModal(modal) {
        modal.classList.add('modal-hidden');
    }

    // --- 8. ฟังก์ชันจัดการการลบ ---
    function handleDeleteClick(e) {
        const target = e.target.closest('.delete-btn');
        if (target) {
            petIdToDelete = target.dataset.id;
            showModal(deleteModal);
        }
    }

    function confirmDelete() {
        if (petIdToDelete) {
            // (ในโลกจริง: await fetch(`/api/pets/${petIdToDelete}`, { method: 'DELETE' }))
            
            // อัปเดตข้อมูล Master
            allPets = allPets.filter(pet => pet.id !== petIdToDelete);
            
            // อัปเดตหน้าจอ
            applyFilters();
            
            hideModal(deleteModal);
            petIdToDelete = null;
        }
    }

    // --- 9. Event Listeners (การผูกปุ่ม) ---
    
    // Search และ Toggle
    searchInput.addEventListener('input', applyFilters);
    pendingToggle.addEventListener('change', applyFilters);
    
    // Filter Modal
    filterButton.addEventListener('click', () => showModal(filterModal));
    closeFilterModal.addEventListener('click', () => hideModal(filterModal));
    applyFilterBtn.addEventListener('click', () => {
        applyFilters();
        hideModal(filterModal);
    });
    resetFilterBtn.addEventListener('click', () => {
        statusFilter.value = '';
        typeFilter.value = '';
        breedFilter.value = '';
        applyFilters();
        hideModal(filterModal);
    });
    
    // Delete Modal
    // (ใช้ Event Delegation เพราะปุ่มลบถูกสร้างแบบ Dynamic)
    tableBody.addEventListener('click', handleDeleteClick);
    cancelDeleteBtn.addEventListener('click', () => hideModal(deleteModal));
    confirmDeleteBtn.addEventListener('click', confirmDelete);

    // --- 10. ฟังก์ชันเริ่มต้น (Init) ---
    function initializeApp() {
        // (ในโลกจริง: allPets = await fetch('/api/pets').then(res => res.json()))
        allPets = mockPetData;
        
        renderTable(allPets);
        updatePetCount(allPets.length);
    }

    // เริ่มการทำงาน!
    initializeApp();

});