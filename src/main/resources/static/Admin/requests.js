// ================ Mock Data ================
const mockPetData = {
    id: "D001",
    name: "SHOKUN",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=300&h=300&fit=crop",
    gender: "ชาย",
    type: "สุนัข",
    breed: "Shiba Inu",
    birthdate: "2022-03-15", // จะคำนวณอายุจาก birthdate
    disease: "ไม่มี",
    sterilization: "ทำแล้ว",
    foodAllergy: "ปลาทูน่าต้มน้ำปลา",
    vaccine: "ครบ"
};

const mockUsersData = [
    {
        id: 1,
        firstname: "สมชาย",
        lastname: "ใจดี",
        username: "Somchai Jaidee",
        email: "somchai.jaidee@email.com",
        birthdate: "15/03/1990",
        phone: "081-234-5678",
        occupation: "วิศวกรซอฟต์แวร์",
        residenceType: "คอนโด",
        address: "123/45 ถนนสุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพฯ 10110",
        petExperience: "เคยเลี้ยงสุนัขพันธุ์ Golden Retriever มา 5 ปี ชื่อ Max จนเสียชีวิตด้วยวัยชรา ผมดูแลตั้งแต่อาหาร การฉีดวัคซีน และพาไปตรวจสุขภาพประจำทุกปี",
        adoptionReason: "หลังจาก Max จากไป บ้านรู้สึกเงียบเหงามาก ผมต้องการเพื่อนที่จะให้ความรัก ดูแล และสร้างความสุขให้กับครอบครัวอีกครั้ง พร้อมที่จะให้เวลาและความรักกับสัตว์เลี้ยงตัวใหม่"
    },
    {
        id: 2,
        firstname: "มาลี",
        lastname: "สวยงาม",
        username: "Malee Suayngam",
        email: "malee.suay@email.com",
        birthdate: "22/07/1995",
        phone: "089-876-5432",
        occupation: "นักออกแบบกราฟิก",
        residenceType: "บ้านเดี่ยว",
        address: "78 ซอยลาดพร้าว 15 แขวงจอมพล เขตจตุจักร กรุงเทพฯ 10900",
        petExperience: "เลี้ยงแมว 2 ตัว คือ ลูกน้ำและลูกฟ้า มา 3 ปีแล้ว ดูแลเรื่องอาหาร ทรายแมว และพาไปหาหมอสัตว์เป็นประจำ บ้านมีพื้นที่เพียงพอสำหรับสัตว์เลี้ยงหลายตัว",
        adoptionReason: "อยากเพิ่มสมาชิกใหม่ในครอบครัว เพราะแมวทั้งสองตัวเป็นสัตว์ที่เข้ากับสุนัขได้ดี และผมมีเวลาเพียงพอในการดูแล เพราะทำงานที่บ้านเป็นหลัก"
    },
    {
        id: 3,
        firstname: "ประยุทธ",
        lastname: "รักสัตว์",
        username: "Prayut Raksut",
        email: "prayut.rak@email.com",
        birthdate: "10/11/1988",
        phone: "092-345-6789",
        occupation: "ครูประถม",
        residenceType: "ทาวน์เฮาส์",
        address: "456/12 หมู่บ้านบ้านสวน ถนนพระราม 2 แขวงท่าข้าม เขตบางขุนเทียน กรุงเทพฯ 10150",
        petExperience: "เลี้ยงสุนัขพันธุ์พื้นบ้านมาตั้งแต่เด็ก รวมทั้งหมด 4 ตัว มีประสบการณ์ในการดูแลสุนัขป่วย ให้ยา และพาไปพบสัตวแพทย์เป็นประจำ เข้าใจพฤติกรรมสุนัขเป็นอย่างดี",
        adoptionReason: "ตอนนี้บ้านมีสุนัขเหลือ 1 ตัวคือลูกหมี อายุ 8 ปี และเขาดูเหงามาก อยากหาเพื่อนให้เขา และผมก็มีความพร้อมทั้งเวลาและสถานที่ในการดูแล"
    }
];

