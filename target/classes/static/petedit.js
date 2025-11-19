const API_URL = "http://localhost:8081/api/pets";
const urlParams = new URLSearchParams(window.location.search);
const petID = urlParams.get("id");

fetch(`${API_URL}/${petID}`)
  .then(res => res.json())
  .then(pet => {
    document.getElementById("petID").value = pet.id;
    document.getElementById("petName").value = pet.name;
    document.getElementById("petType").value = pet.type;
    document.getElementById("petGender").value = pet.gender;
    document.getElementById("petBreed").value = pet.breed;
    document.getElementById("petWeight").value = pet.weight;
    document.getElementById("petImages").value = pet.image;
    document.getElementById("petSterilization").value = pet.sterilisation ? "ใช่" : "ไม่ใช่";
    document.getElementById("petVaccination").value = pet.vaccine ? "ครบแล้ว" : "ยังไม่ครบ";
    document.getElementById("petDisease").value = pet.disease;
    document.getElementById("petAllergy").value = pet.foodAllergy;
  });

async function updateAnimal() {
  const petID = document.getElementById("petID").value.trim();
  const name = document.getElementById("petName").value.trim();
  const type = document.getElementById("petType").value.trim();
  const gender = document.getElementById("petGender").value.trim();
  const breed = document.getElementById("petBreed").value.trim();
  const weight = parseFloat(document.getElementById("petWeight").value.trim());
  const image = document.getElementById("petImages").value.trim();
  const sterilisation = document.getElementById("petSterilization").value.trim() === "ใช่";
  const vaccine = document.getElementById("petVaccination").value.trim() === "ครบแล้ว";
  const disease = document.getElementById("petDisease").value.trim();
  const foodAllergy = document.getElementById("petAllergy").value.trim();

  if (!petID || !name || !type || !gender || !breed || isNaN(weight)
    || !image || !disease || !foodAllergy) {
    alert("กรุณากรอกข้อมูลให้ครบทุกช่อง");
    return;
  }

  const updatedPet = {
    id: petID, 
    name,
    type,
    gender,
    breed,
    weight,
    image,
    sterilisation,
    vaccine,
    disease,
    foodAllergy
  };

  try {
    const response = await fetch(`${API_URL}/${petID}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedPet)
    });

    if (response.ok) {
      alert("แก้ไขข้อมูลสำเร็จ");
    } else {
      const err = await response.text();
      alert("แก้ไขไม่สำเร็จ: " + err);
    }
  } catch (error) {
    console.error(error);
    alert("เกิดข้อผิดพลาด: " + error.message);
  }}




