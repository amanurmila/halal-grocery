import { Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar/Navbar";
import { ThemeProvider } from "@/components/theme-provider";
import Providers from "@/components/Providers";
import { CartWishlistProvider } from "@/components/Cart/CartWishlistContext";
import { Toaster } from "sonner";
import Footer from "@/components/Footer/Footer";
import ChatWidget from "@/components/chat/ChatWidget";

const playfair = Playfair_Display({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  preload: true,
});

export const metadata = {
  title: "Halal Grocery - A Halal Food Delivery Platform",
  description:
    "Halal Grocery is a Halal food delivery platform that offers fresh, locally sourced, and sustainable food options.",
  keywords:
    "halal grocery, halal food, halal delivery, fresh food, sustainable food, grocery delivery, online grocery, online grocery delivery",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={playfair.className}>
        <Providers>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <CartWishlistProvider>
              <Navbar />
              {children}
              <ChatWidget />
              <Footer />
              <Toaster richColors position="bottom-right" />
            </CartWishlistProvider>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
