import { useState, useEffect } from "react";
import { 
  Tv, Sparkles, Film, Wand2, ArrowRight, Loader2, BookOpen, AlertCircle, 
  HelpCircle, Shuffle, ChevronRight, Layers, FileText, Search, Play
} from "lucide-react";
import { ShowBible, ShowDetails } from "./types";
import ShowSearchReference from "./components/ShowSearchReference";
import ShowBibleView from "./components/ShowBibleView";
import ScriptSandbox from "./components/ScriptSandbox";

// Highly engaging creative presets
const SHOW_PRESETS: ShowBible[] = [
  {
    title: "Neon Horizon",
    tagline: "Memory is the ultimate playground. And the ultimate weapon.",
    elevatorPitch: "In a rain-slicked mega-city where human memories can be extracted, traded, and digitized like stocks, a disgraced memory detective is hired to solve the murder of a high-tech mogul, only to discover the prime suspect is a digitized fragment of her own forgotten childhood memories.",
    genre: "Cyberpunk Techno-Noir",
    tone: "Serious & Gritty",
    targetNetwork: "HBO Max",
    visualStyle: "Saturated neon cyberclash against deep, shadow-heavy noir cinematography. Shimmering rain ripples, low-key lighting with high-contrast magenta and cyan color grading, steady anamorphic camera sweeps, and a heavy analog retro-synthesizer score.",
    characters: [
      {
        name: "Detective Kaelen Drake",
        role: "Disgraced Sleuth",
        actorSuggestion: "Florence Pugh",
        personality: "Brooding, highly intuitive, carrying the emotional weight of a memory wipe she chose herself.",
        secret: "Her own missing childhood memories contain the master decryption codes for the entire city's network."
      },
      {
        name: "Silas Sterling",
        role: "Magnificent Tech Tycoon",
        actorSuggestion: "Giancarlo Esposito",
        personality: "Cold, calculated, philanthropic on the surface but driven by an obsession with digital immortality.",
        secret: "He is actually a rogue digital clone of the original founder who was assassinated."
      },
      {
        name: "Echo",
        role: "Rogue Memory Hacker",
        actorSuggestion: "Steven Yeun",
        personality: "Witty, hyper-active tech prodigy living in the low-tier neon slums.",
        secret: "He was once an apprentice at Sterling Corp who stole the prototype neural injector out of guilt."
      },
      {
        name: "Commander Iris Geller",
        role: "Ruthless Security Chief",
        actorSuggestion: "Gwendoline Christie",
        personality: "Fierce, meticulous, military-trained head of Sterling Security.",
        secret: "She is secretly harboring Silas's original physical body in high-tech cryogenic stasis."
      }
    ],
    episodes: [
      {
        episodeNumber: 1,
        title: "The Static Canvas",
        synopsis: "Kaelen Drake is called to a lavish corporate penthouse to investigate the pristine digital suicide of Silas Sterling.",
        twist: "The secure penthouse logs show Kaelen herself walking out of the suite moments before the suicide."
      },
      {
        episodeNumber: 2,
        title: "Echoes in the Rain",
        synopsis: "Kaelen recruits memory hacker Echo to crack the encrypted neural drive left behind by Sterling.",
        twist: "The drive contains sensory playback of an event Kaelen physically remembers from her childhood."
      },
      {
        episodeNumber: 3,
        title: "The Shard Palace",
        synopsis: "Drake goes undercover at the exclusive 'Shard Lounge' frequented by high-tier brain-fluid brokers.",
        twist: "She finds a black market auction listing for her own deleted memories going for ten million credits."
      },
      {
        episodeNumber: 4,
        title: "Mainframe Mirage",
        synopsis: "Iris Geller locates Kaelen's secret safehouse, initiating a frantic motorcycle chase across neon towers.",
        twist: "Drake triggers a memory loop that temporary freezes Geller's cybernetic implants."
      },
      {
        episodeNumber: 5,
        title: "A Beautiful Erasure",
        synopsis: "Drake confront Silas's digital avatar inside the city's main storage database core.",
        twist: "Silas reveals that Drake was the one who designed his digital escape project before her memory wipe."
      }
    ]
  },
  {
    title: "Chrono-Cafe",
    tagline: "The coffee is fresh. The year is up to you.",
    elevatorPitch: "In a cozy, tucked-away diner in Greenwich Village, customers discover that ordering the 'Yesterday Espresso' lets them travel exactly 24 hours back in time, leading to hilarious, chaotic micro-fixes of their daily blunders under the watchful eye of a whimsical barista who is secretly an exiled time lord.",
    genre: "Cozy Sci-Fi Comedy",
    tone: "Whimsical & Lighthearted",
    targetNetwork: "Apple TV+",
    visualStyle: "Warm amber and golden-toned lighting with safe mahogany wood textures. Shallow depth of field, breezy camera movements, a cheerful record-player jazz soundtrack, and comforting steam visuals.",
    characters: [
      {
        name: "Barnaby Finch",
        role: "Whimsical Barista / Owner",
        actorSuggestion: "David Tennant",
        personality: "Charmingly eccentric, deeply passionate about retro espresso machines and cosmic anomalies.",
        secret: "He was exiled by a prestigious Galactic Council for using temporal energy to brew the ultimate latte."
      },
      {
        name: "Maya Lin",
        role: "Anxious Grad Student",
        actorSuggestion: "Awkwafina",
        personality: "Fast-talking, thesis-obsessed, trying to navigate her academic career through constant micro-blunders.",
        secret: "She used the cafe's espresso 47 times just to pass her single history final exam."
      },
      {
        name: "Arthur Pendelton",
        role: "Lovable Curmudgeon Regular",
        actorSuggestion: "Bill Nighy",
        personality: "Dry, sarcastic, retro-clothed gentleman who sits in the corner booth reading a physical paper.",
        secret: "He is actually visiting from the year 1954 because he prefers modern high-speed Wi-Fi."
      },
      {
        name: "Chloe Valentine",
        role: "Romantic Waitress",
        actorSuggestion: "Zoe Kravitz",
        personality: "Optimistic, artistic, hoping to find her perfect match in New York City with the help of time delays.",
        secret: "She keeps matching with the same handsome stranger who she suspects is also a time traveller."
      }
    ],
    episodes: [
      {
        episodeNumber: 1,
        title: "Grounds for Concern",
        synopsis: "Maya accidentally deletes her doctoral thesis. Barnaby introduces her to the magical 'Yesterday Espresso'.",
        twist: "She travels back 24 hours to save the file but accidentally stops herself from ever meeting her future roommate."
      },
      {
        episodeNumber: 2,
        title: "Decaf and Decades",
        synopsis: "Arthur is caught paying the cash register with an extremely rare vintage gold coin collection.",
        twist: "Barnaby inspects the old coin and realizes his own eccentric face is engraved on the reverse head."
      },
      {
        episodeNumber: 3,
        title: "A Latte of Regrets",
        synopsis: "Chloe drinks three premium espressos in quick succession to undo a terrible dating monologue.",
        twist: "She coordinates a severe temporal loop where her date is trapped ordering louder and louder split soup."
      },
      {
        episodeNumber: 4,
        title: "Double Shot Paradox",
        synopsis: "A ruthless real estate magnate threatens to demolish the cozy diner block for high-yield parking garages.",
        twist: "Barnaby solves the issue by buying the developer's grandfather's physical land deed in the past."
      },
      {
        episodeNumber: 5,
        title: "The Espresso Exiles",
        synopsis: "An inspector from the prestigious Galactic Time Preservation Bureau walks inside the diner, ordering a flat white.",
        twist: "The inspector turns out to be Barnaby's former partner seeking a quaint cafe to retire."
      }
    ]
  }
];

