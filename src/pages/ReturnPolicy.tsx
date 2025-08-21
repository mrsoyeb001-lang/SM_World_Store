import React, { useEffect, useRef, useState } from 'react';

const ReturnRefundPolicy: React.FC = () => {
  const [isVisible, setIsVisible] = useState<boolean[]>([]);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  useEffect(() => {
    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = sectionRefs.current.indexOf(entry.target as HTMLDivElement);
            setIsVisible((prev) => {
              const newVisible = [...prev];
              newVisible[index] = true;
              return newVisible;
            });
          }
        });
      },
      { threshold: 0.2 }
    );

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      sectionRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  // Add more section refs as needed
  const addToRefs = (el: HTMLDivElement | null, index: number) => {
    sectionRefs.current[index] = el;
    if (el && isVisible.length <= index) {
      setIsVisible((prev) => {
        const newVisible = [...prev];
        newVisible[index] = false;
        return newVisible;
      });
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{
      background: 'linear-gradient(135deg, #f0f9ff 0%, #fdf2ff 100%)',
      fontFamily: "'Poppins', 'Tiro Bangla', sans-serif"
    }}>
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full opacity-20 animate-pulse"
            style={{
              width: `${Math.random() * 100 + 50}px`,
              height: `${Math.random() * 100 + 50}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              background: `linear-gradient(135deg, rgba(79, 70, 229, 0.3) 0%, rgba(236, 72, 153, 0.3) 100%)`,
              animationDuration: `${Math.random() * 10 + 10}s`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-4 py-10 relative z-10">
        {/* Hero section with advanced animations */}
        <section 
          ref={(el) => addToRefs(el, 0)}
          className={`text-center mb-16 transition-all duration-1000 ${isVisible[0] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          <div className="inline-block mb-6" style={{ animation: 'float 3s ease-in-out infinite' }}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6" style={{
            background: 'linear-gradient(135deg, #4f46e5 0%, #ec4899 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontFamily: "'Tiro Bangla', 'Poppins', sans-serif"
          }}>রিটার্ন ও রিফান্ড পলিসি</h1>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto" style={{ fontFamily: "'Tiro Bangla', 'Poppins', sans-serif" }}>
            <strong className="text-indigo-600">SM World Store</strong> এ আমরা গ্রাহক সন্তুষ্টিকে সর্বোচ্চ গুরুত্ব দেই। 
            আপনি যদি আপনার ক্রয় থেকে সম্পূর্ণ সন্তুষ্ট না হন, আমাদের নমনীয় রিটার্ন ও রিফান্ড পলিসি আপনাকে সাহায্য করতে এখানে রয়েছে।
          </p>
          
          {/* Animated decorative elements */}
          <div className="absolute top-0 left-1/4 w-20 h-20 bg-purple-300 rounded-full filter blur-xl opacity-30 animate-ping" style={{ animationDuration: '3s' }}></div>
          <div className="absolute top-10 right-1/4 w-16 h-16 bg-blue-300 rounded-full filter blur-xl opacity-30 animate-pulse" style={{ animationDuration: '4s' }}></div>
        </section>

        {/* Cards section with advanced animations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Card 1 */}
          <div 
            ref={(el) => addToRefs(el, 1)}
            className={`bg-white rounded-2xl p-8 shadow-lg border border-gray-200 transition-all duration-700 ${isVisible[1] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} hover:transform hover:-translate-y-2 hover:shadow-2xl`}
            style={{ 
              transition: 'all 0.5s ease',
              backdropFilter: 'blur(10px)',
              background: 'rgba(255, 255, 255, 0.8)'
            }}
          >
            <div className="flex items-center mb-6">
              <div className="bg-blue-100 p-3 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581极0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold ml-4 text-gray-800" style={{ fontFamily: "'Tiro Bangla', 'Poppins', sans-serif" }}>রিটার্নের জন্য যোগ্যতা</h2>
            </div>
            <ul className="space-y-4 text-gray-700" style={{ fontFamily: "'Tiro Bangla', 'Poppins', sans-serif" }}>
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mt-1 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>আপনাকে পণ্য পাওয়ার <strong>৭ দিনের</strong> মধ্যে রিটার্নের জন্য অনুরোধ করতে হবে</span>
              </li>
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mt-1 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 极 00-1.414 1.414l2 2a1 1 0 001.414 0极4-4z" clipRule="evenodd" />
                </svg>
                <span>পণ্য অবশ্যই অপরিবর্তিত, অক্ষত এবং মূল প্যাকেজিংয়ে ফেরত দিতে হবে</span>
              </li>
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mt-1 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>সমস্ত রিটার্নের জন্য ক্রয় প্রমাণ (ইনভয়েস/অর্ডার আইডি) প্রয়োজন</span>
              </li>
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mt-1 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span>কিছু আইটেম (পার্সোনাল কেয়ার, সফটওয়্যার, খাদ্য, অন্তরঙ্গ পণ্য) রিটার্নযোগ্য নয়</span>
              </li>
            </ul>
          </div>

          {/* Card 2 */}
          <div 
            ref={(el) => addToRefs(el, 2)}
            className={`bg-white rounded-2xl p-8 shadow-lg border border-gray-200 transition-all duration-700 delay-100 ${isVisible[2] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} hover:transform hover:-translate-y-2 hover:shadow-2xl`}
            style={{ 
              transition: 'all 0.5s ease',
              backdropFilter: 'blur(10px)',
              background: 'rgba(255, 255, 255, 0.8)'
            }}
          >
            <div className="flex items-center mb-6">
              <div className="bg-purple-100 p-3 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 极z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold ml-4 text-gray-800" style={{ fontFamily: "'Tiro Bangla', 'Poppins', sans-serif" }}>রিফান্ড পলিসি</h2>
            </div>
            <p className="text-gray-700 mb-4" style={{ fontFamily: "'Tiro Bangla', 'Poppins', sans-serif" }}>
              আপনার রিটার্ন অনুমোদিত হলে, <strong>৭-১৪ কর্মদিবসের</strong> মধ্যে রিফান্ড প্রক্রিয়া করা হবে।
              রিফান্ড আপনার মূল পেমেন্ট পদ্ধতিতে (ব্যাংক, কার্ড, মোবাইল ওয়ালেট ইত্যাদি) জারি করা হবে।
            </p>
            <ul className="space-y-4 text-gray-700" style={{ fontFamily: "'Tiro Bangla', 'Poppins', sans-serif" }}>
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mt-1 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>ক্যাশ অন ডেলিভারি রিফান্ড মোবাইল ব্যাংকিং বা স্টোর ক্রেডিটের মাধ্যমে জারি করা হবে</span>
              </li>
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mt-1 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>শিপিং খরচ অ-refundable, যদি না ভুল আমাদের থেকে হয়</span>
              </li>
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mt-1 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>আপনি যদি ক্ষতিগ্রস্ত বা ভুল আইটেম পেয়ে থাকেন, সম্পূর্ণ রিফান্ড + শিপিং কভার করা হবে</span>
              </li>
            </ul>
          </div>

          {/* Card 3 */}
          <div 
            ref={(el) => addToRefs(el, 3)}
            className={`bg-white rounded-2xl p-8 shadow-lg border border-gray-200 transition-all duration-700 delay-200 ${isVisible[3] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} hover:transform hover:-translate-y-2 hover:shadow-2xl`}
            style={{ 
              transition: 'all 0.5s ease',
              backdropFilter: 'blur(10px)',
              background: 'rgba(255, 255, 255, 0.8)'
            }}
          >
            <div className="flex items-center mb-6">
              <div className="bg-green-100 p-3 rounded-full">
                <svg xmlns="http://www.w3.org/2000/s极" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold ml-4 text-gray-800" style={{ fontFamily: "'Tiro Bangla', 'Poppins', sans-serif" }}>গুরুত্বপূর্ণ নোট</h2>
            </div>
            <ul className="space-y-4 text-gray-700" style={{ fontFamily: "'Tiro Bangla', 'Poppins', sans-serif" }}>
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500 mt-1 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7极" clipRule="evenodd" />
                </svg>
                <span>পণ্যের অবস্থা প্রয়োজনীয় না হলে আমরা রিটার্ন拒絶 করার অধিকার সংরক্ষণ করি</span>
              </li>
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500 mt-1 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
                </svg>
                <span>ডিসকাউন্ট বা ক্লিয়ারেন্স আইটেমগুলি ত্রুটিপূর্ণ না হলে ফাইনাল সেল</span>
              </li>
              <li className="flex items-start">
                <svg xmlns="http://www极w3.org/2000/svg" className="h-5 w-5 text-yellow-500 mt-1 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
                </svg>
                <span>কাস্টমাইজড পণ্য ট্রানজিটে ক্ষতিগ্রস্ত না হলে ফেরত দেওয়া যাবে না</span>
              </li>
            </ul>
          </div>

          {/* Card 4 */}
          <div 
            ref={(el) => addToRefs(el, 4)}
            className={`bg-white rounded-2xl p-8 shadow-lg border border-gray-200 transition-all duration-700 delay-300 ${isVisible[4] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} hover:transform hover:-translate-y-2 hover:shadow-2xl`}
            style={{ 
              transition: 'all 0.5s ease',
              backdropFilter: 'blur(10px)',
              background: 'rgba(255, 255, 255, 0.8)'
            }}
          >
            <div className="flex items-center mb-6">
              <div className="bg-orange-100 p-3 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-2m2-10h2m-2 0h-2m2 5h2m-2 0h-2m2 5h2m-2 0h-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 12h3m-3 0h-3" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold ml-4 text-gray-800" style={{ fontFamily: "'Tiro Bangla', 'Poppins', sans-serif" }}>রিটার্ন প্রক্রিয়া</h2>
            </div>
            <ol className="space-y-4 text-gray-700 list-decimal list-inside" style={{ fontFamily: "'Tiro Bangla', 'Poppins', sans-serif" }}>
              <li className="pl-2">রিটার্নের জন্য অনুরোধ করতে ইমেল বা হটলাইনের মাধ্যমে আমাদের সহায়তা দল সাথে যোগাযোগ করুন</li>
              <li className="pl-2">আপনার অর্ডার আইডি, পণ্যের বিবরণ এবং রিটার্নের কারণ প্রদান করুন</li>
              <li className="pl-2">আমাদের দল যোগ্যতা নিশ্চিত করবে এবং একটি রিটার্ন ঠিকানা প্রদান করবে</li>
              <li className="pl-2">সমস্ত মূল আনুষাঙ্গিক এবং ম্যানুয়াল সহ পণ্যটি সুরক্ষিতভাবে শিপ করুন</li>
              <li className="pl-2">প্রাপ্তির পরে, আমরা পরিদর্শন করব এবং আপনার রিটার্ন অনুমোদন/拒絶 করব</li>
            </ol>
          </div>
        </div>

        {/* Contact section with advanced effects */}
        <section 
          ref={(el) => addToRefs(el, 5)}
          className={`rounded-2xl p-8 text-white text-center mb-16 transition-all duration-1000 ${isVisible[5] ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
          style={{ 
            background: 'linear-gradient(135deg, #4f46e5 0%, #ec4899 100%)',
            boxShadow: '0 20px 40px rgba(79, 70, 229, 0.3)'
          }}
        >
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-6" style={{ fontFamily: "'Tiro Bangla', 'Poppins', sans-serif" }}>সাহায্যের প্রয়োজন?</h2>
            <p className="text-lg mb-6" style={{ fontFamily: "'Tiro Bangla', 'Poppins', sans-serif" }}>
              রিটার্ন-সম্পর্কিত প্রশ্নের জন্য, আমাদের সাথে যোগাযোগ করুন:
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <a href="mailto:smworldstoreofficial@gmail.com" className="bg-white text-indigo-600 px-6 py-3 rounded-full font-medium hover:bg-gray-100 transition flex items-center transform hover:-translate-y-1 transition-transform duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2极12a2 2 0 002-2V8.118z" />
                </svg>
                smworldstoreofficial@gmail.com
              </a>
              <a href="tel:+8801624712851" className="bg-white text-indigo-600 px-6 py-3 rounded-full font-medium hover:bg-gray-100 transition flex items-center transform hover:-translate-y-1 transition-transform duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="极2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                +8801624712851
              </a>
            </div>
          </div>
        </section>

        {/* FAQ section with advanced animations */}
        <section 
          ref={(el) => addToRefs(el, 6)}
          className={`mb-16 transition-all duration-1000 ${isVisible[6] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          <h2 className="text-3xl font-bold text-center mb-10" style={{
            background: 'linear-gradient(135deg, #4f46e5 0%, #ec4899 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontFamily: "'Tiro Bangla', 'Poppins', sans-serif"
          }}>সচরাচর জিজ্ঞাসিত প্রশ্ন</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                question: "রিফান্ড পেতে কত সময় লাগে?",
                answer: "রিটার্ন অনুমোদিত হওয়ার পর রিফান্ড প্রক্রিয়া করতে ৭-১৪ কর্মদিবস সময় লাগে। ব্যাংক বা পেমেন্ট প্রভাইডারের উপর সময়ভেদে পরিবর্তন হতে পারে।"
              },
              {
                question: "আমি কিভাবে আমার রিটার্ন স্ট্যাটাস চেক করব?",
                answer: "আপনার রিটার্ন স্ট্যাটাস চেক করতে, আমাদের কাস্টমার সার্ভিস টিমের সাথে ইমেল বা ফোনের মাধ্যমে যোগাযোগ করুন এবং আপনার অর্ডার নম্বর প্রদান করুন।"
              },
              {
                question: "শিপিং খরচ refundable কি?",
                answer: "মূল শিপিং খরচ refundable নয়, যদি না ভুল আমাদের থেকে হয়ে থাকে। যদি আপনি ভুল বা ত্রুটিপূর্ণ পণ্য পেয়ে থাকেন, তবে আমরা সম্পূর্ণ রিফান্ড এবং শিপিং খরচ কভার করব।"
              },
              {
                question: "আমি রিটার্ন করতে কী প্রয়োজন?",
                answer: "রিটার্নের জন্য আপনার প্রয়োজন হবে: অর্ডার আইডি, পণ্যটি তার সমস্ত মূল প্যাকেজিং এবং আনুষাঙ্গিক সহ, এবং রিটার্নের কারণ।"
              }
            ].map((faq, index) => (
              <div 
                key={index}
                className="bg-white p-6 rounded-2xl shadow-md transition-all duration-500 hover:shadow-xl hover:transform hover:-translate-y-1"
                style={{ 
                  backdropFilter: 'blur(10px)',
                  background: 'rgba(255, 255, 255, 0.8)'
                }}
              >
                <h3 className="text-xl font-semibold mb-3 text-gray-800" style={{ fontFamily: "'Tiro Bangla', 'Poppins', sans-serif" }}>{faq.question}</h3>
                <p className="text-gray-700" style={{ fontFamily: "'Tiro Bangla', 'Poppins', sans-serif" }}>{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        .gradient-border {
          position: relative;
          border: double 3px transparent;
          background-image: linear-gradient(white, white), linear-gradient(135deg, #4f46e5 0%, #ec4899 100%);
          background-origin: border-box;
          background-clip: content-box, border-box;
        }
        
        .hover-lift {
          transition: transform 0.3s ease;
        }
        
        .hover-lift:hover {
          transform: translateY(-5px);
        }
        
        .card-glow {
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          transition: box-shadow 0.3s ease;
        }
        
        .card-glow:hover {
          box-shadow: 0 15px 35px rgba(79, 70, 229, 0.2);
        }
      `}</style>
    </div>
  );
};

export default ReturnRefundPolicy;
