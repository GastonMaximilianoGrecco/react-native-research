# 🔑 Cómo Obtener el Web Client ID Real

## 📋 Pasos para Configurar Google Sign-In

### 1. Ve a Google Cloud Console

1. Abre [Google Cloud Console](https://console.cloud.google.com/)
2. **¿Tienes un proyecto?**
   - ✅ **SÍ**: Ve al paso 2
   - ❌ **NO**: Crea uno nuevo → "Nuevo Proyecto" → Nombre: "AppSheet-ReactNative"

### 2. Encuentra tu Proyecto de AppSheet

Tu AppSheet ya debe tener un proyecto en Google Cloud. Búscalo:

- En el selector de proyectos (arriba), busca proyectos relacionados con `hecks0033@gmail.com`
- O busca por el nombre de tu app de AppSheet

### 3. Configurar OAuth 2.0

1. Ve a **"APIs y servicios"** → **"Credenciales"**
2. Si NO tienes credenciales:
   - Clic en **"+ CREAR CREDENCIALES"** → **"ID de cliente OAuth 2.0"**
   - Tipo de aplicación: **"Aplicación Android"**
   - Nombre: `React Native App`
   - Nombre del paquete: `com.cliproject`
   - Certificado de firma SHA-1: (lo obtenemos abajo)

### 4. Obtener SHA-1 (para Android)

Ejecuta en terminal:

```bash
cd /Users/ggrecco/Desktop/ReactNativeCLI/CLIproject/android
./gradlew signingReport
```

Busca la línea que dice:

```
SHA1: XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX
```

### 5. Crear Web Client ID

También necesitas un **Web Client ID**:

1. **"+ CREAR CREDENCIALES"** → **"ID de cliente OAuth 2.0"**
2. Tipo: **"Aplicación web"**
3. Nombre: `React Native Web Client`
4. **¡IMPORTANTE!** Copia el **Client ID** que termina en `.apps.googleusercontent.com`

## 🎯 Lo que Necesitas Copiar

Después de crear las credenciales, tendrás:

```
Web Client ID: 1234567890-abcdefghijk.apps.googleusercontent.com
```

## 🔧 Configurar en la App

Una vez que tengas el Web Client ID real, yo te ayudo a configurarlo.

## 🚀 ¿Ya tienes AppSheet configurado?

Si tu AppSheet ya funciona, entonces YA TIENES un proyecto en Google Cloud. Solo necesitas:

1. Agregar credenciales para React Native
2. Obtener el Web Client ID
3. Configurarlo en la app

## 🆘 ¿Necesitas ayuda?

Si tienes problemas:

1. Comparte pantallazos del Google Cloud Console
2. Dime si encuentras tu proyecto de AppSheet
3. Te ayudo paso a paso

---

💡 **Tip**: AppSheet automáticamente crea un proyecto en Google Cloud cuando conectas una hoja de cálculo. Búscalo con tu email `hecks0033@gmail.com`
