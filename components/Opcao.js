import { Pressable, Text, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CORES } from './cores';

// opção que pode ser selecionada (borda + check, não só cor)
export default function Opcao({ texto, icone, selecionado, onPress, pequeno }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={texto}
      accessibilityState={{ selected: selecionado }}
      style={({ pressed }) => [
        styles.opcao,
        pequeno && styles.pequeno,
        selecionado && styles.selecionado,
        pressed && styles.pressionado,
      ]}
    >
      {icone && (
        <Ionicons name={icone} size={24} color={selecionado ? CORES.primaria : CORES.textoSuave} />
      )}
      <Text style={[styles.texto, selecionado && styles.textoSelecionado]}>{texto}</Text>
      {selecionado ? (
        <Ionicons name="checkmark-circle" size={24} color={CORES.primaria} />
      ) : (
        <View style={styles.espacoCheck} />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  opcao: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 52,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: CORES.borda,
    backgroundColor: CORES.card,
    marginBottom: 8,
  },
  pequeno: {
    minWidth: 48,
    marginRight: 8,
    gap: 6,
  },
  selecionado: {
    borderWidth: 3,
    borderColor: CORES.primaria,
    backgroundColor: CORES.primariaClara,
  },
  pressionado: {
    opacity: 0.7,
  },
  texto: {
    flexShrink: 1,
    fontSize: 16,
    color: CORES.texto,
  },
  textoSelecionado: {
    fontWeight: 'bold',
  },
  espacoCheck: {
    width: 24,
  },
});
