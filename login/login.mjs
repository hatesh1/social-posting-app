let currentUser = JSON.parse(localStorage.getItem("currentUser"))

if (currentUser) {
    window.location.href = "../posts/post.html"
}

document.querySelector("#loginForm").addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.querySelector('#email').value.trim()
    const password = document.querySelector('#password').value

    // SweetAlert for validation
    if (!email || !password) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Please fill all fields!',
        })
        return
    }

    let all_users = JSON.parse(localStorage.getItem("users")) || []

    let existing_user = all_users.find((user) => {
        return user.email.toLowerCase() === email.toLowerCase()
    })

    if (!existing_user || existing_user.password !== password) {
        Swal.fire({
            icon: 'error',
            title: 'Login Failed',
            text: 'Invalid email or password!',
        })
        return
    }

    // Success Alert
    Swal.fire({
        icon: 'success',
        title: 'Login Successful!',
        text: `Welcome back, ${existing_user.firstName || 'User'}!`, // Name show
        timer: 2000,
        showConfirmButton: false
    }).then(() => {
        localStorage.setItem("currentUser", JSON.stringify(existing_user))
        window.location.href = "../posts/post.html"
    })
})

const togglePassword = document.querySelector('#togglePassword')
const password = document.querySelector('#password')

togglePassword.addEventListener('click', function () {
    const type = password.getAttribute('type') === 'password' ? 'text' : 'password'
    password.setAttribute('type', type)

    this.classList.toggle('bi-eye')
    this.classList.toggle('bi-eye-slash')
})
password.addEventListener('input', function() {
    this.nextElementSibling.style.display = this.value.length > 0 ? 'block' : 'none';
})