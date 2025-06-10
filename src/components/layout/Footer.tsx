import { Link } from 'react-router-dom';
const Footer = () => {
  return <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="mb-6 md:mb-0">
            <img src="https://wqtvpeuhjgqcjbdozzuv.supabase.co/storage/v1/object/public/website-wide-images//Group%203%20(1).png" alt="Expert Find Hub Logo" className="h-10 mb-2" />
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
                <li><Link to="/firms" className="text-gray-400 hover:text-white">Investment Firms</Link></li>
                
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
    </footer>;
};
export default Footer;