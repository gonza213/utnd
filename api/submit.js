export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { fullName, phone, email, smsConsent } = req.body;

    // Validación básica
    if (!fullName || !phone || !email) {
      return res.status(400).send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Error | UNTD Financial Group</title>
          <meta http-equiv="refresh" content="3;url=https://utnd.vercel.app/contact.html">
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
      page_url: req.headers.referer || 'https://utnd.vercel.app/contact.html',
      timestamp_utc: new Date().toISOString()
    };

    const WEBHOOK_URL = "https://services.leadconnectorhq.com/hooks/rZKQk3pCDhbwEBZbBr9m/webhook-trigger/d8c6aced-1eca-4974-ad36-b7a0e52bde63";
    
    // ✅ Intentar enviar al webhook
    try {
      await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (webhookError) {
      console.error('Webhook failed (continuing anyway):', webhookError);
    }

    // ✅ SIEMPRE redirigir a thanks.html
    return res.redirect(307, 'https://utnd.vercel.app/thanks.html');

  } catch (error) {
    console.error('Unexpected error:', error);
    return res.redirect(307, 'https://utnd.vercel.app/thanks.html');
  }
}
