import { useEffect, useRef, useState } from "react";

import Webcam from "react-webcam";

import Navbar from "../components/Navbar";
import Camera from "../components/Camera";
import VisitorCard from "../components/VisitorCard";

import { loadModels } from "../services/faceService";

import { useFaceDetection } from "../hooks/useFaceDetection";

import { getVisitors, saveVisitLog } from "../services/visitorService";

import { euclideanDistance } from "../services/faceRecognition";
import Footer from "../components/Footer";
import { warningAlert } from "../utils/notify";
import FaceScanner from "../components/FaceScanner";
import { speak } from "../utils/common";

export default function Home() {
  const webcamRef = useRef<Webcam | null>(null);
  const visitorCardRef = useRef<HTMLDivElement | null>(null);
  const scanAudio = new Audio("/audio/scanning.mp3");
  const successAudio = new Audio("/audio/success.mp3");
  const { scanFace } = useFaceDetection();

  interface VisitorDisplay {
    id?: string;
    name: string;
    mobile?: string;
    gender: string;
    age: number;
    emotion: string;
    flat?: string;
    purpose?: string;
  }

  const [visitor, setVisitor] = useState<VisitorDisplay | null>(null);

  const [modelsLoaded, setModelsLoaded] = useState(false);

  const [isScanning, setIsScanning] = useState(false);

  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");

  useEffect(() => {
    if (visitor) {
      visitorCardRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [visitor]);

  useEffect(() => {
    const init = async () => {
      try {
        await loadModels();

        setModelsLoaded(true);
      } catch (err) {
        console.error(err);
      }
    };

    init();
  }, []);

  const handleScan = async () => {
    setIsScanning(true);
    scanAudio.play();

    await new Promise((resolve) => setTimeout(resolve, 1500));

    try {
      if (!webcamRef.current) return;

      const video = webcamRef.current.video as HTMLVideoElement;

      const result = await scanFace(video);

      if (!result) {
        await warningAlert(
          "Face not detected",
          "Please capture visitor face before registration.",
        );
        return;
      }

      type DbVisitor = {
        id: string;
        name: string;
        mobile: string;
        gender: string;
        flat_number: string;
        purpose: string;
        image_url: string;
        face_descriptor: number[];
      };

      const visitors: DbVisitor[] = (await getVisitors()) || [];

      let matchedVisitor: DbVisitor | null = null;

      const liveDescriptor = Array.from(result.descriptor);

      let bestDistance = Number.MAX_VALUE;

      // const FACE_THRESHOLD = 0.5;

      visitors?.forEach((visitor: DbVisitor) => {
        if (
          !visitor.face_descriptor ||
          visitor.face_descriptor.length !== 128
        ) {
          return;
        }

        const distance = euclideanDistance(
          liveDescriptor,
          visitor.face_descriptor,
        );

        // console.log(`Visitor: ${visitor.name} | Distance: ${distance}`);

        if (distance < bestDistance) {
          bestDistance = distance;
          matchedVisitor = visitor;
        }

        // console.log(
        //   "Best Match:",
        //   matchedVisitor?.name,
        //   "Distance:",
        //   bestDistance,
        // );
      });

      if (!result) {
        await warningAlert(
          "Face not detected",
          "Please capture visitor face before registration.",
        );

        return;
      }

      const emotion =
        Object.entries(result.expressions)
          .sort((a, b) => Number(b[1]) - Number(a[1]))
          ?.at(0)?.[0] ?? "neutral";

      // setVisitor({
      //   name: "Unknown Visitor",
      //   age: Math.round(result.age),
      //   gender: result.gender,
      //   emotion,
      // });

      if (matchedVisitor !== null && bestDistance < 0.5) {
        const visitorData = matchedVisitor as any;

        await saveVisitLog({
          visitor_id: visitorData.id,

          visitor_name: visitorData.name,

          flat_number: visitorData.flat_number,

          image_url: visitorData.image_url,

          emotion,

          estimated_age: Math.round(result.age),
        });

        setVisitor({
          id: visitorData.id,
          name: visitorData.name,
          mobile: visitorData.mobile,
          gender: visitorData.gender,
          flat: visitorData.flat_number,
          purpose: visitorData.purpose,
          age: Math.round(result.age),
          emotion,
        });

        scanAudio.pause();
        scanAudio.currentTime = 0;
        successAudio.play();

        // AUDIO Entry
        speak(
          `Visitor identified.
          Name ${visitorData.name}.
          Estimated age ${Math.round(result.age)}.
          Gender ${visitorData.gender}.
          Access granted.`,
        );
      } else {
        setVisitor({
          name: "Unknown Visitor",
          age: Math.round(result.age),
          gender: result.gender,
          emotion,
        });
        speak(
          `Unknown visitor detected.
          Registration required.`,
        );
      }
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        <div
          className="
          max-w-4xl
          mx-auto
          p-6
          "
        >
          <div className="relative">
            <Camera webcamRef={webcamRef} facingMode={facingMode} />

            <FaceScanner scanning={isScanning} />
          </div>

          <div
            className="
  mb-4
  text-sm
  text-center
  font-medium
  text-blue-600
  "
          >
            Active Camera:{" "}
            {facingMode === "user" ? "Front Camera" : "Rear Camera"}
          </div>

          <div className="flex gap-3 mt-4">
            <button
              onClick={() =>
                setFacingMode((prev) =>
                  prev === "user" ? "environment" : "user",
                )
              }
              className="
      px-4
      py-2
      bg-blue-600
      text-white
      rounded-lg
    "
            >
              {facingMode === "user"
                ? "Switch to Rear Camera"
                : "Switch to Front Camera"}
            </button>
          </div>

          <button
            disabled={!modelsLoaded}
            onClick={handleScan}
            className="
          mt-4
          px-5
          py-3
          bg-green-600
          text-white
          rounded-lg
          "
          >
            {modelsLoaded ? "Scan Visitor" : "Loading AI Models..."}
          </button>

          {visitor && (
            <div ref={visitorCardRef} className="mt-6">
              <VisitorCard {...visitor} />
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
