import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getVisitors, saveVisitor } from "../services/visitorService";
import Webcam from "react-webcam";
import { useRef } from "react";

import { detectFace, loadModels } from "../services/faceService";
import { successAlert, warningAlert } from "../utils/notify";
import { euclideanDistance } from "../services/faceRecognition";

import Swal from "sweetalert2";
import { uploadVisitorImage } from "../utils/imageUpload";

interface VisitorForm {
  name: string;
  mobile: string;
  gender: string;
  flatNumber: string;
  purpose: string;
}

interface FormErrors {
  name?: string;
  mobile?: string;
  gender?: string;
  flatNumber?: string;
  purpose?: string;
}

export default function RegisterVisitor() {
  const webcamRef = useRef<Webcam | null>(null);

  const [descriptor, setDescriptor] = useState<number[]>([]);

  const [photo, setPhoto] = useState<string>("");

  const [faceCaptured, setFaceCaptured] = useState(false);

  const [cameraReady, setCameraReady] = useState(false);

  //   const screenshot = webcamRef.current?.getScreenshot();
  //   setPhoto(screenshot ?? "");

  //   const captureFace = async () => {
  //     const video = webcamRef.current?.video as HTMLVideoElement;

  //     if (!video) return;

  //     const face = (await detectFace(video)) as any;

  //     const liveDescriptor = Array.from(face.descriptor) as any;
  //     const visitors = await getVisitors();

  //     let matchedVisitor: any = null;
  //     let bestDistance = Number.MAX_VALUE;

  //     visitors?.forEach((visitor: any) => {
  //       const distance = euclideanDistance(
  //         liveDescriptor,
  //         visitor.face_descriptor,
  //       );

  //       if (distance < bestDistance) {
  //         bestDistance = distance;
  //         matchedVisitor = visitor;
  //       }
  //     });

  //     if (matchedVisitor && bestDistance < 0.55) {
  //       await Swal.fire({
  //         icon: "info",

  //         title: "Visitor Already Registered",

  //         html: `
  //       <div style="text-align:left">
  //       <p><b>Name:</b>
  //       ${matchedVisitor.name}</p>

  //       <p><b>Mobile:</b>
  //       ${matchedVisitor.mobile}</p>

  //       <p><b>Flat:</b>
  //       ${matchedVisitor.flat_number}</p>
  //       </div>
  //     `,

  //         confirmButtonText: "Load Visitor",
  //       });

  //       setForm({
  //         name: matchedVisitor.name,

  //         mobile: matchedVisitor.mobile,

  //         gender: matchedVisitor.gender,

  //         flatNumber: matchedVisitor.flat_number,

  //         purpose: matchedVisitor.purpose,
  //       });
  //     }

  //     if (!face) {
  //       alert("No face detected");

  //       return;
  //     }

  //     const faceDescriptor = Array.from(face.descriptor) as any;

  //     setDescriptor(faceDescriptor);

  //     await successAlert("Face Captured", "Face information saved successfully");
  //   };

  const captureFace = async () => {
    const video = webcamRef.current?.video as HTMLVideoElement;

    if (!video) {
      return;
    }

    const face = await detectFace(video);

    if (!face) {
      await warningAlert(
        "No Face Detected",
        "Please look directly at the camera.",
      );

      return;
    }

    const screenshot = webcamRef.current?.getScreenshot();

    // console.log("Screenshot Value:", screenshot);

    // console.log("Webcam Ref:", webcamRef.current);

    // console.log("Video Width:", webcamRef.current?.video?.videoWidth);

    // console.log("Video Height:", webcamRef.current?.video?.videoHeight);

    if (!screenshot) {
      await warningAlert("Capture Failed", "Unable to capture image.");

      return;
    }


    const liveDescriptor = Array.from(face.descriptor);

    const visitors = await getVisitors();

    let matchedVisitor: any = null;

    let bestDistance = Number.MAX_VALUE;

    visitors?.forEach((visitor: any) => {
      if (!visitor.face_descriptor) {
        return;
      }

      const distance = euclideanDistance(
        liveDescriptor,
        visitor.face_descriptor,
      );

      if (distance < bestDistance) {
        bestDistance = distance;

        matchedVisitor = visitor;
      }
    });

    if (matchedVisitor && bestDistance < 0.55) {
      await Swal.fire({
        icon: "info",
        title: "Visitor Already Exists",
        html: `
        <div style="text-align:left">
          <p><b>Name:</b> ${matchedVisitor.name}</p>
          <p><b>Mobile:</b> ${matchedVisitor.mobile}</p>
          <p><b>Flat:</b> ${matchedVisitor.flat_number}</p>
        </div>
      `,
        confirmButtonText: "Okay",
      });

      setExistingVisitor(true);

      setForm({
        name: matchedVisitor.name,
        mobile: matchedVisitor.mobile,
        gender: matchedVisitor.gender,
        flatNumber: matchedVisitor.flat_number,
        purpose: matchedVisitor.purpose,
      });

      setDescriptor(matchedVisitor.face_descriptor);

      setPhoto(matchedVisitor.image_url || "");

      setFaceCaptured(true);

      return;
    }
    // No existing visitor found
    setExistingVisitor(false);
    setDescriptor(liveDescriptor);
    setPhoto(screenshot);
    setFaceCaptured(true);

    if (screenshot) {
      console.log("Screenshot length:", screenshot.length);

      setPhoto(screenshot);
    }

    setFaceCaptured(true);

    await successAlert("Face Captured", "Face captured successfully.");
  };

  useEffect(() => {
    loadModels();
  }, []);

  const [form, setForm] = useState<VisitorForm>({
    name: "",
    mobile: "",
    gender: "",
    flatNumber: "",
    purpose: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [existingVisitor, setExistingVisitor] = useState(false);

  useEffect(() => {
    console.log("PHOTO STATE CHANGED:", photo);
    console.log("PHOTO LENGTH:", photo.length);
  }, [photo]);

  const validate = () => {
    const newErrors: FormErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!form.mobile.trim()) {
      newErrors.mobile = "Mobile number is required";
    } else if (!/^[0-9]{10}$/.test(form.mobile)) {
      newErrors.mobile = "Mobile must be 10 digits";
    }

    if (!form.gender) {
      newErrors.gender = "Please select gender";
    }

    if (!form.flatNumber.trim()) {
      newErrors.flatNumber = "Flat number is required";
    }

    if (!form.purpose.trim()) {
      newErrors.purpose = "Purpose is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  //   const submit = async () => {
  //     if (!descriptor.length) {
  //       await warningAlert(
  //         "Face Required",
  //         "Please capture visitor face before registering.",
  //       );

  //       return;
  //     }
  //     if (!validate()) {
  //       return;
  //     }

  //     try {
  //       setLoading(true);

  //       await saveVisitor({
  //         ...form,

  //         faceDescriptor: descriptor,
  //       });

  //       await successAlert("Success", "Visitor registered successfully");

  //       setForm({
  //         name: "",
  //         mobile: "",
  //         gender: "",
  //         flatNumber: "",
  //         purpose: "",
  //       });

  //       setErrors({});
  //     } catch (error) {
  //       console.error(error);
  //       alert("Failed to save visitor");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  const submit = async () => {
    if (!faceCaptured) {
      await warningAlert(
        "Face Required",
        "Please capture visitor face before registration.",
      );

      return;
    }

    if (!validate()) {
      return;
    }

    try {
      setLoading(true);

      let imageUrl = "";

      if (photo && photo.startsWith("data:image")) {
        imageUrl = await uploadVisitorImage(photo);
      }

      await saveVisitor({
        ...form,
        imageUrl,
        faceDescriptor: descriptor,
      });

      await successAlert("Success", "Visitor registered successfully");

      setForm({
        name: "",
        mobile: "",
        gender: "",
        flatNumber: "",
        purpose: "",
      });

      setPhoto("");

      setDescriptor([]);

      setFaceCaptured(false);
    } catch (error) {
      console.error(error);

      await Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: "Unable to save visitor.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div
        className="
          max-w-xl
          mx-auto
          bg-white
          mt-10
          p-6
          rounded-xl
          shadow
        "
      >
        <h2 className="text-2xl font-bold mb-6">Register Visitor</h2>

        <Webcam
          ref={webcamRef}
          onUserMedia={() => {
            setCameraReady(true);
          }}
          audio={false}
          mirrored
          screenshotFormat="image/jpeg"
          screenshotQuality={1}
          videoConstraints={{
            width: 1280,
            height: 720,
            facingMode: "user",
          }}
          className="
    rounded-lg
    mb-4
    w-full
  "
        />

        {/* <div className="bg-gray-100 p-2 mb-2 text-sm">
          Face Captured: {faceCaptured ? "YES" : "NO"}
        </div>

        <div className="bg-gray-100 p-2 mb-2 text-sm">
          Photo Length: {photo.length}
        </div> */}

        <button
          type="button"
          onClick={captureFace}
          //   disabled={faceCaptured}
          disabled={!cameraReady}
          className="
    bg-green-600
    hover:bg-green-700
    disabled:bg-gray-400
    text-white
    px-4
    py-2
    rounded
    mb-4
  "
        >
          {faceCaptured ? "Face Captured ✓" : "Capture Face"}
        </button>

        {photo && (
          <div className="mb-6">
            <p className="font-semibold text-gray-700 mb-2">
              Captured Visitor Photo
            </p>

            <div
              className="
      border-2
      border-green-500
      rounded-xl
      p-2
      bg-green-50
      "
            >
              <img
                src={photo}
                alt="Visitor"
                className="
          w-full
          h-64
          object-cover
          rounded-lg
        "
              />
            </div>

            <div
              className="
      mt-2
      text-green-700
      font-medium
      text-sm
      "
            >
              ✅ Face captured successfully
            </div>
          </div>
        )}

        {!existingVisitor && (
        <>
        <input
          value={form.name}
          placeholder="Visitor Name"
          className="border p-3 w-full mb-1 rounded"
          onChange={(e) =>
            setForm({
              ...form,
              name: e.target.value,
            })
          }
        />

        {errors.name && (
          <p className="text-red-500 text-sm mb-3">{errors.name}</p>
        )}

        <input
          value={form.mobile}
          placeholder="Mobile Number"
          className="border p-3 w-full mb-1 rounded"
          onChange={(e) =>
            setForm({
              ...form,
              mobile: e.target.value,
            })
          }
        />

        {errors.mobile && (
          <p className="text-red-500 text-sm mb-3">{errors.mobile}</p>
        )}

        <input
          value={form.flatNumber}
          placeholder="Flat Number"
          className="border p-3 w-full mb-1 rounded"
          onChange={(e) =>
            setForm({
              ...form,
              flatNumber: e.target.value,
            })
          }
        />

        {errors.flatNumber && (
          <p className="text-red-500 text-sm mb-3">{errors.flatNumber}</p>
        )}

        <input
          value={form.purpose}
          placeholder="Purpose of Visit"
          className="border p-3 w-full mb-1 rounded"
          onChange={(e) =>
            setForm({
              ...form,
              purpose: e.target.value,
            })
          }
        />

        {errors.purpose && (
          <p className="text-red-500 text-sm mb-3">{errors.purpose}</p>
        )}

        <select
          value={form.gender}
          className="border p-3 w-full mb-1 rounded"
          onChange={(e) =>
            setForm({
              ...form,
              gender: e.target.value,
            })
          }
        >
          <option value="">Select Gender</option>

          <option value="Male">Male</option>

          <option value="Female">Female</option>

          <option value="Other">Other</option>
        </select>

        {errors.gender && (
          <p className="text-red-500 text-sm mb-4">{errors.gender}</p>
        )}

        {/* <div className="bg-yellow-100 p-2 mb-2">
          Photo State:
          {photo ? "AVAILABLE" : "EMPTY"}
        </div> */}

        <button
          onClick={submit}
          disabled={loading}
          className="
            bg-blue-600
            hover:bg-blue-700
            text-white
            px-4
            py-3
            rounded
            w-full
            disabled:bg-gray-400
          "
        >
          {loading ? "Saving..." : "Register Visitor"}
        </button>
        </>
        })
      </div>
    </>
  );
}
