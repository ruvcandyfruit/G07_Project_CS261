// =======================
//  CONFIG สถานะ – ใช้คุม step + ปุ่ม
// =======================
const STATUS_CONFIG = {
  // 1. ส่งคำขอ (pending)
  pending: {
    completedSteps: ["request"],
    rejectedStep: null,
    showCancel: true,
    showEdit: true, // [!! เพิ่ม !!]
    cancelText: "ยกเลิกการรับเลี้ยง",
    showBack: false,
  },

  // 2. อนุมัติคำขอ (รอรับ)
  approved: {
    completedSteps: ["request", "approval"],
    rejectedStep: null,
    showCancel: true,
    showEdit: false, // [!! เพิ่ม !!]
    cancelText: "ยกเลิกการรับเลี้ยง",
    showBack: false,
  },

  // 2. ปฏิเสธคำขอ
  approvalRejected: {
    completedSteps: ["request"],
    rejectedStep: "approval",
    showCancel: false,
    showEdit: false, // [!! เพิ่ม !!]
    showBack: true,
  },

  // 3. ส่งมอบสำเร็จ
  completed: {
    completedSteps: ["request", "approval", "handover"],
    rejectedStep: null,
    showCancel: false,
    showEdit: false, // [!! เพิ่ม !!]
    showBack: true,
  },

  // 3. ส่งมอบไม่สำเร็จ
  handoverFailed: {
    completedSteps: ["request", "approval"],
    rejectedStep: "handover",
    showCancel: false,
    showEdit: false, // [!! เพิ่ม !!]
    showBack: true,
  },
};

// map status จาก backend -> key ใน STATUS_CONFIG
// [!! เพิ่ม !!] (ฉันเดา key จากฝั่ง Admin ให้นะคะ)
const STATUS_MAP = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "approvalRejected",
  COMPLETED: "completed", // (Adopted)
  CANCELED_PENDING: "approvalRejected", // (สมมติว่า Cancelled = Rejected)
  CANCELED_APPROVED: "handoverFailed", // (สมมติว่า Cancelled = Failed)
  HANDOVER_FAILED: "handoverFailed",
};


