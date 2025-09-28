import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { saveReportToGoogleSheets } from './googleSheetsService';

// CONFIGURACIÓN PARA APPSHEET
// Reemplaza estos valores con los reales de tu AppSheet
const APPSHEET_CONFIG = {
  spreadsheetId: '1D6jl4CfyT3i1rMBo60aQTWvN7yqhGEHFGRGzj8ozxVw', // ID del Google Sheet de AppSheet
  sheetName: 'Bitacora', // Nombre de la hoja en AppSheet
  account: 'hecks0033@gmail.com', // Cuenta de Google que usa AppSheet
};

// Mapeo de campos entre tu app y AppSheet
// Ajusta según la estructura exacta de tu AppSheet
const APPSHEET_FIELD_MAPPING = {
  // Tu app -> AppSheet
  docente: 'Docente',
  nombreAlumno: 'Nombre_Alumno',
  grado: 'Grado',
  grupo: 'Grupo',
  fecha: 'Fecha_Incidente',
  hora: 'Hora_Incidente',
  tipoIncidente: 'Tipo_Incidente',
  descripcion: 'Descripcion',
  acuerdos: 'Acuerdos_Anotaciones',
  // Campos adicionales que AppSheet podría necesitar
  fechaCreacion: 'Fecha_Creacion',
  estado: 'Estado',
  fuente: 'Fuente',
};

// Configurar Google Sign-In para usar la misma cuenta que AppSheet
export const configureAppSheetAccount = async () => {
  try {
    GoogleSignin.configure({
      webClientId: '123456789000-webClientId.apps.googleusercontent.com', // TEMPORAL - Usa el mismo que Firebase
      offlineAccess: true,
      scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/drive.file',
        'email',
        'profile',
      ],
      // Nota: El usuario deberá seleccionar la cuenta correcta manualmente
    });
    console.log('✅ Google Sign-In configurado para AppSheet');
  } catch (error) {
    console.error('❌ Error configurando Google Sign-In para AppSheet:', error);
    throw new Error(
      'No se pudo configurar Google Sign-In. Verifica la configuración.',
    );
  }
};

// Función de prueba para verificar la configuración
export const testAppSheetConfiguration = async () => {
  try {
    console.log('🧪 Probando configuración de AppSheet...');

    // Intentar obtener usuario actual (indica si está autenticado)
    let isSignedIn = false;
    let currentUser = null;

    try {
      currentUser = await GoogleSignin.getCurrentUser();
      isSignedIn = currentUser !== null;
      console.log(
        '📊 Estado de Google Sign-In:',
        isSignedIn ? 'Autenticado' : 'No autenticado',
      );

      if (isSignedIn && currentUser?.user?.email) {
        console.log('👤 Usuario actual:', currentUser.user.email);
      }
    } catch (getUserError) {
      console.log('📊 No hay usuario autenticado actualmente');
    }

    return {
      configured: true,
      isSignedIn,
      message: isSignedIn
        ? 'Configuración verificada correctamente'
        : '⚠️ Configuración OK pero necesitas el Web Client ID real.\n\n📖 Ver: TU_CONFIGURACION.md',
      currentUser: currentUser?.user?.email || null,
    };
  } catch (error: any) {
    console.error('❌ Error verificando configuración:', error);
    return {
      configured: false,
      isSignedIn: false,
      message: `Error: ${error?.message || 'Error desconocido'}`,
      currentUser: null,
    };
  }
};

// Función para verificar si estás usando la cuenta correcta
export const verifyAppSheetAccount = async () => {
  try {
    const userInfo = await GoogleSignin.signInSilently();
    const currentEmail = (userInfo as any)?.user?.email || 'unknown';

    if (currentEmail !== APPSHEET_CONFIG.account) {
      console.warn(
        `Cuenta diferente detectada: ${currentEmail} vs ${APPSHEET_CONFIG.account}`,
      );
      return false;
    }

    console.log(`✅ Cuenta correcta de AppSheet: ${currentEmail}`);
    return true;
  } catch (error) {
    console.error('Error verificando cuenta de AppSheet:', error);
    return false;
  }
};

