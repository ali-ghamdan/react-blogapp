import { create } from "zustand/react";
import { STORAGE_PATH } from "./constants";
import { authState, postState, RouteDirection, routeState } from "./types";

export const authStore = create<authState>((set) => ({
  auth: localStorage.getItem(STORAGE_PATH),
  setAuth: (authToken) => {
    if (authToken) localStorage.setItem(STORAGE_PATH, authToken);
    else localStorage.removeItem(STORAGE_PATH);
    set({ auth: authToken });
  },
}));

export const routeStore = create<routeState>((set) => ({
  route: RouteDirection.HOME_PAGE,
  setRoute: (route) => {
    set({ route });
  },
}));

export const postStore = create<postState>((set) => ({
  post: {
    title: undefined,
    id: undefined,
  },
  setPost: (post) => {
    set({ post });
  },
}));
