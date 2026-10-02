/**
 * RecipeMethods — Kitchen Companion
 * Client Application Logic & Gemini AI Integration
 */

// Gemini API Key (reads from localStorage or proxies via local /api/analyze server)
const GEMINI_API_KEY = localStorage.getItem("GEMINI_API_KEY") || "";

// Canonical Master Recipe Data matching the exact screenshots 1:1
const CANONICAL_RECIPES = {
  "golden chickpea skillet": {
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
  },

  "rustic tomato shakshuka": {
    title: "Rustic tomato shakshuka",
    description: "Deep, saucy, and gently spiced. Ripe tomatoes and eggs come together in a warm cast-iron skillet for unhurried comfort.",
    confidence: "HIGH",
    ingredientsCount: 8,
    minutes: 30,
    servings: "2–4",
    panType: "SKILLET",
    difficulty: "EASY",
    chips: [
      { name: "eggs", type: "gold" },
      { name: "crushed tomato", type: "gold" },
      { name: "bell pepper", type: "gold" },
      { name: "onion", type: "gold" },
      { name: "smoked paprika", type: "gold" },
      { name: "feta", type: "outline" },
      { name: "cilantro", type: "outline" }
    ],
    gather: [
      { name: "large eggs", qty: "4–5", checked: true, optional: false },
      { name: "whole peeled tomatoes", qty: "1 can (800g)", checked: true, optional: false },
      { name: "yellow onion, diced", qty: "1 medium", checked: true, optional: false },
      { name: "red bell pepper, sliced", qty: "1 medium", checked: true, optional: false },
      { name: "garlic, sliced thin", qty: "3 cloves", checked: true, optional: false },
      { name: "smoked Spanish paprika", qty: "1½ tsp", checked: true, optional: false },
      { name: "crumbled feta cheese", qty: "60 g", checked: false, optional: true },
      { name: "fresh cilantro leaves", qty: "small handful", checked: false, optional: true }
    ],
    steps: [
      {
        num: "01",
        title: "Soften the base",
        text: "Heat olive oil in a deep skillet over medium heat. Sweat onions and bell pepper until tender and translucent, about 6 minutes."
      },
      {
        num: "02",
        title: "Toast paprika & garlic",
        text: "Add sliced garlic and smoked paprika. Stir vigorously for 40 seconds to release the fragrant essential oils without scorching."
      },
      {
        num: "03",
        title: "Simmer the sauce",
        text: "Pour in tomatoes and crush gently with a wooden spoon. Simmer on low heat until sauce thickens into a rich jammy stew, 10–12 minutes."
      },
      {
        num: "04",
        title: "Poach the eggs",
        text: "Make small wells with the spoon and crack in the eggs. Cover with a lid and cook gently until whites set but yolks remain runny, 5–6 minutes. Scatter feta and herbs."
      }
    ]
  },

  "creamy garlic pasta": {
    title: "Creamy garlic butter pasta",
    description: "Silky, velvety, and deeply aromatic. Emulsified starchy pasta water and gentle garlic butter coat every strand without heavy cream.",
    confidence: "HIGH",
    ingredientsCount: 6,
    minutes: 18,
    servings: "2",
    panType: "ONE POT",
    difficulty: "EASY",
    chips: [
      { name: "pasta", type: "gold" },
      { name: "fresh garlic", type: "gold" },
      { name: "butter", type: "gold" },
      { name: "parmesan", type: "gold" },
      { name: "black pepper", type: "gold" },
      { name: "chives", type: "outline" }
    ],
    gather: [
      { name: "spaghetti or fettuccine", qty: "250 g", checked: true, optional: false },
      { name: "fresh garlic, thinly sliced", qty: "6 cloves", checked: true, optional: false },
      { name: "unsalted butter", qty: "3 tbsp / 45g", checked: true, optional: false },
      { name: "Parmigiano-Reggiano, grated", qty: "½ cup / 50g", checked: true, optional: false },
      { name: "fresh cracked black pepper", qty: "1 tsp", checked: true, optional: false },
      { name: "snipped fresh chives", qty: "2 tbsp", checked: false, optional: true }
    ],
    steps: [
      {
        num: "01",
        title: "Boil the pasta",
        text: "Drop pasta into well-salted boiling water. Cook until 2 minutes shy of al dente; reserve 1 cup of cloudy starchy pasta water before draining."
      },
      {
        num: "02",
        title: "Gently infuse garlic",
        text: "Melt butter with a drizzle of olive oil in a wide pan over low heat. Add sliced garlic and cook gently until fragrant and pale straw in color, 2–3 minutes."
      },
      {
        num: "03",
        title: "Emulsify the glossy sauce",
        text: "Splash ½ cup pasta water into the garlic butter, swirling vigorously until a glossy, creamy emulsion forms in the pan."
      },
      {
        num: "04",
        title: "Mantecatura & finish",
        text: "Toss pasta directly in the pan with cheese and black pepper, swirling rapidly off heat until cheese melts completely into a silky sheen."
      }
    ]
  }
};

