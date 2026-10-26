import Webcam from "react-webcam";

interface Props {
  webcamRef: React.RefObject<Webcam | null>;
  facingMode: "user" | "environment";
}

export default function Camera({
  webcamRef,
  facingMode,
}: Props) {
  return (
    <Webcam
      ref={webcamRef}
      audio={false}
      screenshotFormat="image/jpeg"
      screenshotQuality={1}
      mirrored={facingMode === "user"}
      videoConstraints={{
        facingMode,
        width: 1280,
        height: 720,
      }}
      className="
        w-full
        rounded-xl
        shadow-lg
      "
    />
  );
}