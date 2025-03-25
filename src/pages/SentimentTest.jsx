// Importing SentimentAnalysis component into your target page
import React from 'react';
import SentimentAnalysis from '../components/SentimentAnalysis'; 

const SentimentTest = () => {
  return (
    <div>
      <h1>Welcome to Your Page!</h1>

      {/* Use SentimentAnalysis Component */}
      <SentimentAnalysis />

    </div>
  );
};

export default SentimentTest;
