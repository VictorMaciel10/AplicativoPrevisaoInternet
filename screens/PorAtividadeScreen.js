import { useState } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Opcao from '../components/Opcao';
import BotaoPrincipal from '../components/BotaoPrincipal';
import { CORES } from '../components/cores';
import { ATIVIDADES } from '../services/api';

const HORARIOS = ['08:00', '12:00', '18:00', '20:00', '22:00'];

// por enquanto fixo, depois vai vir da api
const MODELOS = ['Modelo A', 'Modelo B', 'Modelo C', 'Modelo D'];

export default function PorAtividadeScreen() {
  const [atividade, setAtividade] = useState(ATIVIDADES[0].chave);
  const [periodo, setPeriodo] = useState('hoje');
  const [horario, setHorario] = useState('20:00');
  const [modelo, setModelo] = useState(MODELOS[0]);

  return (
    <SafeAreaView style={styles.tela} edges={['top']}>
      <ScrollView contentContainerStyle={styles.conteudo}>
        <Text style={styles.titulo} accessibilityRole="header">
          Prever por atividade
        </Text>

        <Text style={styles.tituloSecao} accessibilityRole="header">
          O que você quer fazer?
        </Text>
        <View>
          {ATIVIDADES.map((item) => (
            <Opcao
              key={item.chave}
              texto={item.nome}
              icone={item.icone}
              selecionado={atividade === item.chave}
              onPress={() => setAtividade(item.chave)}
            />
          ))}
        </View>

        <Text style={styles.tituloSecao} accessibilityRole="header">
          Quando?
        </Text>
        <Text style={styles.rotulo}>Período</Text>
        <View style={styles.linha}>
          <Opcao pequeno texto="Hoje" selecionado={periodo === 'hoje'} onPress={() => setPeriodo('hoje')} />
          <Opcao pequeno texto="Amanhã" selecionado={periodo === 'amanha'} onPress={() => setPeriodo('amanha')} />
        </View>

        <Text style={styles.rotulo}>Horário</Text>
        <View style={styles.linha}>
          {HORARIOS.map((h) => (
            <Opcao pequeno key={h} texto={h} selecionado={horario === h} onPress={() => setHorario(h)} />
          ))}
        </View>

        <Text style={styles.tituloSecao} accessibilityRole="header">
          Modelo de previsão
        </Text>
        <View style={styles.linha}>
          {MODELOS.map((m) => (
            <Opcao pequeno key={m} texto={m} selecionado={modelo === m} onPress={() => setModelo(m)} />
          ))}
        </View>

        <BotaoPrincipal titulo="Ver previsão" onPress={() => {}} />

        <View style={styles.cardResultado}>
          <Text style={styles.tituloSecao} accessibilityRole="header">
            Sua previsão
          </Text>
          <Text style={styles.texto}>Escolha as opções acima e toque em "Ver previsão".</Text>
        </View>

        <View style={styles.aviso}>
          <Ionicons name="information-circle" size={24} color={CORES.textoSuave} />
          <Text style={styles.textoAviso}>
            A previsão pode variar se muitas pessoas usarem a mesma rede ao mesmo tempo.
          </Text>
        </View>
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
    gap: 12,
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: CORES.texto,
  },
  tituloSecao: {
    fontSize: 20,
    fontWeight: 'bold',
    color: CORES.texto,
    marginTop: 4,
  },
  rotulo: {
    fontSize: 16,
    color: CORES.textoSuave,
  },
  linha: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cardResultado: {
    backgroundColor: CORES.card,
    borderRadius: 16,
    padding: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: '#E1E3E8',
  },
  texto: {
    fontSize: 16,
    color: CORES.texto,
  },
  aviso: {
    flexDirection: 'row',
    gap: 8,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#ECEEF2',
  },
  textoAviso: {
    flex: 1,
    fontSize: 15,
    color: CORES.textoSuave,
  },
});
