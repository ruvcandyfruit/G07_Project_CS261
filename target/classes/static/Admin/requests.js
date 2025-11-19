// =====================================
// admin-requests.js - Adoption Request Manager
// =====================================

// 0. Redirect non-admin users
(function enforceAdmin() {
    try {
        const user = JSON.parse(localStorage.getItem('user') || 'null');
        if (!user || user.role !== 'ADMIN') window.location.href = '/index.html';
    } catch (_) {
        window.location.href = '/index.html';
    }
})();

// =====================================
// 1. Global variables
// =====================================
let currentSelectedUserId = null;
let petData = null;
let usersData = [];
let petId = null;

const API_BASE_URL = '/api';

// =====================================
// 2. Initialization
// =====================================
document.addEventListener('DOMContentLoaded', async () => {
    // Get pet_id from URL
    const urlParams = new URLSearchParams(window.location.search);
    petId = urlParams.get('id');

    if (!petId) {
        alert('ไม่พบรหัสสัตว์เลี้ยง');
        window.location.href = '/allpet.html';
        return;
    }

    // Fetch data
    await loadPetData();
    await loadPendingRequests();

    // Set up event listeners
    setupEventListeners();
});

// =====================================
// 3. Data fetching
// =====================================
async function loadPetData() {
    try {
        const res = await fetch(`${API_BASE_URL}/pets/${petId}`);
        if (!res.ok) throw new Error('Failed to fetch pet data');
        petData = await res.json();
        displayPetData(petData);
    } catch (err) {
        console.error('Error fetching pet data:', err);
        alert('ไม่สามารถโหลดข้อมูลสัตว์เลี้ยงได้');
    }
}

async function loadPendingRequests() {
    try {
        const res = await fetch(`${API_BASE_URL}/userform/admin/pet/${petId}/requests`);
        if (!res.ok) throw new Error('Failed to fetch requests');

        const allForms = await res.json();

        usersData = allForms
            .map(f => { // ⭐️ ใช้ Block Scope เพื่อประกาศตัวแปร (แก้ไขแล้ว)
                
                // ✅ ดึงเฉพาะชื่อไฟล์โดยใช้ฟังก์ชัน helper
                const identityFilename = getFilename(f.identityDoc); 
                const residenceFilename = getFilename(f.residenceDoc);
                
                // ✅ สร้าง URL ใหม่ด้วยชื่อไฟล์เท่านั้น
                const identityDocUrl = identityFilename ? `/api/userform/download/${identityFilename}` : null;
                const residenceDocUrl = residenceFilename ? `/api/userform/download/${residenceFilename}` : null;

                return { // ⭐️ Return Object
                    formId: f.id,
                    userId: f.user.id,
                    petId: f.pet.id,
                    status: f.status,
                    firstname: f.firstName,
                    lastname: f.lastName,
                    birthdate: f.dob,
                    email: f.email,
                    phone: f.phone,
                    occupation: f.occupation,
                    residence_type: f.residenceType,
                    address: f.address,
                    receive_type: f.receiveType,
                    pet_experience: f.experience,
                    adoption_reason: f.reason,
                    
                    // ✅ ใช้ตัวแปร URL ที่แก้ไขแล้ว
                    identity_document_url: identityDocUrl, 
                    residence_document_url: residenceDocUrl
                };
            });

        if (!usersData.length) {
            document.getElementById('userCards').innerHTML = '<p>ไม่มีคำขอที่รอดำเนินการ</p>';
            return;
        }

        displayUsersList(usersData);
        selectUser(usersData[0].userId);

    } catch (err) {
        console.error('Error fetching adoption requests:', err);
        alert('ไม่สามารถโหลดคำขอรับเลี้ยงได้');
    }
}

// =====================================
// 4. Display pet data
// =====================================
function displayPetData(pet) {
    const calculateAge = (birthDateStr) => {
        if (!birthDateStr) return '-';
        const birth = new Date(birthDateStr);
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
        return age >= 0 ? age : '-';
    };

    document.getElementById('pet-image').src = pet.image ? `http://localhost:8081${pet.image}` : 'images/placeholder.jpg';
    document.getElementById('pet-name').textContent = pet.name || '-';
    document.getElementById('pet-id').textContent = pet.petID || '-';
    document.getElementById('pet-gender').textContent = pet.gender || '-';
    document.getElementById('pet-type').textContent = pet.type || '-';
    document.getElementById('pet-breed').textContent = pet.breed || '-';
    document.getElementById('pet-age').textContent = calculateAge(pet.birthDate);
    document.getElementById('pet-disease').textContent = pet.disease || 'ไม่มี';
    document.getElementById('pet-sterilization').textContent = pet.sterilization ? 'ทำหมันแล้ว' : 'ยัง';
    document.getElementById('pet-food-allergy').textContent = pet.food_allergy || 'ไม่มี';
    document.getElementById('pet-vaccine').textContent = pet.vaccine ? 'ฉีดแล้ว' : 'ยังไม่ฉีด';
}

