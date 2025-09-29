#!/bin/bash

# Script para probar la configuración de AppSheet
echo "🔧 Probando configuración de AppSheet..."
echo ""

echo "✅ Client ID configurado:"
echo "996924395909-b617g4tubvadavt0fs7pttou61d1qlmm.apps.googleusercontent.com"
echo ""

echo "📁 Archivos configurados:"
echo "✅ src/config/appsheet.config.ts"
echo "✅ src/services/appSheetService.ts"  
echo "✅ android/app/google-services.json"
echo "✅ ios/CLIproject/GoogleService-Info.plist"
echo ""

echo "⚠️  Configuraciones pendientes:"
echo "1. ID del Google Sheet en src/config/appsheet.config.ts"
echo "2. Tu email en GOOGLE_ACCOUNT"
echo "3. Verificar nombres de campos en FIELD_MAPPING"
echo ""

echo "🚀 Para probar:"
echo "npm run android"
echo ""

echo "📖 Ver guía completa:"
echo "CONFIGURACION_APPSHEET_COMPLETA.md"