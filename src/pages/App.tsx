import { ArrowRight, TrendingUp, DollarSign, BarChart3, Shield, Zap, LineChart, PieChart } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Seo } from '@/components/seo/Seo';
import cloudHeroBg from '@/assets/cloud-hero-bg.png';

const AppPage = () => {
  return (
    <>
      <Seo 
        title="Investment Platform - Start Trading Today"
        description="Professional investment platform with real-time analytics, earnings insights, and powerful trading tools. Start investing with confidence."
      />
      
      <main className="min-h-screen">
        {/* Hero Section */}
        <section 
          className="relative min-h-[600px] flex items-center justify-center overflow-hidden"
          style={{
            backgroundImage: `url(${cloudHeroBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/20" />
          
          <div className="container relative z-10 mx-auto px-4 py-20">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-5xl md:text-6xl font-bold text-primary mb-6">
                Investing for people are<br />serious about it
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Make smarter investment decisions with real-time data and insights
                from professional-grade tools.
              </p>
              
              <div className="flex items-center justify-center gap-4 mb-12">
                <Button size="lg" className="px-8">
                  Start for Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Badge variant="secondary" className="px-4 py-2 text-lg">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  8.9%
                </Badge>
              </div>
              
              {/* Dashboard Preview */}
              <Card className="max-w-3xl mx-auto p-2 bg-background/95 backdrop-blur border-border/50">
                <div className="bg-gradient-to-br from-muted/30 to-muted/10 rounded-lg p-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-background rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Portfolio Value</span>
                        <TrendingUp className="h-4 w-4 text-green-500" />
                      </div>
                      <div className="text-2xl font-bold">$125,486.00</div>
                      <div className="text-sm text-green-500">+12.5%</div>
                    </div>
                    
                    <div className="bg-background rounded-lg p-4">
                      <div className="h-24 flex items-end justify-between">
                        {[40, 65, 45, 70, 85, 75, 90].map((height, i) => (
                          <div
                            key={i}
                            className="w-2 bg-primary rounded-t"
                            style={{ height: `${height}%` }}
                          />
                        ))}
                      </div>
                    </div>
                    
                    <div className="bg-background rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Today's Gain</span>
                        <DollarSign className="h-4 w-4 text-primary" />
                      </div>
                      <div className="text-2xl font-bold">+$2,486</div>
                      <div className="text-sm text-muted-foreground">+2.1%</div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Quote Section */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <p className="text-center text-lg text-muted-foreground italic max-w-3xl mx-auto">
              "Public earns high marks for ease-of-use and fractional shares"
              <span className="block mt-2 text-sm not-italic">— Bankrate</span>
            </p>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-4">
              Five nerdy features you will love.
            </h2>
            <p className="text-center text-muted-foreground mb-12">
              (Discover many more in the app.)
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Key Moments */}
              <Card className="p-6">
                <div className="mb-4">
                  <Badge variant="outline" className="mb-4">Key Moments</Badge>
                  <h3 className="text-xl font-semibold mb-2">Key Moments</h3>
                  <p className="text-sm text-muted-foreground">
                    Track earnings reports and other data events like
                    economic indicators, IPO activities, et cetera.
                  </p>
                </div>
                <div className="bg-muted/30 rounded-lg p-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>AAPL Earnings</span>
                      <span className="text-green-500">+5.2%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Fed Meeting</span>
                      <span className="text-muted-foreground">Today</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>CPI Data</span>
                      <span className="text-red-500">-0.3%</span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Income Hub */}
              <Card className="p-6">
                <div className="mb-4">
                  <Badge variant="outline" className="mb-4">Income Hub</Badge>
                  <h3 className="text-xl font-semibold mb-2">Income Hub</h3>
                  <p className="text-sm text-muted-foreground">
                    View investor-generating yield over time. Find every
                    dividend or short-term up to 5.5% yield.
                  </p>
                </div>
                <div className="bg-muted/30 rounded-lg p-4">
                  <div className="h-24 flex items-end justify-between">
                    {[30, 45, 60, 40, 70, 85, 65].map((height, i) => (
                      <div key={i} className="flex-1 mx-0.5">
                        <div
                          className="bg-primary rounded-t"
                          style={{ height: `${height}%` }}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 text-center text-sm text-muted-foreground">
                    Yield over time
                  </div>
                </div>
              </Card>

              {/* Earnings Hub */}
              <Card className="p-6">
                <div className="mb-4">
                  <Badge variant="outline" className="mb-4">Earnings Hub</Badge>
                  <h3 className="text-xl font-semibold mb-2">Earnings Hub</h3>
                  <p className="text-sm text-muted-foreground">
                    Earnings info presented simply, whether it's a current
                    position or new discovery.
                  </p>
                </div>
                <div className="bg-muted/30 rounded-lg p-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <span className="text-sm">Beat Estimates</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                      <span className="text-sm">Met Expectations</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full" />
                      <span className="text-sm">Missed Target</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Additional Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mt-8">
              {/* Investment Plans */}
              <Card className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Investment Plans</h3>
                    <p className="text-sm text-muted-foreground">
                      Customized investment strategies based on your goals.
                    </p>
                  </div>
                  <LineChart className="h-8 w-8 text-primary" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted/30 rounded-lg p-3">
                    <div className="text-sm font-medium mb-1">Conservative</div>
                    <div className="text-xs text-muted-foreground">5-7% returns</div>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-3">
                    <div className="text-sm font-medium mb-1">Aggressive</div>
                    <div className="text-xs text-muted-foreground">12-15% returns</div>
                  </div>
                </div>
              </Card>

              {/* Outlook */}
              <Card className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Outlook</h3>
                    <p className="text-sm text-muted-foreground">
                      AI-powered market predictions and trend analysis.
                    </p>
                  </div>
                  <PieChart className="h-8 w-8 text-primary" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Market Sentiment</span>
                    <Badge variant="secondary">Bullish</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Risk Level</span>
                    <Badge variant="outline">Moderate</Badge>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Instant Buying Power Section */}
        <section className="py-20 bg-gradient-to-br from-primary/5 to-primary/10">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-4xl font-bold mb-4">
                And up to $250,000
              </h2>
              <p className="text-2xl text-muted-foreground mb-8">
                in instant buying power
              </p>
              <p className="text-lg text-muted-foreground mb-8">
                Give authorization for your brokerage account to borrow
                money and you can access up to $250k instantly.
              </p>
              <Button size="lg" variant="outline">
                Unlock My Account
              </Button>
            </div>
          </div>
        </section>

        {/* Security Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl font-bold mb-6">
                    Your security is our priority
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Shield className="h-6 w-6 text-primary mt-1" />
                      <div>
                        <h3 className="font-semibold mb-1">Bank-level encryption</h3>
                        <p className="text-sm text-muted-foreground">
                          256-bit encryption protects your data and transactions.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Zap className="h-6 w-6 text-primary mt-1" />
                      <div>
                        <h3 className="font-semibold mb-1">SIPC Protection</h3>
                        <p className="text-sm text-muted-foreground">
                          Securities in your account are protected up to $500,000.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <BarChart3 className="h-6 w-6 text-primary mt-1" />
                      <div>
                        <h3 className="font-semibold mb-1">Real-time monitoring</h3>
                        <p className="text-sm text-muted-foreground">
                          24/7 fraud detection and account monitoring.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-8">
                  <div className="aspect-square max-w-sm mx-auto flex items-center justify-center">
                    <Shield className="h-32 w-32 text-primary/50" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-4">
                Ready to start investing?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Join millions of investors using our platform to build their wealth.
              </p>
              <div className="flex items-center justify-center gap-4">
                <Button size="lg">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline">
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default AppPage;