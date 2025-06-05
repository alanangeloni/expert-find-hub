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
  icon: React.ReactNode;
};

const specialties: Specialty[] = [
  { id: 'retirement', name: 'Retirement', icon: <ShieldCheck className="h-5 w-5" /> },
  { id: 'investing', name: 'Investing', icon: <LineChart className="h-5 w-5" /> },
  { id: 'family', name: 'Family', icon: <Users className="h-5 w-5" /> },
  { id: 'estate-planning', name: 'Estate Planning', icon: <FileText className="h-5 w-5" /> },
  { id: 'asset-management', name: 'Asset Management', icon: <Calculator className="h-5 w-5" /> },
  { id: 'tax-strategy', name: 'Tax Strategy', icon: <Shield className="h-5 w-5" /> },
  { id: 'college', name: 'College', icon: <GraduationCap className="h-5 w-5" /> },
  { id: 'home-purchasing', name: 'Home Purchasing', icon: <Home className="h-5 w-5" /> },
  { id: 'debt-management', name: 'Debt Management', icon: <BarChart className="h-5 w-5" /> },
];

const SpecialtyBubbles: React.FC = () => {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-brand-blue mb-3">Find an Advisor by Speciality</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Connect with financial experts who specialize in your specific needs
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-3 max-w-5xl mx-auto">
          {specialties.map((specialty) => (
            <Link
              key={specialty.id}
              to={`/advisors?specialties=${encodeURIComponent(specialty.name)}`}
              className="flex items-center gap-2.5 px-5 py-2.5 bg-white rounded-full border border-gray-200 hover:border-brand-blue hover:bg-blue-50 transition-colors duration-200"
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
