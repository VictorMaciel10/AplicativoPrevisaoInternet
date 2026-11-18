import { useState, useEffect, useRef } from 'react';
import { ScrollView, View, Text, TextInput, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Opcao from '../components/Opcao';
import SeloQualidade from '../components/SeloQualidade';
import BotaoPrincipal from '../components/BotaoPrincipal';
import MensagemEstado from '../components/MensagemEstado';
import Surgir from '../components/Surgir';
import Conectando from '../components/Conectando';
import { CORES, QUALIDADES } from '../components/cores';
import { ATIVIDADES, MODELO_PADRAO, buscarModelos, verificarAtividade } from '../services/api';

const HORARIOS = ['06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'];

// confere se o horário digitado é válido (de 00:00 até 23:59)
function horarioValido(texto) {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(texto);
}

// coloca os dois pontos sozinho enquanto a pessoa digita (2030 -> 20:30)
function formatarDigitado(texto) {
  const numeros = texto.replace(/\D/g, '').slice(0, 4);
  if (numeros.length <= 2) return numeros;
  return numeros.slice(0, 2) + ':' + numeros.slice(2);
}

// tempo mínimo da animação de consulta, para ela não piscar quando a api responde rápido
function esperar(ms) {
  return new Promise((resolver) => setTimeout(resolver, ms));
}

// monta a data a partir do período e do horário escolhidos
function montarData(periodo, horario) {
  const data = new Date();
  if (periodo === 'amanha') {
    data.setDate(data.getDate() + 1);
  }
  const [hora, minuto] = horario.split(':').map(Number);
  data.setHours(hora, minuto, 0, 0);
  return data;
}

// explica em linguagem simples o que a previsão significa para a atividade
function explicar(nomeAtividade, adequada, qualidade) {
  if (adequada) {
    return nomeAtividade + ' deve funcionar bem nesse horário, sem travar.';
  }
  if (qualidade === 'UNSTABLE') {
    return nomeAtividade + ' provavelmente vai ter problemas nesse horário. Se puder, escolha outro horário.';
  }
  return nomeAtividade + ' pode ficar lento ou travar um pouco nesse horário.';
}

export default function PorAtividadeScreen() {
  const [atividade, setAtividade] = useState(ATIVIDADES[0].chave);
  const [periodo, setPeriodo] = useState('hoje');
  const [horario, setHorario] = useState('20:00');
  const [horarioDigitado, setHorarioDigitado] = useState('');
  const [erroHorario, setErroHorario] = useState(false);
  const [modelos, setModelos] = useState([]);
  const [modeloId, setModeloId] = useState(MODELO_PADRAO);
  const [estado, setEstado] = useState('inicio'); // inicio, carregando, erro, vazio, ok
  const [resultado, setResultado] = useState(null);
  const scrollRef = useRef(null);

  // busca os modelos na api ao abrir a tela
  useEffect(() => {
    buscarModelos()
      .then((lista) => setModelos(lista))
      .catch(() => setModelos([{ id: MODELO_PADRAO, name: 'Modelo A' }])); // se falhar, usa só o padrão
  }, []);

  // ao trocar uma opção, limpa a previsão antiga
  function escolher(setValor, valor) {
    setValor(valor);
    setEstado('inicio');
    setErroHorario(false);
  }

  async function verPrevisao() {
    const horarioEscolhido = horario === 'outro' ? horarioDigitado : horario;
    if (!horarioValido(horarioEscolhido)) {
      setErroHorario(true);
      return;
    }
    setErroHorario(false);
    setEstado('carregando');
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    const itemAtividade = ATIVIDADES.find((a) => a.chave === atividade);
    try {
      const [resposta] = await Promise.all([
        verificarAtividade(modeloId, montarData(periodo, horarioEscolhido), itemAtividade.tipoApi),
        esperar(1500),
      ]);
      if (!resposta) {
        setEstado('vazio');
        return;
      }
      setResultado({
        nome: itemAtividade.nome,
        horario: horarioEscolhido,
        periodo: periodo,
        qualidade: resposta.forecast.quality,
        adequada: resposta.suitable,
      });
      setEstado('ok');
    } catch (e) {
      setEstado('erro');
    }
    // rola até o resultado
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  }

  function mostrarResultado() {
    if (estado === 'inicio') {
      return <Text style={styles.dica}>Escolha as opções acima e toque em "Ver previsão".</Text>;
    }
    if (estado === 'carregando') return <MensagemEstado tipo="carregando" />;
    if (estado === 'erro') return <MensagemEstado tipo="erro" onTentarDeNovo={verPrevisao} />;
    if (estado === 'vazio') return <MensagemEstado tipo="vazio" />;

    const info = QUALIDADES[resultado.qualidade];
    const quando = resultado.periodo === 'amanha' ? ' de amanhã' : '';

    return (
      <Surgir style={styles.cardResultado} accessibilityLiveRegion="polite">
        <Text style={styles.tituloSecao} accessibilityRole="header">
          Sua previsão
        </Text>
        <Surgir atraso={150} style={styles.selo}>
          <SeloQualidade qualidade={resultado.qualidade} />
        </Surgir>
        <Text style={styles.frase}>
          Às {resultado.horario}{quando}, a conexão prevista é {info.texto}.
        </Text>
        <Text style={styles.texto}>
          {explicar(resultado.nome, resultado.adequada, resultado.qualidade)}
        </Text>
      </Surgir>
    );
  }

  return (
    <SafeAreaView style={styles.tela} edges={['top']}>
      <ScrollView ref={scrollRef} contentContainerStyle={styles.conteudo}>
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
              onPress={() => escolher(setAtividade, item.chave)}
            />
          ))}
        </View>

        <Text style={styles.tituloSecao} accessibilityRole="header">
          Quando?
        </Text>
        <Text style={styles.rotulo}>Período</Text>
        <View style={styles.linha}>
          <Opcao pequeno texto="Hoje" selecionado={periodo === 'hoje'} onPress={() => escolher(setPeriodo, 'hoje')} />
          <Opcao pequeno texto="Amanhã" selecionado={periodo === 'amanha'} onPress={() => escolher(setPeriodo, 'amanha')} />
        </View>

        <Text style={styles.rotulo}>Horário</Text>
        <View style={styles.linha}>
          {HORARIOS.map((h) => (
            <Opcao pequeno key={h} texto={h} selecionado={horario === h} onPress={() => escolher(setHorario, h)} />
          ))}
          <Opcao pequeno texto="Outro" selecionado={horario === 'outro'} onPress={() => escolher(setHorario, 'outro')} />
        </View>
        {horario === 'outro' && (
          <View style={styles.campoHorario}>
            <Text style={styles.rotulo}>Digite o horário</Text>
            <TextInput
              style={[styles.entrada, erroHorario && styles.entradaErro]}
              value={horarioDigitado}
              onChangeText={(texto) => {
                setHorarioDigitado(formatarDigitado(texto));
                setErroHorario(false);
                setEstado('inicio');
              }}
              placeholder="Ex.: 19:30"
              placeholderTextColor={CORES.textoSuave}
              keyboardType="number-pad"
              maxLength={5}
              accessibilityLabel="Digite o horário, por exemplo 19 e 30"
              autoFocus
            />
            {erroHorario && (
              <Text style={styles.textoErro} accessibilityRole="alert">
                Digite um horário válido, de 00:00 até 23:59.
              </Text>
            )}
          </View>
        )}

        <Text style={styles.tituloSecao} accessibilityRole="header">
          Modelo de previsão
        </Text>
        <View style={styles.linha}>
          {modelos.length === 0 && (
            <View style={styles.carregandoModelos}>
              <Conectando />
              <Text style={styles.texto}>Carregando modelos...</Text>
            </View>
          )}
          {modelos.map((m) => (
            <Opcao pequeno key={m.id} texto={m.name} selecionado={modeloId === m.id} onPress={() => escolher(setModeloId, m.id)} />
          ))}
        </View>

        <BotaoPrincipal
          titulo="Ver previsão"
          onPress={verPrevisao}
          desativado={estado === 'carregando'}
          carregando={estado === 'carregando'}
          tituloCarregando="Consultando..."
        />

        {mostrarResultado()}

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
  campoHorario: {
    gap: 6,
  },
  entrada: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: CORES.borda,
    borderRadius: 12,
    backgroundColor: CORES.card,
    paddingHorizontal: 14,
    fontSize: 18,
    color: CORES.texto,
  },
  entradaErro: {
    borderWidth: 2,
    borderColor: '#B3261E',
  },
  textoErro: {
    fontSize: 15,
    color: '#B3261E',
  },
  carregandoModelos: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dica: {
    fontSize: 16,
    color: CORES.textoSuave,
    textAlign: 'center',
  },
  cardResultado: {
    backgroundColor: CORES.card,
    borderRadius: 16,
    padding: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: '#E1E3E8',
  },
  selo: {
    alignSelf: 'flex-start',
  },
  frase: {
    fontSize: 18,
    fontWeight: 'bold',
    color: CORES.texto,
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
