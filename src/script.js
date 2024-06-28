function showLogin() {
    document.getElementById('login-form').style.display = 'block';
    document.getElementById('register-form').style.display = 'none';
    document.getElementById('login-tab').classList.add('active');
    document.getElementById('register-tab').classList.remove('active');
}

function showRegister() {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('register-form').style.display = 'block';
    document.getElementById('login-tab').classList.remove('active');
    document.getElementById('register-tab').classList.add('active');
}

document.addEventListener('DOMContentLoaded', function() {
    // Show the register form by default on the register page
    showRegister();
});

function validateEmail(inputId) {
    const email = document.getElementById(inputId).value;
    const warningId = inputId === 'login-email' ? 'login-warning' : 'register-warning';
    const warningElement = document.getElementById(warningId);

    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailPattern.test(email)) {
        warningElement.textContent = "Please enter a valid email address.";
        warningElement.style.display = 'block';
        return false;
    }

    warningElement.style.display = 'none';
    return true;
}

function togglePasswordVisibility() {
    var passwordInput = document.getElementById('passwordInput');
    if (passwordInput.type === "password") {
        passwordInput.type = "text";
    } else {
        passwordInput.type = "password";
    }
}
