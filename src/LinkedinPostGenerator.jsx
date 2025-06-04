import React, { useState, useRef } from "react";
import ReactMarkdown from "react-markdown";



export default function LinkedinPostGenerator() {

    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [post, setPost] = useState(null);
    const typingTimeoutRef = useRef(null);
const apiKey = import.meta.env.VITE_GREETING;



    function extractJSON(text) {
        const jsonStart = text.indexOf("{");
        const jsonEnd = text.lastIndexOf("}");
        if (jsonStart !== -1 && jsonEnd !== -1) {
            const jsonString = text.substring(jsonStart, jsonEnd + 1);
            try {
                return JSON.parse(jsonString);
            } catch {
                return null;
            }
        }
        return null;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        setLoading(true);
        setError("");
        setPost(null);

        const prompt = `You are a friendly LinkedIn content creator. Given the command:

"${input}"

Write a simple, clear, and engaging LinkedIn post in English. 
Respond ONLY with a valid JSON object with the keys:

- "title": No emojis or additional content and Grammar correction,
- "explanation": a brief, easy-to-understand explanation with bullet points or simple sentences (string) no imoji,
- "hashtags": an array of relevant hashtags (array of strings).

Do NOT add anything else, no extra text or explanation, only the JSON.
Make sure the tone is conversational and natural, as if written by a real person.`;

        try {
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: prompt }] }],
                    }),
                }
            );

            const data = await response.json();
            const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

            if (!text) {
                setError("No valid response from Server.");
                setLoading(false);
                return;
            }

            const jsonResponse = extractJSON(text);

            if (!jsonResponse || typeof jsonResponse.title !== "string") {
                setError("Failed to extract valid JSON from Gemini response.");
                setLoading(false);
                return;
            }

            setInput("");
            setPost({
                title: `**${jsonResponse.title}**`,
                explanation: "",
                hashtags: Array.isArray(jsonResponse.hashtags)
                    ? jsonResponse.hashtags
                    : [],
            });

            let i = 0;
            const explanationText =
                typeof jsonResponse.explanation === "string"
                    ? jsonResponse.explanation
                    : "";
            const speed = 20;

            const typeChar = () => {
                if (i < explanationText.length) {
                    setPost((prev) => ({
                        ...prev,
                        explanation: prev.explanation + explanationText.charAt(i),
                    }));
                    i++;
                    typingTimeoutRef.current = setTimeout(typeChar, speed);
                } else {
                    clearTimeout(typingTimeoutRef.current);
                    typingTimeoutRef.current = null;
                    setLoading(false);
                }
            };

            typeChar();
        } catch (err) {
            console.error(err);
            setError("Failed to fetch from Gemini.");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center font-sans p-4 sm:p-6 md:p-10 bg-white">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 text-center">
                AI LinkedIn Post Agent
            </h1>

            {!post && (
                <form onSubmit={handleSubmit} className="w-full max-w-sm sm:max-w-md md:max-w-xl relative">
                    <textarea
                        placeholder="Enter your command here..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        rows={1}
                        className="w-full pr-28 sm:pr-32 p-2 sm:p-3 md:p-3  rounded-md text-base resize-none"
                        disabled={loading}
                    />
                    <button
                        type="submit"
                        disabled={loading || !input.trim()}
                        className="absolute right-1 top-1 px-3 py-1 sm:px-4 sm:py-2 bg-purple-600 text-white rounded-md disabled:opacity-50 md:mt-[1px]"
                    >
                        {loading ? "Generating..." : "Ask"}
                    </button>
                </form>
            )}

            {error && <p className="text-red-600 mt-4 text-sm sm:text-base">{error}</p>}

            {post && (
                <div className="overflow-x-hidden w-full flex justify-center px-2 sm:px-4">
                    <div className="relative mt-6 sm:mt-8 p-4 sm:p-6 md:p-8  rounded-lg bg-gray-50 animate-fade-in w-full max-w-sm sm:max-w-md md:max-w-2xl">
                        <button
                            onClick={() => {
                                const contentToCopy = `${post.title}\n\n${post.explanation}\n\nHashtags: ${post.hashtags
                                    ?.map((tag) => `#${tag}`)
                                    .join(" ") || ""}`;
                                navigator.clipboard
                                    .writeText(contentToCopy)
                                    .then(() => alert("Post copied to clipboard!"))
                                    .catch(() => alert("Failed to copy!"));
                            }}
                            className="absolute top-4 right-4 text-xs sm:text-sm text-purple-900 hover:underline cursor-pointer"
                        >
                            Copy
                        </button>

                        <ReactMarkdown
                            components={{
                                p: ({ children }) => (
                                    <p className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">{children}</p>
                                ),
                            }}
                        >
                            {post.title}
                        </ReactMarkdown>

                        <ReactMarkdown
                            components={{
                                p: ({ children }) => (
                                    <p className="text-base sm:text-lg text-gray-800 whitespace-pre-wrap">{children}</p>
                                ),
                                li: ({ children }) => (
                                    <li className="list-disc ml-4 sm:ml-6">{children}</li>
                                ),
                            }}
                        >
                            {post.explanation}
                        </ReactMarkdown>

                        {post.hashtags?.length > 0 && (
                            <p className="mt-4 font-medium text-purple-700 text-sm sm:text-base">
                                Hashtags:{" "}
                                {post.hashtags.map((tag, idx) => (
                                    <span key={idx} className="mr-2">
                                        #{tag}
                                    </span>
                                ))}
                            </p>
                        )}

                        <div className="mt-5 sm:mt-6 text-center">
                            <button
                                onClick={() => {
                                    setPost(null);
                                    setInput("");
                                    setError("");
                                }}
                                className="px-3 sm:px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md cursor-pointer"
                            >
                                Start New
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>


    );
}
