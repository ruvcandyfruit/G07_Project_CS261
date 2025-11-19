const API_URL = "http://localhost:8081/api/pets";
let petId = null; 

async function addAnimal() {
  const petID = document.getElementById("petID").value.trim();
  const name = document.getElementById("petName").value.trim();
  const type = document.getElementById("petType").value.trim();
  const gender = document.getElementById("petGender").value.trim();
  const breed = document.getElementById("petBreed").value.trim();
  const birthDate = document.getElementById("petDateBirth").value.trim();
  const weight = parseFloat(document.getElementById("petWeight").value.trim());
  const image = document.getElementById("petImages").value.trim();
  const sterilisation = document.getElementById("petSterilization").value.trim() === "ใช่";
  const vaccine = document.getElementById("petVaccination").value.trim() === "ครบแล้ว";
  const disease = document.getElementById("petDisease").value.trim();
  const foodAllergy = document.getElementById("petAllergy").value.trim();


  if (!petID || !name || !type || !gender || !birthDate || !breed || isNaN(weight)
      || !image || !disease || !foodAllergy) {
    alert("กรุณากรอกข้อมูลให้ครบทุกช่อง");
    return;
  }

 const newPet = {
  petID,
  type,
  image,
  name,
  birthDate, 
  gender,
  breed,
  weight,
  sterilisation,
  vaccine,
  disease,
  foodAllergy
};

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPet)
    });

    if (response.ok) {
      alert("เพิ่มข้อมูลสำเร็จ");
      // เคลียร์ฟอร์ม
      document.getElementById("petID").value = "";
      document.getElementById("petName").value = "";
      document.getElementById("petType").value = "";
      document.getElementById("petGender").value = "";
      document.getElementById("petDateBirth").value = "";
      document.getElementById("petBreed").value = "";
      document.getElementById("petWeight").value = "";
      document.getElementById("petImages").value = "";
      document.getElementById("petSterilization").value = "";
      document.getElementById("petVaccination").value = "";
      document.getElementById("petDisease").value = "";
      document.getElementById("petAllergy").value = "";
    } else {
      const err = await response.text();
      alert("เพิ่มไม่สำเร็จ: " + err);
    }
  } catch (error) {
    console.error(error);
    alert("เกิดข้อผิดพลาด: " + error.message);
  }
}

