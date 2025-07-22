// get the course comments from the api

document.getElementById("showComments").addEventListener("click", async function () {
  const courseId = document.getElementById("courseSelect").value;

  const res = await fetch("/api/comments?courseId=" + courseId);
  const comments = await res.json();

  const commentsDiv = document.getElementById("commentsList");
  commentsDiv.innerHTML = "";

  if (comments.length === 0) {
    commentsDiv.innerHTML = "<p>No comments found for this course.</p>";
  } else {
    comments.forEach(c => {
      const div = document.createElement("div");
      div.innerHTML = `<b>${c.title}</b> - ${c.author} on ${c.date}<br>${c.body}<hr>`;
      commentsDiv.appendChild(div);
    });
  }
});
