
import React from "react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";

const Index = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1">
        <section className="bg-white py-12 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-brand-blue mb-6">
                Find the right financial advisor for your needs
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-8">
                We help match you with financial professionals who can guide your investment decisions and help you achieve your financial goals.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  to="/investment-firms"
                  className="inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-md text-white bg-brand-blue hover:bg-opacity-90 transition-colors"
                >
                  Browse Investment Firms
                </Link>
                <Link
                  to="/auth/signup"
                  className="inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-md text-brand-blue bg-white border border-brand-blue hover:bg-gray-50 transition-colors"
                >
                  Create an Account
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-brand-blue mb-12">
              Why Choose Us
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-brand-blue mb-3">Expert Advisors</h3>
                <p className="text-gray-600">Access to a network of qualified financial professionals with proven experience.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-brand-blue mb-3">Personalized Matches</h3>
                <p className="text-gray-600">We match you with advisors based on your specific financial needs and goals.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-brand-blue mb-3">Transparent Process</h3>
                <p className="text-gray-600">Clear information about advisors' qualifications, services, and fees.</p>
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
    </div>
  );
};

export default Index;
