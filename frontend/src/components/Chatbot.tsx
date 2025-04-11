import React, { useState } from 'react';
import axios from 'axios';
import { Theamatom } from '../atoms/Theam';
import { useRecoilValue } from 'recoil';

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; content: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const theam = useRecoilValue(Theamatom)

  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user' as const, content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await axios.post(
        API_URL,
        {
          contents: [
            {
              parts: [{ text: input }],
            },
          ],
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const botText =
        res.data?.candidates?.[0]?.content?.parts?.[0]?.text || '🤖 No response from Gemini.';

      setMessages((prev) => [...prev, { role: 'bot', content: botText }]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { role: 'bot', content: '❌ Error connecting to the chatbot. Try again.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {isOpen && (
        <div className={`w-80 h-96 ${theam === "dark" ? "bg-stone-600" : "bg-white"} bg-stone-500 border rounded-lg shadow-xl flex flex-col`}>
          <div className="bg-blue-600 text-white p-3 font-semibold rounded-t-lg">
            Chat Assistant
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2 text-sm">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-2 rounded-md max-w-xs text-black ${
                  msg.role === 'user'
                    ? 'bg-blue-100 ml-auto text-right'
                    : 'bg-gray-100 mr-auto text-left'
                }`}
              >
                {msg.content}
              </div>
            ))}
            {loading && <div className="text-gray-400 text-xs">Bot is typing...</div>}
          </div>
          <div className="flex border-t p-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              className="flex-1 px-3 py-1 text-sm border rounded-l-md outline-none text-black"
              placeholder="Ask something..."
            />
            <button
              onClick={sendMessage}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-r-md"
            >
              Send
            </button>
          </div>
        </div>
      )}

      {/* Chatbot Button and Label */}
      <div className="flex flex-col items-end">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg mt-2"
        >
          💬
        </button>
      </div>
    </div>
  );
};

export default Chatbot;