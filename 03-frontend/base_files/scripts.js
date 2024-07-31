document.addEventListener('DOMContentLoaded', () => {
  const loginSuccess = localStorage.getItem('loginSuccess');
  if (loginSuccess === 'true') {
      console.log('Connexion réussie');
      localStorage.removeItem('loginSuccess');
  }

  const loginForm = document.getElementById('login-form');
  const errorMessage = document.getElementById('error-message');

  if (loginForm) {
      loginForm.addEventListener('submit', async (event) => {
          event.preventDefault();
          const email = loginForm.email.value;
          const password = loginForm.password.value;
          await loginUser(email, password);
      });
  }
});

async function loginUser(email, password) {
  const errorMessage = document.getElementById('error-message');
  try {
      const response = await fetch('http://127.0.0.1:5000/login', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.msg || response.statusText);
      }

      const data = await response.json();
      document.cookie = `token=${data.access_token}; path=/`;
      localStorage.setItem('loginSuccess', 'true');
      window.location.href = 'index.html';
      console.log('Login successful:', data);

  } catch (error) {
      if (errorMessage) {
          errorMessage.textContent = `Login failed: ${error.message}`;
      }
      console.error('Error during login:', error);
  }
}

function addComment() {
  if (isLoggedIn()) {
      window.location.href = 'add_comment.html';
  } else {
      localStorage.setItem('redirectTo', 'add_comment.html');
      window.location.href = 'login.html';
  }
}

function isLoggedIn() {
  return Boolean(document.cookie.split('; ').find(row => row.startsWith('token=')));
}
