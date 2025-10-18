document.addEventListener('turbo:load', () => {
  const dropdown = document.getElementById('currently-reading-dropdown');
  if (!dropdown) return;

  const button = document.getElementById('currently-reading-button');
  const menu = document.getElementById('currently-reading-menu');

  let timeoutId = null;

  const showMenu = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    menu.classList.remove('hidden');
  };

  const hideMenu = () => {
    timeoutId = setTimeout(() => {
      menu.classList.add('hidden');
    }, 100); // Small delay to allow moving to the menu
  };

  // Show menu on button hover
  button.addEventListener('mouseenter', showMenu);
  button.addEventListener('mouseleave', hideMenu);

  // Keep menu open when hovering over it
  menu.addEventListener('mouseenter', showMenu);
  menu.addEventListener('mouseleave', hideMenu);
});
