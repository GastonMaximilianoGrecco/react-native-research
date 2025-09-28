# 🔑 TU CONFIGURACIÓN ESPECÍFICA

## 📋 Datos de tu App

- **Package Name**: `com.cliproject`
- **SHA-1 Debug**: `5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25`
- **Google Account**: `hecks0033@gmail.com`
- **Spreadsheet ID**: `1D6jl4CfyT3i1rMBo60aQTWvN7yqhGEHFGRGzj8ozxVw`

## 🎯 PASOS EXACTOS PARA CONFIGURAR

### 1. Ve a Google Cloud Console

👉 [console.cloud.google.com](https://console.cloud.google.com/)

- Inicia sesión con: **hecks0033@gmail.com**

### 2. Encuentra o Crea Proyecto

- Busca un proyecto existente relacionado con tu AppSheet
- O crea uno nuevo: **"AppSheet-ReactNative"**

### 3. Habilitar APIs

Ve a **"APIs y servicios"** → **"Biblioteca"** y habilita:

- ✅ Google Sheets API
- ✅ Google Drive API
- ✅ Google Sign-In API

### 4. Crear Credenciales OAuth 2.0

#### Para Android:

1. **"Credenciales"** → **"+ CREAR CREDENCIALES"** → **"ID de cliente OAuth 2.0"**
2. Tipo: **"Aplicación Android"**
3. Configuración:
   ```
   Nombre: React Native Android
   Nombre del paquete: com.cliproject
   Certificado SHA-1: 5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25
   ```

#### Para Web (IMPORTANTE):

1. **"+ CREAR CREDENCIALES"** → **"ID de cliente OAuth 2.0"**
2. Tipo: **"Aplicación web"**
3. Configuración:
   ```
   Nombre: React Native Web Client
   Orígenes autorizados: (dejar vacío por ahora)
   URI de redirección: (dejar vacío por ahora)
   ```

### 5. COPIAR EL WEB CLIENT ID

Después de crear el cliente web, copia el **Client ID** que se ve así:

```
123456789000-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com
```

## 🔧 CONFIGURAR EN LA APP

Una vez que tengas el Web Client ID, **dímelo** y yo lo configuro automáticamente en:

- `src/services/appSheetService.ts`
- `src/services/firebaseService.ts`

## 🎯 RESULTADO ESPERADO

Después de configurarlo:

1. ✅ El botón "Conectar AppSheet" abrirá Google Sign-In
2. ✅ Te pedirá elegir tu cuenta (hecks0033@gmail.com)
3. ✅ Solicitará permisos para Google Sheets
4. ✅ Se conectará exitosamente

## 🚨 SI NO ENCUENTRAS TU PROYECTO DE APPSHEET

Si AppSheet ya funciona, el proyecto existe. Busca:

- Proyectos con nombres similares a tu app
- En el selector de proyectos, usa el filtro por organización
- O contacta soporte de AppSheet para obtener el nombre exacto del proyecto

---

💡 **Una vez que tengas el Web Client ID, compártelo y termino la configuración automáticamente.**
