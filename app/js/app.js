const toggle = document.querySelector('.header__toggle');
// const header = document.querySelector('.header');
// 
// window.addEventListener('scroll', function() {
//   if (window.pageYOffset > 70) {
//     header.classList.add('scroll');
//   } else {
//     header.classList.remove('scroll');
//   }
// })

toggle.addEventListener('click', function() {
  toggle.classList.toggle('active');
});
