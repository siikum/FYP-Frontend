// src/components/DockedMessagingTab.js
import React from 'react';
import { ChevronUp } from 'lucide-react';

const DockedMessagingTab = ({ userAvatar, onExpand }) => {
  return (
    // Changed 'right-4' to 'left-4' here
    <div className="fixed bottom-0 left-4 z-40 w-64">
      <button
        onClick={onExpand}
        className="flex items-center bg-black w-full pl-5 pr-6 py-2.5 rounded-t-lg shadow-md hover:shadow-lg border border-b-0 border-gray-300 cursor-pointer transition-shadow duration-200"
      >
        <span className="text-base font-medium text-white mr-6">Messaging</span>
        <ChevronUp size={22} className="text-white" />
      </button>
    </div>
  );
};

export default DockedMessagingTab;
