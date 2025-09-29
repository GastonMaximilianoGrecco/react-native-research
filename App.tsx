/**
 * Formulario de Reporte de Incidentes
 *
 * @format
 */

import React, { useState, useEffect } from "react";
import {
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
  ScrollView,
  Text,
  TextInput,
  Alert,
  TouchableOpacity,
  Image,
  Modal,
  Platform,
} from "react-native";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Picker } from "@react-native-picker/picker";
import {
  launchImageLibrary,
  launchCamera,
  ImagePickerResponse,
} from "react-native-image-picker";
import SignatureScreen from "react-native-signature-canvas";
import { WebView } from "react-native-webview";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import {
  configureGoogleSignIn,
  signInWithGoogle,
  signOut,
  saveIncidentReport,
} from "./src/services/firebaseService";
import {
  testFirestoreConnection,
  saveIncidentReportBasic,
} from "./src/services/firebaseBasicService";
import {
  saveToAppSheet,
  syncWithAppSheet,
  configureAppSheetAccount,
  testAppSheetConfiguration,
} from "./src/services/appSheetService";

// Datos de ejemplo para los selectores
const DOCENTES = [
  { label: "Seleccionar docente...", value: "" },
  { label: "Prof. María García", value: "maria_garcia" },
  { label: "Prof. Juan Pérez", value: "juan_perez" },
  { label: "Prof. Ana López", value: "ana_lopez" },
  { label: "Prof. Carlos Rodríguez", value: "carlos_rodriguez" },
  { label: "Prof. Laura Martínez", value: "laura_martinez" },
];

const GRADOS = [
  { label: "Seleccionar grado...", value: "" },
  { label: "1° Grado", value: "1" },
  { label: "2° Grado", value: "2" },
  { label: "3° Grado", value: "3" },
  { label: "4° Grado", value: "4" },
  { label: "5° Grado", value: "5" },
  { label: "6° Grado", value: "6" },
];

const GRUPOS = [
  { label: "Seleccionar grupo...", value: "" },
  { label: "Grupo A", value: "A" },
  { label: "Grupo B", value: "B" },
  { label: "Grupo C", value: "C" },
];

const TIPOS_INCIDENTE = [
  { label: "Seleccionar tipo...", value: "" },
  { label: "Conducta inadecuada", value: "conducta" },
  { label: "Falta de respeto", value: "falta_respeto" },
  { label: "Daño a propiedad", value: "dano_propiedad" },
  { label: "Agresión física", value: "agresion_fisica" },
  { label: "Agresión verbal", value: "agresion_verbal" },
  { label: "Incumplimiento de tareas", value: "incumplimiento_tareas" },
  { label: "Otro", value: "otro" },
];

interface FormData {
  docente: string;
  nombreAlumno: string;
  grado: string;
  grupo: string;
  fecha: string;
  hora: string;
  tipoIncidente: string;
  descripcion: string;
  evidenciaUri: string;
  firmaAlumno: string;
  firmaDocente: string;
  acuerdos: string;
}

function App() {
  const isDarkMode = useColorScheme() === "dark";

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      <AppContent />
    </SafeAreaProvider>
  );
}

