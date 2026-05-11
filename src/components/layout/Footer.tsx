import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="relative overflow-hidden bg-[#0b2942] text-[#B8D4DD] pt-20 pb-10 mt-10">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#31d6aa]/50 to-transparent" />

      <div className="container mx-auto px-4 relative">
        {/* Top */}
        <div className="grid grid-cols-1 md:grid-cols-[1.3fr_2fr] gap-12 md:gap-16 pb-14 border-b border-white/10">
          {/* Brand */}
          <div>
            <Link to="/" className="inline-flex items-center mb-5">
              <img
                src="https://wqtvpeuhjgqcjbdozzuv.supabase.co/storage/v1/object/public/website-wide-images//Group%203%20(1).png"
                alt="Expert Find Hub Logo"
                className="h-10"
              />
            </Link>
            <p className="text-white/65 text-[14.5px] leading-[1.65] max-w-[380px]">
              An independent directory of vetted, fee-only and fiduciary financial advisors — matched to your goals, your assets, and your stage of life.
            </p>
            <div className="flex gap-2.5 mt-6">
              {['X', 'in', 'Yt'].map((s) => (
                <a
                  key={s}
                  href="#"
                  aria-label={s}
                  className="w-[38px] h-[38px] rounded-full flex items-center justify-center bg-white/10 text-[#C8E3E8] text-xs font-semibold transition-all hover:bg-[#31d6aa] hover:text-[#0b2942] hover:-translate-y-0.5"
                >
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* Columns */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h4 className="font-sans text-[13px] font-semibold text-[#31d6aa] uppercase tracking-[0.12em] mb-[18px]">
                Clients
              </h4>
              <Link to="/advisors" className="block text-white/65 text-sm py-1.5 transition-colors hover:text-white">Find a match</Link>
              <Link to="/advisors" className="block text-white/65 text-sm py-1.5 transition-colors hover:text-white">Browse advisors</Link>
              <Link to="/firms" className="block text-white/65 text-sm py-1.5 transition-colors hover:text-white">Investment firms</Link>
              <Link to="/blog" className="block text-white/65 text-sm py-1.5 transition-colors hover:text-white">Resources</Link>
            </div>
            <div>
              <h4 className="font-sans text-[13px] font-semibold text-[#31d6aa] uppercase tracking-[0.12em] mb-[18px]">
                Advisors
              </h4>
              <Link to="/advisor-registration" className="block text-white/65 text-sm py-1.5 transition-colors hover:text-white">Join the directory</Link>
              <Link to="/advisor-registration" className="block text-white/65 text-sm py-1.5 transition-colors hover:text-white">Verification</Link>
              <Link to="/blog" className="block text-white/65 text-sm py-1.5 transition-colors hover:text-white">Resources</Link>
              <Link to="/auth/sign-in" className="block text-white/65 text-sm py-1.5 transition-colors hover:text-white">Log in</Link>
            </div>
            <div>
              <h4 className="font-sans text-[13px] font-semibold text-[#31d6aa] uppercase tracking-[0.12em] mb-[18px]">
                Company
              </h4>
              <Link to="/blog" className="block text-white/65 text-sm py-1.5 transition-colors hover:text-white">Blog</Link>
              <Link to="/advisors" className="block text-white/65 text-sm py-1.5 transition-colors hover:text-white">Methodology</Link>
              <Link to="/firms" className="block text-white/65 text-sm py-1.5 transition-colors hover:text-white">Firms</Link>
            </div>
          </div>
        </div>

        {/* Disclosure */}
        <div className="py-8 border-b border-white/10">
          <p className="text-white/[0.48] text-[12.5px] leading-[1.6] max-w-[900px]">
            Expert Find Hub is not a registered investment adviser. We do not provide investment, tax, or legal advice.
            Advisors listed are independent third parties. Verify all credentials and disclosures on the SEC's Investment Adviser Public
            Disclosure database before engaging any advisor.
          </p>
        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row md:justify-between gap-2 pt-7 text-white/50 text-[13px]">
          <span>&copy; {new Date().getFullYear()} Expert Find Hub. All rights reserved.</span>
          <span>Connecting you with financial experts</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
