
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, Search } from "lucide-react"
import { Link } from "react-router-dom"

export default function Blog() {
  // Sample blog data
  const categories = [
    "All",
    "Retirement",
    "Investing",
    "Tax Planning",
    "Estate Planning",
    "Market Insights",
    "Financial Education",
  ]

  const posts = [
    {
      id: "market-volatility-strategies",
      title: "Navigating Market Volatility: Strategies for Uncertain Times",
      excerpt: "Learn how to protect and grow your investments during periods of market uncertainty and volatility.",
      coverImage: "/placeholder.svg?height=400&width=600",
      date: "May 28, 2023",
      readTime: "6 min read",
      category: "Investing",
      author: {
        name: "David Chen",
        role: "Investment Specialist",
        avatar: "/placeholder.svg?height=100&width=100",
      },
    },
    {
      id: "tax-optimization-strategies",
      title: "Tax Optimization Strategies for High-Income Earners",
      excerpt:
        "Discover legal and effective strategies to minimize your tax burden and maximize your after-tax returns.",
      coverImage: "/placeholder.svg?height=400&width=600",
      date: "May 15, 2023",
      readTime: "7 min read",
      category: "Tax Planning",
      author: {
        name: "Maria Rodriguez",
        role: "Tax Planning Specialist",
        avatar: "/placeholder.svg?height=100&width=100",
      },
    },
    {
      id: "estate-planning-guide",
      title: "The Complete Guide to Estate Planning for Families",
      excerpt:
        "Ensure your legacy with comprehensive estate planning strategies that protect your assets and loved ones.",
      coverImage: "/placeholder.svg?height=400&width=600",
      date: "April 30, 2023",
      readTime: "9 min read",
      category: "Estate Planning",
      author: {
        name: "James Wilson",
        role: "Estate Planning Advisor",
        avatar: "/placeholder.svg?height=100&width=100",
      },
    },
    {
      id: "sustainable-investing-trends",
      title: "Sustainable Investing: Trends and Opportunities in 2023",
      excerpt: "Explore how ESG investing is evolving and the opportunities it presents for both impact and returns.",
      coverImage: "/placeholder.svg?height=400&width=600",
      date: "April 18, 2023",
      readTime: "5 min read",
      category: "Investing",
      author: {
        name: "Alex Thompson",
        role: "ESG Investment Specialist",
        avatar: "/placeholder.svg?height=100&width=100",
      },
    },
    {
      id: "retirement-income-sources",
      title: "Diversifying Your Retirement Income Sources",
      excerpt:
        "Learn how to create multiple streams of retirement income to enhance security and lifestyle flexibility.",
      coverImage: "/placeholder.svg?height=400&width=600",
      date: "April 5, 2023",
      readTime: "7 min read",
      category: "Retirement",
      author: {
        name: "Sarah Johnson",
        role: "Senior Financial Advisor",
        avatar: "/placeholder.svg?height=100&width=100",
      },
    },
    {
      id: "market-outlook-q2",
      title: "Q2 2023 Market Outlook: Navigating Inflation and Interest Rates",
      excerpt: "Our analysis of current market conditions and strategic recommendations for the coming quarter.",
      coverImage: "/placeholder.svg?height=400&width=600",
      date: "March 28, 2023",
      readTime: "8 min read",
      category: "Market Insights",
      author: {
        name: "David Chen",
        role: "Investment Specialist",
        avatar: "/placeholder.svg?height=100&width=100",
      },
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto py-6 md:py-8 px-4 md:px-6">
        {/* Blog Header */}
        <div className="mb-8 md:mb-12 text-center">
          <h1 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4">Financial Insights Blog</h1>
          <p className="text-slate-600 max-w-2xl mx-auto text-sm md:text-base">
            Expert advice, market insights, and financial planning strategies to help you achieve your financial goals.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 md:mb-10">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search articles..." className="pl-10" />
          </div>
          <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
            <Tabs defaultValue="All" className="w-full md:w-auto">
              <TabsList className="h-auto flex flex-nowrap justify-start min-w-max">
                {categories.map((category) => (
                  <TabsTrigger key={category} value={category} className="text-xs md:text-sm whitespace-nowrap">
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Latest Articles */}
        <div className="mb-10 md:mb-12">
          <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Latest Articles</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {posts.map((post) => (
              <Card key={post.id} className="overflow-hidden border-slate-200 hover:shadow-md transition-shadow">
                <div className="aspect-video w-full overflow-hidden">
                  <img
                    src={post.coverImage || "/placeholder.svg"}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-4 md:p-5">
                  <div className="mb-3">
                    <Badge
                      className={`${
                        post.category === "Investing"
                          ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                          : post.category === "Retirement"
                            ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
                            : post.category === "Tax Planning"
                              ? "bg-purple-100 text-purple-800 hover:bg-purple-200"
                              : post.category === "Estate Planning"
                                ? "bg-amber-100 text-amber-800 hover:bg-amber-200"
                                : post.category === "Market Insights"
                                  ? "bg-red-100 text-red-800 hover:bg-red-200"
                                  : "bg-slate-100 text-slate-800 hover:bg-slate-200"
                      }`}
                    >
                      {post.category}
                    </Badge>
                  </div>
                  <h3 className="text-lg md:text-xl font-bold mb-2 line-clamp-2">{post.title}</h3>
                  <p className="text-slate-600 text-sm mb-4 line-clamp-3">{post.excerpt}</p>
                  <div className="flex items-center gap-2 md:gap-3">
                    <Avatar className="h-7 w-7 md:h-8 md:w-8">
                      <AvatarImage src={post.author.avatar || "/placeholder.svg"} alt={post.author.name} />
                      <AvatarFallback>
                        {post.author.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-xs md:text-sm truncate">{post.author.name}</p>
                      <p className="text-xs text-slate-500 truncate">{post.author.role}</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="px-4 md:px-5 py-2 md:py-3 border-t flex justify-between items-center">
                  <div className="flex items-center gap-3 md:gap-4 text-xs text-slate-500">
                    <div className="flex items-center gap-1 md:gap-1.5">
                      <Calendar className="h-3 w-3 md:h-3.5 md:w-3.5" />
                      <span className="text-[10px] md:text-xs">{post.date}</span>
                    </div>
                    <div className="flex items-center gap-1 md:gap-1.5">
                      <Clock className="h-3 w-3 md:h-3.5 md:w-3.5" />
                      <span className="text-[10px] md:text-xs">{post.readTime}</span>
                    </div>
                  </div>
                  <Link to={`/blog/${post.id}`}>
                    <Button variant="ghost" size="sm" className="text-xs md:text-sm px-2 md:px-3 h-8">
                      Read More
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl p-5 md:p-8 text-white">
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div>
              <h2 className="text-xl md:text-2xl font-bold mb-2">Stay Informed</h2>
              <p className="text-slate-300 mb-4 text-sm md:text-base">
                Subscribe to our newsletter for the latest financial insights, market updates, and planning strategies.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2 text-xs md:text-sm">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-400"></div>
                  <span>Weekly market updates and analysis</span>
                </li>
                <li className="flex items-center gap-2 text-xs md:text-sm">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-400"></div>
                  <span>Exclusive financial planning tips</span>
                </li>
                <li className="flex items-center gap-2 text-xs md:text-sm">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-400"></div>
                  <span>Early access to webinars and events</span>
                </li>
              </ul>
            </div>
            <div className="bg-white/10 rounded-lg p-4 md:p-5">
              <form className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">
                    Name
                  </label>
                  <Input id="name" placeholder="Your name" className="bg-white/10 border-white/20" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">
                    Email
                  </label>
                  <Input id="email" type="email" placeholder="Your email" className="bg-white/10 border-white/20" />
                </div>
                <Button className="w-full bg-white text-slate-900 hover:bg-slate-100">Subscribe</Button>
                <p className="text-xs text-slate-400 text-center">We respect your privacy. Unsubscribe at any time.</p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
