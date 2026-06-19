"use client";

import { useState } from "react";
import { approveAndSendMessage } from "./actions";

interface ApproveButtonProps {
  conversationId: string;
  messageLogId?: string;
  aiDraft: string;
}

export default function ApproveButton({ conversationId, messageLogId, aiDraft }: ApproveButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleApprove = async () => {
    if (!aiDraft) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await approveAndSendMessage(conversationId, messageLogId, aiDraft);
      
      if (result.success) {
        setIsSuccess(true);
        // Reset success state after a few seconds
        setTimeout(() => setIsSuccess(false), 3000);
      } else {
        setError(result.error || "Failed to send message");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <button 
        onClick={handleApprove}
        disabled={isLoading || isSuccess || !aiDraft}
        className={`w-full py-3 font-bold rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2 ${
          isSuccess 
            ? "bg-green-500 text-white" 
            : "bg-violet-600 hover:bg-violet-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
        }`}
      >
        {isLoading ? (
          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : isSuccess ? (
          <>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
            Sent!
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
            Approve & Send
          </>
        )}
      </button>
      {error && (
        <p className="text-red-500 text-xs text-center">{error}</p>
      )}
    </div>
  );
}
