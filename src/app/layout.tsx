import type { Metadata } from "next";
import Link from "next/link";
import { Fira_Code, Fira_Sans } from "next/font/google";
import "./globals.css";

const firaSans = Fira_Sans({
  variable: "--font-fira-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const firaCode = Fira_Code({
  variable: "--font-fira-code",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: { default: "Flowboard", template: "%s · Flowboard" },
  description: "Monitor and control business automation workflows.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${firaSans.variable} ${firaCode.variable} relative font-sans antialiased`}>
        {/* Decorative backdrop behind the header and page heading. */}
        <div aria-hidden="true" className="bg-grid pointer-events-none absolute inset-x-0 top-0 -z-10 h-80 opacity-40" />
        <header className="sticky top-0 z-30 border-b border-border bg-card/80 backdrop-blur-md">
          <div className="mx-auto flex h-14 max-w-6xl items-center px-4 sm:px-6">
            <Link
              href="/"
              className="group flex min-h-11 items-center gap-2 rounded-md font-semibold tracking-tight focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5 text-success transition-transform duration-(--dur-base) ease-(--ease-spring) group-hover:scale-110" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="5" cy="6" r="2.5" />
                <circle cx="19" cy="18" r="2.5" />
                <path d="M7.5 6H14a3 3 0 0 1 3 3v6.5" />
              </svg>
              Flowboard
            </Link>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</main>
      </body>
    </html>
  );
}
