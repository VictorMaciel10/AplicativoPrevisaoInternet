import { useEffect, useRef, useState } from 'react';
import { View, Text, Animated, Easing, AccessibilityInfo, Platform, StyleSheet } from 'react-native';
import Svg, { Polygon, Path, Line } from 'react-native-svg';
import { CORES } from './cores';

// no navegador a animação não usa o driver nativo
const DRIVER_NATIVO = Platform.OS !== 'web';

const LARGURA = 280;
const ALTURA = 170;

const ETAPAS = ['Procurando o sinal...', 'Consultando a previsão...', 'Preparando o resultado...'];

// transforma uma posição do "mapa" (x, y, altura) em um ponto da tela (visão isométrica)
function criarIso(origemX, origemY, tamanho) {
  return (x, y, z) => [
    origemX + (x - y) * tamanho * 0.866,
    origemY + (x + y) * tamanho * 0.5 - z * tamanho,
  ];
}

const iso = criarIso(140, 40, 14);

function pontos(lista) {
  return lista.map((p) => p.join(',')).join(' ');
}

// desenha uma caixa 3D (topo, lado esquerdo e lado direito); base é a altura onde ela começa
function Caixa({ x, y, largura, fundo, altura, base = 0, cores, conversor = iso }) {
  const [corTopo, corEsquerda, corDireita] = cores;
  const x2 = x + largura;
  const y2 = y + fundo;
  const z1 = base;
  const z2 = base + altura;
  return (
    <>
      <Polygon
        points={pontos([conversor(x, y2, z1), conversor(x2, y2, z1), conversor(x2, y2, z2), conversor(x, y2, z2)])}
        fill={corEsquerda}
      />
      <Polygon
        points={pontos([conversor(x2, y, z1), conversor(x2, y2, z1), conversor(x2, y2, z2), conversor(x2, y, z2)])}
        fill={corDireita}
      />
      <Polygon
        points={pontos([conversor(x, y, z2), conversor(x2, y, z2), conversor(x2, y2, z2), conversor(x, y2, z2)])}
        fill={corTopo}
      />
    </>
  );
}

function Arvore({ x, y }) {
  return (
    <>
      <Caixa x={x - 0.1} y={y - 0.1} largura={0.2} fundo={0.2} altura={0.6} cores={['#8D6E63', '#6D4C41', '#5D4037']} />
      <Caixa x={x - 0.4} y={y - 0.4} largura={0.8} fundo={0.8} altura={0.8} base={0.5} cores={['#66BB6A', '#43A047', '#2E7D32']} />
    </>
  );
}

// a casa da pessoa, com telhado azul
function Casa() {
  const x = 1, y = 4.5, l = 2, f = 2, h = 1.5;
  const topo = iso(x + l / 2, y + f / 2, 2.5);
  return (
    <>
      <Caixa x={x} y={y} largura={l} fundo={f} altura={h} cores={['#FFFFFF', '#ECEFF4', '#D5DAE3']} />
      {/* porta e janela */}
      <Polygon points={pontos([iso(1.5, 6.5, 0), iso(2, 6.5, 0), iso(2, 6.5, 0.9), iso(1.5, 6.5, 0.9)])} fill="#5D4037" />
      <Polygon points={pontos([iso(3, 5, 0.6), iso(3, 5.8, 0.6), iso(3, 5.8, 1.1), iso(3, 5, 1.1)])} fill="#90CAF9" />
      {/* telhado */}
      <Polygon points={pontos([iso(x, y + f, h), iso(x + l, y + f, h), topo])} fill={CORES.primaria} />
      <Polygon points={pontos([iso(x + l, y, h), iso(x + l, y + f, h), topo])} fill="#0842A0" />
    </>
  );
}

// pontos da curva por onde os dados viajam (da antena até a casa)
const TOPO_ANTENA = iso(6.3, 1.3, 4.8);
const TOPO_CASA = iso(2, 5.5, 2.6);
const CONTROLE = [(TOPO_ANTENA[0] + TOPO_CASA[0]) / 2, Math.min(TOPO_ANTENA[1], TOPO_CASA[1]) - 30];
const CAMINHO = `M ${TOPO_ANTENA.join(' ')} Q ${CONTROLE.join(' ')} ${TOPO_CASA.join(' ')}`;

