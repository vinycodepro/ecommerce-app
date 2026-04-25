const features = [
  { icon: "Free", title: "Free Shipping", desc: "Orders over $50" },
  { icon: "Safe", title: "Secure Payment", desc: "Your data is protected" },
  { icon: "Easy", title: "Easy Returns", desc: "30-day return policy" },
];

export default function FeaturesSection() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 text-center sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <div key={feature.title} className="rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="mx-auto mb-4 inline-flex rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
              {feature.icon}
            </div>
            <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
            <p className="text-gray-600">{feature.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
