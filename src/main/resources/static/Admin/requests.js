// =====================================
// requests.js - Adoption Request Manager
// ระบบจัดการคำขอรับเลี้ยงสัตว์สำหรับ Admin
// =====================================

// ตัวแปรส่วนกลาง (Global variables)
let currentSelectedUserId = null; // เก็บ ID ของ User ที่กำลังถูกเลือกอยู่
let petData = null; // เก็บข้อมูลสัตว์เลี้ยง
let usersData = []; // เก็บข้อมูลผู้ใช้ทั้งหมดที่ส่งคำขอมา
let petId = null; // เก็บ ID ของสัตว์เลี้ยงที่กำลังพิจารณา

// API Base URL (adjust as needed)
const API_BASE_URL = '/api';

// Mock data for testing
const MOCK_PET_DATA = {
    pet_id: 'P002',
    name: 'น้องเหมียว',
    image_url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=300',
    gender: 'เมีย',
    type: 'แมว',
    breed: 'สีส้ม',
    age: '2 ปี',
    disease: 'ไม่มี',
    sterilization: true,
    food_allergy: 'ไม่มี',
    vaccine: true
};

const MOCK_USERS_DATA = [
    {
        user_id: 'U001',
        firstname: 'สมชาย',
        lastname: 'ใจดี',
        birthdate: '1990-05-15',
        phone: '081-234-5678',
        email: 'somchai@email.com',
        occupation: 'พนักงานบริษัท',
        residence_type: 'บ้านเดี่ยว',
        address: '123 ถนนสุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพฯ 10110',
        receive_type: 'รับด้วยตนเอง',
        pet_experience: 'เคยเลี้ยงแมวมา 3 ตัว ดูแลจนอายุยืน รักและเข้าใจนิสัยแมวดี',
        adoption_reason: 'อยากมีเพื่อนในบ้าน และชอบดูแลสัตว์ มีเวลาดูแลเต็มที่',
        identity_document_url: 'https://example.com/doc1.pdf',
        residence_document_url: 'https://example.com/doc2.pdf'
    },
    {
        user_id: 'U002',
        firstname: 'สมหญิง',
        lastname: 'รักสัตว์',
        birthdate: '1995-08-20',
        phone: '089-876-5432',
        email: 'somying@email.com',
        occupation: 'ครู',
        residence_type: 'คอนโด',
        address: '456 ซอยอารีย์ แขวงสามเสนใน เขตพญาไท กรุงเทพฯ 10400',
        receive_type: 'จัดส่งถึงบ้าน',
        pet_experience: 'เลี้ยงแมวมาตั้งแต่เด็ก ปัจจุบันเลี้ยง 2 ตัว',
        adoption_reason: 'ต้องการช่วยเหลือสัตว์จรจัด และให้บ้านที่อบอุ่น',
        identity_document_url: 'https://example.com/doc3.pdf',
        residence_document_url: 'https://example.com/doc4.pdf'
    }
];

// =====================================
// 1. Initialize on page load
// =====================================
document.addEventListener('DOMContentLoaded', async () => {
    // Get pet_id from URL
    const urlParams = new URLSearchParams(window.location.search);
    petId = urlParams.get('pet_id');

    // ถ้าไม่มี pet_id ให้ใช้ mock data แทน
    if (!petId) {
        console.warn('ไม่พบ pet_id ใน URL กำลังใช้ mock data');
        petId = 'P002';
    }

    // Fetch data
    await loadPetData();
    await loadPendingRequests();

    // Set up event listeners
    setupEventListeners();
});

// =====================================
// 2. Data Fetching
// =====================================

// API 1: Get pet data
async function loadPetData() {
    try {
        const response = await fetch(`${API_BASE_URL}/pets/${petId}`);
        if (!response.ok) throw new Error('Failed to fetch pet data');
        
        petData = await response.json();
        displayPetData(petData);
    } catch (error) {
        console.error('Error loading pet data:', error);
        console.log('ใช้ mock data สำหรับข้อมูลสัตว์เลี้ยง');
        
        // ใช้ mock data
        petData = MOCK_PET_DATA;
        displayPetData(petData);
    }
}

