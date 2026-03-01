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

function uploadPost() {
    const title = document.getElementById("title").value;
    const desc = document.getElementById("desc").value;
    const imageFile = document.getElementById("image").files[0];

    if (!title || !imageFile) return alert("Please add a title and an image!");

    const reader = new FileReader();
    reader.onload = function(e) {
        const posts = JSON.parse(localStorage.getItem("posts") || "[]");
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
    };
    reader.readAsDataURL(imageFile);
}


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
            let posts = JSON.parse(localStorage.getItem("posts") || "[]");
            posts.splice(index, 1);
            localStorage.setItem("posts", JSON.stringify(posts));
            renderPosts();
            Swal.fire({
                title: "Deleted!",
                text: "Your file has been deleted.",
                icon: "success"
            });
        }
    });
}
function renderPosts() {
    const postContainer = document.getElementById("posts");
    if(!postContainer) return;

    const posts = JSON.parse(localStorage.getItem("posts") || "[]");
    
    if (posts.length === 0) {
        postContainer.innerHTML = "<p style='text-align:center; display: flex; justify-content: center; align-items: center; padding: 20px;'>No posts yet. Start by clicking +</p>";
        return;
    }
    // We use (post, index) so we know which one to delete
    postContainer.innerHTML = posts.map((post, index) => `
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
    `).reverse().join('');
}

// Automatically load posts if we are on the datapost.html page
if (document.getElementById("posts")) {
    renderPosts();
}