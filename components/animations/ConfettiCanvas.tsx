"use client"

import { useEffect, useRef } from "react"

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  rotation: number
  rotationSpeed: number
  color: string
  size: number
  opacity: number
  life: number
  maxLife: number
}

interface ConfettiCanvasProps {
  isActive: boolean
  duration?: number
  particleCount?: number
}

const COLORS = ["#FF5252", "#FFD740", "#64FFDA", "#448AFF", "#E040FB", "#69F0AE", "#FFAB40"]

const ConfettiCanvas: React.FC<ConfettiCanvasProps> = ({
  isActive,
  duration = 2000,
  particleCount = 50
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | undefined>(undefined)
  const particlesRef = useRef<Particle[]>([])

  const createParticles = () => {
    const particles: Particle[] = []
    const canvas = canvasRef.current
    if (!canvas) return particles

    for (let i = 0; i < particleCount; i++) {
      const startX = canvas.width / 2 + (Math.random() - 0.5) * canvas.width
      const startY = canvas.height

      particles.push({
        x: startX,
        y: startY,
        vx: (Math.random() - 0.5) * (canvas.width * 1.5) / duration * 16.67, // Convert to px per frame
        vy: -(canvas.height + 100) / duration * 16.67 * (1 + Math.random() * 0.5), // Convert to px per frame
        rotation: 0,
        rotationSpeed: (Math.random() - 0.5) * 360 / duration * 16.67, // Convert to degrees per frame
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: 8 + Math.random() * 4,
        opacity: 1,
        life: 0,
        maxLife: duration / 16.67 // Convert to frames
      })
    }

    return particles
  }

  const updateParticles = (particles: Particle[]) => {
    return particles.filter(particle => {
      particle.x += particle.vx
      particle.y += particle.vy
      particle.rotation += particle.rotationSpeed
      particle.life++

      // Fade out over time
      particle.opacity = Math.max(0, 1 - (particle.life / particle.maxLife))

      // Remove particles that are off-screen or expired
      return particle.life < particle.maxLife && particle.y > -100
    })
  }

  const drawParticles = (ctx: CanvasRenderingContext2D, particles: Particle[]) => {
    particles.forEach(particle => {
      ctx.save()

      ctx.globalAlpha = particle.opacity
      ctx.translate(particle.x, particle.y)
      ctx.rotate((particle.rotation * Math.PI) / 180)

      ctx.fillStyle = particle.color

      // Draw rectangle (confetti piece)
      const halfSize = particle.size / 2
      ctx.fillRect(-halfSize, -halfSize, particle.size, particle.size)

      ctx.restore()
    })
  }

  const animate = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Update and draw particles
    particlesRef.current = updateParticles(particlesRef.current)
    drawParticles(ctx, particlesRef.current)

    // Continue animation if particles exist
    if (particlesRef.current.length > 0) {
      animationRef.current = requestAnimationFrame(animate)
    }
  }

  const startAnimation = () => {
    if (!canvasRef.current) return

    // Create new particles
    particlesRef.current = createParticles()

    // Start animation loop
    animate()
  }

  const stopAnimation = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }
    particlesRef.current = []

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

export default ConfettiCanvas