// Application State: Starts in 'initial' state (Waiting on your clue)
let currentState = "initial"; 
let activeRecipe = CANONICAL_RECIPES["golden chickpea skillet"];
let uploadedImageBase64 = null;
let uploadedImageMime = null;
let mediaStream = null;

// DOM Elements
const bodyEl = document.body;
const dishInput = document.getElementById("dish-input");
const clearDishBtn = document.getElementById("clear-dish-btn");
const submitBtn = document.getElementById("submit-btn");
const btnText = document.getElementById("btn-text");
const startOverBtn = document.getElementById("start-over-btn");
const presetPills = document.querySelectorAll(".preset-pill");

// Section 02 Elements
const readHeading = document.getElementById("read-heading");
const visualTagText = document.getElementById("visual-tag-text");
const confidenceVal = document.getElementById("confidence-val");
const analyzedDishTitle = document.getElementById("analyzed-dish-title");
const analyzedDishDesc = document.getElementById("analyzed-dish-desc");
const ingredientsChips = document.getElementById("ingredients-chips");
const metaTime = document.getElementById("meta-time");
const metaPan = document.getElementById("meta-pan");
const metaDifficulty = document.getElementById("meta-difficulty");

// Section 03 Elements
const methodTitle = document.getElementById("method-title");
const methodDesc = document.getElementById("method-desc");
const statIngredients = document.getElementById("stat-ingredients");
const statMinutes = document.getElementById("stat-minutes");
const statServings = document.getElementById("stat-servings");
const gatherList = document.getElementById("gather-list");
const stepsList = document.getElementById("steps-list");

// Photo & Camera Elements
const photoDropzone = document.getElementById("photo-dropzone");
const fileInput = document.getElementById("file-input");
const dropzoneTitle = document.getElementById("dropzone-title");
const cameraBtn = document.getElementById("camera-btn");
const cameraModal = document.getElementById("camera-modal");
const closeCameraBtn = document.getElementById("close-camera-btn");
const cameraVideo = document.getElementById("camera-video");
const snapPhotoBtn = document.getElementById("snap-photo-btn");
const cameraCanvas = document.getElementById("camera-canvas");

// Initialize application: Start with recipe hidden until analyzed and text box empty!
document.addEventListener("DOMContentLoaded", () => {
  dishInput.value = "";
  presetPills.forEach(p => p.classList.remove("active"));
  renderRecipe(activeRecipe);
  setAppState("initial");
  bindEvents();
});

