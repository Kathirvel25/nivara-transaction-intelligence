import React from 'react';

export const NivaraLogo: React.FC<{ size?: number }> = ({ size = 32 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M16 2L4 7.5V16C4 22.5 9.5 28.2 16 30C22.5 28.2 28 22.5 28 16V7.5L16 2Z"
      fill="#1a2d6b"
      stroke="#3b82f6"
      strokeWidth="1.5"
    />
    <path
      d="M16 7L8 10.5V16C8 20 11.5 23.6 16 25C20.5 23.6 24 20 24 16V10.5L16 7Z"
      fill="#132254"
      stroke="#60a5fa"
      strokeWidth="1"
    />
    <path
      d="M13 15.5L15.5 18L19.5 13"
      stroke="#3b82f6"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
