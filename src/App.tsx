import { useEffect, useState, useRef } from 'react';
import MessageView from './features/chats/MessageView';
import ChatList from './features/chats/ChatList';
import { useChatStore } from './Store';
type Chat = { id: string; title: string; unreadCount: number };
type Message = { id: string; sender: string; body: string };

export default function App() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [active, setActive] = useState<string | null>(null);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messages = useChatStore(state => state.messages);

  useEffect(() => {
    window.api.getChats(0).then(setChats);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div>

      <div className="flex h-[92.9vh] font-sans">
        {/* Chat List */}
        <MessageView
          setActive={setActive}
          active={active}
          loadingMessages={loadingMessages}
          setLoadingMessages={setLoadingMessages}
          chats={chats} setChats={setChats}
        />


        {/* Messages */}
        <ChatList
        
        loadingMessages={loadingMessages} active={active} messages={messages} messagesEndRef={messagesEndRef} />

      </div>
      <footer className="bg-gray-800 text-white py-1">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-4">
          <div className="text-md font-semibold">
            <i>   Ssengendo Nazil</i>
          </div>

          <div className="flex space-x-3  ">
            <a href="#" className="hover:text-gray-400 transition">Home</a>
            <a href="#" className="hover:text-gray-400 transition">About</a>
            <a href="#" className="hover:text-gray-400 transition">Contact</a>
            <a href="#" className="hover:text-gray-400 transition">Privacy</a>
          </div>
        </div>
        <div className="mt-2 text-center text-gray-400 text-sm">
          &copy; 2026 Ssengendo Nazil. All rights reserved.
        </div>
      </footer>

    </div>
  );
}
