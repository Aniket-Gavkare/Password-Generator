// Handle Slider Control and Display Password Length
let lengthDisplay = document.querySelector("[lengthDisplay]");
// console.log(lengthDisplay)
let inputSlider = document.querySelector("input[type=range]");
// console.log(slider)

function handleSlider() {
  inputSlider.value = passwordLength;
  lengthDisplay.innerText = passwordLength;
  // handle slider color

  const min = inputSlider.min;
  const max = inputSlider.max;

  inputSlider.style.backgroundSize =
    ((passwordLength - min) * 100) / (max - min) + "% 100%";
}

let passwordLength = 10;
handleSlider();

inputSlider.addEventListener("input", (event) => {
  passwordLength = event.target.value;
  handleSlider();
});

// Generate Random Letters and Number and Symbols
const symbol = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

function generateRandom(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// Random Lowercase Letter
function generateRandomLowercase() {
  return String.fromCharCode(generateRandom(97, 123));
}

// Random Lowercase Letter
function generateRandomUppercase() {
  return String.fromCharCode(generateRandom(65, 91));
}

// Random Number
function generateRandomNumber() {
  return generateRandom(1, 10);
}

// Generate Symbol
function generateRandomSymbol() {
  let index = generateRandom(0, symbol.length);
  return symbol[index];
}

// Strength Color Based on Password
let indicator = document.querySelector(".indicator");

// Set Indicator
function setIndicator(color) {
  indicator.style.backgroundColor = color;
  indicator.style.boxShadow = `0 0 12px 1px ${color}`;
}

// Default Indicator
setIndicator("#ccc");

const uppercase = document.querySelector("#uppercase");
const lowercase = document.querySelector("#lowercase");
const numbers = document.querySelector("#numbers");
const symbols = document.querySelector("#symbols");

function calcStrength() {
  let hasUpper = false;
  let hasLower = false;
  let hasNumber = false;
  let hasSymbol = false;

  if (uppercase.checked) hasUpper = true;
  if (lowercase.checked) hasLower = true;
  if (numbers.checked) hasNumber = true;
  if (symbols.checked) hasSymbol = true;

  if (hasUpper && hasLower && (hasNumber || hasSymbol) && passwordLength >= 8) {
    setIndicator("#0f0");
  } else if (
    (hasLower || hasUpper) &&
    (hasNumber || hasSymbol) &&
    passwordLength >= 6
  ) {
    setIndicator("#ff0");
  } else {
    setIndicator("#f00");
  }
}

// Copy Message
let copyMessage = document.querySelector("[copyMessage]");
let copyBtn = document.querySelector(".copyBtn");
let passwordDisplay = document.querySelector("input[passwordDisplay]");

async function copyContent() {
  try {
    if (passwordDisplay.value === "") {
      throw new Error("No content to copy");
    }

    await navigator.clipboard.writeText(passwordDisplay.value);
    copyMessage.innerText = "Copied";
  } catch (e) {
    copyMessage.innerText = "Failed";
    console.error("Failed to copy text:", e);
  }

  copyMessage.classList.add("active");

  setTimeout(() => {
    copyMessage.classList.remove("active");
  }, 1000);
}

copyBtn.addEventListener("click", () => {
  copyContent();
});

// shuffle algorithm is the Fisher-Yates (aka Knuth) Shuffle.
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  let str = "";
  array.forEach((el) => (str += el));
  return str;
}
// Password Generate

// By Default UpperCase Checked
uppercase.checked = true;
let checkCount = 1;

let checkBoxes = document.querySelectorAll("input[type=checkbox]");

// CheckBox - Handle
function handleCheckBoxChange() {
  checkCount = 0;
  checkBoxes.forEach((checkbox) => {
    if (checkbox.checked) checkCount++;
  });

  //special condition
  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }
}

checkBoxes.forEach((checkbox) => {
  checkbox.addEventListener("change", handleCheckBoxChange);
});

let password = "";
let generateBtn = document.querySelector("#generateBtn");

let errorMsg = document.querySelector("[errorMsg]");

let timeoutId;

generateBtn.addEventListener("click", () => {
  // Remove the active class
  errorMsg.classList.remove("active");

  // Clear any existing timeout
  if (timeoutId) {
    clearTimeout(timeoutId);
  }

  // Wait for a short delay before showing the new message
  setTimeout(() => {
    try {
      if (checkCount > 0) {
        if (passwordLength < checkCount) {
          passwordLength = checkCount;
          handleSlider();
        }

        // Remove Previous Password
        password = "";

        let arrayOfCheckedFunction = [];

        if (uppercase.checked)
          arrayOfCheckedFunction.push(generateRandomUppercase);
        if (lowercase.checked)
          arrayOfCheckedFunction.push(generateRandomLowercase);
        if (numbers.checked) arrayOfCheckedFunction.push(generateRandomNumber);
        if (symbols.checked) arrayOfCheckedFunction.push(generateRandomSymbol);

        // Compulsory Addition
        for (let i = 0; i < arrayOfCheckedFunction.length; i++) {
          password += arrayOfCheckedFunction[i]();
        }
        // Additional addition
        for (
          let i = 0;
          i < passwordLength - arrayOfCheckedFunction.length;
          i++
        ) {
          let randIndex = generateRandom(0, arrayOfCheckedFunction.length);
          password += arrayOfCheckedFunction[randIndex]();
        }

        // Shuffle Password
        password = shuffle(Array.from(password));
        passwordDisplay.value = password;
        calcStrength();

        errorMsg.innerText = "PassWord Created";
        errorMsg.style.cssText =
          "background-color:var(--lt-violet2); color:var(--vb-yellow);";
      } else {
        throw new Error("No checkbox selected");
      }
    } catch (e) {
      errorMsg.innerText = "No checkbox selected";
      errorMsg.style.cssText = "background-color:red; color:white;";
    }

    // Add the active class to show the new message
    errorMsg.classList.add("active");

    // Set a timeout to hide the message after 2500ms
    timeoutId = setTimeout(() => {
      errorMsg.classList.remove("active");
    }, 2500);
  }, 300); // Delay of 300ms before showing the new message
});
