import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-analytics.js";

const firebaseConfig = {
    apiKey: "AIzaSyB1yA0FMXHo6XhRkHNmu1Cz8Kz9v4u1M2w",
    authDomain: "mayukhportfolio-905fe.firebaseapp.com",
    projectId: "mayukhportfolio-905fe",
    storageBucket: "mayukhportfolio-905fe.firebasestorage.app",
    messagingSenderId: "42484188872",
    appId: "1:42484188872:web:6d43f8e0ef7eb85d9247fd",
    measurementId: "G-XRXHNJNW36"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Menu toggle
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    menuToggle.classList.toggle('active');
});

// Theme toggle
const themeToggle = document.querySelector('.theme-toggle');
themeToggle.addEventListener('click', () => {
    document.documentElement.setAttribute(
        'data-theme',
        document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'
    );
    themeToggle.textContent = document.documentElement.getAttribute('data-theme') === 'dark' ? '☀️' : '🌙';
});

// Get in Touch button debugging
const getInTouchButton = document.querySelector('.btn');
getInTouchButton.addEventListener('click', () => {
    console.log('Get in Touch button clicked, navigating to #contact');
});

// Chatbot functionality
const chatBubble = document.querySelector('.chat-bubble');
const chatOverlay = document.querySelector('.chat-overlay');
const chatClose = document.querySelector('.chat-close');
const chatInput = document.querySelector('.chat-input input');
const chatSend = document.querySelector('.chat-input button');
const chatMessages = document.querySelector('.chat-messages');

const myDescription = "I am Mayukh Chatterjee, a second-year Computer Science engineering student proficient in web development (HTML, CSS, JavaScript) and programming (Java, Python, SQL), with a passion for crafting AI-driven solutions like e-commerce platforms and movie recommendation systems. I actively explore cellular automata and supervised learning, contributing to innovative research in asynchronous systems. Eager to apply my technical skills and proactive learning mindset, I aim to deliver impactful solutions in dynamic tech or academic environments. My hobbies are coding, watching football, listening to music, and painting.I am pursing my B.Tech from Institute of Engineering and Management, Salt Lake, Kolkata.";

function appendInitialMessage() {
    chatMessages.innerHTML = ''; // Clear previous messages
    const initialMessage = document.createElement('div');
    initialMessage.className = 'message ai';
    initialMessage.innerHTML = `
        <img src="https://avatars.githubusercontent.com/u/133559478?s=400&u=f088c652ca3eb5820b5f3a9d1b24010f8544cda7&v=4" alt="AI Profile">
        <div class="message-content">Hi, I am Mayukh Chatterjee, what do you want to know about me?</div>
    `;
    chatMessages.appendChild(initialMessage);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function appendTypingIndicator() {
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'typing-indicator';
    typingIndicator.innerHTML = `
        <img src="https://avatars.githubusercontent.com/u/133559478?s=400&u=f088c652ca3eb5820b5f3a9d1b24010f8544cda7&v=4" alt="AI Profile">
        <div class="message-content">
            <span>Typing</span>
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
        </div>
    `;
    chatMessages.appendChild(typingIndicator);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return typingIndicator;
}

function removeTypingIndicator(typingIndicator) {
    if (typingIndicator && typingIndicator.parentNode) {
        typingIndicator.parentNode.removeChild(typingIndicator);
    }
}

chatBubble.addEventListener('click', () => {
    chatOverlay.classList.toggle('active');
    if (chatOverlay.classList.contains('active')) {
        appendInitialMessage();
    }
});

chatClose.addEventListener('click', () => {
    chatOverlay.classList.remove('active');
});

async function sendToGemini(message) {
    const apiKey = 'AIzaSyDw79Y7pxidbrWYii7u8Igxfx4dJsZRfog';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
    const prompt = `User_message: ${message}. Reply naturally to the user message, referencing my description if relevant: ${myDescription}. Include my hobbies (coding, watching football, listening to music, painting) when appropriate, such as for questions about interests or free time. Reply in short sentences. Speak as if you are Mayukh Chatterjee.`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        if (!response.ok) {
            throw new Error(`API request failed: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Gemini API response:', data);
        const aiReply = data.candidates[0].content.parts[0].text || 'Sorry, no response from the API.';
        return aiReply;
    } catch (error) {
        console.error('Gemini API error:', error);
        return 'Sorry, I’m having trouble responding. Try again later.';
    }
}

chatSend.addEventListener('click', async () => {
    const message = chatInput.value.trim();
    if (message) {
        // Add user message
        const userMessage = document.createElement('div');
        userMessage.className = 'message user';
        userMessage.innerHTML = `
            <div class="message-content">${message}</div>
        `;
        chatMessages.appendChild(userMessage);

        // Add typing indicator
        const typingIndicator = appendTypingIndicator();

        // Add AI response
        const aiResponse = await sendToGemini(message);
        removeTypingIndicator(typingIndicator);

        const aiMessage = document.createElement('div');
        aiMessage.className = 'message ai';
        aiMessage.innerHTML = `
            <img src="https://avatars.githubusercontent.com/u/133559478?s=400&u=f088c652ca3eb5820b5f3a9d1b24010f8544cda7&v=4" alt="AI Profile">
            <div class="message-content">${aiResponse}</div>
        `;
        chatMessages.appendChild(aiMessage);

        // Clear input and scroll to bottom
        chatInput.value = '';
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
});

chatInput.addEventListener('keypress', async (e) => {
    if (e.key === 'Enter') {
        chatSend.click();
    }
});

// Form submission
const contactForm = document.getElementById('contact-form');
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log('Form submitted:', {
        name: contactForm.querySelector('input[type="text"]').value,
        email: contactForm.querySelector('input[type="email"]').value,
        message: contactForm.querySelector('textarea').value
    });
    alert('Message sent! (Check console for details)');
    contactForm.reset();
});
