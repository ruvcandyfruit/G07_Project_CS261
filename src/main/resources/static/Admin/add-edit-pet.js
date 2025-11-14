
const select = document.getElementById('breedSelect');
const upDown = document.querySelector('.mdi--chevron-up-down');
const downUp = document.querySelector('.mdi--chevron-down-up');

select.addEventListener('click', () => {
  // สลับ class active
  upDown.classList.toggle('active');
  downUp.classList.toggle('active');
});
