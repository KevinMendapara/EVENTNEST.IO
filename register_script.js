let generatedOTP = "";

// SHOW PASSWORD
function togglePassword(id) {
  let input = document.getElementById(id);
  if (input) {
    input.type = input.type === "password" ? "text" : "password";
  }
}

// EMAIL VALIDATION
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// PASSWORD STRENGTH METER
const passwordInput = document.getElementById("password");
if (passwordInput) {
  passwordInput.addEventListener("input", function () {
    let pass = this.value;
    let bar = document.getElementById("strengthBar");

    if (!pass) {
      bar.style.width = "0%";
      bar.style.background = "#333";
      return;
    }

    let strength = 0;
    if (pass.length >= 6) strength++;
    if (pass.length >= 10) strength++;
    if (/[A-Z]/.test(pass)) strength++;
    if (/[0-9]/.test(pass)) strength++;
    if (/[^A-Za-z0-9]/.test(pass)) strength++;

    if (pass.length < 6) {
      bar.style.width = "30%";
      bar.style.background = "red";
    } else if (strength < 4) {
      bar.style.width = "60%";
      bar.style.background = "orange";
    } else {
      bar.style.width = "100%";
      bar.style.background = "green";
    }
  });
}

// REGISTER SUBMIT
document.getElementById("registerForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  let name = document.getElementById("name").value.trim();
  let email = document.getElementById("email").value.trim().toLowerCase();
  let phone = document.getElementById("phone").value.trim();
  let city = document.getElementById("city").value.trim();
  let password = passwordInput.value.trim();
  let confirmPassword = document.getElementById("confirmPassword").value.trim();
  let termsAgree = document.getElementById("termsAgree").checked;

  if (!isValidEmail(email)) {
    alert("Please enter a valid email address.");
    return;
  }

  if (password.length < 6) {
    alert("Password must be at least 6 characters long.");
    return;
  }

  if (password !== confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  if (!termsAgree) {
    alert("You must agree to the Terms of Service.");
    return;
  }

  const hashedPassword = await hashPassword(password);

  // Store temporary user info in localStorage for OTP verification step
  localStorage.setItem("temp_user", JSON.stringify({ name, email, phone, city, password: hashedPassword }));

  // GENERATE OTP
  generatedOTP = Math.floor(1000 + Math.random() * 9000).toString();
  alert("Your OTP code is: " + generatedOTP); // demo purpose

  document.getElementById("registerForm").classList.remove("active");
  document.getElementById("otpForm").classList.add("active");
});

// RESEND OTP
document.getElementById("resendOtpBtn").addEventListener("click", function (e) {
  e.preventDefault();
  generatedOTP = Math.floor(1000 + Math.random() * 9000).toString();
  alert("A new OTP code has been sent: " + generatedOTP);
});

// OTP VERIFY SUBMIT
document.getElementById("otpForm").addEventListener("submit", function (e) {
  e.preventDefault();

  let otp = document.getElementById("otpInput").value.trim();

  if (otp === generatedOTP) {
    let tempUser = JSON.parse(localStorage.getItem("temp_user"));
    
    // Save to Supabase (if configured), else LocalStorage
    if (typeof supabaseClient !== 'undefined' && !SUPABASE_URL.includes('YOUR-PROJECT-ID')) {
        supabaseClient.from('users').insert([tempUser]).then(({data, error}) => {
            if (error) {
                alert("Error saving to cloud database: " + error.message);
            } else {
                alert("Account Created successfully! Please log in.");
                localStorage.setItem("user", JSON.stringify(tempUser));
                localStorage.removeItem("temp_user");
                window.location.href = "login.html";
            }
        });
    } else {
        localStorage.setItem("user", JSON.stringify(tempUser));
        localStorage.removeItem("temp_user");
        alert("Account Created (Saved to Local Storage)! Please log in.");
        window.location.href = "login.html";
    }
  } else {
    alert("Invalid OTP code. Please try again.");
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

// Initialize Social Auth SDKs for signup page
window.onload = function () {
  // --- Google Identity Services ---
  if (typeof google !== 'undefined' && google.accounts && google.accounts.id) {
    google.accounts.id.initialize({
      client_id: "YOUR_GOOGLE_CLIENT_ID_HERE.apps.googleusercontent.com", // TODO: Set your Google Client ID
      callback: handleGoogleCredentialResponse
    });

    // Render for Sign Up Form
    const registerBtn = document.getElementById("g_id_signin_register");
    if (registerBtn) {
      google.accounts.id.renderButton(
        registerBtn,
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
    console.log("Google Auth Success (Register page):", { name, email, picture });

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

      console.log("Apple Auth Success (Register page):", { name, email });

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
