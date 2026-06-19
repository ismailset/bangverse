import React, { useState, useEffect } from "react";
import { 
  ShoppingBag, 
  Search, 
  Heart, 
  User, 
  Sun, 
  Moon, 
  ArrowRight, 
  X, 
  Plus, 
  Minus, 
  Star, 
  ShieldCheck, 
  Truck, 
  RefreshCw, 
  HelpCircle, 
  Sparkles,
  ShoppingBag as CartIcon,
  Check, 
  Info,
  Menu,
  CheckCircle2,
  Lock,
  Compass
} from "lucide-react";
import { PRODUCTS, CATEGORIES, REVIEWS, WHY_BONGVERSE } from "./data";
import { Product, CartItem } from "./types";
import ThreeShowcase from "./components/ThreeShowcase";
import AIFashionAssistant from "./components/AIFashionAssistant";

interface WishlistItemCardProps {
  key?: string;
  product: Product;
  onRemove: () => void;
  onAddToCart: (size: string) => void;
}

function WishlistItemCard({ product, onRemove, onAddToCart }: WishlistItemCardProps) {
  const [selectedSize, setSelectedSize] = useState<string>("L");

  return (
    <div className="flex flex-col sm:flex-row gap-5 p-5 bg-neutral-900/60 border border-white/5 rounded-2xl relative group overflow-hidden hover:border-blue-500/30 transition duration-300">
      
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent opacity-60 pointer-events-none" />

      {/* Product Image */}
      <div className="w-full sm:w-28 h-28 shrink-0 rounded-xl overflow-hidden bg-neutral-900 border border-white/5 relative">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition duration-505"
          referrerPolicy="no-referrer"
        />
        <span className="absolute top-2 left-2 bg-blue-600 text-white text-[8px] font-mono font-black uppercase tracking-wider px-1.5 py-0.5 rounded">
          {product.category}
        </span>
      </div>

      {/* Specs Column */}
      <div className="flex-1 flex flex-col justify-between relative z-10 text-white">
        <div>
          <div className="flex justify-between items-start gap-2">
            <h4 className="text-sm font-black tracking-tight line-clamp-1">{product.name}</h4>
            <button 
              onClick={onRemove}
              className="text-neutral-400 hover:text-red-500 transition cursor-pointer p-1 rounded hover:bg-white/5"
              title="Remove from Saved"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-[11px] text-neutral-400 font-light mt-1 line-clamp-1">
            {product.tagline}
          </p>
          <span className="text-xs font-black font-mono text-blue-400 block mt-1">৳{product.price}</span>
        </div>

        {/* Size Selection and Add to Cart action */}
        <div className="space-y-2 mt-4">
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-wider pt-0.5">Size fit:</span>
            <div className="flex gap-1">
              {product.sizes.map((sz) => (
                <button
                  key={sz}
                  onClick={() => setSelectedSize(sz)}
                  className={`px-1.5 py-0.5 text-[9px] font-mono rounded border transition cursor-pointer ${
                    selectedSize === sz
                      ? "bg-blue-600 border-blue-500 text-white font-bold"
                      : "bg-transparent border-white/10 text-neutral-405 hover:border-white/30"
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => onAddToCart(selectedSize)}
            className="w-full py-2 bg-white text-neutral-950 hover:bg-blue-600 hover:text-white text-[10px] font-extrabold uppercase tracking-wider rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
          >
            <ShoppingBag className="w-3 h-3" />
            Add To Box
          </button>
        </div>
      </div>

    </div>
  );
}

export default function App() {
  // Theme state
  const [isDark, setIsDark] = useState<boolean>(true);
  
  // Navbar glassmorphism toggle
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  
  // Shopping Cart systems
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem("bongverse_cart");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  
  // Wishlist list
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem("bongverse_wishlist");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [isWishlistOpen, setIsWishlistOpen] = useState<boolean>(false);
  
  // Search drawer & filters
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // Selected size option
  const [lastSelectedSize, setLastSelectedSize] = useState<string>("L");

  // Quick View modals
  const [activeQuickViewProduct, setActiveQuickViewProduct] = useState<Product | null>(null);

  // Checkout modal
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [checkoutComplete, setCheckoutComplete] = useState<boolean>(false);
  const [shippingForm, setShippingForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: "Dhaka",
    paymentMethod: "bKash"
  });

  // Track page scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 24) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Sync Cart state in LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem("bongverse_cart", JSON.stringify(cartItems));
    } catch (e) {
      console.error("Failed to sync cart to localStorage", e);
    }
  }, [cartItems]);

  // Sync Wishlist state in LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem("bongverse_wishlist", JSON.stringify(wishlist));
    } catch (e) {
      console.error("Failed to sync wishlist to localStorage", e);
    }
  }, [wishlist]);

  // Sync scroll lock for modals
  useEffect(() => {
    if (isCartOpen || isCheckoutOpen || isWishlistOpen || activeQuickViewProduct) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isCartOpen, isCheckoutOpen, isWishlistOpen, activeQuickViewProduct]);

  // Wishlist actions
  const toggleWishlist = (productId: string) => {
    if (wishlist.includes(productId)) {
      setWishlist(prev => prev.filter(id => id !== productId));
    } else {
      setWishlist(prev => [...prev, productId]);
    }
  };

  // Cart actions
  const addToCart = (product: Product, size: string) => {
    const existingIndex = cartItems.findIndex(
      item => item.product.id === product.id && item.selectedSize === size
    );

    if (existingIndex > -1) {
      const updated = [...cartItems];
      updated[existingIndex].quantity += 1;
      setCartItems(updated);
    } else {
      setCartItems(prev => [...prev, { product, selectedSize: size, quantity: 1 }]);
    }
    
    // Automatically trigger cart open side drawer for fluid micro-feedback
    setIsCartOpen(true);
  };

  const updateCartQuantity = (index: number, delta: number) => {
    const updated = [...cartItems];
    updated[index].quantity += delta;
    if (updated[index].quantity <= 0) {
      updated.splice(index, 1);
    }
    setCartItems(updated);
  };

  // Pricing calculations
  const cartSubtotal = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const freeShippingThreshold = 1500;
  const deliveryCharge = cartSubtotal === 0 ? 0 : (cartSubtotal >= freeShippingThreshold ? 0 : 80);
  const cartTotal = cartSubtotal + deliveryCharge;

  // Filter products by Search or Category selection
  const filteredProducts = PRODUCTS.filter(prod => {
    const matchesSearch = prod.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          prod.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || prod.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className={`${isDark ? "dark bg-[#0A0A0A] text-white" : "bg-white text-[#111111]"} min-h-screen transition-colors duration-300 font-sans selection:bg-blue-500/20`}>
      
      {/* 1. Announcement Bar */}
      <div className="w-full bg-[#111111] text-white text-[10px] mt-0 py-2.5 text-center font-semibold tracking-widest uppercase z-50 relative border-b border-white/5">
        🚚 Free Delivery on Orders Above ৳1500 • Inside Dhaka 24h Delivery
      </div>

      {/* 2. Premium Navbar */}
      <header className={`sticky top-0 z-40 transition-all duration-300 glass`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between py-1.5">
          
          {/* Logo element */}
          <a href="#" className="flex items-center gap-2 group py-1.5">
            <span className="text-xl sm:text-2xl font-black tracking-tighter text-neutral-900 dark:text-white transition group-hover:scale-105 uppercase">
              BongVerse
            </span>
            <span className="text-[10px] font-sans font-bold bg-blue-600 text-white px-2 py-0.5 rounded hidden sm:inline tracking-wider">
              STUDENT ROAD
            </span>
          </a>

          {/* Nav Links with Bold Typography theme spacing and uppercase */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-wider">
            <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition">Home</a>
            <a href="#shop-section" className="hover:text-blue-600 dark:hover:text-blue-400 transition">Shop</a>
            <a 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                setIsWishlistOpen(true);
              }}
              className="hover:text-blue-600 dark:hover:text-blue-400 transition flex items-center gap-1.5 cursor-pointer"
            >
              Wishlist
              {wishlist.length > 0 && (
                <span className="bg-red-500 text-white text-[9px] px-1.5 py-0.5 rounded-full font-sans tracking-normal font-bold">
                  {wishlist.length}
                </span>
              )}
            </a>
            <a href="#showcase-section" className="hover:text-blue-600 dark:hover:text-blue-400 transition">3D Studio</a>
            <a href="#ai-assistant-section" className="hover:text-blue-600 dark:hover:text-blue-400 transition flex items-center gap-1 text-blue-600 dark:text-blue-400">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" /> AI Stylist
            </a>
            <a href="#why-section" className="hover:text-blue-600 dark:hover:text-blue-400 transition">About</a>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 sm:gap-4 font-sans">
            
            {/* Search toggler button */}
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-all cursor-pointer"
              aria-label="Search items"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Wishlist button */}
            <button 
              onClick={() => setIsWishlistOpen(true)}
              className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-900 transition relative cursor-pointer"
              aria-label="Wishlist items"
            >
              <Heart className={`w-4 h-4 ${wishlist.length > 0 ? "fill-red-500 text-red-500" : ""}`} />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Icon button */}
            <button 
              onClick={() => setIsCartOpen(true)}
              className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-900 transition relative cursor-pointer"
              aria-label="Open cart"
            >
              <ShoppingBag className="w-4 h-4" />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                </span>
              )}
            </button>

            {/* Theme Toggle */}
            <button 
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-all text-neutral-650 dark:text-neutral-300 cursor-pointer"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-950" />}
            </button>

            <a 
              href="#shop-section" 
              className="hidden sm:inline-flex items-center px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-white bg-neutral-950 hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100 transition whitespace-nowrap"
            >
              Shop Collection
            </a>
          </div>

        </div>
      </header>

      {/* 3. Hero Section (Cinematic Photoregistered Canvas) */}
      <section className="relative w-full min-h-[92vh] flex items-center justify-center overflow-hidden bg-neutral-900 select-none">
        
        {/* Background Image with elegant dramatic parallax styling */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/src/assets/images/hero_streetwear_photoshoot_1781890245748.jpg" 
            alt="BongVerse Dhaka Streetwear Fashion Collective" 
            className="w-full h-full object-cover opacity-60 scale-105 motion-safe:animate-subtle-zoom"
            referrerPolicy="no-referrer"
          />
          {/* Visual grading dark gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/40 to-black/70 z-10" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 text-center space-y-8 py-20 flex flex-col items-center">
          
          <div className="space-y-4 max-w-4xl">
            {/* Visual branding capsule */}
            <div className="inline-block px-3 py-1 bg-blue-50/10 text-blue-400 border border-blue-500/20 backdrop-blur-sm tracking-widest text-[10px] uppercase font-bold rounded mb-4">
              🇧🇩 The Campus Collection 2026
            </div>
            
            <h1 className="text-[52px] sm:text-[76px] lg:text-[88px] leading-[0.85] font-extrabold tracking-tighter mb-6 text-white uppercase select-none">
              Wear Your <br className="sm:hidden" />
              <span className="text-blue-500">Identity.</span>
            </h1>

            <p className="max-w-md mx-auto text-sm sm:text-base lg:text-lg text-neutral-300 leading-relaxed font-light mb-8">
              Premium streetwear designed for the next generation of Bangladesh. Authenticity stitched into every fiber.
            </p>
          </div>

          {/* Action Callouts with premium btn-shadow and outline */}
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
            <a 
              href="#shop-section"
              className="w-full sm:w-auto px-10 py-4 rounded-full text-xs uppercase font-extrabold tracking-wider text-white bg-[#2563EB] hover:bg-blue-700 transition btn-shadow flex items-center justify-center gap-2 group cursor-pointer"
            >
              Shop Now 
              <ArrowRight className="w-4 h-4 transition group-hover:translate-x-1" />
            </a>
            <a 
              href="#showcase-section"
              className="w-full sm:w-auto px-10 py-4 rounded-full text-xs uppercase font-bold tracking-wider text-white bg-transparent hover:bg-white hover:text-black border border-white transition backdrop-blur-sm flex items-center justify-center cursor-pointer"
            >
              Explore
            </a>
          </div>

          {/* Bottom Floating Stats Bar */}
          <div className="w-full pt-16 max-w-5xl">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-2.5 p-6 rounded-2xl bg-black/60 dark:bg-black/40 border border-white/10 backdrop-blur-md">
              <div className="space-y-1 text-center sm:border-r border-white/10 last:border-0 pb-4 sm:pb-0">
                <span className="block text-2xl sm:text-3xl font-black text-white font-mono">10,000+</span>
                <span className="block text-xs font-mono uppercase text-neutral-400 tracking-wider">Happy Students</span>
              </div>
              <div className="space-y-1 text-center sm:border-r border-white/10 last:border-0 pb-4 sm:pb-0">
                <span className="block text-2xl sm:text-3xl font-black text-white font-mono">100%</span>
                <span className="block text-xs font-mono uppercase text-neutral-400 tracking-wider">Premium Bangladeshi Combed Cotton</span>
              </div>
              <div className="space-y-1 text-center">
                <span className="block text-2xl sm:text-3xl font-black text-white font-mono">Nationwide</span>
                <span className="block text-xs font-mono uppercase text-neutral-400 tracking-wider">COD & bKash Delivery</span>
              </div>
            </div>
          </div>

        </div>

        {/* Cinematic bottom wave/fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0A0A0A] to-transparent pointer-events-none" />
      </section>

      {/* 4. 3D Interactive Fashion Showcase */}
      <section id="showcase-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 scroll-mt-20">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-10">
          <span className="text-xs font-mono uppercase tracking-widest text-[#2563EB] dark:text-[#3B82F6] font-bold">
            01 / INTERACTIVE SHADOWS & FABRIC
          </span>
          <h2 className="text-4xl sm:text-6xl font-sans font-extrabold tracking-tighter uppercase mb-2">
            3D Studio Collective
          </h2>
          <p className="text-sm text-neutral-505 dark:text-neutral-400 leading-relaxed font-light">
            Real dynamic shadows and volumetric vertices model our oversized boxy fit. Toggle prints, test alignments, and explore heavy premium fabrics.
          </p>
        </div>
        
        <ThreeShowcase />
      </section>

      {/* 5. Featured Categories Panel */}
      <section className="bg-neutral-50 dark:bg-[#0E0E10] py-16 transition-all duration-350">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase tracking-widest text-[#2563EB] dark:text-[#3B82F6] font-semibold">
                02 / CURATED COLLECTIONS
              </span>
              <h2 className="text-4xl sm:text-5xl font-sans font-extrabold tracking-tighter uppercase mb-2">
                Designed for Campus Lifestyle
              </h2>
            </div>
            <p className="max-w-md text-sm text-neutral-500 dark:text-neutral-450 font-light leading-relaxed">
              Carefully engineered fabric geometries adapted for active student routines, examinations, late-night tea hangouts, and winter fests.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {CATEGORIES.map((cat, index) => (
              <div 
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.name);
                  const shopSec = document.getElementById("shop-section");
                  if (shopSec) shopSec.scrollIntoView({ behavior: "smooth" });
                }}
                className="group relative h-[380px] rounded-2xl overflow-hidden shadow-md cursor-pointer border border-neutral-200/40 dark:border-neutral-900/40 transition-all duration-300 transform hover:-translate-y-1.5"
              >
                {/* Image scaling layer */}
                <div className="absolute inset-0 z-0">
                  <img 
                    src={cat.image} 
                    alt={cat.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent opacity-85" />
                </div>
                
                {/* Content Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 z-10 flex flex-col justify-end h-1/2 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-white tracking-tight">{cat.name}</h3>
                    <span className="text-[10px] font-mono tracking-wider font-semibold uppercase text-blue-400 bg-blue-950/60 px-2.5 py-1 rounded-full border border-blue-900/40">
                      {cat.count}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-350 dark:text-neutral-300 font-light leading-relaxed">
                    {cat.tagline}
                  </p>
                  
                  <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-white group-hover:text-blue-400 transition-colors pt-2 uppercase">
                    Explore collection
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 6. Best Sellers Catalog */}
      <section id="shop-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 scroll-mt-20">
        
        <div className="flex flex-col items-center text-center space-y-4 mb-12">
          <span className="text-xs font-mono uppercase tracking-widest text-[#2563EB] dark:text-[#3B82F6] font-black">
            03 / ORIGINAL BONGVERSE APPAREL
          </span>
          <h2 className="text-4xl sm:text-6xl font-sans font-extrabold tracking-tighter uppercase mb-2 text-neutral-900 dark:text-white">
            Bestselling Campus Uniforms
          </h2>
          <p className="text-sm text-neutral-500 max-w-xl font-light">
            Premium oversized cuts, pre-washed for zero shrinkage. Heavy cotton textures tailored local to Dhaka's humid and dual-seasons climates.
          </p>

          {/* Filtering buttons */}
          <div className="flex items-center flex-wrap justify-center gap-2.5 pt-6 z-10">
            {["All", "T-Shirts", "Shirts", "Pants", "Hoodies"].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4.5 py-2 rounded-full text-xs font-medium font-mono border tracking-wide transition-all uppercase cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-blue-600 tracking-wide border-blue-550 text-white shadow-md dark:bg-blue-600 dark:border-blue-500"
                    : "bg-white border-neutral-200 text-neutral-600 hover:border-neutral-350 dark:bg-neutral-850 dark:border-neutral-800 dark:text-neutral-400 dark:hover:border-neutral-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Shop Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredProducts.map((product) => {
            const hasInWishlist = wishlist.includes(product.id);
            return (
              <div 
                key={product.id}
                className="group relative flex flex-col rounded-2xl bg-white dark:bg-[#0E0E10] border border-neutral-150 dark:border-neutral-850 overflow-hidden shadow-sm transition-all duration-300 hover:shadow-xl hover:border-blue-500/20"
              >
                {/* Images core */}
                <div className="relative aspect-square overflow-hidden bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-104"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Category badging */}
                  <span className="absolute top-3 left-3 bg-neutral-900/85 backdrop-blur-sm dark:bg-black/75 text-white text-[9px] font-mono tracking-widest uppercase font-bold px-2.5 py-1 rounded-md border border-white/5">
                    {product.category}
                  </span>

                  {/* Rating indicator */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2 py-1 rounded bg-black/60 backdrop-blur-sm border border-white/5 text-[10px] text-white">
                    <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                    <span className="font-bold">{product.rating}</span>
                    <span className="text-neutral-300">({product.reviewsCount})</span>
                  </div>

                  {/* Wishlist floating heart */}
                  <button 
                    onClick={() => toggleWishlist(product.id)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-white/90 dark:bg-neutral-900/90 text-neutral-600 dark:text-neutral-400 hover:text-red-500 dark:hover:text-red-400 hover:scale-105 shadow transition"
                    aria-label="Add to wishlist"
                  >
                    <Heart className={`w-4 h-4 ${hasInWishlist ? "fill-red-500 text-red-500" : ""}`} />
                  </button>

                  {/* Immersive quick view button (appears on hover) */}
                  <div className="absolute inset-0 bg-black/35 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      onClick={() => setActiveQuickViewProduct(product)}
                      className="px-5 py-3 rounded-full text-xs font-bold bg-white text-neutral-950 focus:scale-95 shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all cursor-pointer hover:bg-neutral-55"
                    >
                      Quick Studio View
                    </button>
                  </div>
                </div>

                {/* Content details */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <h3 className="text-md font-bold tracking-tight text-neutral-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-xs text-neutral-500 dark:text-neutral-450 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                    <span className="text-[10px] font-mono text-neutral-400 block pb-1 border-b border-neutral-100 dark:border-neutral-850">
                      {product.tagline}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-3.5 mt-auto">
                    <div className="space-y-0.5">
                      <span className="text-[10px] uppercase font-semibold text-neutral-400 block leading-none font-mono">Student Price</span>
                      <span className="text-lg font-black font-sans text-neutral-900 dark:text-white">৳{product.price}</span>
                    </div>

                    <button
                      onClick={() => addToCart(product, lastSelectedSize)}
                      className="px-4 py-2 bg-blue-600 dark:bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1 shadow-md hover:scale-[1.02] scale-100"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Box
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-20 bg-neutral-50 dark:bg-neutral-900/30 rounded-2xl border border-dashed border-neutral-200 dark:border-neutral-800 space-y-3">
            <RefreshCw className="w-10 h-10 text-neutral-400 mx-auto animate-spin-slow" />
            <h3 className="text-lg font-bold text-neutral-700 dark:text-white">No items fit the search filter</h3>
            <p className="text-xs text-neutral-500">Try switching your category filters or type another keyword.</p>
            <button
              onClick={() => { setSelectedCategory("All"); setSearchQuery(""); }}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold cursor-pointer"
            >
              See All Items
            </button>
          </div>
        )}
      </section>

      {/* 7. Why BongVerse */}
      <section id="why-section" className="bg-neutral-50 dark:bg-[#0C0C0E] py-20 border-y border-neutral-200/30 dark:border-neutral-900/30 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
            <span className="text-xs font-mono uppercase tracking-widest text-[#2563EB] dark:text-[#3B82F6] font-bold">
              04 / THE BONGVERSE STANDARD
            </span>
            <h2 className="text-4xl sm:text-5xl font-sans font-extrabold tracking-tighter uppercase mb-2 text-neutral-900 dark:text-white">
              Why BongVerse?
            </h2>
            <p className="text-sm text-neutral-500 font-light">
              We started with a single goal: build international grade street designs locally, making high-end custom styles fair and accessible for Bangladeshi university students.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {WHY_BONGVERSE.map((wq, i) => {
              // Custom graphic accents
              return (
                <div 
                  key={wq.id}
                  className="p-8 rounded-2xl bg-white dark:bg-[#121215] border border-neutral-200/40 dark:border-neutral-850/60 shadow-sm hover:shadow-md transition-shadow group space-y-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center border border-blue-100 dark:border-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-mono font-bold group-hover:scale-105 transition-transform">
                    {i + 1}
                  </div>
                  <h3 className="text-lg font-bold text-neutral-900 dark:text-white tracking-tight">{wq.title}</h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-450 leading-relaxed font-light">
                    {wq.description}
                  </p>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 8. AI Fashion Assistant Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <AIFashionAssistant />
      </section>

      {/* 9. Customer Reviews */}
      <section className="bg-neutral-50 dark:bg-[#0E0E10] py-20 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-16 text-center md:text-left">
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase tracking-widest text-[#2563EB] dark:text-[#3B82F6] font-extrabold">
                05 / STUDENT REVIEWS
              </span>
              <h2 className="text-4xl sm:text-5xl font-sans font-extrabold tracking-tighter uppercase mb-2 text-neutral-900 dark:text-white leading-none">
                Vouched By Leaders across Dhaka Campuses
              </h2>
            </div>
            <p className="max-w-md text-sm text-neutral-500 dark:text-neutral-400 font-light leading-relaxed">
              Real opinions from real active student bodies wearing BongVerse oversized apparel in classrooms, labs, and winter concerts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {REVIEWS.map((rev) => (
              <div 
                key={rev.id}
                className="p-6 rounded-2xl bg-white/80 dark:bg-[#121215]/80 border border-neutral-200/50 dark:border-neutral-850/50 backdrop-blur-sm flex flex-col justify-between shadow-sm"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-1 text-yellow-500 text-xs">
                    {[...Array(rev.rating)].map((_, idx) => (
                      <Star key={idx} className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
                    ))}
                  </div>
                  
                  <p className="text-xs text-neutral-700 dark:text-neutral-350 italic leading-relaxed font-light">
                    "{rev.comment}"
                  </p>
                </div>

                <div className="flex items-center gap-3.5 pt-6 mt-6 border-t border-neutral-100 dark:border-neutral-850/40">
                  <img 
                    src={rev.avatar} 
                    alt={rev.name} 
                    className="w-10 h-10 rounded-full border border-neutral-250/20"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-neutral-900 dark:text-white leading-tight">{rev.name}</h4>
                    <span className="text-[10px] font-mono text-neutral-450 dark:text-neutral-500">{rev.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 10. Featured Collection Banner (Volumetric Campus Collective) */}
      <section className="relative w-full h-[530px] flex items-center justify-center overflow-hidden bg-neutral-900">
        
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/src/assets/images/campus_collection_1781890311661.jpg" 
            alt="BongVerse Campus Collection 226" 
            className="w-full h-full object-cover opacity-65"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent z-10" />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-20 text-center space-y-6">
          <span className="text-xs font-mono tracking-widest text-[#3B82F6] font-black uppercase bg-blue-950/40 border border-blue-500/20 px-3 py-1.5 rounded-full backdrop-blur-sm inline-block">
            STREET EDIT • EXCLUSIVE
          </span>
          <h2 className="text-4xl sm:text-6xl font-sans font-black tracking-tight text-white leading-tight uppercase">
            The Campus Collection 2026
          </h2>
          <p className="max-w-lg mx-auto text-sm sm:text-base text-neutral-200 font-light leading-relaxed">
            A celebration of student autonomy, brutalist structural elements, and classical Bangladeshi art motifs. Available in strictly limited edition weights.
          </p>

          <div className="pt-4 animate-bounce">
            <a 
              href="#shop-section"
              className="inline-flex items-center px-8 py-4 rounded-full text-xs uppercase font-extrabold tracking-widest text-neutral-950 bg-white hover:bg-neutral-100 transition shadow-xl"
            >
              Shop Collection
            </a>
          </div>
        </div>

      </section>

      {/* 11. Newsletter Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-6">
        <span className="text-xs font-mono uppercase tracking-widest text-blue-600 dark:text-blue-500 font-bold">
          🇧🇩 LOCAL ROOTED, STREET MINDED
        </span>
        <h2 className="text-3xl sm:text-5xl font-sans font-black tracking-tight text-neutral-904">
          Join the BongVerse Community
        </h2>
        <p className="max-w-lg mx-auto text-sm text-neutral-500 dark:text-neutral-450 leading-relaxed font-light">
          Get exclusive drops alerts before they post at BRAC or BUET, custom style guide book, and automatic discount slots directly in your inbox.
        </p>

        <form 
          onSubmit={(e) => {
            e.preventDefault();
            alert("Shoron! Welcome to the BongVerse Street Collective. Check your inbox for custom drop alerts soon!");
          }}
          className="max-w-md mx-auto flex gap-2 pt-2.5"
        >
          <input 
            type="email" 
            required
            placeholder="Type your student email address..." 
            className="flex-1 px-4.5 py-3.5 text-xs bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 rounded-full focus:outline-none focus:border-blue-500 text-neutral-900 dark:text-white"
          />
          <button 
            type="submit"
            className="px-6 py-3 rounded-full text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition cursor-pointer flex-shrink-0"
          >
            Subscribe
          </button>
        </form>
      </section>

      {/* 12. Premium Footer */}
      <footer className="bg-neutral-950 text-[#C1C1CB] py-16 border-t border-neutral-900/60 font-sans tracking-wide">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-5 gap-10">
          
          <div className="col-span-2 space-y-5">
            <a href="#" className="text-2xl font-black text-white font-mono tracking-tighter">
              BongVerse
            </a>
            <p className="text-xs text-neutral-400 leading-relaxed max-w-sm">
              We build functional streetwear of international spec standard, locally stitched, for the next generation of Bangladesh. High design, heavy weights, zero compromise.
            </p>
            <div className="flex gap-4 pt-1 text-sm text-neutral-400">
              <a href="#" className="hover:text-blue-400 font-mono text-xs">Facebook</a>
              <a href="#" className="hover:text-blue-400 font-mono text-xs">Instagram</a>
              <a href="#" className="hover:text-blue-400 font-mono text-xs">TikTok</a>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">Shop</h4>
            <ul className="text-xs space-y-3 font-light text-neutral-400">
              <li><a href="#shop-section" className="hover:text-white transition">All Streetwear</a></li>
              <li><a href="#shop-section" className="hover:text-white transition">Washed T-Shirts</a></li>
              <li><a href="#shop-section" className="hover:text-white transition">Utility Shirts</a></li>
              <li><a href="#shop-section" className="hover:text-white transition">Canvas Cargos</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">Company</h4>
            <ul className="text-xs space-y-3 font-light text-neutral-400">
              <li><a href="#why-section" className="hover:text-white transition">The Craft</a></li>
              <li><a href="#" className="hover:text-white transition">Studio Logbook</a></li>
              <li><a href="#" className="hover:text-white transition">Campus Partners</a></li>
              <li><a href="#" className="hover:text-white transition">Sustainability</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">Support</h4>
            <ul className="text-xs space-y-3 font-light text-neutral-400">
              <li><a href="#" className="hover:text-white transition">Exchange Portal</a></li>
              <li><a href="#" className="hover:text-white transition">Sizing Chart Guide</a></li>
              <li><a href="#" className="hover:text-white transition">COD Terms</a></li>
              <li><a href="#" className="hover:text-white transition">Contact Studio</a></li>
            </ul>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-14 pt-8 border-t border-neutral-900/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-[10px] text-neutral-500 font-mono tracking-widest">
            © 2026 BONGVERSE STUDIOS. ALL RIGHTS RESERVED.
          </span>
          <div className="flex items-center gap-2 text-[10px] text-neutral-500 font-mono">
            <span>DESIGN BY</span>
            <span className="text-white">APPLE x NIKE COLLECTIVE</span>
          </div>
        </div>
      </footer>

      {/* --- SIDEBAR DRAWERS & ACTION MODALS --- */}

      {/* a. SEARCH PANEL DRAWER */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden font-sans">
          {/* Overlay */}
          <div 
            onClick={() => setIsSearchOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
          />
          
          <div className="absolute top-0 left-0 right-0 bg-white dark:bg-[#0C0C0E] border-b border-neutral-200 dark:border-neutral-900 p-6 shadow-2xl transition-all duration-300 transform translate-y-0 text-neutral-900 dark:text-white">
            <div className="max-w-3xl mx-auto space-y-6">
              
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono tracking-wider font-bold text-blue-600 uppercase">Search active inventory</span>
                <button 
                  onClick={() => setIsSearchOpen(false)}
                  className="p-1.5 rounded-full hover:bg-neutral-150 dark:hover:bg-neutral-850"
                  aria-label="Close search"
                >
                  <X className="w-5 h-5 text-neutral-500" />
                </button>
              </div>

              <div className="relative">
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Type anything (e.g. Shonalu, Cargo, Hoodie)..."
                  className="w-full text-lg font-bold px-4 py-3.5 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl focus:outline-none focus:border-blue-500 placeholder-neutral-450 dark:text-white"
                  autoFocus
                />
                <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
              </div>

              <div className="flex items-center gap-2.5">
                <span className="text-xs text-neutral-450 font-mono">Suggested filters:</span>
                {["All", "T-Shirts", "Shirts", "Pants"].map(tag => (
                  <button
                    key={tag}
                    onClick={() => {
                      setSelectedCategory(tag);
                      setIsSearchOpen(false);
                      const shopS = document.getElementById("shop-section");
                      if (shopS) shopS.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="px-3 py-1.5 rounded-full text-[11px] font-mono border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-850 text-neutral-700 dark:text-neutral-350"
                  >
                    {tag}
                  </button>
                ))}
              </div>

            </div>
          </div>
        </div>
      )}

      {/* b. CART DRAWER (RIGHT PANEL) */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden font-sans">
          {/* Transparent Overlay */}
          <div 
            onClick={() => setIsCartOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity" 
          />

          <div className="absolute top-0 right-0 bottom-0 w-full max-w-md bg-white dark:bg-[#0A0A0C] border-l border-neutral-200/40 dark:border-neutral-900 shadow-2xl p-6 flex flex-col justify-between text-neutral-905 dark:text-white">
            
            {/* Cart Header */}
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-900">
                <div className="flex items-center gap-2">
                  <CartIcon className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-black tracking-tight uppercase">Your Street Box</h3>
                  <span className="text-xs bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 px-2.5 py-0.5 rounded-full font-mono">
                    {cartItems.reduce((acc, item) => acc + item.quantity, 0)} Items
                  </span>
                </div>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="p-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-900"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Free delivery calculation slider */}
              <div className="py-4 border-b border-neutral-100 dark:border-neutral-900 space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  {cartSubtotal >= freeShippingThreshold ? (
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                      🎉 You earned FREE shipping!
                    </span>
                  ) : (
                    <span>Add <strong className="text-blue-600 font-mono">৳{freeShippingThreshold - cartSubtotal}</strong> more for free delivery</span>
                  )}
                  <span>৳{cartSubtotal} / ৳{freeShippingThreshold}</span>
                </div>
                <div className="w-full h-1 bg-neutral-100 dark:bg-neutral-850 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 rounded-full transition-all duration-300" 
                    style={{ width: `${Math.min(100, (cartSubtotal / freeShippingThreshold) * 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Cart list details */}
            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              {cartItems.length === 0 ? (
                <div className="text-center py-20 space-y-3 font-sans">
                  <CartIcon className="w-12 h-12 text-neutral-300 mx-auto" />
                  <h4 className="text-sm font-bold text-neutral-600 dark:text-neutral-400">Your Street Box is empty</h4>
                  <p className="text-xs text-neutral-400">Head over to the catalog to choose your student outfit.</p>
                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      const shopS = document.getElementById("shop-section");
                      if (shopS) shopS.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="px-4 py-2 border border-neutral-250 dark:border-neutral-800 rounded-xl text-xs font-semibold hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                cartItems.map((item, idx) => (
                  <div 
                    key={`${item.product.id}-${item.selectedSize}`}
                    className="flex gap-4 p-3 rounded-xl bg-neutral-50 dark:bg-[#121215] border border-neutral-200/40 dark:border-neutral-850/60"
                  >
                    <img 
                      src={item.product.image} 
                      alt={item.product.name} 
                      className="w-16 h-16 rounded-lg object-cover bg-neutral-100"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h4 className="text-xs font-bold leading-tight line-clamp-1">{item.product.name}</h4>
                          <span className="text-xs font-black font-mono">৳{item.product.price}</span>
                        </div>
                        <span className="text-[10px] text-neutral-400 font-mono uppercase block mt-1">
                          Size: {item.selectedSize}
                        </span>
                      </div>

                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-neutral-200/40 dark:border-neutral-800/40">
                        {/* Quantity helpers */}
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => updateCartQuantity(idx, -1)}
                            className="p-1 rounded bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-500 hover:text-black transition cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold font-mono">{item.quantity}</span>
                          <button 
                            onClick={() => updateCartQuantity(idx, 1)}
                            className="p-1 rounded bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-500 hover:text-black transition cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button 
                          onClick={() => updateCartQuantity(idx, -item.quantity)}
                          className="text-[10px] text-red-500 hover:underline font-mono uppercase cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Bottom calculation bar for drawer */}
            {cartItems.length > 0 && (
              <div className="border-t border-neutral-200 dark:border-neutral-900 pt-4 space-y-4">
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-neutral-500">
                    <span>Subtotal</span>
                    <span className="font-mono">৳{cartSubtotal}</span>
                  </div>
                  <div className="flex justify-between text-neutral-500">
                    <span>Delivery Charge</span>
                    <span className="font-mono">{deliveryCharge === 0 ? "FREE" : `৳${deliveryCharge}`}</span>
                  </div>
                  <div className="flex justify-between font-bold text-sm text-neutral-900 dark:text-white pt-2 border-t border-neutral-100 dark:border-neutral-900">
                    <span>Total Bill</span>
                    <span className="font-mono text-lg">৳{cartTotal}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setIsCheckoutOpen(true);
                  }}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition text-center text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Lock className="w-4 h-4" />
                  Secure Student Checkout
                </button>
                <p className="text-[10px] text-center text-neutral-400">
                  Easy bKash, cash-on-delivery, and campus dropoffs.
                </p>
              </div>
            )}

          </div>
        </div>
      )}

      {/* c. QUICK STUDIO PRODUCT DETAILS MODAL */}
      {activeQuickViewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-hidden font-sans">
          <div 
            onClick={() => setActiveQuickViewProduct(null)}
            className="absolute inset-0 bg-black/75 backdrop-blur-xs transition-opacity" 
          />

          <div className="relative w-full max-w-4xl bg-white dark:bg-[#0C0C0E] border border-neutral-200/40 dark:border-neutral-950 rounded-3xl overflow-hidden shadow-2xl z-10 text-neutral-905 dark:text-white flex flex-col md:flex-row max-h-[90vh]">
            
            {/* Close modal */}
            <button 
              onClick={() => setActiveQuickViewProduct(null)}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 text-white hover:bg-black/90 transition-all border border-white/10"
              aria-label="Close details"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Left side: Premium image and features */}
            <div className="md:w-1/2 relative bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center sm:h-[400px] md:h-auto overflow-hidden">
              <img 
                src={activeQuickViewProduct.image} 
                alt={activeQuickViewProduct.name} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black via-black/30 to-transparent text-white space-y-1">
                <span className="text-[10px] font-mono text-blue-400 tracking-widest font-black uppercase">fabric spec:</span>
                <p className="text-xs text-neutral-200 line-clamp-3">
                  {activeQuickViewProduct.tagline}
                </p>
              </div>
            </div>

            {/* Right side: details and sizes selector */}
            <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto max-h-[50vh] md:max-h-none">
              
              <div className="space-y-4">
                <div className="flex items-center gap-1 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-105 px-2.5 py-1 rounded-md text-[10px] font-mono font-black uppercase w-fit leading-none">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  Premium Class Rating {activeQuickViewProduct.rating}/5
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-xl sm:text-2xl font-black">{activeQuickViewProduct.name}</h3>
                  <span className="text-xl font-black text-neutral-900 dark:text-white font-mono block">৳{activeQuickViewProduct.price}</span>
                </div>

                <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed font-light">
                  {activeQuickViewProduct.description}
                </p>

                {/* Sizes Selector */}
                <div className="space-y-2">
                  <span className="text-[11px] font-mono uppercase text-neutral-450 tracking-wider block">1. Select Oversized Sizing:</span>
                  <div className="flex gap-2.5">
                    {activeQuickViewProduct.sizes.map(size => (
                      <button
                        key={size}
                        onClick={() => setLastSelectedSize(size)}
                        className={`w-9 h-9 text-xs rounded-lg border font-mono font-extrabold flex items-center justify-center transition cursor-pointer ${
                          lastSelectedSize === size
                            ? "bg-blue-600 border-blue-550 text-white dark:bg-blue-600 dark:border-blue-500"
                            : "bg-neutral-50 border-neutral-200 text-neutral-700 hover:border-neutral-350 dark:bg-neutral-900 dark:border-neutral-800 dark:text-neutral-400"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                  <span className="text-[9px] font-mono text-neutral-400 flex items-center gap-1 pt-1">
                    <Info className="w-3 h-3 text-blue-500" /> Fits are broad boxy. Pick standard size for heavy drop shoulders.
                  </span>
                </div>

                {/* Product details bullet listing */}
                <div className="space-y-2 pt-2 border-t border-neutral-100 dark:border-neutral-900">
                  <span className="text-[11px] font-mono uppercase text-neutral-450 tracking-wider block">2. Tailoring Highlights:</span>
                  <ul className="text-xs text-neutral-600 dark:text-neutral-450 space-y-1.5 list-disc pl-4 font-light leading-relaxed">
                    {activeQuickViewProduct.details.map((detail, idx) => (
                      <li key={idx}>{detail}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Add to Cart button */}
              <div className="pt-6 mt-6 border-t border-neutral-100 dark:border-neutral-900 flex gap-3">
                <button
                  onClick={() => {
                    addToCart(activeQuickViewProduct, lastSelectedSize);
                    setActiveQuickViewProduct(null);
                  }}
                  className="flex-1 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Add to Street Box (size: {lastSelectedSize})
                </button>
                <button 
                  onClick={() => {
                    toggleWishlist(activeQuickViewProduct.id);
                  }}
                  className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition flex items-center justify-center"
                  aria-label="Wishlist toggle"
                >
                  <Heart className={`w-4 h-4 ${wishlist.includes(activeQuickViewProduct.id) ? "fill-red-500 text-red-500" : ""}`} />
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* d. CUSTOM CHECKOUT MODAL WINDOW WITH bKASH INTEGRATION */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-hidden font-sans">
          <div 
            onClick={() => setIsCheckoutOpen(false)}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" 
          />

          <div className="relative w-full max-w-lg bg-white dark:bg-[#0C0C0E] border border-neutral-200/40 dark:border-neutral-950 rounded-3xl overflow-hidden shadow-2xl z-10 text-neutral-905 dark:text-white p-6 sm:p-8 flex flex-col justify-between max-h-[90vh]">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-rose-100 dark:border-neutral-900">
              <h3 className="text-lg font-black tracking-tight uppercase flex items-center gap-2">
                <Lock className="w-5 h-5 text-blue-600" />
                Student Checkout Port
              </h3>
              <button 
                onClick={() => setIsCheckoutOpen(false)}
                className="p-1 rounded-full hover:bg-neutral-50 dark:hover:bg-neutral-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content area */}
            <div className="flex-1 overflow-y-auto py-6 space-y-5">
              {!checkoutComplete ? (
                <>
                  <div className="p-4 bg-blue-50/70 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 rounded-xl space-y-2">
                    <span className="text-[10px] font-mono text-blue-600 dark:text-blue-400 block font-bold uppercase">Order summary:</span>
                    <div className="flex justify-between text-xs font-mono">
                      <span>Streetwear Items Count:</span>
                      <span className="font-bold">{cartItems.reduce((acc, item) => acc + item.quantity, 0)}</span>
                    </div>
                    <div className="flex justify-between text-xs font-mono">
                      <span>Total Due (incl Delivery):</span>
                      <span className="font-black text-blue-600 dark:text-blue-400">৳{cartTotal}</span>
                    </div>
                  </div>

                  {/* Form */}
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      setCheckoutComplete(true);
                      setCartItems([]);
                    }}
                    className="space-y-4"
                  >
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-neutral-450 uppercase font-bold block">Your Name</label>
                      <input 
                        type="text" 
                        required
                        value={shippingForm.name}
                        onChange={(e) => setShippingForm({...shippingForm, name: e.target.value})}
                        placeholder="Type standard name..." 
                        className="w-full px-4 py-3 text-xs bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850 rounded-xl focus:outline-none focus:border-blue-500 dark:text-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-neutral-450 uppercase font-bold block">Phone Number (bKash/COD lookup)</label>
                      <input 
                        type="tel" 
                        required
                        value={shippingForm.phone}
                        onChange={(e) => setShippingForm({...shippingForm, phone: e.target.value})}
                        placeholder="017xxxxxxxx..." 
                        className="w-full px-4 py-3 text-xs bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850 rounded-xl focus:outline-none focus:border-blue-500 dark:text-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-neutral-450 uppercase font-bold block">Delivery Address (Hostel name, Block/Street)</label>
                      <textarea 
                        required
                        value={shippingForm.address}
                        onChange={(e) => setShippingForm({...shippingForm, address: e.target.value})}
                        placeholder="e.g. BRAC University Dormity, Mohakhali, Dhaka" 
                        rows={2}
                        className="w-full px-4 py-3 text-xs bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850 rounded-xl focus:outline-none focus:border-blue-500 dark:text-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono text-neutral-450 uppercase font-bold block">City Selection</label>
                        <select 
                          value={shippingForm.city}
                          onChange={(e) => setShippingForm({...shippingForm, city: e.target.value})}
                          className="w-full px-4 py-3 text-xs bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850 rounded-xl focus:outline-none focus:border-blue-500 dark:text-white cursor-pointer"
                        >
                          <option value="Dhaka">Dhaka (24-48h)</option>
                          <option value="Chittagong">Chittagong (48-72h)</option>
                          <option value="Sylhet">Sylhet (48-72h)</option>
                          <option value="Rajshahi">Rajshahi (48-72h)</option>
                          <option value="Khulna">Khulna</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-mono text-neutral-450 uppercase font-bold block">Payment Method</label>
                        <select 
                          value={shippingForm.paymentMethod}
                          onChange={(e) => setShippingForm({...shippingForm, paymentMethod: e.target.value})}
                          className="w-full px-4 py-3 text-xs bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850 rounded-xl focus:outline-none focus:border-blue-500 dark:text-white cursor-pointer"
                        >
                          <option value="bKash">bKash (Send Money)</option>
                          <option value="Nagad">Nagad Transfer</option>
                          <option value="COD">Cash on Delivery</option>
                        </select>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition shadow-md mt-4 cursor-pointer"
                    >
                      Process Checkout Match (৳{cartTotal})
                    </button>
                  </form>
                </>
              ) : (
                <div className="text-center py-8 space-y-4">
                  <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto animate-bounce" />
                  <h3 className="text-xl font-bold">Order Received successfully!</h3>
                  <p className="text-xs text-neutral-500 leading-relaxed font-light">
                    Shoron, **{shippingForm.name}**! Your streetwear request is lodged into our dispatch ledger. We texted a verification code to **{shippingForm.phone}**. 
                  </p>
                  
                  <div className="p-4 bg-neutral-50 dark:bg-neutral-900 rounded-xl text-left text-xs font-mono space-y-1.5 border border-neutral-200/50 dark:border-neutral-850">
                    <span className="block text-neutral-400 uppercase text-[10px] pb-1 border-b border-neutral-200 dark:border-neutral-800">Dispatch Voucher</span>
                    <div>Order ID: <span className="font-bold text-blue-600">BV-{Math.floor(Math.random() * 8899) + 1100}</span></div>
                    <div>Gateway: <span className="font-bold text-neutral-700 dark:text-white uppercase">{shippingForm.paymentMethod}</span></div>
                    <div>Address: <span className="font-mono text-neutral-500">{shippingForm.address}, {shippingForm.city}</span></div>
                    <div>Estimated Delivery: <span className="font-bold text-emerald-500">{shippingForm.city === "Dhaka" ? "24 Hours" : "48-72 Hours"}</span></div>
                  </div>

                  <button
                    onClick={() => {
                      setIsCheckoutOpen(false);
                      setCheckoutComplete(false);
                    }}
                    className="w-full py-3 bg-neutral-950 text-white dark:bg-white dark:text-[#0A0A01] text-xs font-bold rounded-xl transition cursor-pointer"
                  >
                    Secure Shopping Continuation
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* e. DEDICATED FULL-SCREEN WISHLIST PAGE OVERLAY */}
      {isWishlistOpen && (
        <div className="fixed inset-0 z-50 bg-[#0A0A0C]/98 backdrop-blur-md overflow-y-auto font-sans transition-all duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen flex flex-col justify-between">
            <div>
              {/* Overlay Navigation/Header */}
              <div className="flex items-center justify-between pb-8 border-b border-white/10">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono tracking-widest text-[#2563EB] dark:text-[#3B82F6] font-bold uppercase block">
                    01 / Campus Street Bookmarks
                  </span>
                  <h3 className="text-3xl sm:text-4xl font-sans font-black tracking-tighter text-white uppercase">
                    Your Saved Archives
                  </h3>
                </div>
                <button 
                  onClick={() => setIsWishlistOpen(false)}
                  className="px-4 py-2 text-xs font-bold font-sans uppercase tracking-wider text-white border border-white/20 hover:border-white rounded-full bg-white/5 hover:bg-white/10 transition cursor-pointer flex items-center gap-1.5"
                >
                  <X className="w-3.5 h-3.5" /> Close
                </button>
              </div>

              {/* Saved Items Content */}
              {wishlist.length === 0 ? (
                <div className="py-24 text-center max-w-lg mx-auto space-y-6">
                  <div className="w-16 h-16 rounded-full bg-neutral-900 border border-white/5 flex items-center justify-center mx-auto text-neutral-500">
                    <Heart className="w-6 h-6" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-xl font-bold text-white uppercase tracking-tight">Your Street Archive is dry</h4>
                    <p className="text-xs text-neutral-450 leading-relaxed font-light">
                      Nothing bookmarked yet, bro. Pick your heavy fabrics, wash treatments, or oversized tees from our main campus uniform ledger.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setIsWishlistOpen(false);
                      const shopS = document.getElementById("shop-section");
                      if (shopS) shopS.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="inline-flex px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-full transition cursor-pointer btn-shadow"
                  >
                    Start Exploring Shop
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-10">
                  {PRODUCTS.filter(p => wishlist.includes(p.id)).map((product) => {
                    return (
                      <WishlistItemCard 
                        key={product.id}
                        product={product}
                        onRemove={() => toggleWishlist(product.id)}
                        onAddToCart={(size) => addToCart(product, size)}
                      />
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer notice lines */}
            <div className="pt-8 border-t border-white/5 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-neutral-500 font-mono tracking-widest uppercase mt-12">
              <span>⚡ Authenticity stitched into every thread • 24h Express Dispatch</span>
              <button 
                onClick={() => {
                  setIsWishlistOpen(false);
                  const s = document.getElementById("shop-section");
                  if (s) s.scrollIntoView({ behavior: "smooth" });
                }} 
                className="hover:text-blue-400 text-white underline cursor-pointer"
              >
                Browse full catalog
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
