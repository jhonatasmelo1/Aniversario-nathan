# Integração com Google Apps Script

## 🔗 Configuração

A aplicação está configurada para se conectar com Google Apps Script na URL:
```
https://script.google.com/macros/s/AKfycbw4W7cShj9lSTRpXuBvUgRB2mPdtUDIoxZN02FpSvdSb7iTYQY2wgBuMq2bjyBqCEooYg/exec
```

## 📝 Arquivo .env

O arquivo `.env` contém a configuração:
```
VITE_GAS_API_URL=https://script.google.com/macros/s/AKfycbw4W7cShj9lSTRpXuBvUgRB2mPdtUDIoxZN02FpSvdSb7iTYQY2wgBuMq2bjyBqCEooYg/exec
```

## 🛠️ Protocolo de Comunicação

A aplicação envia requisições **POST JSON** para o Google Apps Script com:

- **Header:** `Content-Type: application/json`
- **Secret:** `NATHAN2026` (obrigatório em todos os requests)
- **Action:** Nome da ação a executar
- **Resposta:** JSON com `{ ok: true/false, ... }`

### Fluxo de Requisição

```
Cliente (React/Vite)
    ↓
    POST JSON ao Google Apps Script
    {
      secret: "NATHAN2026",
      action: "save_rsvp" | "save_donation" | "get_gifts",
      ...dados
    }
    ↓
Google Apps Script (doPost)
    ↓
Valida secret
    ↓
Executa ação
    ↓
Escreve em Google Sheets
    ↓
Retorna JSON
    { ok: true, newCurrent: X } ou { ok: false, error: "..." }
```

## 📡 Funções de API Disponíveis

### 1. `saveRSVP(rsvpData)`
Salva a confirmação de presença de uma família.

**Request JSON:**
```javascript
{
  secret: "NATHAN2026",
  action: "save_rsvp",
  familyCode: "SOL001",
  familyName: "Família 1",
  status: "sim" | "nao",
  membrosConfirmados: ["Dani", "Jhonatas"],
  qtdAdultos: 2,
  qtdCriancas: 0,
  foods: ["Pizza", "Cachorro quente"],
  drinks: ["Coca Cola"],
  restricaoAlimentar: "Sem amendoim",
  observacoes: ""
}
```

**Response:**
```javascript
{ ok: true }
ou
{ ok: false, error: "Mensagem de erro" }
```

### 2. `saveDonation(donationData)`
Salva uma doação/contribuição e atualiza o total arrecadado.

**Request JSON:**
```javascript
{
  secret: "NATHAN2026",
  action: "save_donation",
  familyCode: "SOL001",
  familyName: "Família 1",
  giftId: 1,
  giftName: "Carro Elétrico Infantil",
  donationAmount: 50.00,
  metodo: "PIX",
  comprovanteUrl: "https://...",
  observacoes: "Doação parcial"
}
```

**Response:**
```javascript
{
  ok: true,
  newCurrent: 900  // ← Novo valor total arrecadado para o presente
}
ou
{ ok: false, error: "giftId not found in Presentes" }
```

### 3. `getGifts()`
Obtém a lista atualizada de presentes com valores arrecadados.

**Request JSON:**
```javascript
{
  secret: "NATHAN2026",
  action: "get_gifts"
}
```

**Response:**
```javascript
{
  ok: true,
  gifts: [
    {
      giftId: 1,
      giftName: "Carro Elétrico Infantil",
      target: 1200,
      current: 850,
      imagePath: "/Nathan_no_carro.png",
      color: "bg-blue-400",
      updatedAt: "2026-02-22T10:30:00.000Z"
    },
    // ... mais presentes
  ]
}
```

## 🔄 Sincronização Automática

A aplicação sincroniza automaticamente a cada 30 segundos:

1. Busca a lista de presentes (`getGifts()`)
2. Atualiza as barras de progresso com os valores da planilha
3. Mantém dados offline sincronizados com o servidor

## 📊 Estrutura de Abas no Google Sheets

### Aba "Respostas" (RSVP)
| Data | Código | Família | Status | Membros | Adultos | Crianças | Comidas | Bebidas | Restrições | Observações |
|------|--------|---------|--------|---------|---------|----------|---------|---------|-----------|-------------|

### Aba "Doacoes"
| Data | Código | Família | Gift ID | Gift Nome | Valor | Método | Comprovante | Observações |
|------|--------|---------|---------|-----------|-------|--------|-------------|-------------|

### Aba "Presentes"
| ID | Nome | Meta | Arrecadado | Imagem | Cor | Data Atualização |
|----|------|------|-----------|--------|-----|------------------|
| 1 | Carro Elétrico | 1200 | 850 | /Nathan_no_carro.png | bg-blue-400 | 2026-02-22 |

## 🚀 Google Apps Script - Código Comentado

