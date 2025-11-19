// =======================
//  CONFIG สถานะ – ใช้คุม step + ปุ่ม
// =======================
const STATUS_CONFIG = {
  pending: { completedSteps: ["request"], rejectedStep: null, showCancel: true, showEdit: true, cancelText: "ยกเลิกการรับเลี้ยง", showBack: false },
  approved: { completedSteps: ["request", "approval"], rejectedStep: null, showCancel: true, showEdit: false, cancelText: "ยกเลิกการรับเลี้ยง", showBack: false },
  approvalRejected: { completedSteps: ["request"], rejectedStep: "approval", showCancel: false, showEdit: false, showBack: true },
  completed: { completedSteps: ["request", "approval", "handover"], rejectedStep: null, showCancel: false, showEdit: false, showBack: true },
  handoverFailed: { completedSteps: ["request", "approval"], rejectedStep: "handover", showCancel: false, showEdit: false, showBack: true },
};

const STATUS_MAP = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "approvalRejected",
  COMPLETED: "completed",
  HANDOVER_FAILED: "handoverFailed",
  CANCELED: "handoverFailed",
  CANCELED_PENDING: "approvalRejected", 
  CANCELED_APPROVED: "handoverFailed",
};

const API_BASE_URL = 'http://localhost:8081/api/userform';

// =======================
//  HELPERS
// =======================
function formatDateThai(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
        const parts = dateString.split('-');
        if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
        return dateString;
    }
    return `${String(date.getDate()).padStart(2,'0')}/${String(date.getMonth()+1).padStart(2,'0')}/${date.getFullYear()}`;
}

async function fetchUserForms() {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user.id) return [];
    const res = await fetch(`${API_BASE_URL}/submit`);
    if (!res.ok) throw new Error("Failed to fetch forms");
    const allForms = await res.json();
    return allForms.filter(f => f.userId === user.id);
}

