const commentPostHandler = async (event) => {
    event.preventDefault();
    console.log("pressed submit post button");
    const postTitle = document.querySelector('#post-title').value.trim();
    const postContent = document.querySelector('#post-content').value.trim();
    if (postTitle && postContent) {
      const response = await fetch(`/dashboard/new/add`, {
        method: 'POST',
        body: JSON.stringify({ postTitle, postContent }),
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (response.ok) {
        console.log("ok");
        document.location.replace(`/dashboard`);
      } else {
        alert('Failed to add post');
      }
    }
  };
  
  document.querySelector('.post-form').addEventListener('submit', commentPostHandler);