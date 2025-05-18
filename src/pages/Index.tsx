import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Star } from "lucide-react";

// Professional type that rotates in the hero section
const professionalTypes = ["Financial Advisor", "Accountant", "Wealth Manager", "Tax Specialist"];
const Index = () => {
  const [professionalTypeIndex, setProfessionalTypeIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setProfessionalTypeIndex(prevIndex => (prevIndex + 1) % professionalTypes.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  return <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-white py-12 md:py-20 text-center">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl font-bold mb-2 md:text-7xl">
                Find a <br />
                <span className="text-emerald-400">
                  {professionalTypes[professionalTypeIndex]}
                </span>
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                Discover Vetted Financial Experts for $500k+ Businesses and High-Net-Worth Clients. 
                Take a quick quiz to hear from accountants, financial advisors, or browse our directory.
              </p>
              <div className="flex justify-center">
                <Link to="/investment-firms" className="inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-md text-white bg-brand-blue hover:bg-opacity-90 transition-colors">
                  Take Quiz to Connect
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Top Financial Advisors Section */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-brand-blue">
                Top Financial Advisors
              </h2>
              <Link to="/investment-firms" className="text-emerald-400 flex items-center">
                View all advisors →
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Advisor Card 1 */}
              <Card className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="h-16 w-16 rounded-full bg-gray-200"></div>
                    <div>
                      <h3 className="text-lg font-semibold">Jennifer Wilson, CFP®</h3>
                      <p className="text-emerald-500">Wealth Management</p>
                      <div className="flex items-center mt-1">
                        {[1, 2, 3, 4, 5].map(star => <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)}
                        <span className="text-xs text-gray-500 ml-2">5.0 (48 reviews)</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <span>New York, NY (Remote Available)</span>
                    </div>
                    <div className="flex items-center">
                      <span>15+ years experience</span>
                    </div>
                    <div className="flex items-center">
                      <span>Specializes in High Net Worth Individuals</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-4">
                    Helping clients build and preserve wealth through comprehensive financial planning and investment management strategies.
                  </p>
                  
                  <div className="flex space-x-3 mt-4">
                    <Link to="/investment-firms/jennifer-wilson" className="px-4 py-2 border border-brand-blue text-brand-blue rounded hover:bg-gray-50">
                      View Profile
                    </Link>
                    <button className="px-4 py-2 border border-gray-300 text-gray-600 rounded hover:bg-gray-50">
                      Contact
                    </button>
                  </div>
                </CardContent>
              </Card>
              
              {/* Advisor Card 2 */}
              <Card className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="h-16 w-16 rounded-full bg-gray-200"></div>
                    <div>
                      <h3 className="text-lg font-semibold">Michael Chen, CFA</h3>
                      <p className="text-emerald-500">Investment Advisory</p>
                      <div className="flex items-center mt-1">
                        {[1, 2, 3, 4].map(star => <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)}
                        <Star className="h-4 w-4 fill-yellow-200 text-yellow-400" />
                        <span className="text-xs text-gray-500 ml-2">4.5 (39 reviews)</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <span>San Francisco, CA (Remote Available)</span>
                    </div>
                    <div className="flex items-center">
                      <span>12+ years experience</span>
                    </div>
                    <div className="flex items-center">
                      <span>Specializes in Portfolio Management</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-4">
                    Expert in creating diversified investment portfolios tailored to client goals with a focus on long-term growth and risk management.
                  </p>
                  
                  <div className="flex space-x-3 mt-4">
                    <Link to="/investment-firms/michael-chen" className="px-4 py-2 border border-brand-blue text-brand-blue rounded hover:bg-gray-50">
                      View Profile
                    </Link>
                    <button className="px-4 py-2 border border-gray-300 text-gray-600 rounded hover:bg-gray-50">
                      Contact
                    </button>
                  </div>
                </CardContent>
              </Card>
              
              {/* Advisor Card 3 */}
              <Card className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="h-16 w-16 rounded-full bg-gray-200"></div>
                    <div>
                      <h3 className="text-lg font-semibold">Sarah Johnson, ChFC</h3>
                      <p className="text-emerald-500">Retirement Planning</p>
                      <div className="flex items-center mt-1">
                        {[1, 2, 3, 4].map(star => <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)}
                        <Star className="h-4 w-4 fill-yellow-200 text-yellow-400" />
                        <span className="text-xs text-gray-500 ml-2">4.7 (52 reviews)</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <span>Chicago, IL (Remote Available)</span>
                    </div>
                    <div className="flex items-center">
                      <span>18+ years experience</span>
                    </div>
                    <div className="flex items-center">
                      <span>Specializes in Retirement Strategies</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-4">
                    Dedicated to helping clients create sustainable retirement income plans and optimize their Social Security benefits.
                  </p>
                  
                  <div className="flex space-x-3 mt-4">
                    <Link to="/investment-firms/sarah-johnson" className="px-4 py-2 border border-brand-blue text-brand-blue rounded hover:bg-gray-50">
                      View Profile
                    </Link>
                    <button className="px-4 py-2 border border-gray-300 text-gray-600 rounded hover:bg-gray-50">
                      Contact
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-brand-blue mb-12">
              Find the right expert for your needs
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-brand-blue mb-2">Tax Planning</h3>
                <p className="text-gray-600">Optimize your tax strategy</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-brand-blue mb-2">Wealth Management</h3>
                <p className="text-gray-600">Grow and protect your assets</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-brand-blue mb-2">Retirement Planning</h3>
                <p className="text-gray-600">Secure your financial future</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-brand-blue mb-2">Business Accounting</h3>
                <p className="text-gray-600">Streamline your finances</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-6 md:mb-0">
              <h2 className="text-xl font-bold">Financial Adviser</h2>
              <p className="mt-2 text-gray-300 text-sm">Connecting you with financial experts</p>
            </div>
            <div className="grid grid-cols-2 gap-8 md:grid-cols-3">
              <div>
                <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Company</h3>
                <ul className="mt-4 space-y-2">
                  <li><Link to="/about" className="text-gray-400 hover:text-white">About</Link></li>
                  <li><Link to="/blog" className="text-gray-400 hover:text-white">Blog</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Resources</h3>
                <ul className="mt-4 space-y-2">
                  <li><Link to="/investment-firms" className="text-gray-400 hover:text-white">Investment Firms</Link></li>
                  <li><Link to="/faq" className="text-gray-400 hover:text-white">FAQ</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Legal</h3>
                <ul className="mt-4 space-y-2">
                  <li><Link to="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</Link></li>
                  <li><Link to="/terms" className="text-gray-400 hover:text-white">Terms of Service</Link></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-700 pt-8 md:flex md:items-center md:justify-between">
            <div className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} Financial Adviser. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>;
};
export default Index;