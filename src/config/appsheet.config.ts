// Configuración centralizada para AppSheet
export const APPSHEET_CONFIG = {
  // Client ID de Google para autenticación con AppSheet
  WEB_CLIENT_ID:
    "996924395909-b617g4tubvadavt0fs7pttou61d1qlmm.apps.googleusercontent.com",

  // Configuración del Google Sheet que usa AppSheet
  SPREADSHEET: {
    // Reemplaza con el ID real de tu Google Sheet de AppSheet
    // Lo encuentras en la URL: https://docs.google.com/spreadsheets/d/[SPREADSHEET_ID]/edit
    id: "1D6jl4CfyT3i1rMBo60aQTWvN7yqhGEHFGRGzj8ozxVw", // ⚠️ TEMPORAL - Usa tu ID real
    sheetName: "Bitacora", // Nombre exacto de la hoja en tu AppSheet
  },

  // Cuenta de Google que administra el AppSheet
  GOOGLE_ACCOUNT: "hecks0033@gmail.com", // ⚠️ Cambia por tu cuenta real

  // Permisos necesarios para AppSheet
  SCOPES: [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive.file",
    "email",
    "profile",
  ],
};

// Configuración para desarrollo/pruebas
export const APPSHEET_DEV_CONFIG = {
  WEB_CLIENT_ID: APPSHEET_CONFIG.WEB_CLIENT_ID, // Mismo Client ID
  SPREADSHEET: {
    // Sheet público para pruebas (no requiere autenticación)
    id: "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms",
    sheetName: "Class Data",
  },
  GOOGLE_ACCOUNT: "tu-email@gmail.com",
  SCOPES: APPSHEET_CONFIG.SCOPES,
};

// Mapeo de campos entre tu app y AppSheet
export const FIELD_MAPPING = {
  // Tu app -> AppSheet (ajusta según tu estructura real)
  docente: "Docente",
  nombreAlumno: "Nombre_Alumno",
  grado: "Grado",
  grupo: "Grupo",
  fecha: "Fecha_Incidente",
  hora: "Hora_Incidente",
  tipoIncidente: "Tipo_Incidente",
  descripcion: "Descripcion",
  acuerdos: "Acuerdos_Anotaciones",
  fechaCreacion: "Fecha_Creacion",
  estado: "Estado",
  fuente: "Fuente",
};

// URLs de AppSheet (si las tienes)
export const APPSHEET_URLS = {
  // URL de tu app de AppSheet (opcional)
  app: "https://www.appsheet.com/start/your-app-id", // ⚠️ Reemplaza con tu URL real

  // URL del Google Sheet
  sheet: `https://docs.google.com/spreadsheets/d/${APPSHEET_CONFIG.SPREADSHEET.id}/edit`,
};

export default APPSHEET_CONFIG;
