document.addEventListener("DOMContentLoaded", () => {
  // ========= ELEMENT พื้นฐาน =========
  const steps = document.querySelectorAll(".status-step");

  const pickupTitleEl = document.getElementById("pickupTitle");
  const pickupIconEl = document.getElementById("pickupIcon");
  const pickupMessageEl = document.getElementById("pickupMessage");

  // ปุ่มหลักในหน้า
  const rejectBtn =
    document.getElementById("rejectBtn") ||
    document.getElementById("btn-cancel");  // เผื่อใช้ชื่อเก่า
  const confirmBtn =
    document.getElementById("confirmBtn") ||
    document.getElementById("btn-confirm");
  const backBtn = document.getElementById("backBtn");
    // modal ยืนยันส่งมอบ
    const handoverModal = document.getElementById("handover-modal");
    const handoverCancel = document.getElementById("handover-cancel");
    const handoverYes = document.getElementById("handover-yes");

    // modal Successful
    const handoverSuccessModal = document.getElementById("handover-success-modal");



  // element popup
  const cancelModal = document.getElementById("admin-cancel-modal");
  const cancelClose = document.getElementById("admin-cancel-close");
  const cancelYes = document.getElementById("admin-cancel-yes");

  // ดึง query string จาก URL
  const params = new URLSearchParams(window.location.search);
  const adoptionId = params.get("adoptionId") || params.get("id"); // เผื่อใช้ชื่อคนละแบบ
  const statusFromQuery = params.get("status") || "PENDING";
  const pickupType = params.get("pickupType") || "DELIVERY"; // DELIVERY / SELF_PICKUP
  const pickupDate = params.get("date") || null;

  // ========= CONFIG สถานะ =========
  const STATUS_CONFIG = {
    // แค่ส่งคำขอ รออนุมัติ
    pending: {
      completed: ["request"],
      rejected: null,
    },
    // อนุมัติคำขอแล้ว (รอส่งมอบ)
    approved: {
      completed: ["request", "approval"],
      rejected: null,
    },
    // ไม่อนุมัติ
    approvalRejected: {
      completed: ["request"],
      rejected: "approval",
    },
    // ส่งมอบสำเร็จ
    completed: {
      completed: ["request", "approval", "handover"],
      rejected: null,
    },
    // ส่งมอบไม่สำเร็จ
    handoverFailed: {
      completed: ["request", "approval"],
      rejected: "handover",
    },
  };

  const STATUS_MAP = {
    PENDING: "pending",
    APPROVED: "approved",
    REJECTED: "approvalRejected",
    COMPLETED: "completed",
    HANDOVER_FAILED: "handoverFailed",
  };

  // ========= วาด timeline =========
  function renderStatus(statusKey) {
    const cfg = STATUS_CONFIG[statusKey];
    if (!cfg) return;

    // ล้างคลาสเดิม
    steps.forEach((step) =>
      step.classList.remove("completed", "rejected")
    );

    // เติม completed
    cfg.completed.forEach((key) => {
      const step = document.querySelector(
        `.status-step[data-key="${key}"]`
      );
      if (step) step.classList.add("completed");
    });

    // เติม rejected ถ้ามี
    if (cfg.rejected) {
      const step = document.querySelector(
        `.status-step[data-key="${cfg.rejected}"]`
      );
      if (step) step.classList.add("rejected");
    }

    // ใส่ไอคอน ✓ / ✗ ให้ตรงกับสถานะ
    steps.forEach((step) => {
      const icon = step.querySelector(".circle-icon");
      if (!icon) return;

      if (step.classList.contains("rejected")) {
        icon.textContent = "✗";
        icon.style.opacity = 1;
      } else if (step.classList.contains("completed")) {
        icon.textContent = "✓";
        icon.style.opacity = 1;
      } else {
        icon.textContent = "";
        icon.style.opacity = 0;
      }
    });

    // ปุ่มด้านล่าง (สถานะสุดท้ายให้เหลือแค่ "ย้อนกลับ")
    const isFinalStatus =
    statusKey === "completed" ||       // ส่งมอบสำเร็จ
    statusKey === "handoverFailed" ||  // ส่งมอบไม่สำเร็จ
    statusKey === "approvalRejected";  // ไม่อนุมัติคำขอ

    if (isFinalStatus) {
    if (rejectBtn) rejectBtn.style.display = "none";
    if (confirmBtn) confirmBtn.style.display = "none";
    if (backBtn) backBtn.style.display = "inline-block";
    } else {
    if (rejectBtn) rejectBtn.style.display = "inline-block";
    if (confirmBtn) confirmBtn.style.display = "inline-block";
    if (backBtn) backBtn.style.display = "none";
    }

    // อัปเดตกล่อง Delivery / Self Pickup
    updatePickup(statusKey, pickupType, pickupDate);
  }

  // ========= update ข้อความ Delivery / Self Pickup =========
  function updatePickup(statusKey, type, dateStr) {
    const dateText = dateStr || "[DATE]";

    if (type === "SELF_PICKUP") {
      if (pickupTitleEl) pickupTitleEl.textContent = "Self Pickup";
      if (pickupIconEl) pickupIconEl.textContent = "🐾";

      let msg = "";
      if (statusKey === "pending") {
        msg = "คำขอถูกส่งแล้ว รอการอนุมัติจากเจ้าหน้าที่";
      } else if (statusKey === "approved") {
        msg = `ผู้รับเลี้ยงจะมารับสัตว์เลี้ยงภายในวันที่ ${dateText}`;
      } else if (statusKey === "completed") {
        msg = "ดำเนินการรับเลี้ยงสัตว์สำเร็จเรียบร้อยแล้ว";
      } else if (statusKey === "approvalRejected") {
        msg = "คำขอรับเลี้ยงไม่ได้รับการอนุมัติ";
      } else if (statusKey === "handoverFailed") {
        msg = "การรับสัตว์เลี้ยงไม่สำเร็จ กรุณาติดต่อผู้รับเลี้ยงอีกครั้ง";
      }
      if (pickupMessageEl) pickupMessageEl.textContent = msg;
    } else {
      // DELIVERY
      if (pickupTitleEl) pickupTitleEl.textContent = "Delivery";
      if (pickupIconEl) pickupIconEl.textContent = "🚚";

      let msg = "";
      if (statusKey === "pending") {
        msg = "คำขอถูกส่งแล้ว รอการอนุมัติจากเจ้าหน้าที่";
      } else if (statusKey === "approved") {
        msg = `ระบบได้นัดจัดส่งสัตว์เลี้ยงให้ผู้รับเลี้ยงในวันที่ ${dateText}`;
      } else if (statusKey === "completed") {
        msg = "ดำเนินการจัดส่งและรับเลี้ยงสำเร็จเรียบร้อยแล้ว";
      } else if (statusKey === "approvalRejected") {
        msg = "คำขอรับเลี้ยงไม่ได้รับการอนุมัติ";
      } else if (statusKey === "handoverFailed") {
        msg = "การจัดส่งไม่สำเร็จ กรุณาติดต่อผู้รับเลี้ยงอีกครั้ง";
      }
      if (pickupMessageEl) pickupMessageEl.textContent = msg;
    }
  }

  // ========= เริ่มต้น: ใช้ค่าจาก query ชั่วคราว (ถ้ายังไม่ต่อ backend) =========
  const statusKey = STATUS_MAP[statusFromQuery] || "pending";
  renderStatus(statusKey);

  // ========= ปุ่ม popup ยกเลิก =========
  if (rejectBtn && cancelModal) {
    // กดปุ่มแดง -> เปิด modal
    rejectBtn.addEventListener("click", () => {
      cancelModal.classList.add("active");
    });

    // ปิด modal ด้วย CANCEL
    if (cancelClose) {
      cancelClose.addEventListener("click", () => {
        cancelModal.classList.remove("active");
      });
    }

    // คลิกพื้นหลังดำ -> ปิด
    cancelModal.addEventListener("click", (e) => {
      if (e.target === cancelModal) {
        cancelModal.classList.remove("active");
      }
    });

    // YES -> ตรงนี้ค่อยยิง API ไปยกเลิกจริง ๆ
    if (cancelYes) {
      cancelYes.addEventListener("click", async () => {
        cancelModal.classList.remove("active");

        // ตัวอย่าง ถ้าต่อ backend แล้วค่อยแก้ endpoint
        /*
        if (adoptionId) {
          await fetch(`/api/adoptions/${adoptionId}/cancel`, {
            method: "POST",
          });
        }
        */

        // ตอนนี้ให้ลองเปลี่ยนสถานะในหน้าให้เห็นผลเลย
        renderStatus("handoverFailed");
        alert("ยกเลิกคำขอรับเลี้ยงเรียบร้อยแล้ว (ตัวอย่างฝั่ง admin)");
      });
    }
  }
  // ========= ปุ่มยืนยันการรับเลี้ยง (เปิด popup ยืนยันส่งมอบ) =========
  if (confirmBtn && handoverModal) {
    // กดปุ่มเขียว -> เปิด popup "ยืนยันการส่งมอบสัตว์เลี้ยง"
    confirmBtn.addEventListener("click", () => {
      handoverModal.classList.add("active");
    });

    // ปิด popup ด้วยปุ่ม CANCEL
    if (handoverCancel) {
      handoverCancel.addEventListener("click", () => {
        handoverModal.classList.remove("active");
      });
    }

    // คลิกพื้นหลังดำของ popup แรก -> ปิด
    handoverModal.addEventListener("click", (e) => {
      if (e.target === handoverModal) {
        handoverModal.classList.remove("active");
      }
    });

    // ปุ่ม YES ใน popup แรก -> ถือว่าส่งมอบสำเร็จ
    if (handoverYes) {
      handoverYes.addEventListener("click", () => {
        // ปิด popup แรก
        handoverModal.classList.remove("active");

        // เปลี่ยนสถานะหน้าเป็น completed (3 วงเขียว + เหลือปุ่มย้อนกลับ)
        renderStatus("completed");

        // แสดงการ์ด Successful
        if (handoverSuccessModal) {
          handoverSuccessModal.classList.add("active");
        }
      });
    }
  }

  // ========= ปิดการ์ด Successful =========
  if (handoverSuccessModal) {
    handoverSuccessModal.addEventListener("click", (e) => {
      // คลิกพื้นหลังดำ -> ปิดการ์ด
      if (e.target === handoverSuccessModal) {
        handoverSuccessModal.classList.remove("active");
      }
    });
  }

  // ========= ปุ่มย้อนกลับ (ถ้ามี) =========
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      // กลับไปหน้า list
      window.location.href = "all-pet.html";
    });
  }
});

