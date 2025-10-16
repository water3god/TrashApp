"use client";

import { useEffect, useRef, useState } from "react";

export default function IdentifierPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [responses, setResponses] = useState([]);

  useEffect(() => {
    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing webcam: ", err);
      }
    };

    startVideo();
  }, []);

  const handleCapture = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video && canvas) {
      const ctx = canvas.getContext("2d");

      if (ctx) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const imageData = canvas.toDataURL("image/png");
        console.log("Captured image data: ", imageData);

        console.log(imageData);

        const res = await fetch("/api/vision", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ imageBase64: imageData.split(",")[1] }),
        });

        const data = await res.json();

        console.log("Vision API response: ", data);
      }
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4 text-center p-2">
        Identify Trash
      </h1>
      <div className="flex flex-col items-center">
        <video
          ref={videoRef}
          autoPlay
          muted
          className="w-full max-w-md rounded-lg border-2 border-gray-300"
        ></video>
        <canvas ref={canvasRef} className="hidden"></canvas>
        <button
          onClick={handleCapture}
          className="mt-4 px-4 py-2 stroke-2 border-2 border-blue-400 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Capture
        </button>
      </div>
    </div>
  );
}
