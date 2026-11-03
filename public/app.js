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
    ],
    variants: {
      jain: {
        title: "Golden Chickpea Skillet (Jain Method)",
        description: "Sweet vine tomatoes, tender chickpeas, and green chilies sizzled with blooming cumin and aromatic hing in cold-pressed oil, strictly zero onion, garlic, or root vegetables.",
        confidence: "HIGH",
        ingredientsCount: 8,
        minutes: 20,
        servings: "2–3",
        panType: "ONE PAN",
        difficulty: "EASY",
        chips: [
          { name: "chickpeas", type: "gold" },
          { name: "vine tomatoes", type: "gold" },
          { name: "asafoetida (hing)", type: "gold" },
          { name: "cumin", type: "gold" },
          { name: "turmeric", type: "gold" },
          { name: "lemon", type: "gold" },
          { name: "coriander", type: "outline" }
        ],
        gather: [
          { name: "chickpeas, drained", qty: "2 cans / 480 g", checked: true, optional: false },
          { name: "ripe vine tomatoes, chopped", qty: "3 medium", checked: true, optional: false },
          { name: "compounded asafoetida (hing)", qty: "¼ tsp", checked: true, optional: false },
          { name: "whole cumin seeds", qty: "1 tsp", checked: true, optional: false },
          { name: "green chilies, slit", qty: "1–2", checked: false, optional: true },
          { name: "cold-pressed olive oil or ghee", qty: "3 tbsp", checked: true, optional: false },
          { name: "ground turmeric", qty: "1 tsp", checked: true, optional: false },
          { name: "fresh lemon, juiced", qty: "1", checked: true, optional: false },
          { name: "fresh coriander leaves", qty: "a handful", checked: false, optional: true },
          { name: "sea salt", qty: "to taste", checked: true, optional: false }
        ],
        steps: [
          {
            num: "01",
            title: "Bloom sacred aromatics",
            text: "Warm oil or ghee in a wide pan over medium heat. Sizzle cumin seeds and a generous pinch of hing (asafoetida) for 20 seconds until fragrant, unlocking rich allium-like savory depth without onion or garlic."
          },
          {
            num: "02",
            title: "Bloom golden spices",
            text: "Add turmeric and green chilies. Let them sizzle in the oil for 15 seconds until the oil turns deep gold."
          },
          {
            num: "03",
            title: "Build the tomato base",
            text: "Tip in chopped vine tomatoes and chickpeas with salt. Simmer uncovered until tomatoes soften into a glossy sauce coating each chickpea, 8–10 minutes."
          },
          {
            num: "04",
            title: "Balance and finish",
            text: "Take off heat. Squeeze fresh lemon juice over the skillet and scatter with fresh coriander. Serve warm with rotis or rice."
          }
        ]
      },
      healthier: {
        title: "Nutrient-Dense Golden Chickpea & Greens Skillet",
        description: "Plump chickpeas simmered in turmeric, tomatoes, and cumin, enriched with tender baby spinach, kale, and toasted pumpkin seeds with minimal cold-pressed olive oil.",
        confidence: "HIGH",
        ingredientsCount: 9,
        minutes: 25,
        servings: "2–3",
        panType: "ONE PAN",
        difficulty: "EASY",
        chips: [
          { name: "chickpeas", type: "gold" },
          { name: "baby greens", type: "gold" },
          { name: "ripe tomatoes", type: "gold" },
          { name: "turmeric", type: "gold" },
          { name: "pumpkin seeds", type: "outline" }
        ],
        gather: [
          { name: "chickpeas, drained", qty: "2 cans / 480 g", checked: true, optional: false },
          { name: "baby spinach & kale", qty: "3 cups packed", checked: true, optional: false },
          { name: "ripe tomatoes, chopped", qty: "3 medium", checked: true, optional: false },
          { name: "red onion, sliced", qty: "½ small", checked: true, optional: false },
          { name: "garlic, grated", qty: "2 cloves", checked: true, optional: false },
          { name: "cold-pressed olive oil", qty: "1½ tbsp", checked: true, optional: false },
          { name: "ground turmeric", qty: "1 tsp", checked: true, optional: false },
          { name: "toasted pumpkin seeds", qty: "2 tbsp", checked: false, optional: true },
          { name: "lemon, juiced", qty: "1", checked: true, optional: false }
        ],
        steps: [
          {
            num: "01",
            title: "Light aromatic sweat",
            text: "Warm measured olive oil in a wide pan. Sauté onion and garlic gently until fragrant, 3 minutes."
          },
          {
            num: "02",
            title: "Bloom turmeric",
            text: "Stir in turmeric for 20 seconds until golden."
          },
          {
            num: "03",
            title: "Simmer chickpeas & slump greens",
            text: "Add tomatoes and chickpeas. Simmer 7 minutes, then fold in spinach and kale until just wilted and bright green, 2 minutes."
          },
          {
            num: "04",
            title: "Seed crunch & finish",
            text: "Finish with fresh lemon juice and crunchy toasted pumpkin seeds."
          }
        ]
      },
      vegetarian: {
        title: "Golden Chickpea Skillet",
        description: "Bright, savory, and forgiving. Warm spice and lemon make this 100% vegetarian one-pan meal work hard on a weeknight.",
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
          { name: "lemon", type: "gold" }
        ],
        gather: [
          { name: "chickpeas, drained", qty: "2 cans / 480 g", checked: true, optional: false },
          { name: "ripe tomatoes, chopped", qty: "3 medium", checked: true, optional: false },
          { name: "red onion, thinly sliced", qty: "½ small", checked: true, optional: false },
          { name: "garlic, finely grated", qty: "2 cloves", checked: true, optional: false },
          { name: "olive oil", qty: "3 tbsp", checked: true, optional: false },
          { name: "ground turmeric", qty: "1 tsp", checked: true, optional: false },
          { name: "lemon, juiced", qty: "1", checked: true, optional: false },
          { name: "flat-leaf parsley", qty: "a handful", checked: false, optional: true }
        ],
        steps: [
          {
            num: "01",
            title: "Wake the aromatics",
            text: "Warm the oil in a wide pan over medium heat. Add onion and a pinch of salt; cook until softened, 4 minutes. Stir in garlic."
          },
          {
            num: "02",
            title: "Bloom the spice",
            text: "Add turmeric and cumin. Let them sizzle in the oil for 20 seconds until golden."
          },
          {
            num: "03",
            title: "Build the pan",
            text: "Tip in tomatoes and chickpeas. Simmer uncovered until tomatoes slump and chickpeas take on color, 8–10 minutes."
          },
          {
            num: "04",
            title: "Balance and finish",
            text: "Take off heat. Add lemon juice, salt, and scatter parsley."
          }
        ]
      },
      vegan: {
        title: "Plant-Based Golden Chickpea Skillet",
        description: "Naturally 100% plant-based with hearty protein-rich chickpeas, ripe tomatoes, olive oil, and golden turmeric.",
        confidence: "HIGH",
        ingredientsCount: 10,
        minutes: 25,
        servings: "2–3",
        panType: "ONE PAN",
        difficulty: "EASY",
        chips: [
          { name: "chickpeas", type: "gold" },
          { name: "tomato", type: "gold" },
          { name: "olive oil", type: "gold" },
          { name: "lemon", type: "gold" }
        ],
        gather: [
          { name: "chickpeas, drained", qty: "2 cans / 480 g", checked: true, optional: false },
          { name: "ripe tomatoes, chopped", qty: "3 medium", checked: true, optional: false },
          { name: "red onion, thinly sliced", qty: "½ small", checked: true, optional: false },
          { name: "olive oil", qty: "3 tbsp", checked: true, optional: false },
          { name: "ground turmeric", qty: "1 tsp", checked: true, optional: false },
          { name: "lemon, juiced", qty: "1", checked: true, optional: false }
        ],
        steps: [
          {
            num: "01",
            title: "Wake aromatics",
            text: "Warm olive oil with onions and salt for 4 minutes."
          },
          {
            num: "02",
            title: "Bloom turmeric",
            text: "Add turmeric and cumin for 20 seconds."
          },
          {
            num: "03",
            title: "Simmer chickpeas",
            text: "Add chickpeas and tomatoes; simmer for 8-10 minutes."
          },
          {
            num: "04",
            title: "Finish with lemon",
            text: "Take off heat, splash lemon juice and parsley."
          }
        ]
      },
      glutenfree: {
        title: "Gluten-Free Golden Chickpea Skillet",
        description: "Naturally certified gluten-free whole food ingredients simmered in pure virgin olive oil, herbs, and warm spices.",
        confidence: "HIGH",
        ingredientsCount: 9,
        minutes: 25,
        servings: "2–3",
        panType: "ONE PAN",
        difficulty: "EASY",
        chips: [
          { name: "chickpeas", type: "gold" },
          { name: "tomatoes", type: "gold" },
          { name: "turmeric", type: "gold" }
        ],
        gather: [
          { name: "chickpeas, drained", qty: "2 cans / 480 g", checked: true, optional: false },
          { name: "tomatoes, chopped", qty: "3 medium", checked: true, optional: false },
          { name: "onion & garlic", qty: "½ onion, 2 cloves", checked: true, optional: false },
          { name: "olive oil", qty: "3 tbsp", checked: true, optional: false },
          { name: "turmeric & cumin", qty: "1½ tsp total", checked: true, optional: false }
        ],
        steps: [
          {
            num: "01",
            title: "Wake aromatics",
            text: "Warm olive oil with onions and garlic for 4 minutes."
          },
          {
            num: "02",
            title: "Bloom spice",
            text: "Add turmeric and cumin for 20 seconds."
          },
          {
            num: "03",
            title: "Simmer skillet",
            text: "Fold in chickpeas and tomatoes until sauce thickens, 8-10 minutes."
          },
          {
            num: "04",
            title: "Brighten",
            text: "Finish with fresh lemon juice and sea salt."
          }
        ]
      }
    }
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
  },

  "classic fettuccine alfredo": {
    title: "Classic Fettuccine Alfredo",
    description: "Silky ribbons of pasta coated in an emulsified mantle of sweet butter, rich cream, and nutty Parmigiano-Reggiano, delivering decadent Italian comfort in twenty minutes.",
    confidence: "HIGH",
    ingredientsCount: 6,
    minutes: 20,
    servings: "2–3",
    panType: "LARGE SKILLET",
    difficulty: "EASY",
    chips: [
      { name: "fettuccine", type: "gold" },
      { name: "parmigiano-reggiano", type: "gold" },
      { name: "unsalted butter", type: "gold" },
      { name: "heavy cream", type: "gold" },
      { name: "fresh parsley", type: "outline" },
      { name: "freshly cracked pepper", type: "outline" }
    ],
    gather: [
      { name: "fresh fettuccine ribbons", qty: "300 g", checked: true, optional: false },
      { name: "aged Parmigiano-Reggiano, finely grated", qty: "1½ cups / 120 g", checked: true, optional: false },
      { name: "unsalted sweet butter", qty: "6 tbsp / 85 g", checked: true, optional: false },
      { name: "heavy whipping cream", qty: "½ cup / 120 ml", checked: true, optional: false },
      { name: "starchy pasta cooking water", qty: "½ cup", checked: true, optional: false },
      { name: "fresh flat-leaf parsley, chopped", qty: "2 tbsp", checked: false, optional: true },
      { name: "freshly cracked black pepper", qty: "1 tsp", checked: false, optional: true },
      { name: "kosher salt for pasta water", qty: "2 tbsp", checked: true, optional: false }
    ],
    steps: [
      {
        num: "01",
        title: "Boil the fettuccine",
        text: "Drop fresh fettuccine into rolling, heavily salted water. Cook until just 1 minute before al dente; reserve ½ cup of cloudy pasta cooking water."
      },
      {
        num: "02",
        title: "Warm butter and cream",
        text: "In a wide large skillet over medium-low heat, melt sweet butter into heavy cream with 3 tablespoons of hot pasta water until gently shimmering."
      },
      {
        num: "03",
        title: "Toss and emulsify",
        text: "Transfer drained fettuccine straight into the skillet. Remove from heat immediately, sprinkle cheese in gradual handfuls, swirling vigorously as the cheese and cream fuse into silk."
      },
      {
        num: "04",
        title: "Season and serve",
        text: "Splash more pasta water if needed to maintain a glossy coat. Finish with cracked black pepper and chopped parsley; serve instantly on warm plates."
      }
    ],
    variants: {
      jain: {
        title: "Classic Fettuccine Alfredo (Jain Version)",
        description: "Pure sweet butter and fresh cream gently bloomed with aromatic hing and nutmeg, tossed with fettuccine in a velvety Parmigiano mantle without onion, garlic, or root crops.",
        confidence: "HIGH",
        ingredientsCount: 6,
        minutes: 20,
        servings: "2–3",
        panType: "LARGE SKILLET",
        difficulty: "EASY",
        chips: [
          { name: "fettuccine", type: "gold" },
          { name: "parmigiano-reggiano", type: "gold" },
          { name: "sweet butter", type: "gold" },
          { name: "heavy cream", type: "gold" },
          { name: "asafoetida (hing)", type: "gold" },
          { name: "freshly cracked pepper", type: "outline" }
        ],
        gather: [
          { name: "fresh fettuccine ribbons", qty: "300 g", checked: true, optional: false },
          { name: "aged Parmigiano-Reggiano, grated", qty: "1½ cups / 120 g", checked: true, optional: false },
          { name: "unsalted sweet butter", qty: "6 tbsp / 85 g", checked: true, optional: false },
          { name: "heavy whipping cream", qty: "½ cup / 120 ml", checked: true, optional: false },
          { name: "compounded asafoetida (hing)", qty: "⅛ tsp (toasted)", checked: true, optional: false },
          { name: "ground nutmeg", qty: "a tiny pinch", checked: false, optional: true },
          { name: "starchy pasta cooking water", qty: "½ cup", checked: true, optional: false },
          { name: "freshly cracked black pepper", qty: "1 tsp", checked: true, optional: false }
        ],
        steps: [
          {
            num: "01",
            title: "Boil the fettuccine",
            text: "Drop fresh fettuccine into rolling, heavily salted water. Cook until just 1 minute before al dente; reserve ½ cup of cloudy pasta cooking water."
          },
          {
            num: "02",
            title: "Bloom hing in sweet cream",
            text: "Melt sweet butter in a wide skillet over gentle medium-low heat. Add ⅛ tsp toasted hing to release deep savory aroma, then pour in heavy cream and 3 tbsp pasta water until gently shimmering."
          },
          {
            num: "03",
            title: "Toss and emulsify",
            text: "Transfer drained fettuccine straight into the skillet. Remove from heat immediately, sprinkle Parmigiano in gradual handfuls, swirling vigorously until cheese and cream fuse into silk."
          },
          {
            num: "04",
            title: "Season and serve",
            text: "Splash more pasta water if needed to maintain a glossy coat. Finish with cracked black pepper and a whisper of nutmeg; serve instantly on warm plates."
          }
        ]
      },
      healthier: {
        title: "Lightened Silk Fettuccine Alfredo",
        description: "Silky ribbons coated in a lightened emulsion of sweet cream, reserved starch water, tender steamed broccoli florets, and microplaned Parmigiano, slashing saturated fat while keeping pure decadence.",
        confidence: "HIGH",
        ingredientsCount: 6,
        minutes: 20,
        servings: "2–3",
        panType: "LARGE SKILLET",
        difficulty: "EASY",
        chips: [
          { name: "fettuccine", type: "gold" },
          { name: "steamed broccoli florets", type: "gold" },
          { name: "parmigiano-reggiano", type: "gold" },
          { name: "light sweet cream", type: "gold" },
          { name: "lemon zest", type: "outline" }
        ],
        gather: [
          { name: "whole grain or bronze fettuccine", qty: "280 g", checked: true, optional: false },
          { name: "tender baby broccoli florets", qty: "1½ cups", checked: true, optional: false },
          { name: "sweet butter", qty: "2 tbsp / 28 g", checked: true, optional: false },
          { name: "light single cream or oat cream", qty: "½ cup / 120 ml", checked: true, optional: false },
          { name: "aged Parmigiano-Reggiano, microplaned", qty: "¾ cup / 60 g", checked: true, optional: false },
          { name: "hot starchy pasta cooking water", qty: "½ cup", checked: true, optional: false },
          { name: "fresh lemon zest", qty: "½ tsp", checked: false, optional: true },
          { name: "freshly cracked black pepper", qty: "1 tsp", checked: true, optional: false }
        ],
        steps: [
          {
            num: "01",
            title: "Boil pasta & blanch broccoli",
            text: "Boil fettuccine in salted water. In the final 2 minutes of cooking, drop broccoli florets directly into the pasta water to blanch vibrant green. Scoop out ½ cup cooking water."
          },
          {
            num: "02",
            title: "Emulsify light sauce",
            text: "Melt measured butter with light cream in a wide skillet over low heat. Whisk in ¼ cup hot pasta water until emulsified and shimmering without boiling."
          },
          {
            num: "03",
            title: "Vigorous folding",
            text: "Slide fettuccine and bright broccoli into the pan. Remove from heat, showering with microplaned Parmigiano while tossing actively so the starchy water creates an ultra-glossy velvet mantle."
          },
          {
            num: "04",
            title: "Zest & finish",
            text: "Crown with black pepper, a touch of lemon zest for brightness, and serve steaming hot."
          }
        ]
      },
      vegetarian: {
        title: "Classic Vegetarian Fettuccine Alfredo",
        description: "Crafted with vegetarian microbial-rennet Italian hard cheese, sweet European butter, and rich cream for authentic comfort that is strictly vegetarian.",
        confidence: "HIGH",
        ingredientsCount: 6,
        minutes: 20,
        servings: "2–3",
        panType: "LARGE SKILLET",
        difficulty: "EASY",
        chips: [
          { name: "fettuccine", type: "gold" },
          { name: "vegetarian hard cheese", type: "gold" },
          { name: "sweet butter", type: "gold" },
          { name: "heavy cream", type: "gold" },
          { name: "fresh parsley", type: "outline" }
        ],
        gather: [
          { name: "fresh fettuccine ribbons", qty: "300 g", checked: true, optional: false },
          { name: "vegetarian Italian hard cheese (microbial rennet)", qty: "1½ cups / 120 g", checked: true, optional: false },
          { name: "unsalted sweet butter", qty: "6 tbsp / 85 g", checked: true, optional: false },
          { name: "heavy whipping cream", qty: "½ cup / 120 ml", checked: true, optional: false },
          { name: "starchy pasta cooking water", qty: "½ cup", checked: true, optional: false },
          { name: "fresh flat-leaf parsley, chopped", qty: "2 tbsp", checked: false, optional: true },
          { name: "freshly cracked black pepper", qty: "1 tsp", checked: true, optional: false }
        ],
        steps: [
          {
            num: "01",
            title: "Boil the fettuccine",
            text: "Drop fresh fettuccine into rolling, heavily salted water. Cook until just 1 minute before al dente; reserve ½ cup of cloudy pasta cooking water."
          },
          {
            num: "02",
            title: "Warm butter and cream",
            text: "In a wide large skillet over medium-low heat, melt sweet butter into heavy cream with 3 tablespoons of hot pasta water until gently shimmering."
          },
          {
            num: "03",
            title: "Toss and emulsify",
            text: "Transfer drained fettuccine straight into the skillet. Remove from heat immediately, sprinkle cheese in gradual handfuls, swirling vigorously as the cheese and cream fuse into silk."
          },
          {
            num: "04",
            title: "Season and serve",
            text: "Splash more pasta water if needed to maintain a glossy coat. Finish with cracked black pepper and chopped parsley; serve instantly on warm plates."
          }
        ]
      },
      vegan: {
        title: "Plant-Based Cashew Silk Alfredo",
        description: "Velvety ribbons coated in an ultra-luxurious cashew cream and nutritional yeast mantle with olive oil and cracked pepper, 100% plant-based with zero dairy.",
        confidence: "HIGH",
        ingredientsCount: 6,
        minutes: 20,
        servings: "2–3",
        panType: "LARGE SKILLET",
        difficulty: "EASY",
        chips: [
          { name: "fettuccine", type: "gold" },
          { name: "cashew cream", type: "gold" },
          { name: "olive oil", type: "gold" },
          { name: "nutritional yeast", type: "gold" }
        ],
        gather: [
          { name: "bronze-cut fettuccine", qty: "300 g", checked: true, optional: false },
          { name: "soaked raw cashew cream", qty: "1 cup / 240 ml", checked: true, optional: false },
          { name: "extra virgin olive oil", qty: "3 tbsp", checked: true, optional: false },
          { name: "fortified nutritional yeast", qty: "3 tbsp", checked: true, optional: false },
          { name: "fresh lemon juice", qty: "1 tsp", checked: true, optional: false },
          { name: "starchy pasta cooking water", qty: "½ cup", checked: true, optional: false },
          { name: "freshly cracked black pepper", qty: "1 tsp", checked: true, optional: false }
        ],
        steps: [
          {
            num: "01",
            title: "Boil the fettuccine",
            text: "Cook bronze-die fettuccine in salted water until al dente; reserve ½ cup starchy pasta cooking water."
          },
          {
            num: "02",
            title: "Warm plant silk base",
            text: "Gently warm olive oil and cashew cream in a skillet over low heat with pasta water until silky and fluid."
          },
          {
            num: "03",
            title: "Fold and cheese luster",
            text: "Toss pasta into the skillet off heat, dusting with nutritional yeast and lemon juice until each ribbon is bathed in a glossy golden coat."
          },
          {
            num: "04",
            title: "Finish with pepper",
            text: "Season generously with freshly cracked black pepper and fresh herbs."
          }
        ]
      },
      glutenfree: {
        title: "Gluten-Free Fettuccine Alfredo",
        description: "Tender bronze-extruded gluten-free ribbons tossed in sweet butter, heavy cream, and Parmigiano-Reggiano, retaining perfect al dente bite without wheat.",
        confidence: "HIGH",
        ingredientsCount: 6,
        minutes: 20,
        servings: "2–3",
        panType: "LARGE SKILLET",
        difficulty: "EASY",
        chips: [
          { name: "gluten-free fettuccine", type: "gold" },
          { name: "parmigiano-reggiano", type: "gold" },
          { name: "sweet butter", type: "gold" },
          { name: "heavy cream", type: "gold" }
        ],
        gather: [
          { name: "certified gluten-free fettuccine", qty: "300 g", checked: true, optional: false },
          { name: "aged Parmigiano-Reggiano, grated", qty: "1½ cups / 120 g", checked: true, optional: false },
          { name: "unsalted sweet butter", qty: "6 tbsp / 85 g", checked: true, optional: false },
          { name: "heavy whipping cream", qty: "½ cup / 120 ml", checked: true, optional: false },
          { name: "starchy cooking water", qty: "½ cup", checked: true, optional: false },
          { name: "freshly cracked black pepper", qty: "1 tsp", checked: true, optional: false }
        ],
        steps: [
          {
            num: "01",
            title: "Boil gluten-free ribbons",
            text: "Boil gluten-free fettuccine in heavily salted water until tender-firm. Drain gently, reserving ½ cup hot cooking water."
          },
          {
            num: "02",
            title: "Warm butter and cream",
            text: "Melt butter into cream in a large skillet over low heat until shimmering."
          },
          {
            num: "03",
            title: "Emulsify off heat",
            text: "Fold pasta into the skillet, tossing with Parmigiano and cooking water until rich and glossy."
          },
          {
            num: "04",
            title: "Season and serve",
            text: "Crown with black pepper and serve hot."
          }
        ]
      }
    }
  },

  "crispy street-style tacos": {
    title: "Crispy Street-Style Tacos",
    description: "Charred corn tortillas cradling seasoned crisp fillings, blistered scallions, and bright fresh pico with lime.",
    confidence: "HIGH",
    ingredientsCount: 8,
    minutes: 20,
    servings: "2–3",
    panType: "CAST IRON SKILLET",
    difficulty: "EASY",
    chips: [
      { name: "corn tortillas", type: "gold" },
      { name: "fresh lime", type: "gold" },
      { name: "cilantro", type: "gold" },
      { name: "red onion", type: "gold" },
      { name: "cumin & chili", type: "gold" },
      { name: "queso fresco", type: "outline" }
    ],
    gather: [
      { name: "white corn tortillas", qty: "6–8 small", checked: true, optional: false },
      { name: "ripe plum tomatoes, finely diced", qty: "2 medium", checked: true, optional: false },
      { name: "red onion, finely diced", qty: "½ small", checked: true, optional: false },
      { name: "fresh cilantro leaves, chopped", qty: "½ cup", checked: true, optional: false },
      { name: "fresh limes, cut into wedges", qty: "2 whole", checked: true, optional: false },
      { name: "ground cumin & ancho chili", qty: "1 tsp each", checked: true, optional: false },
      { name: "crumbled queso fresco or cotija", qty: "½ cup / 60 g", checked: false, optional: true },
      { name: "flaky sea salt", qty: "to taste", checked: true, optional: false }
    ],
    steps: [
      {
        num: "01",
        title: "Mix the pico de gallo",
        text: "Toss diced tomatoes, minced red onion, cilantro, fresh lime juice, and a pinch of salt in a small bowl. Let the flavors marry at room temperature for 10 minutes."
      },
      {
        num: "02",
        title: "Toast & char tortillas",
        text: "Heat a dry cast-iron skillet over medium-high heat. Warm tortillas for 30–45 seconds per side until lightly blistered, flexible, and fragrant. Wrap in a clean kitchen towel."
      },
      {
        num: "03",
        title: "Sear the savory filling",
        text: "In the same hot pan, quickly sear black beans, mushrooms, or spiced protein with cumin, ancho chili, and a splash of olive oil until sizzling and fragrant, 3–4 minutes."
      },
      {
        num: "04",
        title: "Assemble with vibrant finish",
        text: "Layer warm double tortillas, spoon the hot savory filling, crown with cool pico de gallo, crumbled queso, and a generous squeeze of fresh lime juice."
      }
    ]
  },

  "artisan skillet margherita pizza": {
    title: "Artisan Skillet Margherita Pizza",
    description: "High-heat stovetop-to-broiler skillet pizza boasting a blistered, leopard-spotted crust, sweet San Marzano tomatoes, and melted fresh mozzarella.",
    confidence: "HIGH",
    ingredientsCount: 6,
    minutes: 18,
    servings: "2",
    panType: "CAST IRON SKILLET",
    difficulty: "MEDIUM",
    chips: [
      { name: "pizza dough", type: "gold" },
      { name: "san marzano tomatoes", type: "gold" },
      { name: "fresh mozzarella", type: "gold" },
      { name: "fresh basil", type: "gold" },
      { name: "extra virgin olive oil", type: "gold" },
      { name: "sea salt", type: "outline" }
    ],
    gather: [
      { name: "fermented pizza dough ball", qty: "250 g", checked: true, optional: false },
      { name: "crushed San Marzano tomatoes", qty: "½ cup / 120 g", checked: true, optional: false },
      { name: "fresh whole-milk mozzarella, torn", qty: "125 g", checked: true, optional: false },
      { name: "fresh sweet basil leaves", qty: "6–8 leaves", checked: true, optional: false },
      { name: "extra virgin olive oil", qty: "2 tbsp", checked: true, optional: false },
      { name: "flaky sea salt", qty: "to taste", checked: true, optional: false }
    ],
    steps: [
      {
        num: "01",
        title: "Preheat pan & stretch dough",
        text: "Set oven broiler to high. Heat a heavy cast-iron skillet over high heat on the stovetop. Stretch room-temperature dough into a 10-inch circle on parchment or oiled board."
      },
      {
        num: "02",
        title: "Sear the bottom crust",
        text: "Carefully lay dough into the dry, smoking hot skillet. Cook for 2 minutes until underside develops deep golden blisters and leopard spots."
      },
      {
        num: "03",
        title: "Dress with speed",
        text: "Working quickly, spoon crushed tomatoes across dough leaving a 1-inch border. Scatter torn mozzarella and drizzle with olive oil."
      },
      {
        num: "04",
        title: "Broil to blister & melt",
        text: "Transfer skillet directly beneath the oven broiler for 3–4 minutes until cheese bubbles and crust puffs with charred blisters. Scatter fresh basil and slice immediately."
      }
    ]
  },

  "crispy pan-seared salmon": {
    title: "Crispy Pan-Seared Salmon",
    description: "Restaurant-grade golden crackling skin and a buttery, tender center basted with browned butter, garlic, fresh thyme, and lemon.",
    confidence: "HIGH",
    ingredientsCount: 6,
    minutes: 15,
    servings: "2",
    panType: "STAINLESS STEEL SKILLET",
    difficulty: "EASY",
    chips: [
      { name: "salmon fillets", type: "gold" },
      { name: "butter", type: "gold" },
      { name: "fresh thyme", type: "gold" },
      { name: "fresh lemon", type: "gold" },
      { name: "garlic cloves", type: "gold" },
      { name: "sea salt", type: "outline" }
    ],
    gather: [
      { name: "skin-on salmon fillets, center-cut", qty: "2 fillets (180g ea)", checked: true, optional: false },
      { name: "unsalted butter", qty: "2 tbsp / 30 g", checked: true, optional: false },
      { name: "fresh thyme sprigs", qty: "3 sprigs", checked: true, optional: false },
      { name: "garlic, lightly crushed", qty: "2 cloves", checked: true, optional: false },
      { name: "lemon, halved", qty: "1 whole", checked: true, optional: false },
      { name: "flaky sea salt & black pepper", qty: "to taste", checked: true, optional: false }
    ],
    steps: [
      {
        num: "01",
        title: "Dry and season skin",
        text: "Thoroughly pat salmon skin dry with paper towels until completely matte. Season liberally with fine sea salt; dry skin is the single secret to glass-like crispness."
      },
      {
        num: "02",
        title: "Press in hot oil",
        text: "Heat oil in a stainless skillet over medium-high until shimmering. Place salmon skin-side down; press firmly with a spatula for 15 seconds to prevent curling."
      },
      {
        num: "03",
        title: "Cook 90% on skin side",
        text: "Leave untouched over medium heat for 6–7 minutes until skin is deeply golden and flesh turns opaque almost all the way through."
      },
      {
        num: "04",
        title: "Aromatics baste & kiss",
        text: "Flip gently. Add butter, crushed garlic, and thyme. Tilt the pan and spoon foaming aromatic butter over fillets for 45 seconds. Finish with fresh lemon juice."
      }
    ]
  },

  "creamy wild mushroom risotto": {
    title: "Creamy Wild Mushroom Risotto",
    description: "Velvety carnaroli rice slowly coaxed with warm stock, golden caramelized wild mushrooms, white wine, and aged Parmigiano.",
    confidence: "HIGH",
    ingredientsCount: 8,
    minutes: 30,
    servings: "3–4",
    panType: "WIDE DEEP SKILLET",
    difficulty: "MEDIUM",
    chips: [
      { name: "carnaroli or arborio rice", type: "gold" },
      { name: "mixed wild mushrooms", type: "gold" },
      { name: "dry white wine", type: "gold" },
      { name: "shallot", type: "gold" },
      { name: "parmigiano-reggiano", type: "gold" },
      { name: "fresh thyme", type: "outline" }
    ],
    gather: [
      { name: "Carnaroli or Arborio rice", qty: "1½ cups / 300 g", checked: true, optional: false },
      { name: "cremini & shiitake mushrooms, sliced", qty: "300 g", checked: true, optional: false },
      { name: "dry white wine or vermouth", qty: "½ cup / 120 ml", checked: true, optional: false },
      { name: "warm vegetable or chicken stock", qty: "4–5 cups", checked: true, optional: false },
      { name: "shallot, finely minced", qty: "1 large", checked: true, optional: false },
      { name: "unsalted butter", qty: "3 tbsp / 45 g", checked: true, optional: false },
      { name: "aged Parmigiano-Reggiano, grated", qty: "½ cup / 50 g", checked: true, optional: false },
      { name: "fresh thyme leaves", qty: "1 tbsp", checked: false, optional: true }
    ],
    steps: [
      {
        num: "01",
        title: "Caramelize mushrooms",
        text: "Sear sliced mushrooms in a wide skillet over high heat with 1 tbsp butter until deep golden brown and fragrant, 5–6 minutes. Transfer half to a plate for garnish."
      },
      {
        num: "02",
        title: "Toast the rice (Tostatura)",
        text: "Add minced shallot and remaining butter to pan. Tip in rice and toast over medium heat for 2 minutes until grains are translucent at the edges and smell nutty."
      },
      {
        num: "03",
        title: "Deglaze & ladle stock",
        text: "Pour in white wine; let it hiss and absorb completely. Begin adding warm stock 1 ladle at a time, stirring gently as the rice releases its silky starches, 18 minutes."
      },
      {
        num: "04",
        title: "Mantecatura finish",
        text: "Remove from heat when rice is tender-firm. Beat vigorously with cold butter, Parmigiano, and fresh thyme until wavy and glossy ('all'onda'). Crown with reserved seared mushrooms."
      }
    ]
  }
};

