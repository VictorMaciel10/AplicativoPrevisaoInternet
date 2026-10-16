import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CORES, QUALIDADES } from './cores';

// linha da lista de atividades recomendadas
export default function ItemAtividade({ nome, icone, adequada, qualidade }) {
  let status = { texto: 'Sem previsão', icone: 'help-circle', cor: CORES.textoSuave };

  if (adequada === true) {
    status = { texto: 'Funciona bem', icone: 'checkmark-circle', cor: QUALIDADES.GOOD.cor };
  } else if (adequada === false && qualidade === 'UNSTABLE') {
    status = { texto: 'Não recomendado', icone: 'close-circle', cor: QUALIDADES.UNSTABLE.cor };
  } else if (adequada === false) {
    status = { texto: 'Pode travar', icone: 'alert-circle', cor: QUALIDADES.MODERATE.cor };
  }

  return (
    <View style={styles.item} accessible={true} accessibilityLabel={nome + ': ' + status.texto}>
      <Ionicons name={icone} size={26} color={CORES.texto} />
      <Text style={styles.nome}>{nome}</Text>
      <View style={styles.status}>
        <Ionicons name={status.icone} size={22} color={status.cor} />
        <Text style={[styles.textoStatus, { color: status.cor }]}>{status.texto}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
    minHeight: 56,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E1E3E8',
  },
  nome: {
    flex: 1,
    minWidth: 120,
    fontSize: 16,
    color: CORES.texto,
  },
  status: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  textoStatus: {
    fontSize: 15,
    fontWeight: 'bold',
  },
});
