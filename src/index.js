class PizzaMaker {
    constructor() {
        this.pizza = new Pizza();
    }

    addTopping(topping) {
        topping.addToPizza(this.pizza);
    }

    removeTopping(topping) {
        topping.removeFromPizza();
    }

    getToppings() {
        return this.pizza.toppings;
    }

    getSize() {
        return this.pizza.size;
    }

    getStuffing() {
        return this.pizza.stuffing;
    }

    calculatePrice() {
        return this.pizza.getPrice();
    }

    calculateCalories() {
        return this.pizza.getCalory();
    }
}

class Pizza {
    constructor() {
        this.toppings = [];
    }

    getPrice() {
        return 0;
    }

    getCalory() {
        return 0;
    }
}

class MargaritaPizza extends Pizza {
    constructor() {
        super();
        this.stuffing = "Маргарита";
    }

    getPrice() {
        return super.getPrice() + 500; 
    }

    getCalory() {
        return super.getCalory() + 300;
    }
}

class PepperoniPizza extends Pizza {
    constructor() {
        super();
        this.stuffing = "Пепперони";
    }

    getPrice() {
        return super.getPrice() + 800;
    }

    getCalory() {
        return super.getCalory() + 400;
    }
}

class BavarskayaPizza extends Pizza {
    constructor() {
        super();
        this.stuffing = "Баварская";
    }

    getPrice() {
        return super.getPrice() + 700;
    }

    getCalory() {
        return super.getCalory() + 450;
    }
}

class SizedPizza extends Pizza {
    constructor(pizza) {
        super();
        this.pizza = pizza;
    }

    getPrice() {
        let toppingPrice = 0;
        for (let topping of this.toppings) {
            toppingPrice += topping.getPrice(this);
        }
        return this.pizza.getPrice() + toppingPrice;
    }

    getCalory() {
        let toppingCalory = 0;
        for (let topping of this.toppings) {
            toppingCalory += topping.calory;
        }
        return this.pizza.getCalory() + toppingCalory;
    }
}

class BigPizza extends SizedPizza {
    constructor(pzza) {
        super(pzza);
        this.size = "Большая";
    }

    getPrice() {
        return super.getPrice() + 200;
    }

    getCalory() {
        return super.getCalory() + 200;
    }
}

class SmallPizza extends SizedPizza {
    constructor(pzza) {
        super(pzza);
        this.size = "Маленькая";
    }

    getPrice() {
        return super.getPrice() + 100;
    }

    getCalory() {
        return super.getCalory() + 100;
    }
}

class PizzaTopping {
    constructor(name, price, calory) {
        this.name = name;
        this.#price = price;
        this.calory = calory;
    }

    #price = 0;

    addToPizza(pizza) {
        if (!pizza.toppings.includes(this)) {
            pizza.toppings.push(this);
        }
    }

    /*removeFromPizza() {
        let index = this.pizza.toppings.indexOf(this);
        if (index > -1) {
            this.pizza.toppings.splice(index, 1);
        }
    }*/

    getPrice(pizza) {
        if (pizza.size == "Большая") {
            return this.#price * 2;
        }
        return this.#price;
    }
}




let pizzaMaker;

function startPizzaMaker() {
    const node = document.getElementsByClassName("main-container")[0];
    node.innerHTML = `
    <h2>First, choose which pizza would you like to have</h2>
    <p>To select the pizza, click with your mouse on it.</p>
    <div class="item-container">
    </div>
    <button class="next-phase-select-size" onclick="nextPhaseSelectSize()">Далее</button>`;
    const itemContainer = document.getElementsByClassName("item-container")[0];
    const nextPhaseButton = document.getElementsByClassName("next-phase-select-size")[0];
    nextPhaseButton.disabled = true;

    pizzaMaker = new PizzaMaker();

    function createPizzaDiv(pizza, id_name) {
        const pizzaDiv = document.createElement("div");
        let pizzaInstance = pizza();
        pizzaDiv.className = "pizza";
        pizzaDiv.id = id_name;
        pizzaDiv.onclick = function () {
            pizzaMaker.pizza = pizzaInstance;
            for (let childNode of itemContainer.getElementsByTagName("div")) {
                childNode.style.backgroundColor = "";
            }
            pizzaDiv.style.backgroundColor = "#777777";
            nextPhaseButton.disabled = false;
        }
        pizzaDiv.innerText = pizzaInstance.stuffing + "\nКкал: " + pizzaInstance.getCalory() + "\nСтоимость: " + pizzaInstance.getPrice() + " руб.";
        itemContainer.appendChild(pizzaDiv);
    }

    createPizzaDiv(() => new MargaritaPizza(), "margarita");
    createPizzaDiv(() => new PepperoniPizza(), "pepperoni");
    createPizzaDiv(() => new BavarskayaPizza(), "bavarskaya");
}