CANONICAL_RECIPES["fettuccine alfredo"] = CANONICAL_RECIPES["classic fettuccine alfredo"];
CANONICAL_RECIPES["fettuccine"] = CANONICAL_RECIPES["classic fettuccine alfredo"];
CANONICAL_RECIPES["alfredo"] = CANONICAL_RECIPES["classic fettuccine alfredo"];
CANONICAL_RECIPES["taco"] = CANONICAL_RECIPES["crispy street-style tacos"];
CANONICAL_RECIPES["tacos"] = CANONICAL_RECIPES["crispy street-style tacos"];
CANONICAL_RECIPES["street tacos"] = CANONICAL_RECIPES["crispy street-style tacos"];
CANONICAL_RECIPES["pizza"] = CANONICAL_RECIPES["artisan skillet margherita pizza"];
CANONICAL_RECIPES["margherita"] = CANONICAL_RECIPES["artisan skillet margherita pizza"];
CANONICAL_RECIPES["margherita pizza"] = CANONICAL_RECIPES["artisan skillet margherita pizza"];
CANONICAL_RECIPES["salmon"] = CANONICAL_RECIPES["crispy pan-seared salmon"];
CANONICAL_RECIPES["pan-seared salmon"] = CANONICAL_RECIPES["crispy pan-seared salmon"];
CANONICAL_RECIPES["risotto"] = CANONICAL_RECIPES["creamy wild mushroom risotto"];
CANONICAL_RECIPES["mushroom risotto"] = CANONICAL_RECIPES["creamy wild mushroom risotto"];

