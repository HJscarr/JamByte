"use client";

import React from "react";

interface GradientButtonProps {
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
}

export default function GradientButton({ 
  onClick, 
  type = "button", 
  disabled = false, 
  children,
  className = ""
}: GradientButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`group relative inline-flex items-center px-8 py-3 text-lg font-medium text-white rounded-lg overflow-hidden transition-all duration-300 ease-out hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-none bg-gradient-to-r from-secondary to-red-400 hover:from-pink-500 hover:to-red-500 ${className}`}
    >
      <div className="relative flex items-center space-x-2">
        {children}
      </div>
      <div className="absolute inset-0 transform translate-x-full group-hover:-translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
    </button>
  );
} 