// =====================================
// 5. Display users list
// =====================================
function displayUsersList(users) {
    const userCardsContainer = document.getElementById('userCards');
    const dropdownMenu = document.getElementById('dropdownMenu');
    userCardsContainer.innerHTML = '';
    dropdownMenu.innerHTML = '';

    users.forEach((user, i) => {
        userCardsContainer.appendChild(createUserCard(user, i === 0));
        dropdownMenu.appendChild(createDropdownItem(user));
    });
}

function createUserCard(user, isActive) {
    const card = document.createElement('div');
    card.className = `user-card ${isActive ? 'active' : ''}`;
    card.dataset.userId = user.userId;
    card.onclick = () => selectUser(user.userId);
    card.innerHTML = `
        <div class="user-avatar"><span class="solar--user-bold"></span></div>
        <div class="user-info">
            <div class="user-name">${user.firstname} ${user.lastname}</div>
            <div class="user-email">${user.email}</div>
        </div>
    `;
    return card;
}

function createDropdownItem(user) {
    const item = document.createElement('div');
    item.className = 'dropdown-item';
    item.dataset.userId = user.userId;
    item.onclick = () => { selectUser(user.userId); closeDropdown(); };
    item.innerHTML = `
        <div class="user-avatar"><span class="solar--user-bold"></span></div>
        <div class="user-info">
            <div class="user-name">${user.firstname} ${user.lastname}</div>
            <div class="user-email">${user.email}</div>
        </div>
    `;
    return item;
}

// =====================================
// 6. User selection
// =====================================
function selectUser(userId) {
    const user = usersData.find(u => u.userId === userId);
    if (!user) return;
    currentSelectedUserId = userId;
    displayUserForm(user);
    updateActiveCard(userId);
    updateDropdownSelected(user);
}

function displayUserForm(user) {
    document.getElementById('user-firstname').value = user.firstname || '';
    document.getElementById('user-lastname').value = user.lastname || '';
    document.getElementById('user-birthdate').value = formatDate(user.birthdate);
    document.getElementById('user-phone').value = user.phone || '';
    document.getElementById('user-email').value = user.email || '';
    document.getElementById('user-occupation').value = user.occupation || '';
    document.getElementById('user-residence-type').value = user.residence_type || '';
    document.getElementById('user-address').value = user.address || '';
    document.getElementById('user-receive-type').value = user.receive_type || '';
    document.getElementById('user-pet-experience').value = user.pet_experience || '';
    document.getElementById('user-adoption-reason').value = user.adoption_reason || '';

    // Document links
    const idLink = document.getElementById('identity-doc-link');
    const resLink = document.getElementById('residence-doc-link');

    if (user.identity_document_url) {
        idLink.href = user.identity_document_url;
        idLink.style.display = 'inline';
    } else idLink.style.display = 'none';

    if (user.residence_document_url) {
        resLink.href = user.residence_document_url;
        resLink.style.display = 'inline';
    } else resLink.style.display = 'none';
}

function updateActiveCard(userId) {
    document.querySelectorAll('.user-card').forEach(card => {
        card.classList.toggle('active', card.dataset.userId == userId);
    });
}

function updateDropdownSelected(user) {
    const selectedDiv = document.getElementById('dropdownSelected');
    selectedDiv.querySelector('.user-name').textContent = `${user.firstname} ${user.lastname}`;
    selectedDiv.querySelector('.user-email').textContent = user.email;
}

// =====================================
// 7. Event listeners
// =====================================
function setupEventListeners() {
    document.querySelector('.btn-approve').addEventListener('click', handleApprove);
    document.querySelector('.btn-reject').addEventListener('click', handleReject);
    document.getElementById('dropdownSelected').addEventListener('click', toggleDropdown);
    document.addEventListener('click', e => {
        if (!e.target.closest('.user-dropdown')) closeDropdown();
    });
    document.getElementById('btn-modal-cancel').addEventListener('click', closeModal);
    document.getElementById('btn-modal-confirm').addEventListener('click', confirmAction);
}

