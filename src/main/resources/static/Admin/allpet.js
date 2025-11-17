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

    // --- 1. Master Data and API URLs ---
    let allPets = [];
    const API_URL = "http://localhost:8081/api/pets";
    const STATUS_API_URL = "http://localhost:8081/api/userform/statuses";

    // --- 2. Mock Data (fallback) ---
    const mockPetData = [
        { id: '0001', name: 'พยัคฆ์เสี้ยววาน', imageUrl: 'https://tse4.mm.bing.net/th/id/OIP.HnHSF9J0wkbZWn1unKAOxwHaEJ?cb=ucfimg2ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3', type: 'Cat', breed: 'Persian', status: 'No Request' },
        { id: '0002', name: 'น้องเหมียว', imageUrl: 'https://tse4.mm.bing.net/th/id/OIP.HnHSF9J0wkbZWn1unKAOxwHaEJ?cb=ucfimg2ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3', type: 'Cat', breed: 'Persian', status: 'Pending' },
        { id: '0003', name: 'เจ้าสี่ขา', imageUrl: 'https://tse4.mm.bing.net/th/id/OIP.HnHSF9J0wkbZWn1unKAOxwHaEJ?cb=ucfimg2ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3', type: 'Dog', breed: 'Golden Retriever', status: 'Approved' },
        { id: '0004', name: 'ส้มซ่า', imageUrl: 'https://tse4.mm.bing.net/th/id/OIP.HnHSF9J0wkbZWn1unKAOxwHaEJ?cb=ucfimg2ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3', type: 'Cat', breed: 'Siam', status: 'Completed' },
        { id: '0005', name: 'ด่างทับทิม', imageUrl: 'https://tse4.mm.bing.net/th/id/OIP.HnHSF9J0wkbZWn1unKAOxwHaEJ?cb=ucfimg2ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3', type: 'Dog', breed: 'Mixed', status: 'Closed' },
        { id: '0006', name: 'มณี', imageUrl: 'https://tse4.mm.bing.net/th/id/OIP.HnHSF9J0wkbZWn1unKAOxwHaEJ?cb=ucfimg2ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3', type: 'Cat', breed: 'Persian', status: 'No Request' },
        { id: '0007', name: 'โกลดี้', imageUrl: 'https://tse4.mm.bing.net/th/id/OIP.HnHSF9J0wkbZWn1unKAOxwHaEJ?cb=ucfimg2ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3', type: 'Dog', breed: 'Golden Retriever', status: 'Pending' },
    ];

    // --- 3. DOM Selections ---
    const tableBody = document.getElementById('petTableBody');
    const petCount = document.getElementById('petCount');
    const searchInput = document.getElementById('searchInput');
    const pendingToggle = document.getElementById('pendingToggle');
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

    // --- 4. Modal Helpers ---
    function showModal(modal) { modal.classList.remove('modal-hidden'); }
    function hideModal(modal) { modal.classList.add('modal-hidden'); }

    // --- 5. Table Rendering ---
    function renderTable(pets) {
        tableBody.innerHTML = '';
        if (!pets.length) {
            tableBody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:20px;">No pets found.</td></tr>';
            return;
        }

        pets.forEach(pet => {
            const statusClass = (pet.status || 'No Request').toLowerCase().replace(' ', '-');
            let statusTagHTML = '';

            switch (pet.status) {
                case 'Pending':
                    statusTagHTML = `<a href="requests.html?id=${pet.id}" class="status-tag status-pending">${pet.status}</a>`;
                    break;
                case 'Approved':
                case 'Completed':
                    statusTagHTML = `<a href="request-status.html?id=${pet.id}&status=${pet.status}" class="status-tag status-${statusClass}">${pet.status}</a>`;
                    break;
                default:
                    statusTagHTML = `<span class="status-tag status-${statusClass}">${pet.status}</span>`;
            }

            const tr = document.createElement('tr');
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
                        <button class="action-button edit-btn"><i class="fa-solid fa-pencil"></i> Edit</button>
                    </a>
                </td>
                <td class="action-col action-col-delete">
                    <button class="action-button delete-btn" data-id="${pet.id}"><i class="fa-solid fa-trash-can"></i> Delete</button>
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
        let filteredPets = allPets;
        const searchText = searchInput.value.toLowerCase();
        if (pendingToggle.checked) filteredPets = filteredPets.filter(p => p.status === 'Pending');
        if (searchText) filteredPets = filteredPets.filter(p => p.name.toLowerCase().includes(searchText));
        if (statusFilter.value) filteredPets = filteredPets.filter(p => p.status === statusFilter.value);
        if (typeFilter.value) filteredPets = filteredPets.filter(p => p.type === typeFilter.value);
        if (breedFilter.value) filteredPets = filteredPets.filter(p => p.breed === breedFilter.value);

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
            const res = await fetch(API_URL);
            if (!res.ok) throw new Error('API failed');
            const data = await res.json();
            allPets = data.map(p => ({ ...p, status: 'No Request', imageUrl: p.image ? `http://localhost:8081${p.image}` : '/images/placeholder.jpg' }));

            // Fetch status mapping
            try {
                const statusRes = await fetch(STATUS_API_URL);
                const statuses = await statusRes.json();
                allPets.forEach(p => {
                    const match = statuses.find(s => s.petId.toString() === (p.petID || p.id).toString());
                    if (match) p.status = match.status;
                });
            } catch (_) { /* ignore */ }

        } catch (err) {
            console.warn('Using mock data due to API failure', err);
            allPets = mockPetData;
        }
    }

    // --- 10. Initialization ---
    async function initializeApp() {
        // Redirect if not ADMIN
        try {
            const user = JSON.parse(localStorage.getItem('user') || 'null');
            if (!user || user.role !== 'ADMIN') window.location.href = '/index.html';
        } catch (_) { window.location.href = '/index.html'; }

        await fetchPets();

        // Apply URL filters
        const params = new URLSearchParams(window.location.search);
        if (params.get('status')) statusFilter.value = params.get('status');
        if (params.get('togglePending') === 'true') pendingToggle.checked = true;

        applyFilters();
    }

    initializeApp();
});
