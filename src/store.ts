import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./reducers";

const localStorageState: string | null = localStorage.getItem("reduxState");
const persistedState = localStorageState ? JSON.parse(localStorageState) : {};

const store = configureStore({
  reducer: rootReducer,
  //preloadedState: persistedState,
});

store.subscribe(() => {
  localStorage.setItem("reduxState", JSON.stringify(store.getState()));
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