function bindEvents() {
  // Clear dish button
  clearDishBtn.addEventListener("click", () => {
    dishInput.value = "";
    dishInput.focus();
    presetPills.forEach(p => p.classList.remove("active"));
  });

  // Preset pill clicks: select dish and analyze
  presetPills.forEach(pill => {
    pill.addEventListener("click", () => {
      dishInput.value = pill.textContent.trim();
      presetPills.forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      triggerAnalysis();
    });
  });

  // Submit / Action button
  submitBtn.addEventListener("click", () => {
    triggerAnalysis();
  });

  // Enter key inside dish input
  dishInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      triggerAnalysis();
    }
  });

  // Start Over button: resets to initial clue-waiting state and removes text in text box!
  startOverBtn.addEventListener("click", () => {
    setAppState("initial");
    dishInput.value = "";
    uploadedImageBase64 = null;
    uploadedImageMime = null;
    dropzoneTitle.textContent = "Choose a food photo";
    presetPills.forEach(p => p.classList.remove("active"));
    updateSmallWindowImage("");
    dishInput.focus();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // File Upload Handlers
  photoDropzone.addEventListener("click", () => fileInput.click());
  fileInput.addEventListener("change", handleFileSelect);

  // Drag and Drop
  photoDropzone.addEventListener("dragover", (e) => {
    e.preventDefault();
    photoDropzone.classList.add("dragover");
  });
  photoDropzone.addEventListener("dragleave", () => {
    photoDropzone.classList.remove("dragover");
  });
  photoDropzone.addEventListener("drop", (e) => {
    e.preventDefault();
    photoDropzone.classList.remove("dragover");
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processSelectedImage(e.dataTransfer.files[0]);
    }
  });

  // Camera Modal Handlers
  cameraBtn.addEventListener("click", openCamera);
  closeCameraBtn.addEventListener("click", closeCamera);
  snapPhotoBtn.addEventListener("click", snapPhoto);
}

