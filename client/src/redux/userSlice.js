// Redux slice for managing the currently authenticated user.
// currentUser is null when logged out, and a user object when logged in.

import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    currentUser: null,
  },
  reducers: {
    // Sets the authenticated user. Pass null to clear (log out).
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
  },
});

export const { setCurrentUser } = userSlice.actions;

export default userSlice.reducer;