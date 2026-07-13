import Swal from 'sweetalert2';

const baseConfig = {
  customClass: { popup: 'swal-custom-popup' },
  backdrop: 'rgba(4,44,83,0.5)',
};

export const confirmDelete = () =>
  Swal.fire({
    ...baseConfig,
    title: '¿Eliminar este trabajo?',
    text: 'Esta acción no se puede deshacer.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    customClass: {
      popup: 'swal-custom-popup',
      confirmButton: 'swal-btn-confirm-red',
      cancelButton: 'swal-btn-cancel',
    },
  });

export const alertSuccess = (title, text) =>
  Swal.fire({
    ...baseConfig,
    title,
    text,
    icon: 'success',
    timer: 2000,
    timerProgressBar: true,
    showConfirmButton: false,
  });

export const alertError = (text = 'Ocurrió un problema. Intenta de nuevo.') =>
  Swal.fire({
    ...baseConfig,
    title: 'Error',
    text,
    icon: 'error',
    confirmButtonText: 'Entendido',
    customClass: {
      popup: 'swal-custom-popup',
      confirmButton: 'swal-btn-confirm',
    },
  });
