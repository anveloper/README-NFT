import React, { useCallback, useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  selectColor,
  selectHostUserName,
  selectSocket,
  selectStarted,
  selectTimeover,
  setTimeover,
} from "../gameSlice";
// css
import styles from "../Game.module.css";
import { Modal } from "../../../components/modal/Modal";

export interface Coordinate {
  x: number;
  y: number;
}

const CanvasBox = () => {
  const socket = useAppSelector(selectSocket);
  const hostUserName = useAppSelector(selectHostUserName);
  const color = useAppSelector(selectColor);
  const timeover = useAppSelector(selectTimeover);
  const started = useAppSelector(selectStarted);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  const [canvasWidth, setCanvasWidth] = useState(0);
  const [canvasHeight, setCanvasHeight] = useState(0);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (boxRef.current) {
      setCanvasWidth(boxRef.current.offsetWidth);
      setCanvasHeight(boxRef.current.offsetHeight);
    }
    if (socket) {
      socket.emit("get_data", hostUserName);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boxRef, window.innerWidth, window.innerHeight]);
  useEffect(() => {
    if (canvasRef.current) {
      const canvas: HTMLCanvasElement = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
      }
    }
  }, [canvasHeight, canvasWidth]);
  const [mousePos, setMousePos] = useState<Coordinate | undefined>(undefined);
  const [isPaint, setIsPaint] = useState(false);

  const getCoordinate = (event: MouseEvent): Coordinate | undefined => {
    if (!canvasRef.current) return;
    const canvas: HTMLCanvasElement = canvasRef.current;
    const cc = canvas.getBoundingClientRect();
    // canvas.offsetTop, canvas.offsetLeft
    return {
      x: event.pageX - cc.left,
      y: event.pageY - cc.top,
    };
  };
  const drawLine = (
    befMousePos: Coordinate,
    affMousePos: Coordinate,
    color: string
  ) => {
    if (!canvasRef.current) return;
    const canvas: HTMLCanvasElement = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.strokeStyle = color;
      ctx.lineJoin = "round";
      ctx.lineWidth = color !== "#ffffff" ? 8 : 40;

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
      if (isPaint && !started) {
        const newMousePos = getCoordinate(event);
        if (mousePos && newMousePos) {
          drawLine(mousePos, newMousePos, color);
          setMousePos(newMousePos);
          if (socket) {
            const data = {
              x0: mousePos.x,
              y0: mousePos.y,
              x1: newMousePos.x,
              y1: newMousePos.y,
              color: color,
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
    if (started) return;
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
  // data drawing
  useEffect(() => {
    if (socket) {
      socket.on("draw_data", (data) => {
        const { x0, y0, x1, y1, color } = data;
        drawLine({ x: x0, y: y0 }, { x: x1, y: y1 }, color);
      });
      socket.on("reset_draw", () => {
        if (!canvasRef.current) return;
        const canvas: HTMLCanvasElement = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.fillStyle = "white";
          ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        }
      });
      socket.on("set_data", (data: string) => {
        if (!canvasRef.current) return;
        const canvas: HTMLCanvasElement = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.fillStyle = "white";
          ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        }
        const init = JSON.parse(data);
        for (let i = 0; i < init.length; i++) {
          const { x0, y0, x1, y1, color } = init[i];
          drawLine({ x: x0, y: y0 }, { x: x1, y: y1 }, color);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  // =============== file
  const handleMint = () => {};

  const [fileName, setFileName] = useState("");
  const [fileUrl, setFileUrl] = useState("");

  useEffect(() => {
    if (canvasRef.current) {
      const canvas: HTMLCanvasElement = canvasRef.current;
      const imgBase64 = canvas.toDataURL("image/jpeg", "image/octet-stream");
      const decodImg = atob(imgBase64.split(",")[1]);
      let array = [];
      for (let i = 0; i < decodImg.length; i++) {
        array.push(decodImg.charCodeAt(i));
      }
      const file = new Blob([new Uint8Array(array)], {
        type: "image/png",
      });
      const fileName =
        `${hostUserName}` + new Date().getMilliseconds() + ".png";
      setFileName(fileName);
      setFileUrl(window.URL.createObjectURL(file));
    }
  }, [hostUserName, timeover]);
  // =============== file end
  return (
    <>
      <Modal
        open={timeover}
        close={() => {
          dispatch(setTimeover(false));
          window.URL.revokeObjectURL(fileUrl);
        }}
        fn={handleMint}
        className={styles.submitModal}
        header="🔔 제한 시간에 도달하였습니다. 🔔"
      >
        <img
          src={fileUrl}
          alt={fileName}
          width={400}
          height={300}
          style={{ transform: "scale(0.8)" }}
        />
        <h6>
          {"test: "}
          <a href={fileUrl} download>
            다운로드
          </a>
        </h6>
        <br />
        게임을 종료하시겠습니까?
        <br />
        취소를 누르면 추가시간을 부여할 수 있습니다.
      </Modal>
      <div ref={boxRef} className={styles.canvasBox}>
        <canvas
          width={canvasWidth}
          height={canvasHeight}
          ref={canvasRef}
          className={
            color !== "#ffffff"
              ? `${styles.canvas}`
              : `${styles.canvas} ${styles.eraseCursor}`
          }
          style={{
            width: `${canvasWidth}px`,
            height: `${canvasHeight}px`,
          }}
        />
      </div>
    </>
  );
};

export default CanvasBox;
