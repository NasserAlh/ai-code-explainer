#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::Manager;
use reqwest::Client;
use serde_json::json;
use std::env;

#[derive(serde::Deserialize, serde::Serialize)]
struct AnthropicMessage {
    role: String,
    content: String,
}

#[derive(serde::Deserialize)]
struct AnthropicResponse {
    content: Vec<AnthropicContent>,
}

#[derive(serde::Deserialize)]
struct AnthropicContent {
    text: String,
}

#[tauri::command]
async fn chat(message: String) -> Result<String, String> {
    let api_key = env::var("ANTHROPIC_API_KEY").map_err(|_| "API key not found in environment variables")?;
    let client = Client::new();

    let response = client.post("https://api.anthropic.com/v1/messages")
        .header("x-api-key", api_key)
        .header("anthropic-version", "2023-06-01")
        .header("content-type", "application/json")
        .json(&json!({
            "model": "claude-3-sonnet-20240229",
            "max_tokens": 1000,
            "messages": [
                {
                    "role": "user",
                    "content": message
                }
            ],
            "system": "Your task is to explain code snippets in simple, easy-to-understand language. Use analogies, examples, and plain terms."
        }))
        .send()
        .await
        .map_err(|e| e.to_string())?;

    let anthropic_response: AnthropicResponse = response.json().await.map_err(|e| e.to_string())?;

    if let Some(content) = anthropic_response.content.first() {
        Ok(content.text.clone())
    } else {
        Err("No response from AI".to_string())
    }
}

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let window = app.get_window("main").unwrap();
            window.set_title("AI Code Explainer").unwrap();
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![chat])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}