"use client";

import { useEffect, useState } from "react";
import { 
  Users, 
  Mail, 
  Shield, 
  Calendar, 
  MoreVertical, 
  Edit2, 
  Trash2,
  Search,
  Filter,
  X,
  Check,
  AlertCircle,
  Loader2
} from "lucide-react";
import { getAllUsers, updateUser, deleteUser } from "@/services/adminService";
import { toast } from "react-toastify";

export default function UsersAdminPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const fetchUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data || []);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUpdateRole = async (user, newRole) => {
    setUpdating(true);
    try {
      const response = await updateUser(user._id, { role: newRole });
      if (response.success) {
        toast.success("User role updated successfully");
        setEditingUser(null);
        fetchUsers();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update role");
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    
    setDeletingId(id);
    try {
      const response = await deleteUser(id);
      if (response.success) {
        toast.success("User deleted successfully");
        fetchUsers();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete user");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-1">User Management</h2>
          <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px]">Manage your community members</p>
        </div>
        <div className="flex gap-3">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={16} />
            <input 
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white border border-gray-100 rounded-xl py-3 pl-11 pr-6 text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-blue-600/20 transition-all w-64 shadow-sm"
            />
          </div>
          <button className="bg-white border border-gray-100 p-3 rounded-xl text-gray-400 hover:text-blue-600 transition shadow-sm">
            <Filter size={20} />
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">User Details</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Role</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Joined</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                [1,2,3].map((i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan="4" className="px-8 py-6 h-24 bg-gray-50/20"></td>
                  </tr>
                ))
              ) : filteredUsers.length === 0 ? (
                <tr>
                   <td colSpan="4" className="px-8 py-12 text-center text-gray-400 font-bold text-sm">No users found</td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                          <img 
                            src={user.avatar?.url || "/placeholder.png"} 
                            alt={user.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-black text-gray-900">{user.name}</p>
                          <div className="flex items-center gap-1.5 text-gray-400 mt-0.5">
                             <Mail size={12} />
                             <span className="text-[11px] font-bold">{user.email}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      {editingUser === user._id ? (
                        <div className="flex items-center gap-2">
                          <select 
                            defaultValue={user.role}
                            onChange={(e) => handleUpdateRole(user, e.target.value)}
                            disabled={updating}
                            className="bg-gray-50 border border-gray-100 rounded-lg px-3 py-1.5 text-[10px] font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-blue-600/20 transition-all"
                          >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                          </select>
                          <button 
                            onClick={() => setEditingUser(null)}
                            className="p-1.5 text-gray-400 hover:text-red-500 transition"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <div className={cn(
                          "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest",
                          user.role === 'admin' ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600"
                        )}>
                          <Shield size={12} />
                          {user.role}
                        </div>
                      )}
                    </td>
                    <td className="px-8 py-6 text-sm font-bold text-gray-500">
                       <div className="flex items-center gap-2">
                          <Calendar size={14} className="text-gray-300" />
                          {new Date(user.createdAt).toLocaleDateString()}
                       </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => setEditingUser(user._id)}
                          className="p-2.5 text-gray-400 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition shadow-sm bg-white border border-gray-50"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDeleteUser(user._id)}
                          disabled={deletingId === user._id}
                          className="p-2.5 text-gray-400 hover:bg-red-50 hover:text-red-600 rounded-xl transition shadow-sm bg-white border border-gray-50 disabled:opacity-50"
                        >
                          {deletingId === user._id ? <Loader2 className="animate-spin" size={16} /> : <Trash2 size={16} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}
