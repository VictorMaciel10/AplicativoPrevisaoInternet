import { useEffect, useRef, useState } from 'react';
import { View, Animated, Easing, AccessibilityInfo, Platform, StyleSheet } from 'react-native';
import { CORES } from './cores';

const ALTURAS = [6, 10, 14, 18];

// barrinhas de sinal que acendem uma depois da outra (indica que está conectando)
export default function Conectando({ cor = CORES.primaria }) {
  const progresso = useRef(new Animated.Value(0)).current;
  const [reduzir, setReduzir] = useState(false);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduzir).catch(() => {});
  }, []);

  useEffect(() => {
    if (reduzir) return;
    const animacao = Animated.loop(
      Animated.timing(progresso, {
        toValue: 1,
        duration: 1200,
        easing: Easing.linear,
        useNativeDriver: Platform.OS !== 'web',
      })
    );
    animacao.start();
    return () => animacao.stop();
  }, [reduzir]);

  return (
    <View style={styles.linha} accessible={false} importantForAccessibility="no-hide-descendants">
      {ALTURAS.map((altura, i) => {
        // cada barra acende um pouco depois da anterior
        const inicio = i * 0.2;
        const opacity = reduzir
          ? 1
          : progresso.interpolate({
              inputRange: [0, inicio, inicio + 0.15, 1],
              outputRange: [0.3, 0.3, 1, 1],
            });
        return <Animated.View key={altura} style={[styles.barra, { height: altura, backgroundColor: cor, opacity }]} />;
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  linha: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 3,
    height: 18,
  },
  barra: {
    width: 4,
    borderRadius: 2,
  },
});
