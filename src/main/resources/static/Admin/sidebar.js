document.addEventListener('DOMContentLoaded', () => {
    // โหลด sidebar.html มาใส่
    fetch('sidebar.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('sidebar').innerHTML = data;

            // [!! LOGIC ใหม่ !!]
            // หลังจากโหลด sidebar.html เสร็จ 
            // ให้เรียกฟังก์ชันตรวจสอบ URL และตั้งค่า Active
            setActiveMenu();

            // [!! LOGIC ใหม่ !!]
            // เพิ่ม Event Listener ให้ปุ่มต่างๆ เพื่อให้คลิกแล้วไปหน้าอื่น
            addNavigation();
        })
        .catch(error => console.error('Error loading sidebar:', error));
});


/**
 * ฟังก์ชันตรวจสอบ URL ปัจจุบัน และตั้งค่า class 'active' ให้เมนูที่ถูกต้อง
 */
function setActiveMenu() {
    const currentPage = window.location.pathname; // เช่น "/allpet.html"

    const dashboardItem = document.getElementById('nav-dashboard');
    const allPetItem = document.getElementById('nav-all-pet');
    const scheduleItem = document.getElementById('nav-schedule');

    // (Safety check)
    if (!dashboardItem || !allPetItem || !scheduleItem) {
        console.error("Sidebar items not found. Make sure IDs are correct.");
        return;
    }
    
    // ลบ 'active' ออกจากทุกเมนู (กันเหนียว)
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });

    // ตรวจสอบ URL และเพิ่ม 'active' ให้ถูกเมนู
    if (currentPage.includes('dashboard.html')) {
        dashboardItem.classList.add('active');

    } else if (currentPage.includes('allpet.html') || currentPage.includes('add-edit-pet.html')) {
        // [!! นี่คือจุดที่คนสวยต้องการ !!]
        // ถ้าหน้าเป็น allpet.html หรือ add-edit-pet.html
        // ให้เมนู 'All Pet' active
        allPetItem.classList.add('active');

    } else if (currentPage.includes('schedule.html')) {
        scheduleItem.classList.add('active');
    }
    // (Logout ไม่ต้องมี active state)
}


/**
 * ฟังก์ชันเพิ่ม Event Click ให้ปุ่มเมนู เพื่อ Link ไปหน้าต่างๆ
 */
function addNavigation() {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault(); 
            const itemId = this.id;
            
            // ถ้าคลิกเมนูที่ active อยู่แล้ว ก็ไม่ต้องทำอะไร
            if (this.classList.contains('active') && itemId !== 'nav-logout') {
                return;
            }

            // สั่งย้ายหน้า
            if (itemId === 'nav-dashboard') {
                window.location.href = 'dashboard.html';
            } else if (itemId === 'nav-all-pet') {
                window.location.href = 'allpet.html';
            } else if (itemId === 'nav-schedule') {
                window.location.href = 'schedule.html';
            } else if (itemId === 'nav-logout') {
                // [!! แก้ไข Path login ของคุณตรงนี้ !!]
                window.location.href = 'login.html'; 
            }
        });
    });
}