import Swal from "sweetalert2";

export const successAlert = (
  title: string,
  text: string
) => {
  return Swal.fire({
    icon: "success",
    title,
    text,
    confirmButtonColor: "#2563eb",
  });
};

export const errorAlert = (
  title: string,
  text: string
) => {
  return Swal.fire({
    icon: "error",
    title,
    text,
    confirmButtonColor: "#dc2626",
  });
};

export const warningAlert = (
  title: string,
  text: string
) => {
  return Swal.fire({
    icon: "warning",
    title,
    text,
    confirmButtonColor: "#eab308",
  });
};