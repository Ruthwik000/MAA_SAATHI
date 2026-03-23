import React from 'react';

const AshaIllustration = ({ className = '' }) => (
  <svg 
    viewBox="0 0 400 500" 
    className={className} 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
  >
    {/* Clean White/Transparent Background - No Circle */}
    
    {/* ASHA Worker - Full Body Flat Illustration */}
    {/* Body / Light Uniform */}
    <path d="M120 480 C120 350, 280 350, 280 480 Z" fill="#E3F2FD" /> {/* Light Blue Uniform */}
    <path d="M140 480 C140 380, 260 380, 260 480 Z" fill="#BBDEFB" /> {/* Uniform Detail */}
    
    {/* Scarf / Dupatta Drape */}
    <path d="M150 480 C130 400, 220 360, 240 480 Z" fill="#C2185B" opacity="0.9"/>
    
    {/* Left Arm & Hand */}
    <path d="M110 400 C110 380, 160 360, 170 380 L160 450 Z" fill="#ECAFAF" />
    <path d="M120 480 L140 430 L160 480 Z" fill="#BBDEFB" />

    {/* Right Arm & Hand holding Tablet */}
    <path d="M290 440 C290 400, 240 380, 230 400 L240 450 Z" fill="#BBDEFB" />
    <circle cx="270" cy="400" r="15" fill="#ECAFAF" />

    {/* Tablet/Clipboard */}
    <rect x="235" y="320" width="70" height="100" rx="8" fill="#ECEFF1" stroke="#CFD8DC" strokeWidth="4" />
    <rect x="245" y="335" width="50" height="60" rx="4" fill="#FFFFFF" />
    <rect x="250" y="345" width="40" height="4" rx="2" fill="#90A4AE" />
    <rect x="250" y="355" width="30" height="4" rx="2" fill="#90A4AE" />
    <rect x="250" y="365" width="40" height="4" rx="2" fill="#90A4AE" />

    {/* Neck */}
    <rect x="185" y="240" width="30" height="40" fill="#ECAFAF" />
    <path d="M185 280 C185 300, 215 300, 215 280 Z" fill="#DDA0A0" /> {/* shadow */}

    {/* Face / Head */}
    <circle cx="200" cy="200" r="50" fill="#ECAFAF" />
    
    {/* Hair (Black, neatly parted) */}
    <path d="M150 200 C150 130, 250 130, 250 200 C240 180, 160 180, 150 200 Z" fill="#2D2D2D" />
    {/* Hair Bun at the back */}
    <circle cx="145" cy="180" r="25" fill="#2D2D2D" />

    {/* Friendly Face Elements */}
    {/* Eyes */}
    <path d="M180 195 Q185 190 190 195" stroke="#2D2D2D" strokeWidth="3" strokeLinecap="round" fill="none" />
    <path d="M210 195 Q215 190 220 195" stroke="#2D2D2D" strokeWidth="3" strokeLinecap="round" fill="none" />
    <circle cx="185" cy="198" r="2.5" fill="#2D2D2D" />
    <circle cx="215" cy="198" r="2.5" fill="#2D2D2D" />
    
    {/* Bindi */}
    <circle cx="200" cy="185" r="4" fill="#C2185B" />
    
    {/* Smile */}
    <path d="M190 220 Q200 230 210 220" stroke="#C2185B" strokeWidth="3" strokeLinecap="round" fill="none" />
    {/* Blush */}
    <circle cx="175" cy="210" r="6" fill="#F48FB1" opacity="0.6" />
    <circle cx="225" cy="210" r="6" fill="#F48FB1" opacity="0.6" />

    {/* Stethoscope around neck */}
    <path d="M175 260 C170 320, 230 320, 225 260" stroke="#455A64" strokeWidth="6" strokeLinecap="round" fill="none" />
    <path d="M200 310 L200 350" stroke="#455A64" strokeWidth="6" strokeLinecap="round" />
    <circle cx="200" cy="355" r="10" fill="#CFD8DC" stroke="#455A64" strokeWidth="4" />

    {/* Medical Plus Floating Accent */}
    <rect x="75" y="160" width="24" height="8" rx="2" fill="#C2185B" opacity="0.15" />
    <rect x="83" y="152" width="8" height="24" rx="2" fill="#C2185B" opacity="0.15" />
    
    <rect x="310" y="240" width="18" height="6" rx="2" fill="#64B5F6" opacity="0.2" />
    <rect x="316" y="234" width="6" height="18" rx="2" fill="#64B5F6" opacity="0.2" />

    {/* Minimal Ground Shadow */}
    <ellipse cx="200" cy="485" rx="100" ry="8" fill="#E0E0E0" opacity="0.6" />
  </svg>
);

export default AshaIllustration;
