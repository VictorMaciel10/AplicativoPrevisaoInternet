import { Pressable, Text, StyleSheet } from 'react-native';
import { CORES } from './cores';

export default function BotaoPrincipal({ titulo, onPress, dica, desativado }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={desativado}
      accessibilityRole="button"
      accessibilityLabel={titulo}
      accessibilityHint={dica}
      accessibilityState={{ disabled: !!desativado }}
      style={({ pressed }) => [
        styles.botao,
        pressed && styles.pressionado,
        desativado && styles.desativado,
      ]}
    >
      <Text style={styles.texto}>{titulo}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  botao: {
    minHeight: 52,
    backgroundColor: CORES.primaria,
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressionado: {
    opacity: 0.8,
  },
  desativado: {
    backgroundColor: '#5F6368',
  },
  texto: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
