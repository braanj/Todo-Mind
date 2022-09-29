let showMenu = () => {
  dropdown.classList.toggle('active');
  burger.innerHTML = dropdown.classList.contains('active') ?  '&#215;' : '&#9776;'
}