// Dietary Preference Variations Configuration
const DIET_CONFIG = {
  standard: {
    label: "House Method",
    pill: "",
    toast: "Restored to House Method standard."
  },
  healthier: {
    label: "🥗 Healthier",
    pill: "🥗 HEALTHIER PROFILE • BALANCED EMULSION",
    toast: "Adapted to Healthier Version: reduced saturated fats, elevated greens & fiber."
  },
  jain: {
    label: "🌱 Jain",
    pill: "🌱 JAIN COMPLIANT • ZERO ONION/GARLIC",
    toast: "Adapted to Jain Version: strictly zero onion, garlic, or root crops. Hing & cumin infused."
  },
  vegetarian: {
    label: "🌿 Vegetarian",
    pill: "🌿 100% VEGETARIAN • PLANT & DAIRY",
    toast: "Adapted to 100% Vegetarian: all animal stocks & meats replaced."
  },
  vegan: {
    label: "🥑 Vegan",
    pill: "🥑 100% PLANT-BASED • DAIRY-FREE",
    toast: "Adapted to Vegan Version: 100% plant-based cream, oils, & botanicals."
  },
  glutenfree: {
    label: "🌾 Gluten-Free",
    pill: "🌾 GLUTEN-FREE • CERTIFIED GRAINS",
    toast: "Adapted to Gluten-Free Version: zero wheat, barley, or rye."
  }
};

