import Webcam from "react-webcam";
import type { RefObject } from "react";

interface Props {
  webcamRef: RefObject<Webcam | null>;
}

export default function Camera({
  webcamRef,
}: Props) {
  return (
    <Webcam
      ref={webcamRef}
      screenshotFormat="image/jpeg"
      mirrored
      videoConstraints={{
        facingMode: "user",
      }}
      className="rounded-xl shadow-lg w-full"
    />
  );
}