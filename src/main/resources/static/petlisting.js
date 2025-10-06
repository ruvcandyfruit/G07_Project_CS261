const API_URL = "http://localhost:0000/pets"; //รอ url จาก be

async function loadPets() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("ดึงข้อมูลบ่ได้");

        const pets = await response.json();
        const petList = document.getElementById("pet-list");

        petList.innerHTML = "";

        pets.forEach(pet => {
            const petCard = document.createElement("div");
            petCard.classList.add("pet-card");

            petCard.innerHTML = `
            <img src="${pet.image}" alt="${pet.name}">
            <h3>${pet.name}</h3>
            `;

            petCard.addEventListener("click", () => {
                window.location.href = `pet-detail.html?id=${pet.id}`;
            });

            petList.appendChild(petCard);
        });
    } catch (error) {
        console.error("error:", error);
    }
}

loadPets();