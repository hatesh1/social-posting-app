let editIndex = null
let currentUser = JSON.parse(localStorage.getItem("currentUser"))

if (!currentUser) {
    window.location.href = "../login/login.html"
} else {
    // show full name if exists, otherwise show email
    document.querySelector("#userNameDisplay").innerText = currentUser.fullName || currentUser.email
}

function logout() {
    localStorage.removeItem("currentUser")
    window.location.href = "../login/login.html"
}

document.querySelector('#postForm').addEventListener('submit', (e) => {
    e.preventDefault()

    const title = document.querySelector("#title").value.trim()
    const description = document.querySelector("#desc").value.trim()

    // validation logic start
    if (title === "" || description === "") {
        Swal.fire({
            icon: 'error',
            title: 'Empty Fields!',
            text: 'Please write something in both title and description.',
            confirmButtonColor: '#667eea'
        });
        return;
    }
    // validation logic end

    let all_posts = JSON.parse(localStorage.getItem("posts")) || []

    if (editIndex !== null) {
        all_posts[editIndex].title = title
        all_posts[editIndex].description = description
        localStorage.setItem("posts", JSON.stringify(all_posts))
        editIndex = null
        document.querySelector("#submitBtn").innerText = "Post Now"
        Swal.fire({ icon: 'success', title: 'Updated!', text: 'Post updated successfully', timer: 1500 })
    } else {
        let new_post = {
            title: title,
            description: description,
            time: new Date().getTime(),
            createdBy: currentUser.email,
            creatorName: currentUser.fullName || "User",
            likes: [],
        }
        all_posts.unshift(new_post)
        localStorage.setItem("posts", JSON.stringify(all_posts))
        Swal.fire({ icon: 'success', title: 'Posted!', text: 'Your post is live', timer: 1500 })
    }

    e.target.reset()
    render_posts()
})

window.like_post = function (index) {
    let all_posts = JSON.parse(localStorage.getItem("posts")) || []
    let post = all_posts[index]
    let userIndex = post.likes.indexOf(currentUser.email)

    if (userIndex === -1) {
        post.likes.push(currentUser.email)
    } else {
        post.likes.splice(userIndex, 1)
    }

    all_posts[index] = post
    localStorage.setItem("posts", JSON.stringify(all_posts))
    render_posts()
}

window.delete_post = function (index) {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#667eea',
        cancelButtonColor: '#ff4757',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            let all_posts = JSON.parse(localStorage.getItem("posts")) || [];
            all_posts.splice(index, 1);
            localStorage.setItem("posts", JSON.stringify(all_posts));
            render_posts();
            Swal.fire('Deleted!', 'Post has been removed.', 'success');
        }
    })
}

window.edit_post = function (index) {
    let all_posts = JSON.parse(localStorage.getItem("posts")) || [];
    let post = all_posts[index];

    if (post.createdBy !== currentUser.email) {
        Swal.fire({ icon: 'error', title: 'Oops', text: 'You can only edit your own posts!' });
        return;
    }

    document.querySelector("#title").value = post.title;
    document.querySelector("#desc").value = post.description;
    document.querySelector("#submitBtn").innerText = "Update Post";
    editIndex = index;
    window.scrollTo(0, 0);

    // new logic disable delete btn during edit
    const deleteButtons = document.querySelectorAll(".delete-btn");
    deleteButtons.forEach(btn => {
        btn.disabled = true;
        btn.style.opacity = "0.5";
        btn.style.cursor = "not-allowed";
    });
}

function render_posts() {
    const all_posts = JSON.parse(localStorage.getItem("posts")) || [];
    const output = document.querySelector(".output");
    output.innerHTML = "";

    all_posts.forEach((post, index) => {
        const isLiked = post.likes.includes(currentUser.email);
        const isMyPost = post.createdBy === currentUser.email;

        output.innerHTML += `
        <div class="single-post">
            <div class="post-header">
                <i class="bi bi-person-circle"></i>
                <div>
                    <div class="author-name">${post.creatorName || post.createdBy}</div>
                    <div class="post-time">${moment(post.time).fromNow()}</div>
                </div>
            </div>
            <div class="post-title">${post.title}</div>
            <div class="post-desc">${post.description}</div>
            
            <div class="post-btns">
                <button class="${isLiked ? 'liked-post' : ''}" onclick="like_post(${index})">
                    <i class="bi ${isLiked ? 'bi-hand-thumbs-up-fill' : 'bi-hand-thumbs-up'}"></i> 
                    Like (${post.likes.length})
                </button>
                ${isMyPost ? `
                    <button class="edit-btn" onclick="edit_post(${index})">
                        <i class="bi bi-pencil-square"></i> Edit
                    </button>
                    <button class="delete-btn" onclick="delete_post(${index})">
                        <i class="bi bi-trash"></i> Delete
                    </button>
                ` : ''}
            </div>
        </div>
        `;
    });
}

render_posts();
