// SHOW PASSWORD
function togglePassword(id) {
  let input = document.getElementById(id);
  if (input) {
    input.type = input.type === "password" ? "text" : "password";
  }
}

// PASSWORD HASHING HELPER (SHA-256)
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hash));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

// EMAIL VALIDATION
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// FORGOT PASSWORD TOGGLE
function showForgotPassword() {
  document.getElementById("loginForm").classList.remove("active");
  document.getElementById("forgotForm").classList.add("active");
}

function showLoginFormFromForgot() {
  document.getElementById("forgotForm").classList.remove("active");
  document.getElementById("resetSuccess").classList.remove("active");
  document.getElementById("loginForm").classList.add("active");
}

// FORGOT PASSWORD SUBMIT
document.getElementById("forgotForm").addEventListener("submit", function (e) {
  e.preventDefault();
  let email = document.getElementById("forgotEmail").value.trim();
  if (!isValidEmail(email)) {
    alert("Please enter a valid email address.");
    return;
  }
  document.getElementById("resetEmailSpan").textContent = email;
  document.getElementById("forgotForm").classList.remove("active");
  document.getElementById("resetSuccess").classList.add("active");
});

// LOGIN SUBMIT
document.getElementById("loginForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  let email = document.getElementById("loginEmail").value.trim().toLowerCase();
  let password = document.getElementById("loginPassword").value.trim();
  let remember = document.getElementById("rememberMe").checked;

  const hashedPassword = await hashPassword(password);

  if (typeof supabaseClient !== 'undefined' && !SUPABASE_URL.includes('YOUR-PROJECT-ID')) {
      supabaseClient.from('users').select('*').eq('email', email).eq('password', hashedPassword).then(({data, error}) => {
          if (error || !data || data.length === 0) {
              alert("Invalid credentials from Cloud DB");
          } else {
              completeLogin(email, remember, data[0]);
          }
      });
  } else {
      let user = JSON.parse(localStorage.getItem("user"));
      
      // Auto-seed default admin locally if no user exists and logging in as admin
      if (!user && email === "adminxeventnest@gmail.com") {
          const defaultAdminPassword = "adminxx1234";
          const adminHash = await hashPassword(defaultAdminPassword);
          user = {
              name: "Admin",
              email: "adminxeventnest@gmail.com",
              password: adminHash,
              role: "admin",
              phone: "1234567890",
              city: "Jaipur"
          };
          localStorage.setItem("user", JSON.stringify(user));
      }

      if (user && user.email === email && user.password === hashedPassword) {
          completeLogin(email, remember, user);
      } else {
          alert("Invalid credentials from Local Storage");
      }
  }

  function completeLogin(email, remember, userObj) {
      if (remember) localStorage.setItem("session", "true");
      localStorage.setItem("loggedInUser", email);
      localStorage.setItem("userProfile", JSON.stringify(userObj));
      alert("Login Success!");
      
      let redirectUrl = localStorage.getItem("loginRedirectUrl");
      if (redirectUrl) {
          localStorage.removeItem("loginRedirectUrl");
          window.location.href = redirectUrl;
      } else {
          if (userObj && userObj.role === 'admin') {
              window.location.href = "admin.html";
          } else {
              window.location.href = "index.html";
          }
      }
  }
});

// JWT Parser Helper for Social Auth
function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Failed to parse JWT", e);
    return null;
  }
}

// Initialize Social Auth SDKs
window.onload = function () {
  // --- Google Identity Services ---
  if (typeof google !== 'undefined' && google.accounts && google.accounts.id) {
    google.accounts.id.initialize({
      client_id: "YOUR_GOOGLE_CLIENT_ID_HERE.apps.googleusercontent.com", // TODO: Set your Google Client ID
      callback: handleGoogleCredentialResponse
    });

    // Render for Sign In Form
    const loginBtn = document.getElementById("g_id_signin_login");
    if (loginBtn) {
      google.accounts.id.renderButton(
        loginBtn,
        { theme: "filled_black", size: "large", type: "standard", shape: "rectangular", width: 182 }
      );
    }
  } else {
    console.warn("Google SDK failed to load.");
  }

  // --- Apple Sign In SDK ---
  if (typeof AppleID !== 'undefined' && AppleID.auth) {
    AppleID.auth.init({
      clientId: 'YOUR_APPLE_CLIENT_ID_HERE', // TODO: Set your Apple Client ID (Service ID)
      scope: 'name email',
      redirectURI: 'https://yourdomain.com/callback', // TODO: Set your registered redirect URI
      state: 'origin:web',
      usePopup: true
    });
  } else {
    console.warn("Apple SDK failed to load.");
  }
};

// Handle Google Response
function handleGoogleCredentialResponse(response) {
  const jwt = response.credential;
  const decodedToken = parseJwt(jwt);

  if (decodedToken) {
    const { name, email, picture } = decodedToken;
    console.log("Google Auth Success:", { name, email, picture });

    localStorage.setItem("loggedInUser", email);
    localStorage.setItem("userProfile", JSON.stringify({ name, email, picture, provider: "Google" }));

    alert(`Successfully authenticated with Google!\nWelcome ${name}`);
    
    let redirectUrl = localStorage.getItem("loginRedirectUrl");
    if (redirectUrl) {
        localStorage.removeItem("loginRedirectUrl");
        window.location.href = redirectUrl;
    } else {
        window.location.href = "index.html";
    }
  }
}

// Handle Apple Response
async function handleAppleLogin() {
  try {
    const response = await AppleID.auth.signIn();
    const idToken = response.authorization.id_token;
    const decodedToken = parseJwt(idToken);
    
    if (decodedToken) {
      const email = decodedToken.email;
      let name = "Apple User"; 
      
      if (response.user && response.user.name) {
        name = `${response.user.name.firstName} ${response.user.name.lastName}`.trim();
      }

      console.log("Apple Auth Success:", { name, email });

      localStorage.setItem("loggedInUser", email);
      localStorage.setItem("userProfile", JSON.stringify({ name, email, provider: "Apple" }));

      alert(`Successfully authenticated with Apple!\nWelcome ${name}`);
      
      let redirectUrl = localStorage.getItem("loginRedirectUrl");
      if (redirectUrl) {
          localStorage.removeItem("loginRedirectUrl");
          window.location.href = redirectUrl;
      } else {
          window.location.href = "index.html";
      }
    }
  } catch (error) {
    console.error("Apple Sign-In Error:", error);
    if (error.error !== 'popup_closed_by_user') {
      alert("Apple Sign-In failed. Please try again.");
    }
  }
}