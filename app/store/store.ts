import { Action, ThunkAction, configureStore } from "@reduxjs/toolkit";
import expertReducer from "../features/expertSlice";
import userReducer from "../features/userSlice";
import categoriesReducer from "../features/categoriesSlice";
import searchReducer from "../features/searchSlice";
const store = configureStore({
  reducer: {
    expert: expertReducer,
    user: userReducer,
    categories: categoriesReducer,
    search: searchReducer,
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
