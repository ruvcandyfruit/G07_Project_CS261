document.addEventListener('DOMContentLoaded', () => {

    // --- 1. MOCK DATA (ใช้ข้อมูลชุดเดียวกันกับ petlisting.js) ---
    const mockPetData = [
        { id: 1, name: "เมกาทรอน", image: "homepageResources/hq720.jpg" },
        { id: 2, name: "น้องส้ม", image: "https://i.pinimg.com/736x/0e/a3/6e/0ea36ee7bc893407525f1d30b72702cb.jpg" },
        { id: 3, name: "บราวนี่", image: "https://i.natgeofe.com/n/4f5aaece-3300-41a4-b2a8-ed2708a0a27c/domestic-dog_thumb_4x3.jpg" },
        { id: 4, name: "ลูน่า", image: "https://static.boredpanda.com/blog/wp-content/uploads/2016/02/big-sao-paulo-maine-coon-cat-lotus-2.jpg" },
        { id: 5, name: "ร็อคกี้", image: "https://hips.hearstapps.com/hmg-prod/images/dog-puppy-on-garden-royalty-free-image-1586966191.jpg" },
        { id: 6, name: "เจ้าสามสี", image: "https://static.onecms.io/wp-content/uploads/sites/47/2020/11/02/calico-cat-lying-on-side-1296548232-2000.jpg" }
    ];

    // --- 2. เลือก ELEMENT ที่จะแสดงผลในหน้า Homepage ---
    const petListContainer = document.getElementById('homepage-pet-list');

    // --- 3. ✨ เลือกข้อมูลมาแสดงแค่ 4 ตัวแรกเท่านั้น ✨ ---
    const petsForHomepage = mockPetData.slice(0, 4);

    // --- 4. ฟังก์ชันสำหรับสร้างและแสดงการ์ด (เหมือนใน petlisting.js) ---
    const displayHomepagePets = (pets) => {
        if (!petListContainer) return;

        pets.forEach(pet => {
            const petCardLink = document.createElement('a');
            petCardLink.href = `petdetail.html?id=${pet.id}`;
            petCardLink.className = 'pet-card';
            petCardLink.innerHTML = `
                <img src="${pet.image}" alt="${pet.name}" onerror="this.src='homepageResources/default-pet.png'">
                <p class="name">${pet.name}</p>
            `;
            petListContainer.appendChild(petCardLink);
        });
    };

    // --- 5. เรียกใช้ฟังก์ชันเพื่อแสดงผล ---
    displayHomepagePets(petsForHomepage);

});