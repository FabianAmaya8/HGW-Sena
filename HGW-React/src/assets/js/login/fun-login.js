document.addEventListener('DOMContentLoaded', function () {
    const togglePassword = document.getElementById('toggle-password');
    const passwordField = document.getElementById('contrasena');

    togglePassword.addEventListener('click', function () {
        if (passwordField.type === 'password') {
            passwordField.type = 'text';
            togglePassword.classList.remove('bx-hide');
            togglePassword.classList.add('bx-show');
        } else {
            passwordField.type = 'password';
            togglePassword.classList.remove('bx-show');
            togglePassword.classList.add('bx-hide');
        }
    });

    const form = document.getElementById('login-form');
    form.addEventListener('submit', function (event) {
        if (!form.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
        }

        const inputs = form.querySelectorAll('input[required]');
        inputs.forEach(input => {
            if (!input.value) {
                input.classList.add('is-invalid');
            } else {
                input.classList.remove('is-invalid');
            }

            input.addEventListener('input', function () {
                if (this.value) {
                    this.classList.remove('is-invalid');
                }
            });
        });
    });
});
