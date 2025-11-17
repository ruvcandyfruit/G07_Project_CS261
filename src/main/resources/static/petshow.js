document.addEventListener('DOMContentLoaded', async () => {
    let petData = []; 

    try {
        const response = await fetch("http://localhost:8081/api/pets");
        if (!response.ok) throw new Error("ไม่สามารถโหลดข้อมูลสัตว์เลี้ยงได้");
        petData = await response.json();
    } catch (error) {
        console.error(error);
        alert("ไม่สามารถเชื่อมต่อกับฐานข้อมูลได้");
        return;
    }

    const petListContainer = document.getElementById('pet-list');

    petData.forEach(pet => {
        const petCard = document.createElement('div');
        petCard.className = 'pet-card';
        petCard.innerHTML = `
            <img src="http://localhost:8081${pet.image || '/images/placeholder.jpg'}" alt="${pet.name}">
            <p class="name">${pet.name}</p>
            <div class="actions">
                <button class="edit" onclick="window.location.href='petedit.html?id=${pet.id}'">✏️ แก้ไข</button>
                <button class="delete" onclick="deletePet(${pet.id})">🗑️ ลบ</button>
            </div>
        `;
        petListContainer.appendChild(petCard);
    });
});

async function deletePet(id) {
    if (!confirm("ต้องการลบสัตว์ตัวนี้หรือไม่?")) return;

    try {
        const response = await fetch(`http://localhost:8081/api/pets/${id}`, {
            method: "DELETE"
        });

        if (response.ok) {
            alert("ลบข้อมูลเรียบร้อยแล้ว");
            window.location.reload();
        } else {
            alert("ลบไม่สำเร็จ");
        }
    } catch (error) {
        console.error(error);
        alert("เกิดข้อผิดพลาดในการลบข้อมูล");
    }
}
