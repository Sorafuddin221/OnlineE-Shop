export default function ReturnPolicyPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="bg-gray-50 border-b border-gray-100 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">Return & Refund Policy</h1>
          <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px]">Last Updated: April 4, 2026</p>
        </div>
      </div>

      <section className="py-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="prose prose-blue max-w-none space-y-12">
            <div className="space-y-4">
              <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase text-xs tracking-[0.3em] text-blue-600">1. Cancellation Policy</h2>
              <p className="text-gray-500 leading-loose">
                You can cancel your booking up to 48 hours before the scheduled delivery time to receive a full 
                refund of your advance payment.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase text-xs tracking-[0.3em] text-blue-600">2. Refund Eligibility</h2>
              <p className="text-gray-500 leading-loose">
                Cancellations made within 48 hours of delivery will not be eligible for a refund of the 
                advance payment.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase text-xs tracking-[0.3em] text-blue-600">3. Damaged Items</h2>
              <p className="text-gray-500 leading-loose">
                If you receive an item that is damaged, please report it immediately upon delivery. We will 
                provide a replacement or refund for the specific item.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase text-xs tracking-[0.3em] text-blue-600">4. Processing Refunds</h2>
              <p className="text-gray-500 leading-loose">
                Refunds will be processed back to the original payment method within 5-7 business days.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
