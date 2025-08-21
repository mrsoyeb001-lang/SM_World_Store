import { useNavigate } from 'react-router-dom';
import { ArrowRight, Star, TrendingUp } from 'lucide-react';

const Homepage = () => {
  const navigate = useNavigate();

  // পণ্যের ডেমো ডেটা - আপনার আসল ডেটা দিয়ে প্রতিস্থাপন করুন
  const products = [
    {
      id: 1,
      name: "Mini Hand Fan",
      price: 3399,
      originalPrice: 5599,
      discount: 33,
      rating: 5,
      reviews: 35,
      sold: 12,
      image: "/placeholder.jpg"
    },
    {
      id: 2,
      name: "4 Port USB 3.0 Hub",
      price: 1200,
      originalPrice: 1950,
      discount: 38,
      rating: 4,
      reviews: 28,
      sold: 8,
      image: "/placeholder.jpg"
    },
    {
      id: 3,
      name: "Rose Diamond Table Lamp",
      price: 920,
      originalPrice: 1200,
      discount: 23,
      rating: 5,
      reviews: 42,
      sold: 15,
      image: "/placeholder.jpg"
    },
    {
      id: 4,
      name: "Mouse Pad Earth Design",
      price: 480,
      originalPrice: 650,
      discount: 26,
      rating: 4,
      reviews: 19,
      sold: 7,
      image: "/placeholder.jpg"
    },
    {
      id: 5,
      name: "Flame Effect Bluetooth Speaker",
      price: 1450,
      originalPrice: 1999,
      discount: 27,
      rating: 5,
      reviews: 56,
      sold: 20,
      image: "/placeholder.jpg"
    },
    {
      id: 6,
      name: "Key Ring for Bikers",
      price: 280,
      originalPrice: 350,
      discount: 20,
      rating: 4,
      reviews: 31,
      sold: 5,
      image: "/placeholder.jpg"
    },
    {
      id: 7,
      name: "Cable Wire Holder",
      price: 180,
      originalPrice: 250,
      discount: 28,
      rating: 4,
      reviews: 24,
      sold: 3,
      image: "/placeholder.jpg"
    },
    {
      id: 8,
      name: "Wireless Earbuds",
      price: 1299,
      originalPrice: 1799,
      discount: 28,
      rating: 5,
      reviews: 67,
      sold: 25,
      image: "/placeholder.jpg"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              স্বাগতম SM World Store এ
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              সেরা মানের পণ্য, সাশ্রয়ী দাম
            </p>
            <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold shadow-lg flex items-center justify-center mx-auto">
              কেনাকাটা শুরু করুন
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-8 bg-blue-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-6 text-center rounded-lg shadow">
              <div className="text-2xl font-bold text-blue-600 mb-2">১০০০+</div>
              <div className="text-sm text-gray-600">
                সন্তুষ্ট গ্রাহক
              </div>
            </div>

            <div className="bg-white p-6 text-center rounded-lg shadow">
              <div className="text-2xl font-bold text-blue-600 mb-2">৫০০+</div>
              <div className="text-sm text-gray-600">
                পণ্যের সংগ্রহ
              </div>
            </div>

            <div className="bg-white p-6 text-center rounded-lg shadow">
              <div className="flex items-center justify-center mb-2">
                <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                <span className="text-2xl font-bold text-blue-600 ml-1">৪.৮</span>
              </div>
              <div className="text-sm text-gray-600">গড় রেটিং</div>
            </div>

            <div className="bg-white p-6 text-center rounded-lg shadow">
              <div className="text-2xl font-bold text-blue-600 mb-2">২৪/৭</div>
              <div className="text-sm text-gray-600">সাপোর্ট</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content - Product Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">সর্বশেষ পণ্যসমূহ</h2>
            <button
              className="border border-blue-600 text-blue-600 px-4 py-2 rounded-lg flex items-center"
              onClick={() => navigate('/products')}
            >
              সব দেখুন
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </div>

          {/* Product Grid - 2 columns on mobile */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                <div className="relative">
                  <div className="aspect-square bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">পণ্যের ছবি</span>
                  </div>
                  {product.discount > 0 && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                      -{product.discount}%
                    </div>
                  )}
                </div>
                
                <div className="p-3">
                  <h3 className="font-medium text-sm mb-1 line-clamp-2 h-10">{product.name}</h3>
                  
                  <div className="flex items-center mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-3 w-3 ${i < product.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                      />
                    ))}
                    <span className="text-xs ml-1 text-gray-500">({product.reviews})</span>
                  </div>
                  
                  <div className="flex items-center justify-between mt-2">
                    <div>
                      <span className="text-blue-600 font-bold">৳{product.price.toLocaleString()}</span>
                      {product.originalPrice > product.price && (
                        <span className="text-gray-500 text-xs line-through ml-1">৳{product.originalPrice.toLocaleString()}</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-500 mt-1">
                    {product.sold} বিক্রিত
                  </div>
                  
                  <button className="w-full bg-blue-600 text-white py-2 rounded-lg mt-3 text-sm font-medium hover:bg-blue-700 transition-colors">
                    অর্ডার করুন
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional CSS for responsiveness */}
      <style jsx>{`
        @media (max-width: 768px) {
          .grid.grid-cols-2 {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 0.75rem;
          }
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default Homepage;
