export default function TermsPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="bg-gray-50 border-b border-gray-100 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">টার্মস এন্ড কন্ডিশন</h1>
          <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px]">সর্বশেষ আপডেট: ১০ এপ্রিল, ২০২৬</p>
        </div>
      </div>

      <section className="py-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="prose prose-blue max-w-none space-y-12">
            <p className="text-lg text-gray-600 font-medium leading-relaxed border-l-4 border-blue-600 pl-6 italic">
              আমাদের ওয়েবসাইট থেকে কেনাকাটা করার আগে অনুগ্রহ করে নিচের শর্তাবলী মনোযোগ দিয়ে পড়ুন:
            </p>

            <div className="space-y-4">
              <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase text-xs tracking-[0.3em] text-blue-600">১. অর্ডার গ্রহণ</h2>
              <p className="text-gray-500 leading-loose">
                আপনি যখন একটি অর্ডার প্লে করেন, তখন আমাদের পক্ষ থেকে একটি কনফার্মেশন কল বা এসএমএস পাওয়ার পর তা চূড়ান্ত বলে গণ্য হবে। আমরা যেকোনো সময় যেকোনো অর্ডার বাতিল করার অধিকার রাখি (যেমন- স্টকে পণ্য না থাকা বা তথ্যের ভুল)।
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase text-xs tracking-[0.3em] text-blue-600">২. মূল্য ও পরিশোধ</h2>
              <p className="text-gray-500 leading-loose">
                ওয়েবসাইট প্রদর্শিত মূল্য চূড়ান্ত। তবে কারিগরি ভুলের কারণে কোনো পণ্যের দাম ভুল দেখালে আমরা তা সংশোধনের অধিকার রাখি। আমরা ক্যাশ অন ডেলিভারি এবং অনলাইন পেমেন্ট (বিকাশ, নগদ, রকেট, কার্ড) গ্রহণ করি।
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase text-xs tracking-[0.3em] text-blue-600">৩. ডেলিভারি সময়</h2>
              <p className="text-gray-500 leading-loose">
                সাধারণত ঢাকা সিটির ভিতরে ২-৩ দিন এবং ঢাকার বাইরে ৫-৭ দিনের মধ্যে ডেলিভারি দেওয়া হয়। তবে অনিবার্য কারণে (যেমন- রাজনৈতিক পরিস্থিতি বা আবহাওয়া) সময় কিছুটা বেশি লাগতে পারে।
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase text-xs tracking-[0.3em] text-blue-600">৪. পণ্য ও দায়বদ্ধতা</h2>
              <p className="text-gray-500 leading-loose">
                পণ্য ব্যবহারের ফলে কোনো বিশেষ বা আনুষঙ্গিক ক্ষতির জন্য অনলাইন শপ দায়ী থাকবে না। আমরা সবসময় সঠিক ও মানসম্মত পণ্য সরবরাহের চেষ্টা করি।
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase text-xs tracking-[0.3em] text-blue-600">৫. আইনি বিষয়</h2>
              <p className="text-gray-500 leading-loose">
                আমাদের সকল কার্যক্রম বাংলাদেশের প্রচলিত ই-কমার্স নীতিমালা এবং আইন অনুযায়ী পরিচালিত হবে।
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
