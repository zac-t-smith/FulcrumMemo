import { useEffect, useRef, useState } from 'react';

interface Node {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;
}

const InteractiveMesh = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<Node[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const animationRef = useRef<number>();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Gold color
  const goldColor = { r: 210, g: 170, b: 60 };

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (dimensions.width === 0 || dimensions.height === 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

    // Create hex grid of nodes
    const spacing = 80;
    const nodes: Node[] = [];
    const hexOffsetY = spacing * Math.sin(Math.PI / 3);

    for (let row = -1; row <= Math.ceil(dimensions.height / hexOffsetY) + 1; row++) {
      const offsetX = row % 2 === 0 ? 0 : spacing / 2;
      for (let col = -1; col <= Math.ceil(dimensions.width / spacing) + 1; col++) {
        const x = col * spacing + offsetX;
        const y = row * hexOffsetY;
        nodes.push({
          x,
          y,
          baseX: x,
          baseY: y,
          vx: 0,
          vy: 0,
        });
      }
    }

    nodesRef.current = nodes;

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const mouseX = mouseRef.current.x;
      const mouseY = mouseRef.current.y;
      const interactionRadius = 180;
      const maxConnectionDist = 120;
      const returnSpeed = 0.03;
      const damping = 0.85;

      // Update nodes
      for (const node of nodesRef.current) {
        // Calculate distance to mouse
        const dx = node.x - mouseX;
        const dy = node.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < interactionRadius && dist > 0) {
          // Push away from mouse
          const force = (1 - dist / interactionRadius) * 15;
          node.vx += (dx / dist) * force;
          node.vy += (dy / dist) * force;
        }

        // Spring back to base position
        node.vx += (node.baseX - node.x) * returnSpeed;
        node.vy += (node.baseY - node.y) * returnSpeed;

        // Apply damping
        node.vx *= damping;
        node.vy *= damping;

        // Update position
        node.x += node.vx;
        node.y += node.vy;
      }

      // Draw connections
      ctx.strokeStyle = `rgba(${goldColor.r}, ${goldColor.g}, ${goldColor.b}, 0.06)`;
      ctx.lineWidth = 0.5;

      for (let i = 0; i < nodesRef.current.length; i++) {
        const nodeA = nodesRef.current[i];
        for (let j = i + 1; j < nodesRef.current.length; j++) {
          const nodeB = nodesRef.current[j];
          const dx = nodeA.x - nodeB.x;
          const dy = nodeA.y - nodeB.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxConnectionDist) {
            // Check if either node is near mouse
            const distAToMouse = Math.sqrt(
              Math.pow(nodeA.x - mouseX, 2) + Math.pow(nodeA.y - mouseY, 2)
            );
            const distBToMouse = Math.sqrt(
              Math.pow(nodeB.x - mouseX, 2) + Math.pow(nodeB.y - mouseY, 2)
            );

            let opacity = 0.06;
            if (distAToMouse < interactionRadius || distBToMouse < interactionRadius) {
              opacity = 0.24;
            }

            ctx.strokeStyle = `rgba(${goldColor.r}, ${goldColor.g}, ${goldColor.b}, ${opacity})`;
            ctx.beginPath();
            ctx.moveTo(nodeA.x, nodeA.y);
            ctx.lineTo(nodeB.x, nodeB.y);
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      for (const node of nodesRef.current) {
        const distToMouse = Math.sqrt(
          Math.pow(node.x - mouseX, 2) + Math.pow(node.y - mouseY, 2)
        );

        let opacity = 0.12;
        let radius = 1.5;

        if (distToMouse < interactionRadius) {
          const factor = 1 - distToMouse / interactionRadius;
          opacity = 0.12 + factor * 0.36;
          radius = 1.5 + factor * 1;
        }

        ctx.fillStyle = `rgba(${goldColor.r}, ${goldColor.g}, ${goldColor.b}, ${opacity})`;
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [dimensions]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.7 }}
    />
  );
};

export default InteractiveMesh;
