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
    // create POST /todo { description: string }
    // get get /todo/1 - 1 это id
    // getAll get /todo
    // update put /todo/1 - 1 это id { description: string }
    // delete delete /todo/1 - 1 это id
}

let fetchInProgress;

function createPost(post) {
    const postId = post.id;
    const description = post.description;
    const isCompleted = post.completed;

    const mainContainer = document.getElementsByClassName("posts-container")[0];
    const postContainer = document.createElement("div");
    postContainer.className = "post-container";
    postContainer.id = "post-container-" + postId;

    // ID
    const idField = document.createElement("span");
    idField.innerText = "#" + postId;
    idField.className = "post-id";
    postContainer.appendChild(idField);

    // CHECKMARK COMPLETED
    const checkmarkLabel = document.createElement("label");
    checkmarkLabel.innerText = "Completed";
    checkmarkLabel.className = "post-checkmark-label";

    const completedCheckmark = document.createElement("input");
    completedCheckmark.className = "post-checkmark";
    completedCheckmark.type = "checkbox";
    completedCheckmark.checked = isCompleted;
    completedCheckmark.addEventListener("change", async () => {
        let completed = completedCheckmark.checked;
        completedCheckmark.checked = !completedCheckmark.checked; // reverse action until it's actually updated on the server
        if (fetchInProgress) return;

        fetchInProgress = true;
        try {
            let response = await api("/todo/" + postId, {
                method: 'PUT',
                body: JSON.stringify({ completed: completed })
            });

            if (response.ok) {
                let data = response.data;
                if (data.completed && !postContainer.classList.contains("post-completed")) {
                    postContainer.classList.add("post-completed");
                } else if (postContainer.classList.contains("post-completed")) {
                    postContainer.classList.remove("post-completed");
                }
                completedCheckmark.checked = data.completed;
            }
        }
        catch(e) {
            console.error("An error has occured when connecting to the web-server: " + e);
        }
        fetchInProgress = false;
    });
    checkmarkLabel.appendChild(completedCheckmark);
    postContainer.appendChild(checkmarkLabel);

    // DESCRIPTION
    const descriptionField = document.createElement("p");
    descriptionField.innerText = description;
    descriptionField.className = "post-description";
    postContainer.appendChild(descriptionField);

    // DELETE BUTTON
    const deletionButton = document.createElement("button");
    deletionButton.innerText = "Удалить";
    deletionButton.className = "post-delete";
    deletionButton.addEventListener("click", async () => {
        mainContainer.removeChild(postContainer);
        await api("/todo/" + postId, { method: 'DELETE' });
    });
    postContainer.appendChild(deletionButton);

    // ADDITIONAL HIGHLIGHTING
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