// API 2: Get pending adoption requests
async function loadPendingRequests() {
    try {
        const response = await fetch(`${API_BASE_URL}/adoption-requests?pet_id=${petId}&status=PENDING`);
        if (!response.ok) throw new Error('Failed to fetch requests');
        
        usersData = await response.json();

        if (usersData.length === 0) {
            console.warn('ไม่มีคำขอที่รอดำเนินการ ใช้ mock data แทน');
            usersData = MOCK_USERS_DATA;
        }

        // Display users list
        displayUsersList(usersData);

        // Set first user as default
        selectUser(usersData[0].user_id);
    } catch (error) {
        console.error('Error loading requests:', error);
        console.log('ใช้ mock data สำหรับคำขอรับเลี้ยง');
        
        // ใช้ mock data
        usersData = MOCK_USERS_DATA;
        
        // Display users list
        displayUsersList(usersData);

        // Set first user as default
        selectUser(usersData[0].user_id);
    }
}

// =====================================
// 3. Display Pet Data (Right Sidebar)
// =====================================
function displayPetData(pet) {
    document.getElementById('pet-image').src = pet.image_url || 'default-pet.png';
    document.getElementById('pet-name').textContent = pet.name || '-';
    document.getElementById('pet-id').textContent = pet.pet_id || '-';
    document.getElementById('pet-gender').textContent = pet.gender || '-';
    document.getElementById('pet-type').textContent = pet.type || '-';
    document.getElementById('pet-breed').textContent = pet.breed || '-';
    document.getElementById('pet-age').textContent = pet.age || '-';
    document.getElementById('pet-disease').textContent = pet.disease || 'ไม่มี';
    document.getElementById('pet-sterilization').textContent = pet.sterilization ? 'ทำหมันแล้ว' : 'ยังไม่ทำหมัน';
    document.getElementById('pet-food-allergy').textContent = pet.food_allergy || 'ไม่มี';
    document.getElementById('pet-vaccine').textContent = pet.vaccine ? 'ฉีดแล้ว' : 'ยังไม่ฉีด';
}

// =====================================
// 4. Display Users List (Right Sidebar)
// =====================================
function displayUsersList(users) {
    const userCardsContainer = document.getElementById('userCards');
    const dropdownMenu = document.getElementById('dropdownMenu');

    // Clear existing content
    userCardsContainer.innerHTML = '';
    dropdownMenu.innerHTML = '';

    users.forEach((user, index) => {
        // Desktop view: User cards
        const userCard = createUserCard(user, index === 0);
        userCardsContainer.appendChild(userCard);

        // Mobile view: Dropdown items
        const dropdownItem = createDropdownItem(user);
        dropdownMenu.appendChild(dropdownItem);
    });
}

// Create user card for desktop
function createUserCard(user, isActive = false) {
    const card = document.createElement('div');
    card.className = `user-card ${isActive ? 'active' : ''}`;
    card.dataset.userId = user.user_id;
    card.onclick = () => selectUser(user.user_id);

    card.innerHTML = `
        <div class="user-avatar">
            <span class="solar--user-bold"></span>
        </div>
        <div class="user-info">
            <div class="user-name">${user.firstname} ${user.lastname}</div>
            <div class="user-email">${user.email}</div>
        </div>
    `;

    return card;
}

// Create dropdown item for mobile
function createDropdownItem(user) {
    const item = document.createElement('div');
    item.className = 'dropdown-item';
    item.dataset.userId = user.user_id;
    item.onclick = () => {
        selectUser(user.user_id);
        closeDropdown();
    };

    item.innerHTML = `
        <div class="user-avatar">
            <span class="solar--user-bold"></span>
        </div>
        <div class="user-info">
            <div class="user-name">${user.firstname} ${user.lastname}</div>
            <div class="user-email">${user.email}</div>
        </div>
    `;

    return item;
}

// =====================================
// 5. User Selection Logic
// =====================================
function selectUser(userId) {
    // Update current selected user
    currentSelectedUserId = userId;

    // Find user data
    const user = usersData.find(u => u.user_id === userId);
    if (!user) return;

    // Display user form
    displayUserForm(user);

    // Update active state for desktop cards
    document.querySelectorAll('.user-card').forEach(card => {
        card.classList.toggle('active', card.dataset.userId === userId);
    });

    // Update selected display for mobile dropdown
    updateDropdownSelected(user);
}

