export default function PrivacyPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="bg-gray-50 border-b border-gray-100 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">Privacy Policy</h1>
          <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px]">Last Updated: April 4, 2026</p>
        </div>
      </div>

      <section className="py-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="prose prose-blue max-w-none space-y-12">
            <div className="space-y-4">
              <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase text-xs tracking-[0.3em] text-blue-600">1. Information We Collect</h2>
              <p className="text-gray-500 leading-loose">
                We collect information you provide directly to us, such as when you create or modify your account, 
                request services, contact customer support, or otherwise communicate with us. This information may 
                include your name, email, phone number, postal address, profile picture, and other information you choose to provide.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase text-xs tracking-[0.3em] text-blue-600">2. How We Use Your Information</h2>
              <p className="text-gray-500 leading-loose">
                We use the information we collect to provide, maintain, and improve our services, such as to 
                process your orders and facilitate payments. We also use your information to send you 
                communications you have requested or that may be of interest to you.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase text-xs tracking-[0.3em] text-blue-600">3. Data Security</h2>
              <p className="text-gray-500 leading-loose">
                We take reasonable measures to help protect information about you from loss, theft, misuse and 
                unauthorized access, disclosure, alteration and destruction. However, no internet or email 
                transmission is ever fully secure or error free.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase text-xs tracking-[0.3em] text-blue-600">4. Contact Us</h2>
              <p className="text-gray-500 leading-loose">
                If you have any questions about this Privacy Policy, please contact us at mdsorafuddin@gmail.com.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