// ================ Helper Functions ================

// คำนวณอายุจากวันเกิด
function calculateAge(birthdate) {
    const birth = new Date(birthdate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    
    return age;
}

// แสดงข้อมูลสัตว์เลี้ยง
function displayPetData(petData) {
    document.getElementById('pet-image').src = petData.image;
    document.getElementById('pet-image').alt = petData.name;
    document.getElementById('pet-name').textContent = petData.name;
    document.getElementById('pet-id').textContent = petData.id;
    document.getElementById('pet-gender').textContent = petData.gender;
    document.getElementById('pet-type').textContent = petData.type;
    document.getElementById('pet-breed').textContent = petData.breed;
    document.getElementById('pet-disease').textContent = petData.disease;
    document.getElementById('pet-sterilization').textContent = petData.sterilization;
    document.getElementById('pet-food-allergy').textContent = petData.foodAllergy;
    document.getElementById('pet-vaccine').textContent = petData.vaccine;
    // เปลี่ยนเป็น
    const ageElement = document.getElementById('pet-age');
    const ageParent = ageElement.parentElement;
    ageElement.textContent = calculateAge(petData.birthdate);
    // ลบ "ปี" ที่อยู่หลัง span ออกถ้ามี
    ageParent.childNodes.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE && node.textContent.includes('ปี')) {
            node.textContent = ' ปี';
        }
    });
}

// แสดงข้อมูลผู้ใช้ในฟอร์ม
function displayUserFormData(userData) {
    document.getElementById('user-firstname').value = userData.firstname;
    document.getElementById('user-lastname').value = userData.lastname;
    document.getElementById('user-birthdate').value = userData.birthdate;
    document.getElementById('user-phone').value = userData.phone;
    document.getElementById('user-email').value = userData.email;
    document.getElementById('user-occupation').value = userData.occupation;
    document.getElementById('user-residence-type').value = userData.residenceType;
    document.getElementById('user-address').value = userData.address;
    document.getElementById('user-pet-experience').value = userData.petExperience;
    document.getElementById('user-adoption-reason').value = userData.adoptionReason;
}

// สร้าง User Cards
function createUserCards(usersData) {
    const userCardsContainer = document.getElementById('userCards');
    userCardsContainer.innerHTML = '';
    
    usersData.forEach((user, index) => {
        const userCard = document.createElement('div');
        userCard.className = 'user-card';
        userCard.dataset.userId = user.id;
        userCard.dataset.userIndex = index;
        userCard.innerHTML = `
            <div class="user-avatar"><span class="solar--user-bold"></span></div>
            <div class="user-info">
                <div class="user-name">${user.username}</div>
                <div class="user-email">${user.email}</div>
            </div>
        `;
        
        userCard.addEventListener('click', () => {
            selectUser(index);
            // Highlight selected card
            document.querySelectorAll('.user-card').forEach(card => {
                card.style.backgroundColor = 'white';
            });
            userCard.style.backgroundColor = '#f0f7ff';
        });
        
        userCardsContainer.appendChild(userCard);
    });
}

// ================ Dropdown Logic ================

let selectedIndex = 0;
let isOpen = false;
let currentUsersData = [];

// สร้าง dropdown items จาก user cards
function initDropdown() {
    const dropdownMenu = document.getElementById('dropdownMenu');
    const dropdownSelected = document.getElementById('dropdownSelected');
    
    if (!dropdownMenu || !dropdownSelected) return;
    
    dropdownMenu.innerHTML = '';
    
    currentUsersData.forEach((user, index) => {
        const item = document.createElement('div');
        item.className = 'dropdown-item';
        item.dataset.index = index;
        item.innerHTML = `
            <div class="user-avatar"><span class="solar--user-bold"></span></div>
            <div class="user-info">
                <div class="user-name">${user.username}</div>
                <div class="user-email">${user.email}</div>
            </div>
        `;
        
        item.addEventListener('click', (e) => {
            e.stopPropagation();
            selectUser(index);
        });
        dropdownMenu.appendChild(item);
    });
    
    // แสดง user แรกใน dropdown
    if (currentUsersData.length > 0) {
        updateDropdownSelected(0);
    }
}

