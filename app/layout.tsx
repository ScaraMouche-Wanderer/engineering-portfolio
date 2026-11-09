import type { Metadata, Viewport } from "next";
import "./globals.css";
import CyberTerminal from "@/components/CyberTerminal";
import CustomCursor from "@/components/CustomCursor";
import ScrollProgress from "@/components/ScrollProgress";
import DebugOverlay from "@/components/DebugOverlay";

export const viewport: Viewport = {
  themeColor: "#080c14",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "ScaraMouche-Wanderer | Embedded Systems & Software Architecture",
  description:
    "Portfolio of ScaraMouche-Wanderer — Electronics and Communication Engineer specializing in RTOS firmware, embedded systems, low-level C/C++/Rust architecture, IoT mesh networks, and full-stack integration.",
  keywords: [
    "ScaraMouche-Wanderer",
    "Embedded Systems Engineer",
    "Firmware Developer",
    "FreeRTOS",
    "STM32",
    "Rust Embedded",
    "C++ Systems",
    "IoT",
    "Electronics and Communication",
  ],
  authors: [{ name: "ScaraMouche-Wanderer", url: "https://github.com/ScaraMouche-Wanderer" }],
  creator: "ScaraMouche-Wanderer",
  openGraph: {
    title: "ScaraMouche-Wanderer | Embedded Systems & Software Architecture",
    description:
      "Explore interactive hardware simulators, RTOS swarms, firmware telemetry, and engineering deep dives.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "ScaraMouche-Wanderer | Embedded Systems & Software Architecture",
    description:
      "Explore interactive hardware simulators, RTOS swarms, firmware telemetry, and engineering deep dives.",
  },
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const savedTheme = localStorage.getItem('theme');
                  if (savedTheme === 'light' || (!savedTheme && window.matchMedia('(prefers-color-scheme: light)').matches)) {
                    document.documentElement.classList.add('light');
                  } else {
                    document.documentElement.classList.remove('light');
                  }
                } catch (e) {}
              })();
            `
          }}
        />
      </head>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <ScrollProgress />
        <CustomCursor />
        <CyberTerminal />
        <DebugOverlay />
        {children}
      </body>
    </html>
  );
}



