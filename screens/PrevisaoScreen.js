import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import SeloQualidade from '../components/SeloQualidade';
import ItemAtividade from '../components/ItemAtividade';
import BotaoPrincipal from '../components/BotaoPrincipal';
import { CORES, QUALIDADES } from '../components/cores';
import { ATIVIDADES } from '../services/api';

function formatarHora(data) {
  const hora = String(data.getHours()).padStart(2, '0');
  const minuto = String(data.getMinutes()).padStart(2, '0');
  return hora + ':' + minuto;
}

export default function PrevisaoScreen() {
  const horario = formatarHora(new Date());

  // valor fixo por enquanto, depois vai vir da api
  const qualidade = 'GOOD';

  function mostrarConteudo() {
    return (
      <>
        <View style={styles.card}>
          <Text style={styles.tituloCard} accessibilityRole="header">
            Qualidade da conexão
          </Text>
          <Text style={styles.horario}>Agora, {horario}</Text>
          <SeloQualidade qualidade={qualidade} />
          <Text style={styles.explicacao}>{QUALIDADES[qualidade].explicacao}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.tituloCard} accessibilityRole="header">
            Atividades recomendadas
          </Text>
          {ATIVIDADES.map((item) => (
            <ItemAtividade key={item.chave} nome={item.nome} icone={item.icone} adequada={true} />
          ))}
        </View>
      </>
    );
  }

  return (
    <SafeAreaView style={styles.tela} edges={['top']}>
      <ScrollView contentContainerStyle={styles.conteudo}>
        <View style={styles.cabecalho}>
          <View style={styles.iconeWifi}>
            <Ionicons name="wifi" size={32} color={CORES.primaria} />
          </View>
          <View style={styles.textosCabecalho}>
            <Text style={styles.titulo} accessibilityRole="header">
              Conecta+
            </Text>
            <Text style={styles.subtitulo}>Veja como estará sua conexão.</Text>
          </View>
        </View>

        {mostrarConteudo()}

        <BotaoPrincipal
          titulo="Consultar outro horário"
          onPress={() => {}}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: CORES.fundo,
  },
  conteudo: {
    padding: 16,
    gap: 16,
  },
  cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 4,
  },
  iconeWifi: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: CORES.primariaClara,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textosCabecalho: {
    flex: 1,
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: CORES.texto,
  },
  subtitulo: {
    fontSize: 16,
    color: CORES.textoSuave,
  },
  card: {
    backgroundColor: CORES.card,
    borderRadius: 16,
    padding: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: '#E1E3E8',
  },
  tituloCard: {
    fontSize: 20,
    fontWeight: 'bold',
    color: CORES.texto,
  },
  horario: {
    fontSize: 16,
    color: CORES.textoSuave,
  },
  explicacao: {
    fontSize: 16,
    color: CORES.texto,
  },
});
