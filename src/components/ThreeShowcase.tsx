import React, { useRef, useEffect, useState } from "react";
import { Rotate3d, Sun, Sparkles, Sliders } from "lucide-react";

interface Point3D {
  x: number;
  y: number;
  z: number;
}

interface Face {
  indices: number[];
  color: string;
  isFront?: boolean;
}

export default function ThreeShowcase() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  // Interactive Customization states
  const [teeColor, setTeeColor] = useState<"black" | "olive" | "sand">("black");
  const [printDesign, setPrintDesign] = useState<"shonalu" | "minimal" | "rebel">("shonalu");
  const [isWireframe, setIsWireframe] = useState<boolean>(false);
  const [isRotating, setIsRotating] = useState<boolean>(true);
  const [lightIntensity, setLightIntensity] = useState<number>(1.2);

  // 3D coordinates and rotation state
  const rotRef = useRef<{ x: number; y: number; z: number }>({ x: -0.15, y: 0.6, z: 0 });
  const mouseRef = useRef<{ dragging: boolean; lastX: number; lastY: number }>({
    dragging: false,
    lastX: 0,
    lastY: 0,
  });

  // Color mappings
  const getColorHex = (col: "black" | "olive" | "sand") => {
    switch (col) {
      case "olive": return { base: [45, 65, 50], specular: [120, 160, 130] };
      case "sand": return { base: [180, 168, 150], specular: [240, 230, 215] };
      default: return { base: [20, 20, 22], specular: [90, 95, 105] };
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = canvas.width;
    let height = canvas.height;

    // Handle responsiveness
    const resizeCanvas = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (rect) {
        // High DPI support
        const dpi = window.devicePixelRatio || 1;
        canvas.width = rect.width * dpi;
        canvas.height = rect.height * dpi;
        canvas.style.width = `${rect.width}px`;
        canvas.style.height = `${rect.height}px`;
        width = canvas.width;
        height = canvas.height;
      }
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // 3D vertices of an oversized Boxy Streetwear T-shirt
    // Centered at [0,0,0], scale approx 1 unit = 15px
    const rawVertices: Point3D[] = [
      // Torso Front
      { x: -5, y: 10, z: 2 },   // 0: Collar left front
      { x: 5, y: 10, z: 2 },    // 1: Collar right front
      { x: -9, y: 9, z: 2 },    // 2: Shoulder left front
      { x: 9, y: 9, z: 2 },     // 3: Shoulder right front
      { x: -9, y: 2, z: 2 },    // 4: Armpit left front
      { x: 9, y: 2, z: 2 },     // 5: Armpit right front
      { x: -10, y: -12, z: 2.2 }, // 6: Hem left front (oversized boxy flare)
      { x: 10, y: -12, z: 2.2 },  // 7: Hem right front

      // Torso Back
      { x: -5, y: 10.5, z: -2 }, // 8: Collar left back
      { x: 5, y: 10.5, z: -2 },  // 9: Collar right back
      { x: -9, y: 9, z: -2 },    // 10: Shoulder left back
      { x: 9, y: 9, z: -2 },     // 11: Shoulder right back
      { x: -9, y: 2, z: -2 },    // 12: Armpit left back
      { x: 9, y: 2, z: -2 },     // 13: Armpit right back
      { x: -10, y: -12, z: -2.2 }, // 14: Hem left back
      { x: 10, y: -12, z: -2.2 },  // 15: Hem right back

      // Left Sleeve Outer Ends
      { x: -16, y: 5, z: 1.5 },  // 16: Sleeve top outer left front
      { x: -15, y: 1, z: 1.5 },  // 17: Sleeve bottom outer left front
      { x: -16, y: 5, z: -1.5 }, // 18: Sleeve top outer left back
      { x: -15, y: 1, z: -1.5 }, // 19: Sleeve bottom outer left back

      // Right Sleeve Outer Ends
      { x: 16, y: 5, z: 1.5 },   // 20: Sleeve top outer right front
      { x: 15, y: 1, z: 1.5 },   // 21: Sleeve bottom outer right front
      { x: 16, y: 5, z: -1.5 },  // 22: Sleeve top outer right back
      { x: 15, y: 1, z: -1.5 }    // 23: Sleeve bottom outer right back
    ];

    // Connect vertices into structured Polygons
    const faces: Face[] = [
      // Body Front Panel
      { indices: [0, 2, 4, 6, 7, 5, 3, 1], color: "body", isFront: true },
      // Body Back Panel
      { indices: [8, 9, 11, 13, 15, 14, 12, 10], color: "body" },
      
      // Shoulder top connections (Left, Neck, Right)
      { indices: [0, 8, 10, 2], color: "seam" },
      { indices: [1, 3, 11, 9], color: "seam" },

      // Left Sleeve Panels
      { indices: [2, 10, 18, 16], color: "sleeve" },  // Sleeve top left
      { indices: [4, 12, 19, 17], color: "sleeve" },  // Sleeve bottom left
      { indices: [16, 18, 19, 17], color: "cuff" },  // Sleeve cuff left
      { indices: [2, 16, 17, 4], color: "sleeve", isFront: true },  // Sleeve face left

      // Right Sleeve Panels
      { indices: [3, 11, 22, 20], color: "sleeve" },  // Sleeve top right
      { indices: [5, 13, 23, 21], color: "sleeve" },  // Sleeve bottom right
      { indices: [20, 22, 23, 21], color: "cuff" },  // Sleeve cuff right
      { indices: [3, 20, 21, 5], color: "sleeve", isFront: true },  // Sleeve face right

      // Side Seams
      { indices: [4, 6, 14, 12], color: "seam" },
      { indices: [5, 7, 15, 13], color: "seam" },
      
      // Bottom Hem hole
      { indices: [6, 7, 15, 14], color: "hem" }
    ];

    // Background particle dust
    const stars: { x: number; y: number; z: number; size: number; speed: number }[] = [];
    for (let i = 0; i < 40; i++) {
      stars.push({
        x: (Math.random() - 0.5) * 60,
        y: (Math.random() - 0.5) * 60,
        z: (Math.random() - 0.5) * 60,
        size: Math.random() * 2 + 1,
        speed: Math.random() * 0.05 + 0.02
      });
    }

    // 3D rotation and projection matrices helper
    const rotatePoint = (pt: Point3D, rx: number, ry: number, rz: number): Point3D => {
      // Rotate Y
      const cosY = Math.cos(ry);
      const sinY = Math.sin(ry);
      let x1 = pt.x * cosY - pt.z * sinY;
      let z1 = pt.x * sinY + pt.z * cosY;

      // Rotate X
      const cosX = Math.cos(rx);
      const sinX = Math.sin(rx);
      let y2 = pt.y * cosX - z1 * sinX;
      let z2 = pt.y * sinX + z1 * cosX;

      // Rotate Z
      const cosZ = Math.cos(rz);
      const sinZ = Math.sin(rz);
      let x3 = x1 * cosZ - y2 * sinZ;
      let y3 = x1 * sinZ + y2 * cosZ;

      return { x: x3, y: y3, z: z2 };
    };

    // Main animation loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Gradient clean background representing a subtle dark studio
      const bgGrad = ctx.createRadialGradient(width / 2, height / 2, 10, width / 2, height / 2, Math.max(width, height) * 0.7);
      bgGrad.addColorStop(0, "rgba(22, 22, 26, 0.45)");
      bgGrad.addColorStop(1, "rgba(10, 10, 10, 0.95)");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Auto rotation update
      if (isRotating && !mouseRef.current.dragging) {
        rotRef.current.y += 0.008;
        rotRef.current.x = -0.15 + Math.sin(Date.now() * 0.001) * 0.08;
      }

      const rx = rotRef.current.x;
      const ry = rotRef.current.y;
      const rz = rotRef.current.z;

      // 1. Render and update background floating particles (stars) in 3D
      stars.forEach(s => {
        s.z += s.speed;
        if (s.z > 30) {
          s.z = -30;
          s.x = (Math.random() - 0.5) * 60;
          s.y = (Math.random() - 0.5) * 60;
        }

        const rotated = rotatePoint(s, rx, ry, rz);
        // Perspective divide
        const fov = 40;
        const scale = fov / (fov + rotated.z);
        const projX = (rotated.x * scale * 12) + width / 2;
        const projY = (-rotated.y * scale * 12) + height / 2;

        if (projX >= 0 && projX <= width && projY >= 0 && projY <= height) {
          ctx.beginPath();
          ctx.arc(projX, projY, s.size * scale, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${0.12 * scale})`;
          ctx.fill();
        }
      });

      // 2. Rotate all vertices of the T-shirt
      const projected: { x: number; y: number; z: number; projX: number; projY: number }[] = rawVertices.map(v => {
        // Floating motion
        const floatOffset = Math.sin(Date.now() * 0.0015) * 0.8;
        const pt = { ...v, y: v.y + floatOffset };

        const rot = rotatePoint(pt, rx, ry, rz);
        // Perspective projection
        const fov = 35;
        const perspectiveScale = fov / (fov + rot.z);
        // Adjust display sizing based on viewport size
        const baseSizeMultiplier = Math.min(width, height) * 0.024;
        
        return {
          x: rot.x,
          y: rot.y,
          z: rot.z,
          projX: (rot.x * perspectiveScale * baseSizeMultiplier) + width / 2,
          projY: (-rot.y * perspectiveScale * baseSizeMultiplier) + height / 2
        };
      });

      // 3. Compute faces depths and sorting for correct painter's algorithm (Back to Front)
      const sortedFaces = faces.map((face, index) => {
        // Calculate average Z depth of the face vertices
        let avgZ = 0;
        face.indices.forEach(idx => {
          avgZ += projected[idx].z;
        });
        avgZ /= face.indices.length;

        // Calculate normal vector of the face to compute lighting (using first 3 vertices of the face)
        const v0 = rawVertices[face.indices[0]];
        const v1 = rawVertices[face.indices[1]];
        const v2 = rawVertices[face.indices[2]];

        // Float-adjusted
        const floatOffset = Math.sin(Date.now() * 0.0015) * 0.8;
        const rotV0 = rotatePoint({ ...v0, y: v0.y + floatOffset }, rx, ry, rz);
        const rotV1 = rotatePoint({ ...v1, y: v1.y + floatOffset }, rx, ry, rz);
        const rotV2 = rotatePoint({ ...v2, y: v2.y + floatOffset }, rx, ry, rz);

        // Vector A = V1 - V0
        const ax = rotV1.x - rotV0.x;
        const ay = rotV1.y - rotV0.y;
        const az = rotV1.z - rotV0.z;

        // Vector B = V2 - V0
        const bx = rotV2.x - rotV0.x;
        const by = rotV2.y - rotV0.y;
        const bz = rotV2.z - rotV0.z;

        // Cross Product = Normal Vector
        let nx = ay * bz - az * by;
        let ny = az * bx - ax * bz;
        let nz = ax * by - ay * bx;

        // Normalize normal
        const len = Math.sqrt(nx*nx + ny*ny + nz*nz);
        if (len > 0) {
          nx /= len;
          ny /= len;
          nz /= len;
        }

        return { face, avgZ, nx, ny, nz, index };
      }).sort((a, b) => b.avgZ - a.avgZ); // Sort descending (back faces first, front faces last)

      // Light source vector coming from top-right-front
      const light = { x: 0.5, y: 0.8, z: -1.0 };
      const lightLen = Math.sqrt(light.x**2 + light.y**2 + light.z**2);
      const lX = light.x / lightLen;
      const lY = light.y / lightLen;
      const lZ = light.z / lightLen;

      // 4. Draw each page face
      const activeColors = getColorHex(teeColor);

      sortedFaces.forEach(({ face, nx, ny, nz }) => {
        // Calculate backface culling
        // Since coordinate system has Y going up and camera looks down +Z
        if (nz > 0.05 && !isWireframe && face.color !== "seam" && face.color !== "hem") {
          // It's facing away, we can optionally cull it to avoid internal visual glitches
          // keep some side panels though
        }

        ctx.beginPath();
        face.indices.forEach((idx, i) => {
          const pt = projected[idx];
          if (i === 0) ctx.moveTo(pt.projX, pt.projY);
          else ctx.lineTo(pt.projX, pt.projY);
        });
        ctx.closePath();

        if (isWireframe) {
          // Minimal high-tech laser green/cyan grid lines
          ctx.strokeStyle = `rgba(37, 99, 235, 0.45)`;
          ctx.lineWidth = 1;
          ctx.stroke();
          ctx.fillStyle = "rgba(17, 24, 39, 0.2)";
          ctx.fill();
        } else {
          // Phong/diffuse lighting calculation
          // Dot product
          const dot = nx * lX + ny * lY + nz * lZ;
          const diffuse = Math.max(0, dot) * lightIntensity;
          
          // Ambient lighting
          const ambient = 0.22;
          const tone = Math.min(1.0, ambient + diffuse);

          // Specular reflection highlight
          const viewZ = -1; // camera looks down Z
          const hX = lX;
          const hY = lY;
          const hZ = lZ + viewZ;
          const hLen = Math.sqrt(hX**2 + hY**2 + hZ**2);
          const specDot = Math.max(0, nx * (hX/hLen) + ny * (hY/hLen) + nz * (hZ/hLen));
          const specular = Math.pow(specDot, 12) * 0.24 * lightIntensity;

          // Color interpolations
          const r = Math.round(activeColors.base[0] * tone + activeColors.specular[0] * specular);
          const g = Math.round(activeColors.base[1] * tone + activeColors.specular[1] * specular);
          const b = Math.round(activeColors.base[2] * tone + activeColors.specular[2] * specular);

          ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
          ctx.fill();

          // Subtle outlines to make it look highly clean and precise (Apple aesthetic)
          ctx.strokeStyle = `rgba(${r + 30}, ${g + 32}, ${b + 40}, 0.55)`;
          ctx.lineWidth = 0.8;
          ctx.stroke();

          // 5. Draw interactive graphic on the CHEST panel if it's the front face
          if (face.isFront && nz < 0 && !isWireframe) {
            // Let's project the center chest coords
            // Chest is roughly between vertices 0, 1, 4, 5
            const midX = (projected[0].projX + projected[1].projX + projected[4].projX + projected[5].projX) / 4;
            const midY = (projected[0].projY + projected[1].projY + projected[4].projY + projected[5].projY) / 4;

            // Calculate rotational tilt of the brand graphic
            // Angle of neck line (0->1) represents horizontal tilt
            const dX = projected[1].projX - projected[0].projX;
            const dY = projected[1].projY - projected[0].projY;
            const angle = Math.atan2(dY, dX);

            // Vector size scale
            const scaleWidth = Math.sqrt(dX**2 + dY**2);
            
            ctx.save();
            ctx.translate(midX, midY + scaleWidth * 0.12); // Position on lower chest
            ctx.rotate(angle);

            // Draw graphic print with high-contrast luxury glow
            if (printDesign === "shonalu") {
              // Shonalu golden design
              ctx.shadowColor = "rgba(234, 179, 8, 0.4)";
              ctx.shadowBlur = 10;
              ctx.fillStyle = "#EAB308"; // Golden/Yellow SHONALU
              ctx.font = "bold 9px 'JetBrains Mono', sans-serif";
              ctx.textAlign = "center";
              ctx.fillText("BONGVERSE", 0, -4);
              ctx.fillStyle = "rgba(255,255,255,0.72)";
              ctx.font = "5px 'Inter', sans-serif";
              ctx.fillText("SHONALU 2026", 0, 3);
            } else if (printDesign === "minimal") {
              // Minimal glass logo
              ctx.fillStyle = "rgba(255,255,255,0.85)";
              ctx.font = "bold 9px 'Inter', sans-serif";
              ctx.textAlign = "center";
              ctx.fillText("B O N G", 0, -3);
              ctx.fillStyle = "#3B82F6"; // Accent blue
              ctx.font = "bold 6px 'Inter', sans-serif";
              ctx.fillText("V E R S E", 0, 4);
            } else {
              // REBEL Art embroidery
              ctx.fillStyle = "#EF4444"; // Vivid rebel red
              ctx.font = "bold 8px 'JetBrains Mono', sans-serif";
              ctx.textAlign = "center";
              ctx.fillText("DUKHEE", 0, -3);
              ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
              ctx.font = "4px 'JetBrains Mono', sans-serif";
              ctx.fillText("rebellious art collective", 0, 3);
            }
            ctx.restore();
          }
        }
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [teeColor, printDesign, isWireframe, isRotating, lightIntensity]);

  // Handle drag/mouse rotation
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    mouseRef.current.dragging = true;
    mouseRef.current.lastX = e.clientX;
    mouseRef.current.lastY = e.clientY;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!mouseRef.current.dragging) return;
    const deltaX = e.clientX - mouseRef.current.lastX;
    const deltaY = e.clientY - mouseRef.current.lastY;

    rotRef.current.y += deltaX * 0.007;
    rotRef.current.x += deltaY * 0.007;

    // Limit X rotation to avoid looking inverted
    rotRef.current.x = Math.max(-0.6, Math.min(0.6, rotRef.current.x));

    mouseRef.current.lastX = e.clientX;
    mouseRef.current.lastY = e.clientY;
  };

  const handleMouseUpOrLeave = () => {
    mouseRef.current.dragging = false;
  };

  return (
    <div className="w-full relative py-8 px-4 sm:px-6 lg:px-8 border border-neutral-100 dark:border-neutral-900 rounded-3xl bg-neutral-50 dark:bg-[#0F0F0F] overflow-hidden shadow-2xl transition-all duration-300">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Side: Controls Panel */}
        <div className="lg:col-span-4 z-10 space-y-6">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-mono font-medium tracking-wide rounded-full text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/40 border border-blue-200/50 dark:border-blue-900/30">
              <Rotate3d className="w-3.5 h-3.5 animate-spin-slow" />
              Interactive 3D Engine
            </span>
            <h3 className="text-2xl sm:text-3xl font-sans font-bold tracking-tight text-neutral-900 dark:text-white">
              Studio Customizer
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
              Drag, rotate, and redesign the oversized streetwear tee in real-time. Experience the heavy boxy fit before checkout.
            </p>
          </div>

           {/* Color Select */}
          <div className="space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-[#2563EB] dark:text-[#3B82F6] font-bold block">1. Selected Premium Wash</span>
            <div className="flex gap-2.5">
              <button
                onClick={() => setTeeColor("black")}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium transition-all duration-250 ${
                  teeColor === "black"
                    ? "bg-neutral-900 border-neutral-800 text-white shadow-md dark:bg-white dark:border-neutral-100 dark:text-neutral-950"
                    : "bg-white border-neutral-200/60 text-neutral-700 hover:border-neutral-350 dark:bg-neutral-900 dark:border-neutral-800 dark:text-neutral-300"
                }`}
              >
                <span className="w-3 h-3 rounded-full bg-[#18181B] block border border-neutral-400/30" />
                Washed Black
              </button>
              <button
                onClick={() => setTeeColor("olive")}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium transition-all duration-250 ${
                  teeColor === "olive"
                    ? "bg-neutral-900 border-neutral-800 text-white shadow-md dark:bg-white dark:border-neutral-100 dark:text-neutral-950"
                    : "bg-white border-neutral-200/60 text-neutral-700 hover:border-neutral-350 dark:bg-neutral-900 dark:border-neutral-800 dark:text-neutral-300"
                }`}
              >
                <span className="w-3 h-3 rounded-full bg-[#2d4132] block border border-neutral-400/30" />
                Olive Green
              </button>
              <button
                onClick={() => setTeeColor("sand")}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium transition-all duration-250 ${
                  teeColor === "sand"
                    ? "bg-neutral-900 border-neutral-800 text-white shadow-md dark:bg-white dark:border-neutral-100 dark:text-neutral-950"
                    : "bg-white border-neutral-200/60 text-neutral-700 hover:border-neutral-350 dark:bg-neutral-900 dark:border-neutral-800 dark:text-neutral-300"
                }`}
              >
                <span className="w-3 h-3 rounded-full bg-[#b4a896] block border border-neutral-400/30" />
                Sandstone
              </button>
            </div>
          </div>

          {/* Graphics Select */}
          <div className="space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-[#2563EB] dark:text-[#3B82F6] font-bold block">2. Select Graphic Print</span>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setPrintDesign("shonalu")}
                className={`px-2 py-2.5 rounded-xl border text-[11px] font-mono font-semibold transition-all duration-200 text-center ${
                  printDesign === "shonalu"
                    ? "bg-yellow-500/10 text-yellow-600 border-yellow-500/50 dark:bg-yellow-500/10 dark:text-yellow-400 dark:border-yellow-500/40"
                    : "bg-white border-neutral-200/60 text-neutral-600 hover:bg-neutral-50 dark:bg-neutral-900 dark:border-neutral-800 dark:text-neutral-400"
                }`}
              >
                SHONALU
              </button>
              <button
                onClick={() => setPrintDesign("minimal")}
                className={`px-2 py-2.5 rounded-xl border text-[11px] font-mono font-semibold transition-all duration-200 text-center ${
                  printDesign === "minimal"
                    ? "bg-blue-500/10 text-blue-600 border-blue-500/50 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/40"
                    : "bg-white border-neutral-200/60 text-neutral-600 hover:bg-neutral-50 dark:bg-neutral-900 dark:border-neutral-800 dark:text-neutral-400"
                }`}
              >
                BONG LOGO
              </button>
              <button
                onClick={() => setPrintDesign("rebel")}
                className={`px-2 py-2.5 rounded-xl border text-[11px] font-mono font-semibold transition-all duration-200 text-center ${
                  printDesign === "rebel"
                    ? "bg-red-500/10 text-red-600 border-red-500/50 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/40"
                    : "bg-white border-neutral-200/60 text-neutral-600 hover:bg-neutral-50 dark:bg-neutral-900 dark:border-neutral-800 dark:text-neutral-400"
                }`}
              >
                DUKHEE
              </button>
            </div>
          </div>

          {/* Engine Parameters */}
          <div className="space-y-4 pt-4 border-t border-neutral-200/70 dark:border-neutral-800/80">
            <span className="text-xs font-mono uppercase tracking-widest text-[#2563EB] dark:text-[#3B82F6] font-bold flex items-center gap-1">
              <Sliders className="w-3 h-3" /> Engine Parameters
            </span>
            
            {/* AutoRotate switch */}
            <div className="flex items-center justify-between text-xs font-medium">
              <span className="text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-500/80" /> Auto-rotation orbiting
              </span>
              <button
                onClick={() => setIsRotating(!isRotating)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all ${
                  isRotating
                    ? "bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-400"
                    : "bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400"
                }`}
              >
                {isRotating ? "ACTIVE" : "PAUSED"}
              </button>
            </div>

            {/* Wireframe toggle */}
            <div className="flex items-center justify-between text-xs font-medium">
              <span className="text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5">
                <Rotate3d className="w-3.5 h-3.5 text-indigo-500/80" /> Display Wireframe matrix
              </span>
              <button
                onClick={() => setIsWireframe(!isWireframe)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all ${
                  isWireframe
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400"
                    : "bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400"
                }`}
              >
                {isWireframe ? "ON" : "OFF"}
              </button>
            </div>

            {/* Light intensity slider */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-xs font-mono text-neutral-600 dark:text-neutral-400">
                <span className="flex items-center gap-1">
                  <Sun className="w-3.5 h-3.5 text-yellow-500/80" /> Lux Lighting
                </span>
                <span>{(lightIntensity * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.1"
                value={lightIntensity}
                onChange={(e) => setLightIntensity(parseFloat(e.target.value))}
                className="w-full h-1 bg-neutral-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>
          </div>
        </div>

        {/* Right Side: Floating Canvas Sizing */}
        <div className="lg:col-span-8 relative aspect-square md:aspect-[4/3] w-full flex items-center justify-center rounded-2xl bg-[#08080A] shadow-inner overflow-hidden border border-neutral-200/20 dark:border-neutral-800/10 group">
          <canvas
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onMouseLeave={handleMouseUpOrLeave}
            className="w-full h-full cursor-grab active:cursor-grabbing"
          />
          
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none">
            <span className="text-[10px] font-mono text-neutral-400 dark:text-neutral-350 bg-black/60 backdrop-blur-sm px-2.5 py-1.5 rounded-md border border-white/5">
              Click & Drag to Rotate Tee
            </span>
            <span className="text-[10px] font-mono text-neutral-400 dark:text-neutral-350 bg-black/60 backdrop-blur-sm px-2.5 py-1.5 rounded-md border border-white/5">
              FOVY: 35.0f
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
