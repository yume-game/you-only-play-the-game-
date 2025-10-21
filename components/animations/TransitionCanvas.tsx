"use client"

import { useEffect, useRef } from "react"

interface LightRay {
  x: number
  y: number
  length: number
  maxLength: number
  angle: number
  opacity: number
  life: number
  maxLife: number
}

interface LightCircle {
  x: number
  y: number
  radius: number
  maxRadius: number
  opacity: number
  life: number
  maxLife: number
}

interface TransitionCanvasProps {
  isActive: boolean
  duration?: number
}

const TransitionCanvas: React.FC<TransitionCanvasProps> = ({
  isActive,
  duration = 600
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | undefined>(undefined)
  const lightRaysRef = useRef<LightRay[]>([])
  const lightCirclesRef = useRef<LightCircle[]>([])

  const createLightRays = () => {
    const rays: LightRay[] = []
    const canvas = canvasRef.current
    if (!canvas) return rays

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2

    // 放射状の光線
    for (let i = 0; i < 8; i++) {
      rays.push({
        x: centerX,
        y: centerY,
        length: 0,
        maxLength: Math.min(canvas.width, canvas.height) * 0.6,
        angle: (i * 45) * (Math.PI / 180),
        opacity: 0.6,
        life: 0,
        maxLife: duration / 16.67
      })
    }

    return rays
  }

  const createLightCircles = () => {
    const circles: LightCircle[] = []
    const canvas = canvasRef.current
    if (!canvas) return circles

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2

    // 拡張する光の輪
    for (let i = 0; i < 3; i++) {
      circles.push({
        x: centerX,
        y: centerY,
        radius: 0,
        maxRadius: 150 + i * 50,
        opacity: 0.4,
        life: 0,
        maxLife: (duration * 0.8) / 16.67
      })
    }

    return circles
  }

  const updateLightRays = (rays: LightRay[]) => {
    return rays.filter(ray => {
      ray.life++

      const progress = ray.life / ray.maxLife

      // 光線が中心から外に伸びる
      ray.length = ray.maxLength * progress
      ray.opacity = Math.max(0, 0.6 * (1 - progress))

      return ray.life < ray.maxLife
    })
  }

  const updateLightCircles = (circles: LightCircle[]) => {
    return circles.filter(circle => {
      circle.life++

      const progress = circle.life / circle.maxLife

      // 輪が拡大
      circle.radius = circle.maxRadius * progress
      circle.opacity = Math.max(0, 0.4 * (1 - progress))

      return circle.life < circle.maxLife
    })
  }

  const drawLightRays = (ctx: CanvasRenderingContext2D, rays: LightRay[]) => {
    rays.forEach(ray => {
      ctx.save()
      ctx.globalAlpha = ray.opacity

      ctx.translate(ray.x, ray.y)
      ctx.rotate(ray.angle)

      // グラデーション作成
      const gradient = ctx.createLinearGradient(0, 0, ray.length, 0)
      gradient.addColorStop(0, '#ffffff')
      gradient.addColorStop(0.7, '#f3f4f6')
      gradient.addColorStop(1, 'transparent')

      ctx.fillStyle = gradient
      ctx.fillRect(0, -2, ray.length, 4)

      ctx.restore()
    })
  }

  const drawLightCircles = (ctx: CanvasRenderingContext2D, circles: LightCircle[]) => {
    circles.forEach(circle => {
      ctx.save()
      ctx.globalAlpha = circle.opacity
      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 3

      ctx.beginPath()
      ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2)
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
    lightRaysRef.current = updateLightRays(lightRaysRef.current)
    lightCirclesRef.current = updateLightCircles(lightCirclesRef.current)

    drawLightRays(ctx, lightRaysRef.current)
    drawLightCircles(ctx, lightCirclesRef.current)

    // Continue animation if effects exist
    if (lightRaysRef.current.length > 0 || lightCirclesRef.current.length > 0) {
      animationRef.current = requestAnimationFrame(animate)
    }
  }

  const startAnimation = () => {
    if (!canvasRef.current) return

    // Create effects
    lightRaysRef.current = createLightRays()
    lightCirclesRef.current = createLightCircles()

    // Start animation loop
    animate()
  }

  const stopAnimation = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }

    // Clear all effects
    lightRaysRef.current = []
    lightCirclesRef.current = []

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
    if (isActive) {
      startAnimation()
    } else {
      stopAnimation()
    }

    return () => {
      stopAnimation()
    }
  }, [isActive])

  if (!isActive) return null

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-20 pointer-events-none"
      style={{ width: '100vw', height: '100vh' }}
    />
  )
}

export default TransitionCanvas