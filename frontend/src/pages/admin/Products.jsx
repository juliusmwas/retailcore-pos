import { useState, useMemo, useEffect } from "react";
import { Scanner } from '@yudiel/react-qr-scanner';
import {
  Package, Plus, Store, Edit, Layers, AlertTriangle, Search, Filter, Camera,
  MoreVertical, Barcode, Hash, Trash2, ArrowRightLeft, Eye,
  Download, CheckSquare, Square, TrendingUp, DollarSign, X, Percent, ChevronRight
} from "lucide-react";

import { useAuth } from "../../auth/AuthContext";

const RETAIL_HIERARCHY = {
  "Grains & Cereals": ["Rice", "Maize Flour", "Wheat Flour", "Lentils/Beans", "Oats"],
  "Pantry & Groceries": ["Sugar", "Salt", "Cooking Oil", "Spices/Seasoning", "Pasta"],
  "Beverages": ["Soft Drinks", "Juices", "Water", "Tea & Coffee", "Energy Drinks"],
  "Dairy & Eggs": ["Fresh Milk", "Yoghurt", "Cheese", "Butter/Margarine", "Eggs"],
  "Personal Care": ["Soap/Body Wash", "Lotion", "Oral Care", "Hair Care", "Deodorant"],
  "Cleaning & Laundry": ["Detergents", "Bleach", "Surface Cleaners", "Dish Soap", "Fabric Softener"],
  "Bakery": ["Bread", "Buns/Rolls", "Cakes", "Cookies/Biscuits"],
  "Electronics": ["Batteries", "Cables/Chargers", "Small Appliances", "Bulbs/Lighting"]
};

export default function AdminProducts() {
  const { token, user, loading } = useAuth();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBranch, setFilterBranch] = useState("All Branches");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [branches, setBranches] = useState([]);
  const businessId = user?.businessId || branches?.[0]?.businessId;

