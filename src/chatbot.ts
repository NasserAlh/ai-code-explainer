import { Anthropic } from '@anthropic-ai/sdk';
import hljs from 'highlight.js';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function processChat(input: string): Promise<string> {
    try {
        const message = await anthropic.messages.create({
            model: "claude-3-sonnet-20240229",
            max_tokens: 1000,
            temperature: 0.3,
            system: "Your task is to explain code snippets in simple, easy-to-understand language. Use analogies, examples, and plain terms.",
            messages: [{ role: "user", content: input }]
        });

        let responseText = message.content[0]?.type === 'text' ? message.content[0].text : 'Sorry, I couldn\'t generate a text response.';
        responseText = responseText.replace(/```(\w+)?\s*([\s\S]*?)```/g, (_, lang, code) => {
            const result = hljs.highlightAuto(code, lang ? [lang] : undefined);
            return `\n<pre><code class="hljs ${lang || ''}">${result.value}</code></pre>\n`;
        });

        return responseText;
    } catch (error) {
        console.error('Error processing chat:', error);
        throw new Error('Failed to process chat. Please try again.');
    }
}