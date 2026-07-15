import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const PIN_STORAGE_KEY = "payplus-sidebar-pinned";

function readPinnedFromStorage() {
  try {
    return localStorage.getItem(PIN_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

function writePinnedToStorage(pinned: boolean) {
  try {
    localStorage.setItem(PIN_STORAGE_KEY, pinned ? "1" : "0");
  } catch {
    // ignore quota / private mode
  }
}

type UiState = {
  /** סיידבר מורחב קבוע — נשמר ב-localStorage */
  sidebarPinned: boolean;
  /** דמו ללמידה — מונה גלובלי ב-Redux */
  learnCounter: number;
  /** דמו ללמידה — הודעה גלובלית */
  learnMessage: string;
};

const initialState: UiState = {
  sidebarPinned: readPinnedFromStorage(),
  learnCounter: 0,
  learnMessage: "שלום מ-Redux",
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebarPinned(state) {
      state.sidebarPinned = !state.sidebarPinned;
      writePinnedToStorage(state.sidebarPinned);
    },
    setSidebarPinned(state, action: PayloadAction<boolean>) {
      state.sidebarPinned = action.payload;
      writePinnedToStorage(state.sidebarPinned);
    },
    incrementLearnCounter(state) {
      state.learnCounter += 1;
    },
    decrementLearnCounter(state) {
      state.learnCounter -= 1;
    },
    resetLearnCounter(state) {
      state.learnCounter = 0;
    },
    setLearnMessage(state, action: PayloadAction<string>) {
      state.learnMessage = action.payload;
    },
  },
});

export const {
  toggleSidebarPinned,
  setSidebarPinned,
  incrementLearnCounter,
  decrementLearnCounter,
  resetLearnCounter,
  setLearnMessage,
} = uiSlice.actions;

export default uiSlice.reducer;
