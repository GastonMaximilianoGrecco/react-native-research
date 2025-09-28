import firestore from '@react-native-firebase/firestore';
import { Alert } from 'react-native';

// Versión simplificada sin Google Sign-In para pruebas
export const saveIncidentReportBasic = async (reportData: any) => {
  try {
    const report = {
      ...reportData,
      createdAt: firestore.FieldValue.serverTimestamp(),
      updatedAt: firestore.FieldValue.serverTimestamp(),
      status: 'test_mode',
    };

    const docRef = await firestore().collection('incident_reports').add(report);

    console.log('Reporte guardado con ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error al guardar el reporte:', error);
    throw error;
  }
};

// Función para probar la conexión a Firestore
export const testFirestoreConnection = async () => {
  try {
    const testDoc = await firestore().collection('test').add({
      message: 'Conexión exitosa',
      timestamp: firestore.FieldValue.serverTimestamp(),
    });

    Alert.alert('✅ Éxito', 'Firestore está funcionando correctamente');
    return testDoc.id;
  } catch (error) {
    console.error('Error de conexión a Firestore:', error);
    Alert.alert('❌ Error', `No se pudo conectar a Firestore: ${error}`);
    throw error;
  }
};
