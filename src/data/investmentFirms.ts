
// Investment firms data
export const firmsData = {
  vanguard: {
    id: "vanguard",
    name: "Vanguard",
    logo: "/placeholder.svg",
    verified: true,
    rating: 4.7,
    reviewCount: 203,
    assetClasses: ["Equities", "Fixed Income", "Multi-Asset"],
    description:
      "One of the world's largest investment companies, offering low-cost mutual funds, ETFs, advice, and related services.",
    longDescription:
      "The Vanguard Group, Inc. is an American registered investment advisor based in Malvern, Pennsylvania with about $7.2 trillion in global assets under management. It is the largest provider of mutual funds and the second-largest provider of exchange-traded funds (ETFs) in the world. Vanguard is known for its client-owned structure where the funds own the company, eliminating outside owners and effectively making the investors the owners. This unique structure allows Vanguard to return profits to fund shareholders through lower expenses.",
    videoUrl: "https://www.youtube.com/embed/M9IGUXS_wAY",
    videoTitle: "Why Invest with Vanguard",
    minimumInvestment: "$1,000",
    targetReturn: "6% - 10%",
    aum: "$7.2 trillion",
    founded: 1975,
    headquarters: "Valley Forge, PA",
    employees: "17,600+",
    website: "www.vanguard.com",
    riskScore: 2,
    liquidity: "High",
    payout: "Quarterly",
    fees: "0.03% - 0.20% annually",
    investmentApproach:
      "Vanguard is known for its focus on low-cost investing, particularly through index funds that track market benchmarks. The company's investment philosophy centers on long-term investing, broad diversification, and keeping costs low. Vanguard believes that minimizing costs is crucial for maximizing returns over time.",
    keyFeatures: [
      "Industry-leading low expense ratios",
      "Client-owned structure that eliminates conflicts of interest",
      "Long-term, buy-and-hold investment philosophy",
      "Broad range of index and actively managed funds",
      "Personal advisor services for larger accounts",
    ],
    howYouMakeMoney: [
      {
        title: "Dividends",
        description:
          "Many Vanguard funds pay dividends from the stocks and bonds they hold, which can be reinvested or taken as income.",
      },
      {
        title: "Capital Appreciation",
        description:
          "As the value of securities in Vanguard funds increases over time, the value of your investment grows.",
      },
      {
        title: "Interest",
        description: "Vanguard's bond funds and money market funds generate interest income for investors.",
      },
    ],
    howTheyMakeMoney:
      "Vanguard charges management fees on its funds, typically ranging from 0.03% to 0.20% annually for index funds and ETFs, and slightly higher for actively managed funds. These fees are among the lowest in the industry due to Vanguard's unique ownership structure where the funds own the company, allowing profits to be returned to investors through lower expenses.",
    investmentRisks:
      "While Vanguard is known for its focus on diversification and long-term investing, all investments carry risk. Market risk affects all securities, and even diversified portfolios can decline in value during market downturns. Bond funds face interest rate risk, and international investments are subject to currency and geopolitical risks. Vanguard emphasizes investor education to help clients understand and manage these risks appropriately for their financial goals and time horizons.",
    leadership: [
      {
        name: "Tim Buckley",
        position: "Chairman and CEO",
        bio: "Joined Vanguard in 1991 and became CEO in 2018. Previously served as Chief Investment Officer and head of the Retail Investor Group.",
        avatar: "/placeholder.svg",
      },
      {
        name: "John James",
        position: "Managing Director",
        bio: "Leads Vanguard's Institutional Investor Group, serving the needs of institutions worldwide.",
        avatar: "/placeholder.svg",
      },
      {
        name: "Greg Davis",
        position: "Chief Investment Officer",
        bio: "Oversees Vanguard's Global Investment Groups and Fund Oversight & Advisory Services.",
        avatar: "/placeholder.svg",
      },
    ],
    clientTypes: [
      "Individual Investors",
      "Financial Advisors",
      "Institutional Investors",
      "Retirement Plan Sponsors",
      "Endowments and Foundations",
    ],
    regulatoryInfo: {
      registrations: ["SEC", "FINRA", "Global regulatory bodies"],
      disclosures:
        "Vanguard is regulated by the Securities and Exchange Commission (SEC) and complies with all applicable securities laws and regulations. The company provides transparent disclosure of its investment activities, fees, and financial performance through prospectuses, annual reports, and other regulatory filings.",
    },
    similarFirms: [
      {
        id: "blackrock",
        name: "BlackRock",
        logo: "/placeholder.svg",
        assetClasses: ["Equities", "Fixed Income", "Alternatives", "Multi-Asset"],
        minimumInvestment: "$1,000",
        targetReturn: "7% - 12%",
      },
      {
        id: "fidelity",
        name: "Fidelity Investments",
        logo: "/placeholder.svg",
        assetClasses: ["Equities", "Fixed Income", "Alternatives", "Multi-Asset"],
        minimumInvestment: "$0",
        targetReturn: "7% - 11%",
      },
      {
        id: "schwab",
        name: "Charles Schwab",
        logo: "/placeholder.svg",
        assetClasses: ["Equities", "Fixed Income", "Multi-Asset"],
        minimumInvestment: "$0",
        targetReturn: "6% - 10%",
      },
    ],
  },
  blackrock: {
    id: "blackrock",
    name: "BlackRock",
    logo: "/placeholder.svg",
    verified: true,
    rating: 4.8,
    reviewCount: 156,
    assetClasses: ["Equities", "Fixed Income", "Alternatives", "Multi-Asset"],
    description: "Global investment manager and technology provider helping investors achieve financial well-being.",
    longDescription:
      "BlackRock, Inc. is an American multinational investment management corporation based in New York City. Founded in 1988, initially as a risk management and fixed income institutional asset manager, BlackRock is the world's largest asset manager, with US$9.1 trillion in assets under management as of 2023. BlackRock operates globally with 70 offices in 30 countries and clients in 100 countries. Due to its power and the sheer size and scope of its financial assets and activities, BlackRock has been called the world's largest shadow bank.",
    videoUrl: "https://www.youtube.com/embed/ZxvKJt5VRkk",
    videoTitle: "About BlackRock",
    minimumInvestment: "$1,000",
    targetReturn: "7% - 12%",
    aum: "$9.1 trillion",
    founded: 1988,
    headquarters: "New York, NY",
    employees: "18,000+",
    website: "www.blackrock.com",
    riskScore: 3,
    liquidity: "High",
    payout: "Quarterly",
    fees: "0.03% - 0.80% annually",
    investmentApproach:
      "BlackRock employs a diverse range of investment strategies across various asset classes. The firm is known for its risk management expertise and technology-driven approach to investing. BlackRock's investment philosophy centers on understanding and managing risk to deliver sustainable long-term returns.",
    keyFeatures: [
      "Broad range of active and index investment strategies",
      "Advanced risk management technology (Aladdin)",
      "Global research capabilities with local market expertise",
      "Sustainable investing options across asset classes",
      "Institutional-quality investment solutions for individual investors",
    ],
    howYouMakeMoney: [
      {
        title: "Dividends",
        description:
          "BlackRock funds distribute dividends from underlying securities, providing regular income to investors.",
      },
      {
        title: "Capital Appreciation",
        description:
          "As the value of securities in BlackRock funds increases over time, the value of your investment grows.",
      },
      {
        title: "Total Return",
        description: "BlackRock offers funds focused on both income and growth for a balanced investment approach.",
      },
    ],
    howTheyMakeMoney:
      "BlackRock generates revenue primarily through management fees charged on assets under management. These fees vary by product type, with ETFs typically charging lower fees (0.03% to 0.10%) and actively managed funds charging higher fees (0.50% to 0.80%). BlackRock also earns revenue from its Aladdin risk management technology platform, which it licenses to other financial institutions.",
    investmentRisks:
      "All investments with BlackRock involve risk, including possible loss of principal. Asset allocation and diversification may not protect against market risk, loss of principal, or volatility of returns. International investing involves special risks including currency fluctuations, illiquidity, volatility, and political and economic risks. These risks may be heightened for investments in emerging markets.",
    leadership: [
      {
        name: "Laurence D. Fink",
        position: "Chairman and CEO",
        bio: "Co-founded BlackRock in 1988. Under his leadership, BlackRock has grown into the world's largest asset management firm.",
        avatar: "/placeholder.svg",
      },
      {
        name: "Robert S. Kapito",
        position: "President",
        bio: "Co-founder of BlackRock. Responsible for day-to-day oversight of all BlackRock's key operating units.",
        avatar: "/placeholder.svg",
      },
      {
        name: "Rob Goldstein",
        position: "COO and Head of BlackRock Solutions",
        bio: "Oversees BlackRock's operations, technology, and Aladdin business.",
        avatar: "/placeholder.svg",
      },
    ],
    clientTypes: [
      "Institutional Investors",
      "Financial Advisors",
      "Individual Investors",
      "Governments",
      "Corporations",
    ],
    regulatoryInfo: {
      registrations: ["SEC", "FCA", "FINRA", "Global regulatory bodies"],
      disclosures:
        "BlackRock is regulated by financial authorities in multiple jurisdictions worldwide. The firm adheres to strict compliance standards and provides transparent disclosure of its investment activities and financial performance.",
    },
    similarFirms: [
      {
        id: "vanguard",
        name: "Vanguard",
        logo: "/placeholder.svg",
        assetClasses: ["Equities", "Fixed Income", "Multi-Asset"],
        minimumInvestment: "$1,000",
        targetReturn: "6% - 10%",
      },
      {
        id: "fidelity",
        name: "Fidelity Investments",
        logo: "/placeholder.svg",
        assetClasses: ["Equities", "Fixed Income", "Alternatives", "Multi-Asset"],
        minimumInvestment: "$0",
        targetReturn: "7% - 11%",
      },
      {
        id: "statestreet",
        name: "State Street Global Advisors",
        logo: "/placeholder.svg",
        assetClasses: ["Equities", "Fixed Income", "Multi-Asset"],
        minimumInvestment: "$1,000",
        targetReturn: "6% - 9%",
      },
    ],
  },
  fidelity: {
    id: "fidelity",
    name: "Fidelity Investments",
    logo: "/placeholder.svg",
    verified: true,
    rating: 4.6,
    reviewCount: 178,
    assetClasses: ["Equities", "Fixed Income", "Alternatives", "Multi-Asset"],
    description: "Financial services corporation offering investment management, retirement planning, and more.",
    longDescription:
      "Fidelity Investments is a multinational financial services corporation based in Boston, Massachusetts. Founded in 1946, Fidelity is one of the largest asset managers in the world with $4.5 trillion in assets under management and $11.8 trillion in assets under administration. The company offers a wide range of services including investment management, retirement planning, brokerage services, and financial advice to individuals, institutions, and financial advisors.",
    videoUrl: "https://www.youtube.com/embed/QQerVSHnOLc",
    videoTitle: "About Fidelity Investments",
    minimumInvestment: "$0",
    targetReturn: "7% - 11%",
    aum: "$4.5 trillion",
    founded: 1946,
    headquarters: "Boston, MA",
    employees: "60,000+",
    website: "www.fidelity.com",
    riskScore: 3,
    liquidity: "High",
    payout: "Quarterly",
    fees: "0.00% - 0.75% annually",
    investmentApproach:
      "Fidelity employs a research-driven approach to investing, with one of the largest research teams in the industry. The firm offers both actively managed funds with a focus on fundamental analysis and low-cost index funds. Fidelity's investment philosophy emphasizes long-term thinking, disciplined portfolio construction, and risk management.",
    keyFeatures: [
      "Zero expense ratio index funds",
      "Comprehensive retirement planning services",
      "Active and passive investment strategies",
      "Robust trading platform with advanced tools",
      "Extensive educational resources for investors",
    ],
    howYouMakeMoney: [
      {
        title: "Dividends and Interest",
        description: "Fidelity funds distribute income from dividends and interest earned on underlying securities.",
      },
      {
        title: "Capital Gains",
        description: "As investments in Fidelity funds appreciate in value, investors can realize capital gains.",
      },
      {
        title: "Total Return",
        description: "Many Fidelity funds focus on total return, combining income and capital appreciation.",
      },
    ],
    howTheyMakeMoney:
      "Fidelity generates revenue through management fees on its funds, ranging from 0% for select index funds to around 0.75% for actively managed funds. The company also earns revenue from brokerage services, financial advisory fees, administration fees for retirement plans, and net interest income from cash management accounts and margin lending.",
    investmentRisks:
      "Investing with Fidelity involves market risk, and you could lose money on your investments. Different fund types carry specific risks: equity funds are subject to market volatility, bond funds face interest rate and credit risks, and international funds are exposed to currency fluctuations and geopolitical risks. Fidelity provides risk management tools and educational resources to help investors understand and manage these risks.",
    leadership: [
      {
        name: "Abigail Johnson",
        position: "Chairman and CEO",
        bio: "Joined Fidelity in 1988 and became CEO in 2014. Third-generation family leader of the company founded by her grandfather.",
        avatar: "/placeholder.svg",
      },
      {
        name: "Anne Richards",
        position: "CEO of Fidelity International",
        bio: "Leads Fidelity's international business operations outside the United States.",
        avatar: "/placeholder.svg",
      },
      {
        name: "Steve Neff",
        position: "Head of Asset Management",
        bio: "Oversees Fidelity's investment divisions and trading operations.",
        avatar: "/placeholder.svg",
      },
    ],
    clientTypes: [
      "Individual Investors",
      "Financial Advisors",
      "Institutional Investors",
      "Employers and Plan Sponsors",
      "High Net Worth Individuals",
    ],
    regulatoryInfo: {
      registrations: ["SEC", "FINRA", "Global regulatory bodies"],
      disclosures:
        "Fidelity is regulated by the Securities and Exchange Commission (SEC) and the Financial Industry Regulatory Authority (FINRA). The company provides transparent disclosure of its investment activities, fees, and financial performance through prospectuses, annual reports, and other regulatory filings.",
    },
    similarFirms: [
      {
        id: "vanguard",
        name: "Vanguard",
        logo: "/placeholder.svg",
        assetClasses: ["Equities", "Fixed Income", "Multi-Asset"],
        minimumInvestment: "$1,000",
        targetReturn: "6% - 10%",
      },
      {
        id: "blackrock",
        name: "BlackRock",
        logo: "/placeholder.svg",
        assetClasses: ["Equities", "Fixed Income", "Alternatives", "Multi-Asset"],
        minimumInvestment: "$1,000",
        targetReturn: "7% - 12%",
      },
      {
        id: "schwab",
        name: "Charles Schwab",
        logo: "/placeholder.svg",
        assetClasses: ["Equities", "Fixed Income", "Multi-Asset"],
        minimumInvestment: "$0",
        targetReturn: "6% - 10%",
      },
    ],
  },
};
