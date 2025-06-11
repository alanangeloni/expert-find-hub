import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Star } from "lucide-react";
import SpecialtyBubbles from "@/components/home/SpecialtyBubbles";
import { AdvisorCard } from "@/components/advisors/AdvisorCard";
import { getAdvisors } from "@/services/advisorsService";

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
        const {
          count
        } = await getAdvisors({
          page: 1,
          pageSize: 1 // We just need the count
        });
        if (count > 0) {
          // Fetch all advisors
          const {
            data
          } = await getAdvisors({
            page: 1,
            pageSize: count // Fetch all advisors
            // You might want to add additional filters here to ensure quality advisors
          });
          if (data && data.length > 0) {
            // Shuffle all advisors and take first 6
            const shuffled = [...data].sort(() => 0.5 - Math.random());
            setAdvisors(shuffled.slice(0, 6));
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
      {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-64 bg-gray-200 rounded-lg animate-pulse"></div>)}
    </div>;
  }
  if (error) {
    return <div className="text-center text-red-500 py-8">{error}</div>;
  }
  if (advisors.length === 0) {
    return <div className="text-center text-gray-500 py-8">No advisors found</div>;
  }
  return <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {advisors.map(advisor => <div key={advisor.id} className="h-full">
          <AdvisorCard advisor={advisor} />
        </div>)}
    </div>;
};
const Index = () => {

  return <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-white py-12 md:py-20 text-center">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
                <div className="text-center">
                  <h1 className="text-4xl font-bold mb-2 md:text-6xl">
                    <span className="text-brand-blue">
                      <span className="text-mint-500">Achieve</span> your Financial Goals with a <span className="text-mint-500">Financial Professional</span>
                    </span>
                  </h1>
                </div>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Your needs are unique. Find an advisor experienced in supporting people just like you. From entrepreneurs to young families, discover experts who understand your world and your goals.
            </p>
            <div className="flex justify-center">
              <Link to="/advisors" className="inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-md text-white bg-brand-blue hover:bg-opacity-90 transition-colors">
                Browse Advisors
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
              <span className="text-mint-500">Top</span> Financial Advisors
            </h2>
            <Link to="/advisors" className="text-emerald-400 flex items-center">
              View all advisors →
            </Link>
          </div>
          
          <AdvisorGrid />
        </div>
      </section>

      {/* Specialties Section */}
      <SpecialtyBubbles />

      {/* CTA Section */}
      <section className="pt-0 pb-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Left Card */}
            <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow duration-300 p-6">
              <CardContent className="p-0">
                <h3 className="text-2xl font-bold mb-3 text-brand-blue">
                  Browse <span className="text-mint-500">Investment Firms</span>
                </h3>
                <p className="text-gray-600 mb-6">
                  Browse investment firms and filter by asset class to discover a wide range of opportunities tailored to your interests.
                </p>
                <Link to="/firms" className="inline-block bg-gray-800 text-white px-6 py-3 rounded-md hover:bg-opacity-90 transition-colors w-full sm:w-auto text-center">
                  Browse Firms
                </Link>
              </CardContent>
            </Card>

            {/* Right Card */}
            <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow duration-300 p-6">
              <CardContent className="p-0">
                <h3 className="text-2xl font-bold mb-3 text-brand-blue">
                  Join as a <span className="text-mint-500">Financial Professional</span>
                </h3>
                <p className="text-gray-600 mb-6">
                  Your expertise deserves the right audience. Join now and connect with clients who value your guidance.
                </p>
                <Link to="/auth/SignUp" className="inline-block bg-gray-800 text-white px-6 py-3 rounded-md hover:bg-opacity-90 transition-colors w-full sm:w-auto text-center">
                  Apply Now
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>;
};
export default Index;