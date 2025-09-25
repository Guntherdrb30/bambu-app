// bambu-backend/api/leads.js
import { sql } from '@vercel/postgres';
import { Resend } from 'resend';

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method Not Allowed' });
  }

  const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

  try {
    const { name, phone, email, city, notes, source, qty_122x300, qty_60x300, qty_40x300 } = request.body;

    if (!phone && !email) {
      return response.status(400).json({ error: 'Email or phone is required' });
    }

    const ip_address = request.headers['x-forwarded-for'] || request.socket.remoteAddress;
    const user_agent = request.headers['user-agent'];

    const result = await sql`
      INSERT INTO leads_bambu (name, phone, email, city, notes, source, ip_address, user_agent, qty_122x300, qty_60x300, qty_40x300)
      VALUES (${name}, ${phone}, ${email}, ${city}, ${notes}, ${source}, ${ip_address}, ${user_agent}, ${qty_122x300 || 0}, ${qty_60x300 || 0}, ${qty_40x300 || 0})
      RETURNING id;
    `;

    const leadId = result.rows[0].id;

    // Notificación opcional por email
    if (resend && process.env.NOTIFY_TO) {
      await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: process.env.NOTIFY_TO,
        subject: `Nuevo Lead de Bambu-App: ${name || email || phone}`,
        html: `&lt;p&gt;Se ha registrado un nuevo lead desde &lt;strong&gt;${source}&lt;/strong&gt;.&lt;/p&gt;&lt;pre&gt;${JSON.stringify(request.body, null, 2)}&lt;/pre&gt;`,
      });
    }

    return response.status(201).json({ message: 'Lead created successfully', leadId });
  } catch (error) {
    console.error(error);
    return response.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}