// อัพเดทข้อมูลใน dropdown selected
function updateDropdownSelected(index) {
    const dropdownSelected = document.getElementById('dropdownSelected');
    if (!dropdownSelected) return;
    
    const user = currentUsersData[index];
    dropdownSelected.querySelector('.user-name').textContent = user.username;
    dropdownSelected.querySelector('.user-email').textContent = user.email;
}

// เลือก user
function selectUser(index) {
    selectedIndex = index;
    displayUserFormData(currentUsersData[index]);
    updateDropdownSelected(index);
    closeDropdown();
}

// เปิด/ปิด dropdown
function toggleDropdown() {
    isOpen = !isOpen;
    const dropdownMenu = document.getElementById('dropdownMenu');
    const dropdownArrow = document.getElementById('dropdownArrow');
    
    if (!dropdownMenu || !dropdownArrow) return;
    
    if (isOpen) {
        dropdownMenu.classList.add('open');
        dropdownArrow.classList.add('open');
    } else {
        closeDropdown();
    }
}

function closeDropdown() {
    isOpen = false;
    const dropdownMenu = document.getElementById('dropdownMenu');
    const dropdownArrow = document.getElementById('dropdownArrow');
    
    if (dropdownMenu) dropdownMenu.classList.remove('open');
    if (dropdownArrow) dropdownArrow.classList.remove('open');
}

// ================ Initialize ================

// เมื่อโหลดหน้าเพจ
document.addEventListener('DOMContentLoaded', () => {
    // แสดงข้อมูลสัตว์เลี้ยง
    displayPetData(mockPetData);
    
    // เก็บข้อมูล users
    currentUsersData = mockUsersData;
    
    // สร้าง user cards
    createUserCards(mockUsersData);
    
    // แสดงข้อมูล user แรก
    if (mockUsersData.length > 0) {
        displayUserFormData(mockUsersData[0]);
        // Highlight card แรก
        const firstCard = document.querySelector('.user-card');
        if (firstCard) {
            firstCard.style.backgroundColor = '#f0f7ff';
        }
    }
    
    // Setup dropdown
    initDropdown();
    
    // Event listener สำหรับ dropdown
    const dropdownSelected = document.getElementById('dropdownSelected');
    if (dropdownSelected) {
        dropdownSelected.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleDropdown();
        });
    }
    
    // ปิด dropdown เมื่อคลิกข้างนอก
    document.addEventListener('click', (e) => {
        const dropdown = document.getElementById('userDropdown');
        if (dropdown && !dropdown.contains(e.target)) {
            closeDropdown();
        }
    });
});

// ================ API Integration (สำหรับอนาคต) ================

// ฟังก์ชันสำหรับดึงข้อมูลจาก API (ใช้เมื่อมี Backend)
async function fetchPetData(petId) {
    try {
        const response = await fetch(`/api/pets/${petId}`);
        const data = await response.json();
        displayPetData(data);
    } catch (error) {
        console.error('Error fetching pet data:', error);
    }
}

async function fetchAdoptionRequests(petId) {
    try {
        const response = await fetch(`/api/adoption-requests?petId=${petId}`);
        const data = await response.json();
        currentUsersData = data;
        createUserCards(data);
        initDropdown();
        if (data.length > 0) {
            displayUserFormData(data[0]);
        }
    } catch (error) {
        console.error('Error fetching adoption requests:', error);
    }
}

// เมื่อต้องการใช้ API จริง ให้เรียกฟังก์ชันเหล่านี้แทน mock data
// fetchPetData('D001');
// fetchAdoptionRequests('D001');