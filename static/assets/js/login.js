const $loginForm = document.querySelector('#login-form');
const $username = document.querySelector('#username');
const $password = document.querySelector('#password');

$loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const username = $username.value.trim();
  const password = $password.value.trim();
  try {
    const response = await fetch('/api/session/login', {
      method: 'POST',
      headers: {Accept: 'application/json', 'Content-Type': 'application/json'},
      body: JSON.stringify({username, password}),
    });
    if (!response.ok) alert(response.statusText);
    location.assign('/dashboard');
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
});
