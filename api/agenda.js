const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyILLjW-gTPjUSMG-MaSSXK3hZT9voml0FqLeCZb4NBJ2xk6EV80XMu2eKdHNWbF5JuFQ/exec';

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const params = new URLSearchParams();

      for (const [key, value] of Object.entries(req.query || {})) {
        if (Array.isArray(value)) {
          value.forEach(v => params.append(key, String(v)));
        } else if (value !== undefined && value !== null) {
          params.set(key, String(value));
        }
      }

      const response = await fetch(`${APPS_SCRIPT_URL}?${params.toString()}`, {
        method: 'GET',
        redirect: 'follow',
        headers: {
          'Accept': 'application/json'
        }
      });

      const text = await response.text();

      res
        .status(response.status)
        .setHeader('Content-Type', 'application/json; charset=utf-8');

      return res.send(text);
    }

    if (req.method === 'POST') {
      const response = await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        redirect: 'follow',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(req.body || {})
      });

      const text = await response.text();

      res
        .status(response.status)
        .setHeader('Content-Type', 'application/json; charset=utf-8');

      return res.send(text);
    }

    res.setHeader('Allow', 'GET, POST');

    return res.status(405).json({
      status: 'erro',
      mensagem: 'Método não permitido.'
    });

  } catch (error) {

    return res.status(502).json({
      status: 'erro',
      mensagem: 'Não foi possível conectar com a agenda.',
      detalhe: String(error.message || error)
    });
  }
}
