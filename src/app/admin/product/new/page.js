"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import API from "@/services/api";
import { getAllCategories } from "@/services/categoryService";
import { 
  Plus, 
  Package, 
  Type, 
  Tag, 
  DollarSign, 
  Database, 
  Image as ImageIcon,
  Loader2,
  X,
  FileText
} from "lucide-react";
import { nestCategories } from "@/utils/categoryHelper";

export default function CreateProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [nestedCategories, setNestedCategories] = useState([]);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [offeredPrice, setOfferedPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState(0);
  const [images, setImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const data = await getAllCategories();
        setCategories(data);
        setNestedCategories(nestCategories(data));
      } catch (err) {
        toast.error("Failed to load categories");
      }
    };
    fetchCats();
  }, []);

  const renderCategoryOptions = (cats, depth = 0) => {
    return cats.map(cat => (
      <optgroup key={cat._id} label={`${"—".repeat(depth)} ${cat.name}`}>
        <option value={cat._id}>{cat.name}</option>
        {cat.children?.length > 0 && renderCategoryOptions(cat.children, depth + 1)}
      </optgroup>
    ));
  };

  const renderFlatOptions = (cats, depth = 0) => {
    let options = [];
    cats.forEach(cat => {
      options.push(
        <option key={cat._id} value={cat._id}>
          {"\u00A0".repeat(depth * 4)}{depth > 0 ? "└─ " : ""}{cat.name}
        </option>
      );
      if (cat.children?.length > 0) {
        options = [...options, ...renderFlatOptions(cat.children, depth + 1)];
      }
    });
    return options;
  };

  const createProductSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const productData = {
        name,
        price,
        offeredPrice,
        description,
        category,
        stock,
        images,
      };

      const { data } = await API.post("/admin/product/new", productData);

      if (data.success) {
        toast.success("Product Created Successfully");
        router.push("/admin/products");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const createProductImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setImages([]);
    setImagesPreview([]);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagesPreview((old) => [...old, reader.result]);
          setImages((old) => [...old, reader.result]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <h4 className="text-blue-600 font-bold uppercase tracking-[0.3em] text-[10px]">Inventory</h4>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Create New Product</h2>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-gray-100 shadow-2xl shadow-gray-200/50">
        <form onSubmit={createProductSubmitHandler} className="space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Side: General Info */}
            <div className="space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Product Name</label>
                <div className="relative group">
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors">
                    <Type size={18} />
                  </div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter product name..."
                    className="w-full bg-gray-50 border-none rounded-2xl py-5 pl-16 pr-8 text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-blue-600/20 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Base Price (৳)</label>
                  <div className="relative group">
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors">
                      <DollarSign size={18} />
                    </div>
                    <input
                      type="number"
                      required
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="5000"
                      className="w-full bg-gray-50 border-none rounded-2xl py-5 pl-16 pr-8 text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-blue-600/20 focus:bg-white transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Offer Price (Optional)</label>
                  <div className="relative group">
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors">
                      <Tag size={18} />
                    </div>
                    <input
                      type="number"
                      value={offeredPrice}
                      onChange={(e) => setOfferedPrice(e.target.value)}
                      placeholder="4500"
                      className="w-full bg-gray-50 border-none rounded-2xl py-5 pl-16 pr-8 text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-blue-600/20 focus:bg-white transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Category</label>
                  <div className="relative group">
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors">
                      <Package size={18} />
                    </div>
                    <select
                      required
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-gray-50 border-none rounded-2xl py-5 pl-16 pr-8 text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-blue-600/20 focus:bg-white transition-all appearance-none cursor-pointer"
                    >
                      <option value="">Select Category</option>
                      {renderFlatOptions(nestedCategories)}
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Stock Quantity</label>
                  <div className="relative group">
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors">
                      <Database size={18} />
                    </div>
                    <input
                      type="number"
                      required
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                      placeholder="10"
                      className="w-full bg-gray-50 border-none rounded-2xl py-5 pl-16 pr-8 text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-blue-600/20 focus:bg-white transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side: Description & Images */}
            <div className="space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Product Description</label>
                <div className="relative group">
                  <div className="absolute left-6 top-6 text-gray-400 group-focus-within:text-blue-600 transition-colors">
                    <FileText size={18} />
                  </div>
                  <textarea
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Tell us about the product..."
                    className="w-full bg-gray-50 border-none rounded-2xl py-5 pl-16 pr-8 text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-blue-600/20 focus:bg-white transition-all min-h-[150px]"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Product Images</label>
                <div className="grid grid-cols-4 gap-4">
                  {imagesPreview.map((img, index) => (
                    <div key={index} className="relative aspect-square rounded-2xl overflow-hidden border border-gray-100 shadow-sm group">
                      <img src={img} alt="Preview" className="w-full h-full object-cover" />
                      <button 
                        type="button"
                        onClick={() => {
                          setImages(images.filter((_, i) => i !== index));
                          setImagesPreview(imagesPreview.filter((_, i) => i !== index));
                        }}
                        className="absolute top-1 right-1 bg-white/80 backdrop-blur-md p-1 rounded-lg text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  <label className="aspect-square rounded-2xl bg-blue-50 border-2 border-dashed border-blue-200 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-blue-100/50 transition-all group">
                    <ImageIcon className="text-blue-400 group-hover:scale-110 transition-transform" size={24} />
                    <span className="text-[8px] font-black uppercase tracking-widest text-blue-600">Add More</span>
                    <input
                      type="file"
                      name="avatar"
                      accept="image/*"
                      onChange={createProductImagesChange}
                      multiple
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-10 border-t border-gray-50">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-xs transition shadow-xl shadow-blue-200 flex items-center gap-3"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : (
                <>
                  <Plus size={18} />
                  Publish Product
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
