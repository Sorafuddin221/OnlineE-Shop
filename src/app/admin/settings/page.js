"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import API from "@/services/api";
import { cn } from "@/utils/cn";
import { 
  Settings, 
  Globe, 
  Menu, 
  Share2, 
  Save, 
  Loader2, 
  Plus, 
  Trash2, 
  MoveUp, 
  MoveDown,
  MapPin,
  Image as ImageIcon,
  Camera,
  Link as LinkIcon
} from "lucide-react";

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("general");

  const [settings, setSettings] = useState({
    siteTitle: "",
    logoText: "",
    logoUrl: "",
    faviconUrl: "",
    navbarItems: [],
    footerText: "",
    contactEmail: "",
    contactPhone: "",
    address: "",
    shippingInsideDhaka: 60,
    shippingOutsideDhaka: 120,
    taxRate: 0,
    socialLinks: {
      facebook: "",
      twitter: "",
      instagram: "",
      youtube: "",
    },
  });

  const fetchSettings = async () => {
    try {
      const { data } = await API.get("/admin/settings");
      if (data.success) {
        setSettings(data.settings);
      }
    } catch (error) {
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSocialChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [name]: value,
      },
    }));
  };

  const handleLogoChange = (e) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setSettings((prev) => ({ ...prev, logoUrl: reader.result }));
      }
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  const handleFaviconChange = (e) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setSettings((prev) => ({ ...prev, faviconUrl: reader.result }));
      }
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  const addNavbarItem = () => {
    setSettings((prev) => ({
      ...prev,
      navbarItems: [
        ...prev.navbarItems,
        { label: "", url: "", order: prev.navbarItems.length, isActive: true, children: [] },
      ],
    }));
  };

  const addSubNavbarItem = (index) => {
    const updatedItems = [...settings.navbarItems];
    if (!updatedItems[index].children) updatedItems[index].children = [];
    updatedItems[index].children.push({ label: "", url: "", order: updatedItems[index].children.length });
    setSettings((prev) => ({ ...prev, navbarItems: updatedItems }));
  };

  const updateSubNavbarItem = (pIndex, sIndex, field, value) => {
    const updatedItems = [...settings.navbarItems];
    updatedItems[pIndex].children[sIndex][field] = value;
    setSettings((prev) => ({ ...prev, navbarItems: updatedItems }));
  };

  const removeSubNavbarItem = (pIndex, sIndex) => {
    const updatedItems = [...settings.navbarItems];
    updatedItems[pIndex].children = updatedItems[pIndex].children.filter((_, i) => i !== sIndex);
    setSettings((prev) => ({ ...prev, navbarItems: updatedItems }));
  };

  const updateNavbarItem = (index, field, value) => {
    const updatedItems = [...settings.navbarItems];
    updatedItems[index][field] = value;
    setSettings((prev) => ({ ...prev, navbarItems: updatedItems }));
  };

  const removeNavbarItem = (index) => {
    const updatedItems = settings.navbarItems.filter((_, i) => i !== index);
    setSettings((prev) => ({ ...prev, navbarItems: updatedItems }));
  };

  const moveNavbarItem = (index, direction) => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === settings.navbarItems.length - 1) return;

    const updatedItems = [...settings.navbarItems];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    [updatedItems[index], updatedItems[targetIndex]] = [updatedItems[targetIndex], updatedItems[index]];
    
    // Update orders
    updatedItems.forEach((item, i) => item.order = i);
    
    setSettings((prev) => ({ ...prev, navbarItems: updatedItems }));
  };

  const saveSettings = async () => {
    setBtnLoading(true);
    try {
      const { data } = await API.put("/admin/settings", settings);
      if (data.success) {
        toast.success("Settings updated successfully");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update settings");
    } finally {
      setBtnLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <h4 className="text-blue-600 font-bold uppercase tracking-[0.3em] text-[10px]">Configuration</h4>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight text-white">Site Settings</h2>
        </div>
        <button
          onClick={saveSettings}
          disabled={btnLoading}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-8 h-14 rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition shadow-xl shadow-blue-900/40 flex items-center gap-3"
        >
          {btnLoading ? <Loader2 className="animate-spin" size={20} /> : <Save size={18} />}
          Save Changes
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Tabs */}
        <div className="lg:w-72 space-y-2">
          {[
            { id: "general", label: "General", icon: Globe },
            { id: "navbar", label: "Navbar", icon: Menu },
            { id: "shipping", label: "Shipping", icon: MapPin },
            { id: "footer", label: "Footer & Contact", icon: Share2 },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all duration-300",
                activeTab === tab.id
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-900/40"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
              )}
            >
              <tab.icon size={20} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="bg-gray-800 rounded-[2.5rem] p-8 md:p-12 border border-gray-700 shadow-2xl">
            {activeTab === "general" && (
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Site Title</label>
                    <input
                      type="text"
                      name="siteTitle"
                      value={settings.siteTitle}
                      onChange={handleInputChange}
                      className="w-full bg-gray-900 border-none rounded-2xl py-5 px-8 text-sm font-bold text-gray-300 outline-none focus:ring-2 focus:ring-blue-600/20 focus:bg-gray-950 transition-all shadow-inner"
                      placeholder="e.g. My Awesome Shop"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Logo Text</label>
                    <input
                      type="text"
                      name="logoText"
                      value={settings.logoText}
                      onChange={handleInputChange}
                      className="w-full bg-gray-900 border-none rounded-2xl py-5 px-8 text-sm font-bold text-gray-300 outline-none focus:ring-2 focus:ring-blue-600/20 focus:bg-gray-950 transition-all shadow-inner"
                      placeholder="e.g. ONLINE SHOP"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Site Logo</label>
                    <div className="relative group w-fit">
                      <div className="w-48 h-24 bg-white rounded-3xl overflow-hidden border-2 border-dashed border-gray-700 flex items-center justify-center transition-all group-hover:border-blue-500/50 shadow-inner">
                        {settings.logoUrl ? (
                          <img src={settings.logoUrl} alt="Logo" className="max-w-full max-h-full object-contain p-4" />
                        ) : (
                          <ImageIcon size={32} className="text-gray-700" />
                        )}
                      </div>
                      <label className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-3 rounded-xl cursor-pointer shadow-lg shadow-blue-900/40 hover:scale-110 transition-transform">
                        <Camera size={18} />
                        <input type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
                      </label>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Favicon</label>
                    <div className="relative group w-fit">
                      <div className="w-24 h-24 bg-white rounded-3xl overflow-hidden border-2 border-dashed border-gray-700 flex items-center justify-center transition-all group-hover:border-blue-500/50 shadow-inner">
                        {settings.faviconUrl ? (
                          <img src={settings.faviconUrl} alt="Favicon" className="w-16 h-16 object-contain" />
                        ) : (
                          <Globe size={32} className="text-gray-700" />
                        )}
                      </div>
                      <label className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-3 rounded-xl cursor-pointer shadow-lg shadow-blue-900/40 hover:scale-110 transition-transform">
                        <Camera size={18} />
                        <input type="file" accept="image/*" onChange={handleFaviconChange} className="hidden" />
                      </label>
                    </div>
                    <p className="text-[10px] text-gray-500 ml-4 italic">Recommended: 32x32 or 64x64 PNG/ICO</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "navbar" && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-black text-white tracking-tight">Navigation Links</h3>
                  <button
                    onClick={addNavbarItem}
                    className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-xl text-xs font-bold transition"
                  >
                    <Plus size={16} /> Add Link
                  </button>
                </div>

                <div className="space-y-6">
                  {settings.navbarItems.map((item, index) => (
                    <div
                      key={index}
                      className="bg-gray-900 p-6 rounded-[2rem] border border-gray-700 space-y-4"
                    >
                      <div className="flex flex-col md:flex-row gap-6 items-center">
                        <div className="flex items-center gap-2">
                          <button
                            disabled={index === 0}
                            onClick={() => moveNavbarItem(index, "up")}
                            className="p-2 text-gray-500 hover:text-blue-500 disabled:opacity-20"
                          >
                            <MoveUp size={18} />
                          </button>
                          <button
                            disabled={index === settings.navbarItems.length - 1}
                            onClick={() => moveNavbarItem(index, "down")}
                            className="p-2 text-gray-500 hover:text-blue-500 disabled:opacity-20"
                          >
                            <MoveDown size={18} />
                          </button>
                        </div>

                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                          <div className="relative">
                            <input
                              type="text"
                              value={item.label}
                              onChange={(e) => updateNavbarItem(index, "label", e.target.value)}
                              placeholder="Label (e.g. Home)"
                              className="w-full bg-gray-800 border-none rounded-xl py-3 px-10 text-xs font-bold text-gray-300 outline-none focus:ring-2 focus:ring-blue-600/20 shadow-inner"
                            />
                            <Menu size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                          </div>
                          <div className="relative">
                            <input
                              type="text"
                              value={item.url}
                              onChange={(e) => updateNavbarItem(index, "url", e.target.value)}
                              placeholder="URL (e.g. /)"
                              className="w-full bg-gray-800 border-none rounded-xl py-3 px-10 text-xs font-bold text-gray-300 outline-none focus:ring-2 focus:ring-blue-600/20 shadow-inner"
                            />
                            <LinkIcon size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => addSubNavbarItem(index)}
                            title="Add Sub-menu"
                            className="p-3 bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white rounded-xl transition"
                          >
                            <Plus size={18} />
                          </button>
                          <button
                            onClick={() => removeNavbarItem(index)}
                            className="p-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>

                      {/* Sub-menu items */}
                      {item.children?.length > 0 && (
                        <div className="ml-12 space-y-3 pt-2 border-l-2 border-gray-800 pl-6">
                          <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-500">Sub-menu Items</h4>
                          {item.children.map((sub, sIndex) => (
                            <div key={sIndex} className="flex flex-col md:flex-row gap-3 items-center">
                              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
                                <input
                                  type="text"
                                  value={sub.label}
                                  onChange={(e) => updateSubNavbarItem(index, sIndex, "label", e.target.value)}
                                  placeholder="Sub Label"
                                  className="w-full bg-gray-800/50 border-none rounded-lg py-2 px-4 text-[10px] font-bold text-gray-400 outline-none focus:ring-1 focus:ring-blue-600/20 shadow-inner"
                                />
                                <input
                                  type="text"
                                  value={sub.url}
                                  onChange={(e) => updateSubNavbarItem(index, sIndex, "url", e.target.value)}
                                  placeholder="Sub URL"
                                  className="w-full bg-gray-800/50 border-none rounded-lg py-2 px-4 text-[10px] font-bold text-gray-400 outline-none focus:ring-1 focus:ring-blue-600/20 shadow-inner"
                                />
                              </div>
                              <button
                                onClick={() => removeSubNavbarItem(index, sIndex)}
                                className="p-2 text-red-500/50 hover:text-red-500 transition"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}

                  {settings.navbarItems.length === 0 && (
                    <div className="py-20 text-center bg-gray-900 rounded-[2.5rem] border border-dashed border-gray-700 text-gray-500 font-bold">
                      No navigation links added yet.
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "shipping" && (
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white tracking-tight">Shipping & Tax</h3>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Configure delivery costs and GST</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-gray-900 p-8 rounded-[2rem] border border-gray-700 space-y-4">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-blue-500">Inside Dhaka</label>
                      <span className="bg-blue-500/10 text-blue-500 px-3 py-1 rounded-full text-[8px] font-black uppercase">Standard</span>
                    </div>
                    <div className="relative">
                      <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 font-black">৳</span>
                      <input
                        type="number"
                        name="shippingInsideDhaka"
                        value={settings.shippingInsideDhaka}
                        onChange={handleInputChange}
                        className="w-full bg-gray-800 border-none rounded-2xl py-5 pl-12 pr-8 text-lg font-black text-white outline-none focus:ring-2 focus:ring-blue-600/20 shadow-inner"
                        placeholder="60"
                      />
                    </div>
                    <p className="text-[9px] text-gray-500 italic">Delivery within Dhaka city corporation areas.</p>
                  </div>

                  <div className="bg-gray-900 p-8 rounded-[2rem] border border-gray-700 space-y-4">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-orange-500">Outside Dhaka</label>
                      <span className="bg-orange-500/10 text-orange-500 px-3 py-1 rounded-full text-[8px] font-black uppercase">Currier</span>
                    </div>
                    <div className="relative">
                      <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 font-black">৳</span>
                      <input
                        type="number"
                        name="shippingOutsideDhaka"
                        value={settings.shippingOutsideDhaka}
                        onChange={handleInputChange}
                        className="w-full bg-gray-800 border-none rounded-2xl py-5 pl-12 pr-8 text-lg font-black text-white outline-none focus:ring-2 focus:ring-orange-600/20 shadow-inner"
                        placeholder="120"
                      />
                    </div>
                    <p className="text-[9px] text-gray-500 italic">Delivery to all other districts across Bangladesh.</p>
                  </div>

                  <div className="bg-gray-900 p-8 rounded-[2rem] border border-gray-700 space-y-4">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-emerald-500">GST (Goods & Services Tax)</label>
                      <span className="bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full text-[8px] font-black uppercase">Taxation</span>
                    </div>
                    <div className="relative">
                      <span className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500 font-black">%</span>
                      <input
                        type="number"
                        name="taxRate"
                        value={settings.taxRate ?? 0}
                        onChange={handleInputChange}
                        className="w-full bg-gray-800 border-none rounded-2xl py-5 pl-8 pr-12 text-lg font-black text-white outline-none focus:ring-2 focus:ring-emerald-600/20 shadow-inner"
                        placeholder="5"
                      />
                    </div>
                    <p className="text-[9px] text-gray-500 italic">Percentage of tax to be applied to orders.</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "footer" && (
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Footer Copyright Text</label>
                  <input
                    type="text"
                    name="footerText"
                    value={settings.footerText}
                    onChange={handleInputChange}
                    className="w-full bg-gray-900 border-none rounded-2xl py-5 px-8 text-sm font-bold text-gray-300 outline-none focus:ring-2 focus:ring-blue-600/20 focus:bg-gray-950 transition-all shadow-inner"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Contact Email</label>
                    <input
                      type="email"
                      name="contactEmail"
                      value={settings.contactEmail}
                      onChange={handleInputChange}
                      className="w-full bg-gray-900 border-none rounded-2xl py-5 px-8 text-sm font-bold text-gray-300 outline-none focus:ring-2 focus:ring-blue-600/20 focus:bg-gray-950 transition-all shadow-inner"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Contact Phone</label>
                    <input
                      type="text"
                      name="contactPhone"
                      value={settings.contactPhone}
                      onChange={handleInputChange}
                      className="w-full bg-gray-900 border-none rounded-2xl py-5 px-8 text-sm font-bold text-gray-300 outline-none focus:ring-2 focus:ring-blue-600/20 focus:bg-gray-950 transition-all shadow-inner"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Address</label>
                  <textarea
                    name="address"
                    value={settings.address}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full bg-gray-900 border-none rounded-2xl py-5 px-8 text-sm font-bold text-gray-300 outline-none focus:ring-2 focus:ring-blue-600/20 focus:bg-gray-950 transition-all shadow-inner"
                  />
                </div>

                <div className="space-y-6">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-blue-500 ml-4">Social Media Links</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {["facebook", "twitter", "instagram", "youtube"].map((platform) => (
                      <div key={platform} className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-4 capitalize">{platform}</label>
                        <input
                          type="text"
                          name={platform}
                          value={settings.socialLinks[platform]}
                          onChange={handleSocialChange}
                          placeholder={`https://${platform}.com/yourpage`}
                          className="w-full bg-gray-900 border-none rounded-2xl py-4 px-8 text-xs font-bold text-gray-300 outline-none focus:ring-2 focus:ring-blue-600/20 focus:bg-gray-950 transition-all shadow-inner"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

