"use client";

import { useState, ReactNode } from "react";

interface PaymentButtonProps {
  onPayment: () => Promise<void>;
  className?: string;
  disabled?: boolean;
  children?: ReactNode;
  loadingText?: string;
}

export default function PaymentButton({ 
  onPayment, 
  className = "", 
  disabled = false,
  children = "Төлбөр төлөх", // Default text
  loadingText = "Уншиж байна..." // Default loading text
}: PaymentButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      await onPayment();
    } catch (error) {
      console.error("Payment error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled || isLoading}
      className={`px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-md hover:from-purple-600 hover:to-pink-600 transition-all duration-200 disabled:opacity-70 ${className}`}
    >
      {isLoading ? loadingText : children}
    </button>
  );
} 