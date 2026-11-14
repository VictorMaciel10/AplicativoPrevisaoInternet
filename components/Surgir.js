import { useEffect, useRef } from 'react';
import { Animated, Easing, AccessibilityInfo, Platform } from 'react-native';

// faz o conteúdo aparecer subindo devagar (usado no resultado da previsão)
export default function Surgir({ children, atraso = 0, style, ...outros }) {
  const progresso = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled()
      .catch(() => false)
      .then((reduzir) => {
        if (reduzir) {
          progresso.setValue(1);
          return;
        }
        Animated.timing(progresso, {
          toValue: 1,
          duration: 380,
          delay: atraso,
          easing: Easing.bezier(0.22, 1, 0.36, 1),
          useNativeDriver: Platform.OS !== 'web',
        }).start();
      });
  }, []);

  return (
    <Animated.View
      {...outros}
      style={[
        style,
        {
          opacity: progresso,
          transform: [
            { translateY: progresso.interpolate({ inputRange: [0, 1], outputRange: [14, 0] }) },
            { scale: progresso.interpolate({ inputRange: [0, 1], outputRange: [0.97, 1] }) },
          ],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
}
