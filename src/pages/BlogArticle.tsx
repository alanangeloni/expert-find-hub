
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Calendar, Clock, Facebook, Linkedin, Mail, MessageSquare, Twitter, User, Phone } from "lucide-react"
import { Link, useParams } from "react-router-dom"

export default function BlogArticle() {
  const { slug } = useParams();

  // In a real application, you would fetch the blog post data based on the slug
  // For now, we'll use sample data
  const post = {
    id: slug,
    title: "Retirement Planning Essentials: What You Need to Know in 2023",
    subtitle: "A comprehensive guide to preparing for a secure and comfortable retirement",
    coverImage: "/placeholder.svg?height=600&width=1200",
    date: "June 12, 2023",
    readTime: "8 min read",
    category: "Retirement",
    author: {
      name: "Sarah Johnson",
      role: "Senior Financial Advisor, CFP®",
      bio: "Sarah is a Certified Financial Planner™ with over 12 years of experience helping clients achieve their retirement goals. She specializes in retirement planning, investment management, and tax optimization strategies.",
      avatar: "/placeholder.svg?height=100&width=100",
    },
    content: [
      {
        type: "paragraph",
        content:
          "Planning for retirement is one of the most important financial endeavors you'll undertake in your lifetime. With changing economic conditions, evolving tax laws, and increasing longevity, the retirement planning landscape in 2023 looks different than it did even a few years ago. This guide will help you navigate the essential components of retirement planning in today's environment.",
      },
      {
        type: "heading",
        content: "Understanding Your Retirement Number",
      },
      {
        type: "paragraph",
        content:
          'One of the first questions many people ask is: "How much do I need to retire comfortably?" While there\'s no one-size-fits-all answer, there are several approaches to calculating your retirement number.',
      },
      {
        type: "paragraph",
        content:
          "The traditional rule of thumb suggests you'll need about 70-80% of your pre-retirement income to maintain your standard of living in retirement. However, this can vary significantly based on your desired lifestyle, healthcare needs, and whether you'll have paid off major expenses like your mortgage.",
      },
      {
        type: "paragraph",
        content:
          "A more personalized approach involves creating a detailed retirement budget that accounts for essential expenses (housing, food, healthcare), discretionary spending (travel, hobbies), and potential long-term care costs. This method provides a more accurate picture of your specific needs.",
      },
      {
        type: "callout",
        content:
          "Pro Tip: Don't forget to factor inflation into your calculations. At a modest 3% annual inflation rate, the cost of goods and services will double in about 24 years.",
      },
      {
        type: "heading",
        content: "Maximizing Retirement Savings Vehicles",
      },
      {
        type: "paragraph",
        content:
          "In 2023, there are several tax-advantaged accounts you can leverage to build your retirement nest egg. Understanding the benefits and limitations of each is crucial for optimizing your savings strategy.",
      },
      {
        type: "subheading",
        content: "401(k) and Employer-Sponsored Plans",
      },
      {
        type: "paragraph",
        content:
          "For 2023, the contribution limit for 401(k) plans has increased to $22,500, with an additional $7,500 catch-up contribution allowed for those 50 and older. If your employer offers a match, be sure to contribute at least enough to capture the full match—this is essentially free money toward your retirement.",
      },
      {
        type: "subheading",
        content: "Individual Retirement Accounts (IRAs)",
      },
      {
        type: "paragraph",
        content:
          "IRAs continue to be valuable retirement savings tools. The contribution limit for 2023 is $6,500, with a $1,000 catch-up contribution for those 50 and older. Traditional IRAs offer tax-deductible contributions (subject to income limits if you have a workplace plan), while Roth IRAs provide tax-free withdrawals in retirement.",
      },
      {
        type: "paragraph",
        content:
          "For high-income earners who may be phased out of direct Roth IRA contributions, the 'backdoor Roth' strategy remains viable in 2023, allowing indirect contributions through a Traditional IRA conversion.",
      },
      {
        type: "subheading",
        content: "Health Savings Accounts (HSAs)",
      },
      {
        type: "paragraph",
        content:
          "Often overlooked as a retirement planning tool, HSAs offer triple tax advantages: tax-deductible contributions, tax-free growth, and tax-free withdrawals for qualified medical expenses. In 2023, individuals can contribute up to $3,850 and families up to $7,750, with an additional $1,000 catch-up contribution for those 55 and older.",
      },
      {
        type: "heading",
        content: "Investment Strategies for Retirement",
      },
      {
        type: "paragraph",
        content:
          "Your investment approach should evolve as you move closer to and through retirement. Here are key considerations for 2023:",
      },
      {
        type: "paragraph",
        content:
          "Asset Allocation: The traditional advice to subtract your age from 100 to determine your stock allocation is increasingly viewed as too conservative given longer lifespans. Many financial advisors now recommend a more nuanced approach that considers your risk tolerance, time horizon, and income needs.",
      },
      {
        type: "paragraph",
        content:
          "Sequence of Returns Risk: This refers to the risk of experiencing poor investment returns in the early years of retirement when you're beginning to withdraw funds. Strategies to mitigate this risk include maintaining a cash buffer, implementing a bucket strategy, or using annuities to create guaranteed income.",
      },
      {
        type: "paragraph",
        content:
          "Inflation Protection: With inflation concerns at the forefront, consider incorporating investments that historically have provided inflation protection, such as Treasury Inflation-Protected Securities (TIPS), certain real estate investments, and stocks with strong dividend growth.",
      },
      {
        type: "callout",
        content:
          "Remember: Your retirement could last 30+ years. Your portfolio needs to be positioned not just to preserve capital but to continue growing to outpace inflation over this extended period.",
      },
      {
        type: "heading",
        content: "Social Security Optimization",
      },
      {
        type: "paragraph",
        content:
          "Social Security remains a cornerstone of retirement income for many Americans. Making informed decisions about when and how to claim benefits can significantly impact your retirement finances.",
      },
      {
        type: "paragraph",
        content:
          "The earliest you can claim Social Security retirement benefits is age 62, but doing so results in a permanent reduction—up to 30% less than your full retirement benefit. Full retirement age (FRA) is between 66 and 67, depending on your birth year. Delaying benefits beyond FRA increases your benefit by 8% per year up to age 70.",
      },
      {
        type: "paragraph",
        content:
          "For married couples, there are additional strategies to consider, such as having the lower-earning spouse claim earlier while the higher-earning spouse delays to maximize the survivor benefit.",
      },
      {
        type: "heading",
        content: "Healthcare Planning",
      },
      {
        type: "paragraph",
        content:
          "Healthcare costs represent one of the largest expenses in retirement and continue to rise faster than general inflation. Medicare coverage begins at age 65, but it doesn't cover all healthcare expenses.",
      },
      {
        type: "paragraph",
        content:
          "For 2023, Fidelity estimates that the average 65-year-old couple will need approximately $315,000 saved (after tax) to cover healthcare expenses in retirement. This includes premiums for Medicare Parts B and D, supplemental (Medigap) insurance, and out-of-pocket costs.",
      },
      {
        type: "paragraph",
        content:
          "Long-term care is another significant consideration. With the median annual cost of a private room in a nursing home exceeding $100,000, having a plan for potential long-term care needs is essential. Options include traditional long-term care insurance, hybrid life insurance/long-term care policies, and self-funding through dedicated savings.",
      },
      {
        type: "heading",
        content: "Tax-Efficient Withdrawal Strategies",
      },
      {
        type: "paragraph",
        content:
          "How you withdraw from your various retirement accounts can significantly impact your tax liability and the longevity of your portfolio. A thoughtful withdrawal strategy considers:",
      },
      {
        type: "paragraph",
        content:
          "Tax Bracket Management: Strategically withdrawing from different account types (taxable, tax-deferred, and tax-free) to manage your tax bracket each year.",
      },
      {
        type: "paragraph",
        content:
          "Roth Conversions: Converting portions of Traditional IRA balances to Roth IRAs during lower-income years to reduce required minimum distributions (RMDs) and potential tax burdens later.",
      },
      {
        type: "paragraph",
        content:
          "Qualified Charitable Distributions (QCDs): For philanthropically inclined retirees over 70½, QCDs allow you to donate up to $100,000 annually directly from your IRA to qualified charities, satisfying RMD requirements without increasing taxable income.",
      },
      {
        type: "heading",
        content: "Estate Planning Considerations",
      },
      {
        type: "paragraph",
        content:
          "Retirement planning extends beyond your lifetime to consider how your assets will transfer to heirs or charitable causes. Key estate planning elements include:",
      },
      {
        type: "paragraph",
        content:
          "Will and Trust Documents: Ensuring these documents are up-to-date and reflect your current wishes for asset distribution.",
      },
      {
        type: "paragraph",
        content:
          "Beneficiary Designations: Regularly reviewing and updating beneficiaries on retirement accounts, life insurance policies, and other assets that pass outside of your will.",
      },
      {
        type: "paragraph",
        content:
          "Power of Attorney and Healthcare Directives: Appointing trusted individuals to make financial and medical decisions on your behalf if you become incapacitated.",
      },
      {
        type: "heading",
        content: "Conclusion",
      },
      {
        type: "paragraph",
        content:
          "Retirement planning in 2023 requires a comprehensive approach that addresses savings, investments, income generation, healthcare, taxes, and estate planning. While the principles of sound retirement planning remain constant, the specific strategies and tools continue to evolve with changing laws, economic conditions, and personal circumstances.",
      },
      {
        type: "paragraph",
        content:
          "Working with a qualified financial advisor can help you navigate these complexities and develop a personalized retirement plan that aligns with your goals and provides confidence in your financial future. Remember that retirement planning is not a one-time exercise but an ongoing process that requires regular review and adjustment as your life and external factors change.",
      },
      {
        type: "paragraph",
        content:
          "By taking a proactive approach to retirement planning today, you're investing in your future well-being and peace of mind. The time and effort you dedicate to this process now will pay dividends in the form of a more secure and fulfilling retirement.",
      },
    ],
    relatedPosts: [
      {
        id: "retirement-income-sources",
        title: "Diversifying Your Retirement Income Sources",
        excerpt:
          "Learn how to create multiple streams of retirement income to enhance security and lifestyle flexibility.",
        coverImage: "/placeholder.svg?height=400&width=600",
        category: "Retirement",
      },
      {
        id: "tax-optimization-strategies",
        title: "Tax Optimization Strategies for High-Income Earners",
        excerpt:
          "Discover legal and effective strategies to minimize your tax burden and maximize your after-tax returns.",
        coverImage: "/placeholder.svg?height=400&width=600",
        category: "Tax Planning",
      },
      {
        id: "estate-planning-guide",
        title: "The Complete Guide to Estate Planning for Families",
        excerpt:
          "Ensure your legacy with comprehensive estate planning strategies that protect your assets and loved ones.",
        coverImage: "/placeholder.svg?height=400&width=600",
        category: "Estate Planning",
      },
    ],
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto py-8 px-4 md:px-6">
        {/* Back to Blog */}
        <div className="mb-8">
          <Link to="/blog" className="inline-flex items-center text-slate-600 hover:text-slate-900">
            <ArrowLeft className="mr-2 h-4 w-4" />
            <span>Back to Blog</span>
          </Link>
        </div>

        {/* Article Header */}
        <div className="mb-6">
          <div className="mb-4">
            <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">{post.category}</Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">{post.title}</h1>
          <p className="text-xl text-slate-600 mb-6">{post.subtitle}</p>
          <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{post.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{post.readTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>By {post.author.name}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Image - Full Width */}
      <div className="w-full mb-10 bg-slate-100">
        <div className="max-w-[1400px] mx-auto aspect-[21/9] relative">
          <img src={post.coverImage || "/placeholder.svg"} alt={post.title} className="w-full h-full object-cover" />
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6">
        {/* Article Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <article className="prose prose-slate max-w-none">
              {post.content.map((section, index) => {
                if (section.type === "paragraph") {
                  return <p key={index}>{section.content}</p>
                } else if (section.type === "heading") {
                  return (
                    <h2 key={index} className="text-2xl font-bold mt-8 mb-4">
                      {section.content}
                    </h2>
                  )
                } else if (section.type === "subheading") {
                  return (
                    <h3 key={index} className="text-xl font-semibold mt-6 mb-3">
                      {section.content}
                    </h3>
                  )
                } else if (section.type === "callout") {
                  return (
                    <div key={index} className="bg-blue-50 border-l-4 border-blue-500 p-4 my-6 rounded-r-md">
                      <p className="text-blue-800 italic">{section.content}</p>
                    </div>
                  )
                }
                return null
              })}
            </article>

            {/* Share Article */}
            <div className="mt-10 mb-8">
              <h3 className="font-semibold mb-3">Share this article</h3>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" className="rounded-full">
                  <Twitter className="h-4 w-4" />
                  <span className="sr-only">Share on Twitter</span>
                </Button>
                <Button variant="outline" size="icon" className="rounded-full">
                  <Facebook className="h-4 w-4" />
                  <span className="sr-only">Share on Facebook</span>
                </Button>
                <Button variant="outline" size="icon" className="rounded-full">
                  <Linkedin className="h-4 w-4" />
                  <span className="sr-only">Share on LinkedIn</span>
                </Button>
                <Button variant="outline" size="icon" className="rounded-full">
                  <Mail className="h-4 w-4" />
                  <span className="sr-only">Share via Email</span>
                </Button>
              </div>
            </div>

            {/* Author Bio */}
            <div className="bg-slate-50 rounded-xl p-6 mb-10">
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={post.author.avatar || "/placeholder.svg"} alt={post.author.name} />
                  <AvatarFallback>
                    {post.author.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-lg">About the Author</h3>
                  <p className="text-sm text-slate-600 mb-3">{post.author.role}</p>
                  <p className="text-sm text-slate-600">{post.author.bio}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* CTA Card */}
            <Card className="bg-gradient-to-br from-blue-600 to-blue-800 text-white">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-3">Need Personalized Advice?</h3>
                <p className="mb-6 text-blue-100">
                  Our financial advisors can help you create a retirement plan tailored to your specific needs and
                  goals.
                </p>
                <Button className="w-full bg-white text-blue-800 hover:bg-blue-50">
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule a Consultation
                </Button>
              </CardContent>
            </Card>

            {/* Popular Articles */}
            <div>
              <h3 className="text-lg font-bold mb-4">Popular Articles</h3>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                    <img
                      src="/placeholder.svg?height=100&width=100"
                      alt="Market Volatility"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm line-clamp-2">
                      Navigating Market Volatility: Strategies for Uncertain Times
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">May 28, 2023</p>
                  </div>
                </div>
                <Separator />
                <div className="flex gap-3">
                  <div className="h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                    <img
                      src="/placeholder.svg?height=100&width=100"
                      alt="Tax Optimization"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm line-clamp-2">
                      Tax Optimization Strategies for High-Income Earners
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">May 15, 2023</p>
                  </div>
                </div>
                <Separator />
                <div className="flex gap-3">
                  <div className="h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                    <img
                      src="/placeholder.svg?height=100&width=100"
                      alt="Estate Planning"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm line-clamp-2">
                      The Complete Guide to Estate Planning for Families
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">April 30, 2023</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Categories */}
            <div>
              <h3 className="text-lg font-bold mb-4">Categories</h3>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Retirement</Badge>
                <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200">Investing</Badge>
                <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">Tax Planning</Badge>
                <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">Estate Planning</Badge>
                <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Market Insights</Badge>
                <Badge className="bg-slate-100 text-slate-800 hover:bg-slate-200">Financial Education</Badge>
              </div>
            </div>

            {/* Newsletter Signup */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-3">Subscribe to Our Newsletter</h3>
                <p className="text-sm text-slate-600 mb-4">
                  Get the latest financial insights and planning strategies delivered to your inbox.
                </p>
                <div className="space-y-3">
                  <Input placeholder="Your email address" />
                  <Button className="w-full">Subscribe</Button>
                </div>
              </CardContent>
            </Card>

            {/* Contact Card */}
            <Card className="bg-slate-50">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-3">Have Questions?</h3>
                <p className="text-sm text-slate-600 mb-4">
                  Our team is here to help you with any questions about retirement planning.
                </p>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full">
                    <Phone className="mr-2 h-4 w-4" />
                    Call Us
                  </Button>
                  <Button variant="outline" className="w-full">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Chat Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Related Articles - Full Width */}
      <div className="mt-16 border-t pt-12">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-2xl font-bold mb-8 text-center">Related Articles</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {post.relatedPosts.map((relatedPost) => (
              <Link key={relatedPost.id} to={`/blog/${relatedPost.id}`}>
                <Card className="h-full overflow-hidden hover:shadow-md transition-shadow">
                  <div className="aspect-video w-full overflow-hidden">
                    <img
                      src={relatedPost.coverImage || "/placeholder.svg"}
                      alt={relatedPost.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <Badge
                      className={`mb-2 ${
                        relatedPost.category === "Investing"
                          ? "bg-emerald-100 text-emerald-800"
                          : relatedPost.category === "Retirement"
                            ? "bg-blue-100 text-blue-800"
                            : relatedPost.category === "Tax Planning"
                              ? "bg-purple-100 text-purple-800"
                              : relatedPost.category === "Estate Planning"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-slate-100 text-slate-800"
                      }`}
                    >
                      {relatedPost.category}
                    </Badge>
                    <h3 className="font-semibold mb-2 line-clamp-2">{relatedPost.title}</h3>
                    <p className="text-sm text-slate-600 line-clamp-2">{relatedPost.excerpt}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