// ==========================================================================
// Culinary Calendar & Recipe of the Day System
// ==========================================================================
const CULINARY_CALENDAR = {
  // Special Annual Calendar Dates (MM-DD)
  dates: {
    "01-01": {
      dish: "golden chickpea skillet",
      title: "Black-Eyed Pea & Greens Skillet",
      badge: "🎉 NEW YEAR'S TRADITION",
      reason: "New Year Hearth · Symbolic golden legumes & tender greens for good fortune and vitality."
    },
    "01-17": {
      dish: "artisan skillet margherita pizza",
      title: "Artisan Skillet Margherita Pizza",
      badge: "🍕 WORLD PIZZA DAY",
      reason: "World Pizza Day (Sant'Antonio Abate) · Honoring the Italian craft of blistered crust, sweet San Marzano & basil."
    },
    "02-09": {
      dish: "artisan skillet margherita pizza",
      title: "Artisan Skillet Margherita Pizza",
      badge: "🍕 NATIONAL PIZZA DAY",
      reason: "National Pizza Day · High-heat skillet sear, fragrant basil, sweet tomato and bubbling mozzarella."
    },
    "02-14": {
      dish: "classic fettuccine alfredo",
      title: "Classic Fettuccine Alfredo",
      badge: "❤️ VALENTINE'S ROMANCE",
      reason: "Valentine's Italian Feast · Silky mantecatura emulsion of golden butter & aged Parmigiano-Reggiano."
    },
    "03-14": {
      dish: "golden chickpea skillet",
      title: "Savory Vegetable Pot Pie Skillet",
      badge: "🥧 PI DAY (3.14)",
      reason: "Pi Day Culinary Celebration · Flaky golden crust over fragrant aromatics and simmered vegetables."
    },
    "03-17": {
      dish: "golden chickpea skillet",
      title: "Irish Colcannon & Leek Skillet",
      badge: "☘️ ST. PATRICK'S DAY",
      reason: "St. Patrick's Celebration · Velvet braised potatoes, cabbage, sweet leeks & browned butter."
    },
    "05-05": {
      dish: "crispy street-style tacos",
      title: "Crispy Street-Style Tacos",
      badge: "🌮 CINCO DE MAYO",
      reason: "Cinco de Mayo Fiesta · Warm charred tortillas, smoky toasted cumin, fresh pico and zesty lime."
    },
    "10-25": {
      dish: "classic fettuccine alfredo",
      title: "Classic Fettuccine Alfredo",
      badge: "🍝 WORLD PASTA DAY",
      reason: "World Pasta Day · Celebrating centuries of hand-crafted pasta and the pure mastery of starchy water emulsion."
    },
    "10-31": {
      dish: "creamy wild mushroom risotto",
      title: "Roasted Harvest Mushroom Risotto",
      badge: "🎃 HALLOWEEN HARVEST",
      reason: "Autumn Hearth Special · Earthy caramelized mushrooms, fragrant sage and comforting velvety rice."
    },
    "11-03": {
      dish: "crispy street-style tacos",
      title: "Crispy Street-Style Tacos",
      badge: "🌮 TACO TUESDAY & WORLD SANDWICH DAY",
      reason: "Culinary Calendar Special · Blistered warm tortillas, lively fresh pico de gallo & fragrant lime."
    },
    "11-26": {
      dish: "golden chickpea skillet",
      title: "Cast-Iron Herb-Roasted Autumn Medley",
      badge: "🦃 THANKSGIVING HARVEST",
      reason: "Thanksgiving Kitchen Hearth · Golden roasted roots, fragrant rosemary & maple cider glaze."
    },
    "12-24": {
      dish: "crispy pan-seared salmon",
      title: "Crispy Pan-Seared Salmon",
      badge: "🐟 CHRISTMAS EVE FEAST",
      reason: "Feast of the Seven Fishes Tradition · Crackling golden skin basted in aromatic lemon-thyme butter."
    },
    "12-31": {
      dish: "classic fettuccine alfredo",
      title: "Classic Fettuccine Alfredo",
      badge: "✨ NEW YEAR'S EVE GALA",
      reason: "New Year's Eve Kitchen Celebration · Rich, velvety Parmigiano silk to ring in the celebration."
    }
  },

  // Weekday Traditions (Day 0 = Sunday, 1 = Monday, ..., 6 = Saturday)
  weekdays: [
    {
      day: 0,
      name: "Sunday",
      dish: "classic fettuccine alfredo",
      title: "Classic Fettuccine Alfredo",
      badge: "🍝 SUNDAY RITUAL",
      reason: "Sunday Italian Tradition · Gathering around the table with slow emulsion and velvety Parmigiano comfort."
    },
    {
      day: 1,
      name: "Monday",
      dish: "golden chickpea skillet",
      title: "Golden Chickpea Skillet",
      badge: "🌱 MEATLESS MONDAY",
      reason: "Global Meatless Monday · Forgiving plant protein, warm bloomed turmeric and bright fresh lemon."
    },
    {
      day: 2,
      name: "Tuesday",
      dish: "crispy street-style tacos",
      title: "Crispy Street-Style Tacos",
      badge: "🌮 TACO TUESDAY",
      reason: "Taco Tuesday Tradition · Charred tortillas, vibrant pico de gallo, smoky spices & fresh lime."
    },
    {
      day: 3,
      name: "Wednesday",
      dish: "rustic tomato shakshuka",
      title: "Rustic Tomato Shakshuka",
      badge: "🍳 MIDWEEK COMFORT",
      reason: "Midweek Hearth Reset · Gently poached eggs nestled in spiced, slow-simmered pepper tomato gravy."
    },
    {
      day: 4,
      name: "Thursday",
      dish: "creamy garlic pasta",
      title: "Creamy Garlic Butter Pasta",
      badge: "🧄 THURSDAY CRAVING",
      reason: "15-Minute Skillet Magic · Toasted sweet garlic, cracked black pepper and velvety gloss."
    },
    {
      day: 5,
      name: "Friday",
      dish: "crispy pan-seared salmon",
      title: "Crispy Pan-Seared Salmon",
      badge: "🐟 FRIDAY SPECIAL",
      reason: "Friday Catch Tradition · Blistered crackling skin, lemon herb butter and tender flaky center."
    },
    {
      day: 6,
      name: "Saturday",
      dish: "artisan skillet margherita pizza",
      title: "Artisan Skillet Margherita Pizza",
      badge: "🍕 SATURDAY PROJECT",
      reason: "Weekend Kitchen Craft · High-heat blistered crust, fragrant basil and bubbling melted mozzarella."
    }
  ],

  // Rotation vault for random rolls and surprise exploration
  vault: [
    {
      dish: "crispy street-style tacos",
      title: "Crispy Street-Style Tacos",
      badge: "🌮 CHEF'S ROTATION",
      reason: "Charred street-style tortillas, fiery salsa fresca & bright citrus zest."
    },
    {
      dish: "golden chickpea skillet",
      title: "Golden Chickpea Skillet",
      badge: "✨ ONE-PAN MASTERCLASS",
      reason: "Forgiving weeknight hero · Nutty chickpeas, sweet slumped tomatoes & turmeric gold."
    },
    {
      dish: "classic fettuccine alfredo",
      title: "Classic Fettuccine Alfredo",
      badge: "🍝 ROMAN EMULSION",
      reason: "Pure Italian physics · Glossy mantle of churned butter & 24-month aged Parmigiano."
    },
    {
      dish: "rustic tomato shakshuka",
      title: "Rustic Tomato Shakshuka",
      badge: "🍳 NORTH AFRICAN HEARTH",
      reason: "Silk yolks, charred sweet bell peppers, toasted cumin & warm pita."
    },
    {
      dish: "creamy garlic pasta",
      title: "Creamy Garlic Butter Pasta",
      badge: "🧄 FAST COMFORT",
      reason: "Gently caramelized sliced garlic, peppery parsley & silky reduction in 15 minutes."
    },
    {
      dish: "artisan skillet margherita pizza",
      title: "Artisan Skillet Margherita Pizza",
      badge: "🍕 CAST-IRON CRAFT",
      reason: "Neapolitan leopard spotting achieved without a wood-fired oven."
    },
    {
      dish: "crispy pan-seared salmon",
      title: "Crispy Pan-Seared Salmon",
      badge: "🐟 SEAFOOD PRECISION",
      reason: "Shatteringly crisp skin, tender medium-rare flesh, and foaming lemon-thyme butter."
    },
    {
      dish: "creamy wild mushroom risotto",
      title: "Creamy Wild Mushroom Risotto",
      badge: "🍄 ARBORIO RITUAL",
      reason: "Slowly coaxed starches, browned wild cremini, dry white wine & herb finish."
    }
  ]
};

