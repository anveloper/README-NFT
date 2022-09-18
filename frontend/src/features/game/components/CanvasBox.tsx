import React, { useCallback, useEffect, useRef, useState } from "react";
import { useAppSelector } from "../../../app/hooks";
import { selectColor, selectHostUserName, selectSocket } from "../gameSlice";
// css
import styles from "../Game.module.css";

export interface Coordinate {
  x: number;
  y: number;
}

const CanvasBox = () => {
  const socket = useAppSelector(selectSocket);
  const hostUserName = useAppSelector(selectHostUserName);
  const color = useAppSelector(selectColor);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  const [canvasWidth, setCanvasWidth] = useState(800);
  const [canvasHeight, setCanvasHeight] = useState(550);

  useEffect(() => {
    if (boxRef.current) {
      setCanvasWidth(boxRef.current.offsetWidth);
      setCanvasHeight(boxRef.current.offsetHeight);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boxRef, window.innerWidth, window.innerHeight]);

  const [mousePos, setMousePos] = useState<Coordinate | undefined>(undefined);
  const [dataPos, setDataPos] = useState<Coordinate | undefined>(undefined);
  const [dataColor, setDataColor] = useState("#000000");
  const [isPaint, setIsPaint] = useState(false);

  const getCoordinate = (event: MouseEvent): Coordinate | undefined => {
    if (!canvasRef.current) return;
    const canvas: HTMLCanvasElement = canvasRef.current;
    const cot = canvas.getBoundingClientRect().top;
    const col = canvas.getBoundingClientRect().left;
    // canvas.offsetTop, canvas.offsetLeft
    return {
      x: event.pageX - cot,
      y: event.pageY - col,
    };
  };

  const drawLine = (befMousePos: Coordinate, affMousePos: Coordinate) => {
    if (!canvasRef.current) return;
    const canvas: HTMLCanvasElement = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.strokeStyle = color;
      ctx.lineJoin = "round";
      ctx.lineWidth = 8;

      ctx.beginPath();
      ctx.moveTo(befMousePos.x, befMousePos.y);
      ctx.lineTo(affMousePos.x, affMousePos.y);
      ctx.closePath();

      ctx.stroke();
    }
  };
  const startPaint = useCallback((event: MouseEvent) => {
    const coordinate = getCoordinate(event);
    if (coordinate) {
      setIsPaint(true);
      setMousePos(coordinate);
    }
  }, []);
  const paint = useCallback(
    (event: MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();
      if (isPaint) {
        const newMousePos = getCoordinate(event);
        if (mousePos && newMousePos) {
          drawLine(mousePos, newMousePos);
          setMousePos(newMousePos);
          if (socket) {
            const data = {
              x: newMousePos.x,
              y: newMousePos.y,
              color,
            };
            socket.emit("draw_data", hostUserName, data);
          }
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isPaint, mousePos]
  );
  const exitPaint = useCallback(() => {
    setIsPaint(false);
  }, []);
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas: HTMLCanvasElement = canvasRef.current;
    canvas.addEventListener("mousedown", startPaint);
    canvas.addEventListener("mousemove", paint);
    canvas.addEventListener("mouseup", exitPaint);
    canvas.addEventListener("mouseleave", exitPaint);
    return () => {
      canvas.removeEventListener("mousedown", startPaint);
      canvas.removeEventListener("mousemove", paint);
      canvas.removeEventListener("mouseup", exitPaint);
      canvas.removeEventListener("mouseleave", exitPaint);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPaint, paint, exitPaint]);
  // data 받아서 그리기
  useEffect(() => {
    if (socket) {
      socket.on("draw_data", (data) => {
        const { x, y, color } = data;
        setDataPos({ x, y });
        setDataColor(color);
      });
    }
  }, [socket]);

  return (
    <div ref={boxRef} className={styles.canvasBox}>
      <canvas
        width={canvasWidth}
        height={canvasHeight}
        ref={canvasRef}
        className={styles.canvas}
        style={{
          width: `${canvasWidth}px`,
          height: `${canvasHeight}px`,
        }}
      />
    </div>
  );
};

export default CanvasBox;
