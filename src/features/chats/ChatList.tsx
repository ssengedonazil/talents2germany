import { useEffect, useState } from "react";

interface Message {
    id: string;
    sender: string;
    body: string;
}

interface ChatListProps {
    loadingMessages: boolean;
    active: string | null;
    messages: Message[];
    messagesEndRef: React.RefObject<HTMLDivElement>; 
}

export default function ChatList({
    loadingMessages,
    active,
    messages,
    messagesEndRef, 
}: ChatListProps) {
    const [message, setMessage] = useState('');
    const [collectMessages, setCollectMessages] = useState<Message[]>([]);

    useEffect(() => {
        setCollectMessages(messages);
        
    }, [messages]);

    async function storeNewMessage(activeChat: string) {
        if (!message.trim()) return;
        try {
        const theSavedMessage=    await window.api.sendMessage(message, activeChat);
           setCollectMessages((pre)=>([...pre, ...theSavedMessage]));
           setMessage("")
        } catch (err) {
            console.error("Failed to send message:", err);
        }
    }

    return (
        <div className="flex-1 flex flex-col p-6 bg-gray-50">
            {active ? (
                loadingMessages ? (
                    <div className="text-gray-500 italic">Loading messages...</div>
                ) : (
                    <>
                        {/* Total messages count */}
                        <div className="mb-4 text-sm text-gray-500 font-medium">
                            Total Messages: <span className="font-bold">{collectMessages.length}</span>
                        </div>

                        {collectMessages.length > 0 ? (
                            <>
                                <div className="flex-1 overflow-y-auto space-y-3">
                                    {collectMessages.map((m) => {
                                        const isYou = m.sender === 'You';
                                        return (
                                            <div
                                                key={m.id}
                                                className={`flex ${isYou ? 'justify-end' : 'justify-start'}`}
                                            >
                                                <div
                                                    className={`p-2 rounded-xl max-w-md break-words shadow-sm ${
                                                        isYou ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
                                                    }`}
                                                >
                                                    {!isYou && (
                                                        <div className="text-xs font-semibold text-gray-700 mb-1">
                                                            {m.sender}
                                                        </div>
                                                    )}
                                                    <div className="text-sm">{m.body}</div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Message input */}
                                <div className="flex p-1 bg-gray-100 border-t border-gray-300">
                                    <input
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        type="text"
                                        placeholder="Type a message..."
                                        className="flex-1 px-4 rounded-l-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <button
                                        onClick={() => storeNewMessage(active)}
                                        className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-r-full transition"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M3 10l9-7 0 6 9 0-9 7 0-6-9 0z"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="text-gray-500 italic">No messages yet</div>
                        )}
                    </>
                )
            ) : (
                <div className="text-gray-500 italic">Select a chat to start</div>
            )}
        </div>
    );
}
