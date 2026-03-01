import { useState, useMemo, useEffect } from "react";
import {
  Package, Plus, Store, Edit, Layers, AlertTriangle, Search, Filter,
  MoreVertical, Barcode, Hash, Trash2, ArrowRightLeft, Eye,
  Download, CheckSquare, Square, TrendingUp, DollarSign, X, Percent, ChevronRight
} from "lucide-react";

export default function AdminProducts() {
  // --- STATE MANAGEMENT ---
  const [products, setProducts] = useState([
    { 
      id: "prod_1", 
      name: "Rice 5kg", 
      sku: "RICE-501", 
      barcode: "600101", 
      costPrice: 600, 
      sellingPrice: 750, 
      category: "Grains",
      inventory: [
        { branch: "Nairobi CBD", stock: 100, min: 20 },
        { branch: "Chuka Branch", stock: 20, min: 10 }
      ]
    },
    { 
      id: "prod_2", 
      name: "Sugar 2kg", 
      sku: "SUG-202", 
      barcode: "600102", 
      costPrice: 280, 
      sellingPrice: 320, 
      category: "Pantry",
      inventory: [{ branch: "Main Branch", stock: 8, min: 15 }]
    }
  ]);

  const [selectedItems, setSelectedItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBranch, setFilterBranch] = useState("All Branches");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- BUSINESS LOGIC ---
  const calculateMargin = (cost, sell) => {
    if (!cost || !sell) return 0;
    const margin = ((sell - cost) / sell) * 100;
    return margin.toFixed(1);
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === products.length) setSelectedItems([]);
    else setSelectedItems(products.map(p => p.id));
  };

  const toggleSelectOne = (id) => {
    if (selectedItems.includes(id)) setSelectedItems(selectedItems.filter(i => i !== id));
    else setSelectedItems([...selectedItems, id]);
  };

  const getGlobalStockStatus = (inventory) => {
    const total = inventory.reduce((acc, curr) => acc + curr.stock, 0);
    const totalMin = inventory.reduce((acc, curr) => acc + curr.min, 0);
    if (total === 0) return { label: "OOS", color: "text-red-600 bg-red-50 border-red-100" };
    if (total <= totalMin) return { label: "LOW", color: "text-orange-600 bg-orange-50 border-orange-100" };
    return { label: "HEALTHY", color: "text-emerald-600 bg-emerald-50 border-emerald-100" };
  };

  return (
    <div className="p-6 space-y-8 bg-gray-50/50 min-h-screen font-sans pb-24 relative">
      
      {/* --- MODAL OVERLAY --- */}
      {isModalOpen && (
        <ProductRegistrationModal 
          onClose={() => setIsModalOpen(false)} 
          onSave={(newProd) => {
            setProducts([...products, { ...newProd, id: `prod_${Date.now()}` }]);
            setIsModalOpen(false);
          }}
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
            <span className="flex items-center gap-1 text-xs font-bold text-gray-500 bg-white px-2 py-1 rounded-lg border border-gray-100">
              <TrendingUp size={12} className="text-emerald-500" />
              Avg Margin: 18.4%
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-white text-gray-700 px-5 py-3 rounded-2xl border border-gray-200 hover:bg-gray-50 transition-all font-bold text-sm shadow-sm">
            <Download size={18} /> Export
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3.5 rounded-2xl hover:bg-indigo-700 transition-all font-bold shadow-xl shadow-indigo-100 hover:scale-[1.02]"
          >
            <Plus size={20} strokeWidth={3} />
            Onboard Product
          </button>
        </div>
      </div>

      {/* --- KPI SECTION --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPI color="indigo" label="Inventory Value" value="KES 4.2M" sub="Cost Basis" icon={<DollarSign size={18}/>} />
        <KPI color="emerald" label="Estimated Profit" value="KES 840K" sub="Projected" icon={<TrendingUp size={18}/>} />
        <KPI color="orange" label="Reorder Alerts" value="14" sub="Below Threshold" icon={<AlertTriangle size={18}/>} pulse />
        <KPI color="slate" label="Active Branches" value="08" sub="Global Network" icon={<Store size={18}/>} />
      </div>

      {/* --- MASTER TABLE CARD --- */}
      <div className="bg-white rounded-[2.5rem] border border-gray-200 shadow-sm overflow-hidden relative">
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Search master SKU, name, or barcodes..." 
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none text-sm font-semibold"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3">
            <select className="px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-600 outline-none">
              <option>All Branches</option>
              <option>Nairobi CBD</option>
              <option>Chuka Branch</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/50 text-[11px] font-black text-gray-400 uppercase tracking-[0.1em]">
                <th className="px-8 py-5 text-left w-10">
                  <button onClick={toggleSelectAll}>
                    {selectedItems.length === products.length ? <CheckSquare className="text-indigo-600" size={18} /> : <Square size={18} />}
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
              {products.map((p) => {
                const globalStatus = getGlobalStockStatus(p.inventory);
                const isSelected = selectedItems.includes(p.id);
                return (
                  <tr key={p.id} className={`group hover:bg-indigo-50/30 transition-all ${isSelected ? 'bg-indigo-50/50' : ''}`}>
                    <td className="px-8 py-6">
                      <button onClick={() => toggleSelectOne(p.id)}>
                        {isSelected ? <CheckSquare className="text-indigo-600" size={18} /> : <Square className="text-gray-300" size={18} />}
                      </button>
                    </td>
                    <td className="px-4 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white border border-gray-200 flex items-center justify-center font-black text-gray-400 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                          {p.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-base">{p.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1"><Hash size={10}/> {p.sku}</span>
                            <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1"><Barcode size={10}/> {p.barcode}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-wrap gap-2 mb-2">
                        {p.inventory.map((inv, idx) => (
                          <div key={idx} className="flex flex-col">
                            <span className="text-[10px] font-black text-gray-400 uppercase">{inv.branch}</span>
                            <span className={`text-xs font-bold ${inv.stock <= inv.min ? 'text-orange-600' : 'text-gray-700'}`}>
                              {inv.stock} <span className="text-[10px] text-gray-300 font-medium">available</span>
                            </span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between w-32 text-xs font-bold">
                          <span className="text-gray-400 uppercase text-[9px]">Cost:</span>
                          <span className="text-gray-600">{p.costPrice.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between w-32 text-sm font-black">
                          <span className="text-gray-400 uppercase text-[9px]">Sell:</span>
                          <span className="text-gray-900">{p.sellingPrice.toLocaleString()}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col items-start gap-1">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-black border ${globalStatus.color}`}>
                          {globalStatus.label}
                        </span>
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md mt-1">
                          +{calculateMargin(p.costPrice, p.sellingPrice)}% Margin
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-500 hover:text-indigo-600 transition-all shadow-sm"><Edit size={16} /></button>
                        <button className="p-2.5 text-gray-400"><MoreVertical size={18} /></button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- FLOATING ACTION BAR --- */}
      {selectedItems.length > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-8 py-4 rounded-3xl shadow-2xl flex items-center gap-8 z-50 animate-in slide-in-from-bottom-10">
          <div className="flex flex-col">
            <span className="text-xs font-black text-indigo-400 uppercase">{selectedItems.length} Selected</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 text-sm font-bold text-red-400"><Trash2 size={16} /> Delete</button>
          </div>
          <button onClick={() => setSelectedItems([])} className="ml-4 p-1 hover:bg-white/10 rounded-full">
            <X size={20} />
          </button>
        </div>
      )}
    </div>
  );
}

// --- MODAL COMPONENT ---
function ProductRegistrationModal({ onClose, onSave }) {
  const [activeTab, setActiveTab] = useState("basics");
  const [formData, setFormData] = useState({
    name: "", category: "Grains", sku: "", barcode: "", brand: "", uom: "Pcs",
    costPrice: 0, sellingPrice: 0, taxClass: "Standard 16%", markup: 25,
    inventory: [
      { branch: "Nairobi CBD", stock: 0, min: 5 },
      { branch: "Chuka Branch", stock: 0, min: 5 }
    ]
  });

  // Auto-calculation logic
  const handlePriceChange = (field, value) => {
    let val = parseFloat(value) || 0;
    let update = { ...formData, [field]: val };

    if (field === "costPrice" || field === "markup") {
      update.sellingPrice = Math.round(update.costPrice * (1 + (update.markup / 100)));
    } else if (field === "sellingPrice") {
      update.markup = update.costPrice > 0 ? ((val - update.costPrice) / update.costPrice * 100).toFixed(1) : 0;
    }
    setFormData(update);
  };

  const generateSKU = () => {
    const prefix = formData.category.substring(0, 3).toUpperCase();
    const random = Math.floor(100 + Math.random() * 900);
    setFormData({ ...formData, sku: `${prefix}-${random}` });
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
                <div className="col-span-2">
                  <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Full Product Name</label>
                  <input 
                    type="text" className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500/20 outline-none font-bold" 
                    placeholder="e.g. Premium Basmati Rice 5kg"
                    value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Category</label>
                  <select 
                    className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500/20 outline-none font-bold"
                    value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}
                  >
                    <option>Grains</option>
                    <option>Pantry</option>
                    <option>Beverages</option>
                    <option>Cleaning</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Unit of Measure (UoM)</label>
                  <input type="text" className="w-full p-4 bg-gray-50 border-none rounded-2xl outline-none font-bold" placeholder="Pcs, Kg, Ltr" value={formData.uom} onChange={(e) => setFormData({...formData, uom: e.target.value})} />
                </div>
                <div className="relative">
                  <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">SKU Code</label>
                  <div className="flex gap-2">
                    <input type="text" className="flex-1 p-4 bg-gray-50 border-none rounded-2xl outline-none font-bold" placeholder="AUTO-001" value={formData.sku} onChange={(e) => setFormData({...formData, sku: e.target.value})} />
                    <button onClick={generateSKU} className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl hover:bg-indigo-100 transition-all"><Hash size={20}/></button>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Barcode (EAN)</label>
                  <div className="relative">
                    <Barcode className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18}/>
                    <input type="text" className="w-full pl-12 p-4 bg-gray-50 border-none rounded-2xl outline-none font-bold" placeholder="600XXXXX" value={formData.barcode} onChange={(e) => setFormData({...formData, barcode: e.target.value})} />
                  </div>
                </div>
              </div>
            </div>
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
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <p className="text-sm font-bold text-gray-500 px-2">Set opening stock and reorder points per branch.</p>
              <div className="space-y-3">
                {formData.inventory.map((inv, idx) => (
                  <div key={idx} className="p-6 bg-gray-50 rounded-3xl border border-gray-100 flex items-center justify-between gap-6">
                    <div className="flex items-center gap-4 min-w-[150px]">
                      <div className="p-3 bg-white rounded-2xl shadow-sm text-indigo-600"><Store size={20}/></div>
                      <span className="font-black text-gray-900 text-sm uppercase">{inv.branch}</span>
                    </div>
                    <div className="flex gap-4 flex-1">
                      <div className="flex-1">
                        <label className="block text-[9px] font-black text-gray-400 uppercase mb-1">Opening Stock</label>
                        <input type="number" className="w-full p-3 bg-white border border-gray-200 rounded-xl outline-none font-bold text-sm" value={inv.stock} 
                          onChange={(e) => {
                            const newInv = [...formData.inventory];
                            newInv[idx].stock = parseInt(e.target.value) || 0;
                            setFormData({...formData, inventory: newInv});
                          }} 
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-[9px] font-black text-gray-400 uppercase mb-1">Min (Safety)</label>
                        <input type="number" className="w-full p-3 bg-white border border-gray-200 rounded-xl outline-none font-bold text-sm" value={inv.min}
                          onChange={(e) => {
                            const newInv = [...formData.inventory];
                            newInv[idx].min = parseInt(e.target.value) || 0;
                            setFormData({...formData, inventory: newInv});
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-8 border-t border-gray-100 flex items-center justify-between bg-white">
          <button onClick={onClose} className="text-sm font-black text-gray-400 uppercase hover:text-gray-600 transition-colors">Cancel</button>
          <div className="flex gap-3">
            {activeTab !== "inventory" ? (
              <button 
                onClick={() => setActiveTab(activeTab === "basics" ? "financials" : "inventory")}
                className="flex items-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-2xl font-black text-sm hover:bg-gray-800 transition-all shadow-xl shadow-gray-200"
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
    indigo: "bg-indigo-600 text-white shadow-indigo-100",
    emerald: "bg-white text-emerald-600 border-gray-200",
    orange: "bg-white text-orange-600 border-gray-200",
    slate: "bg-white text-slate-600 border-gray-200"
  };

  return (
    <div className={`p-6 rounded-[2rem] border shadow-sm transition-all hover:shadow-xl group ${themes[color]}`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2.5 rounded-xl ${color === 'indigo' ? 'bg-white/20' : 'bg-gray-50 border border-gray-100'}`}>
          {icon}
        </div>
        {pulse && <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />}
      </div>
      <div>
        <p className={`text-[10px] font-black uppercase tracking-widest ${color === 'indigo' ? 'text-indigo-100' : 'text-gray-400'}`}>{label}</p>
        <p className={`text-2xl font-black mt-1 ${color === 'indigo' ? 'text-white' : 'text-gray-900'}`}>{value}</p>
        <p className={`text-[10px] font-bold mt-0.5 ${color === 'indigo' ? 'text-indigo-200' : 'text-gray-400'}`}>{sub}</p>
      </div>
    </div>
  );
}