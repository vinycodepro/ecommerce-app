import { Link } from "react-router-dom";
import fashionImage from "../../../../src/assets/fashion.jpg";
import gadgetsImage from "../../../../src/assets/earpods.jpg";
import toolsImage from "../../../../src/assets/engineering.png";
import homeLivingImage from "../../../../src/assets/home-living.jpg";
import accessoriesImage from "../../../../src/assets/accessories.jpg";  
import beautyImage from "../../../../src/assets/beauty.jpg";
import kidsToysImage from "../../../../src/assets/kids-toys.jpg";


const categories = [
  {
    title: "Clothing",
    description: "Trendy and comfortable clothing",
    link: "/products?category=clothing",
    bgImage: fashionImage,
    isGradient: false
    
  },
  {
    title: "Beauty & Personal Care",
    description: "Top beauty products",
    link: "/products?category=beauty",
    bgImage: beautyImage,
    isGradient: false
  },
  {
    title: "Home & Living",
    description: "Essentials for your home",
    link: "/products?category=home-living",
    bgImage: homeLivingImage,
    isGradient: false
  },
  {
    title: "Accessories",
    description: "Stylish accessories for every occasion",
    link: "/products?category=accessories",
    bgImage: accessoriesImage,
    isGradient: false
  },
  {
    title: "Electronics & Gadgets",
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
  },
  {
    title: "kids & Toys",
    description: "Fun and educational toys for kids",
    link: "/products?category=kids-toys",
    bgImage: kidsToysImage,
    isGradient: false
  }
];

export default function CategorySection() {
  return (
    <section className="py-16 bg-gray-50">

      <div className="max-w-7xl mx-auto px-4 text-center mb-12">
        <h2 className="text-3xl font-bold">Shop by Category</h2>
        <p className="text-gray-600 mt-2">Explore our curated collections</p>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          
          
          {categories.map((cat) => {
            
            const backgroundStyle = cat.isGradient 
              ? cat.bgImage 
              : `url(${cat.bgImage})`;

            return (
              <Link
                key={cat.title}
                to={cat.link}
                className="relative flex min-h-[240px] flex-col justify-end overflow-hidden rounded-xl p-6 text-white transition hover:scale-[1.02] sm:min-h-[280px] sm:p-8"
                style={{
                  backgroundImage: backgroundStyle,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                
                <div className="absolute inset-0 bg-black/30"></div>

                <div className="relative z-10">
                  <h3 className="text-2xl font-extrabold text-white drop-shadow-md sm:text-3xl">{cat.title}</h3>
                  <p className="mt-2 text-sm opacity-90 sm:text-base">{cat.description}</p>
                </div>
              </Link>
            );
          })}

        </div>
      </div>
    </section>
  );
}
