import Groq from "groq-sdk";

const groqApi = import.meta.env.VITE_GROQ_API;

const groq = new Groq({
    apiKey: groqApi,
    dangerouslyAllowBrowser:true
});

export const requestGroqAi = async (content) => {
    const reply = await groq.chat.completions.create({
        messages: [{
            role: "user",
            content: content
        }],
        model: "llama-3.2-90b-vision-preview"
    });
    return reply.choices[0].message.content;
}