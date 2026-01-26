import { useState } from "react";
import {
  Package,
  Plus,
  Store,
  Edit,
  Layers,
  AlertTriangle,
} from "lucide-react";

export default function Products() {
  // Mock product data
  const [products] = useState([
    {
      id: 1,
      name: "Rice 5kg",
      sku: "RICE-5KG",
      price: 750,
      stock: 120,
      branch: "Nairobi CBD",
      status: "ACTIVE",
    },
    {
      id: 2,
      name: "Sugar 2kg",
      sku: "SUGAR-2KG",
      price: 320,
      stock: 8,
      branch: "Westlands",
      status: "LOW_STOCK",
    },
    {
      id: 3,
      name: "Cooking Oil 1L",
      sku: "OIL-1L",
      price: 420,
      stock: 0,
      branch: "Kasarani",
      status: "OUT_OF_STOCK",
    },
  ]);

  const stockBadge = (product) => {
    if (product.stock === 0) {
      return "bg-red-100 text-red-700";
    }
    if (product.stock < 10) {
      return "bg-yellow-100 text-yellow-700";
    }
    return "bg-green-100 text-green-700";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Package className="w-6 h-6" />
            Products
          </h1>
          <p className="text-sm text-gray-500">
            Manage products, pricing, and stock levels per branch
          </p>
        </div>

        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="px-6 py-3 text-left">Product</th>
              <th className="px-6 py-3 text-left">SKU</th>
              <th className="px-6 py-3 text-left">Price (KES)</th>
              <th className="px-6 py-3 text-left">Stock</th>
              <th className="px-6 py-3 text-left">Branch</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-800">
                  {product.name}
                </td>

                <td className="px-6 py-4 text-gray-500">
                  {product.sku}
                </td>

                <td className="px-6 py-4">
                  {product.price.toLocaleString()}
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${stockBadge(
                      product
                    )}`}
                  >
                    {product.stock === 0 && (
                      <AlertTriangle className="w-3 h-3" />
                    )}
                    <Layers className="w-3 h-3" />
                    {product.stock}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1 text-gray-700">
                    <Store className="w-4 h-4" />
                    {product.branch}
                  </span>
                </td>

                <td className="px-6 py-4 text-right space-x-2">
                  <button className="inline-flex items-center gap-1 text-blue-600 hover:underline">
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
