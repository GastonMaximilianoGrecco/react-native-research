import { GoogleSignin } from '@react-native-google-signin/google-signin';

// Configuración para Google Sheets API
const GOOGLE_SHEETS_SCOPE = 'https://www.googleapis.com/auth/spreadsheets';
const GOOGLE_DRIVE_SCOPE = 'https://www.googleapis.com/auth/drive.file';

// ID de la hoja de cálculo (se puede obtener de la URL de Google Sheets)
// Ejemplo: https://docs.google.com/spreadsheets/d/1ABC123DEF456/edit
// El ID sería: 1ABC123DEF456
const SPREADSHEET_ID = 'TU_SPREADSHEET_ID_AQUI';

// Configurar Google Sign-In con permisos para Sheets
export const configureGoogleSheetsAccess = () => {
  GoogleSignin.configure({
    webClientId: 'TU_WEB_CLIENT_ID_AQUI',
    offlineAccess: true,
    scopes: [GOOGLE_SHEETS_SCOPE, GOOGLE_DRIVE_SCOPE],
  });
};

// Función para obtener el token de acceso
const getAccessToken = async () => {
  try {
    const tokens = await GoogleSignin.getTokens();
    return tokens.accessToken;
  } catch (error) {
    console.error('Error obteniendo token:', error);
    throw error;
  }
};

// Función para crear una nueva hoja de cálculo (similar a AppSheet)
export const createIncidentReportsSheet = async (
  sheetTitle: string = 'Reportes de Incidentes',
) => {
  try {
    const accessToken = await getAccessToken();

    const response = await fetch(
      'https://sheets.googleapis.com/v4/spreadsheets',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          properties: {
            title: sheetTitle,
          },
          sheets: [
            {
              properties: {
                title: 'Reportes',
              },
            },
          ],
        }),
      },
    );

    const result = await response.json();

    if (response.ok) {
      console.log('Hoja de cálculo creada:', result.spreadsheetId);

      // Agregar encabezados a la hoja
      await addHeadersToSheet(result.spreadsheetId);

      return result.spreadsheetId;
    } else {
      throw new Error(`Error creando hoja: ${result.error?.message}`);
    }
  } catch (error) {
    console.error('Error creando hoja de cálculo:', error);
    throw error;
  }
};

// Función para agregar encabezados a la hoja
const addHeadersToSheet = async (spreadsheetId: string) => {
  try {
    const accessToken = await getAccessToken();

    const headers = [
      'Fecha/Hora de Creación',
      'Docente',
      'Nombre del Alumno',
      'Grado',
      'Grupo',
      'Fecha del Incidente',
      'Hora del Incidente',
      'Tipo de Incidente',
      'Descripción',
      'Acuerdos y Anotaciones',
      'Usuario (Email)',
      'Estado',
    ];

    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Reportes!A1:L1?valueInputOption=USER_ENTERED`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          values: [headers],
        }),
      },
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Error agregando encabezados: ${error.error?.message}`);
    }

    console.log('Encabezados agregados correctamente');
  } catch (error) {
    console.error('Error agregando encabezados:', error);
    throw error;
  }
};

// Función para guardar un reporte en Google Sheets (como AppSheet)
export const saveReportToGoogleSheets = async (
  reportData: any,
  spreadsheetId: string = SPREADSHEET_ID,
) => {
  try {
    const accessToken = await getAccessToken();

    // Preparar los datos para la hoja
    const row = [
      new Date().toLocaleString('es-ES'), // Fecha/Hora de Creación
      reportData.docente,
      reportData.nombreAlumno,
      reportData.grado,
      reportData.grupo,
      reportData.fecha,
      reportData.hora,
      reportData.tipoIncidente,
      reportData.descripcion,
      reportData.acuerdos,
      reportData.userEmail || '',
      'Activo',
    ];

    // Agregar la fila a la hoja
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Reportes!A:L:append?valueInputOption=USER_ENTERED`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          values: [row],
        }),
      },
    );

    const result = await response.json();

    if (response.ok) {
      console.log('Reporte guardado en Google Sheets:', result);
      return result;
    } else {
      throw new Error(
        `Error guardando en Google Sheets: ${result.error?.message}`,
      );
    }
  } catch (error) {
    console.error('Error guardando en Google Sheets:', error);
    throw error;
  }
};

// Función para obtener todos los reportes de Google Sheets
export const getReportsFromGoogleSheets = async (
  spreadsheetId: string = SPREADSHEET_ID,
) => {
  try {
    const accessToken = await getAccessToken();

    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Reportes!A2:L`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    const result = await response.json();

    if (response.ok) {
      const reports =
        result.values?.map((row: any[], index: number) => ({
          id: index + 2, // Fila en la hoja (empezando desde A2)
          fechaCreacion: row[0],
          docente: row[1],
          nombreAlumno: row[2],
          grado: row[3],
          grupo: row[4],
          fecha: row[5],
          hora: row[6],
          tipoIncidente: row[7],
          descripcion: row[8],
          acuerdos: row[9],
          userEmail: row[10],
          estado: row[11],
        })) || [];

      return reports;
    } else {
      throw new Error(`Error obteniendo reportes: ${result.error?.message}`);
    }
  } catch (error) {
    console.error('Error obteniendo reportes de Google Sheets:', error);
    throw error;
  }
};

// Función para actualizar un reporte en Google Sheets
export const updateReportInGoogleSheets = async (
  rowIndex: number,
  reportData: any,
  spreadsheetId: string = SPREADSHEET_ID,
) => {
  try {
    const accessToken = await getAccessToken();

    const row = [
      new Date().toLocaleString('es-ES'), // Actualizar fecha de modificación
      reportData.docente,
      reportData.nombreAlumno,
      reportData.grado,
      reportData.grupo,
      reportData.fecha,
      reportData.hora,
      reportData.tipoIncidente,
      reportData.descripcion,
      reportData.acuerdos,
      reportData.userEmail || '',
      'Modificado',
    ];

    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Reportes!A${rowIndex}:L${rowIndex}?valueInputOption=USER_ENTERED`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          values: [row],
        }),
      },
    );

    if (response.ok) {
      console.log('Reporte actualizado en Google Sheets');
      return true;
    } else {
      const error = await response.json();
      throw new Error(`Error actualizando reporte: ${error.error?.message}`);
    }
  } catch (error) {
    console.error('Error actualizando reporte en Google Sheets:', error);
    throw error;
  }
};

// Función para compartir la hoja de cálculo con otros usuarios
export const shareGoogleSheet = async (
  spreadsheetId: string,
  emailAddress: string,
  role: 'reader' | 'writer' = 'reader',
) => {
  try {
    const accessToken = await getAccessToken();

    const response = await fetch(
      `https://www.googleapis.com/drive/v3/files/${spreadsheetId}/permissions`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role: role,
          type: 'user',
          emailAddress: emailAddress,
        }),
      },
    );

    if (response.ok) {
      console.log(`Hoja compartida con ${emailAddress} como ${role}`);
      return true;
    } else {
      const error = await response.json();
      throw new Error(`Error compartiendo hoja: ${error.error?.message}`);
    }
  } catch (error) {
    console.error('Error compartiendo hoja:', error);
    throw error;
  }
};
