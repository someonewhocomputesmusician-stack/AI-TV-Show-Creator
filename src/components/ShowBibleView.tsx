import { useState } from "react";
import { ShowBible, Character, Episode } from "../types";
import { Users, Tv, Compass, Map, Eye, EyeOff, Film, HelpCircle, ArrowRight, Sparkles } from "lucide-react";

interface ShowBibleViewProps {
  showBible: ShowBible;
  onSelectEpisodeForScript: (episodeNum: number) => void;
}

export default function ShowBibleView({ showBible, onSelectEpisodeForScript }: ShowBibleViewProps) {
  const [revealedSecrets, setRevealedSecrets] = useState<Record<number, boolean>>({});
  const [revealedTwists, setRevealedTwists] = useState<Record<number, boolean>>({});

  const toggleSecret = (index: number) => {
    setRevealedSecrets((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const toggleTwist = (episodeNum: number) => {
    setRevealedTwists((prev) => ({ ...prev, [episodeNum]: !prev[episodeNum] }));
  };

  // Determine network visual accent color matching famous platform palettes
  const getNetworkColorStyles = (network: string) => {
    const net = (network || "").toLowerCase();
    if (net.includes("hbo")) {
      return {
        bg: "bg-purple-600/15",
        border: "border-purple-500/40",
        shadow: "shadow-purple-900/20",
        text: "text-purple-400",
        pill: "bg-purple-500/20 border-purple-500/50 text-purple-300",
        glow: "from-purple-500/30 to-purple-650/5",
      };
    }
    if (net.includes("netflix")) {
      return {
        bg: "bg-red-600/15",
        border: "border-red-500/40",
        shadow: "shadow-red-900/20",
        text: "text-red-400",
        pill: "bg-red-500/20 border-red-500/50 text-red-300",
        glow: "from-red-500/30 to-red-650/5",
      };
    }
    if (net.includes("disney") || net.includes("hulu")) {
      return {
        bg: "bg-blue-600/15",
        border: "border-blue-500/40",
        shadow: "shadow-blue-900/20",
        text: "text-blue-400",
        pill: "bg-blue-500/20 border-blue-500/50 text-blue-300",
        glow: "from-blue-500/30 to-blue-650/5",
      };
    }
    if (net.includes("adult swim") || net.includes("youtube") || net.includes("indie")) {
      return {
        bg: "bg-emerald-600/15",
        border: "border-emerald-500/40",
        shadow: "shadow-emerald-900/20",
        text: "text-emerald-400",
        pill: "bg-emerald-500/20 border-emerald-500/50 text-emerald-300",
        glow: "from-emerald-500/30 to-emerald-650/5",
      };
    }
    // Apple / Prime / Default slate neon
    return {
      bg: "bg-indigo-600/15",
      border: "border-indigo-500/40",
      shadow: "shadow-indigo-900/20",
      text: "text-indigo-400",
      pill: "bg-indigo-500/20 border-indigo-500/50 text-indigo-300",
      glow: "from-indigo-500/30 to-indigo-650/5",
    };
  };

  const netStyles = getNetworkColorStyles(showBible.targetNetwork);

  return (
    <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto pb-16">
      
      {/* Cinematic Hero header banner */}
      <div className={`relative overflow-hidden rounded-3xl border ${netStyles.border} bg-slate-900/40 backdrop-blur-md p-8 md:p-12 shadow-2xl`}>
        {/* Dynamic ambient backdrop glowing gradient */}
        <div className={`absolute -right-40 -top-40 w-96 h-96 bg-gradient-to-tr ${netStyles.glow} rounded-full blur-3xl opacity-60 pointer-events-none`}></div>
        
        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start">
          {/* Dynamic artistic poster mockup */}
          <div className="w-48 h-64 md:w-56 md:h-80 rounded-2xl overflow-hidden shadow-2xl border border-slate-700/50 flex-shrink-0 relative group">
            <img
              src={`https://picsum.photos/seed/${encodeURIComponent(showBible.title)}/400/600`}
              alt={showBible.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent flex flex-col justify-end p-4">
              <span className={`text-[10px] uppercase font-bold tracking-widest font-mono ${netStyles.text}`}>Original Series</span>
              <p className="text-slate-100 font-bold text-sm tracking-wide line-clamp-2 mt-0.5">{showBible.title}</p>
            </div>
          </div>

          <div className="flex-1 mt-2">
            {/* Badges row */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span className={`px-3 py-1 text-xs font-mono font-medium rounded-full border ${netStyles.pill}`}>
                {showBible.targetNetwork}
              </span>
              <span className="px-3 py-1 text-xs font-mono font-medium rounded-full bg-slate-800 border border-slate-700 text-slate-300">
                {showBible.genre}
              </span>
              <span className="px-3 py-1 text-xs font-mono font-medium rounded-full bg-slate-800 border border-slate-700 text-slate-300">
                {showBible.tone}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-50 tracking-tight leading-tight">
              {showBible.title}
            </h1>
            
            <p className="text-lg md:text-xl text-slate-300 font-medium italic tracking-wide mt-2">
              "{showBible.tagline}"
            </p>

            <div className="mt-6">
              <h3 className="text-xs font-mono text-slate-500 uppercase tracking-widest flex items-center gap-1.5 mb-2.5">
                <Compass className="w-3.5 h-3.5 text-slate-400" />
                The Premise & Core Concept
              </h3>
              <p className="text-slate-350 text-sm md:text-base leading-relaxed max-w-4xl font-light">
                {showBible.elevatorPitch}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bento Grid: Visual Style and Production Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-slate-900/40 backdrop-blur-md rounded-2xl border border-slate-800/80 p-6 flex flex-col gap-3 lg:col-span-2">
          <h3 className="text-slate-200 font-semibold text-lg flex items-center gap-2">
            <Tv className="w-4 h-4 text-indigo-400" />
            Visual Style & Directorial Style Guide
          </h3>
          <p className="text-slate-400 text-sm leading-relaxed whitespace-pre-line font-light">
            {showBible.visualStyle}
          </p>
        </div>

        <div className="bg-slate-900/40 backdrop-blur-md rounded-2xl border border-slate-800/80 p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-slate-200 font-semibold text-base mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              Series Info Ledger
            </h3>
            <div className="flex flex-col gap-3 font-mono text-xs">
              <div className="flex justify-between border-b border-slate-800/80 pb-2">
                <span className="text-slate-500">FORMAT</span>
                <span className="text-slate-300">1-Hour Narrative Series</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-2">
                <span className="text-slate-500">PLATFORM</span>
                <span className="text-slate-300 font-semibold text-indigo-400">{showBible.targetNetwork}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-2">
                <span className="text-slate-500">GENRE</span>
                <span className="text-slate-300">{showBible.genre}</span>
              </div>
              <div className="flex justify-between pb-1">
                <span className="text-slate-500">TONE</span>
                <span className="text-slate-300">{showBible.tone}</span>
              </div>
            </div>
          </div>
          <div className="bg-slate-950/70 border border-slate-800/60 rounded-xl p-3.5 mt-4">
            <p className="text-[11px] text-slate-500 leading-normal">
              This show bible was compiled dynamically by Google Gemini. Use the screenplay sandbox below to draft real cinematic screenplays utilizing this lore.
            </p>
          </div>
        </div>
      </div>

      {/* Main Casting Guide */}
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2.5">
          <Users className="w-5 h-5 text-indigo-400" />
          The Main Cast Directory
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {showBible.characters.map((character, index) => (
            <div
              key={character.name}
              className="bg-slate-900/30 backdrop-blur-md rounded-2xl border border-slate-800/80 overflow-hidden flex flex-col justify-between hover:border-slate-700/80 transition-all flex-1 shadow-md group"
            >
              {/* Character headshot placeholder */}
              <div className="h-44 overflow-hidden relative">
                <img
                  src={`https://picsum.photos/seed/${encodeURIComponent(character.name)}/300/300`}
                  alt={character.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/10 to-transparent"></div>
                <div className="absolute bottom-3 left-4">
                  <h3 className="text-slate-100 font-bold text-base">{character.name}</h3>
                  <span className={`text-[10px] uppercase tracking-wider font-mono font-medium ${netStyles.text}`}>
                    {character.role}
                  </span>
                </div>
              </div>

              {/* Character biography card */}
              <div className="p-4 flex-1 flex flex-col justify-between gap-4">
                <div className="flex flex-col gap-2">
                  <div className="text-xs">
                    <span className="text-slate-500 block font-mono uppercase text-[10px] tracking-wider">Suggested Actor:</span>
                    <span className="text-emerald-400 font-medium">{character.actorSuggestion}</span>
                  </div>
                  <div className="text-xs text-slate-400 leading-relaxed font-light">
                    {character.personality}
                  </div>
                </div>

                {/* Covert narrative secret toggle block */}
                <div className="border-t border-slate-800/80 pt-3 flex flex-col gap-2 mt-auto">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-red-500/80 uppercase tracking-widest font-bold">Covert Background Secret</span>
                    <button
                      onClick={() => toggleSecret(index)}
                      className="text-slate-500 hover:text-slate-350 cursor-pointer"
                    >
                      {revealedSecrets[index] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  
                  {revealedSecrets[index] ? (
                    <div className="bg-red-950/20 border border-red-900/30 text-red-300 text-xs rounded-xl p-2.5 leading-relaxed animate-fade-in font-mono text-[11px]">
                      {character.secret}
                    </div>
                  ) : (
                    <button
                      onClick={() => toggleSecret(index)}
                      className="bg-slate-950/60 border border-dashed border-red-900/20 hover:border-red-950 text-slate-500/80 hover:text-slate-500 text-[10px] font-mono text-center rounded-xl py-2 cursor-pointer transition-all"
                    >
                      [ CLICK TO UNLOCK SECRETS ]
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Episode Timeline & Writing Sandboxes */}
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2.5">
          <Film className="w-5 h-5 text-indigo-400" />
          Season Episode Timeline
        </h2>
        
        <div className="flex flex-col gap-4">
          {showBible.episodes.map((episode) => (
            <div
              key={episode.episodeNumber}
              className="bg-slate-900/30 backdrop-blur-md rounded-2xl border border-slate-800/80 p-5 md:p-6 hover:border-slate-700/60 transition-all flex flex-col lg:flex-row gap-5 items-start justify-between"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-md ${netStyles.bg} ${netStyles.text}`}>
                    EPISODE 0{episode.episodeNumber}
                  </span>
                  <h3 className="text-slate-100 font-bold text-lg">{episode.title}</h3>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed max-w-4xl font-light">
                  {episode.synopsis}
                </p>

                {/* Twists & Cliffhanger */}
                <div className="mt-3.5 flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleTwist(episode.episodeNumber)}
                      className="text-xs font-mono text-indigo-400 hover:text-indigo-300 cursor-pointer flex items-center gap-1"
                    >
                      <span>{revealedTwists[episode.episodeNumber] ? "Hide" : "Show"} Episode Ending Twist & Cliffhanger</span>
                      {revealedTwists[episode.episodeNumber] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    </button>
                  </div>
                  {revealedTwists[episode.episodeNumber] && (
                    <div className="bg-indigo-950/15 border border-indigo-900/30 text-indigo-300 text-xs rounded-xl p-3 leading-relaxed max-w-3xl italic">
                      <span className="font-bold uppercase text-[10px] text-indigo-400 block not-italic mb-1 font-mono">End Cliffhanger Reveal:</span>
                      "{episode.twist}"
                    </div>
                  )}
                </div>
              </div>

              {/* Sandbox action */}
              <button
                onClick={() => onSelectEpisodeForScript(episode.episodeNumber)}
                className="w-full lg:w-auto bg-slate-950 border border-slate-800 hover:border-indigo-500/70 hover:bg-slate-900/40 text-slate-200 text-xs font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer self-stretch lg:self-center"
              >
                <span>Write Screenplay Script</span>
                <ArrowRight className="w-3.5 h-3.5 text-indigo-400" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