function nextPhaseSelectSize() {
    const node = document.getElementsByClassName("main-container")[0];
    node.innerHTML = `
    <h2>Second, select the size of your pizza</h2>
    <p>Make your happiness bigger!</p>
    <form name="size-select" onsubmit="return summarizePhaseSelectSize();">
        <label><input type="radio" id="big" name="size" value="big" checked />Большая (200 руб., 200 ккал)</label>
        <label><input type="radio" id="small" name="size" value="small" />Маленькая (100 руб., 100 ккал)</label>
        <input type="submit" value="Далее" />
    </form>`;
}

function summarizePhaseSelectSize() {
    let inputs = document.getElementsByTagName("input");
    for (const input of inputs) {
        if (input.type == "radio") {
            if (input.checked) {
                if (input.value == "big") {
                    const bigPizza = new BigPizza(pizzaMaker.pizza);
                    pizzaMaker.pizza = bigPizza;
                }
                else if (input.value == "small") {
                    const smallPizza = new SmallPizza(pizzaMaker.pizza);
                    pizzaMaker.pizza = smallPizza;
                }
                nextPhaseAddToppings();
                return false;
            }
        }
    }
    throw "No radio buttons selected phase 2";
}

let inputTable;
function nextPhaseAddToppings() {
    const node = document.getElementsByClassName("main-container")[0];
    node.innerHTML = `
    <h2>Third, select toppings whichever you like</h2>
    <p>Add more taste to your pizza!</p>
    <form name="topping-select" onsubmit="return summarizePhaseAddToppings();">
    </form>`;

    const mocarella = new PizzaTopping("Сливочная моцарелла", 50, 22);
    const cheese = new PizzaTopping("Сырный борт", 150, 50);
    const cheder = new PizzaTopping("Чедер и пармезан", 150, 50);

    const form = document.getElementsByName("topping-select")[0];

    inputTable = {};

    function addToppingAsCheckbox(topping) {
        form.innerHTML += `<label><input type="checkbox" name="${topping.name}" />
        ${topping.name} (+${topping.getPrice(pizzaMaker.pizza)} рублей, +${topping.calory} ккал)
        </label>`;
        const input = document.getElementsByName(topping.name)[0];
        inputTable[input.name] = topping;
    }

    addToppingAsCheckbox(mocarella);
    addToppingAsCheckbox(cheese);
    addToppingAsCheckbox(cheder);

    form.innerHTML += `<input type="submit" value="Закончить" />`;
}

function summarizePhaseAddToppings() {
    try {
        let inputs = document.getElementsByTagName("input");
        for (const input of inputs) {
            if (input.type == "checkbox") {
                if (input.checked) {
                    const topping = inputTable[input.name];
                    pizzaMaker.addTopping(topping);
                }
            }
        }
        nextPhaseFinale();
    }
    catch(e) { alert(e); }
    return false;
}

function nextPhaseFinale() {
    const node = document.getElementsByClassName("main-container")[0];

    const calory = pizzaMaker.calculateCalories();
    const price = pizzaMaker.calculatePrice();

    node.innerHTML = `
    <h1>Congratulations! Your pizza is ready</h1>
    <p>Summarized:</p>
    <ul>
        <li>Калории: ${calory} ккал</li>
        <li>Цена: ${price} руб.</li>
    </ul>
    <button class="restart-button" onclick="startPizzaMaker()">Попробовать ещё раз</button>`;
}