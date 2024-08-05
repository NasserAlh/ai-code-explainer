import { invoke } from "@tauri-apps/api/tauri";

let chatInputEl: HTMLInputElement | null;
let chatFormEl: HTMLFormElement | null;
let chatWindowEl: HTMLElement | null;
let chatStatusEl: HTMLElement | null;

async function chat() {
  if (chatInputEl && chatWindowEl && chatStatusEl) {
    const message = chatInputEl.value;
    if (!message) return;

    appendMessage('user', message);
    chatInputEl.value = '';
    chatStatusEl.textContent = 'AI is thinking...';

    try {
      const response = await invoke("chat", { message });
      appendMessage('assistant', response as string);
      chatStatusEl.textContent = '';
    } catch (error) {
      console.error(error);
      chatStatusEl.textContent = 'Error: Failed to get AI response';
    }
  }
}

function appendMessage(role: 'user' | 'assistant', content: string) {
  if (chatWindowEl) {
    const messageEl = document.createElement('div');
    messageEl.className = `message ${role}`;
    messageEl.textContent = `${role === 'user' ? 'You' : 'AI'}: ${content}`;
    chatWindowEl.appendChild(messageEl);
    chatWindowEl.scrollTop = chatWindowEl.scrollHeight;
  }
}

window.addEventListener("DOMContentLoaded", () => {
  chatInputEl = document.querySelector("#chat-input");
  chatFormEl = document.querySelector("#chat-form");
  chatWindowEl = document.querySelector("#chat-window");
  chatStatusEl = document.querySelector("#chat-status");

  chatFormEl?.addEventListener("submit", (e) => {
    e.preventDefault();
    chat();
  });
});