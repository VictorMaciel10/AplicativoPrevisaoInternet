# Conecta+

App de previsão da qualidade da internet feito em React Native + Expo para a disciplina de Dispositivos Móveis.

## Telas

- **Previsão**: mostra a qualidade da conexão agora (Boa / Média / Ruim) e quais atividades funcionam bem.
- **Por atividade**: escolha a atividade, o dia, o horário e o modelo para ver a previsão.

## API

Os dados vêm da [Internet Quality API](https://internet-quality-api.onrender.com/docs) (`POST /api/v1/activity/check` e `GET /api/v1/models`).

A API fica no Render, então a primeira consulta pode demorar até 1 minuto.

## Como rodar

1. Instale o app **Expo Go** no celular.
2. No computador:

```bash
npm install
npx expo start
```

3. Leia o QR code com o Expo Go (Android) ou com a câmera (iPhone). O celular e o computador precisam estar no mesmo Wi-Fi. Se não conectar, use `npx expo start --tunnel`.
