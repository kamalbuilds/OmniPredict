import {
  ChangeEvent,
  MouseEvent,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { hsvaToHex, HsvaColor } from "@uiw/color-convert";
import { CurrentSession } from "@/components/Common/types/common.types";

const useImage = (
  saveSessionLoading: boolean,
  setCurrentSession: (e: SetStateAction<CurrentSession>) => void
) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const parentRef = useRef<HTMLDivElement | null>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [drawing, setDrawing] = useState<boolean>(false);
  const [brushColor, setBrushColor] = useState<HsvaColor>({
    h: 214,
    s: 43,
    v: 90,
    a: 1,
  });
  const [brushSize, setBrushSize] = useState<number>(5);

  const updateImageData = () => {
    if (saveSessionLoading) return;
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.toBlob((blob) => {
        if (blob) {
          setCurrentSession((prev) => ({
            ...prev,
            image: blob,
          }));
        }
      });
    }
  };

  const handleUpload = (event: ChangeEvent<HTMLInputElement>) => {
    if (saveSessionLoading) return;
    const file = event.target.files?.[0];
    if (file) {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        setImage(img);
        const canvas = canvasRef.current;
        if (canvas) {
          const ctx = canvas.getContext("2d");

          if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const targetWidth = (3 / 4) * canvas.width;
            const targetHeight = targetWidth * (img.height / img.width);

            const offsetX = (canvas.width - targetWidth) / 2;
            const offsetY = (canvas.height - targetHeight) / 2;

            ctx.drawImage(img, offsetX, offsetY, targetWidth, targetHeight);
            updateImageData();
          }
        }
      };
    }
  };
  const handleMouseDown = () => !saveSessionLoading && setDrawing(true);

  const handleMouseUp = () => {
    setDrawing(false);
    updateImageData();
  };

  const handleMouseMove = (
    event: MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    if (!drawing || !image || saveSessionLoading) return;
    const canvas = canvasRef.current;

    if (canvas) {
      const ctx = canvas.getContext("2d");
      const rect = canvas.getBoundingClientRect();
      const x = (event.clientX - rect.left) * (canvas.width / rect.width);
      const y = (event.clientY - rect.top) * (canvas.height / rect.height);

      if (ctx) {
        ctx.fillStyle = hsvaToHex(brushColor);
        ctx.beginPath();
        ctx.arc(x, y, brushSize, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  };

  const clearImage = () => {
    if (saveSessionLoading) return;
    setImage(null);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
      updateImageData();
    }
  };

  const configureCanvas = () => {
    const parent = parentRef.current;
    const canvas = canvasRef.current;
    if (parent && canvas) {
      const rect = parent.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    }
  };

  useEffect(() => {
    if (canvasRef && !saveSessionLoading) {
      configureCanvas();
      updateImageData();
    }
  }, [canvasRef, parentRef, saveSessionLoading]);



  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleUpload,
    canvasRef,
    image,
    clearImage,
    setBrushColor,
    brushColor,
    setBrushSize,
    brushSize,
    parentRef,
  };
};

export default useImage;
