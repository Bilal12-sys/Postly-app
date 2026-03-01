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
// ===== MODAL =====
const modal = document.getElementById("uploadModal");
const imageInput = document.getElementById("image");

function openModal() {
    modal.style.display = "flex";
    document.body.style.overflow = "hidden"; // stop background scroll
}

function closeModal() {
    modal.style.display = "none";
    document.body.style.overflow = "auto";
    imageInput.value = ""; // reset file input
    document.getElementById("title").value = "";
    document.getElementById("desc").value = "";
}

// ===== UPLOAD POST =====
function uploadPost() {
    const title = document.getElementById("title").value.trim();
    const desc = document.getElementById("desc").value.trim();
    const file = imageInput.files[0];

    if (!title || !file) {
        return Swal.fire("Oops!", "Please add a title and select an image.", "warning");
    }

    // Ensure FileReader runs after user tap (mobile requirement)
    setTimeout(() => {
        const reader = new FileReader();

        reader.onload = (e) => {
            let posts = [];
            try {
                posts = JSON.parse(localStorage.getItem("posts") || "[]");
            } catch (err) { posts = []; }

            posts.push({
                title,
                desc,
                image: e.target.result,
                date: new Date().toLocaleDateString()
            });

            localStorage.setItem("posts", JSON.stringify(posts));
            closeModal();
            renderPosts();

            Swal.fire({
                title: "Success!",
                text: "Post uploaded.",
                icon: "success",
                timer: 1200,
                showConfirmButton: false
            });
        };

        reader.onerror = () => {
            Swal.fire("Error!", "Failed to read image.", "error");
        };

        reader.readAsDataURL(file);
    }, 50); // small delay ensures mobile input works
}

// ===== RENDER POSTS =====
function renderPosts() {
    const postContainer = document.getElementById("posts");
    if (!postContainer) return;

    let posts = [];
    try {
        posts = JSON.parse(localStorage.getItem("posts") || "[]");
    } catch (err) { posts = []; }

    if (posts.length === 0) {
        postContainer.innerHTML = `<p style="text-align:center; padding:20px;">No posts yet. Tap + to add one!</p>`;
        return;
    }

    postContainer.innerHTML = posts
        .map((p, i) => `
        <div class="post-card">
            <img src="${p.image}" alt="post">
            <div class="post-info">
                <h4>${p.title}</h4>
                <p>${p.desc}</p>
                <div class="card-footer">
                    <small>${p.date}</small>
                    <button class="delete-btn" onclick="deletePost(${i})">Delete</button>
                </div>
            </div>
        </div>
    `).reverse().join('');
}

// ===== DELETE POST =====
function deletePost(index) {
    Swal.fire({
        title: "Are you sure?",
        text: "This cannot be undone!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes!"
    }).then(result => {
        if (result.isConfirmed) {
            let posts = [];
            try { posts = JSON.parse(localStorage.getItem("posts") || "[]"); } 
            catch (err) { posts = []; }

            posts.splice(index, 1);
            localStorage.setItem("posts", JSON.stringify(posts));
            renderPosts();

            Swal.fire({title:"Deleted!", text:"Your post was deleted.", icon:"success", timer:1200, showConfirmButton:false});
        }
    });
}

// ===== DELETE ALL =====
function deleteAllPosts() {
    Swal.fire({
        title: "Delete all posts?",
        text: "Cannot undo!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes!"
    }).then(result => {
        if (result.isConfirmed) {
            localStorage.setItem("posts", "[]");
            renderPosts();
            Swal.fire({title:"Deleted!", text:"All posts deleted.", icon:"success", timer:1200, showConfirmButton:false});
        }
    });
}

// ===== INIT =====
document.addEventListener("DOMContentLoaded", renderPosts);