const RANDOM_PREMISES = [
  "A forensic accountant in a futuristic lunar city discovers that criminal syndicates are smuggling outlawed plants to make real tea.",
  "An underwater research team is recruited to run a cozy restaurant for intelligent deep-sea Krakens.",
  "A high-school history teacher's chalkboards start displaying live messages from general clerks during the French Revolution.",
  "Three retired suburban book club grandmothers operate a highly covert agency to protect their local neighborhood from inter-dimensional anomalies.",
  "An elite, award-winning chef suffers a burnout and joins a medieval royal castle kitchen where magic behaves exactly like buggy software."
];

export default function App() {
  const [activeStep, setActiveStep] = useState<"setup" | "bible" | "script">("setup");
  
  // Studio form states
  const [genre, setGenre] = useState("Cyberpunk Techno-Noir");
  const [tone, setTone] = useState("Serious & Gritty");
  const [network, setNetwork] = useState("HBO Max");
  const [premise, setPremise] = useState("");
  const [protagonist, setProtagonist] = useState("");
  const [customPrompt, setCustomPrompt] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [activeShow, setActiveShow] = useState<ShowBible | null>(null);
  const [selectedEpNumber, setSelectedEpNumber] = useState(1);
  const [errorCode, setErrorCode] = useState<string | null>(null);

  // Initialize with the first preset so the user immediately has an experience
  useEffect(() => {
    setActiveShow(SHOW_PRESETS[0]);
  }, []);

  const selectPreset = (preset: ShowBible) => {
    setActiveShow(preset);
    setGenre(preset.genre);
    setTone(preset.tone);
    setNetwork(preset.targetNetwork);
    setPremise(preset.elevatorPitch);
    setProtagonist(preset.characters[0]?.personality || "");
    setSelectedEpNumber(1);
    setActiveStep("bible");
  };

  const handleSurpriseMe = () => {
    const idx = Math.floor(Math.random() * RANDOM_PREMISES.length);
    setPremise(RANDOM_PREMISES[idx]);
  };

  const handleImportShowDna = (details: ShowDetails) => {
    // Populate form seeds beautifully
    setGenre(details.genre.split(",")[0] || details.genre);
    setPremise(details.plot);
    setProtagonist(`Inspired by actors like: ${details.actors.split(",")[0]}`);
    setActiveStep("setup");
  };

  const generateNewShow = async () => {
    setLoading(true);
    setErrorCode(null);
    try {
      const response = await fetch("/api/show/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          genre,
          tone,
          network,
          premise,
          protagonistDescription: protagonist,
          customPrompt
        }),
      });
      const data = await response.json();
      if (data.error) {
        setErrorCode(data.error);
      } else if (data.showBible) {
        setActiveShow(data.showBible);
        setSelectedEpNumber(1);
        setActiveStep("bible");
      }
    } catch (err: any) {
      setErrorCode("Failed to send network request to TV Studio backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-600/30">
      
      {/* Studio Header Nav */}
      <header className="bg-slate-900/40 backdrop-blur-md border-b border-slate-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Logo element */}
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2.5 rounded-xl shadow-lg border border-indigo-500 shadow-indigo-950/40 flex items-center justify-center">
              <Tv className="w-5 h-5 text-indigo-100" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white leading-tight">AI TV Show Creator</h1>
              <p className="text-[11px] text-indigo-400 font-mono tracking-widest uppercase">Rapid Studio Desk</p>
            </div>
          </div>

          {/* Stepper progress navigation bar */}
          <div className="flex items-center bg-slate-950/80 p-1 rounded-xl border border-slate-800/80 text-xs">
            <button
              onClick={() => setActiveStep("setup")}
              className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                activeStep === "setup"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-350"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>1. Creator Studio</span>
            </button>
            <ChevronRight className="w-3 h-3 text-slate-700 hidden sm:inline" />
            <button
              onClick={() => activeShow && setActiveStep("bible")}
              disabled={!activeShow}
              className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                activeStep === "bible"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-505 disabled:opacity-40"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>2. Series Bible</span>
            </button>
            <ChevronRight className="w-3 h-3 text-slate-700 hidden sm:inline" />
            <button
              onClick={() => activeShow && setActiveStep("script")}
              disabled={!activeShow}
              className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                activeStep === "script"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-505 disabled:opacity-40"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>3. Script Desk</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Container screen */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 flex flex-col gap-8">
        
        {/* Phase 1: Creator Studio Portal */}
        {activeStep === "setup" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left form controls */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              
              <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col gap-5">
                <div>
                  <h2 className="text-xl font-semibold text-slate-100 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-indigo-400" />
                    Configure Show DNA
                  </h2>
                  <p className="text-slate-400 text-xs mt-1">
                    Feed in core concepts, genres, and guidelines. Google Gemini will draft character psychologies, lore guidelines, and multi-episode timelines.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Genre select */}
                  <div>
                    <label className="block text-[11px] font-mono text-slate-500 uppercase tracking-wider mb-2">
                      Genre
                    </label>
                    <select
                      value={genre}
                      onChange={(e) => setGenre(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-xl py-2 px-3 text-xs outline-none cursor-pointer focus:border-indigo-500"
                    >
                      <option value="Cyberpunk Techno-Noir">Cyberpunk Noir</option>
                      <option value="Cozy Sci-Fi Comedy">Cozy Sci-Fi Comedy</option>
                      <option value="Medieval Fantasy Drama">Medieval Fantasy</option>
                      <option value="Medical Mockumentary">Medical Mockumentary</option>
                      <option value="Psychological Survival Thriller">Survival Thriller</option>
                      <option value="Dystopian Satirical Comedy">Satirical comedy</option>
                    </select>
                  </div>

                  {/* Tone Select */}
                  <div>
                    <label className="block text-[11px] font-mono text-slate-500 uppercase tracking-wider mb-2">
                      Tone
                    </label>
                    <select
                      value={tone}
                      onChange={(e) => setTone(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-xl py-2 px-3 text-xs outline-none cursor-pointer focus:border-indigo-500"
                    >
                      <option value="Serious & Gritty">Serious & Gritty</option>
                      <option value="Whimsical & Lighthearted">Whimsical & Lighthearted</option>
                      <option value="Suspenseful & Noir">Suspenseful Mystery</option>
                      <option value="Mind-Bending & Philosophical">Mind-Bending</option>
                      <option value="Satirical & Fast-Paged">Satirical / Snarky</option>
                    </select>
                  </div>

                  {/* Network Outlet Select */}
                  <div>
                    <label className="block text-[11px] font-mono text-slate-500 uppercase tracking-wider mb-2">
                      Target Distributor
                    </label>
                    <select
                      value={network}
                      onChange={(e) => setNetwork(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-xl py-2 px-3 text-xs outline-none cursor-pointer focus:border-indigo-500"
                    >
                      <option value="HBO Max Style">HBO Max Original</option>
                      <option value="Netflix Original Title">Netflix Original</option>
                      <option value="Apple TV+ Showcase">Apple TV+ Format</option>
                      <option value="Disney+ Network">Disney+ Showcase</option>
                      <option value="Adult Swim / Cartoon Network">Adult Swim Late Night</option>
                    </select>
                  </div>
                </div>

                {/* Main Premise text area */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-[11px] font-mono text-slate-500 uppercase tracking-wider">
                      Core Series Premise & Pitch
                    </label>
                    <button
                      type="button"
                      onClick={handleSurpriseMe}
                      className="text-[10px] font-mono text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
                    >
                      <Shuffle className="w-3 h-3" />
                      <span>Surprise Me Seed</span>
                    </button>
                  </div>
                  <textarea
                    value={premise}
                    onChange={(e) => setPremise(e.target.value)}
                    placeholder="E.g., A memory detective tasked with investigating her own forgotten self..."
                    rows={4}
                    className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-xl p-3 text-xs outline-none focus:border-indigo-500 resize-none placeholder:text-slate-650"
                  />
                </div>

                {/* Protagonist description seeds */}
                <div>
                  <label className="block text-[11px] font-mono text-slate-500 uppercase tracking-wider mb-2">
                    Main Lead Character Concept
                  </label>
                  <input
                    type="text"
                    value={protagonist}
                    onChange={(e) => setProtagonist(e.target.value)}
                    placeholder="e.g. A weary time-travel detective carrying heavy personal regret"
                    className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-xl py-2 px-3 text-xs outline-none focus:border-indigo-505"
                  />
                </div>

                {/* Custom styling guidelines */}
                <div>
                  <label className="block text-[11px] font-mono text-slate-500 uppercase tracking-wider mb-2">
                    Additional Style Prompts (Optional)
                  </label>
                  <input
                    type="text"
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    placeholder="e.g. 'Highly atmospheric cinematography with heavy synth-pop backing'"
                    className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-xl py-2 px-3 text-xs outline-none focus:border-indigo-505"
                  />
                </div>

                {/* Generation Launch Button */}
                <button
                  type="button"
                  onClick={generateNewShow}
                  disabled={loading || !premise.trim()}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl py-3.5 text-xs font-semibold hover:from-indigo-500 hover:to-purple-500 shadow-md transform hover:-translate-y-0.5 active:translate-y-0 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                  ) : (
                    <Wand2 className="w-4 h-4 text-indigo-200" />
                  )}
                  <span>{loading ? "Constructing Show Universe..." : "Establish Series Bible & Launch Catalog"}</span>
                </button>

                {errorCode && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl p-3 text-xs flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{errorCode}</span>
                  </div>
                )}
              </div>

              {/* Instant experience presets switcher */}
              <div className="bg-slate-900/40 backdrop-blur-md border border-slate-850 rounded-2xl p-6">
                <div>
                  <h3 className="text-sm font-semibold text-slate-200">Or Pick an Instant Playable Masterpiece</h3>
                  <p className="text-slate-500 text-[11px] mt-0.5">Skip the wait time by importing an instantly fleshed-out pilot proposal.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  {SHOW_PRESETS.map((p) => (
                    <button
                      key={p.title}
                      onClick={() => selectPreset(p)}
                      className="border border-slate-800 bg-slate-950 hover:bg-slate-900/60 hover:border-slate-705 p-4 rounded-xl text-left transition-all cursor-pointer group"
                    >
                      <span className="text-[10px] font-mono text-indigo-400 block uppercase font-bold tracking-wider">{p.genre}</span>
                      <h4 className="text-slate-100 font-bold text-sm mt-1 flex items-center gap-1 group-hover:text-white">
                        <span>{p.title}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-400" />
                      </h4>
                      <p className="text-slate-500 text-xs mt-1.5 leading-normal line-clamp-2">{p.elevatorPitch}</p>
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Right RapidAPI hub reference */}
            <div className="lg:col-span-5 h-full">
              <ShowSearchReference onImport={handleImportShowDna} />
            </div>

          </div>
        )}

        {/* Phase 2: Show Bible View */}
        {activeStep === "bible" && activeShow && (
          <ShowBibleView
            showBible={activeShow}
            onSelectEpisodeForScript={(epNum) => {
              setSelectedEpNumber(epNum);
              setActiveStep("script");
            }}
          />
        )}

        {/* Phase 3: Screenplay Sandbox Script Desk */}
        {activeStep === "script" && activeShow && (
          <ScriptSandbox
            showBible={activeShow}
            selectedEpisodeNumber={selectedEpNumber}
            onSelectEpisodeNumber={setSelectedEpNumber}
          />
        )}

      </main>

      {/* Elegant minimalist footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-600">
          <div>
            <span>© 2026 AI TV Show Creator. Crafted using Google Gemini Flash.</span>
          </div>
          <div className="flex gap-4">
            <span>Powered by @google/genai</span>
            <span>•</span>
            <span className="text-slate-500 font-bold">Express + Vite Full-Stack</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
