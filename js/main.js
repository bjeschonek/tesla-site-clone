// DOM Elements
const topBar = document.querySelector('#top-bar');
const exteriorColorSection = document.querySelector('#exterior-buttons');
const interiorColorSection = document.querySelector('#interior-buttons');
const exteriorImage = document.querySelector('#exterior-image');
const interiorImage = document.querySelector('#interior-image');
const wheelButtonsSection = document.querySelector('#wheel-buttons');
const performanceBtn = document.querySelector('#performance-btn');
const totalPriceElement = document.querySelector('#total-price');
const fullSelfDrivingCheckbox = document.querySelector('#full-self-driving-checkbox');
const accessoryCheckboxes = document.querySelectorAll('.accessory-form-checkbox');
const downPaymentElement = document.querySelector('#down-payment');
const monthlyPaymentElement = document.querySelector('#monthly-payment');

// Pricing
const basePrice = 52490;
let currentPrice = basePrice;

// Options
let selectedColor = 'Stealth Grey';
const selectedOptions = {
    'Performance Wheels': false,
    'Performance Package': false,
    'Full Self-Driving': false
};

// Price Map
const pricing = {
    'Performance Wheels': 2500,
    'Performance Package': 5000,
    'Full Self-Driving': 8500,
    'Accessories': {
        'Center Console Trays': 35,
        'Sunshade': 105,
        'All-Weather Interior Liners': 225
    }
};

// Update total price
const updateTotalPrice = () => {
    // Reset current price to base price
    currentPrice = basePrice;

    // peformance wheel pricing
    if (selectedOptions['Performance Wheels']) {
        currentPrice += pricing['Performance Wheels'];
    }

    // performance package pricing
    if (selectedOptions['Performance Package']) {
        currentPrice += pricing['Performance Package'];
    }

    // full self driving pricing
    if (selectedOptions['Full Self-Driving']) {
        currentPrice += pricing['Full Self-Driving'];
    }

    // accessory checkboxes
    accessoryCheckboxes.forEach((checkbox) => {
        // extract accessory label
        const accessoryLabel = checkbox.closest('label').querySelector('span').textContent.trim();

        const accessoryPrice = pricing['Accessories'][accessoryLabel];

        // add to current price if accessory is selected
        if (checkbox.checked) {
            currentPrice += accessoryPrice;
        }
        
    });

    // update total price
    totalPriceElement.textContent = `$${currentPrice.toLocaleString()}`;

    updatePaymentBreakdown();
}

// Update payment based on price
const updatePaymentBreakdown = () => {
    // calculate down payment
    const downPayment = currentPrice * 0.10;
    downPaymentElement.textContent = `$${downPayment.toLocaleString()}`;

    // calculate loan details assuming 60mos and 3% rate
    const loanTerm = 60;
    const interestRate = 0.03;

    const loanAmount = currentPrice - downPayment;

    // monthly payment calculation
    const monthlyInterestRate = interestRate / 12;

    const monthlyPayment = (loanAmount * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, loanTerm)))
         / (Math.pow(1 + monthlyInterestRate, loanTerm) - 1);

    monthlyPaymentElement.textContent = `$${monthlyPayment.toFixed(2).toLocaleString()}`;
}

// Top Bar Scroll
const handleScroll = () => {
    const atTop = window.ScrollY === 0;
    topBar.classList.toggle('visible-bar', atTop);
    topBar.classList.toggle('hidden-bar', !atTop);
}

// Image mapping
const exteriorImages = {
    'Stealth Grey': './images/exteriors/model-y-stealth-grey.jpg',
    'Pearl White': './images/exteriors/model-y-pearl-white.jpg',
    'Deep Blue Metallic': './images/exteriors/model-y-deep-blue-metallic.jpg',
    'Solid Black': './images/exteriors/model-y-solid-black.jpg',
    'Ultra Red': './images/exteriors/model-y-ultra-red.jpg',
    'Quicksilver': './images/exteriors/model-y-quicksilver.jpg'
};

const interiorImages = {
    'Dark': './images/interiors/model-y-interior-dark.jpg',
    'Light': './images/interiors/model-y-interior-light.jpg'
};

// Handle color selection
const handleColorButtonClick = (e) => {
    let button;

    if (e.target.tagName === 'IMG') {
        button = e.target.closest('button');
    } else if (e.target.tagName === 'BUTTON') {
        button = e.target;
    }

    if (button) {
        const buttons = e.currentTarget.querySelectorAll('button');
        buttons.forEach((btn) => btn.classList.remove('btn-selected'));
        button.classList.add('btn-selected');
    }

    // change exterior image
    if (e.currentTarget === exteriorColorSection) {
        selectedColor = button.querySelector('img').alt;
        updateExteriorImage();
    }

    // change interior image
    if (e.currentTarget === interiorColorSection) {
        const color = button.querySelector('img').alt;
        interiorImage.src = interiorImages[color];
    }

}

// Update exterior image by color/wheels
const updateExteriorImage = () => {
    const performanceSuffix = selectedOptions['Performance Wheels'] ? '-performance' : '';
    const colorKey = selectedColor in exteriorImages ? selectedColor : 'Stealth Grey';
    exteriorImage.src = exteriorImages[colorKey].replace('.jpg', `${performanceSuffix}.jpg`);
}

// Handle wheel selection
const handleWheelButtonClick = (e) => {
    if (e.target.tagName === 'BUTTON') {
        const buttons = document.querySelectorAll('#wheel-buttons button');
        buttons.forEach((btn) => btn.classList.remove('bg-gray-700', 'text-white'));

        // add styles to clicked button
        e.target.classList.add('bg-gray-700', 'text-white');

        selectedOptions['Performance Wheels'] = e.target.textContent.includes('Performance');

        updateExteriorImage();
        updateTotalPrice();
    }
}

// Performance package selection
const handlePerformanceButtonClick = () => {
    const isSelected = performanceBtn.classList.toggle('bg-gray-700');
    performanceBtn.classList.toggle('text-white');

    // update selected options
    selectedOptions['Performance Package'] = isSelected;

    updateTotalPrice();
}

// Full self driving selection
const fullSelfDrivingChange = () => {
    selectedOptions['Full Self-Driving'] = fullSelfDrivingCheckbox.checked;
    updateTotalPrice();
}

// Handle accessory checkbox listeners
accessoryCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener('change', () => updateTotalPrice());
});

// Initial update to total price
updateTotalPrice();

// Event Listeners
window.addEventListener('scroll', () => requestAnimationFrame(handleScroll));
exteriorColorSection.addEventListener('click', handleColorButtonClick);
interiorColorSection.addEventListener('click', handleColorButtonClick);
wheelButtonsSection.addEventListener('click', handleWheelButtonClick);
performanceBtn.addEventListener('click', handlePerformanceButtonClick);
fullSelfDrivingCheckbox.addEventListener('change', fullSelfDrivingChange);