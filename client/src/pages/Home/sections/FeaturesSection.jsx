const features = [
  { icon: "🚚", title: "Free Shipping", desc: "Orders over $50" },
  { icon: "🔒", title: "Secure Payment", desc: "Your data is protected" },
  { icon: "↩️", title: "Easy Returns", desc: "30-day return policy" },
];

export default function FeaturesSection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-8 text-center">
        {features.map(f => (
          <div key={f.title} className="p-6">
            <div className="text-4xl mb-4">{f.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
            <p className="text-gray-600">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
