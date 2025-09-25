// Menu data
const menu = {
    appetizer: [
        {name: "Deviled Eggs", desc: "Yummy eggs boiled and cooked with love", price: 9.00, img: "../images/deviled-eggs.jpg"},
        {name: "Mini Sausage Roll", desc: "Juicy sausage wrapped in puff pastry", price: 10.00, img: "../images/mini-sausage-roll.jpg"}
    ],
    mainCourse: [
        {name: "Baked Salmon", desc: "Flaky and flavorful salmon", price: 12.00, img: "../images/baked-salmon.jpg"},
        {name: "Steak", desc: "Savory and rich steak", price: 12.00, img: "../images/steak.jpg"}
    ],
    beverage: [
        {name: "Coffee", desc: "Vibrant coffee with light floral aroma", price: 5.00, img: "../images/coffee.jpg"},
        {name: "Ice Lemon Tea", desc: "Refreshing and tangy lemon tea", price: 4.00, img: "../images/lemon-iced-tea.jpg"}
    ],
    dessert: [
        {name: "Tiramisu", desc: "Rich coffee aroma with creamy lady fingers", price: 10.00, img: "../images/tiramisu.jpg"},
        {name: "Oreo Ice Cream", desc: "Creme-flavored frozen dairy dessert", price: 10.00, img: "../images/oreo-ice-cream.jpg"}
    ]
}

let order = [];

// Attach event listeners for each category tab
document.querySelectorAll(".category button").forEach(button => {
  button.addEventListener("click", () => {
    const category = button.dataset.category;
    showCategory(category);
    setActiveButton(button);
  });
});

// Attach event listener for "Clear Order" button
document.getElementById("clear-btn").addEventListener("click", clearOrder);

// Display food cards based on the category selected
function showCategory(category) {
    const container = document.getElementById("card-container");
    const title = document.getElementById("category-title");
    
    // Reset container
    container.innerHTML = "";

    // Capitalize the first letter, then combining with the rest
    title.textContent = category.charAt(0).toUpperCase() + category.slice(1);

    // Create a card for each menu item
    menu[category].forEach(item => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
            <img src="${item.img}" alt=${item.name}">
            <p class="food-name">${item.name}</p>
            <p class="food-desc">${item.desc}</p>
            <div class="price-btn">
                <p class="food-price">RM ${item.price.toFixed(2)}</p>
                <button class="add-btn" data-name="${item.name}" data-price="${item.price}">+</button>
            </div>
        `;
        container.appendChild(card);

        // Attach event listener for "Add to Order" button
        const addBtn = card.querySelector(".add-btn");
        addBtn.addEventListener("click", () => {
            const name = addBtn.dataset.name;
            const price = parseFloat(addBtn.dataset.price);
            addToOrder(name, price);
        });
    });
}

// Highlight button when it is selected
function setActiveButton(clickedBtn) {
    // Remove active status of all buttons by default
    document.querySelectorAll(".category button").forEach(btn => btn.classList.remove("active"));
    // Apply active status to selected button
    clickedBtn.classList.add("active");
}


// Add a menu item to the order list
function addToOrder(name, price) {
    // Determine if there are existing orders which are the same
    let existing = order.find(item => item.name === name);

    if (existing) {
        // Increment quantity if order exists
        existing.quantity += 1;
    } else {
        order.push({ name, price, quantity: 1 });
    }

    updateOrder();
}

// Update order list
function updateOrder() {
    const list = document.getElementById("order-list");
    list.innerHTML = ""; // Reset order list

    let subtotal = 0;

    // Create a row for each order item
    order.forEach((item, index) => {
        const row = document.createElement("div");
        row.className = "order-row";
        row.innerHTML = `
            <span class="order-name">${item.name}</span>
            <input type="number" class="order-qty" value="${item.quantity}" min="1" data-index="${index}">
            <span class="order-price">RM ${(item.price * item.quantity).toFixed(2)}</span>
            <button class="delete-btn" data-index="${index}">x</button>
        `;
        list.appendChild(row);

        subtotal += item.price * item.quantity;
    });

    // Update totals
    document.getElementById("subtotal").textContent = `RM ${subtotal.toFixed(2)}`;
    document.getElementById("tax").textContent = `RM ${(subtotal * 0.06).toFixed(2)}`;
    document.getElementById("total").textContent = `RM ${(subtotal * 1.06).toFixed(2)}`;

    // Attach event listeners for quantity inputs
    document.querySelectorAll(".order-qty").forEach(input => {
        input.addEventListener("change", (e) => {
            const index = e.target.dataset.index;
            
            order[index].quantity = getValidQty(e.target.value);
            updateOrder(); // Re-render after change
        });
    });

    // Attach event listeners for delete button
    document.querySelectorAll(".delete-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const index = e.target.dataset.index;
            deleteOrder(index);
            updateOrder(); // Re-render after change
        });
    });
}

// Ensure the quantity input is always valid
function getValidQty(qty) {
    // If parseInt() returns an invalid value, quantity reset to 1
    quantity = parseInt(qty) || 1;

    // If quantity input is negative or 0, quantity reset to 1
    if (quantity<=0) {
        return 1;
    }

    return quantity;
}


//Remove order at the specified index
function deleteOrder(index) {
    order.splice(index, 1);
}

function clearOrder() {
  order = [];
  updateOrder();
}

// Load "Appetizer" category by default
showCategory("appetizer");