# 🔧 Configuración de AppSheet

## ⚠️ IMPORTANTE: Configuración Requerida

Para conectar realmente con AppSheet, necesitas configurar algunos valores:

### 1. Obtener el Web Client ID

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Selecciona tu proyecto (el mismo que usa AppSheet)
3. Ve a "APIs & Services" > "Credentials"
4. Busca tu "OAuth 2.0 Client IDs"
5. Copia el "Client ID" que termina en `.apps.googleusercontent.com`

### 2. Obtener el Spreadsheet ID de AppSheet

1. Ve a tu AppSheet app
2. En "Data" > "Tables", busca la tabla donde se guardan los reportes
3. Haz clic en "View Source Data"
4. Copia el ID del Google Sheet (está en la URL: `spreadsheets/d/[ESTE_ES_EL_ID]/edit`)

### 3. Actualizar la Configuración

Edita el archivo `src/services/appSheetService.ts`:

```typescript
const APPSHEET_CONFIG = {
  spreadsheetId: 'TU_SPREADSHEET_ID_AQUI', // El ID del Google Sheet
  sheetName: 'Reportes', // El nombre de la hoja (pestaña)
  account: 'tu-cuenta@gmail.com', // Tu cuenta de Google
};
```

Y en `src/services/firebaseService.ts`:

```typescript
GoogleSignin.configure({
  webClientId: 'TU_WEB_CLIENT_ID_AQUI.apps.googleusercontent.com',
  offlineAccess: true,
});
```

### 4. Configurar Firebase (Opcional pero Recomendado)

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un proyecto o usa uno existente
3. Agrega tu app Android/iOS
4. Descarga los archivos de configuración:
   - `google-services.json` (Android) → `android/app/`
   - `GoogleService-Info.plist` (iOS) → `ios/CLIproject/`

## 🔄 Estado Actual

- ✅ UI implementada
- ✅ Conexión simulada funcionando
- ⚠️ Configuración real pendiente
- ⚠️ Google Sign-In necesita Web Client ID real
- ⚠️ AppSheet necesita Spreadsheet ID real

## 🚀 Próximos Pasos

1. Configura los valores reales arriba mencionados
2. Prueba la conexión con "Conectar AppSheet"
3. Verifica que pida tu usuario y contraseña de Google
4. Confirma que se conecte con la cuenta correcta

## 🆘 Solución de Problemas

### Error: "DEVELOPER_ERROR (code '10')"

- Necesitas configurar el Web Client ID real
- Verifica que el archivo `google-services.json` sea válido

### Error: "Sign in cancelled by user"

- El usuario canceló el login de Google (normal)

### Error: "Network error"

- Verifica la conexión a internet
- Confirma que Google Sign-In está configurado correctamente

### No pide credenciales

- Verifica que no tengas una sesión de Google activa
- Prueba cerrando todas las apps de Google y reiniciando
