document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');

  if (loginForm) {
      loginForm.addEventListener('submit', async (event) => {
          event.preventDefault();
          const email = document.getElementById('email').value;
          const password = document.getElementById('password').value;
          loginUser(email, password);
      });
  }
});

async function loginUser(email, password) {
  try {
      const response = await fetch('http://127.0.0.1:5000/login', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password })
      });

      if (response.ok) {
          const data = await response.json();
          document.cookie = `token=${data.access_token}; path=/`;
          window.location.href = 'index.html';
      } else {
          const errorData = await response.json();
          displayErrorMessage(errorData.message || 'Login failed');
      }
  } catch (error) {
      displayErrorMessage('An error occurred while trying to log in');
  }
}

function displayErrorMessage(message) {
  const errorMessageDiv = document.getElementById('error-message');
  errorMessageDiv.textContent = message;
}

async function loginUser(email, password) {
  try {
      const response = await fetch('http://127.0.0.1:5000/login', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password })
      });

      if (response.ok) {
          const data = await response.json();
          document.cookie = `token=${data.access_token}; path=/`;
          localStorage.setItem('loginSuccess', 'true');
          window.location.href = 'index.html';
      } else {
          const errorData = await response.json();
          displayErrorMessage(errorData.message || 'Login failed');
      }
  } catch (error) {
      displayErrorMessage('An error occurred while trying to log in');
  }
}