// Switch UI State between Initial (Clue wait) and Analyzed (Method revealed)
function setAppState(state) {
  currentState = state;
  if (state === "initial") {
    bodyEl.classList.remove("state-analyzed");
    bodyEl.classList.add("state-initial");
    readHeading.textContent = "See what comes next.";
    visualTagText.textContent = "A USEFUL FIRST MOVE";
    btnText.textContent = "Reveal the recipe";
  } else {
    bodyEl.classList.remove("state-initial");
    bodyEl.classList.add("state-analyzed");
    readHeading.textContent = "A method, not a guess.";
    visualTagText.textContent = "HOUSE METHOD · READY";
    btnText.textContent = "Analyze again";
  }
// Curated Food Photography Dictionary for Small Window
const DISH_PHOTO_MAP = [
  { match: ["fettuccine", "alfredo", "carbonara"], url: "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&w=900&q=80" },
  { match: ["shakshuka", "shakshouka", "egg", "eggs"], url: "https://images.unsplash.com/photo-1590412200988-a436970781fa?auto=format&fit=crop&w=900&q=80" },
  { match: ["garlic pasta", "spaghetti", "pasta", "noodles", "linguine"], url: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=900&q=80" },
  { match: ["salmon", "fish", "trout", "fillet"], url: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=900&q=80" },
  { match: ["shrimp", "prawn", "seafood", "lobster"], url: "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=900&q=80" },
  { match: ["chickpea", "skillet", "hummus"], url: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=900&q=80" },
  { match: ["tofu", "vegan", "vegetarian"], url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=80" },
  { match: ["curry", "tikka", "masala"], url: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=900&q=80" },
  { match: ["pizza", "flatbread", "focaccia"], url: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=900&q=80" },
  { match: ["burger", "sandwich", "patty"], url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80" },
  { match: ["taco", "fajita", "burrito", "quesadilla"], url: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=900&q=80" },
  { match: ["salad", "greens", "caesar"], url: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=80" },
  { match: ["soup", "stew", "chowder", "broth"], url: "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=900&q=80" },
  { match: ["rice", "risotto", "biryani", "fried rice", "paella"], url: "https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?auto=format&fit=crop&w=900&q=80" },
  { match: ["steak", "beef", "meat", "ribeye"], url: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=900&q=80" },
  { match: ["chicken", "wings", "roast chicken"], url: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=900&q=80" },
  { match: ["cake", "dessert", "cookie", "pie", "chocolate"], url: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=900&q=80" }
];

function getDishPhoto(dishName) {
  if (uploadedImageBase64) {
    return "data:" + (uploadedImageMime || "image/jpeg") + ";base64," + uploadedImageBase64;
  }
  const clean = (dishName || "").toLowerCase();
  for (const item of DISH_PHOTO_MAP) {
    if (item.match.some(keyword => clean.includes(keyword))) {
      return item.url;
    }
  }
  return null;
}

function updateSmallWindowImage(dishName) {
  const visualRecipeImg = document.getElementById("visual-recipe-img");
  const woodBoard = document.getElementById("wood-board");
  if (!visualRecipeImg || !woodBoard) return;

  if (currentState === "initial") {
    visualRecipeImg.style.display = "none";
    woodBoard.style.display = "flex";
    return;
  }

  const photo = getDishPhoto(dishName);
  if (photo) {
    visualRecipeImg.src = photo;
    visualRecipeImg.style.display = "block";
    woodBoard.style.display = "none";
  } else {
    // If no specific photo match, keep the elegant wood board vector
    visualRecipeImg.style.display = "none";
    woodBoard.style.display = "flex";
  }
}

// Render Recipe Data into the UI
function renderRecipe(recipe) {
  // Update the small window with picture of the typed recipe!
  updateSmallWindowImage(recipe.title || dishInput.value);

  // Section 02 Readout
  confidenceVal.textContent = recipe.confidence || "HIGH";
  analyzedDishTitle.textContent = recipe.title;
  analyzedDishDesc.textContent = recipe.description;

  // Detected Ingredients Chips
  ingredientsChips.innerHTML = "";
  (recipe.chips || []).forEach(chip => {
    const chipSpan = document.createElement("span");
    const isGold = chip.type === "gold";
    chipSpan.className = `chip ${isGold ? "chip-gold" : "chip-outline"}`;
    chipSpan.textContent = `${isGold ? "✓ " : "○ "}${chip.name}`;
    ingredientsChips.appendChild(chipSpan);
  });

  // Meta stats
  metaTime.textContent = `${recipe.minutes || 25} MIN`;
  metaPan.textContent = (recipe.panType || "ONE PAN").toUpperCase();
  metaDifficulty.textContent = (recipe.difficulty || "EASY").toUpperCase();

  // Section 03 Method Details
  methodTitle.textContent = recipe.title;
  methodDesc.textContent = recipe.description;
  statIngredients.textContent = recipe.ingredientsCount || (recipe.gather ? recipe.gather.length : 10);
  statMinutes.textContent = recipe.minutes || 25;
  statServings.textContent = recipe.servings || "2–3";

  // Gather list
  gatherList.innerHTML = "";
  (recipe.gather || []).forEach((item, index) => {
    const row = document.createElement("div");
    row.className = `ingredient-row ${item.checked ? "checked" : ""} ${item.optional ? "is-optional" : ""}`;
    row.innerHTML = `
      <div class="ingredient-left">
        <div class="custom-checkbox">
          ${item.checked ? '<span class="checkbox-mark">✓</span>' : '<span class="checkbox-dot"></span>'}
        </div>
        <div class="ingredient-meta">
          <span class="ingredient-name">${item.name}</span>
          ${item.optional ? '<span class="optional-badge">OPTIONAL</span>' : ''}
        </div>
      </div>
      <span class="ingredient-qty">${item.qty}</span>
    `;

    // Interactive checkbox toggle
    row.addEventListener("click", () => {
      item.checked = !item.checked;
      row.classList.toggle("checked", item.checked);
      const box = row.querySelector(".custom-checkbox");
      box.innerHTML = item.checked ? '<span class="checkbox-mark">✓</span>' : '<span class="checkbox-dot"></span>';
    });

    gatherList.appendChild(row);
  });

  // Steps list
  stepsList.innerHTML = "";
  (recipe.steps || []).forEach(step => {
    const card = document.createElement("div");
    card.className = "step-card";
    card.innerHTML = `
      <div class="step-card-num">${step.num}</div>
      <div class="step-content">
        <h4 class="step-heading">${step.title}</h4>
        <p class="step-instructions">${step.text}</p>
      </div>
    `;
    stepsList.appendChild(card);
  });
}

// Trigger Analysis: Analyzes first, then reveals the recipe!
async function triggerAnalysis() {
  let query = dishInput.value.trim().toLowerCase();

  // If empty input and no photo, default to golden chickpea skillet
  if (!query && !uploadedImageBase64) {
    query = "golden chickpea skillet";
    dishInput.value = "golden chickpea skillet";
  }

  // Visual Analyzing State Feedback
  btnText.textContent = "Analyzing recipe...";
  submitBtn.disabled = true;
  const bannerVisual = document.querySelector(".banner-visual");
  if (bannerVisual) bannerVisual.classList.add("is-analyzing");

  try {
    // Check canonical matches first (Golden chickpea skillet, Shakshuka, Pasta)
    if (!uploadedImageBase64 && CANONICAL_RECIPES[query]) {
      // Realistic brief culinary scanning delay
      await new Promise(resolve => setTimeout(resolve, 750));
      activeRecipe = CANONICAL_RECIPES[query];
      renderRecipe(activeRecipe);
      setAppState("analyzed");
      smoothScrollToMethod();
      return;
    }

    // Call Gemini 3.8 Flash for intelligent real-time analysis
    await analyzeWithGemini(query, uploadedImageBase64, uploadedImageMime);
  } finally {
    submitBtn.disabled = false;
    if (bannerVisual) bannerVisual.classList.remove("is-analyzing");
    if (currentState === "analyzed") {
      btnText.textContent = "Analyze again";
    } else {
      btnText.textContent = "Reveal the recipe";
    }
  }
}

// Gemini 3.8 Flash AI Analysis
async function analyzeWithGemini(dishName, imgBase64, imgMime) {
  const originalBtnText = btnText.textContent;
  btnText.textContent = "Analyzing ingredients...";
  submitBtn.disabled = true;

  const systemPrompt = `You are RecipeMethods, an elite culinary method engine.
Given a dish name or a food photo, extract and formulate a concise, structured cooking method.
Return ONLY valid JSON with this exact schema:
{
  "title": "Dish Name (Title Cased)",
  "description": "One concise, evocative editorial pitch sentence describing flavor and why it works on a weeknight.",
  "confidence": "HIGH",
  "ingredientsCount": 10,
  "minutes": 25,
  "servings": "2–3",
  "panType": "ONE PAN" (or SKILLET, ROASTER, POT),
  "difficulty": "EASY" (or MEDIUM),
  "chips": [
    { "name": "chickpeas", "type": "gold" },
    { "name": "tomato", "type": "gold" },
    { "name": "cumin", "type": "outline" }
  ],
  "gather": [
    { "name": "ingredient with preparation", "qty": "2 cans / 480 g", "checked": true, "optional": false },
    { "name": "optional ingredient", "qty": "½ tsp", "checked": false, "optional": true }
  ],
  "steps": [
    { "num": "01", "title": "Evocative Title (3-4 words)", "text": "Clear 2-sentence culinary instruction with sensory cue and timing." },
    { "num": "02", "title": "Bloom or Sear", "text": "..." },
    { "num": "03", "title": "Build the Body", "text": "..." },
    { "num": "04", "title": "Balance and Finish", "text": "..." }
  ]
}
Make exactly 4 method steps. Mark key items as type 'gold' and optional as 'outline'.`;

  try {
    let parts = [];
    if (imgBase64) {
      parts.push({
        inlineData: {
          mimeType: imgMime || "image/jpeg",
          data: imgBase64
        }
      });
      parts.push({ text: `Analyze this food image. Infer the dish name and generate the complete RecipeMethods structure: ${dishName || 'identify from photo'}` });
    } else {
      parts.push({ text: `Generate the complete RecipeMethods structure for this dish: "${dishName}". ${systemPrompt}` });
    }

    // Try backend proxy first, fallback to direct client call with user key
    let resultJson = null;

    try {
      const serverRes = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dishName, imageBase64: imgBase64, imageMime: imgMime })
      });
      if (serverRes.ok) {
        resultJson = await serverRes.json();
      }
    } catch (e) {
      // Backend not running, proceed to direct client API call
    }

    if (!resultJson) {
      // Direct call to Gemini 3.8 Flash using provided API key
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${GEMINI_API_KEY}`;
      const apiRes = await fetch(endpoint, {
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

      const data = await apiRes.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (rawText) {
        resultJson = JSON.parse(rawText);
      }
    }

    if (resultJson) {
      activeRecipe = resultJson;
      renderRecipe(activeRecipe);
      setAppState("analyzed");
      smoothScrollToMethod();
    } else {
      throw new Error("Could not parse recipe");
    }

  } catch (err) {
    console.warn("AI generation fallback to default skillet:", err);
    // Graceful fallback to golden chickpea skillet
    activeRecipe = CANONICAL_RECIPES["golden chickpea skillet"];
    dishInput.value = "golden chickpea skillet";
    renderRecipe(activeRecipe);
    setAppState("analyzed");
  } finally {
    submitBtn.disabled = false;
    btnText.textContent = "Analyze again";
  }
}

function smoothScrollToMethod() {
  const methodSec = document.getElementById("section-02");
  if (methodSec) {
    methodSec.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

// Photo file upload
function handleFileSelect(e) {
  const file = e.target.files[0];
  if (file) {
    processSelectedImage(file);
  }
}

function processSelectedImage(file) {
  if (!file.type.startsWith("image/")) {
    alert("Please upload an image file (JPG, PNG, or HEIC).");
    return;
  }

  dropzoneTitle.textContent = file.name;
  const reader = new FileReader();
  reader.onload = (evt) => {
    const base64Data = evt.target.result.split(",")[1];
    uploadedImageBase64 = base64Data;
    uploadedImageMime = file.type;
    triggerAnalysis();
  };
  reader.readAsDataURL(file);
}

// Camera handling
async function openCamera() {
  cameraModal.classList.add("is-open");
  cameraModal.setAttribute("aria-hidden", "false");
  try {
    mediaStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" }
    });
    cameraVideo.srcObject = mediaStream;
  } catch (err) {
    console.error("Camera access failed:", err);
    alert("Camera access was not granted or not supported in this environment.");
    closeCamera();
  }
}

function closeCamera() {
  if (mediaStream) {
    mediaStream.getTracks().forEach(track => track.stop());
    mediaStream = null;
  }
  cameraModal.classList.remove("is-open");
  cameraModal.setAttribute("aria-hidden", "true");
}

function snapPhoto() {
  if (!cameraVideo.videoWidth) return;
  cameraCanvas.width = cameraVideo.videoWidth;
  cameraCanvas.height = cameraVideo.videoHeight;
  const ctx = cameraCanvas.getContext("2d");
  ctx.drawImage(cameraVideo, 0, 0);

  const dataUrl = cameraCanvas.toDataURL("image/jpeg", 0.85);
  uploadedImageBase64 = dataUrl.split(",")[1];
  uploadedImageMime = "image/jpeg";
  dropzoneTitle.textContent = "Camera Photo Captured";

  closeCamera();
  triggerAnalysis();
}
