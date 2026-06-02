import React, { useState, useEffect } from "react";
import { Search, Loader2, Sparkles, ExternalLink, RefreshCw, Film } from "lucide-react";
import { SearchResult, ShowDetails } from "../types";

interface ShowSearchReferenceProps {
  onImport: (details: ShowDetails) => void;
}

export default function ShowSearchReference({ onImport }: ShowSearchReferenceProps) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedDetails, setSelectedDetails] = useState<ShowDetails | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasRapid, setHasRapid] = useState(false);

  useEffect(() => {
    // Quick config check to inform user of setup
    fetch("/api/config")
      .then((res) => res.json())
      .then((data) => {
        setHasRapid(data.hasRapid);
      })
      .catch((err) => console.error("Error fetching config:", err));
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setSelectedDetails(null);

    try {
      const response = await fetch("/api/rapidapi/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const data = await response.json();
      if (data.error) {
        setError(data.error);
        setResults([]);
      } else {
        setResults(data.results || []);
      }
    } catch (err: any) {
      setError("Failed to process TV show search. Please check backend connection.");
    } finally {
      setLoading(false);
    }
  };

  const fetchDetails = async (show: SearchResult) => {
    setDetailsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/rapidapi/details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imdbId: show.imdbId, title: show.title }),
      });
      const data = await response.json();
      if (data.error) {
        setError(data.error);
      } else if (data.details) {
        setSelectedDetails(data.details);
      }
    } catch (err: any) {
      setError("Failed to fetch show details.");
    } finally {
      setDetailsLoading(false);
    }
  };

  return (
    <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800 p-6 shadow-xl h-full flex flex-col">
      <div className="flex flex-col gap-2 mb-4">
        <div className="flex items-center gap-2">
          <Film className="w-5 h-5 text-indigo-400" />
          <h2 className="text-xl font-semibold text-slate-100">TV Show Blueprint Hub</h2>
        </div>
        <p className="text-slate-400 text-sm">
          {hasRapid ? (
            <span className="text-emerald-400 font-medium">● RapidAPI Active</span>
          ) : (
            <span className="text-amber-400/80">● Omni-AI Grounding (Gemini Fallback)</span>
          )}{" "}
          - Search real-world TV shows to import their core DNA as seed data for your AI script generator.
        </p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search shows e.g., 'Westworld', 'Severance'..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-slate-600"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="bg-indigo-600 text-white rounded-xl px-5 text-sm font-medium hover:bg-indigo-500 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <span>Search</span>
          )}
        </button>
      </form>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl p-3 text-xs mb-4">
          {error}
        </div>
      )}

      {/* Two-Column split for results and details */}
      <div className="flex-1 min-h-[220px] grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Results List */}
        <div className="bg-slate-950/75 border border-slate-800/80 rounded-xl p-3 overflow-y-auto max-h-[360px] flex flex-col gap-2">
          {results.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-600 p-8 text-center">
              <Search className="w-8 h-8 opacity-30 mb-2 text-indigo-400" />
              <p className="text-xs">No shows queried yet. Enter a name to analyze TV blueprint structures.</p>
            </div>
          ) : (
            results.map((result) => (
              <button
                key={result.imdbId || result.title}
                onClick={() => fetchDetails(result)}
                className={`flex gap-3 text-left p-2 rounded-lg transition-all border ${
                  selectedDetails?.imdbId === result.imdbId
                    ? "bg-indigo-600/10 border-indigo-500"
                    : "border-transparent bg-slate-900/40 hover:bg-slate-900/80"
                }`}
              >
                <img
                  src={result.poster}
                  alt={result.title}
                  referrerPolicy="no-referrer"
                  className="w-12 h-16 object-cover rounded shadow-md bg-slate-800 flex-shrink-0"
                />
                <div className="flex-1 min-w-0 pr-1 flex flex-col justify-center">
                  <h4 className="text-slate-200 text-sm font-medium truncate group-hover:text-white">
                    {result.title}
                  </h4>
                  <span className="text-slate-500 text-xs font-mono mt-1">
                    {result.year} • {result.type}
                  </span>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Selected Show Details */}
        <div className="bg-slate-950/75 border border-slate-800/80 rounded-xl p-4 overflow-y-auto max-h-[360px] flex flex-col">
          {detailsLoading ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 p-8">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-400 mb-2" />
              <p className="text-xs">Deconstructing Show DNA...</p>
            </div>
          ) : selectedDetails ? (
            <div className="flex flex-col h-full">
              <div className="flex gap-4 mb-3">
                <img
                  src={selectedDetails.poster}
                  alt={selectedDetails.title}
                  referrerPolicy="no-referrer"
                  className="w-20 h-28 object-cover rounded-lg shadow-lg border border-slate-800"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-slate-100 font-bold text-base leading-tight">
                    {selectedDetails.title}
                  </h3>
                  <div className="text-slate-400 text-xs mt-1 flex flex-wrap gap-x-2 gap-y-1">
                    <span className="font-semibold text-indigo-400">{selectedDetails.genre}</span>
                    <span>•</span>
                    <span>{selectedDetails.year}</span>
                    <span>•</span>
                    <span>{selectedDetails.rated}</span>
                  </div>
                  <div className="text-slate-500 text-xs mt-1">
                    IMDb ★ {selectedDetails.imdbRating}
                  </div>
                </div>
              </div>

              <div className="text-slate-300 text-xs leading-relaxed mb-4 flex-1">
                <div className="font-semibold text-slate-400 mb-0.5">Plot Summary:</div>
                <p className="text-slate-400 italic line-clamp-4">{selectedDetails.plot}</p>
                <div className="mt-2 text-[11px] text-slate-500">
                  <span className="font-semibold text-slate-400">Cast Suggestions:</span> {selectedDetails.actors}
                </div>
              </div>

              <button
                onClick={() => onImport(selectedDetails)}
                className="w-full bg-emerald-600/95 hover:bg-emerald-500 text-white rounded-xl py-2.5 text-xs font-semibold shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer mt-auto"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Seed Generator with this DNA</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-600 text-center p-8">
              <Info className="w-8 h-8 text-slate-700 mb-2" />
              <p className="text-xs">Select any show from the left list to see full casting and screenplay seed data.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Inline helper for info placeholder
function Info({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={className}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.25 11.25l.041-.02a.75.75 0 111.085 1.086L12 13.5m0-13.5a9 9 0 11-9 9 9 9 0 019-9z"
      />
    </svg>
  );
}
