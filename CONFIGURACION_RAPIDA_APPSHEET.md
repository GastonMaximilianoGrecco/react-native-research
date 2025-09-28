# 🚀 CONFIGURACIÓN RÁPIDA: Conectar con AppSheet

## 📋 **Información que necesitas obtener:**

### **1. ID del Google Sheet de AppSheet**

1. Abre tu app de AppSheet
2. Ve a **"Data" > "Tables"**
3. Haz clic en tu tabla principal
4. Copia la URL del Google Sheet
5. Extrae el ID (parte entre `/d/` y `/edit`)

**Ejemplo:**

- URL: `https://docs.google.com/spreadsheets/d/1ABC123DEF456GHI789/edit`
- ID: `1ABC123DEF456GHI789`

### **2. Estructura de columnas de AppSheet**

Anota el nombre exacto de las columnas en tu Google Sheet:

- [ ] Docente
- [ ] Nombre del Alumno
- [ ] Grado
- [ ] Grupo
- [ ] Fecha
- [ ] Hora
- [ ] Tipo de Incidente
- [ ] Descripción
- [ ] Acuerdos

### **3. Cuenta de Google**

- Email: ******\_\_\_\_******
- ¿Es una cuenta personal o institucional? ******\_\_\_\_******

---

## ⚡ **CONFIGURACIÓN EXPRESS (5 minutos):**

### **Paso 1: Actualizar appSheetService.ts**

```typescript
const APPSHEET_CONFIG = {
  spreadsheetId: 'TU_ID_AQUI', // Pega el ID obtenido arriba
  sheetName: 'Reportes', // O el nombre real de tu hoja
  account: 'tu-email@gmail.com', // Tu email de AppSheet
};
```

### **Paso 2: Mapear campos (si es necesario)**

Si los nombres de columnas en AppSheet son diferentes, actualiza:

```typescript
const APPSHEET_FIELD_MAPPING = {
  docente: 'Docente', // Cambia por el nombre real en AppSheet
  nombreAlumno: 'Alumno', // Ejemplo si en AppSheet es solo "Alumno"
  // ... etc
};
```

### **Paso 3: Probar la conexión**

1. Ejecuta la app: `npm run android`
2. Toca **"Conectar AppSheet"**
3. Llena un formulario de prueba
4. Verifica que aparezca en tu Google Sheet

---

## 🎯 **RESULTADO ESPERADO:**

Una vez configurado:

- ✅ **Tu app React Native** guarda en Firebase + Google Sheet
- ✅ **AppSheet** ve los nuevos datos inmediatamente
- ✅ **Sincronización** en tiempo real
- ✅ **Ambas apps** funcionan simultaneamente

---

## 🆘 **Si algo no funciona:**

### **Error: "No se puede acceder a Google Sheets"**

- Verifica que el ID del spreadsheet sea correcto
- Asegúrate de usar la misma cuenta de Google

### **Error: "Formato incorrecto"**

- Revisa que los nombres de columnas coincidan
- Verifica el mapeo de campos

### **Error: "Sin permisos"**

- La cuenta debe tener acceso de edición al Google Sheet
- Habilita APIs de Google Sheets en Google Cloud Console

---

## 📞 **¿Necesitas ayuda?**

Si encuentras problemas:

1. Comparte el error específico
2. Confirma el ID del Google Sheet
3. Verifica los nombres de las columnas
4. Prueba primero con datos de ejemplo

**¡Una vez configurado, tendrás lo mejor de ambos mundos: la flexibilidad de React Native + la compatibilidad con AppSheet!** 🎉
