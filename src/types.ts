/**
 * Shared Type Definitions for the AI TV Show Creator
 */

export interface Character {
  name: string;
  role: string;
  actorSuggestion: string;
  personality: string;
  secret: string;
}

export interface Episode {
  episodeNumber: number;
  title: string;
  synopsis: string;
  twist: string;
}

export interface ShowBible {
  title: string;
  tagline: string;
  elevatorPitch: string;
  visualStyle: string;
  targetNetwork: string;
  genre: string;
  tone: string;
  characters: Character[];
  episodes: Episode[];
  id?: string;
  createdAt?: string;
}

export interface ScriptDialoguePart {
  character: string;
  line: string;
  parenthetical?: string | null;
}

export interface ScriptScene {
  sceneNumber: number;
  heading: string;
  actionLines: string;
  dialogue: ScriptDialoguePart[];
}

export interface Script {
  episodeTitle: string;
  settingDescription: string;
  scenes: ScriptScene[];
}

export interface SearchResult {
  title: string;
  year: string;
  imdbId: string;
  type: string;
  poster: string;
}

export interface ShowDetails {
  title: string;
  year: string;
  rated: string;
  released: string;
  runtime: string;
  genre: string;
  director: string;
  writer: string;
  actors: string;
  plot: string;
  poster: string;
  imdbRating: string;
  imdbId: string;
}
