<template>
  <div class="logo">
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 4 460 150" 
      aria-label="YBK Digital Services logo"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient 
          id="ybkGrad" 
          x1="0" 
          y1="0" 
          x2="0" 
          y2="1" 
          gradientUnits="objectBoundingBox"
          gradientTransform="rotate(0)"
        >
          <stop offset="0%" stop-color="#00264d" stop-opacity="1"/>
          <stop offset="100%" stop-color="#285687" stop-opacity="1"/>
        </linearGradient>
      </defs>

      <!-- Left gradient rectangle -->
      <rect x="0" y="0" width="150" height="160" rx="0" ry="0" fill="url(#ybkGrad)"/>

      <!-- Right text block -->
      <g class="brand" transform="translate(170,0)">
        <text x="0" y="107" class="wordmark" font-size="140">YBK</text>
        <text x="0" y="152" class="tagline" font-size="24">DIGITAL SERVICES</text>
      </g>
    </svg>
  </div>
</template>
<style scoped lang="scss">
  .logo {
    display: flex;
    align-items: center;
    justify-content: center;
    
    svg {
      height: 60px;
      width: auto;
      max-width: 120px;
      display: block;
      
      // Ensure SVG renders properly on all devices
      shape-rendering: geometricPrecision;
      image-rendering: optimizeQuality;
      
      // Force hardware acceleration on mobile
      transform: translateZ(0);
      will-change: transform;
      
      @media (max-width: 768px) {
        height: 50px;
        max-width: 130px;
      }
      
      @media (max-width: 480px) {
        height: 45px;
        max-width: 120px;
      }
    }
  }
  
  .brand { 
    font-family: "Poppins", "Inter", "Segoe UI", Arial, sans-serif; 
    font-weight: 500; 
  }
  
  .wordmark { 
    font-weight: 400; 
  }
  
  .tagline { 
    font-weight: 500; 
    letter-spacing: 4px; 
  }
</style>
