import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { CartProvider } from "@/hooks/useCart";
import { FavoritesProvider } from "@/hooks/useFavorites";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

// ✅ Pages
import Homepage from "./pages/Homepage";
import Auth from "./pages/Auth";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Category from "./pages/Category";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Favorites from "./pages/Favorites";
import Search from "./pages/Search";
import Products from "./pages/Products";
import NotFound from "./pages/NotFound";
import FAQ from "./pages/FAQ";  
import Support from "./pages/Support";  
import LiveChat from "./pages/LiveChat";  
import ShippingInfoPage from "./pages/ShippingInfoPage";   // ✅ ঠিক করা হলো
import ReturnPolicy from "./pages/ReturnPolicy";  // ✅ নতুন Return Policy Page ইমপোর্ট
import PrivacyPolicy from "./pages/PrivacyPolicy";  // ✅ নতুন PrivacyPolicy Page ইমপোর্ট

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <FavoritesProvider>
          <CartProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <div className="min-h-screen bg-background flex flex-col">
                {/* 🔝 Navbar */}
                <Navbar />

                {/* 🔗 Routes */}
                <main className="flex-1">
                  <Routes>
                    <Route path="/" element={<Homepage />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/product/:id" element={<ProductDetails />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/category/:categoryId" element={<Category />} />
                    <Route path="/dashboard" element={<UserDashboard />} />
                    <Route path="/favorites" element={<Favorites />} />
                    <Route path="/search" element={<Search />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/admin" element={<AdminDashboard />} />

                    {/* ℹ️ Extra Pages */}
                    <Route path="/faq" element={<FAQ />} />
                    <Route path="/support" element={<Support />} />
                    <Route path="/live-chat" element={<LiveChat />} />
                    <Route path="/shipping-info" element={<ShippingInfoPage />} />
                    <Route path="/return-policy" element={<ReturnPolicy />} /> {/* ✅ নতুন Return Policy Route */}
                    <Route path="/privacy-policy" element={<PrivacyPolicy />} /> {/* ✅ নতুন PrivacyPolicy */}

                    {/* 404 Fallback */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>

                {/* 🔻 Footer */}
                <Footer />
              </div>
            </BrowserRouter>
          </CartProvider>
        </FavoritesProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
