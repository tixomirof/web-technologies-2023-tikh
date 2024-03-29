import Auth from "../services/auth.js";
import location from "../services/location.js";
import loading from "../services/loading.js";
import api from "../services/api.js";

const init = async () => {
    const { ok: isLogged } = await Auth.me()

    if (!isLogged) {
        return location.login()
    } else {
        loading.stop()
    }

    const posts = await api("/todo/");
    for (var post of posts.data) {
        createPost(post);
    }
    console.log(posts);
    // create POST /todo { description: string }
    // get get /todo/1 - 1 это id
    // getAll get /todo
    // update put /todo/1 - 1 это id { description: string }
    // delete delete /todo/1 - 1 это id
}

function createPost(post) {
    const postId = post.id;
    const description = post.description;
    const isCompleted = post.completed;

    const mainContainer = document.getElementsByClassName("posts-container")[0];
    const postContainer = document.createElement("div");
    postContainer.className = "post-container";
    postContainer.id = "post-container-" + postId;

    const idField = document.createElement("p");
    idField.innerText = postId;
    idField.className = "post-id";
    postContainer.appendChild(idField);

    const completedCheckmark = document.createElement("input", {type: "checkbox", checked: isCompleted});
    completedCheckmark.className = "post-checkmark";
    completedCheckmark.innerText = "Completed";
    completedCheckmark.addEventListener("onchecked", async () => {
        await api("/todo/" + postId, { method: 'PUT', body: { completed: completedCheckmark.checked } });
        if (completedCheckmark.checked && !postContainer.classList.contains("post-completed")) {
            postContainer.classList.add("post-completed");
        } else if (postContainer.classList.contains("post-completed")) {
            postContainer.classList.remove("post-completed");
        }
    });
    postContainer.appendChild(completedCheckmark);

    const descriptionField = document.createElement("p");
    descriptionField.innerText = description;
    descriptionField.className = "post-description";
    postContainer.appendChild(descriptionField);

    const deletionButton = document.createElement("button");
    deletionButton.innerText = "Удалить";
    deletionButton.className = "post-delete";
    deletionButton.addEventListener("onclick", async () => {
        mainContainer.removeChild(postContainer);
        await api("/todo/" + postId, { method: 'DELETE' });
    });

    if (isCompleted) {
        postContainer.classList.add("post-completed");
    }

    mainContainer.appendChild(postContainer);
}

if (document.readyState === 'loading') {
    document.addEventListener("DOMContentLoaded", init)
} else {
    init()
}
