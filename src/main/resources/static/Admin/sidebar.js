document.addEventListener('DOMContentLoaded', () => {
    // โหลด sidebar.html มาใส่
    fetch('sidebar.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('sidebar').innerHTML = data;

            // 1. เรียกฟังก์ชันตั้งค่า Active
            setActiveMenu();

            // 2. เรียกฟังก์ชันเพิ่ม Link ให้ปุ่ม
            addNavigation();
            
            // 3. (Flicker Fix) สั่งให้หน้า Fade in
            document.body.classList.add('loaded');
        })
        .catch(error => {
            console.error('Error loading sidebar:', error)
            // แม้จะ Error เราก็ต้องสั่งให้มันโผล่
            document.body.classList.add('loaded');
        });
    // 4. Init popup ทันที (ไม่ต้องรอ sidebar)
    initLogoutPopup();
});


/**
 * ฟังก์ชันตรวจสอบ URL ปัจจุบัน และตั้งค่า class 'active' ให้เมนูที่ถูกต้อง
 */
function setActiveMenu() {
    const currentPage = window.location.pathname; // เช่น "/allpet.html"

    const dashboardItem = document.getElementById('nav-dashboard');
    const allPetItem = document.getElementById('nav-all-pet');
    const scheduleItem = document.getElementById('nav-schedule');

    if (!dashboardItem || !allPetItem || !scheduleItem) {
        console.error("Sidebar items not found. Make sure IDs are correct.");
        return;
    }
    
    // ลบ 'active' ออกจากทุกเมนู (กันเหนียว)
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });

    // --- [!! นี่คือ Logic ที่อัปเดตแล้ว !!] ---
    
    if (currentPage.includes('dashboard.html')) {
        // 1. หน้า Dashboard
        dashboardItem.classList.add('active');

    } else if (currentPage.includes('allpet.html') || 
               currentPage.includes('add-edit-pet.html') ||
               currentPage.includes('request-status.html') ||
               currentPage.includes('requests.html') ||
               currentPage.includes('petdetail.html')) {
        // 2. หน้า "All Pet" และลูกๆ ทั้งหมด
        allPetItem.classList.add('active');

    } else if (currentPage.includes('schedule.html')) {
        // 3. หน้า Schedule
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
                // แสดง popup แทนการ redirect ทันที
                console.log('🔴 Logout clicked');   // ไว้ดู Bug ใน console
                showLogoutPopup();
            }
        });
    });
}


/**
 * ฟังก์ชันจัดการ Logout Popup แบบ Event Delegation
 */
function initLogoutPopup() {
    console.log('🟢 initLogoutPopup called');   // ไว้ดู Bug ใน console
    
    // ใช้ document.body แทน เพราะมันมีอยู่แน่นอน
    document.body.addEventListener('click', (e) => {
        
        // ถ้าคลิกปุ่ม Cancel
        if (e.target.id === 'btn-cancel' || e.target.closest('#btn-cancel')) {
            console.log('🔵 Cancel clicked');   // ไว้ดู Bug ใน console
            hideLogoutPopup();
        }
        
        // ถ้าคลิกปุ่ม Yes
        if (e.target.id === 'btn-yes' || e.target.closest('#btn-yes')) {
            console.log('🟣 Yes clicked');  // ไว้ดู Bug ใน console
            
            // ลบคุกกี้
            deleteCookie('userRole');
            deleteCookie('adminRole');
            
            console.log('🚀 Redirecting to login...');  // ไว้ดู Bug ใน console
            window.location.href = '../login.html';
        }
        
        // ถ้าคลิกพื้นหลัง (overlay)
        if (e.target.id === 'logout-popup') {
            console.log('🟡 Overlay clicked');  // ไว้ดู Bug ใน console
            hideLogoutPopup();
        }
    });
}

/**
 * แสดง popup
 */
function showLogoutPopup() {
    console.log('🟢 showLogoutPopup called');   // ไว้ดู Bug ใน console
    const popup = document.getElementById('logout-popup');
    
    if (popup) {
        popup.classList.add('show');
        console.log('✅ Popup shown');  // ไว้ดู Bug ใน console
    } else {
        console.error('❌ Popup element not found!');   // ไว้ดู Bug ใน console
    }
}

/**
 * ซ่อน popup
 */
function hideLogoutPopup() {
    console.log('🔴 hideLogoutPopup called');   // ไว้ดู Bug ใน console
    const popup = document.getElementById('logout-popup');
    
    if (popup) {
        popup.classList.remove('show');
        console.log('✅ Popup hidden'); // ไว้ดู Bug ใน console
    }
}

/**
 * ฟังก์ชันลบคุกกี้
 */
function deleteCookie(name) {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    console.log(`🍪 Cookie "${name}" deleted`); // ไว้ดู Bug ใน console
}
