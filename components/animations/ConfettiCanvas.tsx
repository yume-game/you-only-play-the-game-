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
  points?: number // 100または300を指定
}

const COLORS = ["#FF5252", "#FFD740", "#64FFDA", "#448AFF", "#E040FB", "#69F0AE", "#FFAB40", "#FF1744", "#00E676", "#00B0FF"]

const ConfettiCanvas: React.FC<ConfettiCanvasProps> = ({
  isActive,
  duration = 2000,
  particleCount = 50,
  points
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | undefined>(undefined)
  const particlesRef = useRef<Particle[]>([])
  const pointsTextScaleRef = useRef(0)

  const createParticles = () => {
    const particles: Particle[] = []
    const canvas = canvasRef.current
    if (!canvas) return particles

    // クラッカーのように中心から一気に放射状に広がる（さらに派手に！）
    for (let i = 0; i < particleCount * 2; i++) { // パーティクル数を2倍に！
      const startX = canvas.width / 2
      const startY = canvas.height / 2

      // ランダムな角度と速度で放射状に飛ばす（スピードアップ！）
      const angle = (Math.random() * Math.PI * 2)
      const speed = 15 + Math.random() * 25 // 超高速に！

      particles.push({
        x: startX,
        y: startY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 5, // より強い上向きバイアス
        rotation: 0,
        rotationSpeed: (Math.random() - 0.5) * 35, // 超高速回転！
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: 15 + Math.random() * 15, // さらに大きな紙吹雪！
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
      particle.vy += 0.4 // 重力を強化
      particle.vx *= 0.98 // 空気抵抗を少し強化
      particle.rotation += particle.rotationSpeed
      particle.life++

      // Fade out over time
      particle.opacity = Math.max(0, 1 - (particle.life / particle.maxLife))

      // Remove particles that are off-screen or expired
      return particle.life < particle.maxLife
    })
  }

  const drawParticles = (ctx: CanvasRenderingContext2D, particles: Particle[]) => {
    particles.forEach(particle => {
      ctx.save()

      ctx.globalAlpha = particle.opacity
      ctx.translate(particle.x, particle.y)
      ctx.rotate((particle.rotation * Math.PI) / 180)

      ctx.fillStyle = particle.color

      // Draw rectangle (confetti piece) with shadow for depth
      ctx.shadowColor = particle.color
      ctx.shadowBlur = 10
      const halfSize = particle.size / 2
      ctx.fillRect(-halfSize, -halfSize, particle.size, particle.size)

      ctx.restore()
    })
  }

  const drawPointsText = (ctx: CanvasRenderingContext2D) => {
    if (!points || pointsTextScaleRef.current <= 0) return

    const canvas = canvasRef.current
    if (!canvas) return

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2

    ctx.save()

    // スケールとフェードアウトの計算
    const progress = pointsTextScaleRef.current
    const scale = 0.5 + progress * 2.5 // 0.5から3.0まで拡大
    const opacity = Math.max(0, 1 - (progress - 0.5) * 2) // 後半でフェードアウト

    ctx.globalAlpha = opacity
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"

    // ポイントに応じたスタイル設定
    if (points === 300) {
      // 300ptの場合：金色、より華やか
      ctx.font = `bold ${60 * scale}px Arial`
      ctx.fillStyle = "#FFD700"
      ctx.strokeStyle = "#FF8C00"
      ctx.lineWidth = 4
      ctx.shadowColor = "#FFD700"
      ctx.shadowBlur = 30

      // 外側に光る効果
      ctx.strokeText(`+${points}pt`, centerX, centerY)
      ctx.fillText(`+${points}pt`, centerX, centerY)

      // 追加の輝き
      ctx.shadowBlur = 50
      ctx.globalAlpha = opacity * 0.5
      ctx.fillText(`+${points}pt`, centerX, centerY)
    } else {
      // 100ptの場合：白色、シンプル
      ctx.font = `bold ${50 * scale}px Arial`
      ctx.fillStyle = "#FFFFFF"
      ctx.strokeStyle = "#4CAF50"
      ctx.lineWidth = 3
      ctx.shadowColor = "#FFFFFF"
      ctx.shadowBlur = 20

      ctx.strokeText(`+${points}pt`, centerX, centerY)
      ctx.fillText(`+${points}pt`, centerX, centerY)
    }

    ctx.restore()
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

    // ポイントテキストのアニメーション
    if (pointsTextScaleRef.current < 1) {
      pointsTextScaleRef.current += 0.016 // 約60fpsで1秒かけて1.0まで到達
    }
    drawPointsText(ctx)

    // Continue animation if particles exist or points text is still animating
    if (particlesRef.current.length > 0 || pointsTextScaleRef.current < 1) {
      animationRef.current = requestAnimationFrame(animate)
    }
  }

  const startAnimation = () => {
    if (!canvasRef.current) return

    // Create new particles
    particlesRef.current = createParticles()

    // Reset points text scale
    pointsTextScaleRef.current = 0

    // Start animation loop
    animate()
  }

  const stopAnimation = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }
    particlesRef.current = []
    pointsTextScaleRef.current = 0

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
