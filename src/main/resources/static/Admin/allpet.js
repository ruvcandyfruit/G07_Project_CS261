(function enforceAdmin() {
  try {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!user || user.role !== 'ADMIN') {
      window.location.href = '/index.html';
    }
  } catch (_) {
    window.location.href = '/index.html';
  }
})();

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Master Data + API ---
    let allPets = [];
    const API_URL = "http://localhost:8081/api/pets";

    // --- 2. DOM elements ---
    const STATUS_API_URL = "http://localhost:8081/api/userform/statuses";

    // --- 2. Mock Data (fallback) ---
    // const mockPetData = [
    //     { id: '0001', name: 'พยัคฆ์เสี้ยววาน', imageUrl: 'https://tse4.mm.bing.net/th/id/OIP.HnHSF9J0wkbZWn1unKAOxwHaEJ?cb=ucfimg2ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3', type: 'Cat', breed: 'Persian', status: 'No Request' },
    //     { id: '0002', name: 'น้องเหมียว', imageUrl: 'https://tse4.mm.bing.net/th/id/OIP.HnHSF9J0wkbZWn1unKAOxwHaEJ?cb=ucfimg2ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3', type: 'Cat', breed: 'Persian', status: 'Pending' },
    //     { id: '0003', name: 'เจ้าสี่ขา', imageUrl: 'https://tse4.mm.bing.net/th/id/OIP.HnHSF9J0wkbZWn1unKAOxwHaEJ?cb=ucfimg2ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3', type: 'Dog', breed: 'Golden Retriever', status: 'Approved' },
    //     { id: '0004', name: 'ส้มซ่า', imageUrl: 'https://tse4.mm.bing.net/th/id/OIP.HnHSF9J0wkbZWn1unKAOxwHaEJ?cb=ucfimg2ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3', type: 'Cat', breed: 'Siam', status: 'Completed' },
    //     { id: '0005', name: 'ด่างทับทิม', imageUrl: 'https://tse4.mm.bing.net/th/id/OIP.HnHSF9J0wkbZWn1unKAOxwHaEJ?cb=ucfimg2ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3', type: 'Dog', breed: 'Mixed', status: 'Closed' },
    //     { id: '0006', name: 'มณี', imageUrl: 'https://tse4.mm.bing.net/th/id/OIP.HnHSF9J0wkbZWn1unKAOxwHaEJ?cb=ucfimg2ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3', type: 'Cat', breed: 'Persian', status: 'No Request' },
    //     { id: '0007', name: 'โกลดี้', imageUrl: 'https://tse4.mm.bing.net/th/id/OIP.HnHSF9J0wkbZWn1unKAOxwHaEJ?cb=ucfimg2ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3', type: 'Dog', breed: 'Golden Retriever', status: 'Pending' },
    // ];

    // --- 3. DOM Selections ---
    const tableBody = document.getElementById('petTableBody');
    const petCount = document.getElementById('petCount');
    const searchInput = document.getElementById('searchInput');
    const deleteModal = document.getElementById('deleteModal');
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    const pendingToggle = document.getElementById('pendingToggle');
    const filterButton = document.getElementById('filterButton');
    const filterModal = document.getElementById('filterModal');
    const closeFilterModal = document.getElementById('closeFilterModal');
    const applyFilterBtn = document.getElementById('applyFilterBtn');
    const resetFilterBtn = document.getElementById('resetFilterBtn');
    const statusFilter = document.getElementById('statusFilter');
    const typeFilter = document.getElementById('typeFilter');
    const breedFilter = document.getElementById('breedFilter');

    let petIdToDelete = null;

    // --- Filter Modal ---
    if (filterButton) {
        filterButton.addEventListener('click', () => {
            filterModal.classList.remove('modal-hidden');
        });
    }
    if (closeFilterModal) {
        closeFilterModal.addEventListener('click', () => {
            filterModal.classList.add('modal-hidden');
        });
    }

    // --- 3. Search + Filters ---
    if (searchInput) searchInput.addEventListener('input', applyFilters);
    if (pendingToggle) pendingToggle.addEventListener('change', applyFilters);
    if (applyFilterBtn) applyFilterBtn.addEventListener('click', applyFilters);

    if (resetFilterBtn) {
        resetFilterBtn.addEventListener('click', () => {
            statusFilter.value = "";
            typeFilter.value = "";
            breedFilter.value = "";
            pendingToggle.checked = false;
            searchInput.value = "";
            applyFilters();
        });
    }

    // --- Modal helpers ---
    // --- 4. Modal Helpers ---
    function showModal(modal) { modal.classList.remove('modal-hidden'); }
    function hideModal(modal) { modal.classList.add('modal-hidden'); }

    window.openDeleteModal = (id) => {
        petIdToDelete = id.toString();
        showModal(deleteModal);
    };

    // --- count pets ---
    function updatePetCount(count) {
        petCount.textContent = `There are ${count} pets in total`;
    }

    async function fetchPetStatuses() {
    try {
        const response = await fetch(STATUS_API_URL);
        if (!response.ok) throw new Error(`HTTP status: ${response.status}`);

        const statuses = await response.json();  
        const statusMap = new Map();

        // 1. สร้าง Map เพื่อให้ค้นหาสถานะได้เร็ว
        statuses.forEach(s => {
            // ใช้ Optional Chaining และตรวจสอบค่าว่างก่อน
            const id = s.petId?.toString().trim();
            const status = s.status?.trim();
            if (id && status) {
                statusMap.set(id, status);
            }
        });

        allPets.forEach(pet => {
            
            const petIdToFind = (pet.id ?? pet.petID ?? pet.petId)?.toString().trim(); 

            if (petIdToFind && statusMap.has(petIdToFind)) {
                pet.status = statusMap.get(petIdToFind);
            } 
            
        });

    } catch (error) {
        
        console.error("Error fetching pet statuses:", error);
    }
}

    
    async function confirmDelete() {
        if (petIdToDelete) {
            try {
                const response = await fetch(`${API_URL}/${petIdToDelete}`, { method: 'DELETE' });
                if (response.ok) {
                    allPets = allPets.filter(pet => pet.id.toString() !== petIdToDelete);
                    applyFilters();
                    alert(`Pet ID ${petIdToDelete} successfully deleted.`);
                } else {
                    const errorText = await response.text();
                    alert(`Failed: ${response.status} - ${errorText}`);
                }
            } catch (error) {
                alert('Error connecting to server.');
            }
            hideModal(deleteModal);
            petIdToDelete = null;
        }
    }

    // --- Render table ---
    function renderTable(pets) {
        tableBody.innerHTML = '';
        if (pets.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:20px;">No pets found.</td></tr>';
            return;
        }

        pets.forEach(pet => {
            const displayStatus = pet.status || 'No Request';
            const statusClass = displayStatus.toLowerCase().replace(' ', '-');

            let statusTagHTML = '';
            switch (displayStatus) {
                case 'Pending':
                    statusTagHTML = `<a href="requests.html?id=${pet.id}" class="status-tag status-pending">${pet.status}</a>`;
                    break;
                case 'Approved':
                case 'Completed':
                    statusTagHTML = `<a href="request-status.html?id=${pet.id}&status=${pet.status}" class="status-tag status-${statusClass}">${pet.status}</a>`;
                    break;
                case 'Approved':
                    statusTagHTML = `<span class="status-tag status-approved">${displayStatus}</span>`;
                    break;
                case 'Completed':
                    statusTagHTML = `<span class="status-tag status-completed">${displayStatus}</span>`;
                    break;
                default:
                    statusTagHTML = `<span class="status-tag status-${statusClass}">${pet.status}</span>`;
            }

            const tr = document.createElement('tr');
            const displayId = pet.petID || pet.petId || pet.id;
            const petImageUrl = `http://localhost:8081${pet.image || '/images/placeholder.jpg'}`;

            tr.innerHTML = `
                <td>${pet.id}</td>
                <td>
                    <a href="petdetail.html?id=${pet.id}" class="pet-name-cell">
                        <img src="${pet.imageUrl}" alt="${pet.name}" class="pet-profile-img">
                        <span>${pet.name}</span>
                    </a>
                </td>
                <td>${pet.type || ''}</td>
                <td>${pet.breed || ''}</td>
                <td>${statusTagHTML}</td>
                <td class="action-col action-col-edit">
                    <a href="addpet.html?mode=edit&id=${pet.id}">
                        <button class="action-button edit-btn"><i class="fa-solid fa-pencil"></i> Edit</button>
                    </a>
                </td>
                <td class="action-col action-col-delete">
                    <button class="action-button delete-btn" onclick="openDeleteModal('${pet.id}')">
                        <i class="fa-solid fa-trash-can"></i> Delete
                    </button>
                </td>
            `;
            tableBody.appendChild(tr);
        });
    }

    function updatePetCount(count) {
        petCount.textContent = `There are ${count} pets in total`;
    }

    // --- 6. Filter and Search ---
    function applyFilters() {
        const searchText = searchInput.value.toLowerCase();

        if (pendingToggle.checked) {
            filteredPets = filteredPets.filter(
                pet => (pet.status || "").trim().toLowerCase() === "pending"
            );
        }

        if (searchText) {
            filteredPets = filteredPets.filter(pet =>
                pet.name.toLowerCase().includes(searchText)
            );
        }

        if (statusFilter.value) {
            const f = statusFilter.value.toLowerCase();
            filteredPets = filteredPets.filter(
                pet => (pet.status || "").trim().toLowerCase() === f
            );
        }

        if (typeFilter.value) {
            filteredPets = filteredPets.filter(pet => pet.type === typeFilter.value);
        }

        if (breedFilter.value) {
            filteredPets = filteredPets.filter(pet => pet.breed === breedFilter.value);
        }

        renderTable(filteredPets);
        updatePetCount(filteredPets.length);
    }

    // --- 7. Delete Handlers ---
    function handleDeleteClick(e) {
        const target = e.target.closest('.delete-btn');
        if (target) {
            petIdToDelete = target.dataset.id;
            showModal(deleteModal);
        }
    }

    function confirmDelete() {
        if (!petIdToDelete) return;
        allPets = allPets.filter(p => p.id !== petIdToDelete);
        applyFilters();
        hideModal(deleteModal);
        petIdToDelete = null;
    }

    // --- 8. Event Listeners ---
    searchInput.addEventListener('input', applyFilters);
    pendingToggle.addEventListener('change', applyFilters);
    filterButton?.addEventListener('click', () => showModal(filterModal));
    closeFilterModal?.addEventListener('click', () => hideModal(filterModal));
    applyFilterBtn?.addEventListener('click', () => { applyFilters(); hideModal(filterModal); });
    resetFilterBtn?.addEventListener('click', () => {
        statusFilter.value = '';
        typeFilter.value = '';
        breedFilter.value = '';
        pendingToggle.checked = false;
        searchInput.value = '';
        applyFilters();
        hideModal(filterModal);
    });
    tableBody.addEventListener('click', handleDeleteClick);
    cancelDeleteBtn?.addEventListener('click', () => hideModal(deleteModal));
    confirmDeleteBtn?.addEventListener('click', confirmDelete);

    // --- 9. Fetch Data from API or use mock ---
    async function fetchPets() {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            allPets = await response.json();

            allPets.forEach(pet => pet.status = "No Request");

            await fetchPetStatuses();

            renderTable(allPets);
            updatePetCount(allPets.length);

        } catch (error) {
            tableBody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:20px;color:red;">Failed to load data.</td></tr>';
            updatePetCount(0);
        }
    }

    confirmDeleteBtn.addEventListener('click', confirmDelete);

    // Init
    fetchPets();
});

