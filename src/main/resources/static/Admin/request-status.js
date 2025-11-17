// Redirect กลับหน้าแรกถ้าไม่ได้ล็อกอินหรือไม่ใช่ ADMIN
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
//
// นี่คือโค้ดที่ถูกต้องสำหรับไฟล์ request-status.js (ฝั่ง Admin)
//
document.addEventListener("DOMContentLoaded", () => {
  
  // ========= ELEMENT พื้นฐาน =========
  // (การ์ด)
  const petCardLink = document.getElementById("pet-card-link");
  const petNameEl = document.getElementById("petName");
  const petImageEl = document.getElementById("petImage");
  
  const userCardLink = document.getElementById("user-card-link");
  const userNameEl = document.getElementById("userName");
  const userEmailEl = document.getElementById("userEmail");
  const userPhoneEl = document.getElementById("userPhone");
  const userAddressEl = document.getElementById("userAddress");

  // (Timeline)
  const steps = document.querySelectorAll(".status-step");
  const pickupTitleEl = document.getElementById("pickupTitle");
  const pickupIconEl = document.getElementById("pickupIcon");
  const pickupMessageEl = document.getElementById("pickupMessage");

  // (ปุ่มหลัก)
  const rejectBtn = document.getElementById("rejectBtn");
  const confirmBtn = document.getElementById("confirmBtn");
  const backBtn = document.getElementById("backBtn");
  
  // (Modals)
  const cancelModal = document.getElementById("admin-cancel-modal");
  const cancelClose = document.getElementById("admin-cancel-close");
  const cancelYes = document.getElementById("admin-cancel-yes");
  
  const handoverModal = document.getElementById("handover-modal");
  const handoverCancel = document.getElementById("handover-cancel");
  const handoverYes = document.getElementById("handover-yes");
  
  const handoverSuccessModal = document.getElementById("handover-success-modal");

  // ========= State ของหน้า =========
  let CURRENT_REQUEST_ID = null;
  let CURRENT_PET_ID = null;
  let CURRENT_USER_ID = null;
  let CURRENT_PICKUP_TYPE = 'SELF_PICKUP';

  // ========= CONFIG สถานะ =========
  const STATUS_CONFIG = {
    APPROVED: {
      completed: ["request", "approval"], // (✓ ✓ เทา)
      rejected: null,
      showActions: true, // (แสดงปุ่ม แดง/เขียว)
    },
    COMPLETED: {
      completed: ["request", "approval", "handover"], // (✓ ✓ ✓)
      rejected: null,
      showActions: false, // (ซ่อนปุ่ม แดง/เขียว)
    },
  };
  
  // (Helper: สำหรับจัดรูปแบบวันที่)
  function formatDate(dateString) {
      if (!dateString) return "dd/mm/yyyy";
      try {
          const date = new Date(dateString);
          return date.toLocaleDateString('th-TH', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
          });
      } catch (e) {
          return dateString; // (ถ้า format มาแปลกๆ ก็แสดงแบบเดิม)
      }
  }


  // ========= 1. ฟังก์ชันดึงข้อมูลหลัก (อัปเกรดแล้ว!) =========
  async function loadStatusData(petId, statusFromUrl) {
    if (!petId) {
        alert("ไม่พบ ID ของสัตว์เลี้ยง (PetID)");
        window.location.href = 'allpet.html';
        return;
    }
    if (!statusFromUrl || (statusFromUrl.toUpperCase() !== 'APPROVED' && statusFromUrl.toUpperCase() !== 'COMPLETED')) {
        alert("สถานะไม่ถูกต้อง (ต้องเป็น Approved หรือ Completed)");
        window.location.href = 'allpet.html';
        return;
    }
    
    CURRENT_PET_ID = petId;
    const currentStatusKey = statusFromUrl.toUpperCase(); 

    // [!! ใหม่ !!] อ่านค่า Pickup Type จาก URL (ถ้าไม่ระบุ ให้เป็น SELF_PICKUP)
    const urlParams = new URLSearchParams(window.location.search);
    const pickupFromUrl = urlParams.get("pickup_type") || "SELF_PICKUP";

    // [!! ในโลกจริง: Backend จะหา Request ที่ 'APPROVED' หรือ 'COMPLETED' ของ PetId นี้ !!]
    try {
        // ... (ส่วน fetch ที่ comment ไว้) ...
        
        // [!! Mock Data (อัปเกรดแล้ว!) !!]
        const data = {
            requestId: "R123",
            petId: petId, 
            petName: "พยัคฆ์เสี้ยววาน (Mock)",
            petImageUrl: "../images/sample-pet.jpg",
            
            userId: "U456", 
            userName: "คุณคนสวย จริงใจ",
            userEmail: "khonsuay@example.com",
            userAvatarUrl: "../images/default-user.png",
            userPhone: "081-234-5678",
            userAddress: "123/45 กทม. 10110 (ที่อยู่ Mock)",
            
            request_status: currentStatusKey, // (ใช้ status จาก URL)
            
            pickup_type: pickupFromUrl, // [!! แก้ไข !!] (ใช้ pickup_type จาก URL)
            
            appointment_date: "2025-11-20",
            completion_date: "2025-11-25" 
        };
        // [!! จบส่วน Mock Data !!]

        // 1.1 เก็บ State
        CURRENT_REQUEST_ID = data.requestId;
        CURRENT_USER_ID = data.userId;
        CURRENT_PICKUP_TYPE = data.pickup_type; // (State นี้จะถูกอัปเดตตาม URL)

        // 1.2 เติมข้อมูลการ์ด Pet (เหมือนเดิม)
        petNameEl.textContent = data.petName;
        // ... (โค้ดเติมการ์ด Pet) ...
        petCardLink.href = `petdetail.html?id=${data.petId}`;

        // 1.3 เติมข้อมูลการ์ด User (เหมือนเดิม)
        userNameEl.textContent = data.userName;
        // ... (โค้ดเติมการ์ด User) ...
        userCardLink.href = `../User/viewform.html?id=${data.userId}`; 
        if (data.pickup_type === 'DELIVERY') {
            userAddressEl.textContent = data.userAddress;
            userAddressEl.classList.add('show');
        } else {
            userAddressEl.classList.remove('show');
        }

        // 1.4 สั่ง Render หน้า (เหมือนเดิม)
        renderStatus(data.request_status); 
        updatePickup(data.request_status, data.pickup_type, data.appointment_date, data.completion_date);

    } catch (error) {
        console.error("Failed to load data:", error);
        alert(error.message);
    }
  }


  // ========= 2. ฟังก์ชันวาด timeline และปุ่ม =========
  function renderStatus(statusKey) {
    const cfg = STATUS_CONFIG[statusKey];
    if (!cfg) {
        console.warn(`ไม่พบ Config สำหรับ status: ${statusKey}`);
        return;
    }

    // (ล้างคลาสเดิม)
    steps.forEach((step) =>
      step.classList.remove("completed", "rejected")
    );
    // (เติม completed)
    cfg.completed.forEach((key) => {
      const step = document.querySelector(
        `.status-step[data-key="${key}"]`
      );
      if (step) step.classList.add("completed");
    });
    // (ใส่ไอคอน)
    steps.forEach((step) => {
      const icon = step.querySelector(".circle-icon");
      if (!icon) return;
      if (step.classList.contains("rejected")) {
        icon.textContent = "✗";
      } else if (step.classList.contains("completed")) {
        icon.textContent = "✓";
      }
    });

    // (ซ่อน/แสดง ปุ่มหลัก)
    if (cfg.showActions) {
      if (rejectBtn) rejectBtn.style.display = "inline-flex";
      if (confirmBtn) confirmBtn.style.display = "inline-flex";
      if (backBtn) backBtn.style.display = "none";
    } else {
      if (rejectBtn) rejectBtn.style.display = "none";
      if (confirmBtn) confirmBtn.style.display = "none"; 
      if (backBtn) backBtn.style.display = "inline-flex";
    }
  }

  // ========= 3. update ข้อความ Delivery / Self Pickup (ตามบรีฟใหม่) =========
  function updatePickup(statusKey, type, appDate, compDate) {
    
    const appointmentDate = formatDate(appDate); 
    const completionDate = formatDate(compDate);

    if (type === "SELF_PICKUP") {
      if (pickupTitleEl) pickupTitleEl.textContent = "Self Pickup";
      if (pickupIconEl) pickupIconEl.textContent = "🐾";
      let msg = "";
      if (statusKey === "APPROVED") {
        msg = `ผู้รับเลี้ยงจะมารับสัตว์เลี้ยงภายในวันที่ ${appointmentDate}`;
      } else if (statusKey === "COMPLETED") {
        msg = `ดำเนินการรับเลี้ยงสัตว์สำเร็จเรียบร้อยแล้วเมื่อวันที่ ${completionDate}`;
      }
      if (pickupMessageEl) pickupMessageEl.textContent = msg;

    } else { // DELIVERY
      if (pickupTitleEl) pickupTitleEl.textContent = "Delivery";
      if (pickupIconEl) pickupIconEl.textContent = "🚚";
      let msg = "";
      if (statusKey === "APPROVED") {
        msg = `ระบบได้บันทึกวันจัดส่งสัตว์เลี้ยงให้ผู้รับเลี้ยงในวันที่ ${appointmentDate} เรียบร้อยแล้ว`;
      } else if (statusKey === "COMPLETED") {
        msg = `ดำเนินการรับเลี้ยงสำเร็จเรียบร้อยแล้วเมื่อวันที่ ${completionDate}`;
      }
      if (pickupMessageEl) pickupMessageEl.textContent = msg;
    }
  }

  // ========= 4. Event Listeners (ปุ่มและ Modal) =========
  
  function showModal(modal) {
      if (modal) modal.classList.add("active");
  }
  function hideModal(modal) {
      if (modal) modal.classList.remove("active");
  }

  if (rejectBtn) {
    rejectBtn.addEventListener("click", () => showModal(cancelModal));
  }
  if (confirmBtn) {
    confirmBtn.addEventListener("click", () => showModal(handoverModal));
  }
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      window.location.href = "allpet.html";
    });
  }

  if (cancelModal) {
    cancelClose.addEventListener("click", () => hideModal(cancelModal));
    cancelModal.addEventListener("click", (e) => {
      if (e.target === cancelModal) hideModal(cancelModal);
    });
    cancelYes.addEventListener("click", async () => {
      console.log(`(Admin) ส่ง API ยกเลิก Request ID: ${CURRENT_REQUEST_ID}`);
      hideModal(cancelModal);
      alert("ยกเลิกคำขอรับเลี้ยงเรียบร้อยแล้ว");
      window.location.href = "allpet.html"; 
    });
  }

  if (handoverModal) {
    handoverCancel.addEventListener("click", () => hideModal(handoverModal));
    handoverModal.addEventListener("click", (e) => {
      if (e.target === handoverModal) hideModal(handoverModal);
    });
    handoverYes.addEventListener("click", async () => {
      console.log(`(Admin) ส่ง API ยืนยันส่งมอบ Request ID: ${CURRENT_REQUEST_ID}`);
      hideModal(handoverModal);
      showModal(handoverSuccessModal); 
      
      const today = new Date().toISOString(); 
      renderStatus("COMPLETED");
      updatePickup("COMPLETED", CURRENT_PICKUP_TYPE, null, today);
    });
  }
  
  if (handoverSuccessModal) {
      handoverSuccessModal.addEventListener("click", (e) => {
          hideModal(handoverSuccessModal);
      });
  }

  // ========= 5. เริ่มต้นการทำงาน (ดึงข้อมูล) =========
  const urlParams = new URLSearchParams(window.location.search);
  const petIdFromUrl = urlParams.get("pet_id") || urlParams.get("id");
  const statusFromUrl = urlParams.get("status"); // (ดึง Status จาก URL)
  
  loadStatusData(petIdFromUrl, statusFromUrl); // (ส่งค่าทั้ง 2 ตัวไป)

});