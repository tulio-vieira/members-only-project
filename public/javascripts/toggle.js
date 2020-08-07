const toggleButton = document.getElementsByClassName('toggle-button')[0];
const navbarLinks = document.getElementsByClassName('navbar-links')[0];

const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirm-password');
const message = document.getElementById('password-error');
const submitButton = document.getElementById('submit');

toggleButton.addEventListener('click', () => {
  navbarLinks.classList.toggle('active')
});

function check() {
  if (password.value == confirmPassword.value) {
    message.style.display = 'none';
    submitButton.disabled = false;
  } else {
    message.style.display = 'block';
    submitButton.disabled = true;
  }
}