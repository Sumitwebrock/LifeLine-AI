import { useNavigate } from "react-router";
import { Heart, MapPin, Shield, Users, Zap } from "lucide-react";

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "Inter, sans-serif" }}>
      {/* Header */}
      <header className="border-b border-gray-100 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <a href="#home" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500 text-white">
              <Heart className="h-4 w-4 fill-white" />
            </div>
            <span className="text-lg font-bold text-gray-900">LifeLine AI</span>
          </a>

          <nav className="hidden gap-8 text-sm text-gray-600 md:flex">
            <a href="#home" className="hover:text-gray-900">Home</a>
            <a href="#features" className="hover:text-gray-900">Features</a>
            <a href="#how-it-works" className="hover:text-gray-900">How It Works</a>
            <a href="#about" className="hover:text-gray-900">About Us</a>
            <a href="#contact" className="hover:text-gray-900">Contact</a>
          </nav>

          <div className="flex gap-3">
            <button
              onClick={() => navigate("/login")}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Log In
            </button>
            <button
              onClick={() => navigate("/responder")}
              className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100"
            >
              Responder Login
            </button>
            <button
              onClick={() => navigate("/login")}
              className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
            >
              Start Emergency
            </button>
          </div>
        </div>
      </header>

      <main id="home">
        {/* Hero */}
        <section className="mx-auto max-w-6xl px-6 py-16 text-center md:py-24">
          <h1 className="text-5xl font-bold text-gray-900 md:text-6xl">
            Emergency Response<br />
            <span className="text-red-500">That Saves Lives</span>
          </h1>
          <p className="mt-6 text-lg text-gray-600">
            Connect instantly with nearby responders, doctors, volunteers, and ambulances when you need help most.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              onClick={() => navigate("/app")}
              className="rounded-lg bg-red-500 px-8 py-3 font-medium text-white hover:bg-red-600"
            >
              Start Emergency
            </button>
            <button
              onClick={() => navigate("/app")}
              className="rounded-lg border border-gray-300 bg-white px-8 py-3 font-medium text-gray-700 hover:bg-gray-50"
            >
              Explore Dashboard
            </button>
            <button
              onClick={() => navigate("/responder")}
              className="rounded-lg border border-red-200 bg-red-50 px-8 py-3 font-medium text-red-700 hover:bg-red-100"
            >
              Login as Responder
            </button>
          </div>

          <div className="mt-12 flex justify-center gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">12,500+</div>
              <div className="text-sm text-gray-600">Emergencies Handled</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">8,900+</div>
              <div className="text-sm text-gray-600">Active Responders</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">50,000+</div>
              <div className="text-sm text-gray-600">Lives Impacted</div>
            </div>
          </div>
        </section>

        {/* Map Demo
        <section className="mx-auto max-w-6xl px-6 py-12">
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-gradient-to-br from-blue-50 to-blue-100 p-8">
            <div className="flex h-80 items-center justify-center">
              <div className="text-center">
                <div className="text-5xl mb-4">🗺️</div>
                <p className="text-gray-700">Real-time emergency map showing responders near you</p>
                <p className="mt-2 text-sm text-gray-600">Hospitals • Doctors • Volunteers • Ambulances</p>
              </div>
            </div>
          </div>
        </section> */}

        {/* Features */}
        <section id="features" className="bg-gray-50 py-16">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="text-center text-3xl font-bold text-gray-900">How It Works</h2>
            <p className="mt-2 text-center text-gray-600">Simple, fast, and reliable emergency response</p>

            <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: "🚨", title: "Tap SOS", desc: "Press the button to send emergency alert" },
                { icon: "🎯", title: "AI Matching", desc: "System finds nearest responders" },
                { icon: "🗺️", title: "Track Live", desc: "See responders coming to you" },
                { icon: "✅", title: "Get Help", desc: "Medical assistance arrives fast" },
              ].map((item, i) => (
                <div key={i} className="rounded-lg border border-gray-200 bg-white p-6 text-center">
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <h3 className="font-semibold text-gray-900">{item.title}</h3>
                  <p className="mt-2 text-sm text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section id="about" className="py-16">
          <div className="mx-auto max-w-6xl px-6">
            <div className="rounded-lg bg-blue-50 p-12 text-center">
              <h2 className="text-3xl font-bold text-gray-900">Be a Hero</h2>
              <p className="mt-4 text-gray-600">
                Join thousands of volunteers and responders helping save lives in your community
              </p>
              <button
                onClick={() => navigate("/app")}
                className="mt-6 rounded-lg bg-blue-600 px-8 py-3 font-medium text-white hover:bg-blue-700"
              >
                Join as Volunteer
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer id="contact" className="border-t border-gray-200 bg-gray-900 text-gray-300 py-12">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-8 md:grid-cols-5 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500 text-white">
                  <Heart className="h-4 w-4 fill-white" />
                </div>
                <span className="font-bold text-white">LifeLine AI</span>
              </div>
              <p className="text-sm text-gray-400">Emergency response platform connecting communities.</p>
            </div>

            <div>
              <h3 className="mb-4 font-semibold text-white">Product</h3>
              <div className="space-y-2 text-sm">
                <a href="#" className="hover:text-white">Features</a>
                <a href="#" className="hover:text-white">How It Works</a>
                <a href="#" className="hover:text-white">Download</a>
              </div>
            </div>

            <div>
              <h3 className="mb-4 font-semibold text-white">Company</h3>
              <div className="space-y-2 text-sm">
                <a href="#" className="hover:text-white">About</a>
                <a href="#" className="hover:text-white">Careers</a>
                <a href="#" className="hover:text-white">Blog</a>
              </div>
            </div>

            <div>
              <h3 className="mb-4 font-semibold text-white">Contact</h3>
              <div className="space-y-2 text-sm">
                <p>support@lifeline.ai</p>
                <p>+91 98765 43210</p>
              </div>
            </div>

            <div>
              <h3 className="mb-4 font-semibold text-white">Legal</h3>
              <div className="space-y-2 text-sm">
                <a href="#" className="hover:text-white">Privacy</a>
                <a href="#" className="hover:text-white">Terms</a>
                <a href="#" className="hover:text-white">Security</a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
            © 2024 LifeLine AI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