const AMOSTRAS = 12;
const ENTRADA = [];
const CURVA_X = [];
const CURVA_Y = [];
for (let i = 0; i <= AMOSTRAS; i++) {
  const t = i / AMOSTRAS;
  const a = (1 - t) * (1 - t);
  const b = 2 * (1 - t) * t;
  const c = t * t;
  ENTRADA.push(t);
  CURVA_X.push(a * TOPO_ANTENA[0] + b * CONTROLE[0] + c * TOPO_CASA[0]);
  CURVA_Y.push(a * TOPO_ANTENA[1] + b * CONTROLE[1] + c * TOPO_CASA[1]);
}

// carrinho que passa na rua (desenhado no próprio quadradinho dele)
const isoCarro = criarIso(10, 12, 14);
const INICIO_CARRO = iso(-0.6, 7.25, 0);
const FIM_CARRO = iso(8, 7.25, 0);

function Carro() {
  return (
    <Svg width={26} height={26}>
      <Caixa conversor={isoCarro} x={0} y={0} largura={1} fundo={0.55} altura={0.35} cores={['#64B5F6', '#1E88E5', '#1565C0']} />
      <Caixa conversor={isoCarro} x={0.2} y={0.05} largura={0.5} fundo={0.45} altura={0.3} base={0.35} cores={['#90CAF9', '#BBDEFB', '#64B5F6']} />
    </Svg>
  );
}

// avisa se a pessoa pediu para reduzir os movimentos no celular
function useReduzirMovimento() {
  const [reduzir, setReduzir] = useState(false);
  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduzir).catch(() => {});
    const inscricao = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduzir);
    return () => inscricao?.remove();
  }, []);
  return reduzir;
}

function repetir(valor, duracao) {
  return Animated.loop(
    Animated.timing(valor, { toValue: 1, duration: duracao, easing: Easing.linear, useNativeDriver: DRIVER_NATIVO })
  );
}

