'use client';

import { ArrowRight, Droplet, BarChart2, Leaf } from 'lucide-react';
import { useRouter } from "next/navigation";

export default function Home() {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const router = useRouter();

  return (
    <main className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed w-full bg-white shadow-sm z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Droplet className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">AgriFlow</span>
          </div>
          <div className="flex items-center space-x-8">
            <button 
              onClick={() => scrollToSection('about')} 
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              About
            </button>
            <button 
              onClick={() => scrollToSection('features')} 
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Features
            </button>
            <button 
              onClick={() => scrollToSection('contact')} 
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Contact
            </button>
            <button onClick={() => router.push("/login")} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Sign In
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Smart Irrigation for Modern Agriculture
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Transform your farm with AgriFlow&apos;s intelligent water distribution system. Save water, increase yields, and make data-driven decisions.
              </p>
              <div className="flex gap-4">
                <button onClick={() => router.push("/login")} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center">
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </button>
                <button onClick={() => scrollToSection('features')}  className="px-6 py-3 border border-blue-200 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                  Learn More
                </button>
              </div>
            </div>
            <div>
              <img 
                src="https://images.unsplash.com/photo-1560493676-04071c5f467b?auto=format&fit=crop&q=80" 
                alt="Smart Irrigation" 
                className="rounded-2xl shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <img 
              src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&q=80&w=1200" 
              alt="About AgriFlow" 
              className="rounded-2xl shadow-xl"
            />
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">About AgriFlow</h2>
              <p className="text-lg text-gray-600 mb-8">
                We&apos;re revolutionizing agricultural irrigation through smart technology and data-driven solutions. Our system helps farmers optimize water usage while maximizing crop yields.
              </p>
              <ul className="space-y-4">
                {['Smart Technology', 'Water Conservation', 'Sustainable Farming'].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <Leaf className="h-5 w-5 text-blue-600" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Smart Features</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our intelligent system combines cutting-edge technology with precision agriculture for optimal irrigation management.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Droplet className="h-8 w-8 text-blue-600" />,
                title: 'Smart Distribution',
                description: 'AI-powered water distribution that adapts to your crops needs.'
              },
              {
                icon: <BarChart2 className="h-8 w-8 text-blue-600" />,
                title: 'Real-time Analytics',
                description: 'Monitor water usage and system performance in real-time.'
              },
              {
                icon: <Leaf className="h-8 w-8 text-blue-600" />,
                title: 'Eco-Friendly',
                description: 'Reduce water waste while maximizing crop yield.'
              }
            ].map((feature, index) => (
              <div key={index} className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:border-blue-200 transition-colors">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Get Started?</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of farmers already using AgriFlow to revolutionize their irrigation systems.
          </p>
          <div className="flex gap-4 justify-center">
            <button className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center">
              Contact Sales <ArrowRight className="ml-2 h-5 w-5" />
            </button>
            <button className="px-8 py-4 border border-blue-200 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
              Schedule Demo
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}