let currentRotdDish = null;

function getRecipeOfTheDay(customDate) {
  const d = customDate || new Date();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const mmdd = `${month}-${day}`;
  const dayOfWeek = d.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

  // 1. Check Special Annual Calendar Dates first
  if (CULINARY_CALENDAR.dates[mmdd]) {
    return {
      ...CULINARY_CALENDAR.dates[mmdd],
      type: "special-date",
      dateFormatted: d.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })
    };
  }

  // 2. Check Weekday Traditions
  const weekdaySpecial = CULINARY_CALENDAR.weekdays.find(w => w.day === dayOfWeek);
  if (weekdaySpecial) {
    return {
      ...weekdaySpecial,
      type: "weekday",
      dateFormatted: d.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })
    };
  }

  // 3. Fallback to vault item based on day of month
  const vaultIndex = (d.getDate() + d.getMonth()) % CULINARY_CALENDAR.vault.length;
  const vaultItem = CULINARY_CALENDAR.vault[vaultIndex];
  return {
    ...vaultItem,
    type: "vault",
    dateFormatted: d.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })
  };
}

function renderRecipeOfTheDay(rotd) {
  if (!rotd) return;
  currentRotdDish = rotd;

  const badgeTextEl = document.getElementById("rotd-badge-text");
  const dateEl = document.getElementById("rotd-date");
  const titleEl = document.getElementById("rotd-title");
  const reasonEl = document.getElementById("rotd-reason");
  const cardEl = document.getElementById("rotd-card");

  if (badgeTextEl) badgeTextEl.textContent = rotd.badge || "TODAY'S SPECIAL";
  if (dateEl) dateEl.textContent = rotd.dateFormatted || new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });
  if (titleEl) titleEl.textContent = rotd.title || rotd.dish;
  if (reasonEl) reasonEl.textContent = rotd.reason || "Curated kitchen master method.";

  if (cardEl) {
    cardEl.classList.remove("is-shuffling");
    void cardEl.offsetWidth; // trigger reflow
    cardEl.classList.add("is-shuffling");
  }
}

