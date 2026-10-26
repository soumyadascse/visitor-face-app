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

export default function Home() {
  const webcamRef = useRef<Webcam | null>(null);
  const visitorCardRef = useRef<HTMLDivElement | null>(null);

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
    if (!webcamRef.current) return;

    const video = webcamRef.current.video as HTMLVideoElement;

    const result = await scanFace(video);

    if (!result) {
      alert("Face not detected");
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
      if (!visitor.face_descriptor || visitor.face_descriptor.length !== 128) {
        return;
      }

      const distance = euclideanDistance(
        liveDescriptor,
        visitor.face_descriptor,
      );

      console.log(`Visitor: ${visitor.name} | Distance: ${distance}`);

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
      alert("Face not detected");

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

    if (matchedVisitor !== null && bestDistance < 0.50) {
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
    } else {
      setVisitor({
        name: "Unknown Visitor",

        age: Math.round(result.age),

        gender: result.gender,

        emotion,
      });
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
          <Camera webcamRef={webcamRef} />

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
