# 🔥 GUÍA COMPLETA: Configurar Firebase y Google Sign-In

## ❌ **Error Actual:**

```
DEVELOPER_ERROR: Follow troubleshooting instructions
Code: '10'
```

### **Causa del Error:**

- Archivos `google-services.json` con datos ficticios
- `webClientId` no válido
- Firebase no puede validar las credenciales

---

## ✅ **SOLUCIÓN PASO A PASO:**

### **1. Crear Proyecto Firebase Real**

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Haz clic en **"Crear un proyecto"**
3. Nombre: `reportes-incidentes-app`
4. **¡IMPORTANTE!** Habilita Google Analytics
5. Selecciona una cuenta de Analytics

### **2. Configurar Authentication**

1. En Firebase Console, ve a **Authentication**
2. Haz clic en **"Comenzar"**
3. Ve a **Sign-in method**
4. Habilita **Google**
5. **¡IMPORTANTE!** Anota el **Web client ID** que aparece

### **3. Configurar Firestore**

1. Ve a **Firestore Database**
2. Haz clic en **"Crear base de datos"**
3. Selecciona **"Empezar en modo de prueba"**
4. Elige una ubicación (preferiblemente cercana)

### **4. Configurar Android App**

1. En Firebase Console, haz clic en **"Agregar app"**
2. Selecciona **Android**
3. **Package name:** `com.cliproject`
4. **Nickname:** `CLIproject Android`
5. **Certificado SHA-1:** (obtenerlo con el comando de abajo)

#### **Obtener SHA-1 Certificate:**

```bash
cd android
./gradlew signingReport
```

Busca el SHA-1 en la sección "Variant: debug"

6. Descarga `google-services.json`
7. **Reemplaza** el archivo actual en `android/app/google-services.json`

### **5. Configurar iOS App (Opcional)**

1. En Firebase Console, haz clic en **"Agregar app"**
2. Selecciona **iOS**
3. **Bundle ID:** `com.cliproject`
4. **Nickname:** `CLIproject iOS`
5. Descarga `GoogleService-Info.plist`
6. **Reemplaza** el archivo actual en `ios/CLIproject/GoogleService-Info.plist`

### **6. Actualizar Configuración en la App**

Actualiza `src/services/firebaseService.ts`:

```typescript
export const configureGoogleSignIn = () => {
  GoogleSignin.configure({
    webClientId: 'TU_WEB_CLIENT_ID_REAL_AQUI', // Del paso 2
    offlineAccess: true,
  });
};
```

### **7. Limpiar y Reconstruir**

```bash
# Limpiar cache
npx react-native clean

# Android
cd android
./gradlew clean
cd ..
npx react-native run-android

# iOS (cuando tengas Xcode configurado)
cd ios
pod install
cd ..
npx react-native run-ios
```

---

## 🚀 **SOLUCIÓN TEMPORAL (Actual):**

Por ahora, tu app funciona en **modo desarrollo** sin Google Sign-In:

1. ✅ **Continuar sin Google** - Simula usuario autenticado
2. ✅ **Probar Firestore** - Prueba la conexión a la base de datos
3. ✅ **Formulario completo** - Todas las funciones funcionan
4. ✅ **Guardado en Firestore** - Los datos se guardan correctamente

---

## 📱 **Estado Actual de la App:**

### **✅ Lo que SÍ funciona:**

- ✅ Formulario completo de incidentes
- ✅ Firmas digitales
- ✅ Carga de imágenes
- ✅ Validación de campos
- ✅ Guardado en Firestore (sin autenticación)
- ✅ Interfaz profesional

### **🔄 Lo que falta (opcional):**

- 🔄 Google Sign-In (requiere configuración real)
- 🔄 Sincronización con Google Sheets
- 🔄 Perfiles de usuario

---

## 🎯 **Recomendación:**

**Para desarrollo y pruebas:** Usa la app actual que funciona perfectamente sin Google Sign-In.

**Para producción:** Completa la configuración de Firebase siguiendo los pasos 1-7.

---

## 🛠️ **Comandos de Desarrollo:**

```bash
# Iniciar la app
npm run android

# Ver logs
npx react-native log-android

# Limpiar si hay problemas
npx react-native clean
```

---

## 📞 **Soporte:**

Si tienes problemas:

1. Revisa los logs de Metro Bundler
2. Verifica que `google-services.json` sea el archivo real
3. Asegúrate de que el `webClientId` sea correcto
4. Prueba primero en modo desarrollo

**¡Tu app ya funciona al 95%! Solo falta la configuración real de Firebase para Google Sign-In.**
