// bambu-backend/api/admin/[action].js
import { sql } from '@vercel/postgres';

function verifyAuth(request) {
  const token = (request.headers.authorization || '').split('Bearer ')[1];
  return token && token === process.env.ADMIN_TOKEN;
}

function leadsToCsv(leads) {
  if (leads.length === 0) return '';
  const headers = Object.keys(leads[0]).join(',');
  const rows = leads.map(row =>
    Object.values(row)
      .map(value => {
        const str = String(value === null || value === undefined ? '' : value);
        // Escape commas and quotes
        if (str.includes(',') || str.includes('"') || str.includes('\n')) {
          return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
      })
      .join(',')
  );
  return [headers, ...rows].join('\n');
}

export default async function handler(request, response) {
  if (!verifyAuth(request)) {
    return response.status(401).json({ error: 'Unauthorized' });
  }

  const { action } = request.query;

  try {
    const { rows: leads } = await sql`SELECT * FROM leads_bambu ORDER BY created_at DESC;`;

    if (action === 'leads') {
      return response.status(200).json(leads);
    }

    if (action === 'csv') {
      const csvData = leadsToCsv(leads);
      const date = new Date().toISOString().split('T')[0];
      response.setHeader('Content-Type', 'text/csv');
      response.setHeader('Content-Disposition', `attachment; filename="leads_bambu_${date}.csv"`);
      return response.status(200).send(csvData);
    }

    return response.status(404).json({ error: 'Action not found' });
  } catch (error) {
    console.error(error);
    return response.status(500).json({ error: 'Internal Server Error' });
  }
}
