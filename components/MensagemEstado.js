import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BotaoPrincipal from './BotaoPrincipal';
import { CORES } from './cores';

// mostra os estados de carregando, erro e sem resultado
export default function MensagemEstado({ tipo, onTentarDeNovo }) {
  if (tipo === 'carregando') {
    return (
      <View style={styles.caixa} accessibilityLiveRegion="polite">
        <ActivityIndicator size="large" color={CORES.primaria} />
        <Text style={styles.titulo}>Carregando...</Text>
        <Text style={styles.texto}>A primeira consulta pode demorar até 1 minuto.</Text>
      </View>
    );
  }

  if (tipo === 'erro') {
    return (
      <View style={styles.caixa} accessibilityRole="alert">
        <Ionicons name="cloud-offline" size={40} color="#B3261E" />
        <Text style={styles.titulo}>Não foi possível buscar a previsão</Text>
        <Text style={styles.texto}>Confira se você está conectado e tente de novo.</Text>
        <View style={styles.botao}>
          <BotaoPrincipal titulo="Tentar de novo" onPress={onTentarDeNovo} />
        </View>
      </View>
    );
  }

  // sem resultado
  return (
    <View style={styles.caixa} accessibilityLiveRegion="polite">
      <Ionicons name="search" size={40} color={CORES.textoSuave} />
      <Text style={styles.titulo}>Sem previsão para este horário</Text>
      <Text style={styles.texto}>Tente escolher outro horário ou outro modelo.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  caixa: {
    alignItems: 'center',
    gap: 8,
    padding: 20,
    backgroundColor: CORES.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: CORES.borda,
  },
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: CORES.texto,
    textAlign: 'center',
  },
  texto: {
    fontSize: 16,
    color: CORES.textoSuave,
    textAlign: 'center',
  },
  botao: {
    marginTop: 8,
    alignSelf: 'stretch',
  },
});