// Convertir datos de tu app al formato de AppSheet
const formatForAppSheet = (reportData: any) => {
  const appSheetData: any = {};

  // Mapear campos usando el mapeo definido
  Object.keys(APPSHEET_FIELD_MAPPING).forEach(key => {
    const appSheetField =
      APPSHEET_FIELD_MAPPING[key as keyof typeof APPSHEET_FIELD_MAPPING];
    appSheetData[appSheetField] = reportData[key] || '';
  });

  // Agregar campos adicionales que AppSheet espera
  appSheetData[APPSHEET_FIELD_MAPPING.fechaCreacion] =
    new Date().toLocaleDateString('es-ES');
  appSheetData[APPSHEET_FIELD_MAPPING.estado] = 'Activo';
  appSheetData[APPSHEET_FIELD_MAPPING.fuente] = 'React Native App';

  return appSheetData;
};

// Función principal: Guardar en el Google Sheet de AppSheet
export const saveToAppSheet = async (reportData: any) => {
  try {
    // Verificar que estamos usando la cuenta correcta
    const isCorrectAccount = await verifyAppSheetAccount();
    if (!isCorrectAccount) {
      throw new Error(
        'Cuenta de Google incorrecta. Debe usar la misma cuenta que AppSheet.',
      );
    }

    // Convertir al formato de AppSheet
    const appSheetData = formatForAppSheet(reportData);

    // Guardar en el Google Sheet de AppSheet
    const result = await saveReportToGoogleSheets(
      appSheetData,
      APPSHEET_CONFIG.spreadsheetId,
    );

    console.log('✅ Guardado exitoso en AppSheet:', result);
    return result;
  } catch (error) {
    console.error('❌ Error guardando en AppSheet:', error);
    throw error;
  }
};

// Función para obtener datos existentes de AppSheet
export const getAppSheetData = async () => {
  try {
    const accessToken = await GoogleSignin.getTokens();

    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${APPSHEET_CONFIG.spreadsheetId}/values/${APPSHEET_CONFIG.sheetName}!A:Z`,
      {
        headers: {
          Authorization: `Bearer ${accessToken.accessToken}`,
        },
      },
    );

    const result = await response.json();

    if (response.ok) {
      const [headers, ...rows] = result.values || [];

      // Convertir a formato más manejable
      const data = rows.map((row: any[]) => {
        const item: any = {};
        headers.forEach((header: string, index: number) => {
          item[header] = row[index] || '';
        });
        return item;
      });

      console.log(`✅ Obtenidos ${data.length} registros de AppSheet`);
      return data;
    } else {
      throw new Error(`Error obteniendo datos: ${result.error?.message}`);
    }
  } catch (error) {
    console.error('❌ Error obteniendo datos de AppSheet:', error);
    throw error;
  }
};

// Función para sincronización bidireccional
export const syncWithAppSheet = async (reportData: any) => {
  try {
    console.log('🔄 Iniciando sincronización con AppSheet...');

    // 1. Guardar en AppSheet
    await saveToAppSheet(reportData);

    // 2. Opcional: Obtener datos actualizados para verificar
    const updatedData = await getAppSheetData();
    const latestRecord = updatedData[0]; // El más reciente

    console.log('✅ Sincronización completa. Último registro:', latestRecord);
    return latestRecord;
  } catch (error) {
    console.error('❌ Error en sincronización con AppSheet:', error);
    throw error;
  }
};

// Función para migrar datos de AppSheet a Firebase
export const migrateFromAppSheet = async () => {
  try {
    console.log('📦 Iniciando migración desde AppSheet...');

    // Obtener todos los datos de AppSheet
    const appSheetData = await getAppSheetData();

    // Importar a Firebase (requerirá implementar función de importación)
    // const { importToFirestore } = await import('./firebaseService');

    console.log(`📦 ${appSheetData.length} registros listos para migrar`);
    return appSheetData;
  } catch (error) {
    console.error('❌ Error en migración desde AppSheet:', error);
    throw error;
  }
};

// Configuración para desarrollo - valores temporales
export const APPSHEET_DEV_CONFIG = {
  // Usa estos valores mientras configuras la conexión real
  spreadsheetId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms', // Sheet público de ejemplo
  sheetName: 'Class Data',
  account: 'tu-email@gmail.com',
};
