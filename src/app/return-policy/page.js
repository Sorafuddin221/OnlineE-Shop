export default function ReturnPolicyPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="bg-gray-50 border-b border-gray-100 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">রিটার্ন এবং রিফান্ড পলিসি</h1>
          <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px]">সর্বশেষ আপডেট: ১০ এপ্রিল, ২০২৬</p>
        </div>
      </div>

      <section className="py-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="prose prose-blue max-w-none space-y-12">
            <p className="text-lg text-gray-600 font-medium leading-relaxed border-l-4 border-blue-600 pl-6 italic">
              আমাদের লক্ষ্য হলো গ্রাহকদের সর্বোচ্চ সেবা নিশ্চিত করা। যদি আমাদের পাঠানো পণ্যে কোনো ত্রুটি থাকে বা ভুল পণ্য পান, তবে আপনি নিচের শর্তসাপেক্ষে তা পরিবর্তন বা ফেরত দিতে পারবেন:
            </p>

            <div className="space-y-4">
              <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase text-xs tracking-[0.3em] text-blue-600">১. সময়সীমা</h2>
              <p className="text-gray-500 leading-loose">
                পণ্য গ্রহণের পর থেকে সর্বোচ্চ ৭ দিনের মধ্যে আমাদের জানাতে হবে।
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase text-xs tracking-[0.3em] text-blue-600">২. শর্তাবলী</h2>
              <p className="text-gray-500 leading-loose">
                পণ্যটি অবশ্যই অব্যব্যবহৃত থাকতে হবে এবং এর অরিজিনাল ট্যাগ, ইনভয়েস এবং প্যাকেজিং অক্ষত থাকতে হবে।
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase text-xs tracking-[0.3em] text-blue-600">৩. রিটার্ন প্রসেস</h2>
              <p className="text-gray-500 leading-loose">
                পণ্যটি রিটার্ন করতে চাইলে আমাদের কাস্টমার কেয়ারে যোগাযোগ করুন অথবা আমাদের ঠিকানায় কুরিয়ার করে পাঠিয়ে দিন।
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase text-xs tracking-[0.3em] text-blue-600">৪. ডেলিভারি চার্জ</h2>
              <p className="text-gray-500 leading-loose">
                যদি আমাদের ভুলের কারণে (ত্রুটিপূর্ণ বা ভুল পণ্য) রিটার্ন হয়, তবে ডেলিভারি চার্জ আমরা বহন করব। অন্যথায়, গ্রাহককে ডেলিভারি চার্জ প্রদান করতে হবে।
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase text-xs tracking-[0.3em] text-blue-600">৫. রিফান্ড</h2>
              <p className="text-gray-500 leading-loose">
                পণ্য আমাদের কাছে পৌঁছানোর পর যাচাই-বাছাই করে ৫-৭ কার্যদিবসের মধ্যে আপনার পছন্দমতো মাধ্যমে (বিকাশ/নগদ/ব্যাংক) টাকা ফেরত দেওয়া হবে।
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
