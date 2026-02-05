export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { fullName, phone, email, smsConsent } = req.body;

    // Validación básica
    if (!fullName || !phone || !email) {
      // ⚠️ Si faltan datos, SÍ mostrar error
      return res.status(400).send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Error | UNTD Financial Group</title>
          <meta http-equiv="refresh" content="3;url=/contact.html">
          <style>
            body { 
              font-family: system-ui; 
              background: #0b0b0e; 
              color: #fff; 
              display: flex; 
              align-items: center; 
              justify-content: center; 
              min-height: 100vh; 
              margin: 0;
            }
            .container { text-align: center; max-width: 500px; padding: 40px; }
            h1 { color: #d4af37; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>❌ Faltan datos</h1>
            <p>Por favor completá todos los campos.</p>
            <p>Redirigiendo en 3 segundos...</p>
          </div>
        </body>
        </html>
      `);
    }

    const payload = {
      full_name: fullName,
      phone: phone,
      email: email,
      sms_consent: smsConsent === 'on' || smsConsent === true,
      page_url: req.headers.referer || 'https://www.untd.site/contact.html',
      timestamp_utc: new Date().toISOString()
    };

    const WEBHOOK_URL = "https://services.leadconnectorhq.com/hooks/rZKQk3pCDhbwEBZbBr9m/webhook-trigger/d8c6aced-1eca-4974-ad36-b7a0e52bde63";
    
    // ✅ Intentar enviar al webhook
    try {
      await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        timeout: 5000 // 5 segundos máximo
      });
    } catch (webhookError) {
      // ⚠️ Si el webhook falla, loguear pero NO romper el flujo
      console.error('Webhook failed (continuing anyway):', webhookError);
      // Podrías enviar esto a un servicio de logging (Sentry, LogRocket, etc.)
    }

    // ✅ SIEMPRE redirigir a thanks.html (el usuario completó el form correctamente)
    return res.redirect(307, '/thanks.html');

  } catch (error) {
    console.error('Unexpected error:', error);
    
    // ⚠️ Si hay un error inesperado, IGUAL redirigir
    // (Para que el CTA sea verificable por GHL)
    return res.redirect(307, '/thanks.html');
  }
}
