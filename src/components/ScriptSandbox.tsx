import { useState } from "react";
import { ShowBible, Script, ScriptScene } from "../types";
import { Film, BookOpen, Loader2, Sparkles, Wand2, Copy, Download, RefreshCw, ChevronRight } from "lucide-react";

interface ScriptSandboxProps {
  showBible: ShowBible;
  selectedEpisodeNumber: number;
  onSelectEpisodeNumber: (num: number) => void;
}

const SCREENWRITING_QUOTES = [
  "Sharpening Courier-style typewriter keys...",
  "Whispering subtext to the lead actors...",
  "Tuning Aaron Sorkin style rapid-fire dialogues...",
  "Chasing a plot-hole with visual action notes...",
  "Adding suspenseful cinematic pauses...",
  "Spilling virtual coffee on the screenplay cover..."
];

export default function ScriptSandbox({ showBible, selectedEpisodeNumber, onSelectEpisodeNumber }: ScriptSandboxProps) {
  const [sceneTitle, setSceneTitle] = useState("The Confrontation");
  const [selectedCharacters, setSelectedCharacters] = useState<string[]>(
    showBible.characters.slice(0, 2).map((c) => c.name)
  );
  const [instructions, setInstructions] = useState("");
  const [loading, setLoading] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [generatedScript, setGeneratedScript] = useState<Script | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const toggleCharacter = (charName: string) => {
    setSelectedCharacters((prev) =>
      prev.includes(charName)
        ? prev.filter((name) => name !== charName)
        : [...prev, charName]
    );
  };

  const cycleQuotes = () => {
    setQuoteIndex((prev) => (prev + 1) % SCREENWRITING_QUOTES.length);
  };

  const handleGenerateScript = async () => {
    setLoading(true);
    setError(null);
    setGeneratedScript(null);

    // Dynamic index cycle for loading screen engagement
    const quoteInterval = setInterval(cycleQuotes, 3500);

    try {
      const response = await fetch("/api/script/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          showBible,
          episodeNumber: selectedEpisodeNumber,
          sceneTitle,
          focusCharacters: selectedCharacters,
          additionalInstructions: instructions,
        }),
      });

      const data = await response.json();
      if (data.error) {
        setError(data.error);
      } else if (data.script) {
        setGeneratedScript(data.script);
      }
    } catch (err: any) {
      setError("Failed to draft screenplay. Please check connection.");
    } finally {
      clearInterval(quoteInterval);
      setLoading(false);
    }
  };

  // Plain text formatting helper for copying script clipboard
  const getScriptAsPlainText = () => {
    if (!generatedScript) return "";
    let txt = `SHOW: ${showBible.title.toUpperCase()}\n`;
    txt += `EPISODE: ${generatedScript.episodeTitle.toUpperCase()}\n`;
    txt += `SETTING: ${generatedScript.settingDescription}\n`;
    txt += `==========================================\n\n`;

    generatedScript.scenes.forEach((scene) => {
      txt += `SCENE ${scene.sceneNumber}: ${scene.heading.toUpperCase()}\n\n`;
      txt += `${scene.actionLines.toUpperCase()}\n\n`;
      scene.dialogue.forEach((d) => {
        txt += `\t\t${d.character.toUpperCase()}\n`;
        if (d.parenthetical) {
          txt += `\t\t(${d.parenthetical})\n`;
        }
        txt += `\t${d.line}\n\n`;
      });
      txt += `------------------------------------------\n\n`;
    });
    return txt;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(getScriptAsPlainText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const textData = getScriptAsPlainText();
    const blob = new Blob([textData], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${showBible.title.replace(/\s+/g, "_")}_Ep${selectedEpisodeNumber}_Script.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800 p-6 shadow-2xl w-full max-w-7xl mx-auto">
      
      {/* Studio Header */}
      <div className="flex flex-col gap-1 mb-6 border-b border-slate-800 pb-5">
        <div className="flex items-center gap-2">
          <Wand2 className="w-5 h-5 text-emerald-400" />
          <h2 className="text-xl font-bold text-slate-100">Screenplay Writer Sandbox</h2>
        </div>
        <p className="text-slate-400 text-xs">
          Select characters and outline a scene context. Gemini's writing AI will generate realistic actor-facing dialogues, action beats, and cinematic timings.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Controls Panel */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          
          {/* Episode Select & Context */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 flex flex-col gap-4">
            <div>
              <label className="block text-[11px] font-mono text-slate-500 uppercase tracking-wider mb-2">
                Active Episode Target
              </label>
              <select
                value={selectedEpisodeNumber}
                onChange={(e) => onSelectEpisodeNumber(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-800 text-slate-105 rounded-xl py-2 px-3 text-sm outline-none cursor-pointer focus:border-indigo-500"
              >
                {showBible.episodes.map((ep) => (
                  <option key={ep.episodeNumber} value={ep.episodeNumber}>
                    Episode {ep.episodeNumber}: {ep.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-500 uppercase tracking-wider mb-2">
                Pivotal Scene Context Focus
              </label>
              <input
                type="text"
                value={sceneTitle}
                onChange={(e) => setSceneTitle(e.target.value)}
                placeholder="E.g., Confrontation in the reactor, Secret coffee date..."
                className="w-full bg-slate-900 border border-slate-800 text-slate-100 rounded-xl py-2 px-3 text-sm outline-none focus:border-indigo-505"
              />
            </div>
          </div>

          {/* Character selection list */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80">
            <label className="block text-[11px] font-mono text-slate-500 uppercase tracking-wider mb-3">
              Included Cast Members ({selectedCharacters.length} active)
            </label>
            <div className="flex flex-col gap-2">
              {showBible.characters.map((char) => {
                const isActive = selectedCharacters.includes(char.name);
                return (
                  <button
                    key={char.name}
                    onClick={() => toggleCharacter(char.name)}
                    className={`flex items-center justify-between text-left p-2.5 rounded-lg border text-xs transition-all cursor-pointer ${
                      isActive
                        ? "bg-indigo-600/10 border-indigo-500 text-indigo-300"
                        : "bg-slate-900/60 border-transparent text-slate-400 hover:bg-slate-900 hover:text-slate-200"
                    }`}
                  >
                    <div className="flex flex-col">
                      <span className="font-semibold">{char.name}</span>
                      <span className="text-[10px] text-slate-500 mt-0.5">{char.role}</span>
                    </div>
                    <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-all ${
                      isActive ? "bg-indigo-500 border-indigo-400" : "border-slate-700"
                    }`}>
                      {isActive && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Screenwriter Prompts */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80">
            <label className="block text-[11px] font-mono text-slate-500 uppercase tracking-wider mb-2">
              Stylistic Instructions (Optional)
            </label>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g. 'Write in Aaron Sorkin's walk-and-talk style, dialogue pacing must be incredibly fast-paced and witty.' or 'Make it incredibly dark, full of tense pauses...'"
              rows={3}
              className="w-full bg-slate-900 border border-slate-800 text-slate-100 rounded-xl p-3 text-xs outline-none focus:border-indigo-500 resize-none placeholder:text-slate-600"
            />
          </div>

          {/* Action generate button */}
          <button
            onClick={handleGenerateScript}
            disabled={loading || selectedCharacters.length === 0}
            className="w-full bg-gradient-to-r from-emerald-600 to-indigo-600 text-white rounded-xl py-3 text-sm font-semibold hover:from-emerald-500 hover:to-indigo-500 shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            <span>{loading ? "Drafting Playwright Copy..." : "Draft Screenplay Scene"}</span>
          </button>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl p-3 text-xs">
              {error}
            </div>
          )}
        </div>

        {/* Script Viewer Container */}
        <div className="lg:col-span-7 h-full">
          <div className="bg-slate-950/80 border border-slate-850 rounded-2xl p-5 min-h-[500px] flex flex-col">
            
            {loading ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-12 my-auto">
                <Film className="w-10 h-10 text-indigo-400 animate-pulse mb-4" />
                <Loader2 className="w-6 h-6 animate-spin text-slate-500 mb-2" />
                <p className="text-slate-300 text-sm font-mono mt-1 italic max-w-sm">
                  "{SCREENWRITING_QUOTES[quoteIndex]}"
                </p>
              </div>
            ) : generatedScript ? (
              <div className="flex flex-col h-full">
                
                {/* PDF/Format Option Bar */}
                <div className="flex justify-end gap-2 border-b border-slate-850 pb-4 mb-6">
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center gap-1.5 bg-slate-900 border border-slate-850 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg px-3 py-1.5 text-xs transition-all pointer-events-auto cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span>{copied ? "Copied!" : "Copy Clipboard"}</span>
                  </button>
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-1.5 bg-slate-900 border border-slate-850 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg px-3 py-1.5 text-xs transition-all cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-slate-400" />
                    <span>Save script (.txt)</span>
                  </button>
                </div>

                {/* Highly authentic Hollywood PDF Typewriter formatting layout */}
                <div className="flex-1 bg-white text-neutral-800 font-mono text-xs md:text-sm p-6 sm:p-10 rounded-xl overflow-y-auto max-h-[600px] shadow-inner select-text border border-slate-200">
                  <div className="max-w-[550px] mx-auto flex flex-col gap-6">
                    {/* Cover heading */}
                    <div className="text-center font-bold border-b border-neutral-100 pb-4 text-xs uppercase tracking-widest text-neutral-400 mb-2">
                      {showBible.title} — EPISODE 0{selectedEpisodeNumber} SCRIPT COPY
                    </div>

                    <div className="text-xs uppercase text-neutral-400">
                      EPISODE TITLE: <span className="font-bold text-neutral-900 font-mono">{generatedScript.episodeTitle}</span>
                    </div>

                    <div className="italic text-neutral-600 font-light pr-4 bg-neutral-50 p-2.5 rounded border-l-2 border-indigo-400 leading-normal text-xs font-mono">
                      {generatedScript.settingDescription}
                    </div>

                    {/* Standard script elements rendering */}
                    {generatedScript.scenes.map((scene) => (
                      <div key={scene.sceneNumber} className="flex flex-col gap-4 mt-4 first:mt-0">
                        {/* Heading */}
                        <div className="font-bold text-neutral-950 uppercase border-b border-neutral-150 pb-1 mt-2 tracking-wide font-mono">
                          {scene.sceneNumber}. {scene.heading}
                        </div>

                        {/* Action Beats */}
                        <div className="text-neutral-600 leading-relaxed text-xs hyphens-auto pr-2 normal-case font-mono font-light italic">
                          {scene.actionLines}
                        </div>

                        {/* Dialogues */}
                        <div className="flex flex-col gap-3.5 my-2">
                          {scene.dialogue.map((d, dIdx) => (
                            <div key={dIdx} className="flex flex-col text-center max-w-[340px] mx-auto w-full font-mono">
                              {/* Speaker Name */}
                              <div className="uppercase font-bold tracking-wide text-neutral-900 font-mono text-center mb-0.5">
                                {d.character}
                              </div>
                              
                              {/* Parenthetical annotation */}
                              {d.parenthetical && (
                                <div className="text-[11px] text-neutral-500 italic font-light lowercase text-center font-mono my-0.5">
                                  ({d.parenthetical})
                                </div>
                              )}

                              {/* Dialogue bubble */}
                              <div className="text-neutral-700 leading-relaxed text-xs text-center font-mono font-light px-2">
                                {d.line}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                    
                    <div className="text-center text-neutral-400 font-bold uppercase text-[10px] mt-10 tracking-widest font-mono">
                      [ END OF SCENE SCENARIO ]
                    </div>
                  </div>
                </div>

              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-500 text-center p-12 my-auto">
                <BookOpen className="w-12 h-12 stroke-1 text-slate-700 mb-3" />
                <h3 className="text-sm font-semibold text-slate-450 font-mono">[ Typewriter Idle ]</h3>
                <p className="text-slate-600 text-xs mt-1 max-w-xs">
                  Review the left specifications, hit generate, and watch Gemini write a multi-scene screenplayer in real time.
                </p>
              </div>
            )}

          </div>
        </div>
      </div>

    </div>
  );
}
