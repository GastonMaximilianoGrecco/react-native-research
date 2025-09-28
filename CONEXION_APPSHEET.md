# 🔗 CONEXIÓN CON APPSHEET: Guía Completa

## 🎯 **Objetivo:** Conectar tu app React Native con la misma cuenta de Google que usa AppSheet

---

## 📊 **Cómo Funciona AppSheet:**

### **Backend de AppSheet:**

1. **Google Sheets** como base de datos
2. **Google Drive** para almacenar archivos
3. **Gmail** para notificaciones
4. **Google Account** para autenticación

### **Lo que necesitas obtener de AppSheet:**

#### **1. Identificar tu Google Sheet de AppSheet:**

1. Abre tu app de AppSheet
2. Ve a **"Data" > "Tables"**
3. Haz clic en tu tabla principal
4. Copia la **URL de Google Sheets** (algo como: `https://docs.google.com/spreadsheets/d/1ABC123DEF456/edit`)
5. **Anota el ID:** `1ABC123DEF456` (parte entre `/d/` y `/edit`)

#### **2. Verificar permisos de la cuenta:**

- La cuenta de Google que usas en AppSheet debe tener acceso a:
  - ✅ Google Sheets API
  - ✅ Google Drive API
  - ✅ Firebase (si usas el mismo proyecto)

---

## 🛠️ **OPCIÓN 1: Conectar al MISMO Google Sheet de AppSheet**

### **Ventajas:**

- ✅ Datos compartidos en tiempo real
- ✅ AppSheet y tu app ven los mismos datos
- ✅ Sincronización automática

### **Implementación:**

```typescript
// En googleSheetsService.ts
const APPSHEET_SPREADSHEET_ID = '1ABC123DEF456'; // Tu ID real de AppSheet

// Función para sincronizar con el Sheet de AppSheet
export const syncWithAppSheet = async (reportData: any) => {
  try {
    // Usar el mismo formato que AppSheet espera
    const appSheetFormat = {
      // Mapear campos según la estructura de AppSheet
      Docente: reportData.docente,
      Alumno: reportData.nombreAlumno,
      Grado: reportData.grado,
      Grupo: reportData.grupo,
      Fecha: reportData.fecha,
      Hora: reportData.hora,
      Tipo_Incidente: reportData.tipoIncidente,
      Descripcion: reportData.descripcion,
      Acuerdos: reportData.acuerdos,
      Timestamp: new Date().toISOString(),
      Fuente: 'React Native App',
    };

    await saveReportToGoogleSheets(appSheetFormat, APPSHEET_SPREADSHEET_ID);
    console.log('Sincronizado con AppSheet exitosamente');
  } catch (error) {
    console.error('Error sincronizando con AppSheet:', error);
    throw error;
  }
};
```

---

## 🛠️ **OPCIÓN 2: Usar Firebase + Sincronización Bidireccional**

### **Ventajas:**

- ✅ Base de datos más robusta (Firebase)
- ✅ Funciona offline
- ✅ Sincronización cuando tengas internet
- ✅ Backup automático en Google Sheets

### **Implementación:**

```typescript
// Función híbrida: Firebase + Google Sheets
export const saveWithAppSheetSync = async (reportData: any) => {
  try {
    // 1. Guardar en Firebase (principal)
    const firebaseId = await saveIncidentReport(reportData);

    // 2. Sincronizar con Google Sheets de AppSheet
    await syncWithAppSheet({
      ...reportData,
      firebaseId: firebaseId,
      syncedAt: new Date().toISOString(),
    });

    return firebaseId;
  } catch (error) {
    console.error('Error en sincronización híbrida:', error);
    throw error;
  }
};
```

---

## 🔐 **CONFIGURACIÓN DE AUTENTICACIÓN**

### **Para acceder a la misma cuenta de Google:**

1. **Usar el mismo proyecto de Google Cloud Console:**

   - Ve a [Google Cloud Console](https://console.cloud.google.com/)
   - Busca el proyecto que usa AppSheet
   - O crea uno nuevo con acceso a la misma cuenta

2. **Configurar OAuth:**

```typescript
export const configureGoogleSignIn = () => {
  GoogleSignin.configure({
    webClientId: 'TU_WEB_CLIENT_ID', // Del mismo proyecto de AppSheet
    offlineAccess: true,
    scopes: [
      'https://www.googleapis.com/auth/spreadsheets', // Para Google Sheets
      'https://www.googleapis.com/auth/drive.file', // Para Google Drive
      'email',
      'profile',
    ],
  });
};
```

---

## 📱 **IMPLEMENTACIÓN EN LA APP**

### **Opción A: Reemplazar AppSheet**

- Migrar todos los datos
- Usar solo tu app React Native
- Mantener Google Sheets como backup

### **Opción B: Coexistir con AppSheet**

- Ambas apps usan los mismos datos
- Sincronización bidireccional
- Migración gradual

### **Opción C: Migración gradual**

- Importar datos existentes de AppSheet
- Usar Firebase como principal
- Exportar a Google Sheets periódicamente

---

## 🎯 **PASOS INMEDIATOS**

### **1. Obtén la información de AppSheet:**

- ID del Google Sheet
- Estructura de columnas
- Cuenta de Google utilizada

### **2. Elige tu estrategia:**

- ¿Quieres reemplazar AppSheet completamente?
- ¿O coexistir con sincronización?

### **3. Configuración:**

- Usa la misma cuenta de Google
- Configura los mismos permisos
- Prueba con datos de prueba primero

---

## 💡 **RECOMENDACIÓN**

**Para empezar:** Usa la **Opción B (Coexistir)** porque:

- ✅ No pierdes datos existentes
- ✅ Puedes probar sin riesgo
- ✅ Migración gradual
- ✅ Ambas apps funcionan simultáneamente

¿Tienes acceso al Google Sheet que usa AppSheet? ¿Puedes compartir la estructura de columnas?