function AppContent() {
  const safeAreaInsets = useSafeAreaInsets();
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    docente: "",
    nombreAlumno: "",
    grado: "",
    grupo: "",
    fecha: new Date().toLocaleDateString("es-ES"),
    hora: new Date().toLocaleTimeString("es-ES", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    }),
    tipoIncidente: "",
    descripcion: "",
    evidenciaUri: "",
    firmaAlumno: "",
    firmaDocente: "",
    acuerdos: "",
  });

  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [currentSignatureType, setCurrentSignatureType] = useState<
    "alumno" | "docente"
  >("alumno");
  const [showImageOptions, setShowImageOptions] = useState(false);
  const [saving, setSaving] = useState(false);
  const [syncWithAppSheetEnabled, setSyncWithAppSheetEnabled] = useState(false);
  const [appSheetUser, setAppSheetUser] = useState<any>(null);
  const [connectingAppSheet, setConnectingAppSheet] = useState(false);

  // Configurar Google Sign-In al montar el componente
  useEffect(() => {
    const initializeServices = async () => {
      try {
        // Configurar AppSheet con tu Client ID
        console.log("🔧 Configurando AppSheet...");
        await configureAppSheetAccount();

        // Probar la configuración de AppSheet
        const appSheetResult = await testAppSheetConfiguration();
        console.log("📊 Estado de AppSheet:", appSheetResult);

        if (appSheetResult.configured) {
          console.log("✅ AppSheet configurado correctamente");
        } else {
          console.warn("⚠️ AppSheet necesita configuración adicional");
        }
      } catch (error) {
        console.error("❌ Error configurando AppSheet:", error);
      }
    };

    // Comentamos Google Sign-In temporalmente para evitar errores
    // configureGoogleSignIn();

    // Inicializar AppSheet
    initializeServices();

    // Escuchar cambios en el estado de autenticación
    const subscriber = auth().onAuthStateChanged((authUser) => {
      setUser(authUser);
      if (initializing) setInitializing(false);
    });

    return subscriber; // Cleanup subscription
  }, [initializing]);
  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Funciones para manejo de firmas
  const handleSignature = (signature: string) => {
    console.log(
      "Signature received:",
      signature ? "Valid signature data" : "Empty signature"
    );

    if (!signature || signature.length < 100) {
      Alert.alert(
        "Error",
        "La firma parece estar vacía o incompleta. Inténtelo de nuevo."
      );
      return;
    }

    try {
      if (currentSignatureType === "alumno") {
        updateFormData("firmaAlumno", signature);
        Alert.alert("✅ Éxito", "Firma del alumno guardada correctamente");
      } else {
        updateFormData("firmaDocente", signature);
        Alert.alert("✅ Éxito", "Firma del docente guardada correctamente");
      }
      setShowSignatureModal(false);
    } catch (error) {
      console.error("Error guardando firma:", error);
      Alert.alert("Error", "No se pudo guardar la firma. Inténtelo de nuevo.");
    }
  };

  const openSignatureModal = (type: "alumno" | "docente") => {
    console.log("Abriendo modal de firma para:", type);
    setCurrentSignatureType(type);
    setShowSignatureModal(true);
  };

  // Funciones para manejo de imágenes
  const selectImage = (useCamera: boolean) => {
    const options = {
      mediaType: "photo" as const,
      quality: 0.8 as const,
      maxWidth: 800,
      maxHeight: 600,
    };

    const callback = (response: ImagePickerResponse) => {
      if (response.assets && response.assets[0]) {
        updateFormData("evidenciaUri", response.assets[0].uri || "");
      }
      setShowImageOptions(false);
    };

    if (useCamera) {
      launchCamera(options, callback);
    } else {
      launchImageLibrary(options, callback);
    }
  };

  // Validación del formulario
  const validateForm = (): boolean => {
    if (!formData.docente) {
      Alert.alert("Error", "Seleccione un docente");
      return false;
    }
    if (!formData.nombreAlumno.trim()) {
      Alert.alert("Error", "Ingrese el nombre del alumno");
      return false;
    }
    if (!formData.grado) {
      Alert.alert("Error", "Seleccione un grado");
      return false;
    }
    if (!formData.grupo) {
      Alert.alert("Error", "Seleccione un grupo");
      return false;
    }
    if (!formData.tipoIncidente) {
      Alert.alert("Error", "Seleccione el tipo de incidente");
      return false;
    }
    if (!formData.descripcion.trim()) {
      Alert.alert("Error", "Ingrese la descripción del incidente");
      return false;
    }
    return true;
  };

  // Función para guardar el formulario
  const handleSave = async () => {
    if (validateForm()) {
      setSaving(true);
      try {
        let reportId;
        let syncResults = [];

        if (user) {
          // Guardar en Firestore con autenticación
          reportId = await saveIncidentReport(formData);
          syncResults.push("✅ Firebase");
        } else {
          // Guardar en modo de prueba sin autenticación
          reportId = await saveIncidentReportBasic(formData);
          syncResults.push("✅ Firebase (modo prueba)");
        }

        // Sincronizar con AppSheet si está habilitado
        if (syncWithAppSheetEnabled) {
          try {
            await saveToAppSheet(formData);
            syncResults.push("✅ AppSheet/Google Sheets");
          } catch (appSheetError) {
            console.warn("Error sincronizando con AppSheet:", appSheetError);
            syncResults.push("⚠️ AppSheet (error - revisar configuración)");
          }
        }

        Alert.alert(
          "Guardado exitoso",
          `El reporte ha sido guardado correctamente:\n\n${syncResults.join(
            "\n"
          )}${
            syncWithAppSheetEnabled &&
            syncResults.includes("✅ AppSheet/Google Sheets")
              ? "\n\n📊 Visible en AppSheet inmediatamente"
              : ""
          }`,
          [
            {
              text: "OK",
              onPress: () => {
                // Limpiar el formulario
                setFormData({
                  docente: "",
                  nombreAlumno: "",
                  grado: "",
                  grupo: "",
                  fecha: new Date().toLocaleDateString("es-ES"),
                  hora: new Date().toLocaleTimeString("es-ES", {
                    hour12: false,
                    hour: "2-digit",
                    minute: "2-digit",
                  }),
                  tipoIncidente: "",
                  descripcion: "",
                  evidenciaUri: "",
                  firmaAlumno: "",
                  firmaDocente: "",
                  acuerdos: "",
                });
                console.log("Reporte guardado con ID:", reportId);
              },
            },
          ]
        );
      } catch (error) {
        Alert.alert("Error", `No se pudo guardar el reporte: ${error}`);
        console.error("Error al guardar:", error);
      } finally {
        setSaving(false);
      }
    }
  };

  // Función para iniciar sesión con Google
  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      Alert.alert("Error", "No se pudo iniciar sesión con Google");
      console.error("Error en Google Sign-In:", error);
    }
  };

  // Función para cerrar sesión
  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      Alert.alert("Error", "No se pudo cerrar sesión");
      console.error("Error al cerrar sesión:", error);
    }
  };

  // Conectar con AppSheet usando Google Sign-In
  const connectToAppSheet = async () => {
    setConnectingAppSheet(true);
    try {
      console.log("🚀 Iniciando conexión con AppSheet...");

      // Probar la configuración actual
      const configTest = await testAppSheetConfiguration();
      console.log("🧪 Resultado de prueba:", configTest);

      // Configurar Google Sign-In para AppSheet
      await configureAppSheetAccount();

      // Iniciar sesión con Google
      const userInfo = await signInWithGoogle();

      // Verificar que se conectó correctamente
      if (userInfo) {
        setAppSheetUser(userInfo);
        setSyncWithAppSheetEnabled(true);

        Alert.alert(
          "✅ Conectado a AppSheet",
          `Conectado como: ${userInfo.email}\n\nLos reportes se sincronizarán con tu Google Sheet de AppSheet.\n\n⚠️ Nota: Asegúrate de que esta sea la misma cuenta que usa AppSheet.`,
          [{ text: "Entendido" }]
        );
      }
    } catch (error: any) {
      console.error("❌ Error conectando con AppSheet:", error);

      // Diagnosticar el tipo de error
      let errorMessage = "Error desconocido";
      if (error?.code === "10") {
        errorMessage =
          "Error de configuración de Google Sign-In.\n\n🔧 Solución: Necesitas configurar el Web Client ID real en Firebase/Google Cloud Console.";
      } else if (error?.code === "12501") {
        errorMessage = "Login cancelado por el usuario.";
      } else if (error?.message) {
        errorMessage = error.message;
      }

      Alert.alert(
        "❌ Error de Conexión",
        `No se pudo conectar con AppSheet:\n\n${errorMessage}\n\n📖 Consulta CONFIGURACION_APPSHEET.md para más detalles.`,
        [
          { text: "OK" },
          {
            text: "Probar Config",
            onPress: async () => {
              const test = await testAppSheetConfiguration();
              Alert.alert(
                "🧪 Diagnóstico",
                `Estado: ${test.configured ? "OK" : "Error"}\nAutenticado: ${
                  test.isSignedIn ? "Sí" : "No"
                }\nUsuario: ${test.currentUser || "Ninguno"}\n\n${test.message}`
              );
            },
          },
        ]
      );
    } finally {
      setConnectingAppSheet(false);
    }
  };

  // Función para cancelar
  const handleCancel = () => {
    Alert.alert(
      "Cancelar",
      "¿Está seguro de que desea cancelar? Se perderán todos los datos ingresados.",
      [
        { text: "No", style: "cancel" },
        {
          text: "Sí",
          style: "destructive",
          onPress: () => {
            setFormData({
              docente: "",
              nombreAlumno: "",
              grado: "",
              grupo: "",
              fecha: new Date().toLocaleDateString("es-ES"),
              hora: new Date().toLocaleTimeString("es-ES", {
                hour12: false,
                hour: "2-digit",
                minute: "2-digit",
              }),
              tipoIncidente: "",
              descripcion: "",
              evidenciaUri: "",
              firmaAlumno: "",
              firmaDocente: "",
              acuerdos: "",
            });
          },
        },
      ]
    );
  };

  // Mostrar pantalla de carga inicial
  if (initializing) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
    );
  }

  // Mostrar pantalla de login si no hay usuario autenticado
  if (!user) {
    return (
      <View style={[styles.container, styles.centered]}>
        <View style={styles.loginContainer}>
          <Text style={styles.loginTitle}>Reporte de Incidentes</Text>
          <Text style={styles.loginSubtitle}>
            Modo de desarrollo - Firebase configurado sin Google Sign-In
          </Text>

          <TouchableOpacity
            style={[styles.googleSignInButton, { backgroundColor: "#27ae60" }]}
            onPress={() => {
              // Simular usuario autenticado para desarrollo
              Alert.alert(
                "Modo Desarrollo",
                "Continuando sin autenticación. Los datos se guardarán en Firestore.",
                [
                  {
                    text: "Continuar",
                    onPress: () => {
                      // Crear un usuario simulado
                      setUser({
                        displayName: "Usuario de Prueba",
                        email: "test@ejemplo.com",
                        uid: "test-user-id",
                      } as any);
                    },
                  },
                ]
              );
            }}
          >
            <Text style={styles.googleSignInText}>� Continuar sin Google</Text>
          </TouchableOpacity>

          <Text style={[styles.loginSubtitle, { marginTop: 20, fontSize: 12 }]}>
            Google Sign-In estará disponible cuando configures Firebase
            correctamente
          </Text>

          <TouchableOpacity
            style={[styles.googleSignInButton, { backgroundColor: "#f39c12" }]}
            onPress={testFirestoreConnection}
          >
            <Text style={styles.googleSignInText}>🧪 Probar Firestore</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.googleSignInButton,
              {
                backgroundColor: syncWithAppSheetEnabled
                  ? "#27ae60"
                  : "#9b59b6",
                opacity: connectingAppSheet ? 0.7 : 1,
              },
            ]}
            onPress={connectToAppSheet}
            disabled={connectingAppSheet}
          >
            <Text style={styles.googleSignInText}>
              {connectingAppSheet
                ? "⏳ Conectando..."
                : syncWithAppSheetEnabled
                ? "✅ AppSheet Conectado"
                : "📊 Conectar AppSheet"}
            </Text>
          </TouchableOpacity>

          {appSheetUser && (
            <Text
              style={[
                styles.loginSubtitle,
                { marginTop: 10, color: "#27ae60" },
              ]}
            >
              AppSheet: {appSheetUser.email}
            </Text>
          )}
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: safeAreaInsets.top }]}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.title}>Reporte de Incidente</Text>
              {syncWithAppSheetEnabled && (
                <Text style={styles.appSheetStatus}>
                  📊 Sincronizando con AppSheet
                  {appSheetUser && ` (${appSheetUser.email})`}
                </Text>
              )}
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userText}>
                👤 {user.displayName || user.email}
              </Text>
              <TouchableOpacity onPress={handleSignOut}>
                <Text style={styles.signOutText}>Cerrar sesión</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.form}>
          {/* Nombre del docente */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Nombre del docente *</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.docente}
                style={styles.picker}
                onValueChange={(value) => updateFormData("docente", value)}
              >
                {DOCENTES.map((docente) => (
                  <Picker.Item
                    key={docente.value}
                    label={docente.label}
                    value={docente.value}
                  />
                ))}
              </Picker>
            </View>
          </View>

          {/* Nombre del alumno */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Nombre del alumno *</Text>
            <TextInput
              style={styles.textInput}
              value={formData.nombreAlumno}
              onChangeText={(value) => updateFormData("nombreAlumno", value)}
              placeholder="Ingrese el nombre completo del alumno"
              placeholderTextColor="#999"
            />
          </View>

          {/* Grado y Grupo */}
          <View style={styles.rowContainer}>
            <View style={[styles.fieldContainer, styles.halfWidth]}>
              <Text style={styles.label}>Grado *</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.grado}
                  style={styles.picker}
                  onValueChange={(value) => updateFormData("grado", value)}
                >
                  {GRADOS.map((grado) => (
                    <Picker.Item
                      key={grado.value}
                      label={grado.label}
                      value={grado.value}
                    />
                  ))}
                </Picker>
              </View>
            </View>

            <View style={[styles.fieldContainer, styles.halfWidth]}>
              <Text style={styles.label}>Grupo *</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.grupo}
                  style={styles.picker}
                  onValueChange={(value) => updateFormData("grupo", value)}
                >
                  {GRUPOS.map((grupo) => (
                    <Picker.Item
                      key={grupo.value}
                      label={grupo.label}
                      value={grupo.value}
                    />
                  ))}
                </Picker>
              </View>
            </View>
          </View>

          {/* Fecha y Hora */}
          <View style={styles.rowContainer}>
            <View style={[styles.fieldContainer, styles.halfWidth]}>
              <Text style={styles.label}>Fecha</Text>
              <TextInput
                style={styles.textInput}
                value={formData.fecha}
                onChangeText={(value) => updateFormData("fecha", value)}
                placeholder="DD/MM/AAAA"
                placeholderTextColor="#999"
              />
            </View>

            <View style={[styles.fieldContainer, styles.halfWidth]}>
              <Text style={styles.label}>Hora</Text>
              <TextInput
                style={styles.textInput}
                value={formData.hora}
                onChangeText={(value) => updateFormData("hora", value)}
                placeholder="HH:MM"
                placeholderTextColor="#999"
              />
            </View>
          </View>

          {/* Tipo de incidente */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Tipo de incidente *</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.tipoIncidente}
                style={styles.picker}
                onValueChange={(value) =>
                  updateFormData("tipoIncidente", value)
                }
              >
                {TIPOS_INCIDENTE.map((tipo) => (
                  <Picker.Item
                    key={tipo.value}
                    label={tipo.label}
                    value={tipo.value}
                  />
                ))}
              </Picker>
            </View>
          </View>

          {/* Descripción */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Descripción del incidente *</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={formData.descripcion}
              onChangeText={(value) => updateFormData("descripcion", value)}
              placeholder="Describa detalladamente el incidente ocurrido..."
              placeholderTextColor="#999"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          {/* Firmas */}
          <View style={styles.signatureSection}>
            <Text style={styles.sectionTitle}>Firmas</Text>

            <View style={styles.rowContainer}>
              <View style={[styles.fieldContainer, styles.halfWidth]}>
                <Text style={styles.label}>Firma del alumno</Text>
                <TouchableOpacity
                  style={styles.signatureButton}
                  onPress={() => openSignatureModal("alumno")}
                >
                  {formData.firmaAlumno ? (
                    <Image
                      source={{ uri: formData.firmaAlumno }}
                      style={styles.signatureImage}
                      resizeMode="contain"
                    />
                  ) : (
                    <Text style={styles.signatureButtonText}>
                      Toque para firmar
                    </Text>
                  )}
                </TouchableOpacity>
              </View>

              <View style={[styles.fieldContainer, styles.halfWidth]}>
                <Text style={styles.label}>Firma del docente</Text>
                <TouchableOpacity
                  style={styles.signatureButton}
                  onPress={() => openSignatureModal("docente")}
                >
                  {formData.firmaDocente ? (
                    <Image
                      source={{ uri: formData.firmaDocente }}
                      style={styles.signatureImage}
                      resizeMode="contain"
                    />
                  ) : (
                    <Text style={styles.signatureButtonText}>
                      Toque para firmar
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Evidencia */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Evidencia fotográfica</Text>
            <TouchableOpacity
              style={styles.imageButton}
              onPress={() => setShowImageOptions(true)}
            >
              {formData.evidenciaUri ? (
                <Image
                  source={{ uri: formData.evidenciaUri }}
                  style={styles.evidenceImage}
                  resizeMode="cover"
                />
              ) : (
                <Text style={styles.imageButtonText}>
                  Toque para agregar imagen
                </Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Acuerdos y anotaciones */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Acuerdos y anotaciones</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={formData.acuerdos}
              onChangeText={(value) => updateFormData("acuerdos", value)}
              placeholder="Registre aquí los acuerdos alcanzados y observaciones adicionales..."
              placeholderTextColor="#999"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>
        </View>
      </ScrollView>

      {/* Footer con botones */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.saveButton, saving && styles.disabledButton]}
          onPress={handleSave}
          disabled={saving}
        >
          <Text style={styles.saveButtonText}>
            {saving ? "Guardando..." : "Guardar"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Modal de firma */}
      <Modal
        visible={showSignatureModal}
        animationType="slide"
        onRequestClose={() => setShowSignatureModal(false)}
      >
        <View style={styles.signatureModal}>
          <View style={styles.signatureHeader}>
            <Text style={styles.signatureTitle}>
              Firma{" "}
              {currentSignatureType === "alumno" ? "del alumno" : "del docente"}
            </Text>
            <TouchableOpacity
              onPress={() => setShowSignatureModal(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <SignatureScreen
            onOK={handleSignature}
            onEmpty={() => {
              console.log("Firma vacía");
              Alert.alert(
                "Atención",
                "Por favor, agregue una firma antes de continuar"
              );
            }}
            onClear={() => {
              console.log("Firma borrada");
            }}
            onGetData={(data) => {
              console.log("Datos de firma obtenidos:", data);
            }}
            descriptionText="✍️ Firme en el área de abajo usando su dedo"
            clearText="🗑️ Limpiar"
            confirmText="✅ Confirmar"
            webStyle={`
              .m-signature-pad {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                margin: 0;
                background-color: white;
              }
              .m-signature-pad--body {
                border: none;
              }
              .m-signature-pad--footer {
                position: absolute;
                left: 20px;
                right: 20px;
                bottom: 20px;
                height: 40px;
              }
              body {
                margin: 0;
                padding: 0;
              }
            `}
            autoClear={false}
            imageType="image/png"
            dataURL=""
            rotated={false}
            trimWhitespace={true}
            penColor="#000000"
            backgroundColor="#ffffff"
            dotSize={1}
            minWidth={0.5}
            maxWidth={2.5}
          />
        </View>
      </Modal>

      {/* Modal de opciones de imagen */}
      <Modal
        visible={showImageOptions}
        transparent
        animationType="fade"
        onRequestClose={() => setShowImageOptions(false)}
      >
        <View style={styles.imageOptionsOverlay}>
          <View style={styles.imageOptionsContainer}>
            <Text style={styles.imageOptionsTitle}>Seleccionar imagen</Text>

            <TouchableOpacity
              style={styles.imageOption}
              onPress={() => selectImage(true)}
            >
              <Text style={styles.imageOptionText}>📷 Tomar foto</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.imageOption}
              onPress={() => selectImage(false)}
            >
              <Text style={styles.imageOptionText}>
                🖼️ Seleccionar de galería
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.imageOption, styles.cancelOption]}
              onPress={() => setShowImageOptions(false)}
            >
              <Text style={styles.cancelOptionText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: "#2c3e50",
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  form: {
    padding: 20,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  halfWidth: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
    color: "#333",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#fff",
    overflow: "hidden",
  },
  picker: {
    height: 50,
    color: "#333",
  },
  signatureSection: {
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2c3e50",
    marginBottom: 15,
  },
  signatureButton: {
    borderWidth: 2,
    borderColor: "#3498db",
    borderStyle: "dashed",
    borderRadius: 8,
    height: 120,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  signatureButtonText: {
    color: "#3498db",
    fontSize: 14,
    fontWeight: "500",
  },
  signatureImage: {
    width: "100%",
    height: "100%",
  },
  imageButton: {
    borderWidth: 2,
    borderColor: "#27ae60",
    borderStyle: "dashed",
    borderRadius: 8,
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  imageButtonText: {
    color: "#27ae60",
    fontSize: 14,
    fontWeight: "500",
  },
  evidenceImage: {
    width: "100%",
    height: "100%",
    borderRadius: 6,
  },
  footer: {
    flexDirection: "row",
    padding: 20,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    gap: 15,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#e74c3c",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  saveButton: {
    flex: 1,
    backgroundColor: "#27ae60",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  signatureModal: {
    flex: 1,
    backgroundColor: "#fff",
  },
  signatureHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#2c3e50",
  },
  signatureTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
  closeButton: {
    padding: 10,
  },
  closeButtonText: {
    fontSize: 20,
    color: "#fff",
  },
  imageOptionsOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  imageOptionsContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    width: "80%",
    maxWidth: 300,
  },
  imageOptionsTitle: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  imageOption: {
    padding: 15,
    borderRadius: 8,
    backgroundColor: "#f8f9fa",
    marginBottom: 10,
    alignItems: "center",
  },
  imageOptionText: {
    fontSize: 16,
    color: "#333",
  },
  cancelOption: {
    backgroundColor: "#e74c3c",
  },
  cancelOptionText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
  },
  // Estilos para autenticación
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 18,
    color: "#2c3e50",
    fontWeight: "500",
  },
  loginContainer: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 30,
    margin: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  loginTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 10,
    textAlign: "center",
  },
  loginSubtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 22,
  },
  googleSignInButton: {
    backgroundColor: "#4285f4",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    minWidth: 250,
    alignItems: "center",
  },
  googleSignInText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  userInfo: {
    alignItems: "flex-end",
  },
  userText: {
    color: "#fff",
    fontSize: 14,
    marginBottom: 5,
  },
  signOutText: {
    color: "#fff",
    fontSize: 12,
    textDecorationLine: "underline",
  },
  disabledButton: {
    backgroundColor: "#95a5a6",
  },
  appSheetStatus: {
    color: "#fff",
    fontSize: 12,
    textAlign: "center",
    marginTop: 5,
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
});

export default App;
