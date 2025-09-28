# 📋 Configuración de Integración con Google (Firebase + Google Sheets)

## 🎯 **Resumen**

Esta app de React Native permite guardar reportes de incidencias tanto en **Firebase Firestore** como directamente en **Google Sheets**, similar a como funciona AppSheet.

## 🔧 **Configuración Paso a Paso**

### **1. Configurar Firebase (Recomendado) 🔥**

#### **Paso 1.1: Crear proyecto en Firebase**

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Haz clic en "Crear un proyecto"
3. Nombra tu proyecto (ej: "reporte-incidentes")
4. Habilita Google Analytics (opcional)

#### **Paso 1.2: Configurar autenticación**

1. En el panel de Firebase, ve a **Authentication**
2. Haz clic en **Sign-in method**
3. Habilita **Google** como proveedor
4. Anota el **Web client ID** que aparece

#### **Paso 1.3: Configurar Firestore**

1. Ve a **Firestore Database**
2. Haz clic en **Crear base de datos**
3. Selecciona **Empezar en modo de prueba**
4. Elige una ubicación cercana

#### **Paso 1.4: Descargar archivos de configuración**

**Para Android:**

1. Ve a **Configuración del proyecto** > **Tus apps**
2. Haz clic en el ícono de Android
3. Registra tu app con el package name (ej: `com.cliproject`)
4. Descarga `google-services.json`
5. Colócalo en `android/app/google-services.json`

**Para iOS:**

1. Haz clic en el ícono de iOS
2. Registra tu app con el Bundle ID (ej: `com.cliproject`)
3. Descarga `GoogleService-Info.plist`
4. Colócalo en `ios/CLIproject/GoogleService-Info.plist`

#### **Paso 1.5: Actualizar configuración**

Actualiza el archivo `src/services/firebaseService.ts`:

```typescript
GoogleSignin.configure({
  webClientId: 'TU_WEB_CLIENT_ID_AQUI', // Reemplaza con tu Web Client ID
  offlineAccess: true,
});
```

### **2. Configurar Google Sheets API (Opcional) 📊**

#### **Paso 2.1: Habilitar APIs**

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Selecciona tu proyecto de Firebase
3. Ve a **APIs y servicios** > **Biblioteca**
4. Busca y habilita:
   - **Google Sheets API**
   - **Google Drive API**

#### **Paso 2.2: Crear hoja de cálculo**

1. Ve a [Google Sheets](https://sheets.google.com/)
2. Crea una nueva hoja de cálculo
3. Nómbrala "Reportes de Incidentes"
4. Copia el ID de la URL (parte entre `/d/` y `/edit`)

#### **Paso 2.3: Actualizar configuración**

Actualiza el archivo `src/services/googleSheetsService.ts`:

```typescript
const SPREADSHEET_ID = 'TU_SPREADSHEET_ID_AQUI'; // Reemplaza con tu ID
```

### **3. Configuración de Plataformas**

#### **Android (android/app/build.gradle)**

Agrega al final del archivo:

```gradle
apply plugin: 'com.google.gms.google-services'
```

#### **Android (android/build.gradle)**

Agrega en dependencies:

```gradle
classpath 'com.google.gms:google-services:4.3.15'
```

#### **iOS**

1. Abre `ios/CLIproject.xcworkspace` en Xcode
2. Arrastra `GoogleService-Info.plist` al proyecto
3. Asegúrate de que esté marcado para el target

## ✨ **Funcionalidades Implementadas**

### **🔐 Autenticación**

- ✅ Inicio de sesión con Google
- ✅ Persistencia de sesión
- ✅ Cierre de sesión

### **💾 Almacenamiento**

- ✅ **Firebase Firestore** (Principal)

  - Datos estructurados
  - Tiempo real
  - Seguridad con reglas
  - Búsquedas avanzadas

- ✅ **Google Sheets** (Opcional)
  - Compatible con AppSheet
  - Fácil visualización
  - Compartible con otros usuarios
  - Exportable a Excel

### **📱 Formulario Completo**

- ✅ Todos los campos requeridos
- ✅ Validación de datos
- ✅ Firmas digitales
- ✅ Carga de imágenes
- ✅ Estado de guardado

## 🚀 **Cómo Usar**

### **Guardar solo en Firebase:**

```typescript
await saveIncidentReport(formData); // Solo Firestore
```

### **Guardar en Firebase + Google Sheets:**

```typescript
await saveIncidentReport(formData, true); // Firestore + Sheets
```

### **Guardar solo en Google Sheets:**

```typescript
import { saveReportToGoogleSheets } from './src/services/googleSheetsService';
await saveReportToGoogleSheets(formData);
```

## 🔄 **Comparación con AppSheet**

| Característica      | AppSheet                 | Esta App                        |
| ------------------- | ------------------------ | ------------------------------- |
| **Almacenamiento**  | Google Sheets            | Firebase + Sheets               |
| **Autenticación**   | Google Account           | Google Sign-In                  |
| **Interfaz**        | Web/Mobile generada      | Native React Native             |
| **Personalización** | Limitada                 | Completa                        |
| **Offline**         | Limitado                 | Posible con Firebase            |
| **Costo**           | Gratis hasta 10 usuarios | Gratis hasta cuotas de Firebase |

## 📊 **Estructura de Datos**

### **En Firestore:**

```json
{
  "docente": "Prof. María García",
  "nombreAlumno": "Juan Pérez",
  "grado": "5",
  "grupo": "A",
  "fecha": "26/09/2025",
  "hora": "14:30",
  "tipoIncidente": "conducta",
  "descripcion": "Descripción del incidente...",
  "acuerdos": "Acuerdos alcanzados...",
  "userId": "firebase-user-id",
  "userEmail": "docente@escuela.edu",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

### **En Google Sheets:**

| Fecha/Hora       | Docente     | Alumno     | Grado | Grupo | Fecha Inc. | Hora Inc. | Tipo     | Descripción    | Acuerdos    | Usuario             | Estado |
| ---------------- | ----------- | ---------- | ----- | ----- | ---------- | --------- | -------- | -------------- | ----------- | ------------------- | ------ |
| 26/09/2025 14:30 | Prof. María | Juan Pérez | 5     | A     | 26/09/2025 | 14:30     | Conducta | Descripción... | Acuerdos... | docente@escuela.edu | Activo |

## 🔧 **Comandos de Desarrollo**

```bash
# Instalar dependencias
npm install

# Ejecutar en Android
npm run android

# Ejecutar en iOS (requiere pods)
cd ios && pod install && cd ..
npm run ios

# Iniciar Metro
npm start
```

## 🎯 **Próximos Pasos**

1. **Configurar Firebase** con tus credenciales
2. **Crear Google Sheet** y obtener el ID
3. **Probar autenticación** con Google
4. **Verificar guardado** en ambas plataformas
5. **Personalizar** según necesidades específicas

## 🆘 **Solución de Problemas**

### **Error de autenticación:**

- Verifica que el Web Client ID sea correcto
- Asegúrate de que los archivos de configuración estén en las carpetas correctas

### **Error de Google Sheets:**

- Verifica que las APIs estén habilitadas
- Comprueba que el SPREADSHEET_ID sea correcto
- Asegúrate de tener permisos de escritura en la hoja

### **Errores de compilación:**

- Ejecuta `cd ios && pod install` para iOS
- Verifica que `google-services.json` esté en `android/app/`

---

**🎉 ¡Tu app ya está lista para competir con AppSheet pero con control total sobre la funcionalidad!**
