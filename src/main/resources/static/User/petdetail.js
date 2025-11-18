document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const petId = params.get("id");

  if (!petId) {
    alert("ไม่พบรหัสสัตว์เลี้ยง");
    return;
  }

  const petIdInput = document.getElementById("petId");
  if (petIdInput) petIdInput.value = petId;

  const adoptBtn = document.getElementById("adoptBtn");
  if (adoptBtn) {
    adoptBtn.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = `userform.html?petId=${petId}`;
    });
  }
  function calculatePetAge(birthDateStr) {
    if (!birthDateStr) return "-"; // in case birthDate is missing

    const birthDate = new Date(birthDateStr);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();

    // if the birthday hasn’t occurred yet this year, subtract 1
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    return age >= 0 ? age : "-";
}
  async function loadPetData() {
    try {
      const response = await fetch(`http://localhost:8081/api/pets/${petId}`);
      
      if (!response.ok) {
        console.error("Fetch failed with status:", response.status);
        return; // silently fail without alert
      }

      const pet = await response.json();

      // Populate page
      console.log("Pet object:", pet);
      document.getElementById("petNames").textContent = pet.name || "-";
      document.getElementById("petImages").src = pet.image ? `http://localhost:8081${pet.image}` : "images/placeholder.jpg";
      document.getElementById("petIds").textContent = pet.petID || "-";
      document.getElementById("petType").textContent = pet.type || "-";
      document.getElementById("petGender").textContent = pet.gender || "-";
      document.getElementById("petAge").textContent = calculatePetAge(pet.birthDate) || "-";
      document.getElementById("petBreed").textContent = pet.breed || "-";
      document.getElementById("petWeight").textContent = pet.weight || "-";
      document.getElementById("petSterilisation").textContent = pet.sterilisation ? "ทำแล้ว" : "ยังไม่ทำ";
      document.getElementById("petVaccine").textContent = pet.vaccine ? "ครบ" : "ยังไม่ครบ";
      document.getElementById("petDisease").textContent = pet.disease || "ไม่มี";
      document.getElementById("petFoodAllergy").textContent = pet.foodAllergy || "ไม่มี";

    } catch (error) {
      console.error("Error fetching pet:", error);
      // optional: show alert only if you want
      // alert("เกิดข้อผิดพลาดในการโหลดข้อมูลสัตว์เลี้ยง กรุณาลองใหม่");
    }
  }

  loadPetData();
});
