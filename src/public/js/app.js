let currentUserId = null;
let cart = [];

// Función para renderizar productos
const renderProducts = async () => {
    const container = document.getElementById('productsContainer');
    try {
        const response = await fetch('/api/v1/product');
        const products = await response.json();
        
        container.innerHTML = products
            .filter(product => product.isAvailable)
            .map(product => `
                <div class="product-card">
                    <img src="${product.img}" alt="${product.name}">
                    <h3>${product.name}</h3>
                    <p>Precio: $${product.price}</p>
                    <button onclick="addToCart('${product._id}', '${product.name}', ${product.price})">
                        Agregar al Carrito
                    </button>
                </div>
            `).join('');
    } catch (error) {
        console.error('Error loading products:', error);
    }
};

// Funcionalidad del Carrito
const addToCart = (productId, productName, price) => {
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            id: productId,
            name: productName,
            price: price,
            quantity: 1
        });
    }
    
    updateCartDisplay();
};

const updateCartDisplay = () => {
    const cartItems = document.getElementById('cartItems');
    const totalAmount = document.getElementById('totalAmount');
    let total = 0;
    
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <span>${item.name}</span>
            <div>
                <button onclick="adjustQuantity('${item.id}', -1)">-</button>
                <span>${item.quantity}</span>
                <button onclick="adjustQuantity('${item.id}', 1)">+</button>
                <span>$${item.price * item.quantity}</span>
            </div>
        </div>
    `).join('');
    
    total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    totalAmount.textContent = total;
    
    // Habilitar botón de pago solo si hay usuario válido y productos
    document.getElementById('checkoutBtn').disabled = !currentUserId || cart.length === 0;
};

const adjustQuantity = (productId, change) => {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            cart = cart.filter(i => i.id !== productId);
        }
        updateCartDisplay();
    }
};

// Función para procesar el pago
const processPayment = async () => {
    if (!currentUserId || cart.length === 0) return;
    
    try {
        // Obtener datos del usuario
        const userResponse = await fetch(`/api/v1/user/id/${currentUserId}`);
        const user = await userResponse.json();
        
        // Mostrar modal
        const modal = document.getElementById('checkoutModal');
        modal.style.display = 'block'; // Cambiar a 'flex' para mejor compatibilidad
        
        // Llenar información del usuario
        document.getElementById('modalUserInfo').innerHTML = `
            <p><strong>Nombre:</strong> ${user[0].firstName} ${user[0].lastName}</p>
            <p><strong>Documento:</strong> ${user[0].id}</p>
        `;
        
        // Llenar información del carrito
        document.getElementById('modalCartItems').innerHTML = cart.map(item => `
            <div class="cart-item">
                <p><strong>${item.name}</strong></p>
                <p>Cantidad: ${item.quantity} | Total: $${(item.price * item.quantity).toFixed(2)}</p>
            </div>
        `).join('');
        
        document.getElementById('modalTotal').textContent = 
            cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2);
            
    } catch (error) {
        console.error('Error:', error);
        alert('Error al mostrar el resumen de compra');
    }
};

// Agregar este código JUSTO DESPUÉS de la definición de processPayment
const setupModal = () => {
    // Cerrar modal con botón X
    document.querySelector('.close').addEventListener('click', () => {
        document.getElementById('checkoutModal').style.display = 'none';
    });

    // Cerrar modal haciendo click fuera
    window.addEventListener('click', (event) => {
        const modal = document.getElementById('checkoutModal');
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Confirmar compra
    document.getElementById('confirmCheckout').addEventListener('click', async () => {
        try {
            const response = await fetch('/api/v1/sales/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: currentUserId,
                    products: cart,
                    total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
                    date: new Date().toISOString()
                })
            });
            
            if (response.ok) {
                document.getElementById('checkoutModal').style.display = 'none';
                clearAll();
                alert('¡Compra finalizada con éxito!');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al procesar la compra');
        }
    });
};
// Función para limpiar todo
const clearAll = () => {
    cart = [];
    currentUserId = null;
    document.getElementById('resultado').innerHTML = '';
    document.getElementById('cedula').value = '';
    document.getElementById('btnLimpiar').style.display = 'none';
    updateCartDisplay();
};

// Event Listeners
document.addEventListener('DOMContentLoaded', renderProducts);
document.getElementById('checkoutBtn').addEventListener('click', processPayment);
document.getElementById('btnLimpiar').addEventListener('click', clearAll);

const checkForUpdates = async () => {
    try {
        const response = await fetch('/api/v1/user/last-access');
        const data = await response.json();
        
        // Verificar si el ID es nuevo y válido
        if (data.userId && data.userId !== currentUserId) {
            currentUserId = data.userId;
            await performSearch(data.userId);
            
            // Resetear después de 2 segundos
            setTimeout(() => {
                currentUserId = null;
                document.getElementById('resultado').innerHTML = '';
                document.getElementById('cedula').value = '';
            }, 2000);
        }

        
    } catch(error) {
        console.error('Error checking updates:', error);
    }
};

const performSearch = async (userId) => {
    const resultadoDiv = document.getElementById('resultado');
    
    try {
        const response = await fetch(`/api/v1/user/id/${userId}`);
        const user = await response.json();
        
        if (user.length === 0) {
            resultadoDiv.innerHTML = 'Usuario no encontrado';
            resultadoDiv.style.backgroundColor = '#ffebee';
            resultadoDiv.style.color = '#b71c1c';
            return;
        }
        
        resultadoDiv.innerHTML = `
            ${user[0].firstName} ${user[0].lastName}<br>
            Su documento es: ${user[0].id}
        `;
        resultadoDiv.style.backgroundColor = '#e8f5e9';
        resultadoDiv.style.color = '#2e7d32';

        // Mostrar botón al tener resultados
        resultadoDiv.innerHTML = `
        ${user[0].firstName} ${user[0].lastName}<br>
        Su documento es: ${user[0].id}
        `;

        document.getElementById('btnLimpiar').style.display = 'block';

        // Manejar evento del botón
        document.getElementById('btnLimpiar').addEventListener('click', async () => {
            try {
                await fetch('/api/v1/user/clear-access', { method: 'POST' });
                document.getElementById('resultado').innerHTML = '';
                document.getElementById('resultado').style.backgroundColor = '';
                document.getElementById('resultado').style.color = '';
                document.getElementById('btnLimpiar').style.display = 'none';
                document.getElementById('cedula').value = '';
            } catch (error) {
                console.error('Error al limpiar:', error);
            }
});
        
    } catch (error) {
        resultadoDiv.innerHTML = 'Error en la consulta';
        resultadoDiv.style.backgroundColor = '#ffebee';
        resultadoDiv.style.color = '#b71c1c';
    }
};

document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    setupModal(); // Inicializar eventos del modal
});

// Configurar polling cada segundo
setInterval(checkForUpdates, 1000);

document.getElementById('consultaForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const cedula = document.getElementById('cedula').value;
    await performSearch(cedula);
});
