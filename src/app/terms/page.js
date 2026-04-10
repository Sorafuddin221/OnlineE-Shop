export default function TermsPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="bg-gray-50 border-b border-gray-100 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">Terms & Conditions</h1>
          <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px]">Last Updated: April 4, 2026</p>
        </div>
      </div>

      <section className="py-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="prose prose-blue max-w-none space-y-12">
            <div className="space-y-4">
              <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase text-xs tracking-[0.3em] text-blue-600">1. Terms of Use</h2>
              <p className="text-gray-500 leading-loose">
                By accessing this website, we assume you accept these terms and conditions. Do not continue to 
                use OnlineShop if you do not agree to take all of the terms and conditions stated on this page.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase text-xs tracking-[0.3em] text-blue-600">2. Rental Policy</h2>
              <p className="text-gray-500 leading-loose">
                All decoration items are for rental purposes unless otherwise specified. Customers are responsible 
                for the items during the rental period. Any damage to the items will incur additional charges.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase text-xs tracking-[0.3em] text-blue-600">3. Booking and Payments</h2>
              <p className="text-gray-500 leading-loose">
                A 50% advance payment is required to confirm your booking. The remaining balance must be cleared 
                before the delivery of the items.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase text-xs tracking-[0.3em] text-blue-600">4. Limitation of Liability</h2>
              <p className="text-gray-500 leading-loose">
                OnlineShop shall not be liable for any special or consequential damages that result from the use 
                of, or the inability to use, the materials on this site or the performance of the products.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
