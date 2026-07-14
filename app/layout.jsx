import { Spline_Sans, IBM_Plex_Mono } from "next/font/google";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./globals.css";

const splineSans = Spline_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-spline",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex",
});

export const metadata = {
  title: "CloudPulse · Team Feedback Portal",
  description:
    "Submit ideas, bugs and praise. Tagged, sentiment-scored and searchable, running serverless on AWS.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${splineSans.variable} ${plexMono.variable}`}>
      <body className="bg-page text-ink font-sans antialiased flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
