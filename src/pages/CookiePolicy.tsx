// src/pages/CookiePolicy.tsx
import { Shield, Cookie, Globe, Settings, Clock } from "lucide-react";

export default function CookiePolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-800">
      <div className="max-w-5xl mx-auto px-6 py-16">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Cookie className="h-14 w-14 text-purple-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            🍪 Cookie Policy
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Welcome to <span className="font-semibold">SM World Store</span>. This Cookie Policy explains how we use cookies and similar technologies to improve your browsing experience, analyze traffic, and personalize content.
          </p>
        </div>

        {/* Section 1 */}
        <div className="space-y-10">
          <section className="bg-white rounded-2xl shadow p-6 md:p-10">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="h-6 w-6 text-indigo-600" />
              <h2 className="text-2xl font-semibold">1. What Are Cookies?</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Cookies are small text files stored on your device when you visit a website. They help websites function properly, remember your preferences, and improve overall user experience. Cookies do not harm your device.
            </p>
          </section>

          {/* Section 2 */}
          <section className="bg-white rounded-2xl shadow p-6 md:p-10">
            <div className="flex items-center gap-3 mb-4">
              <Settings className="h-6 w-6 text-green-600" />
              <h2 className="text-2xl font-semibold">2. Types of Cookies We Use</h2>
            </div>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li><strong>Essential Cookies:</strong> Required for website functionality (e.g. login, checkout).</li>
              <li><strong>Performance Cookies:</strong> Help us analyze website traffic and performance.</li>
              <li><strong>Functional Cookies:</strong> Remember user preferences like language & region.</li>
              <li><strong>Advertising Cookies:</strong> Used to deliver relevant ads and measure campaign effectiveness.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="bg-white rounded-2xl shadow p-6 md:p-10">
            <div className="flex items-center gap-3 mb-4">
              <Globe className="h-6 w-6 text-blue-600" />
              <h2 className="text-2xl font-semibold">3. Third-Party Cookies</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              We may use third-party services (like Google Analytics, Facebook Pixel, TikTok Pixel) that place cookies on your device to collect usage statistics and deliver personalized ads. These third parties have their own privacy policies.
            </p>
          </section>

          {/* Section 4 */}
          <section className="bg-white rounded-2xl shadow p-6 md:p-10">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="h-6 w-6 text-orange-600" />
              <h2 className="text-2xl font-semibold">4. Cookie Duration</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Some cookies are session-based (deleted when you close the browser), while others are persistent cookies stored for a specific duration until they expire or you delete them manually.
            </p>
          </section>

          {/* Section 5 */}
          <section className="bg-white rounded-2xl shadow p-6 md:p-10">
            <div className="flex items-center gap-3 mb-4">
              <Settings className="h-6 w-6 text-pink-600" />
              <h2 className="text-2xl font-semibold">5. Managing Cookies</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              You can control or delete cookies through your browser settings. However, disabling cookies may affect your browsing experience and limit certain website functionalities.
            </p>
            <ul className="mt-4 list-disc pl-6 space-y-2 text-gray-700">
              <li>Google Chrome: Settings → Privacy & Security → Cookies</li>
              <li>Mozilla Firefox: Preferences → Privacy & Security → Cookies</li>
              <li>Safari: Preferences → Privacy → Manage Website Data</li>
              <li>Microsoft Edge: Settings → Privacy, Search, and Services</li>
            </ul>
          </section>

          {/* Section 6 */}
          <section className="bg-white rounded-2xl shadow p-6 md:p-10">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="h-6 w-6 text-purple-600" />
              <h2 className="text-2xl font-semibold">6. Updates to This Policy</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              We may update this Cookie Policy from time to time to reflect changes in technology, law, or our services. Any changes will be posted on this page with the updated effective date.
            </p>
          </section>

          {/* Section 7 */}
          <section className="bg-white rounded-2xl shadow p-6 md:p-10">
            <div className="flex items-center gap-3 mb-4">
              <Globe className="h-6 w-6 text-red-600" />
              <h2 className="text-2xl font-semibold">7. Contact Us</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              If you have questions about our Cookie Policy, please contact us:
            </p>
            <div className="mt-4 space-y-2">
              <p><strong>Email:</strong> smworldstoreofficial@gmail.com</p>
              <p><strong>Phone:</strong> +8801624712851</p>
              <p><strong>Website:</strong> https://smworldstore.vercel.app</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
