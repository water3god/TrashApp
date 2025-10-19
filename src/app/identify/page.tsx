"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

export default function IdentifierPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [image, setImage] = useState<string | null>(null);

  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const currentVideo = videoRef.current;

    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
        streamRef.current = stream;
        if (currentVideo) {
          currentVideo.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing webcam: ", err);
      }
    };

    if (!image) {
      startVideo();
    }

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      if (currentVideo) {
        currentVideo.srcObject = null;
      }
    };
  }, [image]);

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

        setImage(imageData);

        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }

        if (videoRef.current) {
          videoRef.current.srcObject = null;
        }

        setLoading(true);

        const res = await fetch("/api/vision", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ imageBase64: imageData.split(",")[1] }),
        });

        const data = await res.json();
        const label = data.label;

        setResponse(label.description);
        setLoading(false);
      }
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4 text-center p-2">
        Identify Trash
      </h1>
      <div className="flex flex-col items-center">
        {!image && (
          <video
            ref={videoRef}
            autoPlay
            muted
            className="w-full max-w-md rounded-lg border-2 border-gray-300"
          ></video>
        )}
        {image && (
          <Image
            src={image}
            alt="Captured"
            width={400}
            height={300}
            className="w-full max-w-md rounded-lg border-2 border-gray-300"
          />
        )}
        <canvas ref={canvasRef} className="hidden"></canvas>
        {loading ? (
          <p className="mt-4 text-lg font-medium text-gray-300">
            Identifying...
          </p>
        ) : (
          response && (
            <p className="mt-4 text-lg font-bold text-green-500">
              Identified: {response}
            </p>
          )
        )}
        {!image ? (
          <button
            onClick={() => {
              if (videoRef.current && streamRef.current) {
                handleCapture();
              }
            }}
            className="mt-4 px-4 py-2 stroke-2 border-2 border-blue-400 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Capture
          </button>
        ) : (
          <button
            onClick={() => {
              setResponse("");
              setImage(null);
            }}
            className="mt-4 px-4 py-2 stroke-2 border-2 border-green-400 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Take Another Photo
          </button>
        )}
      </div>
    </div>
  );
}
