# 🔑 CONFIGURACIÓN COMPLETA DE APPSHEET

## ✅ PASO 1: Client ID Configurado

**Tu Client ID de AppSheet está configurado:**

```
996924395909-b617g4tubvadavt0fs7pttou61d1qlmm.apps.googleusercontent.com
```

### 📍 Archivos actualizados:

- ✅ `src/config/appsheet.config.ts` - Configuración centralizada
- ✅ `src/services/appSheetService.ts` - Servicio principal
- ✅ `android/app/google-services.json` - Configuración Android
- ✅ `ios/CLIproject/GoogleService-Info.plist` - Configuración iOS

## ⚠️ PASO 2: Configuraciones Pendientes

### 🔍 1. ID del Google Sheet

Necesitas el ID de tu Google Sheet de AppSheet:

1. Ve a tu Google Sheet en AppSheet
2. Copia la URL: `https://docs.google.com/spreadsheets/d/[ID_AQUÍ]/edit`
3. Actualiza en `src/config/appsheet.config.ts`:

```typescript
SPREADSHEET: {
  id: 'TU_SPREADSHEET_ID_REAL', // ⚠️ Cambiar este valor
  sheetName: 'Bitacora', // ⚠️ Verificar nombre exacto
},
```

### 📧 2. Cuenta de Google

Actualiza tu email en `src/config/appsheet.config.ts`:

```typescript
GOOGLE_ACCOUNT: 'tu-email-real@gmail.com', // ⚠️ Cambiar este valor
```

### 📋 3. Estructura de Campos

Verifica que los campos en `FIELD_MAPPING` coincidan con tu AppSheet:

```typescript
export const FIELD_MAPPING = {
  docente: "Docente", // ⚠️ Verificar nombre exacto
  nombreAlumno: "Nombre_Alumno", // ⚠️ Verificar nombre exacto
  // ... resto de campos
};
```

## 🧪 PASO 3: Probar la Configuración

### En tu App.tsx o componente principal:

```typescript
import {
  configureAppSheetAccount,
  testAppSheetConfiguration,
} from "./src/services/appSheetService";

// Configurar al iniciar la app
useEffect(() => {
  const initAppSheet = async () => {
    try {
      await configureAppSheetAccount();
      const result = await testAppSheetConfiguration();
      console.log("Estado AppSheet:", result);
    } catch (error) {
      console.error("Error configurando AppSheet:", error);
    }
  };

  initAppSheet();
}, []);
```

### Comando para probar:

```bash
npm run android
# o
npm run ios
```

## 🔧 PASO 4: Uso en tu App

### Guardar datos en AppSheet:

```typescript
import { saveToAppSheet } from "./src/services/appSheetService";

const guardarReporte = async (datos) => {
  try {
    const resultado = await saveToAppSheet(datos);
    console.log("✅ Guardado en AppSheet:", resultado);
  } catch (error) {
    console.error("❌ Error:", error);
  }
};
```

### Obtener datos de AppSheet:

```typescript
import { getAppSheetData } from "./src/services/appSheetService";

const obtenerDatos = async () => {
  try {
    const datos = await getAppSheetData();
    console.log("📊 Datos de AppSheet:", datos);
  } catch (error) {
    console.error("❌ Error:", error);
  }
};
```

## 🔐 PERMISOS NECESARIOS

Tu app necesita estos permisos (ya configurados):

- ✅ `https://www.googleapis.com/auth/spreadsheets`
- ✅ `https://www.googleapis.com/auth/drive.file`
- ✅ `email`
- ✅ `profile`

## 🚨 TROUBLESHOOTING

### Error: "Account mismatch"

- Verificar que `GOOGLE_ACCOUNT` en config sea correcto
- Cerrar sesión y volver a autenticar con la cuenta correcta

### Error: "Spreadsheet not found"

- Verificar que `SPREADSHEET.id` sea correcto
- Verificar permisos de acceso al Sheet

### Error: "Field not found"

- Verificar que `FIELD_MAPPING` coincida con nombres exactos en AppSheet
- Verificar que `sheetName` sea exacto (case-sensitive)

## 📱 PRÓXIMOS PASOS

1. ⚠️ Actualizar `SPREADSHEET.id` con tu ID real
2. ⚠️ Actualizar `GOOGLE_ACCOUNT` con tu email real
3. ⚠️ Verificar `FIELD_MAPPING` con tu estructura real
4. 🧪 Probar con `npm run android`
5. 📊 Verificar que los datos lleguen a tu AppSheet

---

**¿Necesitas ayuda con algún paso específico?**

- Obtener el ID del Google Sheet
- Verificar nombres de campos
- Configurar autenticación
- Probar la conexión
