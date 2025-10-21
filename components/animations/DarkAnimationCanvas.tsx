"use client"

import { useEffect, useRef } from "react"

interface DarkParticle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  life: number
  maxLife: number
  color: string
}

interface DarkRipple {
  x: number
  y: number
  radius: number
  maxRadius: number
  opacity: number
  life: number
  maxLife: number
}

interface DarkRay {
  angle: number
  length: number
  maxLength: number
  opacity: number
  life: number
  maxLife: number
}

interface DarkAnimationCanvasProps {
  isActive: boolean
  duration?: number
}

const DARK_COLORS = ["#374151", "#4B5563", "#6B7280", "#9CA3AF", "#1F2937", "#111827"]

const DarkAnimationCanvas: React.FC<DarkAnimationCanvasProps> = ({
  isActive,
  duration = 1000
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | undefined>(undefined)
  const particlesRef = useRef<DarkParticle[]>([])
  const ripplesRef = useRef<DarkRipple[]>([])
  const raysRef = useRef<DarkRay[]>([])
  const overlayOpacityRef = useRef(0)

  const createDarkParticles = () => {
    const particles: DarkParticle[] = []
    const canvas = canvasRef.current
    if (!canvas) return particles

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2

    for (let i = 0; i < 8; i++) {
      const angle = (i * 90 * Math.PI) / 180

      particles.push({
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * 2,
        vy: Math.sin(angle) * 2,
        size: 8 + Math.random() * 8,
        opacity: 0.8,
        life: 0,
        maxLife: duration / 16.67,
        color: DARK_COLORS[Math.floor(Math.random() * DARK_COLORS.length)]
      })
    }

    return particles
  }

  const createDarkRipples = () => {
    const ripples: DarkRipple[] = []
    const canvas = canvasRef.current
    if (!canvas) return ripples

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2

    for (let i = 0; i < 3; i++) {
      ripples.push({
        x: centerX,
        y: centerY,
        radius: 0,
        maxRadius: 200 + i * 100,
        opacity: 0.6,
        life: 0,
        maxLife: (duration * 0.75) / 16.67
      })
    }

    return ripples
  }

  const createDarkRays = () => {
    const rays: DarkRay[] = []

    for (let i = 0; i < 8; i++) {
      rays.push({
        angle: i * 45,
        length: 0,
        maxLength: 150,
        opacity: 0.5,
        life: 0,
        maxLife: (duration * 0.5) / 16.67
      })
    }

    return rays
  }

  const updateDarkParticles = (particles: DarkParticle[]) => {
    return particles.filter(particle => {
      particle.x += particle.vx
      particle.y += particle.vy
      particle.life++

      // 減速効果
      particle.vx *= 0.98
      particle.vy *= 0.98

      // フェードアウト
      particle.opacity = Math.max(0, 0.8 * (1 - particle.life / particle.maxLife))

      return particle.life < particle.maxLife
    })
  }

  const updateDarkRipples = (ripples: DarkRipple[]) => {
    return ripples.filter(ripple => {
      ripple.life++

      // 波紋の拡大
      const progress = ripple.life / ripple.maxLife
      ripple.radius = ripple.maxRadius * progress

      // フェードアウト
      ripple.opacity = Math.max(0, 0.6 * (1 - progress))

      return ripple.life < ripple.maxLife
    })
  }

  const updateDarkRays = (rays: DarkRay[]) => {
    return rays.filter(ray => {
      ray.life++

      // 光線の伸長
      const progress = ray.life / ray.maxLife
      ray.length = ray.maxLength * progress

      // フェードアウト
      ray.opacity = Math.max(0, 0.5 * (1 - progress))

      return ray.life < ray.maxLife
    })
  }

  const updateOverlay = () => {
    const progress = Math.min(1, (particlesRef.current[0]?.life || 0) / (duration / 16.67))
    overlayOpacityRef.current = Math.max(0, 0.3 * Math.sin(progress * Math.PI))
  }

  const drawDarkParticles = (ctx: CanvasRenderingContext2D, particles: DarkParticle[]) => {
    particles.forEach(particle => {
      ctx.save()
      ctx.globalAlpha = particle.opacity
      ctx.fillStyle = particle.color

      // 不規則な形状で重苦しさを演出
      ctx.beginPath()
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
      ctx.fill()

      // 内側に暗い影
      ctx.globalAlpha = particle.opacity * 0.5
      ctx.fillStyle = '#000000'
      ctx.beginPath()
      ctx.arc(particle.x, particle.y, particle.size * 0.5, 0, Math.PI * 2)
      ctx.fill()

      ctx.restore()
    })
  }

  const drawDarkRipples = (ctx: CanvasRenderingContext2D, ripples: DarkRipple[]) => {
    ripples.forEach(ripple => {
      ctx.save()
      ctx.globalAlpha = ripple.opacity
      ctx.strokeStyle = '#374151'
      ctx.lineWidth = 3

      ctx.beginPath()
      ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2)
      ctx.stroke()

      ctx.restore()
    })
  }

  const drawDarkRays = (ctx: CanvasRenderingContext2D, rays: DarkRay[]) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2

    rays.forEach(ray => {
      ctx.save()
      ctx.globalAlpha = ray.opacity

      ctx.translate(centerX, centerY)
      ctx.rotate((ray.angle * Math.PI) / 180)

      // グラデーション作成
      const gradient = ctx.createLinearGradient(0, 0, 0, ray.length)
      gradient.addColorStop(0, '#4B5563')
      gradient.addColorStop(0.5, '#6B7280')
      gradient.addColorStop(1, 'transparent')

      ctx.fillStyle = gradient
      ctx.fillRect(-2, 0, 4, ray.length)

      ctx.restore()
    })
  }

  const drawOverlay = (ctx: CanvasRenderingContext2D) => {
    const canvas = canvasRef.current
    if (!canvas) return

    ctx.save()
    ctx.globalAlpha = overlayOpacityRef.current
    ctx.fillStyle = '#000000'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.restore()
  }

  const animate = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Update all elements
    particlesRef.current = updateDarkParticles(particlesRef.current)
    ripplesRef.current = updateDarkRipples(ripplesRef.current)
    raysRef.current = updateDarkRays(raysRef.current)
    updateOverlay()

    // Draw all elements (order matters for layering)
    drawOverlay(ctx) // Background darkening
    drawDarkRays(ctx, raysRef.current)
    drawDarkRipples(ctx, ripplesRef.current)
    drawDarkParticles(ctx, particlesRef.current)

    // Continue animation if any elements exist
    if (particlesRef.current.length > 0 ||
        ripplesRef.current.length > 0 ||
        raysRef.current.length > 0) {
      animationRef.current = requestAnimationFrame(animate)
    }
  }

  const startAnimation = () => {
    if (!canvasRef.current) return

    // Create all animation elements
    particlesRef.current = createDarkParticles()
    ripplesRef.current = createDarkRipples()
    raysRef.current = createDarkRays()

    // Start animation loop
    animate()
  }

  const stopAnimation = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }

    // Clear all elements
    particlesRef.current = []
    ripplesRef.current = []
    raysRef.current = []
    overlayOpacityRef.current = 0

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
      className="fixed inset-0 z-40 pointer-events-none"
      style={{ width: '100vw', height: '100vh' }}
    />
  )
}

export default DarkAnimationCanvas