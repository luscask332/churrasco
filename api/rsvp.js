import { kv } from '@vercel/kv';

const CHAVE = 'rsvps';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { nome, confirmado, acompanhantes, mensagem } = req.body || {};

      if (!nome || typeof nome !== 'string' || typeof confirmado !== 'boolean') {
        return res.status(400).json({ error: 'Dados inválidos' });
      }

      const registro = {
        id: 'rsvp_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8),
        nome: nome.trim().slice(0, 100),
        confirmado,
        acompanhantes: confirmado ? Math.max(0, parseInt(acompanhantes) || 0) : 0,
        mensagem: String(mensagem || '').trim().slice(0, 300),
        timestamp: new Date().toISOString()
      };

      const atual = (await kv.get(CHAVE)) || [];
      atual.push(registro);
      await kv.set(CHAVE, atual);

      return res.status(200).json({ ok: true });
    } catch (e) {
      console.error('Erro ao salvar RSVP', e);
      return res.status(500).json({ error: 'Erro ao salvar' });
    }
  }

  if (req.method === 'GET') {
    const pin = req.query.pin;
    if (!process.env.ADMIN_PIN || pin !== process.env.ADMIN_PIN) {
      return res.status(401).json({ error: 'PIN incorreto' });
    }
    try {
      const dados = (await kv.get(CHAVE)) || [];
      return res.status(200).json({ dados });
    } catch (e) {
      console.error('Erro ao carregar RSVPs', e);
      return res.status(500).json({ error: 'Erro ao carregar' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).json({ error: 'Método não permitido' });
}
