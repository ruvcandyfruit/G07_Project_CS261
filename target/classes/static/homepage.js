document.addEventListener('DOMContentLoaded', async () => {

    // --- 1. ดึงข้อมูลจาก backend ---
    let petData = [];

    try {
        const response = await fetch("http://localhost:8081/api/pets"); 
        if (!response.ok) {
            throw new Error("ไม่สามารถโหลดข้อมูลสัตว์เลี้ยงได้");
        }
        petData = await response.json();
    } catch (error) {
        console.error("เกิดข้อผิดพลาดในการโหลดข้อมูลสัตว์เลี้ยง:", error);
        alert("ไม่สามารถเชื่อมต่อกับฐานข้อมูลได้");
        return; 
    }

    // --- 2. เลือก ELEMENT ที่จะแสดงผลในหน้า Homepage ---
    const petListContainer = document.getElementById('homepage-pet-list');

    // --- 3. ✨ เลือกข้อมูลมาแสดงแค่ 4 ตัวแรกเท่านั้น ✨ ---
    const petsForHomepage = petData.slice(0, 4);

    // --- 4. ฟังก์ชันสำหรับสร้างและแสดงการ์ด ---
    const displayHomepagePets = (pets) => {
        if (!petListContainer) return;

        petListContainer.innerHTML = ""; 

        pets.forEach(pet => {
            const petCardLink = document.createElement('a');
            petCardLink.href = `/User/petdetail.html?id=${pet.id}`;
            petCardLink.className = 'pet-card';
            petCardLink.innerHTML = `
                <img src="http://localhost:8081${pet.image || '/images/placeholder.jpg'}" 
                     alt="${pet.name}" 
                     onerror="this.src='homepageResources/default-pet.png'">
                <p class="name">${pet.name}</p>
            `;
            petListContainer.appendChild(petCardLink);
        });
    };

    // --- 5. เรียกใช้ฟังก์ชันเพื่อแสดงผล ---
    displayHomepagePets(petsForHomepage);

});