// =====================================
// 8. Approve / Reject
// =====================================
let pendingAction = null; // 'approve' or 'reject'

function handleApprove() {
    if (!currentSelectedUserId) {
        alert('กรุณาเลือกผู้ใช้ที่ต้องการอนุมัติ');
        return;
    }

    const user = usersData.find(u => u.userId === currentSelectedUserId);
    if (!user) return;

    pendingAction = 'approve';
    showModal(
        'ยืนยันการอนุมัติคำขอ',
        `คุณต้องการอนุมัติคำขอของ ${user.firstname} ${user.lastname} ใช่หรือไม่?`,
        'approve'
    );
}

function handleReject() {
    if (!currentSelectedUserId) {
        alert('กรุณาเลือกผู้ใช้ที่ต้องการปฏิเสธ');
        return;
    }

    const user = usersData.find(u => u.userId === currentSelectedUserId);
    if (!user) return;

    pendingAction = 'reject';
    showModal(
        'ยืนยันการปฏิเสธคำขอ',
        `คุณต้องการปฏิเสธคำขอของ ${user.firstname} ${user.lastname} ใช่หรือไม่?`,
        'reject'
    );
}

async function confirmAction() {
    closeModal();

    if (!currentSelectedUserId) return;

    const selected = usersData.find(u => u.userId === currentSelectedUserId);
    if (!selected) return;

    // Get admin userId from localStorage
    const adminUser = JSON.parse(localStorage.getItem('user') || '{}');
    if (!adminUser || adminUser.role !== 'ADMIN') {
        alert('คุณไม่ได้รับอนุญาตให้ทำรายการนี้');
        return;
    }

    try {
        const status = pendingAction === 'approve' ? 'APPROVED' : 'REJECTED';

        const response = await fetch(`${API_BASE_URL}/userform/${selected.formId}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-USER-ID': adminUser.id // <-- send admin ID to backend
            },
            body: JSON.stringify({ status })
        });

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(errText || 'Failed to update request');
        }

        alert(pendingAction === 'approve' ? 'อนุมัติคำขอเรียบร้อย' : 'ปฏิเสธคำขอแล้ว');

        // Remove user from list and select next one
        usersData = usersData.filter(u => u.formId !== selected.formId);
        if (usersData.length > 0) {
            selectUser(usersData[0].userId);
        } else {
            document.getElementById('userCards').innerHTML = '<p>ไม่มีคำขอที่รอดำเนินการ</p>';
        }

        // Optionally refresh the page or sidebar
        await loadPendingRequests();

    } catch (err) {
        console.error(err);
        alert('เกิดข้อผิดพลาดในการประมวลผลคำขอ: ' + err.message);
    } finally {
        pendingAction = null;
    }
}

// =====================================
// 9. Modal
// =====================================
function showModal(title, message) {
    const modal = document.getElementById('confirmation-modal');
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-message').textContent = message;
    modal.style.display = 'flex';
    setTimeout(() => modal.classList.add('active'), 10);
}

function closeModal() {
    const modal = document.getElementById('confirmation-modal');
    modal.classList.remove('active');
    setTimeout(() => modal.style.display = 'none', 300);
}

// =====================================
// 10. Mobile Dropdown
// =====================================
function toggleDropdown() {
    const menu = document.getElementById('dropdownMenu');
    const arrow = document.getElementById('dropdownArrow');
    menu.classList.toggle('open');
    arrow.classList.toggle('open');
}

function closeDropdown() {
    const menu = document.getElementById('dropdownMenu');
    const arrow = document.getElementById('dropdownArrow');
    menu.classList.remove('open');
    arrow.classList.remove('open');
}

// =====================================
// 11. Helper
// =====================================
// ⭐️ ฟังก์ชันที่เพิ่มเข้ามา: ดึงชื่อไฟล์จาก Path เต็ม
const getFilename = (fullPath) => {
    if (!fullPath) return null;
    // ใช้ Regular Expression เพื่อแยก Path ด้วยทั้ง / (Linux/URL) และ \ (Windows)
    const parts = fullPath.split(/[\/\\]/); 
    const filename = parts.pop();
    // ป้องกันกรณีที่ Path ลงท้ายด้วย / หรือ \ แล้ว pop ได้ค่าว่าง
    return filename || null; 
};

function formatDate(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear() + 543;
    return `${day}/${month}/${year}`;
}