const updatePostHandler = async (event) => {
    event.preventDefault();
    console.log("pressed update post button");
    const postTitle = document.querySelector('#post-update-title').value.trim();
    const postContent = document.querySelector('#post-update-content').value.trim();
    const postID = Number(event.target.children[2].children[0].classList[2]);
    const response = await fetch(`/dashboard/post/${postID}/update/submit`, {
        method: 'PUT',
        body: JSON.stringify({ postTitle, postContent }),
        headers: { 'Content-Type': 'application/json' },
    });
    if (response.ok) {
        console.log("ok");
        document.location.replace(`/dashboard`);
    } else {
        alert('Failed to update post');
    }
}
  
document.querySelector('.post-update-form').addEventListener('submit', updatePostHandler);