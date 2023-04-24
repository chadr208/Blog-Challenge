const commentFormHandler = async (event) => {
    event.preventDefault();
    console.log("pressed submit comment button");
    const commentText = document.querySelector('#comment-text').value.trim();
    const postID = Number(event.target.children[1].children[0].classList[2]);
    if (commentText) {
      const response = await fetch(`/post/${postID}/comment/add`, {
        method: 'POST',
        body: JSON.stringify({ commentText }),
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (response.ok) {
        console.log("ok");
        document.location.replace(`/post/${postID}`);
      } else {
        alert('Failed to add comment');
      }
    }
  };
  
  document.querySelector('.comment-form').addEventListener('submit', commentFormHandler);