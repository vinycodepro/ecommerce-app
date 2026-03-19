import { Link } from "react-router-dom";

export default function HeroSection() {
  return (
    <section
      className="relative h-screen flex items-center justify-center text-center text-white"
      style={{
        backgroundImage: "url('/background.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >

    <div className="relative z-10 max-w-3xl px-4">
       <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Welcome to VincyWeb
        </h1>
        <p className="text-xl md:text-2xl mb-8 opacity-90">
          Discover amazing products at great prices
        </p>
        <Link
          to="/products"
          className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-100 transition duration-200"
        >
          Shop Now
        </Link>
      </div>
    </section>
  );
}
