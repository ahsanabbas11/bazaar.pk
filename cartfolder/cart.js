document.addEventListener('DOMContentLoaded', function() {
    // Cart state
    let cart = {
        items: [],
        couponApplied: false,
        couponDiscount: 0
    };

    // Available coupon codes
    const coupons = {
        'SAVE20': 20,
        'SAVE10': 10
    };

    // Initialize cart
    function initCart() {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            cart = JSON.parse(savedCart);
            updateCartDisplay();
        }
        attachEventListeners();
    }

    // Event Listeners
    function attachEventListeners() {
        // Quantity controls
        document.querySelectorAll('.increase-qty').forEach(btn => {
            btn.addEventListener('click', e => updateQuantity(e, 1));
        });

        document.querySelectorAll('.decrease-qty').forEach(btn => {
            btn.addEventListener('click', e => updateQuantity(e, -1));
        });

        // Remove items
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', removeItem);
        });

        // Coupon code
        document.getElementById('applyCoupon').addEventListener('click', applyCoupon);

        // Checkout
        document.getElementById('checkoutBtn').addEventListener('click', processCheckout);
    }

    // Update quantity
    function updateQuantity(event, change) {
        const input = event.target.parentNode.querySelector('.quantity-input');
        let newValue = parseInt(input.value) + change;
        if (newValue < 1) newValue = 1;
        input.value = newValue;
        updateTotals();
    }

    // Remove item
    function removeItem(event) {
        const item = event.target.closest('.cart-item');
        item.remove();
        updateTotals();
        checkEmptyCart();
    }

    // Apply coupon
    function applyCoupon() {
        const code = document.getElementById('couponCode').value.toUpperCase();
        if (coupons[code]) {
            cart.couponApplied = true;
            cart.couponDiscount = coupons[code];
            document.getElementById('discountRow').style.display = 'flex';
            updateTotals();
            alert(`Coupon applied! ${cart.couponDiscount}% discount`);
        } else {
            alert('Invalid coupon code');
        }
    }

    // Update totals
    function updateTotals() {
        let subtotal = 0;
        document.querySelectorAll('.cart-item').forEach(item => {
            const price = parseFloat(item.dataset.price);
            const quantity = parseInt(item.querySelector('.quantity-input').value);
            subtotal += price * quantity;
        });

        const discount = cart.couponApplied ? (subtotal * cart.couponDiscount / 100) : 0;
        const shipping = subtotal > 0 ? 10 : 0;
        const total = subtotal - discount + shipping;

        document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
        document.getElementById('discount').textContent = `-$${discount.toFixed(2)}`;
        document.getElementById('shipping').textContent = `$${shipping.toFixed(2)}`;
        document.getElementById('total').textContent = `$${total.toFixed(2)}`;

        // Save cart state
        saveCart();
    }

    // Check for empty cart
    function checkEmptyCart() {
        const isEmpty = document.querySelectorAll('.cart-item').length === 0;
        document.getElementById('emptyCartMessage').classList.toggle('d-none', !isEmpty);
        document.querySelector('.order-summary').classList.toggle('d-none', isEmpty);
    }

    // Save cart to localStorage
    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    // Process checkout
    function processCheckout() {
        const total = document.getElementById('total').textContent;
        alert(`Processing checkout for ${total}`);
        // Add checkout logic here
    }

    // Initialize cart on page load
    initCart();
});
