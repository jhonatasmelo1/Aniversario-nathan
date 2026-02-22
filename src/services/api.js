const GAS_API_URL = import.meta.env.VITE_GAS_API_URL;
const SECRET = "NATHAN2026";

/**
 * Faz requisição POST JSON para Google Apps Script
 * @param {string} action - Nome da ação (save_rsvp, save_donation, get_gifts)
 * @param {object} data - Dados a enviar
 * @returns {Promise<object>} Resposta da API
 */
async function callGAS(action, data = {}) {
  if (!GAS_API_URL) {
    console.warn('VITE_GAS_API_URL não configurada. Usando fallback local.');
    return { ok: false, error: 'API não configurada' };
  }

  try {
    const payload = {
      secret: SECRET,
      action,
      ...data
    };

    const response = await fetch(GAS_API_URL, {
      method: 'POST',
      headers: {
        // Use a simple content type to avoid preflight failures on Apps Script.
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (result.ok === false) {
      throw new Error(result.error || result.message || 'Erro ao processar requisição');
    }

    return result;
  } catch (error) {
    console.error('Erro ao chamar Google Apps Script:', error);
    throw error;
  }
}

/**
 * Salva RSVP (confirmação de presença) na planilha
 * @param {object} rsvpData - Dados da presença
 * @returns {Promise<object>} Resposta da API
 */
export async function saveRSVP(rsvpData) {
  const {
    codigo = '',
    familia = '',
    status = 'pendente',
    membros_confirmados = [],
    preferencias = {}
  } = rsvpData;

  // Conta adultos e crianças (requer informação adicional da estrutura de famílias)
  // Por padrão, considera todos como adultos
  const qtdAdultos = membros_confirmados.length || 0;
  const qtdCriancas = 0;

  try {
    const result = await callGAS('save_rsvp', {
      familyCode: codigo,
      familyName: familia,
      status,
      membrosConfirmados: membros_confirmados,
      qtdAdultos,
      qtdCriancas,
      foods: preferencias.foods || [],
      drinks: preferencias.drinks || [],
      restricaoAlimentar: preferencias.restricao || '',
      observacoes: preferencias.observacoes || ''
    });

    console.log('RSVP salvo com sucesso na planilha:', result);
    return result;
  } catch (error) {
    console.warn('Erro ao salvar RSVP na planilha:', error);
    // Continua mesmo se falhar, já que salvou localmente
    return { ok: false, error: error.message };
  }
}

/**
 * Salva doação na planilha
 * @param {object} donationData - Dados da doação
 * @returns {Promise<object>} Resposta da API com newCurrent (valor atualizado)
 */
export async function saveDonation(donationData) {
  const {
    codigo = '',
    familia = '',
    giftId = 1,
    giftName = '',
    amount = 0,
    metodo = 'PIX',
    comprovanteUrl = '',
    observacoes = ''
  } = donationData;

  try {
    const result = await callGAS('save_donation', {
      familyCode: codigo,
      familyName: familia,
      giftId,
      giftName,
      donationAmount: Number(amount),
      metodo,
      comprovanteUrl,
      observacoes
    });

    console.log('Doação registrada com sucesso:', result);
    return result;
  } catch (error) {
    console.warn('Erro ao salvar doação na planilha:', error);
    return { ok: false, error: error.message };
  }
}

/**
 * Obtém lista de brinquedos/presentes da planilha
 * @returns {Promise<Array>} Lista de gifts com dados atualizados
 */
export async function getGifts() {
  try {
    const result = await callGAS('get_gifts');

    if (result.ok === true && result.gifts && Array.isArray(result.gifts)) {
      return result.gifts.map(gift => ({
        id: gift.giftId,
        name: gift.giftName,
        target: parseFloat(gift.target) || 0,
        current: parseFloat(gift.current) || 0,
        image: gift.imagePath || '',
        color: gift.color || 'bg-blue-400',
        updatedAt: gift.updatedAt || new Date().toISOString()
      }));
    }

    console.warn('Resposta inválida ao buscar gifts:', result);
    return [];
  } catch (error) {
    console.warn('Erro ao buscar gifts da planilha:', error);
    // Retorna array vazio em caso de erro para não quebrar a aplicação
    return [];
  }
}

/**
 * Sincroniza todos os dados da aplicação com a planilha
 * @returns {Promise<object>} Dados sincronizados
 */
export async function syncAllData() {
  try {
    const gifts = await getGifts();

    return {
      gifts,
      lastSync: new Date().toISOString()
    };
  } catch (error) {
    console.error('Erro ao sincronizar dados:', error);
    throw error;
  }
}
