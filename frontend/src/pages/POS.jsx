import { useState, useRef, useEffect } from "react";
import { useAuth } from "../auth/AuthContext";
import { Search, ShoppingCart, User, Package, Trash2, Plus, Minus } from "lucide-react";

export default function POS() {
  const { business, activeBranch, user } = useAuth();
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef(null);

  // Auto-focus search bar on load (crucial for barcode scanners)
  useEffect(() => {
    searchInputRef.current?.focus();
  }, []);

  const subtotal = cart.reduce((acc, item) => acc + (item.sellingPrice * item.quantity), 0);
  const tax = subtotal * 0.16; // 16% VAT example
  const total = subtotal + tax;

  return (
    <div className="h-screen flex flex-col bg-gray-100 overflow-hidden">
      {/* --- TOP NAVIGATION BAR --- */}
      <header className="bg-white border-b px-6 py-3 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-4">
          <div className="bg-blue-600 text-white p-2 rounded-lg">
            <ShoppingCart size={20} />
          </div>
          <div>
            <h1 className="text-lg font-black text-gray-800 leading-none">RETAILCORE POS</h1>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">
              {business?.name} <span className="mx-1">•</span> 
              <span className="text-blue-600 font-bold">{activeBranch?.name}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right hidden md:block">
            <p className="text-sm font-bold text-gray-800">{user?.fullName}</p>
            <p className="text-[10px] text-gray-400 uppercase tracking-tighter">Terminal ID: {user?.staffNumber}</p>
          </div>
          <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
            <User size={20} />
          </div>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {/* --- LEFT SECTION: PRODUCT SEARCH & LISTING --- */}
        <section className="flex-1 p-6 flex flex-col gap-6 overflow-hidden">
          {/* Barcode/Search Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400">
              <Search size={20} />
            </div>
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Scan Barcode or Search Product (F1)..."
              className="w-full bg-white border-none shadow-md rounded-2xl py-4 pl-12 pr-4 text-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Product Grid Area */}
          <div className="flex-1 bg-white rounded-3xl shadow-inner border border-gray-100 p-8 flex flex-col items-center justify-center text-center">
             <div className="bg-blue-50 p-6 rounded-full text-blue-300 mb-4">
                <Package size={48} />
             </div>
             <h3 className="text-xl font-bold text-gray-700">Ready to Scan</h3>
             <p className="text-gray-400 max-w-xs mt-2">
                Use a barcode scanner or type above to start adding items to the sale.
             </p>
          </div>
        </section>

        {/* --- RIGHT SECTION: CART & CHECKOUT --- */}
        <aside className="w-[400px] bg-white border-l flex flex-col shadow-2xl">
          <div className="p-6 border-b flex justify-between items-center bg-gray-50/50">
            <h2 className="font-black text-gray-800 uppercase tracking-tight">Current Sale</h2>
            <button className="text-xs text-red-500 font-bold hover:bg-red-50 px-2 py-1 rounded">Clear All</button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
             {cart.length === 0 ? (
               <div className="h-full flex flex-col items-center justify-center opacity-20">
                  <ShoppingCart size={64} />
                  <p className="font-bold mt-4">Cart is Empty</p>
               </div>
             ) : (
               cart.map((item, index) => (
                 <div key={index} className="flex justify-between items-center p-3 border rounded-xl hover:border-blue-200 transition-colors bg-white">
                    <div className="flex-1">
                       <p className="font-bold text-gray-800 text-sm leading-tight">{item.name}</p>
                       <p className="text-xs text-gray-400">KES {item.sellingPrice.toLocaleString()} x {item.quantity}</p>
                    </div>
                    <div className="flex items-center gap-3">
                       <p className="font-bold text-blue-600">KES {(item.sellingPrice * item.quantity).toLocaleString()}</p>
                       <button className="text-gray-300 hover:text-red-500"><Trash2 size={16} /></button>
                    </div>
                 </div>
               ))
             )}
          </div>

          {/* Totals Section */}
          <div className="p-6 bg-gray-900 text-white rounded-t-[2rem] shadow-2xl">
            <div className="space-y-2 mb-6">
               <div className="flex justify-between text-gray-400 text-sm">
                  <span>Subtotal</span>
                  <span>KES {subtotal.toLocaleString()}</span>
               </div>
               <div className="flex justify-between text-gray-400 text-sm">
                  <span>VAT (16%)</span>
                  <span>KES {tax.toLocaleString()}</span>
               </div>
               <div className="flex justify-between text-xl font-black border-t border-gray-700 pt-4 mt-2">
                  <span>TOTAL</span>
                  <span className="text-green-400 underline decoration-2 underline-offset-4">
                    KES {total.toLocaleString()}
                  </span>
               </div>
            </div>

            <button 
              disabled={cart.length === 0}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:cursor-not-allowed py-5 rounded-2xl font-black text-lg uppercase tracking-widest transition-all shadow-lg active:scale-95"
            >
              Process Payment (F2)
            </button>
          </div>
        </aside>
      </main>
    </div>
  );
}