"use client";

import React, { useEffect, useRef, useState } from "react";
import BloodTable from "./BloodTable";
import jsonData from "@/library/data.json";

const NewWsi = () => {
  const canvasRef = useRef();
  const hubCanvasRef = useRef();
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [showDetections, setShowDetections] = useState(false);
  const src = "/reportimage.png";

  // Report data
  const detectionResults = jsonData.inference_results.output.detection_results;
  const patientId = jsonData.patient_id;
  const sampleType = jsonData.inference_results.sample_type;
  const date = new Date(jsonData.inference_results.date);

  // Load and draw the image whenever scale or offset changes
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const image = new Image();
    image.src = src;

    image.onload = () => {
      // Reset transformations and clear the canvas
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Apply scaling and offset
      ctx.setTransform(scale, 0, 0, scale, offset.x, offset.y);

      // Draw the image
      ctx.drawImage(image, 0, 0);
      drawRectangle(ctx);
    };

    // Draw detection rectangles if enabled
    const drawRectangle = (ctx) => {
      if (!showDetections) return;

      ctx.save();
      ctx.strokeStyle = "red";
      ctx.lineWidth = 2;

      detectionResults.forEach(([x1, y1, x2, y2]) => {
        const width = x2 - x1;
        const height = y2 - y1;
        ctx.strokeRect(x1, y1, width, height);
      });

      ctx.restore();
    };

    // Update the hub canvas to reflect the visible area of the main canvas
    const updateHubCanvas = (mouseX, mouseY) => {
      const hubCanvas = hubCanvasRef.current;
      const hubctx = hubCanvas.getContext("2d");
      const hubWidth = hubCanvas.width;
      const hubHeight = hubCanvas.height;

      // Clear the hub canvas
      hubctx.clearRect(0, 0, hubWidth, hubHeight);

      // Draw the full image on the hub canvas
      hubctx.drawImage(image, 0, 0, hubWidth, hubHeight);

      // Map the mouse position to the hub canvas
      const mappedMouseX = (mouseX / canvas.width) * hubWidth;
      const mappedMouseY = (mouseY / canvas.height) * hubHeight;

      // Calculate and draw the visible area rectangle
      const rectWidth = hubWidth / scale;
      const rectHeight = hubHeight / scale;
      const rectX = mappedMouseX - rectWidth / 2;
      const rectY = mappedMouseY - rectHeight / 2;

      hubctx.strokeStyle = "blue";
      hubctx.lineWidth = 2;
      hubctx.strokeRect(rectX, rectY, rectWidth, rectHeight);
    };

    // Handle zooming with the mouse wheel
    const handleWheel = (event) => {
      event.preventDefault();

      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();

      // Calculate mouse position relative to the canvas
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      // Adjust scale based on wheel direction
      const zoomFactor = 0.1;
      const newScale =
        event.deltaY < 0
          ? Math.min(scale + zoomFactor, 5)
          : Math.max(scale - zoomFactor, 0.5);

      const scaleRatio = newScale / scale;

      // Adjust offset to zoom towards the mouse position
      const newOffset = {
        x: mouseX - scaleRatio * (mouseX - offset.x),
        y: mouseY - scaleRatio * (mouseY - offset.y),
      };

      setScale(newScale);
      setOffset(newOffset);
      updateHubCanvas(mouseX, mouseY);
    };

    canvas.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      canvas.removeEventListener("wheel", handleWheel);
    };
  }, [scale, offset, showDetections]);

  // Initial draw of the hub canvas
  useEffect(() => {
    const hubCanvas = hubCanvasRef.current;
    const hubctx = hubCanvas.getContext("2d");
    const hubWidth = hubCanvas.width;
    const hubHeight = hubCanvas.height;

    const image = new Image();
    image.src = src;

    image.onload = () => {
      // Draw the full image on the hub canvas
      hubctx.clearRect(0, 0, hubWidth, hubHeight);
      hubctx.drawImage(image, 0, 0, hubWidth, hubHeight);

      // Draw the initial visible area rectangle
      const rectWidth = hubWidth / scale;
      const rectHeight = hubHeight / scale;
      const rectX = hubWidth / 2 - rectWidth / 2;
      const rectY = hubHeight / 2 - rectHeight / 2;

      hubctx.strokeStyle = "blue";
      hubctx.lineWidth = 2;
      hubctx.strokeRect(rectX, rectY, rectWidth, rectHeight);
    };
  }, []);

  // Reset zoom and offset
  const resetZoom = () => {
    setScale(1);
    setOffset({ x: 0, y: 0 });

    
  };

  return (
    <div>
      <div className="border border-gray-600 text-center">
        Mon Oct 07 2024 16:39:07
      </div>
      <div className="flex">
        <div className="h-[320px] w-[600px]">
          <BloodTable patientId={patientId} sampleType={sampleType} />
        </div>

        <div className="relative w-full h-full">
          <div className="relative">
            <canvas
              ref={canvasRef}
              width={1000}
              height={500}
              className="items-center"
            />
            <div className="absolute top-4 right-4 w-[352px] h-[176px] border border-gray-600 rounded-lg overflow-hidden">
              <canvas ref={hubCanvasRef} height={176} width={352} />
            </div>
          </div>
          <div className="flex items-center justify-center mt-8 gap-4">
            <button
              className="px-4 py-3 border border-gray-600 rounded"
              onClick={() => setShowDetections((prev) => !prev)}
            >
              Toggle Detection
            </button>
            <button
              className="px-4 py-3 border border-gray-600 rounded"
              onClick={resetZoom}
            >
              Reset zoom
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewWsi;
