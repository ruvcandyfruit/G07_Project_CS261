document.addEventListener('DOMContentLoaded', () => {
    // 1. หา "ที่วาง" ของหัวข้อ
    const placeholder = document.getElementById('breadcrumb-placeholder');
    if (!placeholder) {
        console.error('Breadcrumb placeholder not found. Add <div id="breadcrumb-placeholder" class="header"></div> to your HTML.');
        return;
    }

    // 2. หาว่าเราอยู่หน้าไหน
    const currentPage = window.location.pathname;
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get('mode');

    let breadcrumbHTML = ''; // เตรียมสร้าง HTML

    // --- 3. Logic: สร้าง HTML ตาม URL ---

    // กรณี: หน้า Dashboard
    if (currentPage.includes('dashboard.html')) {
        breadcrumbHTML = `
            <h2 class="breadcrumb-current">Dashboard</h2>
        `;
    } 
    
    // กรณี: หน้า All Pet
    else if (currentPage.includes('allpet.html')) {
        breadcrumbHTML = `
            <h2 class="breadcrumb-current">ALL PET</h2>
        `;
    } 
    
    // กรณี: หน้า Add/Edit Pet (แบบมี Link กลับ)
    else if (currentPage.includes('add-edit-pet.html')) {
        let pageTitle = 'Add Pet'; // ค่าเริ่มต้น
        if (mode === 'edit') {
            pageTitle = 'Edit Pet';
        }
        
        breadcrumbHTML = `
            <a href="allpet.html" class="breadcrumb-link">ALL PET</a>
            <span class="breadcrumb-separator">&gt;</span>
            <h2 class="breadcrumb-current">${pageTitle}</h2>
        `;
    } 
    
    // กรณี: หน้า Schedule
    else if (currentPage.includes('schedule.html')) {
        breadcrumbHTML = `
            <h2 class="breadcrumb-current">Schedule</h2>
        `;
    }
    
    // ... (คนสวยสามารถเพิ่ม else if ... สำหรับหน้าอื่นๆ ได้ตามต้องการ) ...

    
    // 4. ยิง HTML ที่สร้างเสร็จ กลับไปที่หน้าเว็บ
    placeholder.innerHTML = breadcrumbHTML;
});