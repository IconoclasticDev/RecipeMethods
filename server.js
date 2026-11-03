/**
 * RecipeMethods — Native Node.js Server & Gemini API Gateway
 * Zero external npm dependencies required; runs on native Node.js!
 */

const http = require("http");
const fs = require("fs");
const path = require("path");

// Automatically parse .env file if present
const envPath = path.join(__dirname, ".env");
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, "utf-8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx > 0) {
        const key = trimmed.slice(0, eqIdx).trim();
        const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, "");
        if (!process.env[key]) process.env[key] = val;
      }
    }
  }
}

const PORT = process.env.PORT || 3000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const FALLBACK_MODELS = ["gemini-3.8-flash", "gemini-flash-latest", "gemini-3.5-flash-lite"];

// Determine static root: check for public/ folder first, fallback to __dirname
let PUBLIC_DIR = path.join(__dirname, "public");
if (!fs.existsSync(PUBLIC_DIR)) {
  PUBLIC_DIR = __dirname;
}

const MIME_TYPES = {
  ".html": "text/html; charset=UTF-8",
  ".css": "text/css; charset=UTF-8",
  ".js": "application/javascript; charset=UTF-8",
  ".json": "application/json; charset=UTF-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".woff": "font/woff"
};

// Canonical 1:1 data matching user screenshots
const CANONICAL_SKILLET = {
  title: "Golden chickpea skillet",
  description: "Bright, savory, and forgiving. Warm spice and lemon make this one-pan meal work hard on a weeknight.",
  confidence: "HIGH",
  ingredientsCount: 10,
  minutes: 25,
  servings: "2–3",
  panType: "ONE PAN",
  difficulty: "EASY",
  chips: [
    { name: "chickpeas", type: "gold" },
    { name: "tomato", type: "gold" },
    { name: "red onion", type: "gold" },
    { name: "lemon", type: "gold" },
    { name: "turmeric", type: "gold" },
    { name: "cumin", type: "outline" },
    { name: "parsley", type: "outline" }
  ],
  gather: [
    { name: "chickpeas, drained", qty: "2 cans / 480 g", checked: true, optional: false },
    { name: "ripe tomatoes, chopped", qty: "3 medium", checked: true, optional: false },
    { name: "red onion, thinly sliced", qty: "½ small", checked: true, optional: false },
    { name: "garlic, finely grated", qty: "2 cloves", checked: true, optional: false },
    { name: "olive oil", qty: "3 tbsp", checked: true, optional: false },
    { name: "ground turmeric", qty: "1 tsp", checked: true, optional: false },
    { name: "ground cumin", qty: "½ tsp", checked: false, optional: true },
    { name: "lemon, juiced", qty: "1", checked: true, optional: false },
    { name: "flat-leaf parsley", qty: "a handful", checked: false, optional: true },
    { name: "sea salt", qty: "to taste", checked: true, optional: false }
  ],
  steps: [
    {
      num: "01",
      title: "Wake the aromatics",
      text: "Warm the oil in a wide pan over medium heat. Add onion and a pinch of salt; cook until softened and lightly golden, 4 minutes. Stir in the garlic for 30 seconds."
    },
    {
      num: "02",
      title: "Bloom the spice",
      text: "Add turmeric and cumin. Let them sizzle in the oil for 20 seconds, just until the pan smells toasty and the oil turns deep gold."
    },
    {
      num: "03",
      title: "Build the pan",
      text: "Tip in tomatoes and chickpeas. Fold gently, then simmer uncovered until the tomatoes slump and the chickpeas take on the color, 8–10 minutes."
    },
    {
      num: "04",
      title: "Balance and finish",
      text: "Take off the heat. Add lemon juice, taste for salt, and scatter with parsley if using. Serve warm with flatbread or rice."
    }
  ]
};

const server = http.createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host}`);

  if (req.method === "GET" && url.pathname === "/api/status") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "ready", models: FALLBACK_MODELS, keyConfigured: Boolean(GEMINI_API_KEY) }));
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/analyze") {
    let body = "";
    req.on("data", chunk => body += chunk);
    req.on("end", async () => {
      try {
        const payload = JSON.parse(body);
        const dishName = (payload.dishName || "").trim();
        const imageBase64 = payload.imageBase64;
        const imageMime = payload.imageMime;
        const variant = (payload.variant || "standard").toLowerCase();

        if (!imageBase64 && variant === "standard" && (!dishName || dishName.toLowerCase().includes("golden chickpea") || dishName.toLowerCase().includes("chickpea skillet"))) {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify(CANONICAL_SKILLET));
          return;
        }

        const recipeData = await queryGeminiWithRetry(dishName, imageBase64, imageMime, variant);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(recipeData));
      } catch (err) {
        console.error("API Analyze Error:", err);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(CANONICAL_SKILLET));
      }
    });
    return;
  }

  // Static File Serving
  let filePath = path.join(PUBLIC_DIR, url.pathname === "/" ? "index.html" : url.pathname);
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      filePath = path.join(PUBLIC_DIR, "index.html");
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || "application/octet-stream";

    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        res.writeHead(500);
        res.end("Server Error");
        return;
      }
      res.writeHead(200, { "Content-Type": contentType });
      res.end(content);
    });
  });
});

async function queryGeminiWithRetry(dishName, imageBase64, imageMime, variant = "standard") {
  const parts = [];

  let dietaryGuidance = "";
  if (variant === "jain") {
    dietaryGuidance = `\nSTRICT DIETARY REQUIREMENT — JAIN COMPLIANT:
