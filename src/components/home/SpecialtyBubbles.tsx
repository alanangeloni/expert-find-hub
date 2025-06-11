import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  LineChart, 
  Users, 
  FileText, 
  Calculator, 
  Shield, 
  GraduationCap, 
  Home, 
  BarChart 
} from 'lucide-react';

type Specialty = {
  id: string;
  name: string;
  filterValue: string;
  icon: React.ReactNode;
};

const specialties: Specialty[] = [
  { id: 'retirement', name: 'Retirement', filterValue: 'Retirement Planning', icon: <ShieldCheck className="h-5 w-5" /> },
  { id: 'investing', name: 'Investing', filterValue: 'Investment Management', icon: <LineChart className="h-5 w-5" /> },
  { id: 'family', name: 'Family', filterValue: 'Succession Planning', icon: <Users className="h-5 w-5" /> },
  { id: 'estate-planning', name: 'Estate Planning', filterValue: 'Estate/Trust Planning', icon: <FileText className="h-5 w-5" /> },
  { id: 'wealth-management', name: 'Wealth Management', filterValue: 'Wealth Management', icon: <Calculator className="h-5 w-5" /> },
  { id: 'tax-strategy', name: 'Tax Strategy', filterValue: 'Tax Planning', icon: <Shield className="h-5 w-5" /> },
  { id: 'college', name: 'College', filterValue: 'Education Planning', icon: <GraduationCap className="h-5 w-5" /> },
  { id: 'home-purchasing', name: 'Home Purchasing', filterValue: 'Life Transitions', icon: <Home className="h-5 w-5" /> },
  { id: 'debt-management', name: 'Debt Management', filterValue: 'Debt Management', icon: <BarChart className="h-5 w-5" /> },
];

const SpecialtyBubbles: React.FC = () => {
  return (
    <section className="py-16 bg-white mb-[10px]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-brand-blue mb-3">Find an <span className="text-mint-500">Advisor</span> by <span className="text-mint-500">Speciality</span></h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Connect with financial experts who specialize in your specific needs
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-3 max-w-5xl mx-auto">
          {specialties.map((specialty) => (
            <Link
              key={specialty.id}
              to={`/advisors?specialties=${encodeURIComponent(specialty.filterValue)}`}
              className="flex items-center gap-2.5 px-5 py-2.5 rounded-full transition-colors duration-200 bg-mint-50 text-mint-800 border border-mint-200 hover:bg-mint-100"
            >
              <span className="text-brand-blue">
                {specialty.icon}
              </span>
              <span className="text-base font-medium text-gray-700 whitespace-nowrap">
                {specialty.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SpecialtyBubbles;
