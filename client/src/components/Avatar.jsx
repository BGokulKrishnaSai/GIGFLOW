import React from 'react'

// Simple inline SVG avatars with subtle animation
export default function Avatar({ gender = 'male', size = 40 }) {
  const commonProps = {
    width: size,
    height: size,
    viewBox: '0 0 64 64',
    xmlns: 'http://www.w3.org/2000/svg',
    className: 'avatar-svg',
  }

  if (gender === 'female') {
    return (
      <svg {...commonProps} aria-label="female avatar">
        <g>
          <circle cx="32" cy="20" r="12" fill="#F9C2D1" />
          <path d="M12 52c0-11 10-18 20-18s20 7 20 18v2H12v-2z" fill="#8FB4D6" />
          <path d="M20 44c0-6 12-10 12-10s12 4 12 10" fill="#6C9ECF" opacity="0.9" />
        </g>
      </svg>
    )
  }

  // default male
  return (
    <svg {...commonProps} aria-label="male avatar">
      <g>
        <circle cx="32" cy="18" r="12" fill="#C6D8F1" />
        <path d="M10 52c0-12 11-20 22-20s22 8 22 20v2H10v-2z" fill="#A7C1E8" />
        <path d="M18 44c0-6 14-11 14-11s14 5 14 11" fill="#7FA6DB" opacity="0.95" />
      </g>
    </svg>
  )
}
