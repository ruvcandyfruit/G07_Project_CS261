//  2-frontend/status(user) branch

// =======================
//  CONFIG สถานะ – ใช้คุม step + ปุ่ม
// =======================
const STATUS_CONFIG = {
  // 1. ส่งคำขอ (pending)
  pending: {
    completedSteps: ["request"],
    rejectedStep: null,
    showCancel: true,
    showEdit: true, // (สำหรับปุ่มใน Modal)
    cancelText: "ยกเลิกการรับเลี้ยง",
    showBack: false,
  },

  // 2. อนุมัติคำขอ (รอรับ)
  approved: {
    completedSteps: ["request", "approval"],
    rejectedStep: null,
    showCancel: true,
    showEdit: false,
    cancelText: "ยกเลิกการรับเลี้ยง",
    showBack: false,
  },

  // 2. ปฏิเสธคำขอ
  approvalRejected: {
    completedSteps: ["request"],
    rejectedStep: "approval",
    showCancel: false,
    showEdit: false,
    showBack: true,
  },

  // 3. ส่งมอบสำเร็จ
  completed: {
    completedSteps: ["request", "approval", "handover"],
    rejectedStep: null,
    showCancel: false,
    showEdit: false,
    showBack: true,
  },

  // 3. ส่งมอบไม่สำเร็จ / ถูกยกเลิก
  handoverFailed: {
    completedSteps: ["request", "approval"],
    rejectedStep: "handover",
    showCancel: false,
    showEdit: false,
    showBack: true,
  },
};

// map status จาก backend -> key ใน STATUS_CONFIG
const STATUS_MAP = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "approvalRejected",
  COMPLETED: "completed",
  HANDOVER_FAILED: "handoverFailed",
  CANCELED: "handoverFailed", // (สำหรับ Test Case 9, 10)
  CANCELED_PENDING: "approvalRejected", 
  CANCELED_APPROVED: "handoverFailed",
};

// Mock API data ตาม Form Model (สำหรับ Modal)
const mockFormData = {
    id: 1,
    firstName: "สมสวย",
    lastName: "คนงาม",
    dob: "1995-01-10", // LocalDate format จาก API
    phone: "0812345678",
    email: "khonsuay@example.com",
    occupation: "Frontend Developer",
    identityDoc: "https://example.com/uploads/identity-somchai.pdf",
    address: "123 ถนนสุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพฯ 10110",
    residenceType: "คอนโด",
    residenceDoc: "https://example.com/uploads/residence-somchai.pdf",
    experience: "เคยเลี้ยงแมวเปอร์เซีย 1 ตัวค่ะ",
    reason: "รักแมวมากค่ะ",
    trueInfo: true,
    acceptRight: true,
    homeVisits: true,
    recieveType: "มารับด้วยตนเอง",
    user: {
        id: 101,
        username: "khonsuay_dev",
        email: "khonsuay@example.com",
        role: "USER",
        active: true
    },
    pet: {
        id: 5,
        petID: "PET001",
        type: "แมว",
        image: "https://example.com/uploads/cat-lucky.jpg",
        name: "Lucky",
        age: 2,
        gender: "เมีย",
        breed: "แมวไทย",
        weight: 3.5,
        sterilisation: true,
        vaccine: true,
        disease: "ไม่มี",
        foodAllergy: "ไม่มี",
        status: "AVAILABLE"
    },
    status: "PENDING", // (สถานะนี้มาจาก mock data ของฟอร์ม)
    approvedBy: null,
    approvedAt: null,
    meetDate: null
};

// API Configuration
const API_BASE_URL = 'http://localhost:8080/api'; // (URL จริง)

// =======================
//  HELPER FUNCTIONS
// =======================

// ฟังก์ชันแปลงวันที่จาก YYYY-MM-DD เป็น DD/MM/YYYY
function formatDateThai(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString); // (เผื่อ format อื่นๆ)
    if (isNaN(date.getTime())) {
        // ถ้า YYYY-MM-DD
        const parts = dateString.split('-');
        if (parts.length === 3) {
            return `${parts[2]}/${parts[1]}/${parts[0]}`;
        }
        return dateString; // คืนค่าเดิมถ้าไม่รู้จัก
    }
    // ถ้าเป็น ISO string
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}


