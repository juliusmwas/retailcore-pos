import { useState, useRef, useEffect } from "react";
import { useAuth } from "../auth/AuthContext";
import { Search, Trash2, Smartphone, Banknote, Maximize } from "lucide-react";
import axios from "axios";

export default function POS() {
  const { user, activeBranch } = useAuth();
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef(null);

  const total = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "F1") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSearch = async (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (!searchQuery.trim()) return;

      try {
        // 1. Fetch from your backend using the barcode or SKU
        const response = await axios.get(
          `/api/products/search?query=${searchQuery}`,
        );
        const product = response.data;

        if (product) {
          setCart((prev) => {
            const exists = prev.find((item) => item.id === product.id);
            if (exists) {
              return prev.map((item) =>
                item.id === product.id ? { ...item, qty: item.qty + 1 } : item,
              );
            }
            // 2. Add the real product from PostgreSQL to the cart
            return [
              {
                id: product.id,
                name: product.name,
                barcode: product.barcode || product.sku,
                price: product.sellingPrice, // Matching your Prisma field name
                qty: 1,
              },
              ...prev,
            ];
          });
        } else {
          alert("Product not found!");
        }
      } catch (error) {
        console.error("Search failed:", error);
        alert("Error finding product");
      }

      setSearchQuery("");
    }
  };

  const startCameraScanner = () => {
    alert("Camera Scanner coming soon! For now, please type and hit Enter.");
  };

  return (
    <div className="h-screen flex flex-col bg-[#f4f7f6] overflow-hidden font-sans text-slate-900">
      {/* TOP COMPACT BAR */}
      <header className="bg-white border-b px-4 py-2 flex justify-between items-center">
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-bold tracking-tighter text-blue-700 uppercase">
            {user?.businessName || "RETAILCORE"}
          </span>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-l pl-2 border-slate-200">
            {activeBranch?.name || "Main Station"}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-slate-100 px-3 py-1 rounded-md border border-slate-200">
            <span className="text-[10px] font-black text-slate-500 uppercase mr-2">
              Status:
            </span>
            <span className="text-[10px] font-black text-green-600 uppercase">
              Online
            </span>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* CENTER COLUMN: THE ENGINE */}
        <div className="flex-1 flex flex-col p-2 space-y-2">
          <div className="bg-white p-2 rounded-lg shadow-sm border border-slate-200">
            <div className="relative flex items-center">
              {/* SEARCH ICON */}
              <div className="absolute left-4 p-1 bg-slate-100 rounded text-slate-400">
                <Search size={18} />
              </div>

              {/* INPUT - Notice I added pr-40 to prevent text from going under the buttons */}
              <input
                ref={searchInputRef}
                autoFocus
                className="w-full p-4 pl-14 pr-44 bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-md text-lg font-medium outline-none transition-all placeholder:text-slate-300"
                placeholder="Scan Barcode or Search (F1)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch} // We'll add this logic next!
              />

              {/* ACTION AREA (Right Side) */}
              <div className="absolute right-3 flex items-center gap-3">
                {/* KEYBOARD SHORTCUTS - Hidden on small screens */}
                <div className="hidden md:flex gap-1">
                  <kbd className="px-2 py-1 bg-white border border-slate-200 rounded text-[9px] font-bold text-slate-400 shadow-sm">
                    F1
                  </kbd>
                  <kbd className="px-2 py-1 bg-white border border-slate-200 rounded text-[9px] font-bold text-slate-400 shadow-sm">
                    F2
                  </kbd>
                </div>

                {/* THE SCAN BUTTON */}
                <button
                  onClick={startCameraScanner}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all shadow-md active:scale-95"
                >
                  <Maximize size={16} />
                  <span className="text-[10px] font-black uppercase tracking-tight">
                    Open Scanner
                  </span>
                </button>
              </div>
            </div>
          </div>
          {/* COMPACT ITEM TABLE */}
          <div className="flex-1 bg-white rounded-lg shadow-sm border border-slate-200 flex flex-col overflow-hidden">
            {/* COMPACT ITEM TABLE */}
            <div className="flex-1 bg-white rounded-lg shadow-sm border border-slate-200 flex flex-col overflow-hidden">
              <div className="overflow-y-auto flex-1">
                <table className="w-full text-sm">
                  <thead className="bg-slate-800 text-slate-300 sticky top-0 z-10">
                    <tr>
                      <th className="px-4 py-3 font-bold uppercase text-[10px] tracking-wider text-left">
                        Product Description
                      </th>
                      <th className="px-4 py-3 font-bold uppercase text-[10px] tracking-wider text-center w-24">
                        Qty
                      </th>
                      <th className="px-4 py-3 font-bold uppercase text-[10px] tracking-wider text-right w-32">
                        Unit Price
                      </th>
                      <th className="px-4 py-3 font-bold uppercase text-[10px] tracking-wider text-right w-32">
                        Subtotal
                      </th>
                      <th className="px-4 py-3 w-12"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {cart.length > 0 ? (
                      cart.map((item, i) => (
                        <tr
                          key={item.id || i}
                          className="hover:bg-blue-50/50 group"
                        >
                          <td className="px-4 py-3">
                            <p className="font-bold text-slate-800 uppercase leading-tight">
                              {item.name || "Unknown Product"}
                            </p>
                            <p className="text-[10px] text-slate-400 font-mono">
                              {item.barcode || item.sku || "No Barcode"}
                            </p>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-center bg-slate-50 rounded border border-slate-200 p-1 font-bold text-slate-700">
                              {item.qty || 1}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right font-medium text-slate-600 italic">
                            {(Number(item.price) || 0).toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-right font-black text-slate-900">
                            {(
                              (Number(item.price) || 0) * (item.qty || 1)
                            ).toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <button
                              onClick={() => {
                                setCart((prev) =>
                                  prev.filter((c) => c.id !== item.id),
                                );
                              }}
                              className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="py-20 text-center">
                          <div className="flex flex-col items-center opacity-20">
                            <div className="w-16 h-16 border-4 border-dashed border-slate-400 rounded-full flex items-center justify-center mb-4">
                              <Search size={32} />
                            </div>
                            <p className="font-black uppercase tracking-widest text-xs">
                              Waiting for Scan...
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* BLACK BOTTOM SUMMARY */}
              <div className="bg-slate-900 px-6 py-4 flex justify-between items-center border-t border-slate-700">
                <div className="flex gap-8">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-500 uppercase">
                      Items
                    </span>
                    <span className="text-xl font-black text-white">
                      {cart.reduce((sum, item) => sum + (item.qty || 0), 0)}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest block">
                    Amount Due
                  </span>
                  <span className="text-4xl font-black text-green-400 tracking-tighter">
                    <span className="text-lg mr-1 text-green-600 font-bold">
                      KES
                    </span>
                    {(total || 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR: THE PAY STATION */}
        <aside className="w-72 bg-slate-200/50 p-2 flex flex-col gap-2">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-300 flex-1 flex flex-col">
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
              Payment Methods
            </h2>

            <div className="space-y-2 flex-1">
              <button className="w-full flex items-center gap-4 p-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-all shadow-md active:scale-95">
                <Banknote size={24} />
                <div className="text-left">
                  <p className="text-xs font-black uppercase leading-none">
                    Cash
                  </p>
                  <p className="text-[10px] opacity-70">F2</p>
                </div>
              </button>

              <button className="w-full flex items-center gap-4 p-4 bg-[#41ab3b] hover:bg-[#368f31] text-white rounded-lg transition-all shadow-md active:scale-95 border-b-4 border-black/20">
                <div className="font-black text-xl italic">M</div>
                <div className="text-left">
                  <p className="text-xs font-black uppercase leading-none">
                    M-PESA STK
                  </p>
                  <p className="text-[10px] opacity-70">F3</p>
                </div>
              </button>

              <button className="w-full flex items-center gap-4 p-4 bg-slate-800 hover:bg-slate-900 text-white rounded-lg transition-all shadow-md active:scale-95">
                <creditCard size={24} />
                <div className="text-left">
                  <p className="text-xs font-black uppercase leading-none">
                    Card Payment
                  </p>
                  <p className="text-[10px] opacity-70">F4</p>
                </div>
              </button>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col gap-2">
              <button className="w-full py-3 bg-white border border-slate-300 text-slate-600 rounded-md text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-colors">
                Suspend Sale
              </button>
            </div>
          </div>

          {/* OPERATOR CARD */}
          <div className="bg-slate-800 p-4 rounded-lg text-white flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-blue-500 flex items-center justify-center font-black text-xs">
              JD
            </div>
            <div className="leading-none">
              <p className="text-[10px] font-black uppercase text-slate-400">
                Cashier
              </p>
              <p className="text-xs font-bold truncate w-32">Jane Doe</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