function initRecipeOfTheDay() {
  const rotd = getRecipeOfTheDay();
  renderRecipeOfTheDay(rotd);

  const cookBtn = document.getElementById("rotd-cook-btn");
  const shuffleBtn = document.getElementById("rotd-shuffle-btn");

  if (cookBtn) {
    cookBtn.addEventListener("click", () => {
      if (!currentRotdDish) return;
      dishInput.value = currentRotdDish.dish || currentRotdDish.title;
      presetPills.forEach(p => p.classList.remove("active"));
      triggerAnalysis();
    });
  }

  if (shuffleBtn) {
    shuffleBtn.addEventListener("click", () => {
      // Pick random different dish from vault
      const currentTitle = currentRotdDish?.title || "";
      const candidates = CULINARY_CALENDAR.vault.filter(v => v.title !== currentTitle);
      const picked = candidates[Math.floor(Math.random() * candidates.length)] || CULINARY_CALENDAR.vault[0];
      
      const newRotd = {
        ...picked,
        type: "surprise",
        badge: picked.badge || "🎲 CHEF'S SURPRISE",
        dateFormatted: new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })
      };

      renderRecipeOfTheDay(newRotd);
      showToast(`🎲 Rolled: ${newRotd.title} · Click "Cook today" to reveal!`);
    });
  }
}

// Application State: Starts in 'initial' state (Waiting on your clue)
let currentState = "initial"; 
let currentVariant = "standard";
let baseMasterRecipe = CANONICAL_RECIPES["golden chickpea skillet"];
let activeRecipe = CANONICAL_RECIPES["golden chickpea skillet"];
let uploadedImageBase64 = null;
let uploadedImageMime = null;
let mediaStream = null;

function transformRecipeForVariant(recipe, variant) {
  if (!recipe || !variant || variant === "standard") {
    return recipe;
  }

  // 1. If explicit pre-crafted variant exists, return it!
  if (recipe.variants && recipe.variants[variant]) {
    const v = JSON.parse(JSON.stringify(recipe.variants[variant]));
    v.variants = recipe.variants;
    v.originalTitle = recipe.title;
    return v;
  }

  // 2. Intelligent dynamic adaptation for AI-generated and generic dishes
  const cloned = JSON.parse(JSON.stringify(recipe));
  cloned.variants = recipe.variants || {};
  cloned.originalTitle = recipe.originalTitle || recipe.title;

  if (variant === "jain") {
    cloned.title = `${cloned.originalTitle} (Jain Version)`;
    cloned.description = `Formulated strictly without onion, garlic, or underground root crops. Aromatic hing (asafoetida) and blooming cumin impart rich savory depth.`;
    
    // Filter root vegetables and alliums
    const forbidden = ["onion", "garlic", "shallot", "leek", "potato", "carrot", "radish", "ginger", "beetroot"];
    cloned.gather = (cloned.gather || []).filter(item => {
      const lower = item.name.toLowerCase();
      return !forbidden.some(f => lower.includes(f));
    });
    cloned.gather.unshift({ name: "compounded asafoetida (hing)", qty: "⅛ tsp (bloomed)", checked: true, optional: false });
    cloned.gather.unshift({ name: "whole cumin seeds", qty: "½ tsp", checked: true, optional: false });

    // Update chips
    cloned.chips = (cloned.chips || []).filter(chip => {
      const lower = chip.name.toLowerCase();
      return !forbidden.some(f => lower.includes(f));
    });
    cloned.chips.unshift({ name: "asafoetida (hing)", type: "gold" });
    cloned.chips.unshift({ name: "cumin", type: "gold" });

    // Adapt step 1 to bloom hing/cumin
    if (cloned.steps && cloned.steps[0]) {
      cloned.steps[0].title = "Bloom sacred aromatics";
      cloned.steps[0].text = "Heat oil in the pan over medium heat. Sizzle cumin seeds and a pinch of hing (asafoetida) for 20 seconds to release deep allium-free savory warmth before adding base ingredients.";
    }
  } else if (variant === "healthier") {
    cloned.title = `Lightened ${cloned.originalTitle}`;
    cloned.description = `Refined with lower saturated fats, elevated vegetable volume, and clean wholesome balance.`;
    cloned.gather = (cloned.gather || []).map(i => {
      const lower = i.name.toLowerCase();
      if (lower.includes("butter")) return { ...i, qty: "1–2 tbsp cold butter" };
      if (lower.includes("heavy cream") || lower.includes("heavy whipping cream")) {
        return { name: "light single cream or starchy cooking emulsion", qty: "½ cup" };
      }
      if (lower.includes("oil")) return { ...i, qty: "1 tbsp cold-pressed olive oil" };
      return i;
    });
    cloned.gather.push({ name: "tender baby spinach or greens", qty: "2 cups", checked: true, optional: false });
    cloned.chips = cloned.chips || [];
    cloned.chips.push({ name: "baby greens", type: "gold" });
  } else if (variant === "vegetarian") {
    cloned.title = `Vegetarian ${cloned.originalTitle}`;
    const meats = ["chicken", "beef", "pork", "steak", "bacon", "salmon", "fish", "shrimp", "seafood", "prawn", "trout", "cod", "clam", "meat"];
    cloned.gather = (cloned.gather || []).map(i => {
      const lower = i.name.toLowerCase();
      if (meats.some(m => lower.includes(m))) {
        return { name: "marinated paneer or firm tofu cubes", qty: "250 g", checked: true, optional: false };
      }
      return i;
    });
    cloned.chips = (cloned.chips || []).map(c => {
      const lower = c.name.toLowerCase();
      if (meats.some(m => lower.includes(m))) {
        return { name: "paneer / tofu", type: "gold" };
      }
      return c;
    });
  } else if (variant === "vegan") {
    cloned.title = `Plant-Based ${cloned.originalTitle}`;
    cloned.gather = (cloned.gather || []).map(i => {
      const lower = i.name.toLowerCase();
      if (lower.includes("butter")) return { name: "extra virgin olive oil or plant butter", qty: i.qty };
      if (lower.includes("heavy cream") || lower.includes("cream")) return { name: "silky cashew cream or oat milk", qty: i.qty };
      if (lower.includes("cheese") || lower.includes("parmigiano") || lower.includes("feta")) {
        return { name: "fortified nutritional yeast or vegan cheese", qty: i.qty };
      }
      if (lower.includes("egg")) return { name: "silken tofu slices or chickpea scramble", qty: "200 g" };
      return i;
    });
  } else if (variant === "glutenfree") {
    cloned.title = `Gluten-Free ${cloned.originalTitle}`;
    cloned.gather = (cloned.gather || []).map(i => {
      const lower = i.name.toLowerCase();
      if (lower.includes("pasta") || lower.includes("fettuccine") || lower.includes("spaghetti") || lower.includes("noodles")) {
        return { name: `certified gluten-free ${i.name}`, qty: i.qty };
      }
      if (lower.includes("flour") || lower.includes("breadcrumbs")) {
        return { name: "gluten-free chickpea or almond flour", qty: i.qty };
      }
      return i;
    });
  }

  return cloned;
}