// Display user form data (Left Form Section)
function displayUserForm(user) {
    document.getElementById('user-firstname').value = user.firstname || '';
    document.getElementById('user-lastname').value = user.lastname || '';
    document.getElementById('user-birthdate').value = formatDate(user.birthdate) || '';
    document.getElementById('user-phone').value = user.phone || '';
    document.getElementById('user-email').value = user.email || '';
    document.getElementById('user-occupation').value = user.occupation || '';
    document.getElementById('user-residence-type').value = user.residence_type || '';
    document.getElementById('user-address').value = user.address || '';
    document.getElementById('user-receive-type').value = user.receive_type || '';
    document.getElementById('user-pet-experience').value = user.pet_experience || '';
    document.getElementById('user-adoption-reason').value = user.adoption_reason || '';

    // Document links
    if (user.identity_document_url) {
        document.getElementById('identity-doc-link').href = user.identity_document_url;
        document.getElementById('identity-doc-link').style.display = 'inline';
    } else {
        document.getElementById('identity-doc-link').style.display = 'none';
    }

    if (user.residence_document_url) {
        document.getElementById('residence-doc-link').href = user.residence_document_url;
        document.getElementById('residence-doc-link').style.display = 'inline';
    } else {
        document.getElementById('residence-doc-link').style.display = 'none';
    }
}

// Update dropdown selected display for mobile
function updateDropdownSelected(user) {
    const selectedDiv = document.getElementById('dropdownSelected');
    selectedDiv.querySelector('.user-name').textContent = `${user.firstname} ${user.lastname}`;
    selectedDiv.querySelector('.user-email').textContent = user.email;
}

// =====================================
// 6. Event Listeners Setup
// =====================================
function setupEventListeners() {
    // Approve button
    document.querySelector('.btn-approve').addEventListener('click', handleApprove);

    // Reject button
    document.querySelector('.btn-reject').addEventListener('click', handleReject);

    // Mobile dropdown toggle
    document.getElementById('dropdownSelected').addEventListener('click', toggleDropdown);

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.user-dropdown')) {
            closeDropdown();
        }
    });

    // Modal buttons
    document.getElementById('btn-modal-cancel').addEventListener('click', closeModal);
    document.getElementById('btn-modal-confirm').addEventListener('click', confirmAction);
}

// =====================================
// 7. Approve/Reject Actions
// =====================================
let pendingAction = null; // 'approve' or 'reject'

function handleApprove() {
    if (!currentSelectedUserId) {
        alert('กรุณาเลือกผู้ใช้ที่ต้องการอนุมัติ');
        return;
    }

    const user = usersData.find(u => u.user_id === currentSelectedUserId);
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

    const user = usersData.find(u => u.user_id === currentSelectedUserId);
    pendingAction = 'reject';

    showModal(
        'ยืนยันการปฏิเสธคำขอ',
        `คุณต้องการปฏิเสธคำขอของ ${user.firstname} ${user.lastname} ใช่หรือไม่?`,
        'reject'
    );
}

async function confirmAction() {
    closeModal();

    if (pendingAction === 'approve') {
        await approveRequest();
    } else if (pendingAction === 'reject') {
        await rejectRequest();
    }

    pendingAction = null;
}

// API call to approve request
async function approveRequest() {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/approve-request`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                pet_id: petId,
                approved_user_id: currentSelectedUserId
            })
        });

        if (!response.ok) throw new Error('Failed to approve request');

        alert('อนุมัติคำขอเรียบร้อย');
        window.location.href = 'allpet.html';
    } catch (error) {
        console.error('Error approving request:', error);
        alert('เกิดข้อผิดพลาดในการอนุมัติคำขอ');
    }
}

// API call to reject request
async function rejectRequest() {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/reject-request`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                pet_id: petId,
                rejected_user_id: currentSelectedUserId
            })
        });

        if (!response.ok) throw new Error('Failed to reject request');

        alert('ปฏิเสธคำขอแล้ว');
        window.location.reload(); // Refresh to update the list
    } catch (error) {
        console.error('Error rejecting request:', error);
        alert('เกิดข้อผิดพลาดในการปฏิเสธคำขอ');
    }
}

// =====================================
// 8. Modal Functions
// =====================================
function showModal(title, message, actionType) {
    const modal = document.getElementById('confirmation-modal');
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-message').textContent = message;

    const confirmBtn = document.getElementById('btn-modal-confirm');
    confirmBtn.className = `btn-confirm ${actionType}`;

    modal.style.display = 'flex';
    setTimeout(() => modal.classList.add('active'), 10);
}

function closeModal() {
    const modal = document.getElementById('confirmation-modal');
    modal.classList.remove('active');
    setTimeout(() => modal.style.display = 'none', 300);
}

// =====================================
// 9. Mobile Dropdown Functions
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
// 10. Helper Functions
// =====================================
function formatDate(dateString) {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear() + 543; // Convert to Buddhist year
    
    return `${day}/${month}/${year}`;
}