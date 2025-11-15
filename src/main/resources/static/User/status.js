// =======================
//  CONFIG สถานะ – ใช้คุม step + ปุ่ม
// =======================
const STATUS_CONFIG = {
  // 1. ส่งคำขอ (pending)
  pending: {
    completedSteps: ["request"],
    rejectedStep: null,
    showCancel: true,
    cancelText: "ยกเลิกการรับเลี้ยง",
    showBack: false,
  },

  // 2. อนุมัติคำขอ (รอรับ)
  approved: {
    completedSteps: ["request", "approval"],
    rejectedStep: null,
    showCancel: true,
    cancelText: "ยกเลิกการรับเลี้ยง",
    showBack: false,
  },

  // 2. ปฏิเสธคำขอ
  approvalRejected: {
    completedSteps: ["request"],
    rejectedStep: "approval",
    showCancel: false,
    showBack: true,
  },

  // 3. ส่งมอบสำเร็จ
  completed: {
    completedSteps: ["request", "approval", "handover"],
    rejectedStep: null,
    showCancel: false,
    showBack: true,
  },

  // 3. ส่งมอบไม่สำเร็จ
  handoverFailed: {
    completedSteps: ["request", "approval"],
    rejectedStep: "handover",
    showCancel: false,
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


  // -------- ฟังก์ชัน update pickup box ตาม status + pickupType --------
  function updatePickupView(statusKey) {
    let title = "Pickup";
    let icon = "🐾";
    let message = "";

    if (pickupType === "DELIVERY") {
      // ------- กรณีเลือก Delivery -------
      title = "Delivery";
      icon = "🚚";

      if (statusKey === "pending") {
        message =
          "คำขอของคุณถูกส่งแล้ว หลังจากได้รับการอนุมัติ มูลนิธิจะดำเนินการจัดส่งสัตว์เลี้ยงให้คุณ";
      } else if (statusKey === "approved") {
        message =
          "มูลนิธิจะจัดส่งสัตว์เลี้ยงให้คุณในวันที่ " +
          (pickupDate || "[DATE]") +
          " ตามที่อยู่นัดหมาย";
      } else if (statusKey === "completed") {
        message =
          "ดำเนินการจัดส่งสัตว์เลี้ยงเรียบร้อยแล้ว ขอให้มีความสุขกับเพื่อนใหม่ของคุณ";
      } else if (statusKey === "handoverFailed") {
        message =
          "การจัดส่งสัตว์เลี้ยงไม่สำเร็จ กรุณาติดต่อเจ้าหน้าที่เพื่อสอบถามรายละเอียดเพิ่มเติม";
      } else if (statusKey === "approvalRejected") {
        message =
          "คำขอรับเลี้ยงของคุณไม่ได้รับการอนุมัติ กรุณาติดต่อเจ้าหน้าที่เพื่อสอบถามรายละเอียดเพิ่มเติม";
      }

    } else {
      // ------- กรณี Self Pickup -------
      title = "Self Pickup";
      icon = "🐾";

      if (statusKey === "pending") {
        message =
          "คำขอของคุณถูกส่งแล้ว กำลังรอการอนุมัติจากเจ้าหน้าที่";
      } else if (statusKey === "approved") {
        message =
          "กรุณามารับสัตว์เลี้ยงของคุณภายในวันที่ " +
          (pickupDate || "[DATE]") +
          " ที่ศูนย์อุปการะสัตว์";
      } else if (statusKey === "completed") {
        message =
          "ดำเนินการรับสัตว์เลี้ยงเรียบร้อยแล้ว ขอบคุณที่รับเลี้ยงจากเรา";
      } else if (statusKey === "handoverFailed") {
        message =
          "คำขอรับเลี้ยงของคุณถูกยกเลิก เนื่องจากไม่มารับสัตว์เลี้ยงตามเวลาที่กำหนด";
      } else if (statusKey === "approvalRejected") {
        message =
          "คำขอรับเลี้ยงของคุณไม่ได้รับการอนุมัติ กรุณาติดต่อเจ้าหน้าที่เพื่อสอบถามรายละเอียดเพิ่มเติม";
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
        icon.textContent = "✗"; // fail
      } else if (step.classList.contains("completed")) {
        icon.textContent = "✓"; // success
      } else {
        icon.textContent = ""; // ยังไม่ถึง step นี้
      }
    });

    // ปุ่มยกเลี้ยง / ย้อนกลับ
    if (config.showCancel) {
      primaryBtn.style.display = "inline-block";
      primaryBtn.textContent = config.cancelText || "ยกเลิก";
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
  }


  // ----- โหลดข้อมูลจาก backend -----
  async function loadAdoptionFromBackend(id) {
    try {
      const res = await fetch(`/api/adoptions/${id}`);
      if (!res.ok) {
        console.error("โหลด adoption ไม่ได้", res.status);
        renderStatus("pending");
        return;
      }

      const data = await res.json();

      // เติมข้อมูลใน card ด้านบน
      if (petNameEl && data.petName) {
        petNameEl.textContent = data.petName;
      }
      if (petImageEl && data.petImageUrl) {
        petImageEl.src = data.petImageUrl;
      }
      if (userNameEl && data.userName) {
        userNameEl.textContent = data.userName;
      }
      if (userEmailEl && data.userEmail) {
        userEmailEl.textContent = data.userEmail;
      }
      if (userAvatarEl) {
        userAvatarEl.src = data.userImageUrl || "../images/default-user.png";
      }

      // เก็บ pickupType / pickupDate จาก backend
      pickupType = data.pickupType || "SELF_PICKUP";  // เช่น "SELF_PICKUP" หรือ "DELIVERY"
      pickupDate = data.pickupDate || null;           // เช่น "2025-12-01"

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
    // ไม่มี id → ใช้ mock ค่าไว้ก่อน
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

  // ไปหน้า viewform
  editFormBtn.addEventListener("click", () => {
    window.location.href = "viewform.html";
  });


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

      try {
        const res = await fetch(`/api/adoptions/${adoptionId}/cancel`, {
          method: "POST",               // หรือ PUT แล้วแต่ backend
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            reason: "USER_CANCEL",      // ส่งเหตุผลให้ admin ถ้าต้องการ
          }),
        });

        if (!res.ok) {
          alert("ยกเลิกไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
          return;
        }

        cancelModal.classList.remove("active");
        alert("ยกเลิกคำขอรับเลี้ยงเรียบร้อยแล้ว");

        // แล้วแต่ออกแบบว่าจะให้ redirect ไปไหน
        // ตัวอย่าง: กลับไปหน้า Adoption Status รวม
        // window.location.href = "status.html";

      } catch (err) {
        console.error(err);
        alert("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
      }
    });
  }


  // ปุ่มย้อนกลับ
  backBtn.addEventListener("click", () => {
    window.location.href = "petlisting.html";
  });
});

