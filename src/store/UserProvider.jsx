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
      // 1. Update Title
      if (settings.siteTitle) {
        document.title = settings.siteTitle;
      }

      // 2. Update Favicon
      if (settings.faviconUrl) {
        // Remove ALL existing favicon tags to prevent conflicts
        const existingIcons = document.querySelectorAll("link[rel*='icon']");
        existingIcons.forEach(icon => {
          if (icon && icon.parentNode) {
            icon.parentNode.removeChild(icon);
          }
        });

        const head = document.getElementsByTagName('head')[0];
        if (head) {
          // Create new dynamic link
          const link = document.createElement('link');
          link.rel = 'icon';
          link.type = 'image/x-icon';
          link.href = settings.faviconUrl;
          head.appendChild(link);
          
          // Also add shortcut icon for better compatibility
          const shortcut = document.createElement('link');
          shortcut.rel = 'shortcut icon';
          shortcut.href = settings.faviconUrl;
          head.appendChild(shortcut);
        }
      }
    }
  }, [settings]);

  return <>{children}</>;
}
