# 🎂 Aniversário de Nathan - Controle de Presenças

Uma aplicação web interativa para gerenciar convites, confirmações de presença e doações para a festa de aniversário de Nathan. Construída com React e Vite, com integração em tempo real com Google Sheets via Google Apps Script.

## 🚀 Como Começar

### Pré-requisitos

- **Node.js** (versão 14 ou superior)
- **npm** ou **yarn**
- **Google Apps Script** (para sincronização com planilha)

Se você ainda não tem Node.js instalado, baixe em: https://nodejs.org/

### 1. Configurar Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto com a URL do seu Google Apps Script:

```bash
VITE_GAS_API_URL=https://script.google.com/macros/s/SEU_ID_DE_DEPLOYMENT/exec
```

Você pode usar o arquivo `.env.example` como referência.

### 2. Instalar Dependências

Abra o terminal na pasta do projeto e execute:

```bash
npm install
```

Ou se estiver usando yarn:

```bash
yarn install
```

### 3. Iniciar o Servidor de Desenvolvimento

```bash
npm run dev
```

Ou com yarn:

```bash
yarn dev
```

O aplicativo será aberto automaticamente em `http://localhost:5173`

### 4. Compilar para Produção

```bash
npm run build
```

Os arquivos compilados estarão na pasta `dist/`

## 🌐 Integração com Google Apps Script

A aplicação se conecta automaticamente com uma planilha Google para:

- **Armazenar confirmações de presença** - Cada resposta é salva em uma aba "Presenças"
- **Registrar doações** - Todas as contribuições são registradas em "Doações"
- **Sincronizar valores** - A barra de progresso dos brinquedos é atualizada em tempo real a cada 30 segundos
- **Gerar estatísticas** - Dados consolidados de presenças e arrecadações

### Configurar o Google Apps Script

Veja o arquivo [INTEGRACAO_GAS.md](./INTEGRACAO_GAS.md) para instruções completas sobre:
- Como criar o servidor Google Apps Script
- Como vincular à sua planilha Google Sheets
- Como obter a URL de deployment correta

## 📋 Recursos

✨ **Gerenciar Convites** - Adicione famílias e convides com códigos únicos
📱 **Confirmação OnLine** - Capture confirmações de presença em tempo real
💝 **Lista de Presentes** - Apresente uma lista de sonhos/brinquedos com barras de progresso
💰 **Sistema de Doações** - Contribuições via PIX com sincronização automática
📊 **Painel de Administração** - Visualize e gerencie todas as informações
🔄 **Sincronização em Tempo Real** - Dados atualizados a cada 30 segundos da planilha
📱 **Responsivo** - Funciona perfeitamente em computadores, tablets e celulares
💾 **Offline First** - Funciona offline e sincroniza quando possível

## 🎨 Tecnologias Utilizadas

- **React 18** - Biblioteca JavaScript para interfaces de usuário
- **Vite 5** - Construtor ultra-rápido para aplicações web
- **Tailwind CSS** - Framework CSS utilitário para estilos responsivos
- **Lucide Icons** - Ícones bonitos e leves
- **LocalStorage** - Armazenamento persistente local
- **Google Apps Script** - Servidor de integração com Google Sheets

## 📂 Estrutura do Projeto

```
├── index.html              # Arquivo HTML principal
├── package.json            # Dependências do projeto
├── vite.config.js          # Configuração do Vite
├── tailwind.config.js      # Configuração do Tailwind CSS
├── .env.example            # Exemplo de variáveis de ambiente
├── INTEGRACAO_GAS.md       # Documentação da integração Google Apps Script
└── src/
    ├── main.jsx            # Ponto de entrada React
    ├── App.jsx             # Componente principal
    ├── App.css             # Estilos do aplicativo
    ├── index.css           # Estilos globais com Tailwind
    └── services/
        └── api.js          # Serviço centralizado de API
```

## 🔧 Desenvolvimento

O projeto usa Vite para desenvolvimento rápido com Hot Module Replacement (HMR), permitindo que você veja as mudanças em tempo real conforme edita os arquivos.

### Scripts Disponíveis

```bash
npm run dev       # Inicia o servidor de desenvolvimento
npm run build     # Compila para produção
npm run preview   # Visualiza a build de produção em desenvolvimento
```

## 🔐 Segurança

- As variáveis de ambiente `.env.local` não são commitadas (veja `.gitignore`)
- Senhas administrativas são protegidas
- Dados sensíveis são validados no servidor (Google Apps Script)

## 📸 Fotos do Nathan

As fotos estão armazenadas na pasta `Public/` e integradas permanentemente:
- `Nathan_Playground.png`
- `Nathan_no_carro.png`
- `Nathan_Carrinho_de_controle_remoto.png`
- `Nathan_brincando_monsetori.png`
- `nathan_imagem_de_fundo.png`
- `Nathan_feliz_após_o_pix.jpeg`

## 🐛 Troubleshooting

### As imagens não estão carregando?
- Verifique se os nomes dos arquivos em `Public/` correspondem aos caminhos no código
- Faça um hard refresh do navegador: `Ctrl+Shift+R` (Windows) ou `Cmd+Shift+R` (Mac)

### A sincronização com Google Sheets não funciona?
- Verifique se o `VITE_GAS_API_URL` está correto em `.env.local`
- Verifique o console do navegador (F12) para mensagens de erro
- O formulário continua funcionando offline mesmo se a sincronização falhar

### Dados desapareceram?
- Os dados são salvos localmente no `localStorage` do navegador
- Se limpou o cache/localStorage, os dados locais serão perdidos (mas a planilha mantém um backup se foi sincronizado)

## 📨 Suporte

Para dúvidas ou problemas, verifique os logs do console (F12) para mensagens de erro detalhadas.

## 📝 Licença

Este projeto é de uso livre para festas e eventos pessoais.

---

**Bom divertimento na festa de Nathan! 🎉🎂☀️**
