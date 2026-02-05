export default async function handler(req, res) {
  // Solo aceptar POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { fullName, phone, email, smsConsent } = req.body;

    // Validación básica
    if (!fullName || !phone || !email) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Preparar payload para GHL webhook
    const payload = {
      full_name: fullName,
      phone: phone,
      email: email,
      sms_consent: smsConsent === 'on' || smsConsent === true,
      page_url: req.headers.referer || 'https://www.untd.site/contact.html',
      timestamp_utc: new Date().toISOString()
    };

    // Enviar al webhook de GHL
    const WEBHOOK_URL = "https://services.leadconnectorhq.com/hooks/rZKQk3pCDhbwEBZbBr9m/webhook-trigger/d8c6aced-1eca-4974-ad36-b7a0e52bde63";
    
    await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    // Redirigir a thanks.html
    return res.redirect(307, '/thanks.html');

  } catch (error) {
    console.error('Error processing form:', error);
    // Si falla, igual redirigir a thanks.html
    return res.redirect(307, '/thanks.html');
  }
}
