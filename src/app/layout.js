import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import { ShopProvider } from "@/context/ShopContext";
import CartDrawer from "@/components/public/CartDrawer";
import { SITE_URL } from "@/config/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 1. Move themeColor to the dedicated viewport export
export const viewport = {
  themeColor: "#5c0000",
};

// 2. Remove themeColor from the metadata export
export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Naimat Bazaar | Har Dana Shifa Ka Khazana",
    template: "%s | Naimat Bazaar",
  },
  description:
    "100% Pure & Organic Herbal Wellness, Desi Ghee, Pure Honey, Spices & Natural Products delivered across Pakistan.",
  keywords: [
    "Naimat Bazaar",
    "Organic Food Pakistan",
    "Herbal Wellness Pakistan",
    "Pure Honey",
    "Desi Ghee Lahore",
    "Natural Spices",
    "Har Dana Shifa Ka Khazana",
    "Khaalis Products",
  ],
  authors: [{ name: "Naimat Bazaar" }],
  creator: "Naimat Bazaar",
  publisher: "Naimat Bazaar",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Naimat Bazaar | Har Dana Shifa Ka Khazana",
    description:
      "100% Pure & Organic Herbal Wellness, Desi Ghee, Pure Honey, Spices & Natural Products in Pakistan.",
    url: SITE_URL,
    siteName: "Naimat Bazaar",
    locale: "en_PK",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Naimat Bazaar - Pure Organic & Herbal Products",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Naimat Bazaar | Har Dana Shifa Ka Khazana",
    description:
      "100% Pure & Organic Herbal Wellness, Desi Ghee, Pure Honey & Natural Products in Pakistan.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased bg-[#5c0000]`}
    >
      <body className="min-h-screen flex flex-col bg-[#5c0000] text-gray-900 m-0 p-0">
        <AuthProvider>
          <ShopProvider>
            {children}
            <CartDrawer />
          </ShopProvider>
        </AuthProvider>
      </body>
    </html>
  );
}