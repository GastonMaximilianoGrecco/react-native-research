# 🔑 GUÍA PASO A PASO: Obtener Web Client ID

## 📋 PASO 1: Acceder a Google Cloud Console

1. **Ve a**: [console.cloud.google.com](https://console.cloud.google.com/)
2. **Inicia sesión** con tu cuenta: `hecks0033@gmail.com`

## 📋 PASO 2: Seleccionar o Crear Proyecto

### Opción A: Si ya tienes un proyecto de AppSheet

- En la parte superior, haz clic en el **selector de proyectos**
- Busca proyectos existentes relacionados con AppSheet
- Selecciona el proyecto que usa tu AppSheet

### Opción B: Si no encuentras el proyecto

- Haz clic en **"Nuevo Proyecto"**
- Nombre: `AppSheet-ReactNative`
- Haz clic en **"Crear"**

## 📋 PASO 3: Habilitar APIs Necesarias

1. En el menú lateral, ve a **"APIs y servicios"** → **"Biblioteca"**
2. Busca y habilita estas APIs:
   - ✅ **Google Sheets API**
   - ✅ **Google Drive API**
   - ✅ **Google Sign-In API** (o Identity Toolkit API)

## 📋 PASO 4: Crear Credenciales OAuth 2.0

### 4.1 Configurar Pantalla de Consentimiento (Solo si es la primera vez)

1. Ve a **"APIs y servicios"** → **"Pantalla de consentimiento de OAuth"**
2. Selecciona **"Externo"** → **"Crear"**
3. Completa la información básica:
   ```
   Nombre de la aplicación: React Native AppSheet
   Correo electrónico de asistencia: hecks0033@gmail.com
   Correo electrónico del desarrollador: hecks0033@gmail.com
   ```
4. Haz clic en **"Guardar y continuar"** hasta terminar

### 4.2 Crear Credenciales Web

1. Ve a **"APIs y servicios"** → **"Credenciales"**
2. Haz clic en **"+ CREAR CREDENCIALES"**
3. Selecciona **"ID de cliente OAuth 2.0"**
4. Configuración:
   ```
   Tipo de aplicación: Aplicación web
   Nombre: React Native Web Client
   Orígenes de JavaScript autorizados: (dejar vacío por ahora)
   URI de redirección autorizados: (dejar vacío por ahora)
   ```
5. Haz clic en **"Crear"**

### 4.3 Crear Credenciales Android (Opcional pero recomendado)

1. **"+ CREAR CREDENCIALES"** → **"ID de cliente OAuth 2.0"**
2. Configuración:
   ```
   Tipo de aplicación: Android
   Nombre: React Native Android
   Nombre del paquete: com.cliproject
   Certificado de firma SHA-1: 5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25
   ```
3. Haz clic en **"Crear"**

## 📋 PASO 5: COPIAR EL WEB CLIENT ID

Después de crear las credenciales web, verás una ventana emergente con:

```
Tu ID de cliente
123456789000-abcdefghijklmnopqrstuvwxyz123.apps.googleusercontent.com

Tu clave secreta de cliente
GOCSPX-xxxxxxxxxxxxxxxxxxxxxxxxx
```

**🎯 COPIA EL ID DE CLIENTE** (el que termina en `.apps.googleusercontent.com`)

## 📋 PASO 6: Compartir el Web Client ID

Una vez que tengas el Web Client ID, **compártelo conmigo** y yo lo configuro automáticamente en tu app.

## 🆘 SOLUCIÓN DE PROBLEMAS

### "No tienes permisos para crear credenciales"

- Asegúrate de estar usando la cuenta correcta (`hecks0033@gmail.com`)
- Si el proyecto es de AppSheet, necesitas ser propietario o editor

### "No encuentro mi proyecto de AppSheet"

- AppSheet automáticamente crea proyectos en Google Cloud
- Busca proyectos con nombres similares a tu app
- O crea un nuevo proyecto específico para React Native

### "Las APIs no están habilitadas"

- Ve a "APIs y servicios" → "Biblioteca"
- Busca "Google Sheets API" y "Google Drive API"
- Haz clic en cada una y presiona "Habilitar"

## 🎯 RESULTADO FINAL

Al final tendrás algo como:

```
Web Client ID: 123456789000-abc123def456ghi789jkl012mno345pqr.apps.googleusercontent.com
```

**Compárteme este ID y configuraré automáticamente tu app para conectar con AppSheet.**

---

💡 **¿Tienes dudas en algún paso? Comparte pantallazos y te ayudo específicamente.**
