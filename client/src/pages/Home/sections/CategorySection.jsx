import { Link } from "react-router-dom";
import fashionImage from "../../../../src/assets/fashion.jpg";
import gadgetsImage from "../../../../src/assets/earpods.jpg";
import toolsImage from "../../../../src/assets/engineering.png";


const categories = [
  {
    title: "Clothing",
    description: "Trendy and comfortable clothing",
    link: "/products?category=clothing",
    bgImage: fashionImage,
    isGradient: false
    
  },
  {
    title: "Gadgets",
    description: "Latest tech gadgets",
    link: "/products?category=gadgets",
    bgImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.7)), url('${gadgetsImage}')`,
    isGradient: true
  },
  {
    title: "Engineering Tools",
    description: "Professional civil tools",
    link: "/products?category=civil-engineering-tools",
    bgImage: toolsImage,
    isGradient: false
  }
];

export default function CategorySection() {
  return (
    <section className="py-16 bg-gray-50">
      {/* 1. STATIC HEADER: This only renders once */}
      <div className="max-w-7xl mx-auto px-4 text-center mb-12">
        <h2 className="text-3xl font-bold">Shop by Category</h2>
        <p className="text-gray-600 mt-2">Explore our curated collections</p>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          
          
          {categories.map((cat) => {
            // Logic for background
            const backgroundStyle = cat.isGradient 
              ? cat.bgImage 
              : `url(${cat.bgImage})`;

            return (
              <Link
                key={cat.title}
                to={cat.link}
                className="relative rounded-xl p-8 text-white hover:scale-105 transition transform min-h-[300px] flex flex-col justify-end overflow-hidden"
                style={{
                  backgroundImage: backgroundStyle,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                
                <div className="absolute inset-0 bg-black/30"></div>

                
                <div className="relative z-10">
                  <h3 className="text-3xl font-extrabold text-white drop-shadow-md">{cat.title}</h3>
                  <p className="opacity-90">{cat.description}</p>
                </div>
              </Link>
            );
          })}

        </div>
      </div>
    </section>
  );
}