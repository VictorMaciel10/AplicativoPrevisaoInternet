import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { QUALIDADES } from './cores';

export default function SeloQualidade({ qualidade }) {
  const info = QUALIDADES[qualidade];
  if (!info) return null;

  return (
    <View
      style={[styles.selo, { backgroundColor: info.fundo, borderColor: info.cor }]}
      accessible={true}
      accessibilityLabel={'Qualidade ' + info.texto}
    >
      <Ionicons name={info.icone} size={24} color={info.cor} />
      <Text style={[styles.texto, { color: info.cor }]}>{info.texto}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  selo: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 2,
  },
  texto: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
