async function loadPosts(id) {
    try {
        let posts = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
        if (!posts.ok) {
            throw new Error(`Post #${id} does not exist.`);
        }
        return await posts.json();
    }
    catch (e) {
        const body = document.querySelector("body");
        body.innerHTML = `
        <div class="error-container">
            <h1 id="page-not-exist-error">Sorry, this page cannot load with an error.</h1>
            <p id="page-not-exist-error-text">${e}</p>
        </div>
        `;
    }
}

async function loadComments(id) {
    try {
        let comments = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}/comments`);
        if (!comments.ok) throw new Error(`Could not fetch posts from post with id=${id}.`);
        return await comments.json();
    }
    catch (e) {
        console.error("Comment section could not load. ERROR message: " + e);
    }
}

const openPost = async (postData) => {
    if (postData === undefined) return;

    document.querySelector("title").textContent = "Post #" + postData.id;
    const container = document.querySelector(".post");
    /*container.innerHTML = `
        <h1 class="post-title">${postData.title}</h1>
        <p class="post-contents">${postData.contents}</p>
    `;*/
    container.innerHTML = `
    <p id="post-title">Post #${postData.id}</p>
    <div class="post-container">
        <p class="post-item__title" id="post-page-item-title">
            ${postData.title}
        </p>

        <p class="post-item__body" id="post-page-item-body">
            ${postData.body}
        </p>
    </div>`;

    const commentsContainer = document.querySelector(".comments-container");
    let comments = await loadComments(postData.id);
    for (var comment in comments) { 
        comment = comments[comment];
        const commentItem = document.createElement("li");
        commentItem.class = "comment-item";
        const commentItemInfo = document.createElement("h3");
        commentItemInfo.class = "comment-info";
        const commentItemContent = document.createElement("p");
        commentItemContent.class = "comment-content";

        commentItemInfo.innerHTML = `Comment #${comment.id} from <a href="https://${comment.email}">${comment.email}</a><br>${comment.name}`;
        commentItemContent.innerText = comment.body;

        commentItem.appendChild(commentItemInfo);
        commentItem.appendChild(commentItemContent);
        commentsContainer.appendChild(commentItem);
    }
};

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');
const postData = await loadPosts(id);
document.addEventListener("DOMContentLoaded", openPost(postData));