import { useState } from "react";
import { detectFace } from "../services/faceService";

export const useFaceDetection = () => {
  const [loading, setLoading] =
    useState(false);

  const scanFace = async (
    video: HTMLVideoElement
  ) => {

    try {

      setLoading(true);

      const result =
        await detectFace(video);

      return result;

    } finally {

      setLoading(false);

    }

  };

  return {
    loading,
    scanFace
  };
};