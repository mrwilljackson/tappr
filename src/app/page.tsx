import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Beer, BookOpen, Download, MessageSquare, Scale, Share2, Smartphone } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Testimonial } from "@/components/testimonial"
import { FeatureCard } from "@/components/feature-card"
import { AppScreenshot } from "@/components/app-screenshot"
import { SiteContainer } from "@/components/site-container"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <SiteContainer>
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <Beer className="h-6 w-6 text-amber-600 transform rotate-15" />
              <span className="text-xl font-bold tracking-tight font-patua">TAPPR</span>
            </div>
            <nav className="hidden md:flex gap-6">
              <Link href="#features" className="text-sm font-medium hover:text-amber-600 transition-colors">
                Features
              </Link>
              <Link href="#how-it-works" className="text-sm font-medium hover:text-amber-600 transition-colors">
                How It Works
              </Link>
              <Link href="#testimonials" className="text-sm font-medium hover:text-amber-600 transition-colors">
                Testimonials
              </Link>
            </nav>
            <div>
              <Button variant="outline" className="hidden md:inline-flex mr-4">
                Log In
              </Button>
              <Button className="bg-amber-600 hover:bg-amber-700">Sign Up</Button>
            </div>
          </div>
        </SiteContainer>
      </header>
      <main className="flex-1">
        <section className="py-12 md:py-24 lg:py-32 xl:py-36">
          <SiteContainer>
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl font-patua">
                    Never Lose Track of Your Homebrew Again
                  </h1>
                  <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400 font-montserrat">
                    TAPPR helps you monitor your kegs, bottles, and brews with precision. Track, taste, and share your
                    homebrewing journey with friends.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button className="bg-amber-600 hover:bg-amber-700">
                    Join Waitlist
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button variant="outline">Learn More</Button>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative w-full max-w-sm">
                  <div className="absolute -left-4 -top-4 h-72 w-72 bg-orange-500/20 rounded-full blur-3xl" />
                  <div className="absolute -bottom-4 -right-4 h-72 w-72 bg-amber-600/20 rounded-full blur-3xl" />
                  <Image
                    src="/placeholder.svg?height=600&width=300"
                    width={300}
                    height={600}
                    alt="TAPPR App Screenshot"
                    className="relative z-10 mx-auto rounded-2xl border shadow-xl"
                  />
                </div>
              </div>
            </div>
          </SiteContainer>
        </section>

        <section id="features" className="bg-amber-50 py-12 md:py-24 lg:py-32">
          <SiteContainer>
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-amber-100 px-3 py-1 text-sm">Features</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-patua">
                  Everything You Need to Brew Better
                </h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400 font-montserrat">
                  TAPPR combines precision tracking with social features to elevate your homebrewing experience.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
              <FeatureCard
                icon={<Scale className="h-10 w-10 text-amber-600" />}
                title="Bluetooth Scale Integration"
                description="Connect to smart scales to automatically track the exact amount of beer left in your kegs."
              />
              <FeatureCard
                icon={<BookOpen className="h-10 w-10 text-amber-600" />}
                title="Tasting Notes"
                description="Record detailed tasting notes for each batch, tracking how flavors develop over time."
              />
              <FeatureCard
                icon={<MessageSquare className="h-10 w-10 text-amber-600" />}
                title="Friend Ratings"
                description="Let friends rate your brews and provide feedback to help you improve your recipes."
              />
              <FeatureCard
                icon={<Smartphone className="h-10 w-10 text-amber-600" />}
                title="Custom Serving Sizes"
                description="Define your own serving sizes to accurately track consumption regardless of glassware."
              />
              <FeatureCard
                icon={<Share2 className="h-10 w-10 text-amber-600" />}
                title="Brewfather Integration"
                description="Sync with Brewfather to automatically import all your recipe details and brewing data."
              />
              <FeatureCard
                icon={<Download className="h-10 w-10 text-amber-600" />}
                title="Offline Mode"
                description="Track your brews even without internet connection - perfect for brewery setups in basements."
              />
            </div>
          </SiteContainer>
        </section>

        <section id="app-preview" className="py-12 md:py-24 lg:py-32">
          <SiteContainer>
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-amber-100 px-3 py-1 text-sm">App Preview</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-patua">See TAPPR in Action</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400 font-montserrat">
                  Take a peek at how TAPPR will revolutionize your homebrewing experience.
                </p>
              </div>
            </div>
            <div className="mx-auto max-w-4xl py-12">
              <Tabs defaultValue="dashboard" className="w-full">
                <div className="flex justify-center mb-8">
                  <TabsList>
                    <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                    <TabsTrigger value="tracking">Keg Tracking</TabsTrigger>
                    <TabsTrigger value="tasting">Tasting Notes</TabsTrigger>
                  </TabsList>
                </div>
                <TabsContent value="dashboard" className="mt-0">
                  <AppScreenshot
                    src="/placeholder.svg?height=600&width=300"
                    alt="TAPPR Dashboard"
                    title="Your Brewing Dashboard"
                    description="Get a quick overview of all your active brews, keg levels, and recent ratings."
                  />
                </TabsContent>
                <TabsContent value="tracking" className="mt-0">
                  <AppScreenshot
                    src="/placeholder.svg?height=600&width=300"
                    alt="TAPPR Keg Tracking"
                    title="Real-time Keg Monitoring"
                    description="See exactly how much beer is left in each keg and estimate when you'll need to brew again."
                  />
                </TabsContent>
                <TabsContent value="tasting" className="mt-0">
                  <AppScreenshot
                    src="/placeholder.svg?height=600&width=300"
                    alt="TAPPR Tasting Notes"
                    title="Detailed Tasting Notes"
                    description="Record and share comprehensive tasting notes with flavor profiles and ratings."
                  />
                </TabsContent>
              </Tabs>
            </div>
          </SiteContainer>
        </section>

        <section id="how-it-works" className="bg-gradient-to-b from-white to-amber-50 py-12 md:py-24 lg:py-32">
          <SiteContainer>
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-amber-100 px-3 py-1 text-sm">How It Works</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-patua">
                  Simple Setup, Powerful Results
                </h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400 font-montserrat">
                  Get started with TAPPR in just a few simple steps.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 py-12 md:grid-cols-3">
              <div className="flex flex-col items-center space-y-2 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
                  <span className="text-2xl font-bold text-amber-600">1</span>
                </div>
                <h3 className="text-xl font-bold font-patua">Connect Your Scale</h3>
                <p className="text-gray-500 dark:text-gray-400 font-montserrat">
                  Pair your Bluetooth scale with TAPPR or set up custom serving sizes.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
                  <span className="text-2xl font-bold text-amber-600">2</span>
                </div>
                <h3 className="text-xl font-bold font-patua">Import Your Brews</h3>
                <p className="text-gray-500 dark:text-gray-400 font-montserrat">
                  Connect to Brewfather or manually add your brew details and recipes.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
                  <span className="text-2xl font-bold text-amber-600">3</span>
                </div>
                <h3 className="text-xl font-bold font-patua">Track & Share</h3>
                <p className="text-gray-500 dark:text-gray-400 font-montserrat">
                  Monitor your kegs, add tasting notes, and invite friends to rate your brews.
                </p>
              </div>
            </div>
          </SiteContainer>
        </section>

        <section id="testimonials" className="bg-amber-50 py-12 md:py-24 lg:py-32">
          <SiteContainer>
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-amber-100 px-3 py-1 text-sm">Testimonials</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-patua">
                  What Our Beta Testers Say
                </h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400 font-montserrat">
                  Hear from homebrewers who've already experienced the TAPPR difference.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
              <Testimonial
                quote="TAPPR has completely changed how I manage my homebrew. No more guessing how much beer is left!"
                author="Mike Johnson"
                role="Homebrewer for 8 years"
                avatarSrc="/placeholder.svg?height=80&width=80"
              />
              <Testimonial
                quote="The Brewfather integration is seamless. All my recipes and brew data sync perfectly."
                author="Sarah Miller"
                role="Craft Beer Enthusiast"
                avatarSrc="/placeholder.svg?height=80&width=80"
              />
              <Testimonial
                quote="My friends love rating my beers in the app. It's turned brewing into a fun, social experience."
                author="David Chen"
                role="Home Brewing Club President"
                avatarSrc="/placeholder.svg?height=80&width=80"
              />
            </div>
          </SiteContainer>
        </section>

        <section id="cta" className="py-12 md:py-24 lg:py-32 bg-amber-600">
          <SiteContainer>
            <div className="flex flex-col items-center justify-center space-y-4 text-center text-white">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-patua">
                  Be the First to Experience TAPPR
                </h2>
                <p className="max-w-[900px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed font-montserrat">
                  Join our waitlist to get early access and exclusive updates about our launch.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <form className="flex flex-col gap-2 sm:flex-row">
                  <Input
                    className="max-w-lg flex-1 bg-white text-black"
                    placeholder="Enter your email"
                    type="email"
                    required
                  />
                  <Button type="submit" className="bg-white text-amber-600 hover:bg-amber-50">
                    Join Waitlist
                  </Button>
                </form>
                <p className="text-xs text-amber-100 font-montserrat">
                  We respect your privacy. Unsubscribe at any time.
                </p>
              </div>
            </div>
          </SiteContainer>
        </section>

        <section className="py-12 md:py-24 lg:py-32">
          <SiteContainer>
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-amber-100 px-3 py-1 text-sm">Coming Soon</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-patua">Download TAPPR</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400 font-montserrat">
                  TAPPR will be available on iOS and Android soon. Join our waitlist to be notified when we launch.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button variant="outline" className="flex items-center gap-2" disabled>
                  <Image src="/placeholder.svg?height=24&width=24" width={24} height={24} alt="Apple logo" />
                  App Store
                </Button>
                <Button variant="outline" className="flex items-center gap-2" disabled>
                  <Image src="/placeholder.svg?height=24&width=24" width={24} height={24} alt="Google Play logo" />
                  Google Play
                </Button>
              </div>
            </div>
          </SiteContainer>
        </section>
      </main>
      <footer className="border-t bg-background">
        <SiteContainer>
          <div className="flex flex-col gap-6 py-8 md:flex-row md:items-center md:justify-between md:py-12">
            <div className="flex items-center gap-2">
              <Beer className="h-6 w-6 text-amber-600 transform rotate-15" />
              <span className="text-xl font-bold tracking-tight font-patua">TAPPR</span>
            </div>
            <nav className="flex gap-4 sm:gap-6">
              <Link href="#" className="text-sm font-medium hover:underline underline-offset-4">
                Privacy Policy
              </Link>
              <Link href="#" className="text-sm font-medium hover:underline underline-offset-4">
                Terms of Service
              </Link>
              <Link href="#" className="text-sm font-medium hover:underline underline-offset-4">
                Contact
              </Link>
            </nav>
            <div className="flex items-center gap-4">
              <p className="text-sm text-gray-500 dark:text-gray-400 font-montserrat">
                © 2024 TAPPR. All rights reserved.
              </p>
            </div>
          </div>
        </SiteContainer>
      </footer>
    </div>
  )
}
