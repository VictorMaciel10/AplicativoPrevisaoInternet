const BASE_URL = 'https://internet-quality-api.onrender.com/api/v1';

// localização fixa (São Paulo) para não precisar pedir GPS
const LATITUDE = -23.55;
const LONGITUDE = -46.63;

// modelo usado na tela inicial
export const MODELO_PADRAO = 'model-a';

// atividades do app e o tipo correspondente na api
// a api não tem "jogos", então usamos a regra da videochamada (as duas precisam de resposta rápida)
export const ATIVIDADES = [
  { chave: 'video', nome: 'Videoconferência', icone: 'videocam', tipoApi: 'VIDEO_CALL' },
  { chave: 'streaming', nome: 'Streaming', icone: 'tv', tipoApi: 'STREAMING' },
  { chave: 'jogos', nome: 'Jogos online', icone: 'game-controller', tipoApi: 'VIDEO_CALL' },
  { chave: 'navegacao', nome: 'Navegação', icone: 'globe', tipoApi: 'WEB_BROWSING' },
  { chave: 'arquivos', nome: 'Envio de arquivos', icone: 'cloud-upload', tipoApi: 'FILE_UPLOAD' },
];

async function chamarApi(caminho, opcoes) {
  const resposta = await fetch(BASE_URL + caminho, opcoes);

  // 404 = não tem previsão para isso
  if (resposta.status === 404) {
    return null;
  }
  if (!resposta.ok) {
    throw new Error('Erro na API: ' + resposta.status);
  }
  return resposta.json();
}

// lista os modelos de previsão disponíveis
export async function buscarModelos() {
  const dados = await chamarApi('/models');
  return dados ? dados.items : [];
}

// busca a previsão de uma atividade em uma data/hora
export async function verificarAtividade(modeloId, dataHora, tipoApi) {
  return chamarApi('/activity/check', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      modelId: modeloId,
      latitude: LATITUDE,
      longitude: LONGITUDE,
      dateTime: dataHora.toISOString(),
      activity: tipoApi,
    }),
  });
}
