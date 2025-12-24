"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import * as React from "react";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <GoogleReCaptchaProvider
        reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
        language="tr"
        scriptProps={{
          async: true,
          defer: true,
          appendTo: "body",
        }}
        container={{
          parameters: {
            badge: "bottomright", 
            theme: "dark",
          },
        }}
      >
        <NextThemesProvider
          attribute="class"
          defaultTheme="dark"
          forcedTheme="dark"
          disableTransitionOnChange
        >
          {children}
        </NextThemesProvider>
      </GoogleReCaptchaProvider>
    </SessionProvider>
  );
}
