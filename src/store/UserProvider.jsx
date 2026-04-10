"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadUser, hydrate as hydrateUser } from "@/store/slices/userSlice";
import { hydrate as hydrateCart } from "@/store/slices/cartSlice";
import { fetchSettings } from "@/store/slices/settingsSlice";

export default function UserProvider({ children }) {
  const dispatch = useDispatch();
  const { settings } = useSelector((state) => state.settings);

  useEffect(() => {
    // 1. Hydrate state from localStorage (Immediate client-side sync)
    dispatch(hydrateUser());
    dispatch(hydrateCart());
    
    // 2. Load user from API (Verify session with server)
    dispatch(loadUser());

    // 3. Fetch Site Settings
    dispatch(fetchSettings());
  }, [dispatch]);

  useEffect(() => {
    if (settings) {
      if (settings.siteTitle) {
        document.title = settings.siteTitle;
      }
      if (settings.faviconUrl) {
        // Update existing favicon instead of removing it
        let link = document.querySelector("link[rel*='icon']");
        
        if (!link) {
          link = document.createElement('link');
          link.rel = 'shortcut icon';
          document.getElementsByTagName('head')[0].appendChild(link);
        }
        
        link.type = 'image/x-icon';
        link.href = settings.faviconUrl;
      }
    }
  }, [settings]);

  return <>{children}</>;
}