```javascript
const SECRET = "NATHAN2026";

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// Responde a GET simples (teste da API)
function doGet(e) {
  return jsonResponse({ ok: true, message: "Nathan API online" });
}

// Processa POST JSON
function doPost(e) {
  try {
    // Parseia o corpo JSON da requisição
    const data = JSON.parse(e.postData.contents || "{}");

    // Valida segurança
    if (data.secret !== SECRET) {
      return jsonResponse({ ok: false, error: "Unauthorized" });
    }

    const action = data.action;
    if (!action) return jsonResponse({ ok: false, error: "Missing action" });

    // Acessa a planilha ativa
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    // ===== SAVE RSVP =====
    if (action === "save_rsvp") {
      const sheet = ss.getSheetByName("Respostas");
      sheet.appendRow([
        new Date(),
        data.familyCode || "",
        data.familyName || "",
        data.status || "",
        (data.membrosConfirmados || []).join(", "),
        data.qtdAdultos ?? "",
        data.qtdCriancas ?? "",
        (data.foods || []).join(", "),
        (data.drinks || []).join(", "),
        data.restricaoAlimentar || "",
        data.observacoes || ""
      ]);
      return jsonResponse({ ok: true });
    }

    // ===== SAVE DONATION =====
    if (action === "save_donation") {
      const doacoes = ss.getSheetByName("Doacoes");
      doacoes.appendRow([
        new Date(),
        data.familyCode || "",
        data.familyName || "",
        data.giftId || "",
        data.giftName || "",
        Number(data.donationAmount || 0),
        data.metodo || "PIX",
        data.comprovanteUrl || "",
        data.observacoes || ""
      ]);

      // Atualiza a aba Presentes com o novo total
      const presentes = ss.getSheetByName("Presentes");
      const values = presentes.getDataRange().getValues();
      const giftId = String(data.giftId || "");

      for (let i = 1; i < values.length; i++) {
        const rowGiftId = String(values[i][0]);
        if (rowGiftId === giftId) {
          const current = Number(values[i][3] || 0);
          const add = Number(data.donationAmount || 0);
          const newCurrent = current + add;

          presentes.getRange(i + 1, 4).setValue(newCurrent);
          presentes.getRange(i + 1, 7).setValue(new Date());
          
          return jsonResponse({ ok: true, newCurrent });
        }
      }

      return jsonResponse({ 
        ok: false, 
        error: `giftId ${giftId} not found in Presentes` 
      });
    }

    // ===== GET GIFTS =====
    if (action === "get_gifts") {
      const presentes = ss.getSheetByName("Presentes");
      const values = presentes.getDataRange().getValues();
      const rows = values.slice(1).filter(r => r[0]);

      const gifts = rows.map(r => ({
        giftId: r[0],
        giftName: r[1],
        target: Number(r[2] || 0),
        current: Number(r[3] || 0),
        imagePath: r[4] || "",
        color: r[5] || "",
        updatedAt: r[6] || ""
      }));

      return jsonResponse({ ok: true, gifts });
    }

    return jsonResponse({ ok: false, error: "Unknown action" });

  } catch (err) {
    return jsonResponse({ ok: false, error: String(err) });
  }
}
```

## ⚠️ Notas Importantes

- **HTTPS Obrigatório:** Google Apps Script sempre usa HTTPS
- **CORS:** Apps Script não restringe CORS por padrão, mas sempre verifique
- **Rate Limiting:** Google Apps Script tem limites (6 requisições/minuto/usuário)
- **Fallback Offline:** A app funciona offline com localStorage e sincroniza quando possível
- **Segurança:** O secret "NATHAN2026" é apenas um exemplo. Use valores mais seguros em produção
- **Validação:** Sempre valide dados no servidor (Google Apps Script) além do cliente
- **Deduplicação:** Implemente verificação de duplicatas se necessário

## 🔧 Troubleshooting

### "Unauthorized" ou erro de secret
- Verifique se o `SECRET` no Google Apps Script bate com `NATHAN2026`
- Verifique se o JSON está sendo enviado corretamente

### As mudanças não aparecem na planilha
- Verifique os nomes das abas: "Respostas", "Doacoes", "Presentes"
- Verifique os índices das colunas (devem começar em 0)
- Abra o Logger do Apps Script (Ctrl+Enter) para ver logs de erro

### Erro "Cannot read property of undefined"
- Verifique se a estrutura JSON está correta
- Confirme que todas as abas existem na planilha

## 📱 Teste Rápido (cURL)

```bash
curl -X POST \
  "https://script.google.com/macros/s/[SUA_CHAVE]/exec" \
  -H "Content-Type: application/json" \
  -d '{
    "secret": "NATHAN2026",
    "action": "get_gifts"
  }'
```

---

**Desenvolvido com ❤️ para a festa do Nathan**
