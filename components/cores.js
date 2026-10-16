// cores com bom contraste em fundo claro
export const CORES = {
  fundo: '#F5F7FA',
  card: '#FFFFFF',
  texto: '#1A1C1E',
  textoSuave: '#44474E',
  borda: '#C4C7CF',
  primaria: '#0B57D0',
  primariaClara: '#E3ECFB',
};

// cada qualidade tem texto + ícone + cor (nunca só a cor)
export const QUALIDADES = {
  GOOD: {
    texto: 'Boa',
    icone: 'checkmark-circle',
    cor: '#1B5E20',
    fundo: '#E3F2E5',
    explicacao: 'Sua internet deve funcionar bem. Dá para fazer quase tudo sem travar.',
  },
  MODERATE: {
    texto: 'Média',
    icone: 'alert-circle',
    cor: '#7A4500',
    fundo: '#FFF1D6',
    explicacao: 'A internet pode ficar um pouco lenta. Coisas leves funcionam, mas vídeos podem travar.',
  },
  UNSTABLE: {
    texto: 'Ruim',
    icone: 'close-circle',
    cor: '#B3261E',
    fundo: '#FCE8E6',
    explicacao: 'A internet deve ficar instável. Prefira tarefas simples ou deixe para outro horário.',
  },
};
