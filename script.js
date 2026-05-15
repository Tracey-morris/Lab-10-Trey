// Initialize click counter
let clickCount = 0;

// Get references to DOM elements
const clickButton = document.getElementById('clickButton');
const outputDiv = document.getElementById('output');

// Add event listener to button
clickButton.addEventListener('click', function() {
    clickCount++;
    updateOutput();
    console.log(`Button clicked ${clickCount} times`);
});

// Function to update the output display
function updateOutput() {
    let message = '';
    
    if (clickCount === 1) {
        message = '👋 You clicked once!';
    } else if (clickCount < 5) {
        message = `🎯 You've clicked ${clickCount} times!`;
    } else if (clickCount < 10) {
        message = `⚡ Getting warmed up! ${clickCount} clicks so far!`;
    } else if (clickCount < 20) {
        message = `🚀 Wow! You're at ${clickCount} clicks!`;
    } else if (clickCount < 50) {
        message = `🎉 Impressive! ${clickCount} clicks and counting!`;
    } else {
        message = `🏆 Champion! You've reached ${clickCount} clicks!`;
    }
    
    outputDiv.textContent = message;
}

// Log that the script has loaded
console.log('Trey app script loaded successfully');
