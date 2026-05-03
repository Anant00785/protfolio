export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(200).json({
    status: 'online',
    assistant: 'J.A.R.V.I.S.',
    version: '2.0',
    powered_by: 'Groq AI',
  });
}
