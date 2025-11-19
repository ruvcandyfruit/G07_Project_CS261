// Redirect if not admin
(function enforceAdmin() {
    try {
        const user = JSON.parse(localStorage.getItem("user") || "null");
        if (!user || user.role !== "ADMIN") {
            window.location.href = "/index.html";
        }
    } catch (_) {
        window.location.href = "/index.html";
    }
})();


document.addEventListener("DOMContentLoaded", () => {

    const API = "http://localhost:8081/api/userform";

    // ========= ELEMENTS =========
    const petCardLink = document.getElementById("pet-card-link");
    const petNameEl = document.getElementById("petName");
    const petImageEl = document.getElementById("petImage");

    const userCardLink = document.getElementById("user-card-link");
    const userNameEl = document.getElementById("userName");
    const userPhoneEl = document.getElementById("userPhone");
    const userAddressEl = document.getElementById("userAddress");

    const steps = document.querySelectorAll(".status-step");
    const pickupTitleEl = document.getElementById("pickupTitle");
    const pickupIconEl = document.getElementById("pickupIcon");
    const pickupMessageEl = document.getElementById("pickupMessage");

    const rejectBtn = document.getElementById("rejectBtn");
    const confirmBtn = document.getElementById("confirmBtn");
    const backBtn = document.getElementById("backBtn");

    const cancelModal = document.getElementById("admin-cancel-modal");
    const cancelClose = document.getElementById("admin-cancel-close");
    const cancelYes = document.getElementById("admin-cancel-yes");

    const handoverModal = document.getElementById("handover-modal");
    const handoverCancel = document.getElementById("handover-cancel");
    const handoverYes = document.getElementById("handover-yes");

    const handoverSuccessModal = document.getElementById("handover-success-modal");

    // ========= PAGE STATE =========
    let CURRENT_REQUEST_ID = null;
    let CURRENT_PET_ID = null;
    let CURRENT_USER_ID = null;
    let CURRENT_PICKUP_TYPE = "SELF_PICKUP";

    // ========= STATUS CONFIG =========
    const STATUS_CONFIG = {
        APPROVED: {
            completed: ["request", "approval"],
            showActions: true
        },
        COMPLETED: {
            completed: ["request", "approval", "handover"],
            showActions: false
        }
    };

    function formatDate(dateString) {
        if (!dateString) return "dd/mm/yyyy";
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString("th-TH", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
            });
        } catch {
            return dateString;
        }
    }

    // ========= 1. Load ALL real data (NO mock) =========
    async function loadStatusData(petId, statusFromUrl) {
        try {
            if (!petId) {
                alert("ไม่พบรหัสสัตว์เลี้ยง");
                return (window.location.href = "allpet.html");
            }

            const response = await fetch(`${API}/admin/pet/${petId}/requests`);
            const forms = await response.json();

            if (!forms || forms.length === 0) {
                alert("ยังไม่มีคำขอสำหรับสัตว์เลี้ยงนี้");
                return (window.location.href = "allpet.html");
            }

            // Find the correct form for the status
            const form =
                forms.find((f) => f.status === statusFromUrl) ||
                forms[forms.length - 1];
                console.log(form);

            CURRENT_REQUEST_ID = form.id;
            CURRENT_PET_ID = form.pet.petID;
            CURRENT_USER_ID = form.user.id;
            CURRENT_PICKUP_TYPE = form.receiveType || "SELF_PICKUP";

            // Fill pet card
            petNameEl.textContent = form.pet?.name || "-";
            petImageEl.src = form.pet?.image || "../images/sample-pet.jpg";
            petCardLink.href = form.pet ? `petdetail.html?id=${form.pet.id}` : "#";

            // Fill user card
            userNameEl.textContent = `${form.firstName} ${form.lastName}`;
            userPhoneEl.textContent = form.phone;
            userAddressEl.textContent = form.address;
            userCardLink.href = `../User/viewform.html?id=${form.id}`;

            if (form.receiveType === "DELIVERY") {
                userAddressEl.classList.add("show");
            }

            // Render UI
            renderStatus(form.status);
            updatePickup(
                form.status,
                form.receiveType,
                form.meetDate,
                form.approvedAt
            );
        } catch (err) {
            console.error("Error loading:", err);
            alert("โหลดข้อมูลล้มเหลว");
        }
    }

    // ========= 2. Render Timeline =========
    function renderStatus(statusKey) {
        const cfg = STATUS_CONFIG[statusKey];
        if (!cfg) return;

        steps.forEach((s) => s.classList.remove("completed", "rejected"));

        cfg.completed.forEach((key) => {
            const step = document.querySelector(`.status-step[data-key="${key}"]`);
            if (step) step.classList.add("completed");
        });

        // Icon updates
        steps.forEach((step) => {
            const icon = step.querySelector(".circle-icon");
            if (!icon) return;

            if (step.classList.contains("completed")) {
                icon.textContent = "✓";
            } else if (step.classList.contains("rejected")) {
                icon.textContent = "✗";
            }
        });

        // Show/hide action buttons
        if (cfg.showActions) {
            rejectBtn.style.display = "inline-flex";
            confirmBtn.style.display = "inline-flex";
            backBtn.style.display = "none";
        } else {
            rejectBtn.style.display = "none";
            confirmBtn.style.display = "none";
            backBtn.style.display = "inline-flex";
        }
    }

    // ========= 3. Pickup Instructions =========
    function updatePickup(statusKey, type, appDate, compDate) {
        const appointmentDate = formatDate(appDate);
        const completionDate = formatDate(compDate);

        if (type === "SELF_PICKUP") {
            pickupTitleEl.textContent = "Self Pickup";
            pickupIconEl.textContent = "🐾";

            pickupMessageEl.textContent =
                statusKey === "APPROVED"
                    ? `ผู้รับเลี้ยงจะมารับสัตว์เลี้ยงภายในวันที่ ${appointmentDate}`
                    : `รับเลี้ยงเสร็จสิ้นเมื่อวันที่ ${completionDate}`;
        } else {
            pickupTitleEl.textContent = "Delivery";
            pickupIconEl.textContent = "🚚";

            pickupMessageEl.textContent =
                statusKey === "APPROVED"
                    ? `ระบบได้บันทึกวันจัดส่งสัตว์เลี้ยงในวันที่ ${appointmentDate}`
                    : `ส่งมอบเสร็จสิ้นเมื่อวันที่ ${completionDate}`;
        }
    }

    // ========= 4. Modal helpers =========
    function showModal(m) {
        m.classList.add("active");
    }
    function hideModal(m) {
        m.classList.remove("active");
    }

    // ========= 5. Events =========
    rejectBtn.addEventListener("click", () => showModal(cancelModal));
    confirmBtn.addEventListener("click", () => showModal(handoverModal));
    backBtn.addEventListener("click", () => (window.location.href = "allpet.html"));

    cancelClose.addEventListener("click", () => hideModal(cancelModal));
    cancelModal.addEventListener("click", (e) => {
        if (e.target === cancelModal) hideModal(cancelModal);
    });

    // ========= 6. REAL API — Cancel Request =========
    cancelYes.addEventListener("click", async () => {
        try {
            const admin = JSON.parse(localStorage.getItem("user"));
            await fetch(`${API}/${CURRENT_REQUEST_ID}/status`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "X-USER-ID": admin.id
                },
                body: JSON.stringify({ status: "REJECTED" })
            });

            hideModal(cancelModal);
            alert("ยกเลิกคำขอเรียบร้อยแล้ว");
            window.location.href = "allpet.html";
        } catch (err) {
            console.error(err);
            alert("ยกเลิกไม่สำเร็จ");
        }
    });

    // ========= 7. REAL API — Confirm Handover =========
    handoverCancel.addEventListener("click", () => hideModal(handoverModal));
    handoverModal.addEventListener("click", (e) => {
        if (e.target === handoverModal) hideModal(handoverModal);
    });

    handoverYes.addEventListener("click", async () => {
        try {
            const admin = JSON.parse(localStorage.getItem("user"));
            await fetch(`${API}/${CURRENT_REQUEST_ID}/status`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "X-USER-ID": admin.id
                },
                body: JSON.stringify({ status: "COMPLETED" })
            });

            hideModal(handoverModal);
            showModal(handoverSuccessModal);

            renderStatus("COMPLETED");
            updatePickup("COMPLETED", CURRENT_PICKUP_TYPE, null, new Date().toISOString());
        } catch (err) {
            console.error(err);
            alert("ส่งมอบไม่สำเร็จ");
        }
    });

    handoverSuccessModal.addEventListener("click", () =>
        hideModal(handoverSuccessModal)
    );

    // ========= 8. START: Read URL & load real data =========
    const url = new URLSearchParams(window.location.search);
    const petId = url.get("pet_id") || url.get("id");
    const status = url.get("status");

    loadStatusData(petId, status);
});
