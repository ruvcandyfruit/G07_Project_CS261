const API_URL = "/api/pets";

async function loadPets() {
    try {
        //ตรวจสอบ response
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("ดึงข้อมูลสัตว์เลี้ยงไม่สำเร็จ");

        //เชื่อม div ใน html
        const pets = await response.json();
        const petList = document.getElementById("pet-list");
        petList.innerHTML = "";

        //เช็คจำนวนสัตว์
        if (pets.length === 0) {
            petList.innerHTML = "<p>ไม่มีสัตว์เลี้ยงในระบบ</p>";
            return;
        }

        //loop สัตว์แต่ละตัว
        pets.forEach((pet) => {
            const petCard = document.createElement("div");
            petCard.classList.add("pet-card");

            //เช็คว่ารูป null มั้ย ถ้า null ขึ้นไอคอน default แทน, ให้แสดงค่า ไม่ทราบชื่อ แทน onerror
            const imageSrc = pet.image ? pet.image : 'default.jpg';
            petCard.innerHTML = `
            <img src="${imageSrc}" alt="${pet.name || 'ไม่ทราบชื่อ'}">
            <h3>${pet.name || 'ไม่ทราบชื่อ'}</h3>
            `;

            //ถ้าคลิกที่สัตว์ เด้งไปหน้า pet detail พร้อม id ของสัตว์
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