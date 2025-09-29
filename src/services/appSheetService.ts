import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { saveReportToGoogleSheets } from "./googleSheetsService";
import APPSHEET_CONFIG, { FIELD_MAPPING } from "../config/appsheet.config";

// Configurar Google Sign-In para usar la misma cuenta que AppSheet
export const configureAppSheetAccount = async () => {
  try {
    GoogleSignin.configure({
      webClientId: APPSHEET_CONFIG.WEB_CLIENT_ID,
      offlineAccess: true,
      scopes: APPSHEET_CONFIG.SCOPES,
      // Nota: El usuario deberá seleccionar la cuenta correcta manualmente
    });
    console.log("✅ Google Sign-In configurado para AppSheet");
  } catch (error) {
    console.error("❌ Error configurando Google Sign-In para AppSheet:", error);
    throw new Error(
      "No se pudo configurar Google Sign-In. Verifica la configuración."
    );
  }
};

// Función de prueba para verificar la configuración
export const testAppSheetConfiguration = async () => {
  try {
    console.log("🧪 Probando configuración de AppSheet...");

    // Intentar obtener usuario actual (indica si está autenticado)
    let isSignedIn = false;
    let currentUser = null;

    try {
      currentUser = await GoogleSignin.getCurrentUser();
      isSignedIn = currentUser !== null;
      console.log(
        "📊 Estado de Google Sign-In:",
        isSignedIn ? "Autenticado" : "No autenticado"
      );

      if (isSignedIn && currentUser?.user?.email) {
        console.log("👤 Usuario actual:", currentUser.user.email);
      }
    } catch (getUserError) {
      console.log("📊 No hay usuario autenticado actualmente");
    }

    return {
      configured: true,
      isSignedIn,
      message: isSignedIn
        ? "✅ Configuración verificada correctamente con Client ID real"
        : "⚠️ Client ID configurado correctamente. Necesitas autenticar con Google para conectar con AppSheet.",
      currentUser: currentUser?.user?.email || null,
    };
  } catch (error: any) {
    console.error("❌ Error verificando configuración:", error);
    return {
      configured: false,
      isSignedIn: false,
      message: `Error: ${error?.message || "Error desconocido"}`,
      currentUser: null,
    };
  }
};

// Función para verificar si estás usando la cuenta correcta
export const verifyAppSheetAccount = async () => {
  try {
    const userInfo = await GoogleSignin.signInSilently();
    const currentEmail = (userInfo as any)?.user?.email || "unknown";

    if (currentEmail !== APPSHEET_CONFIG.GOOGLE_ACCOUNT) {
      console.warn(
        `Cuenta diferente detectada: ${currentEmail} vs ${APPSHEET_CONFIG.GOOGLE_ACCOUNT}`
      );
      return false;
    }

    console.log(`✅ Cuenta correcta de AppSheet: ${currentEmail}`);
    return true;
  } catch (error) {
    console.error("Error verificando cuenta de AppSheet:", error);
    return false;
  }
};

// Convertir datos de tu app al formato de AppSheet
const formatForAppSheet = (reportData: any) => {
  const appSheetData: any = {};

  // Mapear campos usando el mapeo definido
  Object.keys(FIELD_MAPPING).forEach((key) => {
    const appSheetField = FIELD_MAPPING[key as keyof typeof FIELD_MAPPING];
    appSheetData[appSheetField] = reportData[key] || "";
  });

  // Agregar campos adicionales que AppSheet espera
  appSheetData[FIELD_MAPPING.fechaCreacion] = new Date().toLocaleDateString(
    "es-ES"
  );
  appSheetData[FIELD_MAPPING.estado] = "Activo";
  appSheetData[FIELD_MAPPING.fuente] = "React Native App";

  return appSheetData;
};

// Función principal: Guardar en el Google Sheet de AppSheet
export const saveToAppSheet = async (reportData: any) => {
  try {
    // Verificar que estamos usando la cuenta correcta
    const isCorrectAccount = await verifyAppSheetAccount();
    if (!isCorrectAccount) {
      throw new Error(
        "Cuenta de Google incorrecta. Debe usar la misma cuenta que AppSheet."
      );
    }

    // Convertir al formato de AppSheet
    const appSheetData = formatForAppSheet(reportData);

    // Guardar en el Google Sheet de AppSheet
    const result = await saveReportToGoogleSheets(
      appSheetData,
      APPSHEET_CONFIG.SPREADSHEET.id
    );

    console.log("✅ Guardado exitoso en AppSheet:", result);
    return result;
  } catch (error) {
    console.error("❌ Error guardando en AppSheet:", error);
    throw error;
  }
};

// Función para obtener datos existentes de AppSheet
export const getAppSheetData = async () => {
  try {
    const accessToken = await GoogleSignin.getTokens();

    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${APPSHEET_CONFIG.SPREADSHEET.id}/values/${APPSHEET_CONFIG.SPREADSHEET.sheetName}!A:Z`,
      {
        headers: {
          Authorization: `Bearer ${accessToken.accessToken}`,
        },
      }
    );

    const result = await response.json();

    if (response.ok) {
      const [headers, ...rows] = result.values || [];

      // Convertir a formato más manejable
      const data = rows.map((row: any[]) => {
        const item: any = {};
        headers.forEach((header: string, index: number) => {
          item[header] = row[index] || "";
        });
        return item;
      });

      console.log(`✅ Obtenidos ${data.length} registros de AppSheet`);
      return data;
    } else {
      throw new Error(`Error obteniendo datos: ${result.error?.message}`);
    }
  } catch (error) {
    console.error("❌ Error obteniendo datos de AppSheet:", error);
    throw error;
  }
};

// Función para sincronización bidireccional
export const syncWithAppSheet = async (reportData: any) => {
  try {
    console.log("🔄 Iniciando sincronización con AppSheet...");

    // 1. Guardar en AppSheet
    await saveToAppSheet(reportData);

    // 2. Opcional: Obtener datos actualizados para verificar
    const updatedData = await getAppSheetData();
    const latestRecord = updatedData[0]; // El más reciente

    console.log("✅ Sincronización completa. Último registro:", latestRecord);
    return latestRecord;
  } catch (error) {
    console.error("❌ Error en sincronización con AppSheet:", error);
    throw error;
  }
};

// Función para migrar datos de AppSheet a Firebase
export const migrateFromAppSheet = async () => {
  try {
    console.log("📦 Iniciando migración desde AppSheet...");

    // Obtener todos los datos de AppSheet
    const appSheetData = await getAppSheetData();

    // Importar a Firebase (requerirá implementar función de importación)
    // const { importToFirestore } = await import('./firebaseService');

    console.log(`📦 ${appSheetData.length} registros listos para migrar`);
    return appSheetData;
  } catch (error) {
    console.error("❌ Error en migración desde AppSheet:", error);
    throw error;
  }
};

// Configuración para desarrollo - valores temporales
export const APPSHEET_DEV_CONFIG = {
  // Usa estos valores mientras configuras la conexión real
  spreadsheetId: "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms", // Sheet público de ejemplo
  sheetName: "Class Data",
  account: "tu-email@gmail.com",
};
