//
// นี่คือไฟล์ breadcrumb.js (อัปเกรดแล้ว)
//
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

    // --- 3. Logic: สร้าง HTML ตาม URL (เรียงลำดับความเฉพาะเจาะจง) ---

    // 3.1: หน้า Dashboard (ไม่มีแม่)
    if (currentPage.includes('dashboard.html')) {
        breadcrumbHTML = `
            <h2 class="breadcrumb-current">Dashboard</h2>
        `;
    } 
    
    // 3.2: หน้า Schedule (ไม่มีแม่)
    else if (currentPage.includes('schedule.html')) {
        breadcrumbHTML = `
            <h2 class="breadcrumb-current">Schedule</h2>
        `;
    }
    
    // 3.3: หน้า Add/Edit Pet (ลูกของ All Pet)
    else if (currentPage.includes('add-edit-pet.html')) {
        let pageTitle = (mode === 'edit') ? 'Edit Pet' : 'Add Pet';
        breadcrumbHTML = `
            <a href="allpet.html" class="breadcrumb-link">ALL PET</a>
            <span class="breadcrumb-separator">&gt;</span>
            <h2 class="breadcrumb-current">${pageTitle}</h2>
        `;
    } 
    
    // 3.4: หน้า Admin ดูสถานะ (ลูกของ All Pet)
    else if (currentPage.includes('request-status-admin.html')) {
        breadcrumbHTML = `
            <a href="allpet.html" class="breadcrumb-link">ALL PET</a>
            <span class="breadcrumb-separator">&gt;</span>
            <h2 class="breadcrumb-current">สถานะผู้รับเลี้ยง</h2>
        `;
    }

    // 3.5: [!! ใหม่ !!] หน้า Admin จัดการคำขอ (ลูกของ All Pet)
    else if (currentPage.includes('requests.html')) {
        breadcrumbHTML = `
            <a href="allpet.html" class="breadcrumb-link">ALL PET</a>
            <span class="breadcrumb-separator">&gt;</span>
            <h2 class="breadcrumb-current">จัดการคำขอ (Pending)</h2>
        `;
    }

    // 3.6: [!! ใหม่ !!] หน้า Admin ดูรายละเอียดสัตว์ (ลูกของ All Pet)
    else if (currentPage.includes('petdetail.html')) {
        breadcrumbHTML = `
            <a href="allpet.html" class="breadcrumb-link">ALL PET</a>
            <span class="breadcrumb-separator">&gt;</span>
            <h2 class="breadcrumb-current">รายละเอียดสัตว์ (Admin)</h2>
        `;
    }
    
    // 3.7: หน้า All Pet (หน้าแม่) - (สำคัญ: ต้องอยู่หลังหน้าลูกทั้งหมด)
    else if (currentPage.includes('allpet.html')) {
        breadcrumbHTML = `
            <h2 class="breadcrumb-current">ALL PET</h2>
        `;
    }
    
    // ... (หน้าอื่นๆ ถ้ามี) ...

    
    // 4. ยิง HTML ที่สร้างเสร็จ กลับไปที่หน้าเว็บ
    placeholder.innerHTML = breadcrumbHTML;
});