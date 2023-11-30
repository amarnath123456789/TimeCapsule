const dropArea = document.getElementById('drop-area');
const releaseTimeInput = document.getElementById('release-time');
const walletAddressInput = document.getElementById('wallet-address');
const encryptButton = document.getElementById('encrypt-btn');
const dateTimeString = releaseTimeInput.value;
let fileData = null; // This will hold the file data

// Add event listeners for the drag and drop functionality
dropArea.addEventListener('dragover', (event) => {
    event.stopPropagation();
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy'; // Visual feedback to indicate copy
});

dropArea.addEventListener('drop', (event) => {
    event.stopPropagation();
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files.length) {
        readFile(files[0]);
    }
});

// Read the file and store its data
function readFile(file) {
    const reader = new FileReader();
    reader.onload = function(event) {
        fileData = event.target.result;
        dropArea.textContent = `File ready for encryption: ${file.name}`;
    };
    reader.readAsDataURL(file); // Read the file as Data URL (base64)
}

// Handle the encryption process when the button is clicked
encryptButton.addEventListener('click', () => {
    if (!fileData) {
        alert('Please drop a file to encrypt.');
        return;
    }
    if (!releaseTimeInput.value) {
        alert('Please select a release time.');
        return;
    }
    if (!walletAddressInput.value) {
        alert('Please enter a wallet address.');
        return;
    }

    const passphrase = generatePassphrase();
    //const encryptedData = CryptoJS.AES.encrypt(fileData, passphrase).toString();
    const unixTimestamp = convertToUnixTimestamp(releaseTimeInput.value);
    //const unixTimestamp = convertToUnixTimestamp(dateTimeString);
    const encryptedData = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(fileData), passphrase).toString();

    // Display the results in the HTML
    document.getElementById('output-wallet-address').textContent = walletAddressInput.value;
    document.getElementById('output-decryption-key').textContent = passphrase;
    document.getElementById('output-encryption-hash').textContent = encryptedData;
    //document.getElementById('output-release-time').textContent = new Date(unixTimestamp * 1000).toLocaleString();
    document.getElementById('output-release-time').textContent = unixTimestamp;
    


    // Reset the drag area text
    dropArea.textContent = 'Drag & Drop Files Here';
});

// Generate a random passphrase for encryption
function generatePassphrase() {
    return CryptoJS.lib.WordArray.random(128 / 8).toString();
}

// Convert the selected date and time to a Unix timestamp
function convertToUnixTimestamp(dateTimeString) {
    return Math.floor(new Date(dateTimeString).getTime() / 1000);
}