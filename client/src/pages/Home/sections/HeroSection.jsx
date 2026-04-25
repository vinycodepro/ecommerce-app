import { Link } from "react-router-dom";

export default function HeroSection() {
  return (
    <section
      className="relative flex min-h-[70vh] items-center justify-center px-4 py-20 text-center text-white sm:min-h-[78vh] sm:py-24"
      style={{
        backgroundImage: "url('/background.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >

    <div className="relative z-10 max-w-3xl">
       <h1 className="mb-6 text-4xl font-bold sm:text-5xl md:text-6xl">
          Welcome to VincyShop
        </h1>
        <p className="mb-8 text-lg opacity-90 sm:text-xl md:text-2xl">
          Discover amazing products at great prices
        </p>
        <Link
          to="/products"
          className="inline-block rounded-lg bg-white px-6 py-3 text-base font-semibold text-blue-600 transition duration-200 hover:bg-gray-100 sm:px-8 sm:text-lg"
        >
          Shop Now
        </Link>
      </div>
    </section>
  );
}
