"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface Node {
  id: number;
  title: string;
  next: string | null;
  x: number;
  y: number;
  radius: number;
}

interface props {
  data: { title: string; next: string }[];
}

const Graph = ({ data }: props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<Node[]>([]);
  const animationRef = useRef<number>(0);
  const dragNodeRef = useRef<Node | null>(null);
  const [hoveredNode, setHoveredNode] = useState<Node | null>(null);

  const computeLayout = useCallback(
    (width: number, height: number) => {
      const nodeRadius = 24;
      const rowHeight = nodeRadius * 2 + 50;
      const colWidth = 220;
      const startY = rowHeight + 20;
      const centerX = width / 2;

      let x = centerX;
      let y = startY;
      let direction = 1;

      return data.map((d, i) => {
        const node: Node = {
          id: i,
          title: d.title,
          next: d.next,
          x,
          y,
          radius: nodeRadius,
        };

        y += rowHeight * direction;

        if (y > height - rowHeight) {
          x += colWidth;
          direction = -1;
          y = height - rowHeight;
        } else if (y < startY) {
          x += colWidth;
          direction = 1;
          y = startY;
        }

        return node;
      });
    },
    [data],
  );

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    nodesRef.current = computeLayout(canvas.width, canvas.height);
  }, [computeLayout]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const nodes = nodesRef.current;
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.lineWidth = 3;
    for (const node of nodes) {
      if (!node.next) continue;
      const target = nodes.find((n) => n.title === node.next);
      if (!target) continue;

      const sameCol = Math.abs(node.x - target.x) < 10;

      ctx.beginPath();
      ctx.strokeStyle = "rgba(240, 218, 194, 0.6)";

      if (sameCol) {
        const goingDown = target.y > node.y;
        ctx.moveTo(node.x, node.y + (goingDown ? node.radius : -node.radius));
        ctx.lineTo(
          target.x,
          target.y + (goingDown ? -target.radius : target.radius),
        );
      } else {
        const exitY = node.y + node.radius;
        const enterY = target.y - target.radius;
        const midY = (exitY + enterY) / 2;

        ctx.moveTo(node.x, exitY);
        ctx.bezierCurveTo(node.x, midY, target.x, midY, target.x, enterY);
      }
      ctx.stroke();

      const fromY = node.y + (target.y > node.y ? node.radius : -node.radius);
      const toY =
        target.y + (target.y > node.y ? -target.radius : target.radius);
      const mx = (node.x + target.x) / 2;
      const my = (fromY + toY) / 2;
      const angle = Math.atan2(toY - fromY, target.x - node.x);

      ctx.save();
      ctx.translate(mx, my);
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.moveTo(10, 0);
      ctx.lineTo(-5, -6);
      ctx.lineTo(-5, 6);
      ctx.closePath();
      ctx.fillStyle = "rgba(240, 218, 194, 0.8)";
      ctx.fill();
      ctx.restore();
    }

    for (const node of nodes) {
      const isHovered = hoveredNode?.id === node.id;

      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      ctx.fillStyle = isHovered ? "#f0dac2" : "rgba(240, 218, 194, 0.15)";
      ctx.fill();
      ctx.strokeStyle = "#f0dac2";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = isHovered ? "#111212" : "#f0dac2";
      ctx.font = "13px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const maxChars = 18;
      const label =
        node.title.length > maxChars
          ? node.title.slice(0, maxChars - 1) + "…"
          : node.title;
      ctx.fillText(label, node.x, node.y);
    }
  }, [hoveredNode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      nodesRef.current = computeLayout(canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);

    const loop = () => {
      draw();
      animationRef.current = requestAnimationFrame(loop);
    };
    animationRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [draw, computeLayout]);

  const getNodeAt = (x: number, y: number): Node | null => {
    const nodes = nodesRef.current;
    for (let i = nodes.length - 1; i >= 0; i--) {
      const dx = nodes[i].x - x;
      const dy = nodes[i].y - y;
      if (dx * dx + dy * dy < nodes[i].radius * nodes[i].radius) {
        return nodes[i];
      }
    }
    return null;
  };

  const toCanvasCoords = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const { x, y } = toCanvasCoords(e);
    const node = getNodeAt(x, y);
    setHoveredNode(node);

    if (dragNodeRef.current) {
      dragNodeRef.current.x = x;
      dragNodeRef.current.y = y;
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const { x, y } = toCanvasCoords(e);
    dragNodeRef.current = getNodeAt(x, y);
  };

  const handleMouseUp = () => {
    dragNodeRef.current = null;
  };

  const handleClick = (e: React.MouseEvent) => {
    const { x, y } = toCanvasCoords(e);
    const node = getNodeAt(x, y);
    if (node) {
      window.open(`https://en.wikipedia.org/wiki/${node.title}`, "_blank");
    }
  };

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full cursor-crosshair"
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onClick={handleClick}
    />
  );
};

export default Graph;
