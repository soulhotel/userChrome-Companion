document.addEventListener('DOMContentLoaded', () => {

const notifyCSS = document.createElement('link');
notifyCSS.rel = 'stylesheet';
notifyCSS.href = 'uc-notify/uc-notify.css';
document.head.appendChild(notifyCSS);

const notifyHTML = `
<div class="uc-notify">
    <div class="uc-notify-message"></div>
    <div class="uc-notify-input"><input type="text"/></div>
    <div class="uc-notify-buttons">
        <div class="uc-notify-sendit">Yes</div>
        <div class="uc-notify-rejectit">No</div>
    </div>
</div>
`;

document.body.insertAdjacentHTML('beforeend', notifyHTML);

window.ucNotify = function (...args) {

    // Parse input flag first -------------------------------------------------------------

    const inputFlag = args.includes('needinput') || args.find(arg => typeof arg === 'object' && arg.needinput);
    const cleanArgs = args.filter(arg => arg !== 'needinput' && !(typeof arg === 'object' && arg.needinput));

    const [msg, ...rest] = cleanArgs;
    if (!msg || typeof msg !== 'string') {
        console.warn('ucNotify: First argument must be a message to user (string).');
        return;
    }

    // Extract labels and functions -------------------------------------------------------

    let yesLabel = '', noLabel = '';
    let onYes = null, onNo = null;

    for (let i = 0; i < rest.length; i++) {
        const val = rest[i];
        if (typeof val === 'string') {
            if (!onYes && yesLabel === '') yesLabel = val;
            else if (!onNo && noLabel === '') noLabel = val;
        } else if (typeof val === 'function') {
            if (!onYes) onYes = val;
            else if (!onNo) onNo = val;
        }
    }

    // 3. Validation ----------------------------------------------------------------------

    const notify = document.querySelector('.uc-notify');
    if (!notify) {
        console.warn("ucNotify: .uc-notify not found yet.");
        return;
    }

    const msgEl = notify.querySelector('.uc-notify-message');
    const inputWrapper = notify.querySelector('.uc-notify-input');
    const inputField = inputWrapper.querySelector('input');
    const yesBtn = notify.querySelector('.uc-notify-sendit');
    const noBtn = notify.querySelector('.uc-notify-rejectit');

    if (yesLabel && noLabel && !onYes && !onNo) {
        console.warn(`ucNotify: 2 Labels found ("${yesLabel}" and "${noLabel}") you need at least one function for ("${yesLabel}")`);
        return;
    }

    // If only 1 label (yesLabel), treat as a valid notification with the single label
    if (yesLabel && !noLabel && !onYes) {
        // Automatically add a dismiss function to handle 'Yes' if no handler provided
        onYes = () => window.dontcNotify();
    }

    // If only a Yes handler is provided, link to that label
    if (yesLabel && onYes && !noLabel) {
        // Assign the 'Yes' button function
        console.warn(`ucNotify: Only 1 confirmation button is used here.`);
        yesBtn.onclick = () => {
            onYes();
            window.dontcNotify();
        };
    }

    if (yesLabel && onYes && !onNo && noLabel) {
        console.warn(`ucNotify: Only 1 function found ("${noLabel}") will default to returning.`);
    }

    // DOM Manipulation  ------------------------------------------------------------------

    // Reset state
    inputWrapper.classList.remove('show');  // input hidden by default
    yesBtn.style.display = 'inline-block';
    noBtn.style.display = 'inline-block';
    yesBtn.onclick = null;
    noBtn.onclick = null;
    yesBtn.textContent = 'Yes';
    noBtn.textContent = 'No';
    inputField.value = '';

    // set contents
    msgEl.textContent = msg;

    if (inputFlag) {
        inputWrapper.classList.add('show');
    }

    yesBtn.textContent = yesLabel || 'Yes';
    noBtn.textContent = noLabel || 'No';

    if (onYes) {
        yesBtn.onclick = () => {
            const val = inputFlag ? inputField.value : undefined;
            onYes(val);
            window.dontcNotify();
        };
    } else {
        yesBtn.onclick = () => window.dontcNotify();
    }

    if (onNo) {
        noBtn.onclick = () => {
            onNo();
            window.dontcNotify();
        };
    } else if (noLabel && !onNo && onYes) {
        noBtn.onclick = () => {
            window.dontcNotify();
        };
    }

    // set visibilities
    noBtn.style.display = noLabel && (onNo || onYes) ? 'inline-block' : 'none';

    const allSiblings = Array.from(notify.parentNode.children)
        .filter(child => child !== notify && child.nodeType === 1 && child.tagName !== 'SCRIPT' && child.tagName !== 'STYLE');
    allSiblings.forEach(sibling => sibling.classList.add('uc-notified'));

    // show notify
    notify.classList.add('show');

    if (inputFlag && inputField) {
        setTimeout(() => inputField.focus(), 0);
    }

    const keyHandler = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (inputFlag && onYes) {
                const val = inputField.value;
                onYes(val);
                window.dontcNotify();
            }
        }
    };
    document.addEventListener('keydown', keyHandler);
    notify._keyHandler = keyHandler;
};

window.dontcNotify = function () {
    const notify = document.querySelector('.uc-notify');
    if (!notify) return;

    const allSiblings = Array.from(notify.parentNode.children).filter(child => child !== notify);
    allSiblings.forEach(sibling => sibling.classList.remove('uc-notified'));
    notify.classList.remove('show');

    // Clean up global Enter listener if it exists
    if (notify._keyHandler) {
        document.removeEventListener('keydown', notify._keyHandler);
        delete notify._keyHandler;
    }

    // Optionally clear input
    const inputField = notify.querySelector('.uc-notify-input input');
    if (inputField) inputField.value = '';

    // Reset button texts to defaults
    const yesBtn = notify.querySelector('.uc-notify-sendit');
    const noBtn = notify.querySelector('.uc-notify-rejectit');
    if (yesBtn) yesBtn.textContent = 'Yes';
    if (noBtn) noBtn.textContent = 'No';
};


});
