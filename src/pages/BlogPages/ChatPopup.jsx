// src/components/ChatPopup.js
// ... (Keep the MessageBubble component and imports the same)
import React, { useState, useRef, useEffect } from 'react';
import { Paperclip, Mic, SendHorizonal, X, ChevronDown, /* other icons */ } from 'lucide-react';

// --- MessageBubble component (Keep from previous version) ---
const MessageBubble = ({ message, isOwnMessage }) => {
    // ... same code as before ...
     return (
        <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-3 mx-3`}>
        {!isOwnMessage && (
            <img
            src={message.sender.avatar}
            alt={message.sender.name}
            className="w-8 h-8 rounded-full mr-2 flex-shrink-0"
            />
        )}
        <div className="flex flex-col max-w-[80%]">
            {!isOwnMessage && (
                <p className="text-xs font-medium text-gray-700 mb-1">{message.sender.name}</p>
            )}
            <div
            className={`py-2 px-3 rounded-xl text-sm ${
                isOwnMessage
                ? 'bg-purple-600 text-white rounded-br-none' // Your messages
                : 'bg-gray-100 text-gray-800 rounded-bl-none' // Received messages
            }`}
            >
            {message.type === 'text' && <p>{message.content}</p>}
            {message.type === 'image' && ( /* ... image rendering ... */
                <img
                    src={message.content} alt="Shared media" className="max-w-[200px] max-h-[150px] rounded-md my-1 cursor-pointer object-cover"
                    onClick={() => window.open(message.content, '_blank')}
                />
             )}
             {message.type === 'voice' && ( /* ... voice rendering ... */
                 <div className="flex items-center space-x-2 min-w-[180px]">
                     <button className="p-1 rounded-full bg-purple-500 text-white hover:bg-purple-700 flex-shrink-0">
                         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                     </button>
                     <div className="flex items-center h-8 w-full space-x-px">
                         {[...Array(20)].map((_, i) => (<span key={i} className={`block h-${Math.floor(Math.random() * 4) + 2} w-0.5 bg-purple-300 rounded-full`}></span>))}
                     </div>
                     <span className="text-xs text-gray-500 flex-shrink-0">{message.duration || '0:15'}</span>
                 </div>
              )}
            </div>
            <span className={`text-[10px] mt-1 ${isOwnMessage ? 'text-right' : 'text-left'} text-gray-400`}>
                {message.timestamp}
                {isOwnMessage && <span className="ml-1">✓✓</span>}
            </span>
        </div>
        </div>
    );
};
// --- End MessageBubble ---


const ChatPopup = ({ chat, onClose }) => { // Removed onMinimize for now, just use Close
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  // --- Dummy Data (Use chat prop) ---
  const currentUser = { id: 'userId1', name: 'You', avatar: 'https://via.placeholder.com/40/93C5FD/FFFFFF?text=Me' };
  // Generate some basic dummy messages based on the chat prop
  const [messages, setMessages] = useState([
      { id: 1, sender: chat?.participants?.[0] || { name: chat?.name || 'Other User', avatar: chat?.avatar }, content: `Hello! This is the start of your chat with ${chat?.name || '...'}`, type: 'text', timestamp: '09:00' },
      { id: 2, sender: currentUser, content: 'Hi there! Nice to chat.', type: 'text', timestamp: '09:01' },
      // Add more specific dummy messages if needed, or fetch real ones
  ]);
  // --- End Dummy Data ---

  useEffect(() => {
    // Fetch actual messages for chat.id here
    console.log("Fetching messages for chat:", chat?.id);
    // Example: setMessages(fetchedMessages);
  }, [chat?.id]); // Re-fetch when chat ID changes

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;
    const messageToSend = { /* ... same as before ... */
        id: Date.now(), sender: currentUser, content: newMessage, type: 'text',
        timestamp: new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date()),
    };
    console.log('Sending message:', messageToSend);
    setMessages([...messages, messageToSend]);
    setNewMessage('');
  };

  if (!chat) return null; // Don't render if no chat is selected

  return (
    // --- Main Popup Window ---
    // Positioned to the left of the MessagingListPanel (width 320px + gap ~1rem/16px)
    // So, right = 1rem (gap) + 320px (panel width) + 1rem (original page margin) = approx right-[352px] or right-88 in Tailwind JIT
    // Let's use pixels for clarity here: style={{ right: '344px' }} (320 panel + 16 gap + 8 original margin adjustment)
    // Ensure bottom=0 to align with the list panel
    <div
        className="fixed bottom-0 z-50 w-[320px] h-[500px] bg-white rounded-t-lg shadow-xl flex flex-col border border-gray-300 border-b-0"
        style={{ right: 'calc(1rem + 320px)' }} // Position left of the 320px wide list panel + 1rem gap
    >
      {/* --- Header --- */}
      <div className="flex items-center justify-between p-3 bg-white border-b rounded-t-lg sticky top-0 z-10">
        <div className="flex items-center overflow-hidden mr-2"> {/* Added overflow-hidden */}
          <img
            src={chat.avatar}
            alt={chat.name}
            className="w-8 h-8 rounded-full mr-2 flex-shrink-0" // Reduced size slightly
          />
          {/* Removed member count for 1-on-1 view like LinkedIn */}
          <p className="font-semibold text-sm text-gray-800 truncate">{chat.name}</p>
        </div>
        <div className="flex items-center space-x-2">
           {/* Maybe add other actions like video call? */}
          <button onClick={onClose} className="text-gray-500 hover:text-red-500">
            <X size={20} /> {/* Use Close icon */}
          </button>
        </div>
      </div>

      {/* --- Messages Area --- */}
      <div className="flex-1 overflow-y-auto p-2 bg-white">
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            isOwnMessage={msg.sender.id === currentUser.id}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* --- Input Area --- */}
      <div className="p-3 border-t bg-gray-50">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
          {/* ... same input form as before ... */}
            <button type="button" className="p-2 text-gray-500 hover:text-purple-600">
                <Paperclip size={20} />
            </button>
            <input
                type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Write a message..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
            />
            <button type="button" className="p-2 text-gray-500 hover:text-purple-600">
                <Mic size={20} />
            </button>
            <button type="submit" className="p-2 text-white bg-purple-600 rounded-full hover:bg-purple-700 disabled:opacity-50" disabled={!newMessage.trim()}>
                <SendHorizonal size={20} />
            </button>
        </form>
      </div>
    </div>
  );
};

export default ChatPopup;