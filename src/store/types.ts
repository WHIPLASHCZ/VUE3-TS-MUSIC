import { playMode } from "@/types";

export interface RootState {
  searchHistory: string[];
  playHistory: any[];
}

export interface playerModuleType {
  sequeceList: any[];
  playList: any[];
  isPlaying: boolean;
  playMode: playMode;
  currentIndex: number;
  fullScreen: boolean;
  favList: any[];
  maxFav: number;
}
