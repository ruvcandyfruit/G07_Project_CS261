const API_URL = "/api/pets";

async function loadPets() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("ดึงข้อมูลสัตว์เลี้ยงไม่สำเร็จ");

        const pets = await response.json();
        const petList = document.getElementById("pet-list");
        petList.innerHTML = "";

        if (pets.length === 0) {
            petList.innerHTML = "<p>ไม่มีสัตว์เลี้ยงในระบบ</p>";
            return;
        }

        pets.forEach((pet) => {
            const petCard = document.createElement("div");
            petCard.classList.add("pet-card");
            petCard.innerHTML = `
            <img src="${pet.image}" alt="${pet.name}" onerror="this.src='default.jpg'">
            <h3>${pet.name}</h3>
            `;
            petCard.addEventListener("click", () => {
                window.location.href = `pet-detail.html?id=${pet.id}`;
            });
            petList.appendChild(petCard);
        });
    } catch (error) {
        console.error("error:", error);
        document.getElementById("pet-list").innerHTML = `<p style="color:red;">${error.message}</p>`;
    }
}

loadPets();