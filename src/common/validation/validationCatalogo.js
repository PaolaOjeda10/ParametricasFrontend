export const ValidacionCatalogo = {
  id: {
    required: {
      value: true,
      message: "Ingrese el ID",
    },
    pattern: {
      value: "[0-9]",
      message: "No está permitido utilizar caracteres.",
    },
  },
  nombre: {
    required: {
      value: true,
      message: "Ingrese un nombre",
    },
  },
  codigo: {
    required: {
      value: true,
      message: "Debe ingresar un código",
    },
  },
  estado: {
    required: {
      value: false,
    },
  },
  tipoCatalogo: {
    required: {
      value: false,
    },
  },
  orden: {
    required: {
      value: false,
    },
  },
};
