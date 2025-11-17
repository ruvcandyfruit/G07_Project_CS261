document.addEventListener("DOMContentLoaded", async () => {
  // อ่าน id จาก URL 
  const params = new URLSearchParams(window.location.search);
  const petId = params.get("id");

  if (!petId) {
    alert("ไม่พบรหัสสัตว์เลี้ยง");
    return;
  }

  try {
    // เรียก API จาก backend 
    const response = await fetch(`http://localhost:8081/api/pets/${petId}`);

    if (!response.ok) {
      throw new Error("ไม่สามารถดึงข้อมูลสัตว์เลี้ยงได้");
    }

    const pet = await response.json();

    // แสดงข้อมูลในหน้า HTML
     document.getElementById("petNames").textContent = pet.name || "-";
    document.getElementById("petImages").src = pet.image ? `http://localhost:8081${pet.image}` : "images/placeholder.jpg";
    document.getElementById("petIds").textContent = pet.petID || "-";
    document.getElementById("petType").textContent = pet.type || "-";
    document.getElementById("petGender").textContent = pet.gender || "-";
    document.getElementById("petDateBirth").textContent = pet. birthDate|| "-";
    document.getElementById("petBreed").textContent = pet.breed || "-";
    document.getElementById("petWeight").textContent = pet.weight || "-";
    document.getElementById("petSterilisation").textContent = pet.sterilisation ? "ทำแล้ว" : "ยังไม่ทำ";
    document.getElementById("petVaccine").textContent = pet.vaccine ? "ครบ" : "ยังไม่ครบ";
    document.getElementById("petDisease").textContent = pet.disease || "ไม่มี";
    document.getElementById("petFoodAllergy").textContent = pet.foodAllergy || "ไม่มี";
  } catch (error) {
    console.error("Error:", error);
    alert("เกิดข้อผิดพลาดในการโหลดข้อมูล");
  }
});