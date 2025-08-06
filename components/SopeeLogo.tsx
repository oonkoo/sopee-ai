import React from 'react'

interface SopeeLogoProps {
  size?: number
  className?: string
  animated?: boolean
}

export default function SopeeLogo({ size = 64, className = '', animated = false }: SopeeLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} ${animated ? 'logoLoadingAnimation' : ''}`}
    >
      <defs>
        {/* Ultra smooth main gradient */}
        <radialGradient id="aiGradient" cx="30%" cy="30%" r="120%">
          <stop offset="0%" stopColor="#FEF3C7" />
          <stop offset="15%" stopColor="#FDE68A" />
          <stop offset="30%" stopColor="#FCD34D" />
          <stop offset="45%" stopColor="#F59E0B" />
          <stop offset="60%" stopColor="#F59E0B" />
          <stop offset="75%" stopColor="#D97706" />
          <stop offset="85%" stopColor="#B45309" />
          <stop offset="95%" stopColor="#92400E" />
          <stop offset="100%" stopColor="#78350F" />
        </radialGradient>
        
        {/* Neural network pattern gradient */}
        <linearGradient id="neuralGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FCD34D" stopOpacity="0.8" />
          <stop offset="25%" stopColor="#F59E0B" stopOpacity="0.6" />
          <stop offset="50%" stopColor="#D97706" stopOpacity="0.4" />
          <stop offset="75%" stopColor="#B45309" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#92400E" stopOpacity="0.2" />
        </linearGradient>
        
        {/* Glow effect */}
        <radialGradient id="glowGradient" cx="50%" cy="50%" r="100%">
          <stop offset="0%" stopColor="#FCD34D" stopOpacity="0.8" />
          <stop offset="30%" stopColor="#F59E0B" stopOpacity="0.4" />
          <stop offset="70%" stopColor="#D97706" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#92400E" stopOpacity="0" />
        </radialGradient>
        
        {/* Inner core gradient */}
        <radialGradient id="coreGradient" cx="50%" cy="50%" r="80%">
          <stop offset="0%" stopColor="#FEF3C7" />
          <stop offset="20%" stopColor="#FDE68A" />
          <stop offset="40%" stopColor="#FCD34D" />
          <stop offset="60%" stopColor="#F59E0B" />
          <stop offset="80%" stopColor="#D97706" />
          <stop offset="100%" stopColor="#92400E" />
        </radialGradient>
        
        {/* Filters for AI glow */}
        <filter id="aiGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        
        <filter id="innerGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Outer glow halo */}
      <g transform="translate(100,100) rotate(45)">
        <rect
          x="-85"
          y="-85"
          width="170"
          height="170"
          rx="32"
          ry="32"
          fill="url(#glowGradient)"
          opacity="0.6"
        />
      </g>
      
      {/* Main AI diamond */}
      <g transform="translate(100,100) rotate(45)">
        <rect
          x="-65"
          y="-65"
          width="130"
          height="130"
          rx="24"
          ry="24"
          fill="url(#aiGradient)"
          filter="url(#aiGlow)"
        />
      </g>
      
      {/* Neural network pattern overlay */}
      <g transform="translate(100,100) rotate(45)">
        <rect
          x="-60"
          y="-60"
          width="120"
          height="120"
          rx="20"
          ry="20"
          fill="url(#neuralGradient)"
        />
        
        {/* AI circuit pattern - professional */}
        <g stroke="#F59E0B" strokeWidth="1" fill="none" opacity="0.65">
          {/* Main diagonal crosses */}
          <path
            d="M-54,-54 L54,54 M-54,54 L54,-54"
            stroke="#FCD34D"
            strokeWidth="1.2"
            opacity="0.4"
          />
        </g>
      </g>
      
      {/* Inner core */}
      <g transform="translate(100,100) rotate(45)">
        <rect
          x="-35"
          y="-35"
          width="70"
          height="70"
          rx="16"
          ry="16"
          fill="url(#coreGradient)"
          filter="url(#innerGlow)"
        />
      </g>
      
      {/* Central AI node */}
      <g transform="translate(100,100)">
        <circle
          cx="0"
          cy="0"
          r="8"
          fill="url(#coreGradient)"
          filter="url(#innerGlow)"
        />
        <circle
          cx="0"
          cy="0"
          r="4"
          fill="#FEF3C7"
          opacity="0.9"
        />
      </g>
    </svg>
  )
}