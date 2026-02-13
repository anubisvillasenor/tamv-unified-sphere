import { useEffect, useRef, memo } from "react";

const MatrixRain = memo(() => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const chars = "TAMV01ISABELLA NVIDA MSR ΔΩΣ∞◆◇▣▢⬡⬢".split("");
    const fontSize = 13;
    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = Array(columns).fill(1);

    const draw = () => {
      ctx.fillStyle = "rgba(2, 2, 2, 0.06)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Alternate between metallic blue, silver, and pearl white
        const colorChoice = Math.random();
        if (colorChoice > 0.7) {
          ctx.fillStyle = `hsla(210, 80%, 58%, ${0.15 + Math.random() * 0.25})`;
        } else if (colorChoice > 0.4) {
          ctx.fillStyle = `hsla(210, 8%, 65%, ${0.1 + Math.random() * 0.2})`;
        } else {
          ctx.fillStyle = `hsla(210, 30%, 90%, ${0.05 + Math.random() * 0.15})`;
        }

        ctx.font = `${fontSize}px 'Space Grotesk', monospace`;
        ctx.fillText(char, x, y);

        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.4 }}
    />
  );
});

MatrixRain.displayName = "MatrixRain";
export default MatrixRain;
