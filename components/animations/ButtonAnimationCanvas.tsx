"use client"

import { useEffect, useRef } from "react"

interface GlowEffect {
  x: number
  y: number
  width: number
  height: number
  opacity: number
  life: number
  maxLife: number
}

interface PulseEffect {
  x: number
  y: number
  scale: number
  opacity: number
  life: number
  maxLife: number
}

interface ButtonAnimationCanvasProps {
  isActive: boolean
  buttonRect?: DOMRect
  animationType?: 'glow' | 'pulse' | 'combined'
  duration?: number
}

const ButtonAnimationCanvas: React.FC<ButtonAnimationCanvasProps> = ({
  isActive,
  buttonRect,
  animationType = 'combined',
  duration = 2000
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | undefined>(undefined)
  const glowEffectsRef = useRef<GlowEffect[]>([])
  const pulseEffectsRef = useRef<PulseEffect[]>([])

  const createGlowEffects = () => {
    if (!buttonRect) return []

    const effects: GlowEffect[] = []

    // 光る線エフェクト
    effects.push({
      x: buttonRect.left,
      y: buttonRect.top + buttonRect.height / 2,
      width: 0,
      height: 4,
      opacity: 0.8,
      life: 0,
      maxLife: duration / 16.67
    })

    return effects
  }

  const createPulseEffects = () => {
    if (!buttonRect) return []

    const effects: PulseEffect[] = []

    // パルス波紋エフェクト
    for (let i = 0; i < 3; i++) {
      effects.push({
        x: buttonRect.left + buttonRect.width / 2,
        y: buttonRect.top + buttonRect.height / 2,
        scale: 0,
        opacity: 0.4,
        life: 0,
        maxLife: (duration * 0.8) / 16.67
      })
    }

    return effects
  }

  const updateGlowEffects = (effects: GlowEffect[]) => {
    if (!buttonRect) return []

    return effects.filter(effect => {
      effect.life++

      const progress = effect.life / effect.maxLife

      // 光線が左から右に伸びる
      effect.width = buttonRect.width * progress
      effect.opacity = Math.max(0, 0.8 * (1 - progress))

      return effect.life < effect.maxLife
    })
  }

  const updatePulseEffects = (effects: PulseEffect[]) => {
    return effects.filter(effect => {
      effect.life++

      const progress = effect.life / effect.maxLife

      // 波紋が広がる
      effect.scale = 100 * progress
      effect.opacity = Math.max(0, 0.4 * (1 - progress))

      return effect.life < effect.maxLife
    })
  }

  const drawGlowEffects = (ctx: CanvasRenderingContext2D, effects: GlowEffect[]) => {
    effects.forEach(effect => {
      ctx.save()
      ctx.globalAlpha = effect.opacity

      // グラデーション作成
      const gradient = ctx.createLinearGradient(effect.x, effect.y, effect.x + effect.width, effect.y)
      gradient.addColorStop(0, 'transparent')
      gradient.addColorStop(0.5, '#22c55e')
      gradient.addColorStop(1, 'transparent')

      ctx.fillStyle = gradient
      ctx.fillRect(effect.x, effect.y - effect.height / 2, effect.width, effect.height)

      ctx.restore()
    })
  }

  const drawPulseEffects = (ctx: CanvasRenderingContext2D, effects: PulseEffect[]) => {
    effects.forEach(effect => {
      ctx.save()
      ctx.globalAlpha = effect.opacity
      ctx.strokeStyle = '#22c55e'
      ctx.lineWidth = 2

      ctx.beginPath()
      ctx.arc(effect.x, effect.y, effect.scale, 0, Math.PI * 2)
      ctx.stroke()

      ctx.restore()
    })
  }

  const animate = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Update and draw effects
    if (animationType === 'glow' || animationType === 'combined') {
      glowEffectsRef.current = updateGlowEffects(glowEffectsRef.current)
      drawGlowEffects(ctx, glowEffectsRef.current)
    }

    if (animationType === 'pulse' || animationType === 'combined') {
      pulseEffectsRef.current = updatePulseEffects(pulseEffectsRef.current)
      drawPulseEffects(ctx, pulseEffectsRef.current)
    }

    // Continue animation if effects exist
    if (glowEffectsRef.current.length > 0 || pulseEffectsRef.current.length > 0) {
      animationRef.current = requestAnimationFrame(animate)
    }
  }

  const startAnimation = () => {
    if (!canvasRef.current || !buttonRect) return

    // Create effects
    if (animationType === 'glow' || animationType === 'combined') {
      glowEffectsRef.current = createGlowEffects()
    }

    if (animationType === 'pulse' || animationType === 'combined') {
      pulseEffectsRef.current = createPulseEffects()
    }

    // Start animation loop
    animate()
  }

  const stopAnimation = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }

    // Clear all effects
    glowEffectsRef.current = []
    pulseEffectsRef.current = []

    // Clear canvas
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (ctx && canvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    return () => {
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])

  useEffect(() => {
    if (isActive && buttonRect) {
      startAnimation()
    } else {
      stopAnimation()
    }

    return () => {
      stopAnimation()
    }
  }, [isActive, buttonRect])

  if (!isActive) return null

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-30 pointer-events-none"
      style={{ width: '100vw', height: '100vh' }}
    />
  )
}

export default ButtonAnimationCanvas