const fetchBranches = async () => {
  if (!token) return; // Wait until token is available

  try {
    const response = await fetch("http://localhost:5000/api/branches", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}` // ✅ Uses token from useAuth()
      }
    });

    if (!response.ok) throw new Error("Failed to load branches");

    const result = await response.json();
    setBranches(Array.isArray(result.data) ? result.data : []); 
    
  } catch (err) {
    console.error("Error fetching branches:", err);
  }
};


// Updated Fetch Products
 const fetchProducts = async () => {
  try {
    setIsLoading(true);
    const storedAuth = localStorage.getItem("auth");
    const { token } = storedAuth ? JSON.parse(storedAuth) : {};

    const response = await fetch("http://localhost:5000/api/products", {
      headers: {
        "Authorization": `Bearer ${token}` // ✅ Added protection
      }
    });
    
    if (!response.ok) throw new Error("Failed to load products");
    const data = await response.json();
    setProducts(Array.isArray(data) ? data : []);
  } catch (err) {
    setError(err.message);
  } finally {
    setIsLoading(false);
  }
};

 useEffect(() => {
  fetchProducts();
  fetchBranches(); // Fetch branches on load
}, []);

  // 3. Optimized Filtering Logic - FIXED: Added defensive null checks
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch =
        (p.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (p.sku?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (p.barcode || "").includes(searchTerm);

      const matchesBranch =
        filterBranch === "All Branches" ||
        p.inventory?.some(inv => inv.branch === filterBranch);

      return matchesSearch && matchesBranch;
    });
  }, [products, searchTerm, filterBranch]);

  // 4. Selection Handlers - FIXED: Syncs with filtered view
  const toggleSelectAll = () => {
    const allVisibleIds = filteredProducts.map(p => p.id);
    const areAllVisibleSelected = allVisibleIds.every(id => selectedItems.includes(id)) && allVisibleIds.length > 0;

    if (areAllVisibleSelected) {
      // Deselect only the currently visible items
      setSelectedItems(prev => prev.filter(id => !allVisibleIds.includes(id)));
    } else {
      // Add visible items to selection (preserving existing selections if any)
      setSelectedItems(prev => [...new Set([...prev, ...allVisibleIds])]);
    }
  };

  const toggleSelectOne = (id) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

// Updated Product Persistence

const handleSaveProduct = async (formData) => {
  // 1. Directly extract the ID from the user object in your AuthContext
  const currentBusinessId = user?.businessId || (branches && branches[0]?.businessId);

  // 2. Perform safety checks
  if (!token) {
    alert("Session expired. Please login again.");
    return;
  }

  // 3. This is the check that was failing in your screenshots
  if (!currentBusinessId) {
    console.log("Current User Data:", user); // Check console to see why this is missing
    alert("Critical Error: No Business ID found. Please refresh or re-login.");
    return;
  }

  try {
    // 4. Create the payload ensuring businessId is at the top level
    const payload = {
      ...formData,
      businessId: currentBusinessId 
    };

    const response = await fetch("http://localhost:5000/api/products", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}` 
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (response.ok) {
      await fetchProducts(); 
      setIsModalOpen(false);
      alert("Product saved successfully!");
    } else {
      // This catches the "Unauthorized: Business ID missing" from your backend
      alert(`Error: ${result.message || "Failed to save product"}`);
    }
  } catch (err) {
    console.error("Save failed:", err);
    alert("Network error: Could not connect to the server.");
  }
};

  const handleBulkDelete = async (idsToDelete) => {
    try {
      setIsLoading(true);
      
      // 1. API Call (Replace with your actual endpoint)
      const response = await fetch("/api/products/bulk-delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: idsToDelete }),
      });

      if (response.ok) {
        // 2. Optimistic UI Update: Filter out deleted items from local state
        setProducts(prev => prev.filter(p => !idsToDelete.includes(p.id)));
        
        // 3. Reset the selection state
        setSelectedItems([]);
        

        // Optional: Success notification
        console.log(`${idsToDelete.length} products deleted successfully.`);
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message || "Failed to delete selected items"}`);
      }
    } catch (err) {
      console.error("Bulk delete failed:", err);
      alert("A network error occurred during deletion.");
    } finally {
      setIsLoading(false);
    }
  };



  // 6. UI Helpers
  const calculateMargin = (cost, sell) => 
    (sell && cost ? (((sell - cost) / sell) * 100).toFixed(1) : "0.0");

  const getGlobalStockStatus = (inventory = []) => {
    const total = inventory.reduce((acc, curr) => acc + (curr.stock || 0), 0);
    const totalMin = inventory.reduce((acc, curr) => acc + (curr.min || 0), 0);
    
    if (total === 0) return { label: "OOS", color: "text-red-600 bg-red-50 border-red-100" };
    if (total <= totalMin) return { label: "LOW", color: "text-orange-600 bg-orange-50 border-orange-100" };
    return { label: "HEALTHY", color: "text-emerald-600 bg-emerald-50 border-emerald-100" };
  };

// 1. Wait for the Auth system to finish reading localStorage
if (loading) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );
}

// 2. If there's no token, they aren't logged in
if (!token) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-gray-500">Please log in to access this page.</p>
    </div>
  );
}

// 3. No more "Business profile" error—the page will now render your products table.


  return (
    <div className="p-6 space-y-8 bg-gray-50/50 min-h-screen font-sans pb-24 relative">
      
      {/* --- MODAL OVERLAY --- */}
      {isModalOpen && (
        <ProductRegistrationModal 
          onClose={() => setIsModalOpen(false)} 
          onSave={handleSaveProduct} 
          
          dbBranches={branches}
        />
      )}

      {/* --- ADMIN HEADER --- */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-100">
              <Package className="text-white" size={28} />
            </div>
            Products Management
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-gray-400 bg-white px-3 py-1.5 rounded-xl border border-gray-100 shadow-sm">
              <TrendingUp size={12} className="text-emerald-500" />
              Real-time Inventory Analytics
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            disabled={isLoading || products.length === 0}
            className="flex items-center gap-2 bg-white text-gray-700 px-5 py-3.5 rounded-2xl border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-bold text-sm shadow-sm"
          >
            <Download size={18} /> Export CSV
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3.5 rounded-2xl hover:bg-indigo-700 font-bold shadow-xl shadow-indigo-200 transition-all hover:-translate-y-0.5 active:translate-y-0"
          >
            <Plus size={20} strokeWidth={3} />
            Onboard Product
          </button>
        </div>
      </div>

      {/* --- KPI SECTION --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPI 
          color="indigo" 
          label="Inventory Value" 
          value={`KES ${(products.reduce((acc, p) => acc + (Number(p.costPrice) * (p.inventory?.reduce((sum, inv) => sum + inv.stock, 0) || 0)), 0) / 1000000).toFixed(2)}M`} 
          sub="Total Cost Basis" 
          icon={<DollarSign size={18}/>} 
        />
        <KPI 
          color="emerald" 
          label="Potential Revenue" 
          value={`KES ${(products.reduce((acc, p) => acc + (Number(p.sellingPrice) * (p.inventory?.reduce((sum, inv) => sum + inv.stock, 0) || 0)), 0) / 1000000).toFixed(2)}M`} 
          sub="Projected Sales" 
          icon={<TrendingUp size={18}/>} 
        />
        <KPI 
          color="orange" 
          label="Stock Alerts" 
          value={products.filter(p => p.inventory?.some(inv => inv.stock <= inv.min)).length.toString().padStart(2, '0')} 
          sub="Items Low/OOS" 
          icon={<AlertTriangle size={18}/>} 
          pulse={products.some(p => p.inventory?.some(inv => inv.stock <= inv.min))}
        />
        <KPI 
          color="slate" 
          label="Global Reach" 
          //value={availableBranches.length.toString().padStart(2, '0')} 
          sub="Active Branches" 
          icon={<Store size={18}/>} 
        />
      </div>

{/* --- MASTER TABLE CARD --- */}
    <div className="bg-white rounded-[2.5rem] border border-gray-200 shadow-sm overflow-hidden relative">
      {/* Header with Dynamic Search & Branch Filter */}
      <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search master SKU, name, or barcodes..." 
            className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none text-sm font-semibold text-gray-900"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-gray-400 uppercase ml-1 mb-1">Branch Filter</span>
            <select 
              className="px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-600 outline-none cursor-pointer hover:border-indigo-300 transition-colors"
              value={filterBranch}
              onChange={(e) => setFilterBranch(e.target.value)}
            >
              <option value="All Branches">All Branches</option>
              {/* {availableBranches.map(branch => (
                <option key={branch} value={branch}>{branch}</option>
              ))} */}
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50/50 text-[11px] font-black text-gray-400 uppercase tracking-[0.1em]">
              <th className="px-8 py-5 text-left w-10">
                <button 
                  onClick={toggleSelectAll} 
                  className="hover:text-indigo-600 transition-colors focus:outline-none"
                  title="Select Visible"
                >
                  {filteredProducts.length > 0 && filteredProducts.every(p => selectedItems.includes(p.id))
                    ? <CheckSquare className="text-indigo-600" size={18} /> 
                    : <Square size={18} />
                  }
                </button>
              </th>
              <th className="px-4 py-5 text-left">Product / SKU</th>
              <th className="px-8 py-5 text-left">Branch Distribution</th>
              <th className="px-8 py-5 text-left">Financials (KES)</th>
              <th className="px-8 py-5 text-left">Performance</th>
              <th className="px-8 py-5 text-right">Admin</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredProducts.map((p) => {
              const globalStatus = getGlobalStockStatus(p.inventory || []);
              const isSelected = selectedItems.includes(p.id);
              
              return (
                <tr key={p.id} className={`group hover:bg-indigo-50/30 transition-all ${isSelected ? 'bg-indigo-50/50' : ''}`}>
                  <td className="px-8 py-6">
                    <button onClick={() => toggleSelectOne(p.id)} className="focus:outline-none">
                      {isSelected ? <CheckSquare className="text-indigo-600" size={18} /> : <Square className="text-gray-300 group-hover:text-gray-400" size={18} />}
                    </button>
                  </td>
                  <td className="px-4 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-white border border-gray-200 flex items-center justify-center font-black text-gray-400 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                        {p.name?.charAt(0).toUpperCase() || 'P'}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-base leading-tight">{p.name || "Unnamed Product"}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1"><Hash size={10}/> {p.sku || "N/A"}</span>
                          {p.barcode && <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1"><Barcode size={10}/> {p.barcode}</span>}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-wrap gap-2 max-w-[300px]">
                      {p.inventory?.length > 0 ? (
                        p.inventory.map((inv, idx) => (
                          <div key={idx} className={`flex flex-col p-2 rounded-xl border ${inv.stock <= inv.min ? 'bg-orange-50 border-orange-100' : 'bg-gray-50 border-transparent'}`}>
                            <span className="text-[9px] font-black text-gray-400 uppercase leading-tight">{inv.branch}</span>
                            <span className={`text-xs font-bold ${inv.stock <= inv.min ? 'text-orange-600' : 'text-gray-700'}`}>
                              {inv.stock} <span className="text-[9px] text-gray-400 font-medium italic">pcs</span>
                            </span>
                          </div>
                        ))
                      ) : (
                        <span className="text-xs text-gray-300 italic">No inventory assigned</span>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between w-36 text-xs font-bold bg-gray-50/50 p-1.5 rounded-lg border border-gray-100">
                        <span className="text-gray-400 uppercase text-[8px]">Cost:</span>
                        <span className="text-gray-600">{Number(p.costPrice || 0).toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between w-36 text-sm font-black p-1.5">
                        <span className="text-gray-400 uppercase text-[8px]">Sell:</span>
                        <span className="text-gray-900">{Number(p.sellingPrice || 0).toLocaleString()}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col items-start gap-1">
                      <span className={`text-[10px] px-2.5 py-1 rounded-full font-black border uppercase tracking-wider ${globalStatus.color}`}>
                        {globalStatus.label}
                      </span>
                      <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg mt-1 border border-emerald-100">
                        +{calculateMargin(p.costPrice, p.sellingPrice)}% Margin
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-500 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-sm hover:shadow-indigo-50">
                        <Edit size={16} />
                      </button>
                      <button className="p-2.5 text-gray-400 hover:text-gray-600 transition-colors rounded-xl hover:bg-gray-50">
                        <MoreVertical size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredProducts.length === 0 && !isLoading && (
          <div className="p-24 text-center">
            <div className="inline-flex p-4 bg-gray-50 rounded-full mb-4">
              <Package className="text-gray-300" size={40} />
            </div>
            <p className="text-gray-500 font-bold text-lg">No products match your search</p>
            <p className="text-gray-400 text-sm">Try adjusting your filters or search terms.</p>
          </div>
        )}
      </div>
    </div>

     {/* --- FLOATING ACTION BAR --- */}
      {selectedItems.length > 0 && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-gray-900/95 backdrop-blur-xl text-white px-6 py-4 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex items-center gap-6 z-[100] animate-in fade-in slide-in-from-bottom-8 duration-300 border border-white/10">
          {/* Selection Count Section */}
          <div className="flex items-center gap-3 pr-6 border-r border-white/10">
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-[10px] font-black shadow-lg shadow-indigo-500/20">
              {selectedItems.length}
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Items</span>
              <span className="text-[11px] font-bold text-gray-400 leading-none">Selected</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            <button 
              className="flex items-center gap-2 text-xs font-bold text-white hover:text-indigo-300 transition-colors px-3 py-2 rounded-xl hover:bg-white/5"
              onClick={() => {
                // Example: Trigger CSV export for only selected IDs
                console.log("Exporting selected:", selectedItems);
              }}
            >
              <Download size={16} /> Export Selected
            </button>

            <button 
              disabled={isLoading}
              onClick={() => {
                if(window.confirm(`Permanently delete ${selectedItems.length} products?`)) {
                  handleBulkDelete(selectedItems);
                }
              }}
              className="flex items-center gap-2 text-xs font-bold text-red-400 hover:text-red-300 transition-all px-4 py-2 rounded-xl hover:bg-red-400/10 active:scale-95 disabled:opacity-50"
            >
              {isLoading ? (
                <span className="animate-pulse">Deleting...</span>
              ) : (
                <>
                  <Trash2 size={16} /> Bulk Delete
                </>
              )}
            </button>
          </div>

          {/* Clear/Close Selection */}
          <div className="pl-4 border-l border-white/10">
            <button 
              onClick={() => setSelectedItems([])} 
              className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-all group"
              title="Clear Selection"
            >
              <X size={20} className="group-hover:rotate-90 transition-transform duration-200" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// --- MODAL COMPONENT ---
function ProductRegistrationModal({ onClose, onSave, dbBranches }) {
  const [activeTab, setActiveTab] = useState("basics");
  const [selectedDeviceId, setSelectedDeviceId] = useState('');
  const [isScanning, setIsScanning] = useState(false);

// Inside ProductRegistrationModal
  const [formData, setFormData] = useState({
    name: "",
    category: "Grains & Cereals",
    subCategory: "",
    sku: "",
    barcode: "",
    brand: "",
    uom: "Pcs",
    costPrice: 0,
    sellingPrice: 0,
    taxClass: "Standard 16%",
    markup: 25,
    inventory: []
  });
  useEffect(() => {
    if (dbBranches.length > 0 && formData.inventory.length === 0) {
      setFormData(prev => ({
        ...prev,
        inventory: dbBranches.map(b => ({
          branchId: b.id,
          branch: b.name,
          stock: 0,
          min: 5
        }))
      }));
    }
  }, [dbBranches]);

  // 1. IMPROVED SOUND FUNCTION (Safe for modern browsers)
  const playSuccessSound = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      
      const context = new AudioContext();
      const oscillator = context.createOscillator();
      const gain = context.createGain();

      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(880, context.currentTime); // A5 note
      
      gain.connect(context.destination);
      oscillator.connect(gain);

      gain.gain.setValueAtTime(0, context.currentTime);
      gain.gain.linearRampToValueAtTime(0.2, context.currentTime + 0.05);
      gain.gain.linearRampToValueAtTime(0, context.currentTime + 0.2);

      oscillator.start();
      oscillator.stop(context.currentTime + 0.2);
    } catch (e) {
      console.warn("Audio playback blocked or unsupported", e);
    }
  };

  // 2. VALIDATION LOGIC
  const isBasicsComplete = 
    formData.name.trim() !== "" && 
    formData.sku.trim() !== "" && 
    formData.barcode.trim() !== "" &&
    formData.subCategory.trim() !== "";

  const isFinancialsComplete = 
    Number(formData.costPrice) > 0 && 
    Number(formData.sellingPrice) > 0;

  const canProgress = 
    activeTab === "basics" ? isBasicsComplete : 
    activeTab === "financials" ? isFinancialsComplete : true;

  // 3. ENHANCED AUTO-CALCULATION
  const handlePriceChange = (field, value) => {
    const val = parseFloat(value) || 0;
    setFormData(prev => {
      let update = { ...prev, [field]: val };

      if (field === "costPrice" || field === "markup") {
        // Calculate Sell from Cost + Markup
        update.sellingPrice = Math.round(update.costPrice * (1 + (update.markup / 100)));
      } else if (field === "sellingPrice") {
        // Reverse calculate Markup from Sell Price
        if (update.costPrice > 0) {
          update.markup = parseFloat(((val - update.costPrice) / update.costPrice * 100).toFixed(1));
        }
      }
      return update;
    });
  };

  // 4. SMART SKU GENERATION
  const generateSKU = () => {
    const catPrefix = formData.category.substring(0, 2).toUpperCase();
    const subPrefix = formData.subCategory 
      ? formData.subCategory.substring(0, 2).toUpperCase() 
      : "XX";
    const random = Math.floor(1000 + Math.random() * 9000);
    
    setFormData(prev => ({ 
      ...prev, 
      sku: `${catPrefix}${subPrefix}-${random}` 
    }));
  };

  const handleSubmit = () => {
    if (isBasicsComplete && isFinancialsComplete) {
      playSuccessSound();
      onSave(formData);
    } else {
      alert("Please complete all required fields.");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-3xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Onboard New Product</h2>
            <p className="text-gray-500 text-sm font-medium">Fill in the master details for the inventory system.</p>
          </div>
          <button onClick={onClose} className="p-3 bg-white border border-gray-200 rounded-2xl text-gray-400 hover:text-gray-900 transition-all">
            <X size={20} strokeWidth={3} />
          </button>
        </div>

        {/* Tabs Navigation */}
        <div className="flex px-8 border-b border-gray-100 bg-white">
          {["basics", "financials", "inventory"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-6 text-xs font-black uppercase tracking-widest transition-all border-b-2 ${
                activeTab === tab ? "border-indigo-600 text-indigo-600" : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Scrollable Content */}
        <div className="p-8 overflow-y-auto flex-1">
         {activeTab === "basics" && (
  <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
    <div className="grid grid-cols-2 gap-6">
      {/* Full Name */}
      <div className="col-span-2">
        <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Full Product Name</label>
        <input
          type="text" className="w-full p-4 bg-gray-50 border-none rounded-2xl outline-none font-bold"
          placeholder="e.g. Premium Basmati Rice 5kg"
          value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
        />
      </div>

      {/* Category Selection */}
<div>
  <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Category</label>
  <select
    className="w-full p-4 bg-gray-50 border-none rounded-2xl outline-none font-bold"
    value={formData.category}
    onChange={(e) => setFormData({...formData, category: e.target.value, subCategory: ""})}
  >
    {Object.keys(RETAIL_HIERARCHY).map(cat => <option key={cat} value={cat}>{cat}</option>)}
  </select>
</div>

{/* Sub-Category Selection */}
<div>
  <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Sub-Category</label>
  <select
    className={`w-full p-4 border-none rounded-2xl outline-none font-bold transition-all ${!formData.subCategory ? 'bg-orange-50 text-orange-400' : 'bg-gray-50 text-gray-900'}`}
    value={formData.subCategory}
    onChange={(e) => setFormData({...formData, subCategory: e.target.value})}
  >
    <option value="">-- Select Sub --</option>
    {RETAIL_HIERARCHY[formData.category].map(sub => (
      <option key={sub} value={sub}>{sub}</option>
    ))}
  </select>
</div>

    {/* Barcode & Scan */}
<div className="col-span-2">
  <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">
    Barcode (EAN/UPC)
  </label>
  <div className="flex gap-3 mb-4">
    <input 
      type="text" 
      className="flex-1 p-4 bg-gray-50 border-none rounded-2xl font-bold outline-none" 
      value={formData.barcode} 
      onChange={(e) => setFormData({...formData, barcode: e.target.value})}
      placeholder="Scan or type barcode..."
    />
    <button 
      type="button"
      onClick={() => setIsScanning(!isScanning)} 
      className={`p-4 rounded-2xl transition-all ${isScanning ? 'bg-red-500 text-white' : 'bg-indigo-600 text-white'}`}
    >
      {isScanning ? <X size={20} /> : <Camera size={20} />}
    </button>
  </div>

{/* Replace the current isScanning block with this simplified version */}
{isScanning && (
  <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
    {/* High-Performance Scanner Viewport */}
    <div className="relative w-full h-80 bg-black rounded-[2.5rem] overflow-hidden border-4 border-gray-900 shadow-2xl">
      <Scanner
  // 1. Alignment: Use the repo's recommended error handling
  onError={(error) => console.error("Scanner Error:", error?.message)}
  
  // 2. Alignment: Enhanced Detection logic
  onScan={(detectedCodes) => {
    if (detectedCodes?.length > 0) {
      const code = detectedCodes[0].rawValue;
      if (code) {
        setFormData(prev => ({ ...prev, barcode: code }));
        playSuccessSound();
        setIsScanning(false);
      }
    }
  }}

  // 3. Performance: Limit formats to standard retail barcodes
  // This makes the 'brain' of the scanner work 3x faster
  formats={['ean_13', 'upc_a', 'code_128', 'qr_code']}

  // 4. Alignment: Precision Constraints
  constraints={{
    facingMode: 'environment',
    width: { ideal: 1920 }, // As per Repo "Advanced" example
    height: { ideal: 1080 },
    aspectRatio: 1
  }}

  // 5. Components: Torch is great for low-light warehouses
  components={{
    audio: false, 
    torch: true,
    finder: true,
  }}

  styles={{
    container: { width: '100%', height: '100%' },
    finder: {
      width: '70%', // Slightly narrower for better barcode alignment
      height: '30%', // Barcodes are short and wide
      border: '2px solid #6366f1',
      borderRadius: '1rem',
      boxShadow: '0 0 0 1000px rgba(0, 0, 0, 0.6)', 
    }
  }}
/>
      
      {/* Laser Line */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-[230px] h-[3px] bg-emerald-400 shadow-[0_0_15px_#10b981] animate-laser z-10"></div>
      </div>

    </div>
  </div>
)}
</div>

      {/* SKU & UoM (These are now correctly inside the grid) */}
      <div>
        <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">UoM</label>
        <input type="text" className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold" value={formData.uom} onChange={(e) => setFormData({...formData, uom: e.target.value})} />
      </div>
      <div>
        <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">SKU Code</label>
        <div className="flex gap-2">
          <input type="text" className="flex-1 p-4 bg-gray-50 border-none rounded-2xl font-bold" value={formData.sku} onChange={(e) => setFormData({...formData, sku: e.target.value})} />
          <button onClick={generateSKU} className="p-4 bg-indigo-50 rounded-2xl"><Hash size={20}/></button>
        </div>
      </div>
    </div> {/* This closes the grid */}
  </div> /* This closes the basics tab content */
)}

          {activeTab === "financials" && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <div className="bg-indigo-600 p-6 rounded-[2rem] text-white flex justify-between items-center mb-8">
                <div>
                  <p className="text-[10px] font-black uppercase opacity-60">Calculated Profit Margin</p>
                  <h3 className="text-3xl font-black">+{formData.markup}%</h3>
                </div>
                <TrendingUp size={40} className="opacity-20" />
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Cost Price (Excl. VAT)</label>
                  <input type="number" className="w-full p-4 bg-gray-50 border-none rounded-2xl outline-none font-bold" value={formData.costPrice} onChange={(e) => handlePriceChange("costPrice", e.target.value)} />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Tax Class</label>
                  <select className="w-full p-4 bg-gray-50 border-none rounded-2xl outline-none font-bold" value={formData.taxClass} onChange={(e) => setFormData({...formData, taxClass: e.target.value})}>
                    <option>Standard 16%</option>
                    <option>Zero Rated 0%</option>
                    <option>Exempt</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Markup Percentage (%)</label>
                  <input type="number" className="w-full p-4 bg-gray-50 border-none rounded-2xl outline-none font-bold" value={formData.markup} onChange={(e) => handlePriceChange("markup", e.target.value)} />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Final Selling Price</label>
                  <input type="number" className="w-full p-4 bg-indigo-50/50 border-2 border-indigo-100 rounded-2xl outline-none font-black text-indigo-700" value={formData.sellingPrice} onChange={(e) => handlePriceChange("sellingPrice", e.target.value)} />
                </div>
              </div>
            </div>
          )}

          {activeTab === "inventory" && (
  <div className="space-y-4 animate-in slide-in-from-right-4">
    <p className="text-sm font-bold text-gray-500 mb-4">Set opening stock and reorder points per branch.</p>
    
    {formData.inventory.length > 0 ? (
      formData.inventory.map((inv, idx) => (
        <div key={idx} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
          <span className="flex-1 font-bold text-gray-700 uppercase text-xs">{inv.branch}</span>
          <input 
            type="number" 
            placeholder="Stock"
            className="w-24 p-2 bg-white rounded-lg border-none outline-none font-bold"
            value={inv.stock}
            onChange={(e) => {
              const newInv = [...formData.inventory];
              newInv[idx].stock = parseInt(e.target.value) || 0;
              setFormData({...formData, inventory: newInv});
            }}
          />
        </div>
      ))
    ) : (
      <div className="p-8 text-center bg-orange-50 rounded-2xl border border-orange-100">
        <AlertTriangle className="mx-auto text-orange-400 mb-2" />
        <p className="text-orange-600 font-bold text-sm">No branches found!</p>
        <p className="text-orange-400 text-xs">Please register your business and branches first.</p>
      </div>
    )}
  </div>
)}
        </div>

        {/* Footer Actions */}
        <div className="p-8 border-t border-gray-100 flex items-center justify-between bg-white">
          <button onClick={onClose} className="text-sm font-black text-gray-400 uppercase hover:text-gray-600 transition-colors">Cancel</button>
          <div className="flex gap-3">
            {activeTab !== "inventory" ? (
              <button 
  disabled={!canProgress}
  onClick={() => setActiveTab(activeTab === "basics" ? "financials" : "inventory")}
  className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-black text-sm transition-all ${
    canProgress 
    ? "bg-gray-900 text-white hover:bg-gray-800 shadow-xl" 
    : "bg-gray-100 text-gray-300 cursor-not-allowed shadow-none opacity-60"
  }`}
