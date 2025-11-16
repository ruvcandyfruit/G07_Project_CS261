document.addEventListener('DOMContentLoaded', () => {

    // --- State ที่หน้านี้ต้องรู้ ---
    let CURRENT_REQUEST_ID = null;
    let CURRENT_PET_ID = null;
    let CURRENT_STATUS = 'APPROVED'; // (APPROVED, COMPLETED)
    let CURRENT_PICKUP_TYPE = 'SELF_PICKUP'; // (SELF_PICKUP, DELIVERY)

    // --- DOM Selections ---
    // Cards
    const petNameEl = document.getElementById('petName');
    const petImageEl = document.getElementById('petImage');
    const userNameEl = document.getElementById('userName');
    const userEmailEl = document.getElementById('userEmail');

    // Timeline Steps
    const stepRequest = document.querySelector('.status-step[data-key="request"]');
    const stepApproval = document.querySelector('.status-step[data-key="approval"]');
    const stepHandover = document.querySelector('.status-step[data-key="handover"]');

    // Info Box
    const pickupIconEl = document.getElementById('pickupIcon');
    const pickupTitleEl = document.getElementById('pickupTitle');
    const pickupMessageEl = document.getElementById('pickupMessage');

    // Action Buttons
    const approvedButtons = document.getElementById('approved-buttons');
    const completedButtons = document.getElementById('completed-buttons');
    const backBtn = document.getElementById('backBtn');
    const cancelAdoptionBtn = document.getElementById('cancelAdoptionBtn');
    const confirmHandoverBtn = document.getElementById('confirmHandoverBtn');

    // Modals
    const cancelModal = document.getElementById('cancel-modal');
    const confirmModal = document.getElementById('confirm-modal');
    const successModal = document.getElementById('success-modal');
    const cancelConfirmBtn = document.getElementById('cancelConfirmBtn');
    const confirmHandoverFinalBtn = document.getElementById('confirmHandoverFinalBtn');
    const successOkBtn = document.getElementById('successOkBtn');
    const modalCloseBtns = document.querySelectorAll('[data-close]');


    // --- 1. ฟังก์ชันโหลดข้อมูล (ตอนเปิดหน้า) ---
    async function loadStatusData(petId) {
        // (ในโลกจริง: Backend จะหา Request ที่ 'APPROVED' หรือ 'COMPLETED' ของ PetId นี้)
        // const response = await fetch(`/api/handled-request-for-pet/${petId}`);
        // const data = await response.json();

        // [!! Mock Data (สำหรับ Test) !!]
        // (เปลี่ยน "status" เป็น "COMPLETED" เพื่อเทสหน้า "ย้อนกลับ")
        const data = {
            requestId: "R123",
            petId: "P001",
            petName: "พยัคฆ์เสี้ยววาน",
            petImageUrl: "images/sample-pet.jpg",
            userName: "คุณคนสวย",
            userEmail: "khonsuay@example.com",
            status: "APPROVED", // (ลองเปลี่ยนเป็น "COMPLETED" เพื่อดูผล)
            pickupType: "SELF_PICKUP", // (ลองเปลี่ยนเป็น "DELIVERY")
            pickupDate: "25/11/2568" 
        };
        // [!! จบส่วน Mock Data !!]

        // 1.1 เก็บ State
        CURRENT_REQUEST_ID = data.requestId;
        CURRENT_PET_ID = data.petId;
        CURRENT_STATUS = data.status;
        CURRENT_PICKUP_TYPE = data.pickupType;

        // 1.2 เติมข้อมูลการ์ด
        petNameEl.textContent = data.petName;
        petImageEl.src = data.petImageUrl;
        userNameEl.textContent = data.userName;
        userEmailEl.textContent = data.userEmail;

        // 1.3 สั่ง Render หน้า
        renderPageUI(data.status, data.pickupType, data.pickupDate);
    }

    // --- 2. ฟังก์ชันอัปเดตหน้าจอ (Timeline, Info Box, Buttons) ---
    function renderPageUI(status, pickupType, pickupDate) {
        
        // 2.1 อัปเดต Timeline
        stepRequest.classList.add('completed');
        stepApproval.classList.add('completed');
        stepHandover.classList.remove('completed'); // (Reset ก่อน)

        // 2.2 อัปเดต Info Box + ปุ่ม
        if (status === 'APPROVED') {
            // Timeline: (✓ ✓ Grey)
            
            // Info Box:
            if (pickupType === 'DELIVERY') {
                pickupIconEl.innerHTML = '🚚';
                pickupTitleEl.textContent = 'Delivery';
                pickupMessageEl.textContent = `ระบบได้นัดวันจัดส่งสัตว์เลี้ยงให้ผู้รับเลี้ยงในวันที่ [${pickupDate}] เรียบร้อยแล้ว`;
            } else {
                pickupIconEl.innerHTML = '🐾';
                pickupTitleEl.textContent = 'Self Pickup';
                pickupMessageEl.textContent = `ผู้รับเลี้ยงจะมารับสัตว์เลี้ยงภายในวันที่ [${pickupDate}]`;
            }
            
            // Buttons:
            approvedButtons.classList.remove('hidden');
            completedButtons.classList.add('hidden');

        } else if (status === 'COMPLETED') {
            // Timeline: (✓ ✓ ✓)
            stepHandover.classList.add('completed');

            // Info Box:
            if (pickupType === 'DELIVERY') {
                pickupIconEl.innerHTML = '🚚';
                pickupTitleEl.textContent = 'Delivery';
                pickupMessageEl.textContent = 'ดำเนินการจัดส่งเรียบร้อยแล้ว';
            } else {
                pickupIconEl.innerHTML = '🐾';
                pickupTitleEl.textContent = 'Self Pickup';
                pickupMessageEl.textContent = 'ดำเนินการรับสัตว์เลี้ยงสำเร็จเรียบร้อยแล้ว';
            }

            // Buttons:
            approvedButtons.classList.add('hidden');
            completedButtons.classList.remove('hidden');
        }
    }

    // --- 3. ฟังก์ชันจัดการ Modal ---
    function showModal(modal) {
        modal.classList.add('show');
    }
    function hideModal(modal) {
        modal.classList.remove('show');
    }

    // --- 4. Event Listeners ---

    // 4.1 ปุ่มเปิด Modal
    cancelAdoptionBtn.addEventListener('click', () => showModal(cancelModal));
    confirmHandoverBtn.addEventListener('click', () => showModal(confirmModal));

    // 4.2 ปุ่มปิด Modal (ปุ่มกากบาท หรือ data-close)
    modalCloseBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const modalId = btn.getAttribute('data-close');
            hideModal(document.getElementById(modalId));
        });
    });

    // 4.3 ปุ่มย้อนกลับ
    backBtn.addEventListener('click', () => {
        window.location.href = 'allpet.html'; // (กลับไปหน้า All Pet)
    });

    // --- 5. Logic การยืนยัน (API Calls) ---

    // 5.1 Admin กดยืนยัน "ยกเลิก" (สีแดง)
    cancelConfirmBtn.addEventListener('click', async () => {
        console.log(`ส่ง API ขอยกเลิก Request ID: ${CURRENT_REQUEST_ID}`);
        // (ในโลกจริง: await fetch(`/api/request/cancel/${CURRENT_REQUEST_ID}`, { method: 'POST' }))

        // (จำลองว่าสำเร็จ)
        hideModal(cancelModal);
        alert('ยกเลิกคำขอรับเลี้ยงเรียบร้อยแล้ว');
        window.location.href = 'allpet.html'; // กลับไปหน้า All Pet
    });

    // 5.2 Admin กดยืนยัน "ส่งมอบ" (สีเขียว)
    confirmHandoverFinalBtn.addEventListener('click', async () => {
        console.log(`ส่ง API ยืนยันการส่งมอบ Request ID: ${CURRENT_REQUEST_ID}`);
        // (ในโลกจริง: await fetch(`/api/request/complete/${CURRENT_REQUEST_ID}`, { method: 'POST' }))

        // (จำลองว่าสำเร็จ)
        hideModal(confirmModal);
        showModal(successModal);
        
        // อัปเดตหน้า UI ให้เป็น "Completed" ทันที
        CURRENT_STATUS = 'COMPLETED';
        renderPageUI(CURRENT_STATUS, CURRENT_PICKUP_TYPE, null);
    });

    // 5.3 ปุ่ม OK ใน Modal "Success"
    successOkBtn.addEventListener('click', () => {
        hideModal(successModal);
    });


    // --- 6. เริ่มการทำงาน ---
    // ดึง petId จาก URL (เช่น ...?pet_id=P001)
    const urlParams = new URLSearchParams(window.location.search);
    const petId = urlParams.get('pet_id') || urlParams.get('id'); // (รองรับทั้ง pet_id หรือ id)

    if (petId) {
        loadStatusData(petId);
    } else {
        // (กรณีเปิดหน้าตรงๆ)
        console.warn("ไม่พบ Pet ID ใน URL, แสดงผลด้วยสถานะ Approved เริ่มต้น");
        loadStatusData(null); // (ใช้ Mock Data เริ่มต้น)
    }

});