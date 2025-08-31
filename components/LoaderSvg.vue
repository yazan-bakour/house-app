<template>
  <div class="loader-overlay">
    <svg width="100" height="90" viewBox="0 0 100 70" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <!-- Define the house shape as a mask -->
        <mask id="houseMask">
          <rect width="100" height="70" fill="black" />
          <!-- House shape in white (visible area) -->
          <g fill="white">
            <!-- Roof -->
            <polygon points="50,10 10,40 90,40" />
            <!-- House body -->
            <rect x="20" y="34" width="60" height="35" />

            <!-- Door in black (creates cutout/opening effect) -->
            <rect x="42" y="50" width="16" height="20" fill="black" />
          </g>
        </mask>

        <!-- Multi-color gradient for the animated chunks -->
        <linearGradient id="chunkGradient1" x1="20%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color: #eb5440; stop-opacity: 1" />
          <stop offset="100%" style="stop-color: #eb5440; stop-opacity: 0.8" />
        </linearGradient>

        <linearGradient id="chunkGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color: #4a4b4c; stop-opacity: 1" />
          <stop offset="100%" style="stop-color: #4a4b4c; stop-opacity: 0.8" />
        </linearGradient>

        <linearGradient id="chunkGradient3" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color: #323233; stop-opacity: 1" />
          <stop offset="100%" style="stop-color: #323233; stop-opacity: 0.8" />
        </linearGradient>

        <linearGradient id="chunkGradient4" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color: #e8e8e8; stop-opacity: 1" />
          <stop offset="100%" style="stop-color: #e8e8e8; stop-opacity: 0.8" />
        </linearGradient>

        <linearGradient id="chunkGradient5" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color: #c3c3c3; stop-opacity: 1" />
          <stop offset="100%" style="stop-color: #c3c3c3; stop-opacity: 0.8" />
        </linearGradient>

        <!-- Moving highlight effect -->
        <linearGradient id="movingHighlight" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color: #eb5440; stop-opacity: 0.5" />
          <stop offset="30%" style="stop-color: #eb5440; stop-opacity: 0.8" />
          <stop offset="70%" style="stop-color: #eb5440; stop-opacity: 0.8" />
          <stop offset="100%" style="stop-color: #eb5440; stop-opacity: 0.5" />
          <animateTransform
            attributeName="gradientTransform"
            type="translate"
            values="-100 0;200 0;-100 0"
            dur="1s"
            repeatCount="indefinite"
          />
        </linearGradient>

        <!-- Shadow gradient -->
        <radialGradient id="shadowGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" style="stop-color: #323233; stop-opacity: 0.9" />
          <stop offset="70%" style="stop-color: #323233; stop-opacity: 0.6" />
          <stop offset="100%" style="stop-color: #323233; stop-opacity: 0" />
        </radialGradient>
      </defs>

      <!-- Animated shadow beneath house -->
      <ellipse cx="50" cy="70" rx="40" ry="4" fill="url(#shadowGradient)">
        <animate attributeName="rx" values="30;35;30" dur="4s" repeatCount="indefinite" />
        <animate attributeName="ry" values="4;2;4" dur="4s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.6;0.3;0.6" dur="4s" repeatCount="indefinite" />
      </ellipse>

      <!-- House with bouncing animation -->
      <g>
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0,0;0,-5;0,0"
          dur="2s"
          repeatCount="indefinite"
        />

        <!-- Animated chunks effect -->
        <g mask="url(#houseMask)">
          <!-- Chunk 1 -->
          <rect x="0" y="0" width="100" height="70" fill="url(#chunkGradient1)">
            <animate
              attributeName="opacity"
              values="0.5;1;0.5"
              dur="0.6s"
              repeatCount="indefinite"
              begin="0s"
            />
          </rect>
        </g>

        <!-- Moving highlight sweep -->
        <g mask="url(#houseMask)">
          <rect width="100" height="70" fill="url(#movingHighlight)" opacity="1" />
        </g>
      </g>
    </svg>
  </div>
</template>
<style scoped>
.loader-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}
</style>
<style>
.loading {
  display: flex;
  justify-content: center;
  position: absolute;
  right: 0;
  left: 0;
  top: 20%;
}
</style>
