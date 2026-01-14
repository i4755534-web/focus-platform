'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

interface QuantumPortal {
  id: number;
  x: number;
  y: number;
  radius: number;
  phase: number;
  dimension: number;
  stability: number;
}

interface NeuralFlash {
  id: number;
  x: number;
  y: number;
  intensity: number;
  frequency: number;
  timestamp: number;
}

interface RealityDistortion {
  id: number;
  x: number;
  y: number;
  strength: number;
  type: 'space-time' | 'quantum' | 'neural';
  duration: number;
}

export default function QuantumRealityEngine() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [portals, setPortals] = useState<QuantumPortal[]>([]);
  const [flashes, setFlashes] = useState<NeuralFlash[]>([]);
  const [distortions, setDistortions] = useState<RealityDistortion[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [aiPredictions, setAiPredictions] = useState<string[]>([]);
  const animationRef = useRef<number>(0);

  // Generate quantum portals
  const generatePortals = (): QuantumPortal[] => {
    const portals: QuantumPortal[] = [];
    for (let i = 0; i < 5; i++) {
      portals.push({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        radius: 50 + Math.random() * 100,
        phase: Math.random() * Math.PI * 2,
        dimension: Math.floor(Math.random() * 11) + 1, // Dimensions 1-11
        stability: Math.random(),
      });
    }
    return portals;
  };

  // Generate neural flashes
  const generateNeuralFlash = (x: number, y: number): NeuralFlash => ({
    id: Date.now() + Math.random(),
    x,
    y,
    intensity: Math.random() * 0.8 + 0.2,
    frequency: Math.random() * 10 + 5,
    timestamp: Date.now(),
  });

  // Generate reality distortions
  const generateDistortion = (): RealityDistortion => ({
    id: Date.now() + Math.random(),
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    strength: Math.random() * 0.5 + 0.1,
    type: ['space-time', 'quantum', 'neural'][Math.floor(Math.random() * 3)] as RealityDistortion['type'],
    duration: Math.random() * 3000 + 1000,
  });

  // AI Interface predictions
  const aiInterfacePredictions = [
    "КВАНТОВЫЙ СИНХРОНИЗАЦИЯ: 99.7%",
    "НЕЙРОННАЯ СВЯЗЬ: УСТАНОВЛЕНА",
    "РЕАЛЬНОСТЬ: СТАБИЛЬНА",
    "ИИ ПРЕДСКАЗАНИЕ: ПОЛЬЗОВАТЕЛЬ АКТИВЕН",
    "КВАНТОВОЕ ПОЛЕ: ГАРМОНИЗОВАНО",
    "НЕЙРОННЫЕ ВСПЫШКИ: ОБНАРУЖЕНЫ",
    "ВИРТУАЛЬНАЯ РЕАЛЬНОСТЬ: ГОТОВА",
    "КИБЕРПРОСТРАНСТВО: ДОСТУПНО",
  ];

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // eslint-disable-next-line react-hooks/exhaustive-deps
    setPortals(generatePortals());

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });

      // Generate neural flash on mouse movement
      if (Math.random() > 0.95) {
        setFlashes(prev => [...prev.slice(-10), generateNeuralFlash(e.clientX, e.clientY)]);
      }
    };

    const handleClick = () => {
      setDistortions(prev => [...prev.slice(-3), generateDistortion()]);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);

    // AI prediction updates
    const predictionInterval = setInterval(() => {
      setAiPredictions(prev => [
        aiInterfacePredictions[Math.floor(Math.random() * aiInterfacePredictions.length)],
        ...prev.slice(0, 2)
      ]);
    }, 2000);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      clearInterval(predictionInterval);
    };
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update portals
      setPortals(prevPortals =>
        prevPortals.map(portal => ({
          ...portal,
          phase: portal.phase + 0.02,
          stability: Math.max(0.1, portal.stability + (Math.random() - 0.5) * 0.01),
        }))
      );

      // Draw quantum portals
      portals.forEach(portal => {
        const centerX = portal.x;
        const centerY = portal.y;
        const radius = portal.radius * portal.stability;

        // Portal ring
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(portal.phase);

        // Outer ring
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, radius);
        gradient.addColorStop(0, `rgba(108, 67, 255, ${portal.stability * 0.8})`);
        gradient.addColorStop(0.5, `rgba(0, 243, 255, ${portal.stability * 0.6})`);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.fill();

        // Inner portal effect
        ctx.globalCompositeOperation = 'screen';
        ctx.fillStyle = `rgba(255, 255, 255, ${portal.stability * 0.3})`;
        ctx.beginPath();
        ctx.arc(0, 0, radius * 0.3, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();

        // Dimension indicator
        ctx.save();
        ctx.fillStyle = `rgba(255, 255, 255, ${portal.stability})`;
        ctx.font = '12px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`D${portal.dimension}`, centerX, centerY - radius - 10);
        ctx.restore();
      });

      // Draw reality distortions
      distortions.forEach(distortion => {
        const age = Date.now() - distortion.id;
        if (age > distortion.duration) return;

        const progress = age / distortion.duration;
        const alpha = (1 - progress) * distortion.strength;

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(distortion.x, distortion.y);

        if (distortion.type === 'space-time') {
          // Space-time distortion
          ctx.strokeStyle = `rgba(255, 0, 255, ${alpha})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const x = Math.cos(angle) * 50 * (1 + Math.sin(progress * 10) * 0.3);
            const y = Math.sin(angle) * 50 * (1 + Math.sin(progress * 10) * 0.3);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.closePath();
          ctx.stroke();
        } else if (distortion.type === 'quantum') {
          // Quantum uncertainty
          ctx.fillStyle = `rgba(0, 255, 255, ${alpha * 0.5})`;
          for (let i = 0; i < 20; i++) {
            const x = (Math.random() - 0.5) * 100;
            const y = (Math.random() - 0.5) * 100;
            ctx.beginPath();
            ctx.arc(x, y, 2, 0, Math.PI * 2);
            ctx.fill();
          }
        } else if (distortion.type === 'neural') {
          // Neural cascade
          ctx.strokeStyle = `rgba(255, 255, 0, ${alpha})`;
          ctx.lineWidth = 3;
          ctx.beginPath();
          for (let i = 0; i < 10; i++) {
            const x = (i - 5) * 10;
            const y = Math.sin(progress * 20 + i) * 30;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        }

        ctx.restore();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [portals, distortions]);

  // Clean up old flashes
  useEffect(() => {
    const cleanup = setInterval(() => {
      setFlashes(prev => prev.filter(flash => Date.now() - flash.timestamp < 2000));
      setDistortions(prev => prev.filter(dist => Date.now() - dist.id < dist.duration));
    }, 100);

    return () => clearInterval(cleanup);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-10">
      {/* Quantum Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{ mixBlendMode: 'screen' }}
      />

      {/* Neural Flashes */}
      <AnimatePresence>
        {flashes.map(flash => (
          <motion.div
            key={flash.id}
            className="absolute pointer-events-none"
            style={{
              left: flash.x - 50,
              top: flash.y - 50,
              width: 100,
              height: 100,
            }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{
              scale: [0, 1.5, 0],
              opacity: [1, 0.8, 0],
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div
              className="w-full h-full rounded-full"
              style={{
                background: `radial-gradient(circle, rgba(255,255,0,${flash.intensity}) 0%, rgba(255,255,0,0) 70%)`,
                boxShadow: `0 0 50px rgba(255,255,0,${flash.intensity}), 0 0 100px rgba(255,255,0,${flash.intensity * 0.5})`,
              }}
            />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Reality Distortions Overlay */}
      <div className="absolute inset-0">
        {distortions.map(distortion => (
          <motion.div
            key={distortion.id}
            className="absolute pointer-events-none"
            style={{
              left: distortion.x - 100,
              top: distortion.y - 100,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="relative">
              {distortion.type === 'space-time' && (
                <div className="w-32 h-32 border-2 border-purple-500 rounded-full animate-spin opacity-50"
                     style={{ animationDuration: '2s' }} />
              )}
              {distortion.type === 'quantum' && (
                <div className="w-32 h-32 bg-cyan-500 rounded-full animate-ping opacity-30" />
              )}
              {distortion.type === 'neural' && (
                <div className="w-32 h-32 bg-yellow-500 rounded-full animate-pulse opacity-40" />
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* AI Interface Predictions */}
      <div className="absolute top-1/2 left-4 transform -translate-y-1/2 space-y-2">
        {aiPredictions.slice(0, 3).map((prediction, index) => (
          <motion.div
            key={prediction + index}
            className="bg-black/20 backdrop-blur-sm border border-cyan-500/30 rounded px-3 py-1"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.2 }}
          >
            <div className="text-cyan-400 text-xs font-mono">
              {prediction}
            </div>
          </motion.div>
        ))}
      </div>

      {/* VR Control Interface */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <motion.div
          className="bg-black/30 backdrop-blur-sm border border-purple-500/50 rounded-full px-6 py-2 flex items-center space-x-4"
          animate={{
            boxShadow: [
              '0 0 20px rgba(108, 67, 255, 0.3)',
              '0 0 40px rgba(108, 67, 255, 0.6)',
              '0 0 20px rgba(108, 67, 255, 0.3)',
            ],
          }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
          <div className="text-purple-300 text-sm font-mono">
            QUANTUM REALITY ENGINE v2.026
          </div>
        </motion.div>
      </div>

      {/* Dimensional Portals Info */}
      <div className="absolute top-4 right-4 space-y-2">
        {portals.slice(0, 3).map(portal => (
          <motion.div
            key={portal.id}
            className="bg-black/20 backdrop-blur-sm border border-purple-500/30 rounded px-3 py-1"
            animate={{
              borderColor: portal.stability > 0.7 ? 'rgba(0, 255, 0, 0.5)' : 'rgba(108, 67, 255, 0.3)',
            }}
          >
            <div className="text-purple-400 text-xs font-mono">
              PORTAL D{portal.dimension}: {Math.round(portal.stability * 100)}%
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quantum Field Status */}
      <div className="absolute bottom-4 right-4">
        <motion.div
          className="bg-black/20 backdrop-blur-sm border border-cyan-500/30 rounded-lg p-3"
          animate={{
            boxShadow: [
              '0 0 20px rgba(0, 243, 255, 0.2)',
              '0 0 40px rgba(0, 243, 255, 0.4)',
              '0 0 20px rgba(0, 243, 255, 0.2)',
            ],
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <div className="text-cyan-400 text-xs font-mono space-y-1">
            <div>🌀 QUANTUM FIELD ACTIVE</div>
            <div>🧠 NEURAL NETWORK: ONLINE</div>
            <div>🌌 DIMENSIONS: {portals.length} OPEN</div>
            <div>⚡ POWER: {Math.round((portals.reduce((sum, p) => sum + p.stability, 0) / portals.length) * 100)}%</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}