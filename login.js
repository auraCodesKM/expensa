// Event listener for password input to show validation
document.getElementById("password").addEventListener("input", function () {
    const password = this.value;
    const upperCasePattern = /[A-Z]/;
    const lowerCasePattern = /[a-z]/;
    const numberPattern = /[0-9]/;
    const specialCharPattern = /[!@#$%^&*(),.?":{}<>]/;

    // Show results when user types
    document.querySelector('.check-results').style.display = 'flex';
    updateValidation("upperCase", upperCasePattern.test(password));
    updateValidation("lowerCase", lowerCasePattern.test(password));
    updateValidation("number", numberPattern.test(password));
    updateValidation("specialChar", specialCharPattern.test(password));
});

function updateValidation(elementId, isValid) {
    const element = document.getElementById(elementId);
    const icon = element.querySelector("i");

    if (isValid) {
        element.classList.remove("invalid");
        element.classList.add("valid");
        icon.classList.remove("bi-shield-x");
        icon.classList.add("bi-shield-check");
    } else {
        element.classList.remove("valid");
        element.classList.add("invalid");
        icon.classList.remove("bi-shield-check");
        icon.classList.add("bi-shield-x");
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const expenseForm = document.getElementById('form');
    const formTitle = document.getElementById('form-title');
    const toggleForm = document.getElementById('toggle-form');
    const emailGroup = document.getElementById('email-group');
    const notification = document.getElementById('notification');
    const container = document.querySelector('.container');

    // Add animation class to container
    container.classList.add('fade-in');

    toggleForm.addEventListener('click', () => {
        // Add rotation animation to form
        container.classList.add('rotate-out');
        
        setTimeout(() => {
            if (formTitle.innerText === "Sign In") {
                formTitle.innerText = "Sign Up";
                emailGroup.style.display = 'flex';
                toggleForm.innerText = "Switch to Sign In";
            } else {
                formTitle.innerText = "Sign In";
                emailGroup.style.display = 'none';
                toggleForm.innerText = "Switch to Sign Up";
            }
            notification.style.display = 'none';
            
            // Remove rotation class and add rotate-in class
            container.classList.remove('rotate-out');
            container.classList.add('rotate-in');
            
            // Remove rotate-in class after animation completes
            setTimeout(() => {
                container.classList.remove('rotate-in');
            }, 500);
        }, 250);
    });

    expenseForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const email = document.getElementById('email').value;

        if (formTitle.innerText === "Sign Up") {
            // Sign Up logic
            if (localStorage.getItem(username)) {
                showNotification("Username already exists. Please choose another.", "error");
            } else {
                localStorage.setItem(username, JSON.stringify({ email, password }));
                showNotification("Account created successfully! You can now sign in.", "success");
                setTimeout(() => {
                    formTitle.innerText = "Sign In";
                    emailGroup.style.display = 'none';
                    toggleForm.innerText = "Switch to Sign Up";
                }, 2000);
            }
        } else {
            // Sign In logic
            const storedUser = localStorage.getItem(username);
            if (storedUser) {
                const userData = JSON.parse(storedUser);
                if (userData.password === password) {
                    showNotification("Sign In successful!", "success");
                    setTimeout(() => {
                        window.location.href = "home.html";
                    }, 1500);
                } else {
                    showNotification("Invalid password. Please try again.", "error");
                }
            } else {
                showNotification("Username not found. Please sign up or try again.", "error");
            }
        }
    });

    function showNotification(message, type) {
        notification.innerText = message;
        notification.className = type === "error" ? "error-message" : "success-message";
        notification.style.display = 'block';
        
        // Add shake animation for error messages
        if (type === "error") {
            notification.classList.add('shake');
            setTimeout(() => {
                notification.classList.remove('shake');
            }, 500);
        }
    }

    // Add floating label effect
    const inputFields = document.querySelectorAll('.input-group input');
    inputFields.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });
        input.addEventListener('blur', () => {
            if (input.value === '') {
                input.parentElement.classList.remove('focused');
            }
        });
    });

    // Improve password validation UI
    const passwordInput = document.getElementById('password');
    const validationItems = document.querySelectorAll('.check-results span');

    passwordInput.addEventListener('focus', () => {
        document.querySelector('.check-results').style.opacity = '1';
    });

    passwordInput.addEventListener('blur', () => {
        document.querySelector('.check-results').style.opacity = '0.7';
    });

    passwordInput.addEventListener('input', () => {
        validationItems.forEach(item => {
            item.style.transition = 'transform 0.3s ease';
            if (item.classList.contains('valid')) {
                item.style.transform = 'translateX(10px)';
            } else {
                item.style.transform = 'translateX(0)';
            }
        });
    });
});
