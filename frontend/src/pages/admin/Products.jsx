import { useState, useMemo } from "react";
import {
  Package, Plus, Store, Edit, Layers, AlertTriangle, Search, Filter,
  MoreVertical, Barcode, Hash, Trash2, ArrowRightLeft, Eye,
  Download, CheckSquare, Square, TrendingUp, DollarSign
} from "lucide-react";

export default function AdminProducts() {
  // --- ADMIN MOCK DATA (Consolidated View) ---
  const [products, setProducts] = useState([
    { 
      id: "prod_1", 
      name: "Rice 5kg", 
      sku: "RICE-501", 
      barcode: "600101", 
      costPrice: 600, // Sensitive Admin Data
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

  // --- BUSINESS LOGIC ---
  const calculateMargin = (cost, sell) => {
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
    <div className="p-6 space-y-8 bg-gray-50/50 min-h-screen font-sans pb-24">
      
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
          <button className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3.5 rounded-2xl hover:bg-indigo-700 transition-all font-bold shadow-xl shadow-indigo-100 hover:scale-[1.02]">
            <Plus size={20} strokeWidth={3} />
            Onboard Product
          </button>
        </div>
      </div>

      {/* --- KEY PERFORMANCE INDICATORS --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPI color="indigo" label="Inventory Value" value="KES 4.2M" sub="Cost Basis" icon={<DollarSign size={18}/>} />
        <KPI color="emerald" label="Estimated Profit" value="KES 840K" sub="Projected" icon={<TrendingUp size={18}/>} />
        <KPI color="orange" label="Reorder Alerts" value="14" sub="Below Threshold" icon={<AlertTriangle size={18}/>} pulse />
        <KPI color="slate" label="Active Branches" value="08" sub="Global Network" icon={<Store size={18}/>} />
      </div>

      {/* --- MASTER TABLE CARD --- */}
      <div className="bg-white rounded-[2.5rem] border border-gray-200 shadow-sm overflow-hidden relative">
        
        {/* TABLE TOOLBAR */}
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
            <select 
              className="px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-600 outline-none"
              onChange={(e) => setFilterBranch(e.target.value)}
            >
              <option>All Branches</option>
              <option>Nairobi CBD</option>
              <option>Chuka Branch</option>
            </select>
            <button className="p-3 bg-gray-50 text-gray-500 rounded-xl hover:bg-gray-100 border border-gray-100">
              <Filter size={18} />
            </button>
          </div>
        </div>

        {/* ADMIN TABLE */}
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
                      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500" style={{width: '60%'}} />
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between w-32">
                          <span className="text-[10px] font-bold text-gray-400">COST:</span>
                          <span className="text-xs font-black text-gray-600">{p.costPrice.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between w-32">
                          <span className="text-[10px] font-bold text-gray-400">SELL:</span>
                          <span className="text-sm font-black text-gray-900">{p.sellingPrice.toLocaleString()}</span>
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
                        <button className="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-500 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-sm" title="Transfer Stock">
                          <ArrowRightLeft size={16} />
                        </button>
                        <button className="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-500 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-sm" title="Edit Master">
                          <Edit size={16} />
                        </button>
                        <button className="p-2.5 text-gray-400 hover:text-gray-600">
                          <MoreVertical size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- FLOATING ADMIN ACTION BAR --- */}
      {selectedItems.length > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-8 py-4 rounded-3xl shadow-2xl flex items-center gap-8 animate-in slide-in-from-bottom-10 duration-300 z-50 border border-white/10">
          <div className="flex flex-col">
            <span className="text-xs font-black text-indigo-400 uppercase">{selectedItems.length} Selected</span>
            <span className="text-[10px] text-gray-400">Global Actions</span>
          </div>
          <div className="h-8 w-px bg-white/10" />
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 text-sm font-bold hover:text-indigo-400 transition-colors">
              <Download size={16} /> Bulk Export
            </button>
            <button className="flex items-center gap-2 text-sm font-bold hover:text-orange-400 transition-colors">
              <Edit size={16} /> Adjust Price
            </button>
            <button className="flex items-center gap-2 text-sm font-bold text-red-400 hover:text-red-300 transition-colors">
              <Trash2 size={16} /> Delete Items
            </button>
          </div>
          <button 
            onClick={() => setSelectedItems([])}
            className="ml-4 p-1 hover:bg-white/10 rounded-full transition-colors"
          >
            <Plus className="rotate-45" size={20} />
          </button>
        </div>
      )}
    </div>
  );
}

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
        {pulse && <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]" />}
      </div>
      <div>
        <p className={`text-[10px] font-black uppercase tracking-widest ${color === 'indigo' ? 'text-indigo-100' : 'text-gray-400'}`}>{label}</p>
        <p className={`text-2xl font-black mt-1 ${color === 'indigo' ? 'text-white' : 'text-gray-900'}`}>{value}</p>
        <p className={`text-[10px] font-bold mt-0.5 ${color === 'indigo' ? 'text-indigo-200' : 'text-gray-400'}`}>{sub}</p>
      </div>
    </div>
  );
}