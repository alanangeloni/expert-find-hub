
import { Link } from "react-router-dom";
import { Search, DollarSign, Star, MapPin, Briefcase, Award } from "lucide-react";
import TypewriterHeadline from "@/components/TypewriterHeadline";

const Index = () => {
  return (
    <main className="min-h-screen flex flex-col text-brand-blue">
      {/* Navigation Bar */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center">
              <DollarSign className="h-6 w-6 text-brand-teal" />
              <span className="ml-2 font-bold text-lg">Financial Professional</span>
            </Link>
            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/about-us" className="hover:text-brand-teal">
                About Us
              </Link>
              <Link to="/financial-advisors" className="hover:text-brand-teal">
                Financial Advisors
              </Link>
              <Link to="/accountants" className="hover:text-brand-teal">
                Accountants
              </Link>
              <Link to="/wealth-managers" className="hover:text-brand-teal">
                Wealth Managers
              </Link>
              <Link to="/find-expert" className="hover:text-brand-teal">
                Find an Expert
              </Link>
            </nav>
          </div>
          <div className="flex items-center space-x-3">
            <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
              <Search className="h-5 w-5 text-brand-blue" />
            </button>
            <Link to="/login" className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
              Log In
            </Link>
            <Link to="/join" className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
              Join
            </Link>
            <Link to="/write-review" className="px-4 py-2 bg-brand-blue text-white rounded-md hover:bg-opacity-90">
              Write a review
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 md:py-24 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="block">Find a</span>
            <TypewriterHeadline />
          </h1>
          <p className="max-w-3xl mx-auto mb-10 text-lg text-brand-blue text-opacity-80">
            Discover Vetted Financial Experts for $500k+ Businesses and High-Net-Worth Clients. Take a quick quiz to
            hear from accountants, financial advisors, or browse our directory via Accountants, Wealth Managers,
            Financial Advisors.
          </p>
          <Link
            to="/quiz"
            className="inline-block px-8 py-4 bg-brand-blue text-white rounded-md hover:bg-opacity-90 font-medium"
          >
            Take Quiz to Connect
          </Link>
        </div>
      </section>

      {/* Financial Advisors Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold">Top Financial Advisors</h2>
            <Link to="/financial-advisors" className="text-brand-teal hover:text-opacity-80 font-medium">
              View all advisors →
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Advisor Card 1 */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden mr-4 flex-shrink-0">
                    <img
                      src="/placeholder.svg"
                      alt="Jennifer Wilson"
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Jennifer Wilson, CFP®</h3>
                    <p className="text-brand-teal font-medium">Wealth Management</p>
                    <div className="flex items-center mt-1">
                      <div className="flex text-yellow-400 mr-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-current" />
                        ))}
                      </div>
                      <span className="text-brand-blue text-opacity-70 text-sm">5.0 (48 reviews)</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex items-center text-brand-blue text-opacity-70 text-sm mb-2">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>New York, NY (Remote Available)</span>
                  </div>
                  <div className="flex items-center text-brand-blue text-opacity-70 text-sm mb-2">
                    <Briefcase className="h-4 w-4 mr-2" />
                    <span>15+ years experience</span>
                  </div>
                  <div className="flex items-center text-brand-blue text-opacity-70 text-sm">
                    <Award className="h-4 w-4 mr-2" />
                    <span>Specializes in High-Net-Worth Individuals</span>
                  </div>
                </div>

                <p className="mt-4 text-brand-blue text-opacity-80">
                  Helping clients build and preserve wealth through comprehensive financial planning and investment
                  management strategies.
                </p>

                <div className="mt-6 flex space-x-3">
                  <Link
                    to="/advisors/jennifer-wilson"
                    className="px-4 py-2 bg-brand-blue text-white rounded-md hover:bg-opacity-90 flex-1 text-center"
                  >
                    View Profile
                  </Link>
                  <Link
                    to="/contact/jennifer-wilson"
                    className="px-4 py-2 border border-brand-blue text-brand-blue rounded-md hover:bg-gray-50 flex-1 text-center"
                  >
                    Contact
                  </Link>
                </div>
              </div>
            </div>

            {/* Advisor Card 2 */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden mr-4 flex-shrink-0">
                    <img
                      src="/placeholder.svg"
                      alt="Michael Chen"
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Michael Chen, CFA</h3>
                    <p className="text-brand-teal font-medium">Investment Advisory</p>
                    <div className="flex items-center mt-1">
                      <div className="flex text-yellow-400 mr-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-4 w-4 ${i < 4 ? "fill-current" : ""}`} />
                        ))}
                      </div>
                      <span className="text-brand-blue text-opacity-70 text-sm">4.8 (36 reviews)</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex items-center text-brand-blue text-opacity-70 text-sm mb-2">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>San Francisco, CA (Remote Available)</span>
                  </div>
                  <div className="flex items-center text-brand-blue text-opacity-70 text-sm mb-2">
                    <Briefcase className="h-4 w-4 mr-2" />
                    <span>12+ years experience</span>
                  </div>
                  <div className="flex items-center text-brand-blue text-opacity-70 text-sm">
                    <Award className="h-4 w-4 mr-2" />
                    <span>Specializes in Portfolio Management</span>
                  </div>
                </div>

                <p className="mt-4 text-brand-blue text-opacity-80">
                  Expert in creating diversified investment portfolios tailored to client goals with a focus on
                  long-term growth and risk management.
                </p>

                <div className="mt-6 flex space-x-3">
                  <Link
                    to="/advisors/michael-chen"
                    className="px-4 py-2 bg-brand-blue text-white rounded-md hover:bg-opacity-90 flex-1 text-center"
                  >
                    View Profile
                  </Link>
                  <Link
                    to="/contact/michael-chen"
                    className="px-4 py-2 border border-brand-blue text-brand-blue rounded-md hover:bg-gray-50 flex-1 text-center"
                  >
                    Contact
                  </Link>
                </div>
              </div>
            </div>

            {/* Advisor Card 3 */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden mr-4 flex-shrink-0">
                    <img
                      src="/placeholder.svg"
                      alt="Sarah Johnson"
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Sarah Johnson, ChFC</h3>
                    <p className="text-brand-teal font-medium">Retirement Planning</p>
                    <div className="flex items-center mt-1">
                      <div className="flex text-yellow-400 mr-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-4 w-4 ${i < 5 ? "fill-current" : ""}`} />
                        ))}
                      </div>
                      <span className="text-brand-blue text-opacity-70 text-sm">4.9 (52 reviews)</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex items-center text-brand-blue text-opacity-70 text-sm mb-2">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>Chicago, IL (Remote Available)</span>
                  </div>
                  <div className="flex items-center text-brand-blue text-opacity-70 text-sm mb-2">
                    <Briefcase className="h-4 w-4 mr-2" />
                    <span>18+ years experience</span>
                  </div>
                  <div className="flex items-center text-brand-blue text-opacity-70 text-sm">
                    <Award className="h-4 w-4 mr-2" />
                    <span>Specializes in Retirement Strategies</span>
                  </div>
                </div>

                <p className="mt-4 text-brand-blue text-opacity-80">
                  Dedicated to helping clients create sustainable retirement income plans and optimize their Social
                  Security benefits.
                </p>

                <div className="mt-6 flex space-x-3">
                  <Link
                    to="/advisors/sarah-johnson"
                    className="px-4 py-2 bg-brand-blue text-white rounded-md hover:bg-opacity-90 flex-1 text-center"
                  >
                    View Profile
                  </Link>
                  <Link
                    to="/contact/sarah-johnson"
                    className="px-4 py-2 border border-brand-blue text-brand-blue rounded-md hover:bg-gray-50 flex-1 text-center"
                  >
                    Contact
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Accountants Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold">Top Accountants</h2>
            <Link to="/accountants" className="text-brand-teal hover:text-opacity-80 font-medium">
              View all accountants →
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Accountant Card 1 */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden mr-4 flex-shrink-0">
                    <img
                      src="/placeholder.svg"
                      alt="David Rodriguez"
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">David Rodriguez, CPA</h3>
                    <p className="text-brand-teal font-medium">Tax Strategy</p>
                    <div className="flex items-center mt-1">
                      <div className="flex text-yellow-400 mr-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-4 w-4 ${i < 5 ? "fill-current" : ""}`} />
                        ))}
                      </div>
                      <span className="text-brand-blue text-opacity-70 text-sm">5.0 (63 reviews)</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex items-center text-brand-blue text-opacity-70 text-sm mb-2">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>Austin, TX (Remote Available)</span>
                  </div>
                  <div className="flex items-center text-brand-blue text-opacity-70 text-sm mb-2">
                    <Briefcase className="h-4 w-4 mr-2" />
                    <span>20+ years experience</span>
                  </div>
                  <div className="flex items-center text-brand-blue text-opacity-70 text-sm">
                    <Award className="h-4 w-4 mr-2" />
                    <span>Specializes in Small Business Taxation</span>
                  </div>
                </div>

                <p className="mt-4 text-brand-blue text-opacity-80">
                  Expert in tax planning and compliance for small businesses and entrepreneurs, helping clients minimize
                  tax liability.
                </p>

                <div className="mt-6 flex space-x-3">
                  <Link
                    to="/accountants/david-rodriguez"
                    className="px-4 py-2 bg-brand-blue text-white rounded-md hover:bg-opacity-90 flex-1 text-center"
                  >
                    View Profile
                  </Link>
                  <Link
                    to="/contact/david-rodriguez"
                    className="px-4 py-2 border border-brand-blue text-brand-blue rounded-md hover:bg-gray-50 flex-1 text-center"
                  >
                    Contact
                  </Link>
                </div>
              </div>
            </div>

            {/* Accountant Card 2 */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden mr-4 flex-shrink-0">
                    <img
                      src="/placeholder.svg"
                      alt="Emily Patel"
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Emily Patel, CPA, MBA</h3>
                    <p className="text-brand-teal font-medium">Business Advisory</p>
                    <div className="flex items-center mt-1">
                      <div className="flex text-yellow-400 mr-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-4 w-4 ${i < 4 ? "fill-current" : ""}`} />
                        ))}
                      </div>
                      <span className="text-brand-blue text-opacity-70 text-sm">4.7 (41 reviews)</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex items-center text-brand-blue text-opacity-70 text-sm mb-2">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>Seattle, WA (Remote Available)</span>
                  </div>
                  <div className="flex items-center text-brand-blue text-opacity-70 text-sm mb-2">
                    <Briefcase className="h-4 w-4 mr-2" />
                    <span>14+ years experience</span>
                  </div>
                  <div className="flex items-center text-brand-blue text-opacity-70 text-sm">
                    <Award className="h-4 w-4 mr-2" />
                    <span>Specializes in Startups & Tech Companies</span>
                  </div>
                </div>

                <p className="mt-4 text-brand-blue text-opacity-80">
                  Providing strategic financial guidance to startups and tech companies, from formation to exit
                  planning.
                </p>

                <div className="mt-6 flex space-x-3">
                  <Link
                    to="/accountants/emily-patel"
                    className="px-4 py-2 bg-brand-blue text-white rounded-md hover:bg-opacity-90 flex-1 text-center"
                  >
                    View Profile
                  </Link>
                  <Link
                    to="/contact/emily-patel"
                    className="px-4 py-2 border border-brand-blue text-brand-blue rounded-md hover:bg-gray-50 flex-1 text-center"
                  >
                    Contact
                  </Link>
                </div>
              </div>
            </div>

            {/* Accountant Card 3 */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden mr-4 flex-shrink-0">
                    <img
                      src="/placeholder.svg"
                      alt="James Wilson"
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">James Wilson, CPA, CFE</h3>
                    <p className="text-brand-teal font-medium">Forensic Accounting</p>
                    <div className="flex items-center mt-1">
                      <div className="flex text-yellow-400 mr-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-4 w-4 ${i < 5 ? "fill-current" : ""}`} />
                        ))}
                      </div>
                      <span className="text-brand-blue text-opacity-70 text-sm">4.9 (37 reviews)</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex items-center text-brand-blue text-opacity-70 text-sm mb-2">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>Boston, MA (Remote Available)</span>
                  </div>
                  <div className="flex items-center text-brand-blue text-opacity-70 text-sm mb-2">
                    <Briefcase className="h-4 w-4 mr-2" />
                    <span>16+ years experience</span>
                  </div>
                  <div className="flex items-center text-brand-blue text-opacity-70 text-sm">
                    <Award className="h-4 w-4 mr-2" />
                    <span>Specializes in Fraud Investigation</span>
                  </div>
                </div>

                <p className="mt-4 text-brand-blue text-opacity-80">
                  Specialized in forensic accounting, fraud detection, and financial investigations for businesses of
                  all sizes.
                </p>

                <div className="mt-6 flex space-x-3">
                  <Link
                    to="/accountants/james-wilson"
                    className="px-4 py-2 bg-brand-blue text-white rounded-md hover:bg-opacity-90 flex-1 text-center"
                  >
                    View Profile
                  </Link>
                  <Link
                    to="/contact/james-wilson"
                    className="px-4 py-2 border border-brand-blue text-brand-blue rounded-md hover:bg-gray-50 flex-1 text-center"
                  >
                    Contact
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">See what clients are saying!</h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-brand-teal bg-opacity-20 rounded-full flex items-center justify-center mr-4">
                  <span className="text-brand-teal font-bold">MV</span>
                </div>
                <div>
                  <h3 className="font-bold">Michael Venture</h3>
                  <p className="text-brand-blue text-opacity-70">Venture Capital LLC</p>
                </div>
              </div>
              <div className="flex text-yellow-400 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-current" />
                ))}
              </div>
              <p className="text-brand-blue text-opacity-80">
                Working with our financial advisor from Financial Professional has transformed our business finances.
                They have a deep understanding of our industry and provided strategic guidance that helped us grow by
                30% this year.
              </p>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-brand-teal bg-opacity-20 rounded-full flex items-center justify-center mr-4">
                  <span className="text-brand-teal font-bold">SJ</span>
                </div>
                <div>
                  <h3 className="font-bold">Sarah Johnson</h3>
                  <p className="text-brand-blue text-opacity-70">Bright Tech Solutions</p>
                </div>
              </div>
              <div className="flex text-yellow-400 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-current" />
                ))}
              </div>
              <p className="text-brand-blue text-opacity-80">
                My company started using an accountant from Financial Professional after struggling with our books. They
                got our finances in order and even helped us establish a new payroll system. Their expertise has been
                invaluable to our growth.
              </p>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-brand-teal bg-opacity-20 rounded-full flex items-center justify-center mr-4">
                  <span className="text-brand-teal font-bold">RP</span>
                </div>
                <div>
                  <h3 className="font-bold">Robert Parker</h3>
                  <p className="text-brand-blue text-opacity-70">Graphite Design Studio</p>
                </div>
              </div>
              <div className="flex text-yellow-400 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-current" />
                ))}
              </div>
              <p className="text-brand-blue text-opacity-80">
                Our wealth manager from Financial Professional has been with us since day one. They've guided our
                financial modeling and investment strategy with precision. Always punctual, communicative, and truly a
                partner in our success.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Find the right expert for your needs</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              to="/category/tax-planning"
              className="bg-brand-teal bg-opacity-10 hover:bg-opacity-20 p-6 rounded-lg text-center"
            >
              <h3 className="font-bold text-brand-blue">Tax Planning</h3>
              <p className="text-brand-blue text-opacity-70 mt-2">Optimize your tax strategy</p>
            </Link>

            <Link
              to="/category/wealth-management"
              className="bg-brand-teal bg-opacity-10 hover:bg-opacity-20 p-6 rounded-lg text-center"
            >
              <h3 className="font-bold text-brand-blue">Wealth Management</h3>
              <p className="text-brand-blue text-opacity-70 mt-2">Grow and protect your assets</p>
            </Link>

            <Link
              to="/category/retirement-planning"
              className="bg-brand-teal bg-opacity-10 hover:bg-opacity-20 p-6 rounded-lg text-center"
            >
              <h3 className="font-bold text-brand-blue">Retirement Planning</h3>
              <p className="text-brand-blue text-opacity-70 mt-2">Secure your financial future</p>
            </Link>

            <Link
              to="/category/business-accounting"
              className="bg-brand-teal bg-opacity-10 hover:bg-opacity-20 p-6 rounded-lg text-center"
            >
              <h3 className="font-bold text-brand-blue">Business Accounting</h3>
              <p className="text-brand-blue text-opacity-70 mt-2">Streamline your finances</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-brand-blue text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">Financial Professional</h3>
              <p className="text-gray-300">
                Connecting businesses and individuals with vetted financial experts since 2023.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4">For Clients</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/how-it-works" className="text-gray-300 hover:text-white">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link to="/browse-experts" className="text-gray-300 hover:text-white">
                    Browse Experts
                  </Link>
                </li>
                <li>
                  <Link to="/success-stories" className="text-gray-300 hover:text-white">
                    Success Stories
                  </Link>
                </li>
                <li>
                  <Link to="/pricing" className="text-gray-300 hover:text-white">
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4">For Professionals</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/join-as-expert" className="text-gray-300 hover:text-white">
                    Join as Expert
                  </Link>
                </li>
                <li>
                  <Link to="/success-stories-pros" className="text-gray-300 hover:text-white">
                    Success Stories
                  </Link>
                </li>
                <li>
                  <Link to="/resources" className="text-gray-300 hover:text-white">
                    Resources
                  </Link>
                </li>
                <li>
                  <Link to="/community" className="text-gray-300 hover:text-white">
                    Community
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/about" className="text-gray-300 hover:text-white">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/careers" className="text-gray-300 hover:text-white">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link to="/press" className="text-gray-300 hover:text-white">
                    Press
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-gray-300 hover:text-white">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-opacity-20 border-white mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-300">© 2023 Financial Professional. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/terms" className="text-gray-300 hover:text-white">
                Terms
              </Link>
              <Link to="/privacy" className="text-gray-300 hover:text-white">
                Privacy
              </Link>
              <Link to="/cookies" className="text-gray-300 hover:text-white">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default Index;
