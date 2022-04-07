import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Profile } from "types/profile";
import type { RootState } from "../store";

interface ProfileState {
  currentProfileId: number | null;
  selectedProfile: number | null;
  nextProfileId: number;
  savedProfiles: Profile[];
}

const initialState: ProfileState = {
  currentProfileId: null,
  selectedProfile: null,
  nextProfileId: 0,
  savedProfiles: [],
};

export const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<number>) => {
      state.currentProfileId = action.payload;
    },
    createProfile: (
      state,
      action: PayloadAction<{ name: String; values: number[] }>
    ) => {
      let createdProfile: Profile = {
        id: state.nextProfileId,
        name: action.payload.name,
        values: action.payload.values,
      };
      state.savedProfiles.push(createdProfile);
      state.nextProfileId = state.nextProfileId + 1;
    },
    deleteProfile: (state, action: PayloadAction<number>) => {
      if (state.currentProfileId === action.payload) {
        state.currentProfileId = null;
      }

      if (state.selectedProfile === action.payload) {
        state.selectedProfile = null;
      }

      state.savedProfiles = state.savedProfiles.filter(function (
        profile: Profile
      ) {
        return profile.id !== action.payload;
      });
    },
    setInitalState: (state) => {
      state.selectedProfile = initialState.selectedProfile;
    },
    setSelectedProfile: (state, action: PayloadAction<number>) => {
      state.selectedProfile = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setProfile,
  createProfile,
  setInitalState,
  setSelectedProfile,
  deleteProfile,
} = profileSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectProfileId = (state: RootState) =>
  state.profile.currentProfileId;

export const selectSelectedProfileId = (state: RootState) =>
  state.profile.selectedProfile;

export const selectAllProfiles = (state: RootState) =>
  state.profile.savedProfiles;

export default profileSlice.reducer;
