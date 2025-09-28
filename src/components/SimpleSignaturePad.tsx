import React, { useRef, useState } from 'react';
import { View, PanResponder, Dimensions, Alert } from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface SimpleSignaturePadProps {
  onSignatureCapture: (svgPath: string) => void;
  penColor?: string;
  backgroundColor?: string;
}

// Componente de firma nativo simple como alternativa
export const SimpleSignaturePad: React.FC<SimpleSignaturePadProps> = ({
  onSignatureCapture,
  penColor = '#000000',
  backgroundColor = '#ffffff',
}) => {
  const [paths, setPaths] = useState<string[]>([]);
  const [currentPath, setCurrentPath] = useState('');
  const pathRef = useRef('');

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,

      onPanResponderGrant: evt => {
        const { locationX, locationY } = evt.nativeEvent;
        const newPath = `M${locationX},${locationY}`;
        pathRef.current = newPath;
        setCurrentPath(newPath);
      },

      onPanResponderMove: evt => {
        const { locationX, locationY } = evt.nativeEvent;
        pathRef.current += ` L${locationX},${locationY}`;
        setCurrentPath(pathRef.current);
      },

      onPanResponderRelease: () => {
        setPaths(prevPaths => [...prevPaths, pathRef.current]);
        setCurrentPath('');
        pathRef.current = '';
      },
    }),
  ).current;

  const clearSignature = () => {
    setPaths([]);
    setCurrentPath('');
    pathRef.current = '';
  };

  const captureSignature = () => {
    if (paths.length === 0 && currentPath === '') {
      Alert.alert('Error', 'Por favor, agregue una firma antes de continuar');
      return;
    }

    // Generar SVG simple como string
    const allPaths = [...paths];
    if (currentPath) allPaths.push(currentPath);

    const svgString = `
      <svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="${backgroundColor}"/>
        ${allPaths
          .map(
            path =>
              `<path d="${path}" stroke="${penColor}" strokeWidth="2" fill="none"/>`,
          )
          .join('')}
      </svg>
    `;

    // Por simplicidad, pasar el SVG directamente como string
    onSignatureCapture(svgString);
  };

  return (
    <View style={{ flex: 1, backgroundColor }}>
      <View
        style={{
          flex: 1,
          backgroundColor,
          margin: 20,
          borderWidth: 1,
          borderColor: '#ddd',
          borderRadius: 8,
        }}
        {...panResponder.panHandlers}
      >
        <Svg style={{ flex: 1 }} width="100%" height="100%">
          {paths.map((path, index) => (
            <Path
              key={index}
              d={path}
              stroke={penColor}
              strokeWidth={2}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}
          {currentPath !== '' && (
            <Path
              d={currentPath}
              stroke={penColor}
              strokeWidth={2}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
        </Svg>
      </View>
    </View>
  );
};