// =======================
//  MAIN
// =======================
document.addEventListener("DOMContentLoaded", () => {
  const steps = document.querySelectorAll(".status-step");
  const pickupTitleEl = document.getElementById("pickup-title-text");
  const pickupMessageEl = document.getElementById("pickup-message");
  const pickupIconEl = document.querySelector(".pickup-icon");

  const primaryBtn = document.getElementById("primary-action-btn");
  const backBtn = document.getElementById("back-btn");
  const statusSelect = document.getElementById("status-select");
  const editFormBtn = document.getElementById("edit-form-btn");

  // element popup ยกเลิก
  const cancelModal = document.getElementById("cancel-modal");
  const cancelModalClose = document.getElementById("cancel-modal-close");
  const cancelModalConfirm = document.getElementById("cancel-modal-confirm");

  // element สำหรับ header การ์ดด้านบน
  // [!! แก้ไข !!] (เลือกตัวการ์ด ไม่ใช่แค่ข้อความ)
  const petCard = document.querySelector(".card-pet");
  const userCard = document.querySelector(".card-user");
  
  const petNameEl = document.getElementById("pet-name");
  const petImageEl = document.getElementById("petImage");
  const userNameEl = document.getElementById("user-username");
  const userEmailEl = document.getElementById("user-email");
  const userAvatarEl = document.getElementById("userAvatar");

  // ดึง adoptionId จาก query string เช่น status.html?adoptionId=5
  const params = new URLSearchParams(window.location.search);
  const adoptionId = params.get("adoptionId");

  // state ในหน้านี้
  let currentStatus = "pending";        // key ใน STATUS_CONFIG
  let pickupType = "SELF_PICKUP";       // SELF_PICKUP หรือ DELIVERY
  let pickupDate = null;                // string เช่น "2025-12-01"
  let petId = null; // [!! เพิ่ม !!] (สำหรับลิงก์ไปหน้า petdetail)


  // -------- ฟังก์ชัน update pickup box ตาม status + pickupType --------
  function updatePickupView(statusKey) {
    let title = "Pickup";
    let icon = "🐾";
    let message = "";

    if (pickupType === "DELIVERY") {
      // ------- กรณีเลือก Delivery -------
      title = "Delivery";
      icon = "🚚"; // [!! แก้ไข !!] (ใช้ icon รถส่งของ)

      if (statusKey === "pending") {
        message = "คำขออยู่ระหว่างรอพิจารณาโดยเจ้าหน้าที่"; // (ตามรูป)
      } else if (statusKey === "approved") {
        message = "มูลนิธิจะจัดส่งสัตว์เลี้ยงให้คุณในวันที่ " + (pickupDate || "[DATE]"); // (ตามรูป)
      } else if (statusKey === "completed") {
        message = "ดำเนินการจัดส่งสัตว์เลี้ยงเรียบร้อยแล้ว"; // (ตามรูป)
      } else if (statusKey === "handoverFailed") {
        message = "คำขอรับเลี้ยงถูกยกเลิกเนื่องจากเลยเวลานัดหมาย"; // (ตามรูป)
      } else if (statusKey === "approvalRejected") {
        message = "คำขอรับเลี้ยงได้ถูกปฏิเสธโดยเจ้าหน้าที่"; // (ตามรูป)
      }

    } else {
      // ------- กรณี Self Pickup -------
      title = "Self Pickup";
      icon = "🐾";

      if (statusKey === "pending") {
        message = "คำขออยู่ระหว่างรอพิจารณาโดยเจ้าหน้าที่"; // (ตามรูป)
      } else if (statusKey === "approved") {
        message = "กรุณามารับสัตว์เลี้ยงของคุณภายในวันที่ " + (pickupDate || "[DATE]") + " [ที่อยู่มูลนิธิ]"; // (ตามรูป)
      } else if (statusKey === "completed") {
        message = "ดำเนินการรับสัตว์เลี้ยงเรียบร้อยแล้ว"; // (ตามรูป)
      } else if (statusKey === "handoverFailed") {
        message = "คำขอรับเลี้ยงถูกยกเลิกเนื่องจากเลยเวลานัดหมาย"; // (ตามรูป)
      } else if (statusKey === "approvalRejected") {
        message = "คำขอรับเลี้ยงได้ถูกปฏิเสธโดยเจ้าหน้าที่"; // (ตามรูป)
      }
    }

    if (pickupTitleEl) pickupTitleEl.textContent = title;
    if (pickupMessageEl) pickupMessageEl.textContent = message;
    if (pickupIconEl) pickupIconEl.textContent = icon;
  }


  // -------- ฟังก์ชัน render timeline / ปุ่มต่าง ๆ --------
  function renderStatus(statusKey) {
    const config = STATUS_CONFIG[statusKey];
    if (!config) return;

    currentStatus = statusKey;

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
        icon.textContent = "✗"; // fail (ตามรูป)
      } else if (step.classList.contains("completed")) {
        icon.textContent = "✓"; // success (ตามรูป)
      } else {
        icon.textContent = ""; // ยังไม่ถึง step นี้ (วงเทา)
      }
    });

    // ปุ่มยกเลี้ยง / ย้อนกลับ
    if (config.showCancel) {
      primaryBtn.style.display = "inline-block";
      primaryBtn.textContent = config.cancelText || "ยกเลิกการรับเลี้ยง"; // (ตามรูป)
    } else {
      primaryBtn.style.display = "none";
    }

    backBtn.style.display = config.showBack ? "inline-block" : "none"; // (ปุ่มย้อนกลับ)
    
    // [!! เพิ่ม !!] ซ่อน/แสดง ปุ่ม Edit ตามสถานะ
    if (editFormBtn) {
        editFormBtn.style.display = config.showEdit ? "inline-flex" : "none";
    }

    // sync dropdown (ตัว preview)
    if (statusSelect) {
      statusSelect.value = statusKey;
    }

    // อัปเดต pickup box ตาม status + pickupType
    updatePickupView(statusKey);
  }


  // ----- โหลดข้อมูลจาก backend -----
  async function loadAdoptionFromBackend(id) {
    // (ฟังก์ชันนี้ สมมติว่า Backend ส่งข้อมูลมาตามที่คนสวยอธิบาย)
    try {
      // (จำลองการ fetch)
      // const res = await fetch(`/api/adoptions/${id}`);
      // if (!res.ok) throw new Error("Failed to fetch");
      // const data = await res.json();
      
      // [!! Mock Data (สำหรับ Test) !!]
      const data = {
          petId: "P001", // (ต้องมี petId)
          petName: "Lucky (From API)",
          petImageUrl: "../images/sample-pet.jpg",
          userName: "User (From API)",
          userEmail: "api@example.com",
          userImageUrl: "../images/default-user.png",
          pickupType: "SELF_PICKUP", // "DELIVERY"
          pickupDate: "2025-11-20",
          status: "PENDING" // (Backend ส่ง PENDING, APPROVED, REJECTED, COMPLETED, HANDOVER_FAILED)
      };
      // [!! จบส่วน Mock Data !!]


      // เติมข้อมูลใน card ด้านบน
      if (petNameEl) petNameEl.textContent = data.petName;
      if (petImageEl) petImageEl.src = data.petImageUrl;
      if (userNameEl) userNameEl.textContent = data.userName;
      if (userEmailEl) userEmailEl.textContent = data.userEmail;
      if (userAvatarEl) userAvatarEl.src = data.userImageUrl || "../images/default-user.png";

      // [!! เพิ่ม !!] เก็บ petId ไว้สร้าง Link
      petId = data.petId; 

      // เก็บ pickupType / pickupDate จาก backend
      pickupType = data.pickupType || "SELF_PICKUP";  
      pickupDate = data.pickupDate || null;           

      // สถานะจาก backend -> render timeline + pickup box
      const key = STATUS_MAP[data.status] || "pending";
      renderStatus(key);

    } catch (err) {
      console.error("Error loading adoption", err);
      renderStatus("pending");
    }
  }


  // ----- แสดงครั้งแรก -----
  if (adoptionId) {
    // มี id จาก backend → โหลดข้อมูลจริง
    loadAdoptionFromBackend(adoptionId);
  } else {
    // ไม่มี id → ใช้ mock ค่าไว้ก่อน (สำหรับเทสหน้าเปล่าๆ)
    pickupType = "SELF_PICKUP";
    pickupDate = null;
    renderStatus(currentStatus);
  }


  // dropdown preview UI (ไว้เทสต์)
  if (statusSelect) {
    statusSelect.addEventListener("change", (e) => {
      const newStatus = e.target.value;
      renderStatus(newStatus);
    });
  }

  // [!! แก้ไข !!] (เพิ่ม Event Listener ให้การ์ด)
  // ไปหน้า petdetail
  if (petCard) {
      petCard.addEventListener("click", (e) => {
          // ป้องกันไม่ให้คลิกการ์ดตอนที่เผลอคลิกปุ่ม Edit (ถ้ามี)
          if (e.target.closest("#edit-form-btn")) return; 
          
          if (petId) {
              window.location.href = `petdetail.html?id=${petId}`;
          } else {
              console.warn("No Pet ID loaded");
          }
      });
  }

  // ไปหน้า viewform
  if (userCard) {
      userCard.addEventListener("click", (e) => {
          if (e.target.closest("#edit-form-btn")) return; // ถ้าคลิกปุ่ม Edit ไม่ต้องไป
          window.location.href = "viewform.html";
      });
  }

  // ไปหน้า userform (edit mode)
  if (editFormBtn) {
      editFormBtn.addEventListener("click", () => {
          // (JS จะซ่อนปุ่มนี้เองถ้าสถานะไม่ใช่ Pending)
          window.location.href = "userform.html?mode=edit"; 
      });
  }


  // ====== ปุ่มยกเลิก -> popup ======

  // ปุ่ม "ยกเลิกการรับเลี้ยง" -> เปิด popup
  primaryBtn.addEventListener("click", () => {
    if (!cancelModal) return;
    cancelModal.classList.add("active");
  });

  // ปิด modal เมื่อกดปุ่ม CANCEL
  if (cancelModalClose) {
    cancelModalClose.addEventListener("click", () => {
      cancelModal.classList.remove("active");
    });
  }

  // คลิก overlay ด้านนอกก็ปิดได้
  if (cancelModal) {
    cancelModal.addEventListener("click", (e) => {
      if (e.target === cancelModal) {
        cancelModal.classList.remove("active");
      }
    });
  }

  // กด YES → เรียก API แจ้ง backend ว่ายกเลิกแล้ว
  if (cancelModalConfirm) {
    cancelModalConfirm.addEventListener("click", async () => {
      if (!adoptionId) {
        alert("ไม่พบคำขอรับเลี้ยงที่ต้องการยกเลิก");
        return;
      }
      
      console.log(`Sending CANCEL request for adoptionId: ${adoptionId}`);
      alert("จำลองการยกเลิก (ดู Console log)");
      cancelModal.classList.remove("active");
      
      // (โค้ดจริงจะเรียก API)
      /*
      try {
        const res = await fetch(`/api/adoptions/${adoptionId}/cancel`, {
          method: "POST", 
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reason: "USER_CANCEL" }),
        });

        if (!res.ok) {
          alert("ยกเลิกไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
          return;
        }

        cancelModal.classList.remove("active");
        alert("ยกเลิกคำขอรับเลี้ยงเรียบร้อยแล้ว");
        
        // โหลดหน้าใหม่เพื่อดูสถานะที่อัปเดต (เช่น REJECTED)
        loadAdoptionFromBackend(adoptionId); 

      } catch (err) {
        console.error(err);
        alert("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
      }
      */
    });
  }


  // ปุ่มย้อนกลับ
  backBtn.addEventListener("click", () => {
    window.location.href = "petlisting.html";
  });
});