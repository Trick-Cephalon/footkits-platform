'use client'

import { useConfiguratorStore } from '@/store/useConfiguratorStore'
import type { Team } from '@/types'

interface KitPreview2DProps {
  team?: Team | null
  className?: string
}

const FONT_MAP: Record<string, string> = {
  standard: 'Arial Black, sans-serif',
  block: 'Impact, sans-serif',
  collegiate: 'Georgia, serif',
  retro: 'Courier New, monospace',
  modern: 'Trebuchet MS, sans-serif',
  slim: 'Gill Sans, sans-serif',
}

export function KitPreview2D({ team, className }: KitPreview2DProps) {
  const { personalization, viewAngle, selectedModel } = useConfiguratorStore()
  const primaryColor = team?.colors.primary ?? '#E8001C'
  const secondaryColor = team?.colors.secondary ?? '#000000'
  const fontFamily = FONT_MAP[personalization.font] ?? FONT_MAP.standard

  const isFront = viewAngle === 'front' || viewAngle === 'left' || viewAngle === 'right'
  const isBack = viewAngle === 'back'

  return (
    <div className={`relative flex items-center justify-center ${className ?? ''}`}>
      <svg
        viewBox="0 0 300 360"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full max-w-xs drop-shadow-2xl"
        style={{ filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.3))' }}
      >
        {/* Jersey body */}
        <path
          d="M60 80 L30 120 L10 140 L40 165 L55 155 L55 320 L245 320 L245 155 L260 165 L290 140 L270 120 L240 80 L200 65 C180 90 120 90 100 65 Z"
          fill={primaryColor}
        />

        {/* Collar V-neck */}
        <path
          d="M120 65 L150 95 L180 65"
          fill="none"
          stroke={secondaryColor}
          strokeWidth="4"
          strokeLinejoin="round"
        />

        {/* Side panels */}
        <rect x="55" y="160" width="28" height="160" fill={secondaryColor} opacity="0.8" />
        <rect x="217" y="160" width="28" height="160" fill={secondaryColor} opacity="0.8" />

        {/* Sleeve trim lines */}
        <line x1="58" y1="80" x2="53" y2="158" stroke={secondaryColor} strokeWidth="2" opacity="0.4" />
        <line x1="242" y1="80" x2="247" y2="158" stroke={secondaryColor} strokeWidth="2" opacity="0.4" />

        {/* Bottom hem */}
        <line x1="55" y1="316" x2="245" y2="316" stroke={secondaryColor} strokeWidth="3" opacity="0.4" />

        {/* Fabric texture - subtle lines */}
        {Array.from({ length: 12 }).map((_, i) => (
          <line
            key={i}
            x1="83"
            y1={100 + i * 18}
            x2="217"
            y2={100 + i * 18}
            stroke="rgba(255,255,255,0.04)"
            strokeWidth="1"
          />
        ))}

        {/* BACK VIEW */}
        {isBack && (
          <>
            {/* Number — large, centered */}
            {personalization.number && (
              <>
                {/* Number shadow/border */}
                {personalization.numberBorderColor && (
                  <text
                    x="152"
                    y="198"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill={personalization.numberBorderColor}
                    fontSize={personalization.numberSize * 3.2 + 4}
                    fontWeight="900"
                    fontFamily={fontFamily}
                    letterSpacing="-2"
                  >
                    {personalization.number}
                  </text>
                )}
                <text
                  x="150"
                  y="196"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={personalization.numberColor}
                  fontSize={personalization.numberSize * 3.2}
                  fontWeight="900"
                  fontFamily={fontFamily}
                  letterSpacing="-2"
                >
                  {personalization.number}
                </text>
              </>
            )}

            {/* Name */}
            {personalization.name && (
              <>
                {personalization.nameBorderColor && (
                  <text
                    x="152"
                    y="268"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill={personalization.nameBorderColor}
                    fontSize={personalization.nameSize * 2.8 + 2}
                    fontWeight="700"
                    fontFamily={fontFamily}
                    letterSpacing="4"
                  >
                    {personalization.name.toUpperCase()}
                  </text>
                )}
                <text
                  x="150"
                  y="266"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={personalization.nameColor}
                  fontSize={personalization.nameSize * 2.8}
                  fontWeight="700"
                  fontFamily={fontFamily}
                  letterSpacing="4"
                >
                  {personalization.name.toUpperCase()}
                </text>
              </>
            )}
          </>
        )}

        {/* FRONT VIEW */}
        {isFront && (
          <>
            {/* Captain armband hint */}
            {personalization.isCaptain && (
              <rect
                x="35"
                y="110"
                width="18"
                height="24"
                rx="4"
                fill="#FFD700"
                opacity="0.9"
              />
            )}
            {personalization.isCaptain && (
              <text
                x="44"
                y="126"
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#000000"
                fontSize="8"
                fontWeight="900"
                fontFamily="Arial, sans-serif"
              >
                C
              </text>
            )}

            {/* Front number (small) */}
            {personalization.number && (
              <text
                x="95"
                y="130"
                textAnchor="middle"
                dominantBaseline="middle"
                fill={personalization.numberColor}
                fontSize="20"
                fontWeight="900"
                fontFamily={fontFamily}
                opacity="0.9"
              >
                {personalization.number}
              </text>
            )}

            {/* Sponsor placeholder */}
            <rect
              x="100"
              y="170"
              width="100"
              height="30"
              rx="4"
              fill="rgba(255,255,255,0.1)"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="1"
            />
            <text
              x="150"
              y="188"
              textAnchor="middle"
              dominantBaseline="middle"
              fill="rgba(255,255,255,0.3)"
              fontSize="9"
              fontFamily="Arial, sans-serif"
              letterSpacing="2"
            >
              SPONSOR
            </text>

            {/* Club badge placeholder */}
            <circle
              cx="95"
              cy="105"
              r="16"
              fill={secondaryColor}
              opacity="0.8"
            />
            <text
              x="95"
              y="109"
              textAnchor="middle"
              dominantBaseline="middle"
              fill="white"
              fontSize="9"
              fontWeight="900"
              fontFamily="Arial, sans-serif"
            >
              {team?.shortName?.substring(0, 3).toUpperCase() ?? 'CLB'}
            </text>
          </>
        )}

        {/* Shine effect */}
        <path
          d="M80 90 L90 100 L85 240 L72 240 Z"
          fill="rgba(255,255,255,0.06)"
        />
        <path
          d="M88 92 L95 99 L92 200 L85 200 Z"
          fill="rgba(255,255,255,0.04)"
        />
      </svg>

      {/* View label */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
        <span className="text-xs font-medium text-neutral-400 bg-white/80 backdrop-blur px-3 py-1 rounded-full">
          {viewAngle === 'front' && 'Frente'}
          {viewAngle === 'back' && 'Costas'}
          {viewAngle === 'left' && 'Lateral esquerda'}
          {viewAngle === 'right' && 'Lateral direita'}
        </span>
      </div>
    </div>
  )
}