function applyDietaryVariant(variant, skipToast = false) {
  currentVariant = variant;

  // Sync Section 01 Hero pills
  document.querySelectorAll(".diet-pill").forEach(p => {
    p.classList.toggle("active", p.dataset.variant === variant);
  });
  const inputBadge = document.getElementById("input-diet-badge");
  if (inputBadge) {
    inputBadge.textContent = DIET_CONFIG[variant]?.label || "House Method";
  }

  // Sync Section 03 Method dock buttons
  document.querySelectorAll(".method-diet-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.variant === variant);
  });

  // Sync Section 02 top row pill
  const dietVariantPill = document.getElementById("diet-variant-pill");
  if (dietVariantPill) {
    if (variant === "standard" || !DIET_CONFIG[variant]?.pill) {
      dietVariantPill.style.display = "none";
      dietVariantPill.textContent = "";
    } else {
      dietVariantPill.style.display = "inline-flex";
      dietVariantPill.textContent = DIET_CONFIG[variant].pill;
    }
  }

  // If currently analyzed, immediately transform active recipe and re-render
  if (currentState === "analyzed" && baseMasterRecipe) {
    activeRecipe = transformRecipeForVariant(baseMasterRecipe, variant);
    renderRecipe(activeRecipe);
    if (!skipToast) {
      showToast(DIET_CONFIG[variant]?.toast || `Switched to ${variant} version.`);
    }
  }
}

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
const servingsDecBtn = document.getElementById("servings-dec-btn");
const servingsIncBtn = document.getElementById("servings-inc-btn");
const gatherList = document.getElementById("gather-list");
const stepsList = document.getElementById("steps-list");
const stepsProgressCounter = document.getElementById("steps-progress-counter");
const stepsProgressBar = document.getElementById("steps-progress-bar");
const copyMethodBtn = document.getElementById("copy-method-btn");
const printRecipeBtn = document.getElementById("print-recipe-btn");

// Toast & Timer Dock Elements
const kitchenToast = document.getElementById("kitchen-toast");
const floatingTimerDock = document.getElementById("floating-timer-dock");
const timerDockLabel = document.getElementById("timer-dock-label");
const timerDockTime = document.getElementById("timer-dock-time");
const timerDockToggle = document.getElementById("timer-dock-toggle");
const timerDockClose = document.getElementById("timer-dock-close");

// UI State & Timer Variables
let currentServings = 2;
let baseServings = 2;
let activeTimerInterval = null;
let activeTimerRemaining = 0;
let isTimerPaused = false;
let toastTimeout = null;

// Haptic & Sensory UI Feedback Helpers
function showToast(message) {
  if (!kitchenToast) return;
  kitchenToast.textContent = message;
  kitchenToast.classList.add("show");
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    kitchenToast.classList.remove("show");
  }, 2600);
}

function playKitchenChime() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5
    gain.gain.setValueAtTime(0.35, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 1.2);
  } catch (e) {}
}

function triggerCelebration() {
  try {
    if (typeof confetti === "function") {
      confetti({
        particleCount: 50,
        spread: 65,
        origin: { y: 0.65 },
        colors: ["#D4A23A", "#E2BF65", "#F6F4EF", "#3E6F48"]
      });
    }
  } catch (e) {}
}

function scaleQuantityString(qtyStr, ratio) {
  if (!qtyStr || ratio === 1) return qtyStr;
  return qtyStr.replace(/(\d*\.?\d+|\d+½|½|¼|¾)/g, (match) => {
    let val = 0;
    if (match === "½") val = 0.5;
    else if (match === "¼") val = 0.25;
    else if (match === "¾") val = 0.75;
    else if (match.includes("½")) val = parseFloat(match) + 0.5;
    else val = parseFloat(match);
    if (isNaN(val)) return match;
    const scaled = Math.round(val * ratio * 10) / 10;
    return scaled % 1 === 0 ? scaled.toString() : scaled.toFixed(1);
  });
}

function extractTimeInSeconds(text) {
  if (!text) return null;
  const minMatch = text.match(/(\d+)(?:\s*[–-]\s*\d+)?\s*(?:minutes|minute|min)/i);
  if (minMatch) {
    return { seconds: parseInt(minMatch[1], 10) * 60, display: `${minMatch[1]}m` };
  }
  const secMatch = text.match(/(\d+)\s*(?:seconds|second|sec)/i);
  if (secMatch) {
    return { seconds: parseInt(secMatch[1], 10), display: `${secMatch[1]}s` };
  }
  return null;
}

function startKitchenTimer(seconds, label) {
  clearInterval(activeTimerInterval);
  activeTimerRemaining = seconds;
  isTimerPaused = false;
  if (floatingTimerDock) floatingTimerDock.style.display = "block";
  if (timerDockLabel) timerDockLabel.textContent = label || "Step Timer";
  if (timerDockToggle) timerDockToggle.textContent = "PAUSE";
  updateTimerDockDisplay();
  showToast(`Timer started: ${label}`);

  activeTimerInterval = setInterval(() => {
    if (!isTimerPaused) {
      activeTimerRemaining--;
      updateTimerDockDisplay();
      if (activeTimerRemaining <= 0) {
        clearInterval(activeTimerInterval);
        playKitchenChime();
        showToast(`⏱ Timer completed for ${label}!`);
        if (timerDockTime) timerDockTime.textContent = "00:00 DONE!";
        if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
      }
    }
  }, 1000);
}

function formatMinutes(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

function updateTimerDockDisplay() {
  if (timerDockTime) {
    timerDockTime.textContent = formatMinutes(activeTimerRemaining);
  }
}

function updateStepProgress() {
  const allCards = stepsList.querySelectorAll(".step-card");
  const total = allCards.length;
  const completed = stepsList.querySelectorAll(".step-card.is-step-completed").length;
  if (stepsProgressCounter) {
    stepsProgressCounter.textContent = `${completed} of ${total} steps completed`;
  }
  if (stepsProgressBar) {
    const percent = total > 0 ? (completed / total) * 100 : 0;
    stepsProgressBar.style.width = `${percent}%`;
  }
}

function formatRecipeForClipboard(recipe, servings) {
  let text = `${recipe.title}\n${recipe.description}\n\n`;
  text += `Servings: ${servings} · Time: ${recipe.minutes || 25} MIN · Difficulty: ${recipe.difficulty || "EASY"}\n\n`;
  text += `GATHER:\n`;
  (recipe.gather || []).forEach(item => {
    const qty = scaleQuantityString(item.qty, servings / baseServings);
    text += `- ${item.name} (${qty})${item.optional ? " [Optional]" : ""}\n`;
  });
  text += `\nDO THIS:\n`;
  (recipe.steps || []).forEach(step => {
    text += `${step.num}. ${step.title}: ${step.text}\n`;
  });
  text += `\nRecipeMethods — Kitchen Companion. A method, not a guess.`;
  return text;
}

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
  initRecipeOfTheDay();

  // Support direct deep-link or preview query parameter (?dish=...&variant=...)
  const urlParams = new URLSearchParams(window.location.search);
  const paramDish = urlParams.get("dish");
  const paramVariant = urlParams.get("variant");
  if (paramVariant) {
    applyDietaryVariant(paramVariant.toLowerCase(), true);
  }
  if (paramDish) {
    dishInput.value = paramDish;
    triggerAnalysis(true);
  }
});

function bindEvents() {
  // Form submission (handles Enter key across all devices and browsers)
  const recipeForm = document.getElementById("recipe-form");
  if (recipeForm) {
    recipeForm.addEventListener("submit", (e) => {
      e.preventDefault();
      triggerAnalysis();
    });
  }

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
  submitBtn.addEventListener("click", (e) => {
    e.preventDefault();
    triggerAnalysis();
  });

  // Enter key inside dish input
  dishInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.keyCode === 13 || e.which === 13) {
      e.preventDefault();
      triggerAnalysis();
    }
  });

  // Dietary toggle pills in Hero Card (Section 01)
  const dietPills = document.querySelectorAll(".diet-pill");
  dietPills.forEach(pill => {
    pill.addEventListener("click", () => {
      const variant = pill.dataset.variant || "standard";
      applyDietaryVariant(variant);
    });
  });

  // Dietary adaptation buttons in Method Dock (Section 03)
  const methodDietBtns = document.querySelectorAll(".method-diet-btn");
  methodDietBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const variant = btn.dataset.variant || "standard";
      applyDietaryVariant(variant);
    });
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
    applyDietaryVariant("standard", true);
    currentServings = 2;
    clearInterval(activeTimerInterval);
    if (floatingTimerDock) floatingTimerDock.style.display = "none";
    dishInput.focus();
    window.scrollTo({ top: 0, behavior: "smooth" });
    showToast("Kitchen reset to starting clue.");
  });

  // Servings Stepper Handlers
  if (servingsDecBtn) {
    servingsDecBtn.addEventListener("click", () => {
      if (currentServings > 1) {
        currentServings--;
        renderServingsAndIngredients(activeRecipe);
        showToast(`Recipe scaled to ${currentServings} servings`);
      }
    });
  }
  if (servingsIncBtn) {
    servingsIncBtn.addEventListener("click", () => {
      if (currentServings < 12) {
        currentServings++;
        renderServingsAndIngredients(activeRecipe);
        showToast(`Recipe scaled to ${currentServings} servings`);
      }
    });
  }

  // Method Action Buttons
  if (copyMethodBtn) {
    copyMethodBtn.addEventListener("click", () => {
      const clipText = formatRecipeForClipboard(activeRecipe, currentServings);
      navigator.clipboard.writeText(clipText).then(() => {
        showToast("Method copied to kitchen clipboard ✓");
      }).catch(() => {
        showToast("Recipe method formatted!");
      });
    });
  }
  if (printRecipeBtn) {
    printRecipeBtn.addEventListener("click", () => window.print());
  }

  // Floating Timer Controls
  if (timerDockToggle) {
    timerDockToggle.addEventListener("click", () => {
      isTimerPaused = !isTimerPaused;
      timerDockToggle.textContent = isTimerPaused ? "RESUME" : "PAUSE";
      showToast(isTimerPaused ? "Timer paused" : "Timer resumed");
    });
  }
  if (timerDockClose) {
    timerDockClose.addEventListener("click", () => {
      clearInterval(activeTimerInterval);
      if (floatingTimerDock) floatingTimerDock.style.display = "none";
    });
  }

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
function setAppState(state, dishName) {
  currentState = state;
  const dietVariantPill = document.getElementById("diet-variant-pill");
  if (state === "initial") {
    bodyEl.classList.remove("state-analyzed");
    bodyEl.classList.add("state-initial");
    readHeading.textContent = "See what comes next.";
    visualTagText.textContent = "A USEFUL FIRST MOVE";
    btnText.textContent = "Reveal the recipe";
    if (dietVariantPill) {
      dietVariantPill.style.display = "none";
      dietVariantPill.textContent = "";
    }
    // Bring image back to default wood board vector
    updateSmallWindowImage("", "initial");
  } else {
    bodyEl.classList.remove("state-initial");
    bodyEl.classList.add("state-analyzed");
    readHeading.textContent = "A method, not a guess.";
    visualTagText.textContent = "HOUSE METHOD · READY";
    btnText.textContent = "Analyze again";
    if (dietVariantPill) {
      if (currentVariant === "standard" || !DIET_CONFIG[currentVariant]?.pill) {
        dietVariantPill.style.display = "none";
        dietVariantPill.textContent = "";
      } else {
        dietVariantPill.style.display = "inline-flex";
        dietVariantPill.textContent = DIET_CONFIG[currentVariant].pill;
      }
    }
    // Show the dish photo on the left side of the text!
    const dish = dishName || activeRecipe?.title || dishInput.value;
    updateSmallWindowImage(dish, "analyzed");
    triggerCelebration();
  }
}

