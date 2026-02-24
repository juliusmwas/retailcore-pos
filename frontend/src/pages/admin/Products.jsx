import { useState } from "react";
import {
  Package,
  Plus,
  Store,
  Edit,
  Layers,
  AlertTriangle,
  Search,
  Filter,
  MoreVertical,
  ArrowUpRight,
  ChevronRight,
  Hash,
  Barcode,
  Tag,
  ArrowDown
} from "lucide-react";

export default function Products() {
  const [products] = useState([
    { id: 1, name: "Rice 5kg", sku: "RICE-501", barcode: "600101", price: 750, stock: 120, branch: "Nairobi CBD", category: "Grains" },
    { id: 2, name: "Sugar 2kg", sku: "SUG-202", barcode: "600102", price: 320, stock: 8, branch: "Westlands", category: "Pantry" },
    { id: 3, name: "Cooking Oil 1L", sku: "OIL-303", barcode: "600103", price: 420, stock: 0, branch: "Kasarani", category: "Liquids" },
    { id: 4, name: "Milk 1L", sku: "MLK-404", barcode: "600104", price: 65, stock: 450, branch: "Nairobi CBD", category: "Dairy" },
  ]);

  const getStockStatus = (stock) => {
    if (stock === 0) return { label: "Out of Stock", class: "bg-red-50 text-red-600 border-red-100" };
    if (stock < 10) return { label: "Low Stock", class: "bg-orange-50 text-orange-600 border-orange-100" };
    return { label: "In Stock", class: "bg-emerald-50 text-emerald-600 border-emerald-100" };
  };

  return (
    <div className="p-6 space-y-8 bg-gray-50/50 min-h-screen font-sans">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-xl shadow-lg shadow-blue-200">
                <Package className="text-white" size={24} />
            </div>
            Products
          </h1>
          <p className="text-gray-500 font-medium mt-1">Manage master products and branch-specific stock levels</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3.5 rounded-2xl hover:bg-blue-700 transition-all font-bold shadow-xl shadow-blue-100 hover:scale-[1.02] active:scale-95">
          <Plus size={20} strokeWidth={3} />
          Onboard Product
        </button>
      </div>

      {/* --- QUICK STATS --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total SKU" value="1,248" color="blue" icon={<Package size={16}/>} />
        <StatCard title="Total Stock" value="45,020" color="gray" icon={<Layers size={16}/>} />
        <StatCard title="Low Stock" value="12" color="orange" icon={<AlertTriangle size={16}/>} isWarning />
        <StatCard title="Out of Stock" value="3" color="red" icon={<AlertTriangle size={16}/>} isWarning />
      </div>

      {/* --- MAIN CONTENT CARD --- */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-lg">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by name, SKU, or scan barcode..." 
              className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500/20 transition-all outline-none text-sm font-semibold placeholder:text-gray-400"
            />
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-100 text-gray-600 rounded-xl hover:bg-gray-50 transition-all font-bold text-sm shadow-sm">
              <Filter size={16} />
              Filter
            </button>
            <div className="h-8 w-[1px] bg-gray-100 mx-1" />
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">4 Products Found</span>
          </div>
        </div>

        {/* Modern Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 py-4 text-left text-[11px] font-black text-gray-400 uppercase tracking-widest">Product Details</th>
                <th className="px-8 py-4 text-left text-[11px] font-black text-gray-400 uppercase tracking-widest">Category</th>
                <th className="px-8 py-4 text-left text-[11px] font-black text-gray-400 uppercase tracking-widest">Inventory</th>
                <th className="px-8 py-4 text-left text-[11px] font-black text-gray-400 uppercase tracking-widest">Unit Price</th>
                <th className="px-8 py-4 text-left text-[11px] font-black text-gray-400 uppercase tracking-widest">Active Branch</th>
                <th className="px-8 py-4 text-right text-[11px] font-black text-gray-400 uppercase tracking-widest">Manage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map((product) => {
                const status = getStockStatus(product.stock);
                return (
                  <tr key={product.id} className="group hover:bg-blue-50/40 transition-all">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-white to-gray-50 flex items-center justify-center text-gray-400 font-black text-xl border border-gray-100 group-hover:from-blue-600 group-hover:to-blue-500 group-hover:text-white transition-all shadow-sm">
                          {product.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-base">{product.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                             <span className="flex items-center gap-1 text-[10px] font-bold text-gray-400 bg-white px-2 py-0.5 rounded border border-gray-100"><Barcode size={10}/> {product.barcode}</span>
                             <span className="flex items-center gap-1 text-[10px] font-bold text-gray-400 bg-white px-2 py-0.5 rounded border border-gray-100"><Hash size={10}/> {product.sku}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-[11px] font-black text-gray-500 bg-gray-100 px-2.5 py-1 rounded-lg uppercase tracking-wider">
                         {product.category}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="space-y-2">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase border tracking-tighter ${status.class}`}>
                          {status.label}
                        </span>
                        <div className="flex items-center gap-2">
                           <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full transition-all duration-500 ${product.stock > 10 ? 'bg-emerald-500' : 'bg-orange-500'}`} 
                                style={{ width: `${Math.min(product.stock, 100)}%` }} 
                              />
                           </div>
                           <span className="text-xs font-black text-gray-700">{product.stock}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-gray-400">KES</span>
                        <span className="font-black text-gray-900 text-lg leading-none">{product.price.toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-gray-600">
                        <div className="p-2 bg-blue-50 rounded-xl text-blue-600">
                          <Store size={14} />
                        </div>
                        <span className="text-sm font-bold">{product.branch}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2.5 text-blue-600 hover:bg-blue-100 rounded-xl transition-all shadow-sm bg-blue-50/50" title="Edit">
                          <Edit size={18} />
                        </button>
                        <button className="p-2.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all">
                          <MoreVertical size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, color, icon, isWarning }) {
  const colors = {
    blue: "text-blue-600 bg-blue-50 border-blue-100 shadow-blue-50",
    orange: "text-orange-600 bg-orange-50 border-orange-100 shadow-orange-50",
    red: "text-red-600 bg-red-50 border-red-100 shadow-red-50",
    gray: "text-gray-600 bg-gray-50 border-gray-100 shadow-gray-50"
  };

  return (
    <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1 group">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2 rounded-xl border ${colors[color]}`}>
          {icon}
        </div>
        {isWarning && <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />}
      </div>
      <div>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{title}</p>
        <p className="text-2xl font-black text-gray-900 mt-1">{value}</p>
      </div>
    </div>
  );
}