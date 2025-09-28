# 🎯 SIGUIENTE PASO: Obtener Web Client ID del Proyecto

## ✅ Lo que ya tienes:
- **Project ID**: `golden-furnace-473415-g3`
- **Project Number**: `996924395909`

## 🎯 Lo que necesitamos ahora:

El **Web Client ID** que está DENTRO de ese proyecto. Es algo como:
```
123456789000-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com
```

## 📋 PASOS PARA TU AMIGO:

### 1. Ir al proyecto específico
- Ve a [console.cloud.google.com](https://console.cloud.google.com/)
- **Selecciona el proyecto**: `golden-furnace-473415-g3`

### 2. Verificar si ya tiene credenciales OAuth
- Ve a **"APIs y servicios"** → **"Credenciales"**
- Busca si ya hay "IDs de cliente OAuth 2.0"
- Si SÍ hay → Ve al paso 4
- Si NO hay → Ve al paso 3

### 3. Si NO hay credenciales, crear una nueva:
```
"+ CREAR CREDENCIALES" → "ID de cliente OAuth 2.0"
Tipo: Aplicación web
Nombre: React Native Web Client
(Dejar campos en blanco)
```

### 4. COPIAR el Web Client ID
En la lista de credenciales, busca una que diga:
```
Tipo: Web application
Nombre: [algo]
Cliente: 123456789000-abc123def456.apps.googleusercontent.com  ← ESTO
```

## 🆘 ALTERNATIVA RÁPIDA:

Dile a tu amigo que ejecute este comando en su computadora:
```bash
gcloud auth application-default print-access-token
```

O que vaya directamente a:
`https://console.cloud.google.com/apis/credentials?project=golden-furnace-473415-g3`

## 💬 Lo que necesito de tu amigo:

El **Web Client ID completo** que se ve así:
```
123456789000-abcdefghijklmnopqrstuvwxyz123.apps.googleusercontent.com
```

---

**¡Estamos muy cerca! Solo falta ese último dato.** 🚀