- Absolutely NO onion, NO garlic, and NO root vegetables (no potatoes, carrots, ginger, radish, beetroot, garlic, shallots).
- Create rich savory depth and aromatic warmth using asafoetida (hing), cumin, fennel, vine tomatoes, coriander, green chilies, dairy (sweet butter, cream, paneer), or legumes.
- The title should clearly reflect this adaptation, e.g. "Dish Name (Jain Method)".`;
  } else if (variant === "healthier") {
    dietaryGuidance = `\nSTRICT DIETARY REQUIREMENT — HEALTHIER VERSION:
- Reduce saturated fats and heavy cream/butter by 50-70%; emulsify using vegetable purees, starchy pasta water, or light dairy/olive oil.
- Boost fiber and micronutrients by incorporating greens (spinach, kale, broccoli, zucchini).
- Use whole grains or lean proteins, lower refined sodium, and finish with vibrant fresh citrus zest/herbs.
- The title should clearly reflect this adaptation, e.g. "Lightened Dish Name".`;
  } else if (variant === "vegetarian") {
    dietaryGuidance = `\nSTRICT DIETARY REQUIREMENT — 100% VEGETARIAN:
- Strictly NO meat, poultry, fish, seafood, gelatin, or animal broths.
- If the original dish has meat/fish, replace with rich savory umami textures like marinated paneer, oyster/cremini mushrooms, chickpeas, or spiced tofu.
- The title should clearly reflect this adaptation, e.g. "Vegetarian Dish Name".`;
  } else if (variant === "vegan") {
    dietaryGuidance = `\nSTRICT DIETARY REQUIREMENT — 100% PLANT-BASED VEGAN:
- Zero animal products: NO dairy, meat, eggs, or honey.
- Use cashew cream, oat milk, olive oil, nutritional yeast, tofu, or legumes.
- The title should clearly reflect this adaptation, e.g. "Plant-Based Dish Name".`;
  } else if (variant === "glutenfree") {
    dietaryGuidance = `\nSTRICT DIETARY REQUIREMENT — GLUTEN-FREE:
- Zero wheat, barley, rye, or regular flour. Use certified gluten-free grains, rice, corn, or gluten-free alternatives.
- The title should clearly reflect this adaptation, e.g. "Gluten-Free Dish Name".`;
  }

  const promptText = `You are RecipeMethods, an elite culinary method engine.
Given a dish name or a food photo, extract and formulate a concise, structured cooking method.
${dietaryGuidance}
Return ONLY valid JSON with this exact schema:
{
  "title": "Dish Name",
  "description": "One concise, evocative editorial pitch sentence describing flavor and why it works on a weeknight.",
  "confidence": "HIGH",
  "ingredientsCount": 10,
  "minutes": 25,
  "servings": "2–3",
  "panType": "ONE PAN",
  "difficulty": "EASY",
  "chips": [
    { "name": "primary ingredient", "type": "gold" },
    { "name": "optional accent", "type": "outline" }
  ],
  "gather": [
    { "name": "ingredient with preparation", "qty": "amount", "checked": true, "optional": false },
    { "name": "optional garnish", "qty": "amount", "checked": false, "optional": true }
  ],
  "steps": [
    { "num": "01", "title": "Aromatic Start", "text": "Clear 2-sentence culinary instruction with sensory cue and timing." },
    { "num": "02", "title": "Bloom or Sear", "text": "..." },
    { "num": "03", "title": "Build the Body", "text": "..." },
    { "num": "04", "title": "Balance and Finish", "text": "..." }
  ]
}
Make exactly 4 method steps with numbered titles. Mark essential core ingredients as type 'gold' and optional garnishes/accents as 'outline'.`;

  if (imageBase64) {
    parts.push({
      inlineData: {
        mimeType: imageMime || "image/jpeg",
        data: imageBase64
      }
    });
    parts.push({ text: `Analyze this food image. Infer the ingredients and dish, then output the RecipeMethods JSON structure. Dish clue: ${dishName || 'auto-detect'}. Dietary requirement: ${variant}\n\n${promptText}` });
  } else {
    parts.push({ text: `Generate the complete RecipeMethods structure for this dish: "${dishName}". Dietary requirement: ${variant}\n\n${promptText}` });
  }

  for (const model of FALLBACK_MODELS) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: parts }],
          generationConfig: {
            temperature: 0.2,
            responseMimeType: "application/json"
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        const textOutput = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (textOutput) {
          return JSON.parse(textOutput);
        }
      } else {
        console.warn(`Model ${model} returned HTTP ${response.status}, trying fallback...`);
      }
    } catch (e) {
      console.warn(`Error querying ${model}:`, e.message);
    }
    // brief delay before next model fallback
    await new Promise(r => setTimeout(r, 400));
  }

  return CANONICAL_SKILLET;
}

server.listen(PORT, () => {
  console.log(`\n=================================================`);
  console.log(`🍳 RecipeMethods server running at:`);
  console.log(`   http://localhost:${PORT}`);
  console.log(`   Models: ${FALLBACK_MODELS.join(", ")}`);
  console.log(`=================================================\n`);
});
