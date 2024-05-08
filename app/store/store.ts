import { Action, ThunkAction, configureStore } from "@reduxjs/toolkit";
import expertReducer from "../features/expertSlice";
import userReducer from "../features/user/userSlice";
import categoriesReducer from "../features/categoriesSlice";
import searchReducer from "../features/searchSlice";
import authReducer from "../features/authSlice";
const store = configureStore({
  reducer: {
    expert: expertReducer,
    user: userReducer,
    categories: categoriesReducer,
    search: searchReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export default store;