// =======================
//  MAIN
// =======================
document.addEventListener("DOMContentLoaded", async () => {
    // Elements
    const steps = document.querySelectorAll(".status-step");
    const pickupTitleEl = document.getElementById("pickup-title-text");
    const pickupMessageEl = document.getElementById("pickup-message");
    const pickupIconEl = document.querySelector(".pickup-icon");
    const primaryBtn = document.getElementById("primary-action-btn");
    const backBtn = document.getElementById("back-btn");
    const statusSelect = document.getElementById("status-select");
    const cancelModal = document.getElementById("cancel-modal");
    const cancelModalClose = document.getElementById("cancel-modal-close");
    const cancelModalConfirm = document.getElementById("cancel-modal-confirm");
    const petCard = document.querySelector(".card-pet");
    const petNameEl = document.getElementById("pet-name");
    const petImageEl = document.getElementById("petImage");
    const userCard = document.getElementById("view-form-card");
    const userNameEl = document.getElementById("user-username");
    const userEmailEl = document.getElementById("user-email");
    const overlayEl = document.querySelector('.overlay');
    const formBackBtn = document.getElementById('backBtn');
    const formModalCloseBtn = document.getElementById('formModalCloseBtn');
    const editFormBtn = document.getElementById('editFormBtn');

    let currentStatus = "pending";
    let currentShowEdit = false;
    let pickupType = "SELF_PICKUP";
    let pickupDate = null;
    let petId = null;
    let currentFormId = null;

    // -------- RENDER STATUS & TIMELINE --------
    function updatePickupView(statusKey) {
        let title = pickupType === "DELIVERY" ? "Delivery" : "Self Pickup";
        let icon = pickupType === "DELIVERY" ? "🚚" : "🐾";
        let message = "";
        const dateStr = pickupDate ? formatDateThai(pickupDate) : "[DATE]";
        const addressStr = "[ที่อยู่มูลนิธิ]";

        switch (statusKey) {
            case "pending": message = "คำขออยู่ระหว่างรอพิจารณาโดยเจ้าหน้าที่"; break;
            case "approved": message = pickupType === "DELIVERY" ? `มูลนิธิจะจัดส่งสัตว์เลี้ยงให้คุณในวันที่ ${dateStr}` : `กรุณามารับสัตว์เลี้ยงของคุณภายในวันที่ ${dateStr}\n${addressStr}`; break;
            case "approvalRejected": message = "คำขอรับเลี้ยงได้ถูกปฎิเสธโดยเจ้าหน้าที่"; break;
            case "completed": message = "ดำเนินการรับเลี้ยงสำเร็จเรียบร้อยแล้ว"; break;
            case "handoverFailed": message = "คำขอรับเลี้ยงถูกยกเลิกเนื่องจากเลยเวลานัดหมาย/เจ้าหน้าที่ยกเลิกการส่งมอบครั้งนี้/คุณได้ยกเลิกการรับเลี้ยงแล้ว"; break;
            default: message = "กำลังโหลดข้อมูล...";
        }

        if (pickupTitleEl) pickupTitleEl.textContent = title;
        if (pickupMessageEl) {
            pickupMessageEl.textContent = message;
            pickupMessageEl.style.whiteSpace = (pickupType === "SELF_PICKUP" && statusKey === "approved") ? "pre-line" : "normal";
        }
        if (pickupIconEl) pickupIconEl.textContent = icon;
    }

    function renderStatus(statusKey) {
        const config = STATUS_CONFIG[statusKey];
        if (!config) return;
        currentStatus = statusKey;
        currentShowEdit = config.showEdit;

        steps.forEach(s => s.classList.remove("completed", "rejected"));
        config.completedSteps.forEach(key => {
            const step = document.querySelector(`.status-step[data-key="${key}"]`);
            if (step) step.classList.add("completed");
        });
        if (config.rejectedStep) {
            const failedStep = document.querySelector(`.status-step[data-key="${config.rejectedStep}"]`);
            if (failedStep) failedStep.classList.add("rejected");
        }

        steps.forEach(step => {
            const icon = step.querySelector(".circle-icon");
            if (!icon) return;
            if (step.classList.contains("rejected")) icon.textContent = "✗";
            else if (step.classList.contains("completed")) icon.textContent = "✓";
            else icon.textContent = "";
        });

        primaryBtn.style.display = config.showCancel ? "inline-block" : "none";
        primaryBtn.textContent = config.cancelText || "ยกเลิกการรับเลี้ยง";
        backBtn.style.display = config.showBack ? "inline-block" : "none";
        updatePickupView(statusKey);

        if (editFormBtn) editFormBtn.style.display = currentShowEdit ? "inline-block" : "none";
    }

    // -------- LOAD FORM & AUTO-SELECT LATEST --------
    async function loadLatestUserForm() {
        try {
            const forms = await fetchUserForms();
            if (!forms || forms.length === 0) {
                console.warn("No forms found for this user");
                renderStatus("pending");
                return;
            }
            const latestForm = forms.reduce((prev, curr) => (curr.id > prev.id ? curr : prev));
            currentFormId = latestForm.id;
            petId = latestForm.petId;
            pickupType = latestForm.receiveType === "Delivery" ? "DELIVERY" : "SELF_PICKUP";
            pickupDate = latestForm.meetDate || null;
            const key = STATUS_MAP[latestForm.status] || "pending";
            renderStatus(key);

            // Update top card info
            
            if (petNameEl) petNameEl.textContent = latestForm.petId;
            if (petImageEl) petImageEl.src = "../images/sample-pet.jpg";
            const user = JSON.parse(localStorage.getItem("user") || "{}");
            if (userNameEl) userNameEl.textContent = user.username || "-";
            if (userEmailEl) userEmailEl.textContent = user.email || "-";
        } catch (err) {
            console.error("Failed to load user forms", err);
            renderStatus("pending");
        }
    }

    // -------- FORM MODAL --------
    function openFormOverlay() {
        if (!currentFormId || !overlayEl) return;
        overlayEl.classList.add('active');
        loadUserFormById(currentFormId);
    }
    function closeFormOverlay() {
        if (overlayEl) overlayEl.classList.remove('active');
    }
    if (userCard) userCard.addEventListener("click", openFormOverlay);
    if (overlayEl) overlayEl.addEventListener('click', (e) => { if (e.target === overlayEl) closeFormOverlay(); });
    if (formModalCloseBtn) formModalCloseBtn.addEventListener('click', closeFormOverlay);
    if (formBackBtn) formBackBtn.addEventListener('click', e => { e.preventDefault(); closeFormOverlay(); });
    if (editFormBtn) editFormBtn.addEventListener('click', () => {
        if (currentFormId) window.location.href = `userform.html?mode=edit&formId=${currentFormId}`;
    });

    // -------- CANCEL BUTTON --------
    primaryBtn.addEventListener("click", () => { if (cancelModal) cancelModal.classList.add("active"); });
    if (cancelModalClose) cancelModalClose.addEventListener("click", () => cancelModal.classList.remove("active"));
    if (cancelModal) cancelModal.addEventListener("click", e => { if (e.target === cancelModal) cancelModal.classList.remove("active"); });
    if (cancelModalConfirm) cancelModalConfirm.addEventListener("click", async () => {
        if (!currentFormId) return alert("ไม่พบคำขอรับเลี้ยง");
        console.log(`Cancel formId: ${currentFormId}`);
        alert("จำลองการยกเลิก (ดู Console log)");
        cancelModal.classList.remove("active");
    });

    if (backBtn) backBtn.addEventListener("click", () => window.location.href = "petlisting.html");

    // -------- INITIAL LOAD --------
    await loadLatestUserForm();
});
