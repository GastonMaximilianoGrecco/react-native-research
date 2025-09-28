import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

// Configuración de Google Sign-In
export const configureGoogleSignIn = () => {
  GoogleSignin.configure({
    webClientId: '123456789000-webClientId.apps.googleusercontent.com', // TEMPORAL - Reemplaza con tu Web Client ID real
    offlineAccess: true,
  });
};

// Función para iniciar sesión con Google
export const signInWithGoogle = async () => {
  try {
    // Verificar si Google Play Services está disponible
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

    // Obtener información del usuario
    const userInfo = await GoogleSignin.signIn();

    // Obtener los tokens de Google
    const tokens = await GoogleSignin.getTokens();

    // Crear credencial de Google
    const googleCredential = auth.GoogleAuthProvider.credential(tokens.idToken);

    // Iniciar sesión con Firebase
    const userCredential = await auth().signInWithCredential(googleCredential);

    return userCredential.user;
  } catch (error) {
    console.error('Error al iniciar sesión con Google:', error);
    throw error;
  }
};

// Función para cerrar sesión
export const signOut = async () => {
  try {
    await GoogleSignin.signOut();
    await auth().signOut();
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    throw error;
  }
};

// Función para obtener el usuario actual
export const getCurrentUser = () => {
  return auth().currentUser;
};

// Función para guardar un reporte de incidente en Firestore
export const saveIncidentReport = async (
  reportData: any,
  syncToSheets: boolean = false,
) => {
  try {
    const user = getCurrentUser();
    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    const report = {
      ...reportData,
      userId: user.uid,
      userEmail: user.email,
      createdAt: firestore.FieldValue.serverTimestamp(),
      updatedAt: firestore.FieldValue.serverTimestamp(),
    };

    // Guardar en Firestore
    const docRef = await firestore().collection('incident_reports').add(report);

    console.log('Reporte guardado en Firestore con ID:', docRef.id);

    // Opcionalmente sincronizar con Google Sheets
    if (syncToSheets) {
      try {
        const { saveReportToGoogleSheets } = await import(
          './googleSheetsService'
        );
        await saveReportToGoogleSheets({
          ...reportData,
          userEmail: user.email,
        });
        console.log('Reporte también guardado en Google Sheets');
      } catch (sheetsError) {
        console.warn('Error sincronizando con Google Sheets:', sheetsError);
        // No fallar si Google Sheets falla, el reporte ya está en Firestore
      }
    }

    return docRef.id;
  } catch (error) {
    console.error('Error al guardar el reporte:', error);
    throw error;
  }
};

// Función para obtener todos los reportes del usuario actual
export const getUserReports = async () => {
  try {
    const user = getCurrentUser();
    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    const snapshot = await firestore()
      .collection('incident_reports')
      .where('userId', '==', user.uid)
      .orderBy('createdAt', 'desc')
      .get();

    const reports = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return reports;
  } catch (error) {
    console.error('Error al obtener reportes:', error);
    throw error;
  }
};

// Función para actualizar un reporte existente
export const updateIncidentReport = async (
  reportId: string,
  reportData: any,
) => {
  try {
    const user = getCurrentUser();
    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    const updatedReport = {
      ...reportData,
      updatedAt: firestore.FieldValue.serverTimestamp(),
    };

    await firestore()
      .collection('incident_reports')
      .doc(reportId)
      .update(updatedReport);

    console.log('Reporte actualizado:', reportId);
    return reportId;
  } catch (error) {
    console.error('Error al actualizar el reporte:', error);
    throw error;
  }
};

// Función para eliminar un reporte
export const deleteIncidentReport = async (reportId: string) => {
  try {
    const user = getCurrentUser();
    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    await firestore().collection('incident_reports').doc(reportId).delete();

    console.log('Reporte eliminado:', reportId);
    return true;
  } catch (error) {
    console.error('Error al eliminar el reporte:', error);
    throw error;
  }
};

// Función para subir imagen a Firebase Storage (requiere @react-native-firebase/storage)
export const uploadImage = async (imageUri: string, fileName: string) => {
  try {
    // Esta función requiere Firebase Storage
    // npm install @react-native-firebase/storage

    // const reference = storage().ref(`incident_images/${fileName}`);
    // await reference.putFile(imageUri);
    // const downloadURL = await reference.getDownloadURL();
    // return downloadURL;

    console.log('Función de subida de imagen - requiere Firebase Storage');
    return imageUri; // Por ahora devuelve la URI local
  } catch (error) {
    console.error('Error al subir imagen:', error);
    throw error;
  }
};
