"use client";

import { useState } from "react";
import { 
  Star, 
  Search, 
  Trash2, 
  MessageSquare, 
  User, 
  Hash,
  ArrowRight,
  Loader2
} from "lucide-react";
import API from "@/services/api";
import { toast } from "react-toastify";

export default function ReviewsAdminPage() {
  const [productId, setProductId] = useState("");
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const productReviewsSubmitHandler = async (e) => {
    e.preventDefault();
    if (productId.length !== 24) {
      toast.error("Invalid Product ID");
      return;
    }

    setLoading(true);
    try {
      const { data } = await API.get(`/admin/reviews?id=${productId}`);
      setReviews(data.reviews);
      if (data.reviews.length === 0) {
        toast.info("No reviews found for this product");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch reviews");
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteReviewHandler = async (reviewId) => {
    setDeleteLoading(true);
    try {
      const { data } = await API.delete(
        `/admin/reviews?id=${reviewId}&productId=${productId}`
      );

      if (data.success) {
        toast.success("Review Deleted Successfully");
        setReviews(reviews.filter((rev) => rev._id !== reviewId));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-1">Product Reviews</h2>
        <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px]">Manage and moderate user feedback</p>
      </div>

      {/* Search Section */}
      <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
        <form onSubmit={productReviewsSubmitHandler} className="flex flex-col md:flex-row items-end gap-6">
          <div className="flex-1 space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Enter Product ID</label>
            <div className="relative group">
              <Hash className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={18} />
              <input 
                type="text"
                required
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                placeholder="Paste Product ID here..."
                className="w-full bg-gray-50 border-none rounded-2xl py-5 pl-16 pr-8 text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-blue-600/20 focus:bg-white transition-all shadow-inner"
              />
            </div>
          </div>
          <button 
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white h-16 px-10 rounded-2xl font-black uppercase tracking-widest text-xs transition shadow-xl shadow-blue-200 flex items-center justify-center gap-3 whitespace-nowrap"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : (
              <>
                Fetch Reviews
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>
      </div>

      {/* Reviews Table */}
      {reviews && reviews.length > 0 ? (
        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Reviewer</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Rating</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Comment</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {reviews.map((rev) => (
                  <tr key={rev._id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
                           <User size={18} />
                        </div>
                        <span className="text-sm font-black text-gray-900">{rev.name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-1 bg-yellow-50 text-yellow-600 px-3 py-1.5 rounded-lg w-fit">
                        <Star size={14} className="fill-yellow-600" />
                        <span className="text-xs font-black">{rev.rating}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-start gap-3 max-w-md">
                        <MessageSquare size={16} className="text-gray-300 mt-0.5 flex-shrink-0" />
                        <p className="text-sm font-bold text-gray-600 line-clamp-2">{rev.comment}</p>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button 
                        onClick={() => deleteReviewHandler(rev._id)}
                        disabled={deleteLoading}
                        className="p-3 text-gray-400 hover:bg-red-50 hover:text-red-600 rounded-xl transition shadow-sm bg-white border border-gray-50 disabled:opacity-50"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        !loading && productId && (
          <div className="bg-gray-50 rounded-[2.5rem] p-20 text-center border-2 border-dashed border-gray-100">
             <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-gray-200 mx-auto mb-6 shadow-sm">
                <MessageSquare size={40} />
             </div>
             <h3 className="text-xl font-black text-gray-900 mb-2">No Reviews Yet</h3>
             <p className="text-gray-400 font-bold text-sm max-w-xs mx-auto">Try searching for another product ID to moderate its reviews.</p>
          </div>
        )
      )}
    </div>
  );
}