// animação que aparece enquanto a previsão está sendo buscada
export default function CenaConsulta() {
  const reduzir = useReduzirMovimento();
  const dados = useRef(new Animated.Value(0)).current;
  const sinal = useRef(new Animated.Value(0)).current;
  const carro = useRef(new Animated.Value(0)).current;
  const opacidadeTexto = useRef(new Animated.Value(1)).current;
  const [etapa, setEtapa] = useState(0);

  useEffect(() => {
    if (reduzir) return;
    const animacoes = [repetir(dados, 1800), repetir(sinal, 1600), repetir(carro, 4200)];
    animacoes.forEach((a) => a.start());
    return () => animacoes.forEach((a) => a.stop());
  }, [reduzir]);

  // troca a frase de baixo de tempos em tempos
  useEffect(() => {
    const timer = setInterval(() => {
      setEtapa((e) => (e + 1) % ETAPAS.length);
      if (!reduzir) {
        opacidadeTexto.setValue(0);
        Animated.timing(opacidadeTexto, {
          toValue: 1,
          duration: 250,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: DRIVER_NATIVO,
        }).start();
      }
    }, 1800);
    return () => clearInterval(timer);
  }, [reduzir]);

  function pacote(atraso) {
    const t = Animated.modulo(Animated.add(dados, atraso), 1);
    return {
      opacity: t.interpolate({ inputRange: [0, 0.1, 0.85, 1], outputRange: [0, 1, 1, 0] }),
      transform: [
        { translateX: t.interpolate({ inputRange: ENTRADA, outputRange: CURVA_X }) },
        { translateY: t.interpolate({ inputRange: ENTRADA, outputRange: CURVA_Y }) },
      ],
    };
  }

  function onda(atraso) {
    const t = Animated.modulo(Animated.add(sinal, atraso), 1);
    return {
      opacity: t.interpolate({ inputRange: [0, 1], outputRange: [0.7, 0] }),
      transform: [{ scale: t.interpolate({ inputRange: [0, 1], outputRange: [0.4, 1.8] }) }],
    };
  }

  const estiloCarro = {
    opacity: carro.interpolate({ inputRange: [0, 0.08, 0.92, 1], outputRange: [0, 1, 1, 0] }),
    transform: [
      { translateX: carro.interpolate({ inputRange: [0, 1], outputRange: [INICIO_CARRO[0] - 10, FIM_CARRO[0] - 10] }) },
      { translateY: carro.interpolate({ inputRange: [0, 1], outputRange: [INICIO_CARRO[1] - 12, FIM_CARRO[1] - 12] }) },
    ],
  };

  return (
    <View style={styles.caixa}>
      <View style={styles.cena} accessible={false} importantForAccessibility="no-hide-descendants">
        <Svg width={LARGURA} height={ALTURA} style={StyleSheet.absoluteFill}>
          {/* chão */}
          <Polygon points={pontos([iso(0, 8, 0), iso(8, 8, 0), iso(8, 8, -0.4), iso(0, 8, -0.4)])} fill="#C9D3E3" />
          <Polygon points={pontos([iso(8, 0, 0), iso(8, 8, 0), iso(8, 8, -0.4), iso(8, 0, -0.4)])} fill="#B3BFD3" />
          <Polygon points={pontos([iso(0, 0, 0), iso(8, 0, 0), iso(8, 8, 0), iso(0, 8, 0)])} fill="#E8EDF5" />

          {/* rua */}
          <Polygon points={pontos([iso(0, 6.9, 0), iso(8, 6.9, 0), iso(8, 7.9, 0), iso(0, 7.9, 0)])} fill="#3C4048" />
          {[0.4, 1.9, 3.4, 4.9, 6.4].map((x) => (
            <Line
              key={x}
              x1={iso(x, 7.4, 0)[0]}
              y1={iso(x, 7.4, 0)[1]}
              x2={iso(x + 0.8, 7.4, 0)[0]}
              y2={iso(x + 0.8, 7.4, 0)[1]}
              stroke="#F9C74F"
              strokeWidth={1.5}
            />
          ))}

          {/* prédios do fundo */}
          <Caixa x={3} y={0.3} largura={1.8} fundo={1.5} altura={2.6} cores={['#B0B7C3', '#8E96A3', '#767E8B']} />
          <Caixa x={0.3} y={0.8} largura={1.5} fundo={1.8} altura={1.8} cores={['#C5CAD3', '#A2A9B5', '#8A919D']} />

          {/* antena */}
          <Caixa x={6} y={1} largura={0.6} fundo={0.6} altura={4.4} cores={['#9AA1AD', '#7A828E', '#5F6672']} />
          <Caixa x={5.95} y={0.95} largura={0.7} fundo={0.7} altura={0.3} base={4.4} cores={['#B3261E', '#B3261E', '#8C1D17']} />

          <Arvore x={0.6} y={3.6} />
          <Arvore x={3.9} y={3.9} />
          <Arvore x={7.1} y={4.2} />
          <Casa />
          <Arvore x={5.3} y={5.6} />

          {/* caminho dos dados */}
          <Path d={CAMINHO} stroke={CORES.primaria} strokeWidth={2} strokeDasharray="4 5" fill="none" opacity={0.5} />
        </Svg>

        {!reduzir && (
          <>
            <Animated.View style={[styles.onda, { left: TOPO_ANTENA[0] - 14, top: TOPO_ANTENA[1] - 14 }, onda(0)]} />
            <Animated.View style={[styles.onda, { left: TOPO_ANTENA[0] - 14, top: TOPO_ANTENA[1] - 14 }, onda(0.5)]} />
            <Animated.View style={[styles.pacote, pacote(0)]} />
            <Animated.View style={[styles.pacote, pacote(1 / 3)]} />
            <Animated.View style={[styles.pacote, pacote(2 / 3)]} />
            <Animated.View style={[styles.carro, estiloCarro]}>
              <Carro />
            </Animated.View>
          </>
        )}
      </View>

      <View accessibilityLiveRegion="polite">
        <Animated.Text style={[styles.titulo, { opacity: opacidadeTexto }]}>{ETAPAS[etapa]}</Animated.Text>
      </View>
      <Text style={styles.texto}>A primeira consulta pode demorar até 1 minuto.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  caixa: {
    alignItems: 'center',
    gap: 8,
    padding: 16,
    backgroundColor: CORES.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: CORES.borda,
    overflow: 'hidden',
  },
  cena: {
    width: LARGURA,
    height: ALTURA,
    maxWidth: '100%',
  },
  onda: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: CORES.primaria,
  },
  pacote: {
    position: 'absolute',
    left: -5,
    top: -5,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: CORES.primaria,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  carro: {
    position: 'absolute',
    left: 0,
    top: 0,
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
});
