"use client";

import Link from "next/link";
import { useEffect, useRef, useCallback, useState } from "react";

interface NodeData {
  title: string;
  next: string;
  wikiUrl?: string;
  description?: string;
}

interface Props {
  data: NodeData[];
}

interface HoverState {
  index: number;
  x: number;
  y: number;
}

const Graph = ({ data }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [hoverState, setHoverState] = useState<HoverState | null>(null);
  const [isCardHovered, setIsCardHovered] = useState(false);

  const closeTimerRef = useRef<NodeJS.Timeout | null>(null);

  const radius = 30;
  const offset = { x: 120, y: 90 };

  const getNodePos = useCallback(
    (index: number, containerHeight: number) => {
      const topPadding = 100;
      const bottomMargin = 80;

      const availableHeight = Math.max(
        offset.y,
        containerHeight - topPadding - bottomMargin,
      );
      const maxRowsPerCol = Math.max(
        1,
        Math.floor(availableHeight / offset.y) + 1,
      );

      const col = Math.floor(index / maxRowsPerCol);
      const indexInCol = index % maxRowsPerCol;

      const isEvenCol = col % 2 === 0;
      const row = isEvenCol ? indexInCol : maxRowsPerCol - 1 - indexInCol;

      const x = offset.x + col * offset.x;
      const y = topPadding + row * offset.y;

      return { x, y, col, row };
    },
    [offset.x, offset.y],
  );

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const displayHeight = canvas.offsetHeight || 400;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const positions = data.map((_, i) => getNodePos(i, displayHeight));

    for (let i = 0; i < data.length - 1; i++) {
      const current = positions[i];
      const next = positions[i + 1];

      ctx.beginPath();
      ctx.lineWidth = 4;
      ctx.strokeStyle = "#f0dac2";

      if (current.col === next.col) {
        if (current.y < next.y) {
          ctx.moveTo(current.x, current.y + radius);
          ctx.lineTo(next.x, next.y - radius);
        } else {
          ctx.moveTo(current.x, current.y - radius);
          ctx.lineTo(next.x, next.y + radius);
        }
        ctx.stroke();
      } else {
        const centerX = (current.x + next.x) / 2;
        const arcRadius = (next.x - current.x) / 2;

        if (current.col % 2 === 0) {
          ctx.arc(centerX, current.y + radius, arcRadius, Math.PI, 0, true);
        } else {
          ctx.arc(centerX, current.y - radius, arcRadius, 0, Math.PI, true);
        }
        ctx.stroke();
      }
    }

    positions.forEach((pos, i) => {
      const isHovered = hoverState?.index === i;

      ctx.beginPath();
      ctx.arc(pos.x, pos.y, radius, 0, 2 * Math.PI);

      if (isHovered) {
        ctx.fillStyle = "#f0dac2";
        ctx.fill();
      } else {
        ctx.fillStyle = "transparent";
        ctx.strokeStyle = "#f0dac2";
      }

      ctx.lineWidth = 6;
      ctx.stroke();
    });
  }, [data, getNodePos, hoverState]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const displayHeight = canvas.offsetHeight || 400;
    const positions = data.map((_, i) => getNodePos(i, displayHeight));

    let foundHover: HoverState | null = null;
    positions.forEach((pos, index) => {
      const dx = mouseX - pos.x;
      const dy = mouseY - pos.y;
      if (Math.sqrt(dx * dx + dy * dy) <= radius) {
        foundHover = { index, x: pos.x, y: pos.y };
      }
    });

    if (foundHover) {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
        closeTimerRef.current = null;
      }
      setHoverState(foundHover);
    } else if (!isCardHovered && !closeTimerRef.current) {
      closeTimerRef.current = setTimeout(() => {
        setHoverState(null);
        closeTimerRef.current = null;
      }, 400);
    }
  };

  const handleMouseLeave = () => {
    if (!isCardHovered && !closeTimerRef.current) {
      closeTimerRef.current = setTimeout(() => {
        setHoverState(null);
        closeTimerRef.current = null;
      }, 400);
    }
  };

  const handleCardMouseEnter = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setIsCardHovered(true);
  };

  const handleCardMouseLeave = () => {
    setIsCardHovered(false);
    setHoverState(null);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.scale(dpr, dpr);
      }

      draw();
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [draw]);

  const activeNode = hoverState !== null ? data[hoverState.index] : null;

  return (
    <div className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="w-full h-full cursor-pointer block"
      />

      {hoverState && activeNode && (
        <div
          ref={cardRef}
          onMouseEnter={handleCardMouseEnter}
          onMouseLeave={handleCardMouseLeave}
          style={{
            position: "absolute",
            left: `${hoverState.x + radius + 12}px`,
            top: `${hoverState.y - radius}px`,
          }}
          className="z-50 w-fit rounded-lg bg-[#f0dac2] border p-3 shadow-xl text-black transition-opacity duration-300 before:absolute before:-left-3 before:top-0 before:w-3 before:h-full"
        >
          <h4 className="font-bold text-xl">{activeNode.title}</h4>
          <Link
            href={`https://en.wikipedia.org/wiki/${activeNode.title}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block text-xs font-semibold underline text-black hover:text-slate-700"
          >
            {`https://en.wikipedia.org/wiki/${activeNode.title}`}
          </Link>
        </div>
      )}
    </div>
  );
};

export default Graph;
