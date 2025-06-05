import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Star } from "lucide-react";
import SpecialtyBubbles from "@/components/home/SpecialtyBubbles";
import { AdvisorCard } from "@/components/advisors/AdvisorCard";
import { getAdvisors } from "@/services/advisorsService";

// Professional type that rotates in the hero section
const professionalTypes = ["Financial Professional", "Financial Advisor", "Accountant", "Tax Specialist"];

// Component to fetch and display advisor grid
const AdvisorGrid = () => {
  const [advisors, setAdvisors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRandomAdvisors = async () => {
      try {
        setLoading(true);
        // First, get the total count of advisors
        const { count } = await getAdvisors({ 
          page: 1, 
          pageSize: 1, // We just need the count
        });
        
        if (count > 0) {
          // Fetch all advisors
          const { data } = await getAdvisors({ 
            page: 1, 
            pageSize: count, // Fetch all advisors
            // You might want to add additional filters here to ensure quality advisors
          });
          
          if (data && data.length > 0) {
            // Shuffle all advisors and take first 3
            const shuffled = [...data].sort(() => 0.5 - Math.random());
            setAdvisors(shuffled.slice(0, 3));
          } else {
            setAdvisors([]);
          }
        } else {
          setAdvisors([]);
        }
      } catch (err) {
        console.error('Error fetching advisors:', err);
        setError('Failed to load advisors');
      } finally {
        setLoading(false);
      }
    };

    fetchRandomAdvisors();
  }, []);

  if (loading) {
    return <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-64 bg-gray-200 rounded-lg animate-pulse"></div>
      ))}
    </div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-8">{error}</div>;
  }

  if (advisors.length === 0) {
    return <div className="text-center text-gray-500 py-8">No advisors found</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {advisors.map((advisor) => (
        <div key={advisor.id} className="h-full">
          <AdvisorCard advisor={advisor} />
        </div>
      ))}
    </div>
  );
};
const Index = () => {
  const [professionalTypeIndex, setProfessionalTypeIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setProfessionalTypeIndex(prevIndex => (prevIndex + 1) % professionalTypes.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  return <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-white py-12 md:py-20 text-center">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-2 md:text-7xl">
              <span className="text-brand-blue">Find a</span> <br />
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

      {/* Specialties Section */}
      <SpecialtyBubbles />

      {/* Top Financial Advisors Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-brand-blue">
              Top Financial Advisors
            </h2>
            <Link to="/advisors" className="text-emerald-400 flex items-center">
              View all advisors →
            </Link>
          </div>
          
          <AdvisorGrid />
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

      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-6 md:mb-0">
              <img 
                src="https://wqtvpeuhjgqcjbdozzuv.supabase.co/storage/v1/object/public/website-wide-images//630a5745c93c976e2ba4b72d_Fin%20Pro%20Logo%20with%20words.png" 
                alt="Financial Pro Logo" 
                className="h-10 mb-2"
              />
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
                  <li><Link to="/accounting-firms" className="text-gray-400 hover:text-white">Accounting Firms</Link></li>
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
