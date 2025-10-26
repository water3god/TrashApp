"use client";

import { useEffect, useRef, useState } from "react";
import trash from "../../../public/trash.json";
import Image from "next/image";

interface Label {
  description: string;
  score: number;
}

const recyclingCategories = {
  Recycle: [
    "bottle",
    "plastic",
    "glass",
    "aluminum",
    "can",
    "paper",
    "cardboard",
    "newspaper",
    "magazine",
    "metal",
    "tin",
    "steel",
    "carton",
    "packaging",
    "container",
    "jar",
  ],
  Compost: [
    "banana",
    "apple",
    "food",
    "fruit",
    "vegetable",
    "organic",
    "leaf",
    "plant",
    "peel",
    "core",
    "scraps",
    "coffee",
    "tea",
    "eggshell",
  ],
  "E-waste": [
    "phone",
    "computer",
    "electronic",
    "battery",
    "cable",
    "charger",
    "laptop",
    "tablet",
    "device",
    "circuit",
    "motherboard",
    "processor",
  ],
  "Hazardous Waste": [
    "chemical",
    "paint",
    "oil",
    "solvent",
    "pesticide",
    "cleaner",
    "toxic",
    "fluorescent",
    "mercury",
    "lead",
  ],
  "Donate/Reuse": [
    "clothing",
    "clothes",
    "shoe",
    "book",
    "toy",
    "furniture",
    "bag",
    "textile",
    "fabric",
  ],
  Trash: [
    "cigarette",
    "diaper",
    "tissue",
    "napkin",
    "wrapper",
    "chip",
    "candy",
    "gum",
    "straw",
    "foam",
    "styrofoam",
  ],
};

function determineRecycleMethod(itemDescription: string): string | null {
  const item = itemDescription.toLowerCase();

  for (const [method, keywords] of Object.entries(recyclingCategories)) {
    if (keywords.some((keyword) => item.includes(keyword))) {
      return method;
    }
  }

  for (const trashItem of trash.trashItems) {
    if (item.includes(trashItem.name.toLowerCase())) {
      return trashItem.disposeMethod;
    }
  }

  return null;
}

function getRecycleMethodColor(method: string): string {
  const colorMap: { [key: string]: string } = {
    Recycle: "text-blue-500",
    Compost: "text-green-600",
    "E-waste": "text-purple-500",
    "Hazardous Waste": "text-red-500",
    "Donate/Reuse": "text-yellow-600",
    Trash: "text-gray-500",
  };

  return colorMap[method] || "text-gray-500";
}

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

        if (data.labels && data.labels.length > 0) {
          for (const label of data.labels as Label[]) {
            console.log("Ran");
            const method = determineRecycleMethod(label.description);
            console.log("Determined method:", method);

            if (method) {
              setResponse(`${label.description} - ${method}`);
              setLoading(false);
              return;
            }
          }

          setResponse("No item detected. Please try another photo.");
        } else {
          setResponse("No item detected. Please try another photo.");
        }
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
            <div className="mt-4 text-center">
              <p className="text-lg font-bold text-green-500">
                Identified: {response}
              </p>
            </div>
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
