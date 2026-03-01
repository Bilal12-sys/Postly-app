function showSignup() {
    document.getElementById("login-box").style.display = "none";
    document.getElementById("signup-box").style.display = "flex";
}

function showLogin() {
    document.getElementById("signup-box").style.display = "none";
    document.getElementById("login-box").style.display = "flex";
}


function signup() {
    let name = document.getElementById("signup-name").value.trim();
    let pass = document.getElementById("signup-pass").value.trim();
        
    if(!name || !pass) return alert("Please fill in all fields");

    localStorage.setItem("name", name);
    localStorage.setItem("password", pass);
    Swal.fire({
  title: "Signup Successful!",
  text: "You can now log in.",
  icon: "success"
});
    showLogin();
}


function login() {
    let nameInput = document.getElementById("login-email").value.trim();
    let passInput = document.getElementById("login-pass").value.trim();
    
    let lcName = localStorage.getItem("name");
    let lcPass = localStorage.getItem("password");
    
    if (nameInput === lcName && passInput === lcPass) {
       Swal.fire({
  position: "top-end",
  icon: "success",
  title: "Your work has been saved",
  showConfirmButton: false,
  timer: 1200,
});
        setTimeout(() => {
            window.location.href = "datapost.html";
        }, 1290);
    } else {
        Swal.fire({
            icon: "error",
            title: "Oops. User not found!",
            text: "Please Sign in."
        });
    }
}


function openModal() {
    const modal = document.getElementById("uploadModal");
    if(modal) modal.style.display = "flex";
     if(modal) modal.style.overflow = "hidden";
}

function closeModal() {
    const modal = document.getElementById("uploadModal");
    if(modal) modal.style.display = "none";
}
// ===== MODAL FUNCTIONS =====
function openModal() {
    const modal = document.getElementById("uploadModal");
    modal.style.display = "flex";
    document.body.style.overflow = "hidden"; // prevent background scroll
}

function closeModal() {
    const modal = document.getElementById("uploadModal");
    modal.style.display = "none";
    document.body.style.overflow = "auto"; // restore scroll
    // Reset form fields
    document.getElementById("image").value = "";
    document.getElementById("title").value = "";
    document.getElementById("desc").value = "";
}

// ===== UPLOAD POST =====
function uploadPost() {
    const title = document.getElementById("title").value.trim();
    const desc = document.getElementById("desc").value.trim();
    const imageInput = document.getElementById("image");
    const imageFile = imageInput.files[0];

    if (!title || !imageFile) {
        return Swal.fire({
            title: "Oops!",
            text: "Please add a title and select an image.",
            icon: "warning"
        });
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        let posts = [];
        try {
            posts = JSON.parse(localStorage.getItem("posts") || "[]");
        } catch (err) {
            posts = [];
        }

        const newPost = {
            title: title,
            desc: desc,
            image: e.target.result,
            date: new Date().toLocaleDateString()
        };

        posts.push(newPost);
        localStorage.setItem("posts", JSON.stringify(posts));

        closeModal();
        renderPosts();

        Swal.fire({
            title: "Success!",
            text: "Post uploaded successfully.",
            icon: "success",
            timer: 1500,
            showConfirmButton: false
        });
    };

    reader.onerror = function() {
        Swal.fire({
            title: "Error!",
            text: "Failed to read the image.",
            icon: "error"
        });
    };

    reader.readAsDataURL(imageFile);
}

// ===== DELETE POST =====
function deletePost(index) {
    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        if (result.isConfirmed) {
            let posts = [];
            try {
                posts = JSON.parse(localStorage.getItem("posts") || "[]");
            } catch (err) {
                posts = [];
            }

            posts.splice(index, 1);
            localStorage.setItem("posts", JSON.stringify(posts));
            renderPosts();

            Swal.fire({
                title: "Deleted!",
                text: "Your post has been deleted.",
                icon: "success",
                timer: 1200,
                showConfirmButton: false
            });
        }
    });
}

// ===== DELETE ALL POSTS =====
function deleteAllPosts() {
    Swal.fire({
        title: "Are you sure?",
        text: "All posts will be deleted!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete all!"
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.setItem("posts", "[]");
            renderPosts();
            Swal.fire({
                title: "Deleted!",
                text: "All posts have been deleted.",
                icon: "success",
                timer: 1200,
                showConfirmButton: false
            });
        }
    });
}

// ===== RENDER POSTS =====
function renderPosts() {
    const postContainer = document.getElementById("posts");
    if (!postContainer) return;

    let posts = [];
    try {
        posts = JSON.parse(localStorage.getItem("posts") || "[]");
    } catch (err) {
        posts = [];
    }

    if (posts.length === 0) {
        postContainer.innerHTML = `
            <p style="text-align:center; padding:20px; color:#555;">
                No posts yet. Click the <strong>+</strong> button to create one!
            </p>
        `;
        return;
    }

    postContainer.innerHTML = posts
        .map((post, index) => `
        <div class="post-card">
            <img src="${post.image}" alt="post">
            <div class="post-info">
                <h4>${post.title}</h4>
                <p>${post.desc}</p>
                <div class="card-footer">
                    <small>${post.date}</small>
                    <button class="delete-btn" onclick="deletePost(${index})">Delete</button>
                </div>
            </div>
        </div>
    `)
        .reverse()
        .join('');
}

// ===== INITIAL RENDER =====
document.addEventListener("DOMContentLoaded", () => {
    renderPosts();
});