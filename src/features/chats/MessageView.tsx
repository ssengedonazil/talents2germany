import React, { useState, useCallback } from 'react';
import { List as RVList, AutoSizer } from 'react-virtualized';
import { useChatStore } from '../../Store';

interface Chat {
  id: string;
  title: string;
  unreadCount: number;
}

interface Message {
  id: string;
  sender: string;
  body: string;
}

interface MessageViewProps {
  setActive: React.Dispatch<React.SetStateAction<string | null>>;
  active: string | null;
  setLoadingMessages: React.Dispatch<React.SetStateAction<boolean>>;
  chats: Chat[];
  setChats: React.Dispatch<React.SetStateAction<Chat[]>>;
  loadingMessages: boolean;
}

export default function MessageView({
  setActive,
  active,
  setLoadingMessages,
  chats,
  setChats,
  loadingMessages,
}: MessageViewProps) {
  const [search, setSearch] = useState('');

  const setMessages = useChatStore((state) => state.setMessages);
  const setActiveChat = useChatStore((state) => state.setActiveChat);

  const openChat = useCallback(
    async (id: string) => {
      setActive(id);
      setLoadingMessages(true);
      const msgs = await window.api.getMessages(id);
      setMessages(msgs);
      setActiveChat(id);
      setLoadingMessages(false);
    },
    [setActive, setLoadingMessages, setMessages, setActiveChat]
  );

  const filteredChats = chats.filter((chat) =>
    chat.title.toLowerCase().includes(search.toLowerCase())
  );

  const rowRenderer = useCallback(
    ({ index, key, style }: any) => {
      const chat = filteredChats[index];
      const isActive = chat?.id === active;

      return (
        <div
          key={key}
          style={style}
          onClick={() => {
            openChat(chat.id);
            setChats((prev) =>
              prev.map((c) =>
                c.id === chat.id ? { ...c, unreadCount: 0 } : c
              )
            );
          }}
          className={`flex items-center px-4 cursor-pointer border-b transition-colors duration-200
            ${isActive ? 'bg-gray-800 text-white' : 'hover:bg-gray-100'}`}
        > 
          <div className="flex-1 font-medium ">{chat.title}</div>
          {chat.unreadCount > 0 && (
            <div className="ml-2 text-xs font-semibold text-white bg-red-500 rounded-full px-2 py-0.5">
              {chat.unreadCount}
            </div>
          )}
        </div>
      );
    },
    [filteredChats, active, openChat, setChats]
  );

  return (
    <div className="w-80 border-r border-gray-300 bg-white shadow-sm flex flex-col h-full">
      {/* Search input */}
      <div className="p-2">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search messages..."
          className="
            w-full
            px-4
            py-1
            border
            border-gray-300
            rounded-lg
            shadow-sm
            focus:outline-none
            focus:ring-0
            focus:ring-blue-500
            focus:border-blue-500
            placeholder-gray-400
            transition
            duration-200
          "
        />
      </div>

      {/* Chat list */}
      <div className="flex-1">
        <AutoSizer>
          {({ width, height }) => (
            <RVList
              width={width}
              height={height}
              rowHeight={60}
              rowCount={filteredChats.length}
              rowRenderer={rowRenderer}
            />
          )}
        </AutoSizer>
      </div>
    </div>
  );
}
