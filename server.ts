import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

// Express configurations
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Lazy initializer for Google GenAI client
let aiClient: GoogleGenAI | null = null;
function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY is not defined. Please add your Gemini API Key in AI Studio Secrets settings.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Check api health and configurations
app.get("/api/config", (req, res) => {
  const hasGemini = !!process.env.GEMINI_API_KEY;
  const hasRapid = !!process.env.RAPID_API_KEY;
  res.json({
    hasGemini,
    hasRapid,
    message: hasRapid 
      ? "RapidAPI Integration Active via RAPID_API_KEY!"
      : "RapidAPI key not provided. TV Search will leverage Google Gemini real-world simulation fallback!"
  });
});

// RapidAPI TV Show Search Endpoint
app.post("/api/rapidapi/search", async (req, res) => {
  const { query } = req.body;
  if (!query) {
    return res.status(400).json({ error: "Query parameters are required." });
  }

  const rapidKey = process.env.RAPID_API_KEY;
  if (rapidKey) {
    try {
      console.log(`Querying RapidAPI movie database for: "${query}"`);
      const response = await fetch(
        `https://movie-database-alternative.p.rapidapi.com/?s=${encodeURIComponent(query)}&r=json`,
        {
          headers: {
            "x-rapidapi-key": rapidKey,
            "x-rapidapi-host": "movie-database-alternative.p.rapidapi.com",
          },
        }
      );
      const data = await response.json();
      
      if (data && data.Search) {
        const formatted = data.Search.map((show: any) => ({
          title: show.Title,
          year: show.Year,
          imdbId: show.imdbID,
          type: show.Type,
          poster: show.Poster && show.Poster !== "N/A" ? show.Poster : `https://picsum.photos/seed/${show.imdbID || "show"}/300/450`
        }));
        return res.json({ results: formatted });
      } else {
        return res.json({ results: [], error: data.Error || "No results found" });
      }
    } catch (err: any) {
      console.error("RapidAPI fetch failed, falling back to Gemini:", err.message);
    }
  }

  // Fallback: Query Gemini to simulate real-world TV shows matching the query
  try {
    const ai = getAiClient();
    const prompt = `Perform a realistic lookup for television shows matching the query "${query}".
Return a JSON array of up to 5 real-world television series that fit this name or style.
For the poster, either suggest a valid web URL or design a specific, high-quality picsum seed path of form "https://picsum.photos/seed/{UniqueSlug}/300/450".
Return exactly the schema specified.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            required: ["title", "year", "imdbId", "type", "poster"],
            properties: {
              title: { type: Type.STRING },
              year: { type: Type.STRING },
              imdbId: { type: Type.STRING },
              type: { type: Type.STRING },
              poster: { type: Type.STRING },
            },
          },
        },
      },
    });

    const text = response.text || "[]";
    const results = JSON.parse(text);
    res.json({ results, isFallback: true });
  } catch (err: any) {
    console.error("Gemini Fallback Search failed:", err);
    res.status(500).json({ error: "Failed to search TV shows.", details: err.message });
  }
});

// RapidAPI TV Show Details/Import Endpoint
app.post("/api/rapidapi/details", async (req, res) => {
  const { imdbId, title } = req.body;
  if (!imdbId && !title) {
    return res.status(400).json({ error: "imdbId or title is required." });
  }

  const rapidKey = process.env.RAPID_API_KEY;
  if (rapidKey && imdbId) {
    try {
      console.log(`Querying RapidAPI details for IMDB ID: ${imdbId}`);
      const response = await fetch(
        `https://movie-database-alternative.p.rapidapi.com/?i=${encodeURIComponent(imdbId)}&plot=full&r=json`,
        {
          headers: {
            "x-rapidapi-key": rapidKey,
            "x-rapidapi-host": "movie-database-alternative.p.rapidapi.com",
          },
        }
      );
      const data = await response.json();
      if (data && data.Response === "True") {
        return res.json({
          details: {
            title: data.Title,
            year: data.Year,
            rated: data.Rated,
            released: data.Released,
            runtime: data.Runtime,
            genre: data.Genre,
            director: data.Director,
            writer: data.Writer,
            actors: data.Actors,
            plot: data.Plot,
            poster: data.Poster && data.Poster !== "N/A" ? data.Poster : `https://picsum.photos/seed/${imdbId}/400/600`,
            imdbRating: data.imdbRating,
            imdbId: data.imdbID
          }
        });
      }
    } catch (err: any) {
      console.error("RapidAPI details failed, falling back to Gemini:", err.message);
    }
  }

  // Fallback: Ask Gemini to generate high-fidelity details of this real TV show
  try {
    const ai = getAiClient();
    const showQuery = imdbId ? `ID: ${imdbId}` : `Title: "${title}"`;
    const prompt = `Return a high-fidelity information dossier for the television series matching: ${showQuery}.
Be realistic and output accurate information about Director, Actors, Plot, Rating, etc.
For the poster, return a beautiful placeholder image path like "https://picsum.photos/seed/{UniqueTitle}/400/600".
Output standard JSON format matching the schema.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: [
            "title", "year", "rated", "released", "runtime", 
            "genre", "director", "writer", "actors", "plot", 
            "poster", "imdbRating", "imdbId"
          ],
          properties: {
            title: { type: Type.STRING },
            year: { type: Type.STRING },
            rated: { type: Type.STRING },
            released: { type: Type.STRING },
            runtime: { type: Type.STRING },
            genre: { type: Type.STRING },
            director: { type: Type.STRING },
            writer: { type: Type.STRING },
            actors: { type: Type.STRING },
            plot: { type: Type.STRING },
            poster: { type: Type.STRING },
            imdbRating: { type: Type.STRING },
            imdbId: { type: Type.STRING }
          }
        }
      }
    });

    const text = response.text || "{}";
    const details = JSON.parse(text);
    res.json({ details, isFallback: true });
  } catch (err: any) {
    console.error("Gemini Fallback Details failed:", err);
    res.status(500).json({ error: "Failed to fetch TV show details.", details: err.message });
  }
});

// Gemini core TV Show Creator Studio Endpoint
app.post("/api/show/generate", async (req, res) => {
  const { genre, tone, network, premise, protagonistDescription, customPrompt } = req.body;

  try {
    const ai = getAiClient();
    let prompt = `Create a brand new, highly creative, multi-season television show concept using the following criteria:
- **Genre**: ${genre || "Any/Fictional"}
- **Tone**: ${tone || "Dramatic and Inspiring"}
- **Target Network**: ${network || "Premium Cable (HBO Style)"}
- **Inspirational Premise**: ${premise || "Let your imagination run wild"}
- **Lead Protagonist Concept**: ${protagonistDescription || "Highly complex lead"}
${customPrompt ? `- **Additional User Instructions**: ${customPrompt}` : ""}

Ensure the output is deeply detailed, highly narrative, containing:
1. A unique, catchy title
2. A memorable promotional tagline
3. A gripping elevator pitch
4. A distinct visual and cinematographic style (colors, framing, pacing, setting)
5. 4 core characters: Name, clear Role/Archetype, cast Suggestion (famous real-world actors), detailed Personality profile, and a major narrative/dark Secret.
6. 5 highly detailed episodic arcs covering the 1st season sequence. Each episode should have a clear number, an intriguing title, a captivating synopsis, and a major twist/end-of-episode cliffhanger.`;

    console.log("Generating TV Show Bible via Gemini...");
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: [
            "title", "tagline", "elevatorPitch", "visualStyle", 
            "targetNetwork", "genre", "tone", "characters", "episodes"
          ],
          properties: {
            title: { type: Type.STRING },
            tagline: { type: Type.STRING },
            elevatorPitch: { type: Type.STRING },
            visualStyle: { type: Type.STRING },
            targetNetwork: { type: Type.STRING },
            genre: { type: Type.STRING },
            tone: { type: Type.STRING },
            characters: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ["name", "role", "actorSuggestion", "personality", "secret"],
                properties: {
                  name: { type: Type.STRING },
                  role: { type: Type.STRING },
                  actorSuggestion: { type: Type.STRING },
                  personality: { type: Type.STRING },
                  secret: { type: Type.STRING },
                },
              },
            },
            episodes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ["episodeNumber", "title", "synopsis", "twist"],
                properties: {
                  episodeNumber: { type: Type.INTEGER },
                  title: { type: Type.STRING },
                  synopsis: { type: Type.STRING },
                  twist: { type: Type.STRING },
                },
              },
            },
          },
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response received from Gemini.");
    }

    const showBible = JSON.parse(text);
    res.json({ showBible });
  } catch (err: any) {
    console.error("Gemini TV Show generation failed:", err);
    res.status(500).json({ error: "Failed to generate television show.", details: err.message });
  }
});

// Gemini Screenplay / Script Generator
app.post("/api/script/generate", async (req, res) => {
  const { showBible, episodeNumber, sceneTitle, focusCharacters, additionalInstructions } = req.body;

  if (!showBible) {
    return res.status(400).json({ error: "Show bible is required for script generation." });
  }

  try {
    const ai = getAiClient();
    const episode = showBible.episodes?.find((ep: any) => ep.episodeNumber === episodeNumber) || showBible.episodes?.[0];
    
    let prompt = `You are a premium award-winning television screenwriter. Draft a highly realistic, professional Hollywood-style screenplay script for a pivotal scene of this television show.

**SHOW DETAILS**:
- Title: ${showBible.title}
- Tagline: ${showBible.tagline}
- Genre/Tone: ${showBible.genre} / ${showBible.tone}
- Visual/Cinematic Direction: ${showBible.visualStyle}

**EPISODE CONTEXT**:
- Episode #${episodeNumber}: "${episode?.title || "Pilot"}"
- Episode Summary: ${episode?.synopsis || "Initial opening"}
- Major Episode Twist: ${episode?.twist || ""}

**SCENE DESCRIPTOR**:
- Scene Title or Context Focus: ${sceneTitle || "The Confrontation"}
- Characters to Focus On: ${focusCharacters && focusCharacters.length > 0 ? focusCharacters.join(", ") : "Main characters"}
${additionalInstructions ? `- Screenplay Guidelines / Focus: ${additionalInstructions}` : ""}

Output a complete, detailed screenplay with at least 2 distinct scenes. Each scene needs:
1. Scene Heading (e.g. INT. HIGH-TECH LABORATORY - NIGHT)
2. Descriptive, action-oriented lines showing character physicalities, setting atmosphere, and subtext.
3. Rapid dialogue sequences between characters. Keep dialogues intense, engaging, in-character, and include parenthetical notes (e.g., "(hesitant)", "(snarls)") where appropriate to enhance screen performance!`;

    console.log(`Generating show script for: "${showBible.title}" Episode ${episodeNumber}...`);
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["episodeTitle", "settingDescription", "scenes"],
          properties: {
            episodeTitle: { type: Type.STRING },
            settingDescription: { type: Type.STRING },
            scenes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ["sceneNumber", "heading", "actionLines", "dialogue"],
                properties: {
                  sceneNumber: { type: Type.INTEGER },
                  heading: { type: Type.STRING },
                  actionLines: { type: Type.STRING },
                  dialogue: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      required: ["character", "line", "parenthetical"],
                      properties: {
                        character: { type: Type.STRING },
                        line: { type: Type.STRING },
                        parenthetical: { type: Type.STRING }, // nullable string equivalent in schema
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No screenplay response from Gemini.");
    }

    const script = JSON.parse(text);
    res.json({ script });
  } catch (err: any) {
    console.error("Gemini Script generation failed:", err);
    res.status(500).json({ error: "Failed to generate screenplay.", details: err.message });
  }
});

// Configure Vite or Static Asset routing
async function initServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in DEVELOPMENT mode with Vite Middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in PRODUCTION mode...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`AI TV Show Creator server running smoothly at http://localhost:${PORT}`);
  });
}

initServer().catch((err) => {
  console.error("Error setting up server:", err);
  process.exit(1);
});
