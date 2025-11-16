document.addEventListener('DOMContentLoaded', () => {

    // --- 1. จำลองฐานข้อมูล ---
    const mockPetData = [
        { id: '0001', name: 'พยัคฆ์เสี้ยววาน', imageUrl: 'https://tse4.mm.bing.net/th/id/OIP.HnHSF9J0wkbZWn1unKAOxwHaEJ?cb=ucfimg2ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3', type: 'Cat', breed: 'Persian', status: 'No Request' },
        { id: '0002', name: 'น้องเหมียว', imageUrl: 'https://tse4.mm.bing.net/th/id/OIP.HnHSF9J0wkbZWn1unKAOxwHaEJ?cb=ucfimg2ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3', type: 'Cat', breed: 'Persian', status: 'Pending' },
        { id: '0003', name: 'เจ้าสี่ขา', imageUrl: 'https://tse4.mm.bing.net/th/id/OIP.HnHSF9J0wkbZWn1unKAOxwHaEJ?cb=ucfimg2ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3', type: 'Dog', breed: 'Golden Retriever', status: 'Approved' },
        { id: '0004', name: 'ส้มซ่า', imageUrl: 'https://tse4.mm.bing.net/th/id/OIP.HnHSF9J0wkbZWn1unKAOxwHaEJ?cb=ucfimg2ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3', type: 'Cat', breed: 'Siam', status: 'Completed' },
        { id: '0005', name: 'ด่างทับทิม', imageUrl: 'https://tse4.mm.bing.net/th/id/OIP.HnHSF9J0wkbZWn1unKAOxwHaEJ?cb=ucfimg2ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3', type: 'Dog', breed: 'Mixed', status: 'Closed' },
        { id: '0006', name: 'มณี', imageUrl: 'https://tse4.mm.bing.net/th/id/OIP.HnHSF9J0wkbZWn1unKAOxwHaEJ?cb=ucfimg2ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3', type: 'Cat', breed: 'Persian', status: 'No Request' },
        { id: '0007', name: 'โกลดี้', imageUrl: 'https://tse4.mm.bing.net/th/id/OIP.HnHSF9J0wkbZWn1unKAOxwHaEJ?cb=ucfimg2ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3', type: 'Dog', breed: 'Golden Retriever', status: 'Pending' },
    ];
    
    // --- 2. ตัวแปรเก็บข้อมูลหลัก (Master Data) ---
    let allPets = []; 

    // --- 3. DOM Selections ---
    const tableBody = document.getElementById('petTableBody');
    const petCount = document.getElementById('petCount');
    const searchInput = document.getElementById('searchInput');
    const pendingToggle = document.getElementById('pendingToggle');
    
    // (โค้ดส่วน Modal เหมือนเดิม)
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

    // --- 4. ฟังก์ชันหลักในการแสดงผลตาราง (อัปเดตแล้ว!) ---
    function renderTable(pets) {
        tableBody.innerHTML = ''; 

        if (pets.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 20px;">No pets found.</td></tr>';
            return;
        }

        pets.forEach(pet => {
            const tr = document.createElement('tr');
            
            // สร้าง CSS class สำหรับ status (ยังต้องใช้)
            const statusClass = pet.status.toLowerCase().replace(' ', '-'); 
            
            

            // [!! Logic 2 !!] (ใหม่) สร้าง "ป้าย Status"
            let statusTagHTML = '';
            switch (pet.status) {
                case 'Pending':
                    // ถ้า Pending: ไปหน้า requests.html
                    statusTagHTML = `<a href="requests.html?id=${pet.id}" class="status-tag status-pending">${pet.status}</a>`;
                    break;
                case 'Approved':
                    // ถ้า Approved: ไปหน้า request-status.html
                    statusTagHTML = `<a href="request-status.html?id=${pet.id}&status=Approved" class="status-tag status-approved">${pet.status}</a>`;
                    break;
                case 'Completed':
                    // ถ้า Completed: ไปหน้า request-status.html
                    statusTagHTML = `<a href="request-status.html?id=${pet.id}&status=Completed" class="status-tag status-completed">${pet.status}</a>`;
                    break;
                default:
                    // ถ้า Closed หรือ No Request: เป็น <span> ธรรมดา
                    statusTagHTML = `<span class="status-tag status-${statusClass}">${pet.status}</span>`;
            }
            // [!! จบส่วนที่แก้ไข !!]


           // ... (โค้ดสร้าง viewRequestButtonHTML และ statusTagHTML อยู่ข้างบน) ...

            // [!! นี่คือ tr.innerHTML ที่ถูกต้อง (มีครบทุกคอลัมน์) !!]
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
                
                <td>${statusTagHTML}</td> 

                <td class="action-col action-col-edit">
                    <a href="add-edit-pet.html?mode=edit&id=${pet.id}">
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
        });// <-- สิ้นสุด renderTable
    }

    // --- 5. ฟังก์ชันอัปเดตจำนวนสัตว์ (เหมือนเดิม) ---
    function updatePetCount(count) {
        petCount.textContent = `There are ${count} pets in total`;
    }

    // --- 6. ฟังก์ชัน Filter และ Search (เหมือนเดิม) ---
    function applyFilters() {
        const searchText = searchInput.value.toLowerCase();
        const pendingOnly = pendingToggle.checked;
        const status = statusFilter.value;
        const type = typeFilter.value;
        const breed = breedFilter.value;
        let filteredPets = allPets;
        if (pendingOnly) {
            filteredPets = filteredPets.filter(pet => pet.status === 'Pending');
        }
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

    // --- 7. ฟังก์ชันจัดการ Modal (เหมือนเดิม) ---
    function showModal(modal) {
        modal.classList.remove('modal-hidden');
    }
    function hideModal(modal) {
        modal.classList.add('modal-hidden');
    }

    // --- 8. ฟังก์ชันจัดการการลบ (เหมือนเดิม) ---
    function handleDeleteClick(e) {
        const target = e.target.closest('.delete-btn');
        if (target) {
            petIdToDelete = target.dataset.id;
            showModal(deleteModal);
        }
    }

    function confirmDelete() {
        if (petIdToDelete) {
            allPets = allPets.filter(pet => pet.id !== petIdToDelete);
            applyFilters();
            hideModal(deleteModal);
            petIdToDelete = null;
        }
    }

    // --- 9. Event Listeners (เหมือนเดิม) ---
    searchInput.addEventListener('input', applyFilters);
    pendingToggle.addEventListener('change', applyFilters);
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
    tableBody.addEventListener('click', handleDeleteClick);
    cancelDeleteBtn.addEventListener('click', () => hideModal(deleteModal));
    confirmDeleteBtn.addEventListener('click', confirmDelete);

    // --- 10. ฟังก์ชันเริ่มต้น (Init) [!! อัปเกรดแล้ว !!] ---
    function initializeApp() {
        // (ในโลกจริง: allPets = await fetch('/api/pets').then(res => res.json()))
        allPets = mockPetData;
        
        // [!! LOGIC ใหม่ !!]
        // 1. อ่านค่า 'status' จาก URL (เช่น ?status=Pending)
        const urlParams = new URLSearchParams(window.location.search);
        const statusFromURL = urlParams.get('status');

        if (statusFromURL) {
            // 2. ถ้ามีค่าส่งมา:
            // 2.1 หา Dropdown ของ Status
            const statusFilter = document.getElementById('statusFilter');
            if (statusFilter) {
                // 2.2 สั่งให้ Dropdown เลือกค่านั้น
                statusFilter.value = statusFromURL;
            }
            
            // 2.3 สั่งให้หน้าเว็บ "กรอง" ข้อมูลทันที
            applyFilters();

        } else {
            // 3. ถ้าไม่มีค่าส่งมา (เปิดหน้า All Pet ตรงๆ):
            // (ทำงานแบบเดิม)
            renderTable(allPets);
            updatePetCount(allPets.length);
        }
    }

    // เริ่มการทำงาน!
    initializeApp();

});