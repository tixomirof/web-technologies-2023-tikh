import Form from "../components/form.js";
import Auth from "../services/auth.js";
import location from "../services/location.js";
import loading from "../services/loading.js";
import api from "../services/api.js";

const init = async () => {
    const { ok: isLogged } = await Auth.me()

    if (isLogged) {
        loading.stop();
    }

    const formEl = document.getElementById('todo-create-form');

    new Form(formEl, {
        'description': (value) => {
            if (value.length > 200) {
                return 'Слишком длинное описание. Постарайтесь уложиться в не более чем 200 символов.';
            }

            return false;
        }
    }, async (values) => {
        await createTodo(values);
        location.todos();
    })
}

async function createTodo(values) {
    const description = values.description;
    let res = await api("/todo", {
        body: JSON.stringify({description: description}),
        method: 'POST'});
    console.log(res);   
}

if (document.readyState === 'loading') {
    document.addEventListener("DOMContentLoaded", init);
} else {
    init();
}
