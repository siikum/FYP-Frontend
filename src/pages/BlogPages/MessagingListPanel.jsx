import React from 'react';
import { Search, SquarePen, ChevronDown } from 'lucide-react';

const ConversationListItem = ({ chat, onClick, isSelected }) => (
  <button
    onClick={onClick}
    className={`flex items-center w-full px-3 py-2.5 text-left hover:bg-gray-100 focus:outline-none transition-colors duration-150 ${
      isSelected ? 'bg-gray-200' : ''
    }`}
  >
    <img
      src={chat.avatar}
      alt={chat.name}
      className="w-10 h-10 rounded-full mr-3 flex-shrink-0"
    />
    <div className="flex-grow overflow-hidden">
      <div className="flex justify-between items-center">
        <p className="text-sm font-medium text-gray-900 truncate">{chat.name}</p>
        <p className="text-xs text-gray-500 flex-shrink-0 ml-2">{chat.timestamp || 'Jan 1'}</p>
      </div>
      <p className="text-xs text-gray-600 truncate mt-0.5">{chat.lastMessage || 'No messages yet'}</p>
    </div>
    {chat.unread > 0 && (
      <span className="ml-2 bg-blue-600 text-white text-[10px] font-semibold rounded-full w-4 h-4 flex items-center justify-center flex-shrink-0">
        {chat.unread > 9 ? '9+' : chat.unread}
      </span>
    )}
  </button>
);

const MessagingListPanel = ({ conversations, onChatSelect, onClose, onMinimize, activeChatId }) => {
  return (
    <div
      className="fixed bottom-0 left-[4rem] z-50 w-[320px] h-[500px] bg-white rounded-t-lg shadow-xl flex flex-col border border-gray-300 border-b-0 mr-9"
    >
      <div className="flex items-center justify-between p-3 border-b border-gray-200 sticky top-0 bg-white z-10">
        <div className="flex items-center">
          <img
            src={'https://via.placeholder.com/32/777/FFF?text=Me'}
            alt="You"
            className="w-8 h-8 rounded-full mr-2 border"
          />
          <p className="font-semibold text-sm text-gray-800">Messaging</p>
        </div>
        <div className="flex items-center space-x-3 text-gray-600">
          <button className="hover:text-gray-900" title="New Message">
            <SquarePen size={18} />
          </button>
          <button onClick={onMinimize} className="hover:text-gray-900" title="Minimize">
            <ChevronDown size={20} />
          </button>
        </div>
      </div>

      <div className="p-2 border-b border-gray-200">
        <div className="relative">
          <input
            type="text"
            placeholder="Search messages"
            className="w-full px-3 py-1.5 pl-8 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
          />
          <Search size={16} className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {conversations.length > 0 ? (
          conversations.map((chat) => (
            <ConversationListItem
              key={chat.id}
              chat={chat}
              onClick={() => onChatSelect(chat.id)}
              isSelected={chat.id === activeChatId}
            />
          ))
        ) : (
          <p className="text-center text-sm text-gray-500 p-4">No conversations yet.</p>
        )}
      </div>
    </div>
  );
};

export default MessagingListPanel;
