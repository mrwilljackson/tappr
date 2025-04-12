import React from "react";
import Image from "next/image";

interface PhoneFrameProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  rotate?: number;
  shadow?: boolean;
  shadowOffset?: number;
}

export function PhoneFrame({
  src,
  alt,
  width = 300,
  height = 600,
  className = "",
  rotate = 0,
  shadow = false,
  shadowOffset = 15,
}: PhoneFrameProps) {
  // Calculate shadow styles if shadow is enabled
  const shadowStyle = shadow
    ? {
        boxShadow: `${shadowOffset}px ${Math.abs(shadowOffset)}px 30px rgba(100, 116, 139, 0.4)`,
      }
    : {};

  // Calculate rotation styles
  const rotateStyle = rotate !== 0
    ? {
        transform: `rotate(${rotate}deg)`,
        transformOrigin: 'center center',
      }
    : {};

  // Combine styles
  const combinedStyles = {
    width: `${width}px`,
    maxWidth: "100%",
    ...rotateStyle,
  };

  return (
    <div className={`relative mx-auto ${className}`} style={combinedStyles}>
      {/* Phone frame */}
      <div
        className="absolute inset-0 rounded-[3rem] border-[14px] border-black bg-black shadow-xl"
        style={shadowStyle}
      >
        {/* Notch */}
        <div className="absolute left-1/2 top-0 h-6 w-40 -translate-x-1/2 -translate-y-1 rounded-b-xl bg-black"></div>

        {/* Power button */}
        <div className="absolute -right-[17px] top-32 h-16 w-[3px] rounded-l-lg bg-gray-700"></div>

        {/* Volume buttons */}
        <div className="absolute -left-[17px] top-24 h-8 w-[3px] rounded-r-lg bg-gray-700"></div>
        <div className="absolute -left-[17px] top-36 h-8 w-[3px] rounded-r-lg bg-gray-700"></div>

        {/* Screen */}
        <div className="absolute inset-0 overflow-hidden rounded-[2.3rem] bg-white">
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      {/* Spacer to maintain aspect ratio */}
      <div style={{ paddingBottom: `${(height / width) * 100}%` }}></div>
    </div>
  );
}
