import { configureStore } from "@reduxjs/toolkit";
import expertReducer from "../features/expertSlice";
import userReducer from "../features/userSlice";
const store = configureStore({
  reducer: {
    expert: expertReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
