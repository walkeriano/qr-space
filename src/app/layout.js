import localFont from "next/font/local";
import "./globals.css";


const geistMono = localFont({
  src: "./fonts/tomi.otf",
  variable: "--font-geist-mono",
  weight: "100 900",
});


const airstrike = localFont({
  src: "./fonts/airstrike.ttf",
  variable: "--font-geist-airstrike",
  weight: "100 900",
});

export const metadata = {
  title: "QR SPACE",
  description: "Generador de codigos QR",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistMono.variable} ${airstrike.variable}`}>
        {children}
      </body>
    </html>
  );
}