// Curated Food Photography Dictionary for Small Window
const DISH_PHOTO_MAP = [
  { match: ["fettuccine", "alfredo", "classic fettuccine alfredo", "carbonara", "cream pasta", "white pasta"], url: "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&w=900&q=80" },
  { match: ["chickpea", "golden chickpea", "chickpea skillet", "hummus", "chana"], url: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=900&q=80" },
  { match: ["shakshuka", "shakshouka", "egg", "eggs", "poached egg", "frittata", "omelet"], url: "https://images.unsplash.com/photo-1590412200988-a436970781fa?auto=format&fit=crop&w=900&q=80" },
  { match: ["garlic pasta", "creamy garlic pasta", "aglio e olio", "spaghetti", "pasta", "noodles", "linguine", "penne", "rigatoni", "lasagna", "bolognese", "marinara", "pesto"], url: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=900&q=80" },
  { match: ["salmon", "crispy pan-seared salmon", "pan-seared salmon", "fish", "trout", "fillet", "cod", "sea bass", "halibut", "tuna"], url: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=900&q=80" },
  { match: ["shrimp", "prawn", "seafood", "lobster", "crab", "calamari", "scallops"], url: "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=900&q=80" },
  { match: ["curry", "tikka", "masala", "butter chicken", "paneer", "korma", "dal"], url: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=900&q=80" },
  { match: ["pizza", "flatbread", "focaccia", "margherita", "pepperoni"], url: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=900&q=80" },
  { match: ["burger", "sandwich", "patty", "cheeseburger", "slider", "blt"], url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80" },
  { match: ["taco", "tacos", "fajita", "burrito", "quesadilla", "mexican", "enchilada"], url: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=900&q=80" },
  { match: ["salad", "greens", "caesar", "avocado", "greek salad", "kale"], url: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=80" },
  { match: ["soup", "stew", "chowder", "broth", "ramen", "pho", "noodle soup", "minestrone"], url: "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=900&q=80" },
  { match: ["rice", "risotto", "biryani", "fried rice", "paella", "pilaf"], url: "https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?auto=format&fit=crop&w=900&q=80" },
  { match: ["steak", "beef", "meat", "ribeye", "sirloin", "roast", "brisket"], url: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=900&q=80" },
  { match: ["chicken", "wings", "roast chicken", "fried chicken", "chicken breast"], url: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=900&q=80" },
  { match: ["cake", "dessert", "cookie", "pie", "chocolate", "pancake", "waffle", "brownie"], url: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=900&q=80" },
  { match: ["bread", "toast", "sourdough", "bagel", "croissant"], url: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=80" },
  { match: ["tofu", "vegan", "vegetarian", "bowl", "stir fry"], url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=80" }
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

function updateSmallWindowImage(dishName, explicitState) {
  const visualRecipeImg = document.getElementById("visual-recipe-img");
  const woodBoard = document.getElementById("wood-board");
  if (!visualRecipeImg || !woodBoard) return;

  const state = explicitState || currentState;

  if (state === "initial") {
    visualRecipeImg.style.display = "none";
    visualRecipeImg.src = "";
    woodBoard.style.display = "flex";
    return;
  }

  // Analyzed state: ALWAYS show a real, gorgeous food photo on the left of the text!
  const photo = getDishPhoto(dishName) || "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80";
  visualRecipeImg.src = photo;
  visualRecipeImg.alt = dishName || "Recipe visual";
  visualRecipeImg.style.display = "block";
  woodBoard.style.display = "none";
}

// Render Gather list with dynamic servings multiplier
function renderServingsAndIngredients(recipe) {
  if (!recipe || !gatherList) return;
  if (statServings) statServings.textContent = currentServings;
  gatherList.innerHTML = "";
  const ratio = currentServings / baseServings;

  (recipe.gather || []).forEach((item) => {
    const row = document.createElement("div");
    row.className = `ingredient-row ${item.checked ? "checked" : ""} ${item.optional ? "is-optional" : ""}`;
    const scaledQty = scaleQuantityString(item.qty, ratio);
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
      <span class="ingredient-qty">${scaledQty}</span>
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
}

// Render Recipe Data into the UI
function renderRecipe(recipe) {
  // Update the small window with picture of the typed recipe if analyzed
  if (currentState === "analyzed") {
    updateSmallWindowImage(recipe.title || dishInput.value, "analyzed");
  }

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

  // Set base servings and render adaptive ingredient list
  let rawServings = recipe.servings || "2";
  let firstDigit = parseInt(rawServings.toString().match(/\d+/)?.[0] || "2", 10);
  baseServings = firstDigit || 2;
  currentServings = baseServings;
  renderServingsAndIngredients(recipe);

  // Steps list with interactive checkmarks and timers
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

    // Step completion toggle on click
    card.addEventListener("click", (e) => {
      if (e.target.closest(".step-timer-pill")) return;
      card.classList.toggle("is-step-completed");
      updateStepProgress();
    });

    // Detect time and inject Timer button
    const timeObj = extractTimeInSeconds(step.text);
    if (timeObj) {
      const timerBtn = document.createElement("button");
      timerBtn.type = "button";
      timerBtn.className = "step-timer-pill";
      timerBtn.innerHTML = `⏱ Start ${timeObj.display} Timer`;
      timerBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        startKitchenTimer(timeObj.seconds, `${step.num} ${step.title}`);
      });
      card.querySelector(".step-content").appendChild(timerBtn);
    }

    stepsList.appendChild(card);
  });

  updateStepProgress();
}

// Trigger Analysis: Analyzes first, then reveals the recipe!
async function triggerAnalysis(immediate = false) {
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
    // Check canonical matches first (Golden chickpea skillet, Shakshuka, Pasta, Fettuccine Alfredo, etc.)
    const matchedKey = Object.keys(CANONICAL_RECIPES).find(k => 
      query === k || query.includes(k) || k.includes(query)
    );
    if (!uploadedImageBase64 && matchedKey) {
      // Realistic brief culinary scanning delay unless immediate deep-link
      if (!immediate) {
        await new Promise(resolve => setTimeout(resolve, 600));
      }
      baseMasterRecipe = CANONICAL_RECIPES[matchedKey];
      activeRecipe = transformRecipeForVariant(baseMasterRecipe, currentVariant);
      setAppState("analyzed", activeRecipe.title);
      renderRecipe(activeRecipe);
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
        body: JSON.stringify({ dishName, imageBase64: imgBase64, imageMime: imgMime, variant: currentVariant })
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
      baseMasterRecipe = resultJson;
      activeRecipe = transformRecipeForVariant(baseMasterRecipe, currentVariant);
      setAppState("analyzed", activeRecipe.title);
      renderRecipe(activeRecipe);
      smoothScrollToMethod();
    } else {
      throw new Error("Could not parse recipe");
    }

  } catch (err) {
    console.warn("AI generation fallback to default skillet:", err);
    // Graceful fallback to golden chickpea skillet
    baseMasterRecipe = CANONICAL_RECIPES["golden chickpea skillet"];
    activeRecipe = transformRecipeForVariant(baseMasterRecipe, currentVariant);
    dishInput.value = "golden chickpea skillet";
    setAppState("analyzed", activeRecipe.title);
    renderRecipe(activeRecipe);
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
