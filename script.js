let productsData = {
    "products": []
};
let cart = [];

const elements = {
    productsGrid: document.getElementById('products-grid'),
    cartItems: document.getElementById('cart-items'),
    cartTotal: document.getElementById('cart-total'),
    checkoutBtn: document.getElementById('checkout-btn')
};

async function loadProducts() {
    try {
        const response = await fetch('data.json');
        productsData = await response.json();
        renderProducts();
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        productsData = {
            "products": [
                {
                    "id": 1,
                    "name": "Smartphone",
                    "price": 899.99,
                    "description": "Smartphone com tela de 6.5 polegadas, 128GB de armazenamento e câmera tripla.",
                    "image": "./img/smartphone.jpg"
                },
                {
                    "id": 2,
                    "name": "Notebook",
                    "price": 2499.99,
                    "description": "Notebook com processador i7, 16GB RAM, SSD 512GB e placa de vídeo dedicada.",
                    "image": "./img/notebook.webp"
                },
                {
                    "id": 3,
                    "name": "Fone",
                    "price": 199.99,
                    "description": "Fone de ouvido sem fio com cancelamento de ruído e bateria de 20 horas.",
                    "image": "./img/fone.webp"
                },
                {
                    "id": 4,
                    "name": "Smartwatch",
                    "price": 399.99,
                    "description": "Relógio inteligente com monitor de batimento cardíaco e GPS integrado.",
                    "image": "./img/smartwatch.png"
                }
            ]
        };
        renderProducts();
    }
}

function renderProducts() {
    elements.productsGrid.innerHTML = '';
    
    productsData.products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-price">R$ ${product.price.toFixed(2)}</p>
                <p class="product-description">${product.description}</p>
                <button class="btn-primary add-to-cart" data-product-id="${product.id}">Adicionar ao Carrinho</button>
            </div>
        `;
        elements.productsGrid.appendChild(productCard);
    });
}

function addToCart(productId) {
    const product = productsData.products.find(p => p.id === productId);
    
    if (!product) {
        console.error('Produto não encontrado:', productId);
        return;
    }
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    saveCart();
    renderCart();
    alert(`${product.name} adicionado ao carrinho!`);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    renderCart();
}

function updateQuantity(productId, newQuantity) {
    if (newQuantity < 1) {
        removeFromCart(productId);
        return;
    }
    
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = newQuantity;
        saveCart();
        renderCart();
    }
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

function renderCart() {
    elements.cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        elements.cartItems.innerHTML = '<p class="empty-cart">Seu carrinho está vazio.</p>';
        elements.cartTotal.textContent = '0,00';
        return;
    }
    
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <p>R$ ${item.price.toFixed(2)}</p>
            </div>
            <div class="cart-item-controls">
                <button class="quantity-btn decrease" data-product-id="${item.id}">-</button>
                <span class="quantity">${item.quantity}</span>
                <button class="quantity-btn increase" data-product-id="${item.id}">+</button>
                <button class="remove-btn" data-product-id="${item.id}">Remover</button>
            </div>
            <div class="cart-item-total">
                R$ ${itemTotal.toFixed(2)}
            </div>
        `;
        
        elements.cartItems.appendChild(cartItem);
    });
    
    elements.cartTotal.textContent = total.toFixed(2);
}

function showTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });
    
    document.getElementById(tabName).classList.add('active');
    
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    
    if (tabName === 'carrinho') {
        renderCart();
    }
}

function checkout() {
    if (cart.length === 0) {
        alert('Seu carrinho está vazio!');
        return;
    }
    
    alert('Compra finalizada com sucesso! Obrigado pela preferência.');
    cart = [];
    saveCart();
    renderCart();
    showTab('catalogo');
}

function setupEventDelegation() {
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('add-to-cart')) {
            const productId = parseInt(event.target.getAttribute('data-product-id'));
            addToCart(productId);
            return;
        }
        
        if (event.target.classList.contains('increase')) {
            const productId = parseInt(event.target.getAttribute('data-product-id'));
            const item = cart.find(item => item.id === productId);
            if (item) {
                updateQuantity(productId, item.quantity + 1);
            }
            return;
        }
        
        if (event.target.classList.contains('decrease')) {
            const productId = parseInt(event.target.getAttribute('data-product-id'));
            const item = cart.find(item => item.id === productId);
            if (item) {
                updateQuantity(productId, item.quantity - 1);
            }
            return;
        }
        
        if (event.target.classList.contains('remove-btn')) {
            const productId = parseInt(event.target.getAttribute('data-product-id'));
            removeFromCart(productId);
            return;
        }
        
        if (event.target.classList.contains('tab-button')) {
            const tabName = event.target.getAttribute('data-tab');
            showTab(tabName);
            return;
        }
        
        if (event.target.id === 'checkout-btn') {
            checkout();
            return;
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    loadCart();
    setupEventDelegation();
    showTab('catalogo');
});