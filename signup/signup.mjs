let currentUser = JSON.parse(localStorage.getItem("currentUser"))

if (currentUser) {
    window.location.href = "../posts/post.html"
}

document.querySelector("#signupForm").addEventListener('submit', (e) => {
    e.preventDefault()

    const fullName = document.querySelector('#fullName').value.trim()
    const email = document.querySelector('#email').value.trim()
    const password = document.querySelector('#password').value;
    const confirm_password = document.querySelector('#confirm_password').value

    // SweetAlert Validations
    if (!fullName || !email || !password) {
        Swal.fire({ icon: 'error', title: 'Error', text: 'All fields are required!' })
        return
    }

    if (!email.includes("@")) {
        Swal.fire({ icon: 'warning', title: 'Invalid Email', text: 'Please enter a valid email address.' })
        return
    }

    if (password !== confirm_password) {
        Swal.fire({ icon: 'error', title: 'Mismatch', text: 'Passwords do not match!' })
        return
    }

    let all_users = JSON.parse(localStorage.getItem("users")) || []

    let existing_user = all_users.find((user) => user.email.toLowerCase() === email.toLowerCase())

    if (existing_user) {
        Swal.fire({ icon: 'info', title: 'Existing User', text: 'This email is already registered.' })
        return
    }

    // Create New User Object with Name
    let newUser = {
        fullName: fullName,
        email: email.toLowerCase(),
        password: password
    }

    all_users.push(newUser)
    localStorage.setItem("users", JSON.stringify(all_users))

    Swal.fire({
        icon: 'success',
        title: 'Account Created!',
        text: 'Redirecting to Login...',
        timer: 2000,
        showConfirmButton: false
    }).then(() => {
        window.location.href = "../login/login.html";
    });
});


// Password Toggle
const togglePassword = document.querySelector('#togglePassword')
const password = document.querySelector('#password')

togglePassword.addEventListener('click', function () {
    const type = password.getAttribute('type') === 'password' ? 'text' : 'password'
    password.setAttribute('type', type)

    this.classList.toggle('bi-eye')
    this.classList.toggle('bi-eye-slash')
})
password.addEventListener('input', function () {
    this.nextElementSibling.style.display = this.value.length > 0 ? 'block' : 'none';
})

// Confirm Password Toggle
const toggleConfirmPassword = document.querySelector('#toggleConfirmPassword')
const confirmPassword = document.querySelector('#confirm_password')

toggleConfirmPassword.addEventListener('click', function () {
    const type = confirmPassword.getAttribute('type') === 'password' ? 'text' : 'password'
    confirmPassword.setAttribute('type', type)

    this.classList.toggle('bi-eye')
    this.classList.toggle('bi-eye-slash')
})

confirmPassword.addEventListener('input', function () {
    this.nextElementSibling.style.display = this.value.length > 0 ? 'block' : 'none';
})
