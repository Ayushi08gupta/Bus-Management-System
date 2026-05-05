export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="relative w-8 h-8">
        {/* Bus + Location Pin Icon */}
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Location Pin */}
          <defs>
            <linearGradient id="busGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#c4b5fd" />
              <stop offset="100%" stopColor="#7dd3fc" />
            </linearGradient>
          </defs>

          {/* Bus Body */}
          <rect x="15" y="35" width="55" height="35" rx="4" fill="url(#busGradient)" />

          {/* Bus Windows */}
          <rect x="20" y="40" width="8" height="8" fill="rgba(255,255,255,0.6)" rx="1" />
          <rect x="32" y="40" width="8" height="8" fill="rgba(255,255,255,0.6)" rx="1" />
          <rect x="44" y="40" width="8" height="8" fill="rgba(255,255,255,0.6)" rx="1" />

          {/* Location Pin */}
          <circle cx="75" cy="30" r="12" fill="#fdba74" opacity="0.8" />
          <path
            d="M75 42 C70 37, 65 32, 65 25 C65 18, 70 13, 75 13 C80 13, 85 18, 85 25 C85 32, 80 37, 75 42 Z"
            fill="#ff6b6b"
            opacity="0.9"
          />

          {/* Wheels */}
          <circle cx="25" cy="72" r="4" fill="#2d2d2d" />
          <circle cx="60" cy="72" r="4" fill="#2d2d2d" />
        </svg>
      </div>
      <div className="font-bold text-xl bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
        BusTrack
      </div>
    </div>
  );
}
