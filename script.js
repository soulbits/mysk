document.addEventListener('DOMContentLoaded', () => {
    const themeToggleButton = document.getElementById('themeToggleButton');
    
    // Check the saved theme from localStorage (if any)
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.body.classList.add(currentTheme);

    const themeIcon = themeToggleButton.querySelector("i");

    // Set icon color according to the theme
    if (document.body.classList.contains('dark')) {
        themeIcon.classList.remove("fa-sun");
        themeIcon.classList.add("fa-moon");
        themeIcon.style.color = 'white'; // Moon icon is white in dark mode
    } else {
        themeIcon.classList.remove("fa-moon");
        themeIcon.classList.add("fa-sun");
        themeIcon.style.color = 'black'; // Sun icon is black in light mode
    }

    // Theme toggle functionality
    themeToggleButton.addEventListener('click', () => {
        if (document.body.classList.contains('light')) {
            document.body.classList.remove('light');
            document.body.classList.add('dark');
            themeIcon.classList.remove("fa-sun");
            themeIcon.classList.add("fa-moon");
            themeIcon.style.color = 'white'; // Change to white moon icon
            localStorage.setItem('theme', 'dark'); // Save the theme preference
        } else {
            document.body.classList.remove('dark');
            document.body.classList.add('light');
            themeIcon.classList.remove("fa-moon");
            themeIcon.classList.add("fa-sun");
            themeIcon.style.color = 'black'; // Change to black sun icon
            localStorage.setItem('theme', 'light'); // Save the theme preference
        }
    });
});

document.getElementById('formatButton').addEventListener('click', () => {
    const input = document.getElementById('headerInput').value;
    const format = document.getElementById('formatSelect').value;
    const output = formatHeaders(input, format);
    const outputElement = document.getElementById('output');
    outputElement.textContent = output;

    outputElement.style.animation = 'scaleUp 0.3s ease-in-out';  // Add animation on output update

    // Reset animation
    setTimeout(() => {
        outputElement.style.animation = '';  // Reset animation after it's done
    }, 300);
});

function formatHeaders(input, format) {
    const headers = parseHeaders(input);
    if (format === 'python') {
        return formatPython(headers);
    } else if (format === 'nodejs') {
        return formatNode(headers);
    } else if (format === 'golang') {
        return formatGo(headers);
    }
}

function parseHeaders(input) {
    const lines = input.split('\n');
    const headers = {};
    let lastKey = '';

    lines.forEach(line => {
        if (line.includes(':')) {
            const [key, ...valueParts] = line.split(':');
            lastKey = key.trim();
            headers[lastKey] = valueParts.join(':').trim();
        } else if (/^\s/.test(line)) {
            headers[lastKey] += ' ' + line.trim();
        } else {
            lastKey = line.trim();
            headers[lastKey] = '';
        }
    });

    // Clean up any unnecessary spaces from keys and values
    Object.keys(headers).forEach(key => {
        headers[key] = headers[key].trim();
    });

    return headers;
}

function formatPython(headers) {
    let formatted = 'headers = {\n';
    for (const [key, value] of Object.entries(headers)) {
        formatted += `    "${key}": "${value}",\n`;
    }
    formatted += '}';
    return formatted;
}

function formatNode(headers) {
    let formatted = '{\n';
    for (const [key, value] of Object.entries(headers)) {
        formatted += `    "${key}": "${value}",\n`;
    }
    formatted += '}';
    return formatted;
}

function formatGo(headers) {
    let formatted = 'headers := map[string]string{\n';
    for (const [key, value] of Object.entries(headers)) {
        formatted += `    "${key}": "${value}",\n`;
    }
    formatted += '}';
    return formatted;
}

// Function to copy the formatted output to clipboard
document.getElementById('copyButton').addEventListener('click', () => {
    const outputText = document.getElementById('output').textContent;
    
    // Use the modern Clipboard API to copy the text
    navigator.clipboard.writeText(outputText).then(() => {
        // Show success notification
        showCopyNotification('Copied to clipboard!');
    }).catch(err => {
        // Handle error if clipboard access fails
        console.error('Failed to copy text: ', err);
    });
});

function showCopyNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.left = '50%';
    notification.style.transform = 'translateX(-50%)';
    notification.style.backgroundColor = '#28a745'; // Green color for success
    notification.style.color = '#fff';
    notification.style.padding = '10px 20px';
    notification.style.borderRadius = '5px';
    notification.style.fontSize = '14px';
    notification.style.boxShadow = '0px 4px 10px rgba(0, 0, 0, 0.1)';
    notification.style.zIndex = '9999';
    notification.style.transition = 'opacity 0.5s ease-in-out';
    notification.style.opacity = '0';
    
    // Append the notification to the body
    document.body.appendChild(notification);
    
    // Fade in the notification
    setTimeout(() => {
        notification.style.opacity = '1';
    }, 10);
    
    // Fade out after 2 seconds and remove it from the DOM
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, 2000);
}
