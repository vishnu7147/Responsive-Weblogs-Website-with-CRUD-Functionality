document.addEventListener('DOMContentLoaded', function () {
    const createPostBtn = 
        document.getElementById('createPostBtn');
    const createPostModal = 
        document.getElementById('createPostModal');
    const closeModal = 
        document.getElementById('closeModal');
    const postForm = 
        document.getElementById('postForm');
    const postSubmitBtn = 
        document.getElementById('postSubmitBtn');
    const postContainer = 
        document.querySelector('.post-container');
    const postDetailModal = 
        document.getElementById('postDetailModal');
    const closeDetailModal = 
        document.getElementById('closeDetailModal');
    const detailTitle = 
        document.getElementById('detailTitle');
    const detailDate = 
        document.getElementById('detailDate');
    const detailDescription = 
        document.getElementById('detailDescription');

    createPostBtn.addEventListener('click', function () {
        createPostModal.style.display = 'flex';
    });
    closeModal.addEventListener('click', function () {
        createPostModal.classList.add('fadeOut');
        setTimeout(() => {
            createPostModal.style.display = 'none';
            createPostModal.classList.remove('fadeOut');
        }, 500);
    });
    postForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const postCategory = 
            document.getElementById('postCategory').value;
        const postTitle = 
            document.getElementById('postTitle').value;
        const postDescription = 
            document.getElementById('postDescription').value;
        if (postCategory.trim() === '' ||
         postTitle.trim() === '' || 
         postDescription.trim() === '') {
            alert('Please fill out all fields.');
            return;
        }
        const currentDate = new Date();
        const day = currentDate.getDate();
        const month = currentDate.toLocaleString('default',
         { month: 'short' });
        const year = currentDate.getFullYear();
        const formattedDate = day + ' ' + month + ' ' + year;
        const newPost = document.createElement('div');
        newPost.className = 'post-box';
        newPost.innerHTML = `
            <h1 class="post-title" data-title="${postTitle}"
         data-date="${formattedDate}"
          data-description="${postDescription}">
            ${postTitle}</h1><br>   
        <h2 class="category">${postCategory}</h2><br>
        <span class="post-date">${formattedDate}</span>
        <p class="post-description">
        ${postDescription.substring(0, 100)}...</p>
        <button class="delete-post" data-title="${postTitle}">
        Delete</button>
        <span class="load-more" data-title="${postTitle}" 
        data-date="${formattedDate}" 
        data-description="${postDescription}">
        Load more</span>
        `;
        postContainer.insertBefore(newPost, 
            postContainer.firstChild);
        const postCreatedMessage = document
        .getElementById('postCreatedMessage');
        postCreatedMessage.style.display = 'block';
        createPostModal.style.display = 'none';
        postForm.reset();
        setTimeout(() => {
            postCreatedMessage.style.display = 'none';
        }, 3000);
    });
    postContainer.addEventListener('click', function (event) {
        if (event.target.classList.contains('load-more') ||
         event.target.classList.contains('post-title')) {
            const title = event.target.getAttribute('data-title');
            const date = event.target.getAttribute('data-date');
            const description = 
                event.target.getAttribute('data-description');
            detailTitle.textContent = title;
            detailDate.textContent = date;
            detailDescription.textContent = description;
            postDetailModal.style.display = 'flex';
        }
        if (event.target.classList.contains('delete-post')) {
            const titleToDelete = 
                event.target.getAttribute('data-title');
            const postToDelete = 
                document.querySelector(`
            .post-title[data-title=
                "${titleToDelete}"]`).closest('.post-box');
            postToDelete.classList.add('fadeOut');
            setTimeout(() => {
                postContainer.removeChild(postToDelete);
            }, 500);
        }
    });
    closeDetailModal.addEventListener('click', function () {
        postDetailModal.classList.add('fadeOut'); 
        setTimeout(() => {
           postDetailModal.style.display = 'none';
          postDetailModal.classList.remove('fadeOut'); 
        }, 500);
});
});
function fetchPosts() {
    fetch('http://localhost:5000/api/posts')
      .then((response) => response.json())
      .then((data) => {
        postContainer.innerHTML = '';

        data.forEach((post) => {
          const postElement = document.createElement('div');
          postElement.className = 'post-box';
          postElement.innerHTML = `
            <h1 class="post-title" data-id="${post.id}">
              ${post.title}
            </h1><br>
            <h2 class="category">${post.category}</h2><br>
            <span class="post-date">${post.date}</span>
            <p class="post-description">
              ${post.description.substring(0, 100)}...
            </p>
            <button class="delete-post" data-id="${post.id}">
              Delete
            </button>
          `;
          postContainer.appendChild(postElement);
        });
      })
      .catch((error) => console.error('Error fetching posts:', error));
  }

  postForm.addEventListener('submit', function (event) {
    event.preventDefault();
  
    const title = document.getElementById('postTitle').value;
    const category = document.getElementById('postCategory').value;
    const description = document.getElementById('postDescription').value;
  
    fetch('http://localhost:5000/api/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, category, description }),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((data) => {
            throw new Error(data.message);
          });
        }
        return response.json();
      })
      .then(() => {
        postForm.reset();
        createPostModal.style.display = 'none';
        fetchPosts(); 
      })
      .catch((error) => alert('Error creating post: ' + error.message));
  });

  postContainer.addEventListener('click', function (event) {
    if (event.target.classList.contains('delete-post')) {
      const postId = event.target.getAttribute('data-id');
  
      fetch(`http://localhost:5000/api/posts/${postId}`, {
        method: 'DELETE',
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to delete post');
          }
          fetchPosts(); 
        })
        .catch((error) => alert('Error deleting post: ' + error.message));
    }
  });
  
