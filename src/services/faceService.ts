import * as faceapi from "face-api.js";

const MODEL_URL = "/models";

export const loadModels = async () => {

  console.log("Loading models...");

  await Promise.all([
    faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
    faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
    faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
    faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
    faceapi.nets.ageGenderNet.loadFromUri(MODEL_URL),
  ]);

  console.log("✅ Models loaded");
};

export const detectFace = async (
  video: HTMLVideoElement
) => {

  return await faceapi
    .detectSingleFace(
      video,
      new faceapi.SsdMobilenetv1Options({
        minConfidence: 0.3,
      })
    )
    .withFaceLandmarks()
    .withFaceDescriptor()
    .withFaceExpressions()
    .withAgeAndGender();
};