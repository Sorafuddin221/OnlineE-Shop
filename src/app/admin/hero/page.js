"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import API from "@/services/api";
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Eye, 
  EyeOff, 
  Loader2, 
  Image as ImageIcon,
  MoveUp,
  MoveDown,
  X,
  Check
} from "lucide-react";
import { cn } from "@/utils/cn";

export default function AdminHeroPage() {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSlide, setEditingSlide] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [bgColor, setBgColor] = useState("bg-blue-900");
  const [active, setActive] = useState(true);
  const [order, setOrder] = useState(0);

  const fetchSlides = async () => {
    try {
      const { data } = await API.get("/admin/hero");
      if (data.success) {
        setSlides(data.slides);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch slides");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  const resetForm = () => {
    setTitle("");
    setSubtitle("");
    setDescription("");
    setImageUrl("");
    setBgColor("bg-blue-900");
    setActive(true);
    setOrder(slides.length);
    setEditingSlide(null);
  };

  const handleEdit = (slide) => {
    setEditingSlide(slide);
    setTitle(slide.title);
    setSubtitle(slide.subtitle);
    setDescription(slide.description);
    setImageUrl(slide.image.url);
    setBgColor(slide.bgColor);
    setActive(slide.active);
    setOrder(slide.order);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    const slideData = {
      title,
      subtitle,
      description,
      image: { url: imageUrl },
      bgColor,
      active,
      order: parseInt(order)
    };

    try {
      if (editingSlide) {
        await API.put(`/admin/hero/${editingSlide._id}`, slideData);
        toast.success("Slide updated successfully");
      } else {
        await API.post("/admin/hero", slideData);
        toast.success("Slide created successfully");
      }
      fetchSlides();
      setShowModal(false);
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this slide?")) return;
    try {
      await API.delete(`/admin/hero/${id}`);
      toast.success("Slide deleted");
      fetchSlides();
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  const toggleActive = async (slide) => {
    try {
      await API.put(`/admin/hero/${slide._id}`, { active: !slide.active });
      fetchSlides();
    } catch (error) {
      toast.error("Status update failed");
    }
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <h4 className="text-blue-600 font-bold uppercase tracking-[0.3em] text-[10px]">
            Appearance
          </h4>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">
            Hero Section Manager
          </h2>
        </div>
        <button 
          onClick={() => { resetForm(); setShowModal(true); }}
          className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition shadow-xl shadow-blue-200 flex items-center gap-2"
        >
          <Plus size={18} />
          Add New Slide
        </button>
      </div>

      {/* Slide List */}
      <div className="grid grid-cols-1 gap-6">
        {slides.length === 0 ? (
          <div className="bg-white rounded-[2.5rem] p-20 text-center border border-dashed border-gray-200">
             <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mx-auto mb-6">
                <ImageIcon size={32} />
             </div>
             <p className="text-gray-500 font-bold">No slides found. Using default fallback slides on home page.</p>
          </div>
        ) : (
          slides.map((slide) => (
            <div key={slide._id} className="bg-white rounded-[2.5rem] p-6 border border-gray-100 shadow-sm flex flex-col md:flex-row items-center gap-8 group hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-500">
              <div className="w-full md:w-60 h-40 rounded-3xl overflow-hidden relative shrink-0">
                <img src={slide.image.url} alt={slide.title} className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3 flex gap-2">
                  <div className={cn("px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest", slide.active ? "bg-emerald-500 text-white" : "bg-gray-500 text-white")}>
                    {slide.active ? "Active" : "Hidden"}
                  </div>
                </div>
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-blue-600 font-bold uppercase tracking-widest text-[10px]">{slide.subtitle}</span>
                  <span className="text-gray-300">•</span>
                  <span className="text-gray-400 font-bold text-[10px]">Order: {slide.order}</span>
                </div>
                <h3 className="text-xl font-black text-gray-900 leading-tight">{slide.title}</h3>
                <p className="text-gray-500 text-sm font-medium line-clamp-2">{slide.description}</p>
              </div>

              <div className="flex items-center gap-3 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-8">
                <button 
                  onClick={() => toggleActive(slide)}
                  className={cn("p-4 rounded-2xl transition-all", slide.active ? "bg-amber-50 text-amber-600 hover:bg-amber-100" : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100")}
                  title={slide.active ? "Hide Slide" : "Show Slide"}
                >
                  {slide.active ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
                <button 
                  onClick={() => handleEdit(slide)}
                  className="p-4 bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-100 transition-all"
                  title="Edit Slide"
                >
                  <Edit3 size={20} />
                </button>
                <button 
                  onClick={() => handleDelete(slide._id)}
                  className="p-4 bg-red-50 text-red-600 rounded-2xl hover:bg-red-100 transition-all"
                  title="Delete Slide"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-8 md:p-12">
              <div className="flex items-center justify-between mb-10">
                <h3 className="text-2xl font-black text-gray-900 tracking-tight">
                  {editingSlide ? "Edit Slide" : "Create New Slide"}
                </h3>
                <button onClick={() => setShowModal(false)} className="w-12 h-12 bg-gray-50 text-gray-400 rounded-2xl flex items-center justify-center hover:bg-gray-100 hover:text-gray-900 transition-all">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Title</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Slide Title"
                      className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-blue-600/20 transition-all"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Subtitle</label>
                    <input
                      type="text"
                      value={subtitle}
                      onChange={(e) => setSubtitle(e.target.value)}
                      placeholder="e.g. Modern & Aesthetic"
                      className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-blue-600/20 transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief description of the slide"
                    className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-blue-600/20 transition-all min-h-[100px]"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Image URL</label>
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-blue-600/20 transition-all"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Display Order</label>
                    <input
                      type="number"
                      value={order}
                      onChange={(e) => setOrder(e.target.value)}
                      className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-blue-600/20 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Background Accent</label>
                    <select
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-blue-600/20 transition-all"
                    >
                      <option value="bg-blue-900">Dark Blue</option>
                      <option value="bg-pink-900">Dark Pink</option>
                      <option value="bg-indigo-900">Dark Indigo</option>
                      <option value="bg-emerald-900">Dark Emerald</option>
                      <option value="bg-rose-900">Dark Rose</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-3 px-4 py-2">
                  <button
                    type="button"
                    onClick={() => setActive(!active)}
                    className={cn(
                      "w-12 h-6 rounded-full transition-all relative",
                      active ? "bg-emerald-500" : "bg-gray-300"
                    )}
                  >
                    <div className={cn(
                      "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                      active ? "left-7" : "left-1"
                    )} />
                  </button>
                  <span className="text-sm font-black text-gray-700 uppercase tracking-widest">Active Slide</span>
                </div>

                <div className="flex gap-4 pt-6">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 bg-gray-100 text-gray-900 h-16 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-gray-200 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={formLoading}
                    className="flex-1 bg-blue-600 text-white h-16 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-blue-700 transition shadow-xl shadow-blue-200 flex items-center justify-center gap-3"
                  >
                    {formLoading ? <Loader2 className="animate-spin" size={20} /> : (editingSlide ? "Update Slide" : "Create Slide")}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
