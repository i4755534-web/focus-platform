'use client';

import { motion } from 'framer-motion';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';

interface QuantumParticle {
  id: number;
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  charge: number;
  connections: number[];
  type: 'proton' | 'electron' | 'neutron' | 'quark';
}

interface NeuralNode {
  id: number;
  x: number;
  y: number;
  z: number;
  activation: number;
  connections: number[];
  type: 'input' | 'hidden' | 'output';
}

export default function HolographicBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [particles, setParticles] = useState<QuantumParticle[]>([]);
  const [neuralNodes, setNeuralNodes] = useState<NeuralNode[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const animationRef = useRef<number>(0);

  // Generate quantum particles
  const generateQuantumField = (): QuantumParticle[] => {
    const particles: QuantumParticle[] = [];
    const types: QuantumParticle['type'][] = ['proton', 'electron', 'neutron', 'quark'];

    for (let i = 0; i < 150; i++) {
      particles.push({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        z: Math.random() * 1000 - 500,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        vz: (Math.random() - 0.5) * 2,
        charge: Math.random() * 2 - 1,
        connections: [],
        type: types[Math.floor(Math.random() * types.length)],
      });
    }

    // Create quantum entanglements
    particles.forEach(particle => {
      const connectionCount = Math.floor(Math.random() * 3) + 1;
      for (let i = 0; i < connectionCount; i++) {
        const targetId = Math.floor(Math.random() * particles.length);
        if (targetId !== particle.id && !particle.connections.includes(targetId)) {
          particle.connections.push(targetId);
        }
      }
    });

    return particles;
  };

  // Generate neural network
  const generateNeuralNetwork = (): NeuralNode[] => {
    const nodes: NeuralNode[] = [];

    // Input layer
    for (let i = 0; i < 8; i++) {
      nodes.push({
        id: i,
        x: 100,
        y: 100 + i * 80,
        z: 0,
        activation: Math.random(),
        connections: [],
        type: 'input',
      });
    }

    // Hidden layers
    for (let layer = 0; layer < 3; layer++) {
      for (let i = 0; i < 6; i++) {
        nodes.push({
          id: nodes.length,
          x: 300 + layer * 200,
          y: 140 + i * 60,
          z: layer * 50,
          activation: Math.random(),
          connections: [],
          type: 'hidden',
        });
      }
    }

    // Output layer
    for (let i = 0; i < 4; i++) {
      nodes.push({
        id: nodes.length,
        x: window.innerWidth - 100,
        y: 200 + i * 100,
        z: 0,
        activation: Math.random(),
        connections: [],
        type: 'output',
      });
    }

    // Create connections
    nodes.forEach((node, index) => {
      if (node.type === 'input') {
        // Connect to first hidden layer
        for (let i = 8; i < 14; i++) {
          if (Math.random() > 0.7) node.connections.push(i);
        }
      } else if (node.type === 'hidden') {
        const layerStart = Math.floor((index - 8) / 6) * 6 + 8;
        const nextLayerStart = layerStart + 6;
        if (nextLayerStart < nodes.length - 4) {
          for (let i = nextLayerStart; i < nextLayerStart + 6; i++) {
            if (Math.random() > 0.6) node.connections.push(i);
          }
        } else {
          // Connect to output
          for (let i = nodes.length - 4; i < nodes.length; i++) {
            if (Math.random() > 0.5) node.connections.push(i);
          }
        }
      }
    });

    return nodes;
  };

  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;

    // eslint-disable-next-line react-hooks/exhaustive-deps
    setParticles(generateQuantumField());
    // eslint-disable-next-line react-hooks/exhaustive-deps
    setNeuralNodes(generateNeuralNetwork());

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    if (!canvasRef.current || particles.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update particles
      setParticles(prevParticles =>
        prevParticles.map(particle => {
          // Quantum field interactions
          const forceX = (mousePosition.x - particle.x) * 0.0001 * particle.charge;
          const forceY = (mousePosition.y - particle.y) * 0.0001 * particle.charge;

          return {
            ...particle,
            x: particle.x + particle.vx + forceX,
            y: particle.y + particle.vy + forceY,
            z: particle.z + particle.vz,
            vx: particle.vx * 0.99 + (Math.random() - 0.5) * 0.1,
            vy: particle.vy * 0.99 + (Math.random() - 0.5) * 0.1,
            vz: particle.vz * 0.99 + (Math.random() - 0.5) * 0.1,
          };
        })
      );

      // Draw quantum field
      particles.forEach(particle => {
        const screenX = particle.x;
        const screenY = particle.y;
        const scale = 1 + particle.z / 1000;

        if (screenX < 0 || screenX > canvas.width || screenY < 0 || screenY > canvas.height) return;

        // Draw particle
        ctx.save();
        ctx.globalAlpha = 0.8;
        ctx.translate(screenX, screenY);
        ctx.scale(scale, scale);

        const colors = {
          proton: '#ff4444',
          electron: '#4444ff',
          neutron: '#44ff44',
          quark: '#ff44ff',
        };

        ctx.fillStyle = colors[particle.type];
        ctx.shadowColor = colors[particle.type];
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(0, 0, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();

        // Draw quantum connections
        particle.connections.forEach(targetId => {
          const target = particles[targetId];
          if (!target) return;

          const distance = Math.sqrt(
            Math.pow(target.x - particle.x, 2) + Math.pow(target.y - particle.y, 2)
          );

          if (distance < 200) {
            ctx.save();
            ctx.globalAlpha = (200 - distance) / 200 * 0.3;
            ctx.strokeStyle = colors[particle.type];
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(target.x, target.y);
            ctx.stroke();
            ctx.restore();
          }
        });
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [particles, mousePosition]);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Holographic Grid */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(108, 67, 255, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(108, 67, 255, 0.1) 1px, transparent 1px),
              radial-gradient(circle at 50% 50%, rgba(0, 243, 255, 0.05) 0%, transparent 50%)
            `,
            backgroundSize: '80px 80px, 80px 80px, 400px 400px',
            animation: 'grid-drift 20s ease-in-out infinite',
          }}
        />
      </div>

      {/* Quantum Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{ mixBlendMode: 'screen' }}
      />

      {/* Neural Network Visualization */}
      <svg className="absolute inset-0 w-full h-full">
        {neuralNodes.map(node => (
          <g key={node.id}>
            {/* Neural connections */}
            {node.connections.map(targetId => {
              const target = neuralNodes[targetId];
              if (!target) return null;

              return (
                <motion.line
                  key={`${node.id}-${targetId}`}
                  x1={node.x}
                  y1={node.y}
                  x2={target.x}
                  y2={target.y}
                  stroke="rgba(108, 67, 255, 0.3)"
                  strokeWidth="2"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, delay: Math.random() * 2 }}
                />
              );
            })}

            {/* Neural nodes */}
            <motion.circle
              cx={node.x}
              cy={node.y}
              r="8"
              fill={node.type === 'input' ? '#ff4444' : node.type === 'output' ? '#44ff44' : '#4444ff'}
              opacity={node.activation}
              animate={{
                r: [8, 12, 8],
                opacity: [node.activation * 0.5, node.activation, node.activation * 0.5],
              }}
              transition={{
                duration: 2 + (node.id * 0.1) % 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </g>
        ))}
      </svg>

      {/* Holographic UI Elements */}
      <div className="absolute top-4 left-4">
        <motion.div
          className="px-4 py-2 bg-black/20 backdrop-blur-sm border border-cyan-500/30 rounded-lg"
          animate={{
            boxShadow: [
              '0 0 20px rgba(0, 243, 255, 0.3)',
              '0 0 40px rgba(0, 243, 255, 0.6)',
              '0 0 20px rgba(0, 243, 255, 0.3)',
            ],
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <div className="text-cyan-400 text-sm font-mono">
            NEURAL LINK: ACTIVE
          </div>
          <div className="text-purple-400 text-xs">
            QUANTUM FIELD: STABLE
          </div>
        </motion.div>
      </div>

      {/* VR Interface Hints */}
      <div className="absolute bottom-4 right-4">
        <motion.div
          className="flex items-center space-x-2 text-cyan-400/70 text-sm"
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
          <span>VR MODE READY</span>
        </motion.div>
      </div>

      {/* Cyberpunk Scanlines */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="w-full h-full opacity-10"
          style={{
            background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(108, 67, 255, 0.1) 2px, rgba(108, 67, 255, 0.1) 4px)',
            animation: 'scanlines 2s linear infinite',
          }}
        />
      </div>
    </div>
  );
}