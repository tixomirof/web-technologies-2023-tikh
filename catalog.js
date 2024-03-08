import { Catalog } from "./src/components/catalog.js";

const renderPostItem = item => `
    <a  
        href="/posts.html?id=${item.id}"
        class="post-item"
    >
        <span class="post-item__title">
            ${item.title}
        </span>

        <span class="post-item__body">
            ${item.body}
        </span>
    </a>
`

const getPostItems = async function({ limit, page }) {
    try {
        let results = await fetch(`https://jsonplaceholder.typicode.com/posts?_limit=${limit}&_page=${page}`);
        const total = +results.headers.get('x-total-count');
        const items = await results.json();
        return { items, total };
    }
    catch (e) {
        console.error("Could not load post items. ERROR message: " + e);
    }
}

const renderPhotoItem = item => `
    <a  
        href="photos/${item.id}"
        class="photo-item"
    >
        <span class="photo-item__title">
            ${item.title}
        </span>

        <img 
            src=${item.url}
            class="photo-item__image"
        >
    </a>
`

const getPhotoItems = async function({ limit, page }) {
    try {
        let results = await fetch(`https://jsonplaceholder.typicode.com/photos?_limit=${limit}&_page=${page}`);
        const total = +results.headers.get('x-total-count');
        const items = await results.json();
        return { items, total };
    }
    catch (e) {
        console.error("Could not load photo items. ERROR message: " + e);
    }
}

const init = () => {
    const catalog = document.getElementById('catalog')
    new Catalog(catalog, { 
        renderItem: renderPostItem,
        getItems: getPostItems
     }).init()
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init)
} else {
    init()
}