// Fetch data for FORM (Modal)
async function fetchUserFormFromAPI(formId) {
    const response = await fetch(`${API_BASE_URL}/userform/${formId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            // 'Authorization': 'Bearer YOUR_TOKEN' 
        }
    });
    if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
    }
    return await response.json();
}

// Get user form (Modal) with fallback to mock data
async function getUserForm(formId) {
    try {
        console.log(`🔄 กำลังเรียก API (Form data) สำหรับ formId: ${formId}`);
        const data = await fetchUserFormFromAPI(formId);
        console.log('✅ เรียก API (Form data) สำเร็จ:', data);
        return data;
    } catch (error) {
        console.warn('⚠️ เรียก API (Form data) ไม่สำเร็จ:', error.message);
        console.log('📦 ใช้ Mock Data (Form data) แทน');
        return new Promise((resolve) => {
            setTimeout(() => {
                // คืนค่า mock โดยจำลองว่า id ตรงกัน
                resolve({ ...mockFormData, id: formId }); 
            }, 500);
        });
    }
}

// Load form data (Modal) โหลดข้อมูลฟอร์มและแสดงใน overlay
async function loadFormData(formId) {
    try {
        console.log('📝 เริ่มโหลดข้อมูลฟอร์ม (Modal)...');
        const loadingEl = document.getElementById('loading');
        const formContentEl = document.getElementById('formContent');
        const editFormBtn = document.getElementById('editFormBtn');

        if (loadingEl) loadingEl.style.display = 'block';
        if (formContentEl) formContentEl.style.display = 'none';

        await new Promise(resolve => setTimeout(resolve, 100));
        
        const data = await getUserForm(formId);

        console.log('📦 Data received (Modal):', data);

        // Populate user info (Header ของฟอร์ม)
        document.getElementById('formUserName').textContent = data.user.username;
        document.getElementById('formUserEmail').textContent = data.user.email;

        // Populate form fields
        document.getElementById('firstName').value = data.firstName;
        document.getElementById('lastName').value = data.lastName;
        document.getElementById('dob').value = formatDateThai(data.dob);
        document.getElementById('phone').value = data.phone;
        document.getElementById('email').value = data.email;
        document.getElementById('occupation').value = data.occupation;
        document.getElementById('address').value = data.address;
        document.getElementById('residenceType').value = data.residenceType;
        document.getElementById('recieveType').value = data.recieveType || '-';
        document.getElementById('experience').value = data.experience;
        document.getElementById('reason').value = data.reason;

        // ทำให้ฟอร์มแก้ไขไม่ได้ (read-only)
        const formInputs = document.querySelectorAll('.form-input, .form-textarea');
        formInputs.forEach(input => input.disabled = true);

        // [!! สำคัญ !!] แสดง/ซ่อน ปุ่ม "แก้ไขฟอร์ม" ตามสถานะ (currentShowEdit)
        if (editFormBtn) {
            editFormBtn.style.display = currentShowEdit ? 'inline-block' : 'none';
        }

        console.log('✅ โหลดข้อมูลฟอร์ม (Modal) สำเร็จ');
        if (loadingEl) loadingEl.style.display = 'none';
        if (formContentEl) formContentEl.style.display = 'block';

    } catch (error) {
        console.error('❌ Error loading form (Modal):', error);
        alert('เกิดข้อผิดพลาดในการโหลดข้อมูลฟอร์ม');
    }
}


// =======================
//  MAIN
// =======================
document.addEventListener("DOMContentLoaded", () => {
  // ดึง DOM elements ทั้งหมด
  const steps = document.querySelectorAll(".status-step");
  const pickupTitleEl = document.getElementById("pickup-title-text");
  const pickupMessageEl = document.getElementById("pickup-message");
  const pickupIconEl = document.querySelector(".pickup-icon");

  const primaryBtn = document.getElementById("primary-action-btn");
  const backBtn = document.getElementById("back-btn");
  
  // (เรา comment out <select> ใน HTML ไปแล้ว แต่เผื่ออนาคต)
  const statusSelect = document.getElementById("status-select"); 

  // element popup ยกเลิก
  const cancelModal = document.getElementById("cancel-modal");
  const cancelModalClose = document.getElementById("cancel-modal-close");
  const cancelModalConfirm = document.getElementById("cancel-modal-confirm");

  // element สำหรับ header การ์ดด้านบน
  const petCard = document.querySelector(".card-pet");
  const petNameEl = document.getElementById("pet-name");
  const petImageEl = document.getElementById("petImage");
  
  const userCard = document.getElementById("view-form-card");
  const userNameEl = document.getElementById("user-username"); // [!! สำคัญ !!]
  const userEmailEl = document.getElementById("user-email"); // [!! สำคัญ !!]

  // element สำหรับ Modal (Form)
  const overlayEl = document.querySelector('.overlay');
  const formBackBtn = document.getElementById('backBtn'); // (ปุ่มใน Modal)
  const formModalCloseBtn = document.getElementById('formModalCloseBtn');
  const editFormBtn = document.getElementById('editFormBtn');

  // ดึง formId จาก query string เช่น status.html?formId=5
  const params = new URLSearchParams(window.location.search);
  const formId = params.get("formId"); // (นี่คือ ID หลักของหน้า)

  // state ในหน้านี้
  let currentStatus = "pending";
  let currentShowEdit = false; // (สถานะปุ่มแก้ไข)
  let pickupType = "SELF_PICKUP";
  let pickupDate = null; 
  let petId = null;

  // -------- [!! แก้ไข !!] ฟังก์ชัน update pickup box (ตาม Test Cases 1-10) --------
  function updatePickupView(statusKey) {
    let title = "Pickup";
    let icon = "🐾";
    let message = "";
    
    // (ใช้ '20/11/2025' ถ้าไม่มีข้อมูล)
    const dateStr = pickupDate ? formatDateThai(pickupDate) : "[DATE]"; 
    const addressStr = "[ที่อยู่มูลนิธิ]"; // (ใส่ที่อยู่จริงถ้ามี)

    if (pickupType === "DELIVERY") {
      title = "Delivery";
      icon = "🚚";

      switch (statusKey) {
        case "pending": // Test Case 1
          message = "คำขออยู่ระหว่างรอพิจารณาโดยเจ้าหน้าที่";
          break;
        case "approved": // Test Case 3
          message = `มูลนิธิจะจัดส่งสัตว์เลี้ยงให้คุณในวันที่ ${dateStr}`;
          break;
        case "approvalRejected": // Test Case 5
          message = "คำขอรับเลี้ยงได้ถูกปฎิเสธโดยเจ้าหน้าที่";
          break;
        case "completed": // Test Case 7
          message = "ดำเนินการรับเลี้ยงสำเร็จเรียบร้อยแล้ว";
          break;
        case "handoverFailed": // Test Case 9 (Canceled)
          message = "คำขอรับเลี้ยงถูกยกเลิกเนื่องจากเลยเวลานัดหมาย/เจ้าหน้าที่ยกเลิกการส่งมอบครั้งนี้/คุณได้ยกเลิกการรับเลี้ยงแล้ว";
          break;
        default:
          message = "กำลังโหลดข้อมูล...";
      }
    } else { // Self Pickup
      title = "Self Pickup";
      icon = "🐾";

      switch (statusKey) {
        case "pending": // Test Case 2
          message = "คำขออยู่ระหว่างรอพิจารณาโดยเจ้าหน้าที่";
          break;
        case "approved": // Test Case 4
          message = `กรุณามารับสัตว์เลี้ยงของคุณภายในวันที่ ${dateStr}\n${addressStr}`;
          break;
        case "approvalRejected": // Test Case 6
          message = "คำขอรับเลี้ยงได้ถูกปฎิเสธโดยเจ้าหน้าที่";
          break;
        case "completed": // Test Case 8
          message = "ดำเนินการรับเลี้ยงสำเร็จเรียบร้อยแล้ว";
          break;
        case "handoverFailed": // Test Case 10 (Canceled)
          message = "คำขอรับเลี้ยงถูกยกเลิกเนื่องจากเลยเวลาที่กำหนด/เจ้าหน้าที่ยกเลิกการส่งมอบครั้งนี้/คุณได้ยกเลิกการรับเลี้ยงแล้ว";
          break;
        default:
          message = "กำลังโหลดข้อมูล...";
      }
    }

    // อัปเดตข้อความใน DOM
    if (pickupTitleEl) pickupTitleEl.textContent = title;
    if (pickupMessageEl) pickupMessageEl.textContent = message;
    if (pickupIconEl) pickupIconEl.textContent = icon;

    // (จัดการ \n ให้ขึ้นบรรทัดใหม่)
    if (pickupMessageEl && pickupType === "SELF_PICKUP" && statusKey === "approved") {
        pickupMessageEl.style.whiteSpace = "pre-line";
    } else {
        pickupMessageEl.style.whiteSpace = "normal";
    }
  }

  // -------- ฟังก์ชัน render timeline / ปุ่มต่าง ๆ --------
  function renderStatus(statusKey) {
    const config = STATUS_CONFIG[statusKey];
    if (!config) return;

    currentStatus = statusKey;
    currentShowEdit = config.showEdit; // [!! สำคัญ !!] (เก็บสถานะปุ่มแก้ไข)

    // รีเซ็ต class
    steps.forEach((s) => s.classList.remove("completed", "rejected"));

    // ขั้นตอนที่สำเร็จ
    config.completedSteps.forEach((key) => {
      const step = document.querySelector(`.status-step[data-key="${key}"]`);
      if (step) step.classList.add("completed");
    });

    // ขั้นตอนที่ล้มเหลว
    if (config.rejectedStep) {
      const failedStep = document.querySelector(
        `.status-step[data-key="${config.rejectedStep}"]`
      );
      if (failedStep) failedStep.classList.add("rejected");
    }

    // อัปเดต icon ✓ / ✗
    steps.forEach((step) => {
      const icon = step.querySelector(".circle-icon");
      if (!icon) return;

      if (step.classList.contains("rejected")) {
        icon.textContent = "✗";
      } else if (step.classList.contains("completed")) {
        icon.textContent = "✓";
      } else {
        icon.textContent = "";
      }
    });

    // ปุ่มยกเลิก / ย้อนกลับ (หน้าหลัก)
    if (config.showCancel) {
      primaryBtn.style.display = "inline-block";
      primaryBtn.textContent = config.cancelText || "ยกเลิกการรับเลี้ยง";
    } else {
      primaryBtn.style.display = "none";
    }

    backBtn.style.display = config.showBack ? "inline-block" : "none";
    
    // sync dropdown (ตัว preview)
    if (statusSelect) {
      statusSelect.value = statusKey;
    }

    // อัปเดต pickup box ตาม status + pickupType
    updatePickupView(statusKey);

    if (currentStatus === "approved") {
    messageBox.textContent = `ระบบได้บันทึกวันจัดส่งสัตว์เลี้ยงให้ผู้รับเลี้ยงในวันที่ ${pickupDate}`;
}

if (currentStatus === "completed") {
    messageBox.textContent = `ดำเนินการรับเลี้ยงสำเร็จเรียบร้อยแล้วเมื่อวันที่ ${pickupDate}`;
}
if (currentStatus === "approved") {
   step1.classList.add("done");
   step2.classList.add("done");
   step3.classList.remove("done");
}

if (currentStatus === "completed") {
   step1.classList.add("done");
   step2.classList.add("done");
   step3.classList.add("done");
}

  }

  // ----- โหลดข้อมูลจาก backend (สำหรับหน้า Status) -----
  async function loadAdoptionStatus(id) {
    try {
      // (จำลองการ fetch)
      // const res = await fetch(`${API_BASE_URL}/adoption-status/${id}`); 
      // if (!res.ok) throw new Error("Failed to fetch status");
      // const data = await res.json();
      
      // [!! Mock Data (สำหรับ Test หน้า Status) - (เวอร์ชันที่ถูกต้อง) !!]
      const data = {
          petId: "P001", 
          petName: "Lucky (จาก API)",
          petImageUrl: "../images/sample-pet.jpg",
          userName: "khonsuay_api", // [!! ข้อมูล Mock !!]
          userEmail: "khonsuay@api.com", // [!! ข้อมูล Mock !!]
          pickupType: "DELIVERY", // หรือ "DELIVERY" "SELF_PICKUP"
          pickupDate: "2025-11-20", // (วันที่นัดรับ/ส่ง)
          status: "APPROVED" // (PENDING, APPROVED, REJECTED, COMPLETED, CANCELED)
      };
      // [!! จบส่วน Mock Data !!]


      // เติมข้อมูลใน card ด้านบน
      if (petNameEl) petNameEl.textContent = data.petName;
      if (petImageEl) petImageEl.src = data.petImageUrl || "../images/sample-pet.jpg";

      // [!! แก้ไข !!] เติมข้อมูล User Card (นี่คือส่วนที่ถูกต้อง)
      if (userNameEl) userNameEl.textContent = data.userName;
      if (userEmailEl) userEmailEl.textContent = data.userEmail;

      // [!! เพิ่ม !!] เก็บ petId ไว้สร้าง Link
      petId = data.petId; 

      // เก็บ pickupType / pickupDate จาก backend
      pickupType = data.pickupType || "SELF_PICKUP";  
      pickupDate = data.pickupDate || null;           

      // สถานะจาก backend -> render timeline + pickup box
      const key = STATUS_MAP[data.status] || "pending";
      renderStatus(key);

    } catch (err) {
      console.error("Error loading adoption status", err);
      renderStatus("pending"); // (ถ้าพัง ให้แสดง pending)
    }
  }


  // ===================================
  //  FORM OVERLAY (ดูฟอร์มผู้ใช้)
  // ===================================

  // ฟังก์ชันเปิด overlay
  function openFormOverlay() {
      if (overlayEl) {
          overlayEl.classList.add('active');
          // โหลดข้อมูลฟอร์ม (ใช้ formId จาก URL)
          loadFormData(formId);
      }
  }

  // ฟังก์ชันปิด overlay
  function closeFormOverlay() {
      if (overlayEl) {
          overlayEl.classList.remove('active');
      }
  }

  // เมื่อคลิก user card
  if (userCard) {
      userCard.addEventListener("click", openFormOverlay);
  }

  // คลิกนอก container (บนพื้นหลังสีดำ) ให้ปิด overlay
  if (overlayEl) {
      overlayEl.addEventListener('click', (e) => {
          if (e.target === overlayEl) {
              closeFormOverlay();
          }
      });
  }

  // [!! เพิ่ม !!] ปุ่ม 'X' ปิด Modal
  if (formModalCloseBtn) {
      formModalCloseBtn.addEventListener('click', closeFormOverlay);
  }

  // ปุ่มย้อนกลับใน form ให้ปิด overlay
  if (formBackBtn) {
      formBackBtn.addEventListener('click', function(e) {
          e.preventDefault(); // ป้องกันการ submit form
          closeFormOverlay();
      });
  }

  // [!! เพิ่ม !!] ปุ่ม "แก้ไขฟอร์ม" ใน Modal
  if (editFormBtn) {
      editFormBtn.addEventListener('click', function() {
          if (formId) {
              // (พาไปหน้า userform.html mode=edit)
              window.location.href = `userform.html?mode=edit&formId=${formId}`;
          } else {
              alert('ไม่พบ ID ของฟอร์ม');
          }
      });
  }


  // ----- Event Listeners (ที่เหลือ) -----

  // การ์ด Pet (ไปหน้า petdetail)
  if (petCard) {
      petCard.addEventListener("click", (e) => {
          if (petId) {
              // (สมมติว่าอยู่ path เดียวกัน)
              window.location.href = `petdetail.html?id=${petId}`;
          } else {
              console.warn("No Pet ID loaded");
          }
      });
  }
  
  // ====== ปุ่มยกเลิก (หน้าหลัก) -> popup ======
  primaryBtn.addEventListener("click", () => {
    if (!cancelModal) return;
    cancelModal.classList.add("active");
  });

  // ปิด modal (Cancel) เมื่อกดปุ่ม CANCEL
  if (cancelModalClose) {
    cancelModalClose.addEventListener("click", () => {
      cancelModal.classList.remove("active");
    });
  }

  // คลิก overlay ด้านนอก (Cancel Modal) ก็ปิดได้
  if (cancelModal) {
    cancelModal.addEventListener("click", (e) => {
      if (e.target === cancelModal) {
        cancelModal.classList.remove("active");
      }
    });
  }

  // กด YES (Confirm Cancel)
  if (cancelModalConfirm) {
    cancelModalConfirm.addEventListener("click", async () => {
      if (!formId) {
        alert("ไม่พบคำขอรับเลี้ยงที่ต้องการยกเลิก");
        return;
      }
      
      console.log(`Sending CANCEL request for formId: ${formId}`);
      alert("จำลองการยกเลิก (ดู Console log)");
      cancelModal.classList.remove("active");
      
      // (โค้ดจริงจะเรียก API ยกเลิก)
      /*
      try {
        const res = await fetch(`${API_BASE_URL}/userform/${formId}/cancel`, {
          method: "POST", 
        });
        if (!res.ok) throw new Error("Cancel failed");

        alert("ยกเลิกคำขอรับเลี้ยงเรียบร้อยแล้ว");
        // โหลดหน้าใหม่เพื่อดูสถานะ (เช่น CANCELED/handoverFailed)
        loadAdoptionStatus(formId); 

      } catch (err) {
        alert("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
      }
      */
    });
  }

  // ปุ่มย้อนกลับ (หน้าหลัก) -> ไป Pet Listing
  backBtn.addEventListener("click", () => {
    window.location.href = "petlisting.html";
  });


  // ----- โหลดข้อมูลครั้งแรก -----
  if (formId) {
    // มี id จาก backend → โหลดข้อมูลจริง
    loadAdoptionStatus(formId);
  } else {
    // ไม่มี id → ใช้ mock ค่าไว้ก่อน (สำหรับเทสหน้าเปล่าๆ)
    console.warn("ไม่มี formId ใน URL! กำลังใช้ mock data เริ่มต้น");
    renderStatus("pending");
  }

  // dropdown preview UI (ไว้เทสต์)
  if (statusSelect) {
    statusSelect.addEventListener("change", (e) => {
      const newStatus = e.target.value;
      renderStatus(newStatus);
    });
  }

});