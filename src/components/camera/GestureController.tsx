import { useEffect, useRef, useState } from "react";
import { Hands } from "@mediapipe/hands";
import type { Results } from "@mediapipe/hands";
import { Camera } from "@mediapipe/camera_utils";

export function GestureController() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // We keep track of the last known position to calculate deltas
  const lastPos = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (!videoRef.current) return;

    let camera: Camera;

    const hands = new Hands({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });

    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.7,
    });

    hands.onResults((results: Results) => {
      if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        const landmarks = results.multiHandLandmarks[0];
        
        // Index Finger Tip (8) and Thumb Tip (4)
        const indexTip = landmarks[8];
        const thumbTip = landmarks[4];
        
        // Calculate distance between thumb and index (Pinch)
        const dx = indexTip.x - thumbTip.x;
        const dy = indexTip.y - thumbTip.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        const isPinching = dist < 0.05;

        // Use the middle of the palm (landmark 9) for rotation tracking
        const palm = landmarks[9];

        if (isPinching) {
          // Pinch = Zoom
          window.dispatchEvent(new CustomEvent("gesture-zoom", { detail: { zoomIn: true } }));
          lastPos.current = null; // reset rotation tracking
        } else {
          // Open hand = Rotate
          if (lastPos.current) {
            const deltaX = palm.x - lastPos.current.x;
            const deltaY = palm.y - lastPos.current.y;
            
            // Only dispatch if movement is significant
            if (Math.abs(deltaX) > 0.01 || Math.abs(deltaY) > 0.01) {
              window.dispatchEvent(new CustomEvent("gesture-rotate", { detail: { deltaX, deltaY } }));
            }
          }
          lastPos.current = { x: palm.x, y: palm.y };
        }
      } else {
        lastPos.current = null;
      }
    });

    try {
      camera = new Camera(videoRef.current, {
        onFrame: async () => {
          if (videoRef.current) {
            await hands.send({ image: videoRef.current });
          }
        },
        width: 320,
        height: 240,
      });
      camera.start().then(() => setIsActive(true)).catch((e) => setError(e.message));
    } catch (e: any) {
      setError(e.message);
    }

    return () => {
      if (camera) camera.stop();
      hands.close();
    };
  }, []);

  if (error) return <div className="gesture-error" style={{ position: "absolute", bottom: 10, left: 10, color: "red", zIndex: 999 }}>Camera Error: {error}</div>;

  return (
    <div style={{ position: "absolute", bottom: 20, left: 20, zIndex: 9999, pointerEvents: "none" }}>
      <video 
        ref={videoRef} 
        style={{ 
          width: 160, 
          height: 120, 
          borderRadius: 8, 
          border: isActive ? "2px solid #5fb0ff" : "2px solid #333",
          opacity: 0.6,
          objectFit: "cover",
          transform: "scaleX(-1)" // mirror
        }} 
        playsInline 
        muted 
      />
      <div style={{ fontSize: "10px", color: "#5fb0ff", marginTop: 4, fontFamily: "var(--mono)", textShadow: "0 0 4px #000" }}>
        {isActive ? "HAND TRACKING: ACTIVE" : "INITIALIZING CAMERA..."}
      </div>
    </div>
  );
}
