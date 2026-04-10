"use client";

import { useEffect, useState } from "react";
import { getAdminProducts } from "@/services/adminService";
import { 
  Package, 
  Plus, 
  Edit3, 
  Trash2, 
  ExternalLink,
  Loader2,
  Search,
  MoreVertical
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-toastify";
import API from "@/services/api";
import { cn } from "@/utils/cn";

export default function AdminProductsList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const data = await getAdminProducts();
      setProducts(data || []);
    } catch (error) {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const deleteProductHandler = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      const { data } = await API.delete(`/admin/product/${id}`);
      if (data.success) {
        toast.success("Product Deleted Successfully");
        fetchProducts();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="space-y-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <h4 className="text-blue-600 font-bold uppercase tracking-[0.3em] text-[10px]">
            Inventory
          </h4>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">
            Manage Products
          </h2>
        </div>
        <Link 
          href="/admin/product/new"
          className="bg-blue-600 text-white px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition shadow-xl shadow-blue-200 flex items-center gap-2"
        >
          <Plus size={18} />
          Add New Product
        </Link>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
           <div className="relative group w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search by product name..." 
                className="w-full bg-gray-50 border-none rounded-xl py-3.5 pl-12 pr-6 text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-blue-600/20 focus:bg-white transition-all"
              />
           </div>
           <div className="flex items-center gap-3">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total: {products.length} Products</span>
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/50">
              <tr className="text-left text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 border-b border-gray-100">
                <th className="px-8 py-6">Product Details</th>
                <th className="px-8 py-6">Category</th>
                <th className="px-8 py-6">Stock</th>
                <th className="px-8 py-6">Price</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan="5" className="py-20 text-center">
                    <Loader2 className="animate-spin text-blue-600 mx-auto" size={32} />
                  </td>
                </tr>
              ) : products.map((product) => (
                <tr key={product._id} className="group hover:bg-gray-50/50 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 shadow-sm group-hover:scale-105 transition-transform duration-500">
                        <img 
                          src={product.image && product.image[0]?.url ? product.image[0].url : "/placeholder.png"} 
                          alt={product.name} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div className="min-w-0 max-w-[200px]">
                        <p className="font-black text-gray-900 truncate">{product.name || "Unnamed Product"}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">ID: {product._id ? String(product._id).substr(-6) : "N/A"}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">
                      {product.category?.name || "Uncategorized"}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                       <div className={cn(
                         "w-1.5 h-1.5 rounded-full",
                         product.stock > 10 ? "bg-emerald-500" : product.stock > 0 ? "bg-orange-500" : "bg-red-500"
                       )} />
                       <span className={cn(
                         "text-xs font-bold",
                         product.stock > 0 ? "text-gray-700" : "text-red-500"
                       )}>
                         {product.stock} in stock
                       </span>
                    </div>
                  </td>
                  <td className="px-8 py-6 font-black text-gray-900">
                    ৳{product.offeredPrice || product.price}
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center justify-end gap-2">
                      <Link 
                        href={`/product/${product._id}`}
                        className="p-2.5 bg-gray-50 text-gray-400 hover:bg-white hover:text-blue-600 hover:shadow-lg hover:shadow-blue-100 rounded-xl transition group"
                        title="View Site"
                      >
                        <ExternalLink size={16} />
                      </Link>
                      <Link 
                        href={`/admin/product/${product._id}`}
                        className="p-2.5 bg-gray-50 text-gray-400 hover:bg-white hover:text-orange-500 hover:shadow-lg hover:shadow-orange-100 rounded-xl transition group"
                        title="Edit Product"
                      >
                        <Edit3 size={16} />
                      </Link>
                      <button 
                        onClick={() => deleteProductHandler(product._id)}
                        className="p-2.5 bg-gray-50 text-gray-400 hover:bg-white hover:text-red-500 hover:shadow-lg hover:shadow-red-100 rounded-xl transition group"
                        title="Delete Product"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
