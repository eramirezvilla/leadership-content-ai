import React, { useState } from 'react';

type ZoomOutLoaderProps = {
    children: React.ReactNode;
    style: string;
    color: 'green' | 'blue' | 'red' | 'purple' | 'mint' | 'brand';
    size: 'xs' | 's' | 'l' | 'xl';
    loading: boolean;
}

export default function ZoomOutLoader ({ children, style, color, size, loading } : ZoomOutLoaderProps) {

    const baseClasses = "rounded-full min-w-10 min-h-10 relative inline-flex items-center border border-transparent text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2";
    const colorClasses = {
        green: "bg-green-500 hover:bg-green-600 text-white",
        blue: "bg-blue-500 hover:bg-blue-600 text-white",
        red: "bg-red-500 hover:bg-red-600 text-white",
        purple: "bg-purple-500 hover:bg-purple-600 text-white",
        mint: "bg-teal-500 hover:bg-teal-600 text-white",
        brand: "bg-gradient-to-r from-brand_gradient1_purple to-brand_gradient1_blue text-white hover:to-brand_gradient2_blue",
    };
    const sizeClasses = {
        xs: "text-xs py-1 px-2",
        s: "text-sm py-2 px-3",
        l: "text-lg py-3 px-4",
        xl: "text-xl py-4 px-5",
    };
    const spinnerClasses = "absolute inset-0 flex items-center justify-center";

    return (
            <button
                className={`${baseClasses} ${colorClasses[color] ?? ''} ${sizeClasses[size] ?? ''}`}
                data-style={style}
                disabled={loading}
            >
                {loading ? (
                    <span className={spinnerClasses}>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                        </svg>
                    </span>
                ) : (
                    <span>{children}</span>
                )}
            </button>
    );
};

