import React from "react";
import { FaTwitter, FaTelegram } from "react-icons/fa";

const PredictionDashboardBanner = () => {
  return (
    <div className="mb-8">
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-8 text-white">
        <h1 className="text-4xl font-bold mb-4">Predict the Future</h1>
        <p className="text-lg mb-6">
          Create markets directly from Twitter and Telegram!
        </p>
        <div className="flex gap-4">
          <a
            href={`https://twitter.com/intent/tweet?text=@${process.env.NEXT_PUBLIC_AGENT_USERNAME} create market: "Your question" Options: Yes/No`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-blue-400 hover:bg-blue-500 px-4 py-2 rounded-lg transition-colors"
          >
            <FaTwitter /> Create via Twitter
          </a>
          <a
            href={`https://t.me/${process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg transition-colors"
          >
            <FaTelegram /> Create via Telegram
          </a>
        </div>
      </div>
    </div>
  );
};

export default PredictionDashboardBanner;
