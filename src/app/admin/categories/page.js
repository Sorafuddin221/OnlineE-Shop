"use client";

import { useState, useEffect, Fragment } from "react";
import { toast } from "react-toastify";
import API from "@/services/api";
import { getAllCategories } from "@/services/categoryService";
import { nestCategories } from "@/utils/categoryHelper";
import { 
  Plus, 
  Tags, 
  Edit3, 
  Trash2, 
  Loader2,
  FolderPlus,
  Layers,
  Image as ImageIcon,
  Camera,
  X,
  ChevronRight,
  CornerDownRight
} from "lucide-react";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [nestedCategories, setNestedCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  
  // Form States
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [parentId, setParentId] = useState("");
  
  // Edit States
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);

  const fetchCategories = async () => {
    try {
      const data = await getAllCategories();
      setCategories(data || []);
      setNestedCategories(nestCategories(data || []));
    } catch (error) {
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const resetForm = () => {
    setName("");
    setImage("");
    setImagePreview("");
    setParentId("");
    setIsEdit(false);
    setEditId(null);
  };

  const createCategoryHandler = async (e) => {
    e.preventDefault();
    
    if (!image && !isEdit) {
      toast.error("Please upload a category image");
      return;
    }
    
    setBtnLoading(true);
    try {
      if (isEdit) {
        const { data } = await API.put(`/admin/category/${editId}`, { 
          name, 
          image: image || undefined, 
          parent: parentId || null 
        });
        if (data.success) {
          toast.success("Category Updated Successfully");
          resetForm();
          fetchCategories();
        }
      } else {
        const { data } = await API.post("/admin/category/create", { 
          name, 
          image, 
          parent: parentId || null 
        });
        if (data.success) {
          toast.success("Category Created Successfully");
          resetForm();
          fetchCategories();
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    } finally {
      setBtnLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setImagePreview(reader.result);
        setImage(reader.result);
      }
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  const editHandler = (category) => {
    setIsEdit(true);
    setEditId(category._id);
    setName(category.name);
    setImagePreview(category.image?.url);
    setImage(""); // Reset image string, only set if user uploads new
    setParentId(category.parent || "");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteCategoryHandler = async (id) => {
    if (!window.confirm("Are you sure? This will delete the category and its image.")) return;
    try {
      await API.delete(`/admin/category/${id}`);
      toast.success("Category Deleted Successfully");
      fetchCategories();
    } catch (error) {
      toast.error("Failed to delete category");
    }
  };

  // Helper to get category name by ID
  const getCategoryName = (id) => {
    const cat = categories.find(c => c._id === id);
    return cat ? cat.name : "None";
  };

  const renderCategoryRows = (cats, depth = 0) => {
    return cats.map(cat => (
      <Fragment key={cat._id}>
        <tr className="group hover:bg-gray-50/50 transition-colors">
          <td className="px-8 py-6">
            <div className="w-12 h-12 bg-gray-100 rounded-xl overflow-hidden border border-gray-100 shadow-sm relative">
              <img src={cat.image?.url} alt={cat.name} className="w-full h-full object-cover" />
            </div>
          </td>
          <td className="px-8 py-6">
            <div className="flex items-center gap-2" style={{ marginLeft: `${depth * 1.5}rem` }}>
              {depth > 0 && <CornerDownRight size={14} className="text-gray-300" />}
              <span className="font-black text-gray-900 tracking-tight">{cat.name}</span>
            </div>
          </td>
          <td className="px-8 py-6">
            <span className={cn(
              "px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest",
              cat.parent ? "bg-purple-50 text-purple-600" : "bg-blue-50 text-blue-600"
            )}>
              {cat.parent ? `Sub of ${getCategoryName(cat.parent)}` : "Main"}
            </span>
          </td>
          <td className="px-8 py-6">
            <div className="flex items-center justify-end gap-2">
              <button 
                onClick={() => editHandler(cat)}
                className="p-2.5 bg-gray-50 text-gray-400 hover:bg-white hover:text-orange-500 hover:shadow-lg hover:shadow-orange-100 rounded-xl transition group"
              >
                <Edit3 size={16} />
              </button>
              <button 
                onClick={() => deleteCategoryHandler(cat._id)}
                className="p-2.5 bg-gray-50 text-gray-400 hover:bg-white hover:text-red-500 hover:shadow-lg hover:shadow-red-100 rounded-xl transition group"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </td>
        </tr>
        {cat.children?.length > 0 && renderCategoryRows(cat.children, depth + 1)}
      </Fragment>
    ));
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <h4 className="text-blue-600 font-bold uppercase tracking-[0.3em] text-[10px]">Structure</h4>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">
            {isEdit ? "Edit Category" : "Product Categories"}
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Category Form */}
        <div className="lg:col-span-1">
           <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-2xl shadow-gray-200/50 sticky top-24">
              <div className="flex items-center justify-between mb-10">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                       {isEdit ? <Edit3 size={24} /> : <FolderPlus size={24} />}
                    </div>
                    <h3 className="text-xl font-black text-gray-900 tracking-tight">
                       {isEdit ? "Update" : "New"} Category
                    </h3>
                 </div>
                 {isEdit && (
                    <button onClick={resetForm} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition">
                       <X size={20} />
                    </button>
                 )}
              </div>

              <form onSubmit={createCategoryHandler} className="space-y-8">
                 {/* Image Upload */}
                 <div className="flex flex-col items-center gap-4 mb-6">
                    <div className="relative group">
                       <div className="w-32 h-32 bg-gray-50 rounded-3xl overflow-hidden border-2 border-dashed border-gray-200 flex items-center justify-center transition-all group-hover:border-blue-500/50 shadow-inner">
                          {imagePreview ? (
                             <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                          ) : (
                             <ImageIcon size={32} className="text-gray-300" />
                          )}
                       </div>
                       <label className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-3 rounded-xl cursor-pointer shadow-lg shadow-blue-200 hover:scale-110 transition-transform">
                          <Camera size={18} />
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleImageChange} 
                            className="hidden" 
                          />
                       </label>
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Category Image</p>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Category Name</label>
                    <input 
                      type="text" 
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Wedding Decor" 
                      className="w-full bg-gray-50 border-none rounded-2xl py-5 px-8 text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-blue-600/20 focus:bg-white transition-all shadow-inner"
                    />
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Parent Category (Optional)</label>
                    <select
                      value={parentId}
                      onChange={(e) => setParentId(e.target.value)}
                      className="w-full bg-gray-50 border-none rounded-2xl py-5 px-8 text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-blue-600/20 focus:bg-white transition-all shadow-inner appearance-none cursor-pointer"
                    >
                      <option value="">None (Top Level)</option>
                      {categories
                        .filter(c => c._id !== editId) // Can't be parent of itself
                        .map(cat => (
                          <option key={cat._id} value={cat._id}>{cat.name}</option>
                        ))
                      }
                    </select>
                 </div>

                 <button 
                   disabled={btnLoading}
                   className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white h-16 rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition shadow-xl shadow-blue-200 flex items-center justify-center gap-3"
                 >
                   {btnLoading ? <Loader2 className="animate-spin" size={20} /> : (
                     <>
                       {isEdit ? <Edit3 size={18} /> : <Plus size={18} />}
                       {isEdit ? "Update Category" : "Add Category"}
                     </>
                   )}
                 </button>
              </form>
           </div>
        </div>

        {/* Categories List */}
        <div className="lg:col-span-2">
           <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <Layers className="text-blue-600" size={20} />
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Categories ({categories.length})</span>
                 </div>
              </div>

              <div className="overflow-x-auto">
                 <table className="w-full">
                    <thead className="bg-gray-50/50">
                       <tr className="text-left text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 border-b border-gray-100">
                          <th className="px-8 py-6">Preview</th>
                          <th className="px-8 py-6">Name</th>
                          <th className="px-8 py-6">Type</th>
                          <th className="px-8 py-6 text-right">Actions</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                       {loading ? (
                         <tr>
                           <td colSpan="4" className="py-20 text-center">
                             <Loader2 className="animate-spin text-blue-600 mx-auto" size={32} />
                           </td>
                         </tr>
                       ) : categories.length === 0 ? (
                         <tr>
                           <td colSpan="4" className="py-20 text-center text-gray-400 font-bold">No categories found.</td>
                         </tr>
                       ) : renderCategoryRows(nestedCategories)}
                    </tbody>
                 </table>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}
