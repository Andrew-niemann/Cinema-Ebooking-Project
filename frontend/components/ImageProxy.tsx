"use client";

import { useState } from "react";

interface ImageProxyProps {
  src: string;
  alt: string;
  className?: string;
}

export default function ImageProxy({ src, alt, className = "" }: ImageProxyProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const placeholderUrl = "https://via.placeholder.com/300x450/3C3D37/ECDFCC?text=Loading...";
  const fallbackUrl = "https://via.placeholder.com/300x450/3C3D37/ff4444?text=No+Poster+Found";

  return (
    <div className={`relative overflow-hidden ${className}`}>

      {!isLoaded && (
        <img 
          src={placeholderUrl} 
          alt="Placeholder" 
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      <img
        src={hasError ? fallbackUrl : src}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-500 ${isLoaded ? "opacity-100" : "opacity-0"}`}
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          setHasError(true);
          setIsLoaded(true);
        }}
      />
    </div>
  );
}