export default function PrivacyPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="bg-gray-50 border-b border-gray-100 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">প্রাইভেসি পলিসি</h1>
          <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px]">সর্বশেষ আপডেট: ১০ এপ্রিল, ২০২৬</p>
        </div>
      </div>

      <section className="py-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="prose prose-blue max-w-none space-y-12">
            <p className="text-lg text-gray-600 font-medium leading-relaxed border-l-4 border-blue-600 pl-6 italic">
              আপনার গোপনীয়তা রক্ষা করা আমাদের প্রথম দায়িত্ব। আমাদের ওয়েবসাইট ব্যবহারের সময় আমরা আপনার যেসব তথ্য সংগ্রহ করি এবং যেভাবে ব্যবহার করি তা নিচে দেওয়া হলো:
            </p>

            <div className="space-y-4">
              <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase text-xs tracking-[0.3em] text-blue-600">১. তথ্য সংগ্রহ</h2>
              <p className="text-gray-500 leading-loose">
                অর্ডার সম্পন্ন করার জন্য আমরা আপনার নাম, মোবাইল নম্বর, ইমেইল ঠিকানা এবং ডেলিভারি ঠিকানা সংগ্রহ করি।
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase text-xs tracking-[0.3em] text-blue-600">২. তথ্যের ব্যবহার</h2>
              <p className="text-gray-500 leading-loose">
                আপনার তথ্য শুধুমাত্র অর্ডার ডেলিভারি, কাস্টমার সাপোর্ট এবং বিশেষ অফার বা আপডেট জানানোর কাজে ব্যবহার করা হয়।
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase text-xs tracking-[0.3em] text-blue-600">৩. তথ্যের নিরাপত্তা (তৃতীয় পক্ষ)</h2>
              <p className="text-gray-500 leading-loose">
                আমরা আপনার কোনো ব্যক্তিগত তথ্য কোনো তৃতীয় পক্ষের কাছে বিক্রি বা শেয়ার করি না (শুধুমাত্র ডেলিভারি পার্টনার ছাড়া)। আপনার পেমেন্ট ইনফরমেশন আমাদের কাছে সংরক্ষিত থাকে না; এগুলো নিরাপদ পেমেন্ট গেটওয়ের মাধ্যমে সম্পন্ন হয়।
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase text-xs tracking-[0.3em] text-blue-600">৪. কুকিজ</h2>
              <p className="text-gray-500 leading-loose">
                ব্রাউজিং অভিজ্ঞতা উন্নত করার জন্য আমরা কুকিজ ব্যবহার করি।
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase text-xs tracking-[0.3em] text-blue-600">৫. যোগাযোগ</h2>
              <p className="text-gray-500 leading-loose">
                আমাদের প্রাইভেসি পলিসি নিয়ে কোনো প্রশ্ন থাকলে যোগাযোগ করুন: mdsorafuddin@gmail.com
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
