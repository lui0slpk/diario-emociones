import Swal from "sweetalert2";

const psychoStyles = {
  confirmButtonColor: "#4B0082",
  cancelButtonColor: "#dc2626",
  background: "#f5f0ff",
};

export const toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  },
});

export const showSuccess = (message) => {
  toast.fire({
    icon: "success",
    title: message,
    background: "#f0fdf4",
    color: "#166534",
  });
};

export const showError = (message) => {
  return Swal.fire({
    icon: "error",
    title: "Error",
    text: message,
    confirmButtonColor: "#4B0082",
    background: "#f5f0ff",
    confirmButtonText: "Aceptar",
  });
};

export const modalSuccess = (message) => {
  return Swal.fire({
    icon: "success",
    title: "Éxito",
    text: message,
    confirmButtonColor: "#4B0082",
    background: "#f5f0ff",
    confirmButtonText: "Aceptar",
  });
};

export const modalError = (message) => {
  return Swal.fire({
    icon: "error",
    title: "Error",
    text: message,
    confirmButtonColor: "#4B0082",
    background: "#f5f0ff",
    confirmButtonText: "Aceptar",
  });
};

export const showConfirm = async (title, text) => {
  const result = await Swal.fire({
    title,
    text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#dc2626",
    cancelButtonColor: "#6b7280",
    background: "#f5f0ff",
    reverseButtons: true,
  });
  return result.isConfirmed;
};
