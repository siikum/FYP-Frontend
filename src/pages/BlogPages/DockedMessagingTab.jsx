// src/components/DockedMessagingTab.js
import React from 'react';
import { ChevronUp } from 'lucide-react';

const DockedMessagingTab = ({ userAvatar, onExpand }) => {
  return (
    <div className="fixed bottom-0 right-4 z-40">
      <button
        onClick={onExpand}
        className="flex items-center bg-white pl-2 pr-3 py-1.5 rounded-t-lg shadow-md hover:shadow-lg border border-b-0 border-gray-300 cursor-pointer transition-shadow duration-200"
      >
        <img
          src={userAvatar || 'https://via.placeholder.com/32/777/FFF?text=Me'} // Placeholder for user avatar
          alt="Your Avatar"
          className="w-7 h-7 rounded-full mr-2 border border-gray-200"
        />
        <span className="text-sm font-medium text-gray-800 mr-4">Messaging</span>
        <ChevronUp size={18} className="text-gray-600" />
      </button>
    </div>
  );
};

export default DockedMessagingTab;