>
  Next Step <ChevronRight size={18}/>
</button>
            ) : (
              <button 
                onClick={() => onSave(formData)}
                className="flex items-center gap-2 bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black text-sm hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100"
              >
                Save Product & Activate
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- KPI HELPER ---
function KPI({ label, value, sub, color, icon, pulse }) {
  const themes = {
    indigo: {
      card: "bg-indigo-600 border-indigo-500 shadow-indigo-100",
      iconBox: "bg-white/20 text-white",
      label: "text-indigo-100",
      value: "text-white",
      sub: "text-indigo-200"
    },
    emerald: {
      card: "bg-white border-gray-100 text-emerald-600",
      iconBox: "bg-emerald-50 text-emerald-600",
      label: "text-gray-400",
      value: "text-gray-900",
      sub: "text-emerald-500"
    },
    orange: {
      card: "bg-white border-gray-100 text-orange-600",
      iconBox: "bg-orange-50 text-orange-600",
      label: "text-gray-400",
      value: "text-gray-900",
      sub: "text-orange-500"
    },
    slate: {
      card: "bg-white border-gray-100 text-slate-600",
      iconBox: "bg-slate-50 text-slate-600",
      label: "text-gray-400",
      value: "text-gray-900",
      sub: "text-gray-400"
    }
  };

  const active = themes[color] || themes.slate;

  return (
    <div className={`p-6 rounded-[2.5rem] border shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group relative overflow-hidden ${active.card}`}>
      {/* Background Decor */}
      <div className="absolute -right-2 -top-2 opacity-5 group-hover:scale-110 transition-transform duration-500">
        {icon}
      </div>

      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className={`p-3 rounded-2xl transition-colors ${active.iconBox}`}>
          {icon}
        </div>
        {pulse && (
          <div className="flex items-center gap-1.5 bg-red-50 px-2 py-1 rounded-full border border-red-100">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-[8px] font-black text-red-600 uppercase">Action Req.</span>
          </div>
        )}
      </div>

      <div className="relative z-10">
        <p className={`text-[10px] font-black uppercase tracking-[0.15em] ${active.label}`}>{label}</p>
        <p className={`text-2xl font-black mt-1 tracking-tight ${active.value}`}>{value}</p>
        <p className={`text-[10px] font-bold mt-1 flex items-center gap-1 ${active.sub}`}>
          {sub}
        </p>
      </div>
    </div>
  );
}