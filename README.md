# Conecta+

App que mostra como vai estar a qualidade da internet em um horário, feito em React Native com Expo para a disciplina de Dispositivos Móveis.

A ideia é ajudar quem não entende muito de internet a saber se vai dar para fazer uma videochamada, ver um filme ou mandar um arquivo naquele horário, sem precisar saber o que é ping ou perda de pacotes.

## Testar o app

O jeito mais fácil é pelo Snack, não precisa instalar nada no computador:

**[Abrir o Conecta+ no Snack](https://snack.expo.dev/@victormaciel988/conecta+)**

### No navegador

Abre o link acima e escolhe a opção **Web** do lado direito. O app aparece numa telinha de celular ali mesmo.

### No celular

1. Instala o app **Expo Go** (tem na Play Store e na App Store).
2. Abre o link do Snack no computador e clica em **My Device**. Vai aparecer um QR code.
3. Lê o QR code:
   - **Android:** abre o Expo Go e toca em **Scan QR code** (a câmera normal não funciona).
   - **iPhone:** usa a câmera normal e toca no aviso pra abrir no Expo Go.

Se der erro de versão, troca a versão do Expo no Snack (fica embaixo, do lado direito) pra mesma que aparece no seu Expo Go.

## Telas

- **Previsão:** mostra como está a conexão agora (Boa, Média ou Ruim) e quais atividades funcionam bem nesse horário.
- **Por atividade:** você escolhe o que quer fazer, o dia, o horário e o modelo, e o app mostra a previsão.

## API

Os dados vêm da [Internet Quality API](https://internet-quality-api.onrender.com/docs). Usamos duas rotas:

- `GET /api/v1/models` para pegar a lista de modelos (A, B, C e D)
- `POST /api/v1/activity/check` para pegar a previsão de uma atividade em um dia e horário

A API fica hospedada no Render, então a primeira consulta pode demorar até 1 minuto pra responder. Depois fica rápido.

## Acessibilidade

- O resultado nunca aparece só pela cor, sempre tem o texto (Boa, Média ou Ruim) e um ícone junto.
- Botões grandes, com pelo menos 48x48 de área de toque.
- Funciona com o leitor de tela do celular e respeita o tamanho de letra que a pessoa configurou.
- Textos simples, sem termos técnicos.

## Rodar no computador

Precisa ter o Node instalado. Na pasta do projeto:

```bash
npm install
npx expo start
```

Depois é só ler o QR code com o Expo Go. O celular e o computador precisam estar no mesmo Wi-Fi. Se não conectar, tenta `npx expo start --tunnel`.

## Pastas

```
App.js        -> navegação com as duas abas
screens/      -> as telas (Previsão e Por atividade)
components/   -> partes que se repetem (botão, selo, mensagens...)
services/     -> api.js, onde ficam as chamadas pra API
```
