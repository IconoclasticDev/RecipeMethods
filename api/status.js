/**
 * Vercel Serverless Function: /api/status
 */

module.exports = (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  return res.status(200).json({
    status: "ready",
    platform: "vercel-serverless",
    keyConfigured: Boolean(process.env.GEMINI_API_KEY)
  });
};
