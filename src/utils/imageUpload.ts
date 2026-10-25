import { supabase } from "../services/supabase";

export const uploadVisitorImage = async (
  imageBase64: string
): Promise<string> => {

  const fileName =
    `visitor-${Date.now()}.jpg`;

  const response =
    await fetch(imageBase64);

  const blob =
    await response.blob();

  const { data, error } =
    await supabase.storage
      .from("visitor-images")
      .upload(
        fileName,
        blob,
        {
          upsert: false,
          contentType: "image/jpeg",
        }
      );

  if (error) {
    console.error(
      "UPLOAD ERROR",
      error
    );

    throw error;
  }

  console.log(
    "UPLOAD SUCCESS",
    data
  );

  const {
    data: publicData,
  } = supabase.storage
      .from("visitor-images")
      .getPublicUrl(
        fileName
      );

  return publicData.publicUrl;
};