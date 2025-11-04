# EchoBeacon Mobile – Gestão de Motos no Pátio Mottu

## 👤 Integrantes

- Gabriel Santos Jablonski - RM: 555452 
- Gustavo Lopes Santos da Silva - RM: 556859  
- Renato de Freitas David Campiteli - RM: 555627  

---

## 📱 Descrição da Solução

Este projeto foi desenvolvido com o objetivo de otimizar a **organização, gestão e localização das motos** no pátio da empresa **Mottu**. A solução combina hardware e software para permitir que os colaboradores encontrem rapidamente os veículos corretos mesmo em ambientes lotados.

### A solução é composta por:

- **Tag EchoBeacon (ESP32):** instalada em cada moto, equipada com LED e buzzer.
- **Aplicativo mobile:** permite visualizar, consultar e localizar motos no pátio.
- **Banco de dados integrado:** onde são armazenadas as informações das motos.
- **Cadastro de motos:** realizado via sistema firestore, integrado ao app mobile.

### Principais Funcionalidades:

- Tela de login e cadastro com persistência local.
- Visualização de motos separadas por status (recepção ou pátio).
- Consulta de placa, chassi e problema da moto.
- Ativação remota da tag EchoBeacon (buzzer + LED) para localização visual e sonora.
- Interface acessível, responsiva e moderna.

### Link para o figma do projeto:
- [FIGMA ECHOBEACON](https://www.figma.com/design/ed2FNPCmujOFAV0ZztdYcS/EchoBeacon---Sprint-1?node-id=0-1&p=f&t=UQNlcZBaC1OlCIHY-0)

### Link do vídeo de apresentação do app:
- [VÍDEO DEMONSTRAÇÃO](https://youtu.be/B2gzPBEGnck)

---

## 🚀 Como Rodar o Projeto Localmente

### 📋 Pré-requisitos

- [Node.js](https://nodejs.org/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- Editor como [VS Code](https://code.visualstudio.com/)
- Aplicativo **Expo Go** no celular (Android/iOS)

### ⚙️Adicione o .env 
- Crie o .env na raiz do projeto para você colocar suas configurações do firebase
```env
EXPO_PUBLIC_FIREBASE_API_KEY=<sua configuração do firebase>
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=<sua configuração do firebase>
EXPO_PUBLIC_FIREBASE_PROJECT_ID=<sua configuração do firebase>
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=<sua configuração do firebase>
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=<sua configuração do firebase>
EXPO_PUBLIC_FIREBASE_APP_ID=<sua configuração do firebase>
```

### 📦 Instalação

```bash
# Clone o repositório
git clone https://github.com/FIAP-MOBILE/challenge-echobeacon.git
cd challenge-echobeacon

# Instale as dependências
npm install
```

### ▶️ Execução

```bash
# Inicie o projeto
npx expo start
```

- Escaneie o QR Code exibido com o aplicativo **Expo Go**
- A aplicação será aberta no seu celular

---

## 🧠 Tecnologias Utilizadas

- **React Native** com **TypeScript**
- **Expo**
- **AsyncStorage**
- **React Navigation**
- **Ionicons (Expo Vector Icons)**
- **Firebase Auth**
- **Firestore**

---

## 💡 Objetivo Final

A proposta da solução é reduzir o tempo e esforço gastos pelos funcionários da Mottu para localizar motos no pátio. Com a integração entre o cadastro, o aplicativo e os dispositivos EchoBeacon, torna-se possível gerenciar e encontrar qualquer moto com mais agilidade, segurança e organização.

---
