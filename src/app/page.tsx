import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ArrowRight, BarChart3, Cpu, Globe2, Recycle, ShieldCheck, Truck } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-green-50 to-white dark:from-green-950/20 dark:to-background pt-16 md:pt-24 lg:pt-32 pb-16">
          <div className="container px-4 md:px-6 mx-auto relative z-10">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="flex flex-col justify-center space-y-4">
                <div className="inline-flex items-center rounded-full border border-green-200 bg-green-50 px-3 py-1 text-sm text-green-800 dark:border-green-800/30 dark:bg-green-900/30 dark:text-green-300 w-fit mb-4">
                  <span className="flex h-2 w-2 rounded-full bg-green-600 mr-2 animate-pulse"></span>
                  AI-Powered E-Waste Management
                </div>
                <div className="space-y-2">
                  <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl xl:text-6xl/none text-slate-900 dark:text-white">
                    Recycle Smart. <br />
                    <span className="text-green-600 dark:text-green-400">Save the Planet.</span>
                  </h1>
                  <p className="max-w-[600px] text-lg text-slate-600 dark:text-slate-300 md:text-xl leading-relaxed">
                    EcoLoop AI connects you with certified recyclers. Schedule a pickup, track your e-waste in real-time, and earn rewards for environmentally responsible disposal.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Link href="/register">
                    <Button size="lg" className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white gap-2">
                      Schedule Pickup <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/track">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto border-green-200 hover:bg-green-50 dark:border-green-800/50 dark:hover:bg-green-900/20">
                      Track Your E-Waste
                    </Button>
                  </Link>
                </div>
                <div className="flex items-center gap-4 pt-6 text-sm text-slate-500">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-background bg-slate-200" />
                    ))}
                  </div>
                  <p>Join <span className="font-semibold text-slate-700 dark:text-slate-300">10,000+</span> users recycling responsibly.</p>
                </div>
              </div>
              <div className="mx-auto flex w-full max-w-[500px] items-center justify-center lg:max-w-none relative">
                {/* Abstract visualization replacing image for now */}
                <div className="relative w-full aspect-square rounded-full bg-gradient-to-tr from-green-100 to-green-50 dark:from-green-900/20 dark:to-green-900/5 flex items-center justify-center overflow-hidden border border-green-200/50 dark:border-green-800/20 shadow-2xl">
                   <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                   <div className="relative z-10 grid grid-cols-2 gap-4 p-8 w-full max-w-sm">
                      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm p-4 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-800 transform -translate-y-4 transition-transform hover:-translate-y-6">
                        <Cpu className="h-8 w-8 text-blue-500 mb-2" />
                        <p className="font-medium text-sm">Smartphones</p>
                      </div>
                      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm p-4 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-800 transform translate-y-8 transition-transform hover:translate-y-6">
                        <Recycle className="h-8 w-8 text-green-500 mb-2" />
                        <p className="font-medium text-sm">EcoPoints</p>
                      </div>
                      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm p-4 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-800 transform -translate-x-2 transition-transform hover:-translate-x-4">
                        <Truck className="h-8 w-8 text-orange-500 mb-2" />
                        <p className="font-medium text-sm">Fast Pickup</p>
                      </div>
                      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm p-4 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-800 transform translate-x-2 translate-y-4 transition-transform hover:translate-x-4">
                        <ShieldCheck className="h-8 w-8 text-purple-500 mb-2" />
                        <p className="font-medium text-sm">Secure Data</p>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="how-it-works" className="py-16 md:py-24 bg-white dark:bg-slate-950">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-slate-900 dark:text-white mb-4">How EcoLoop AI Works</h2>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                A seamless end-to-end platform connecting households and businesses with certified e-waste recyclers.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 relative">
              <div className="hidden md:block absolute top-1/2 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-green-100 via-green-300 to-green-100 dark:from-green-900 dark:via-green-700 dark:to-green-900 -z-10 transform -translate-y-1/2"></div>
              
              <div className="flex flex-col items-center text-center p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center mb-6 ring-8 ring-white dark:ring-slate-950">
                  <span className="text-2xl font-bold text-green-600 dark:text-green-400">1</span>
                </div>
                <h3 className="text-xl font-bold mb-3">AI Identification</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Upload a photo of your e-waste. Our AI categorizes the device and estimates its recyclability and hazards.
                </p>
              </div>

              <div className="flex flex-col items-center text-center p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center mb-6 ring-8 ring-white dark:ring-slate-950">
                  <span className="text-2xl font-bold text-green-600 dark:text-green-400">2</span>
                </div>
                <h3 className="text-xl font-bold mb-3">Smart Pickup</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Schedule a pickup at your convenience. Our optimized logistics network assigns the nearest certified collector.
                </p>
              </div>

              <div className="flex flex-col items-center text-center p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center mb-6 ring-8 ring-white dark:ring-slate-950">
                  <span className="text-2xl font-bold text-green-600 dark:text-green-400">3</span>
                </div>
                <h3 className="text-xl font-bold mb-3">Track & Earn</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Track your waste to the recycling facility using QR codes. Earn EcoPoints and a digital recycling certificate.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section id="impact" className="py-16 md:py-24 bg-slate-50 dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="flex justify-center mb-4"><Globe2 className="h-10 w-10 text-green-600" /></div>
                <h4 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-2">50k+</h4>
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Devices Saved</p>
              </div>
              <div>
                <div className="flex justify-center mb-4"><BarChart3 className="h-10 w-10 text-green-600" /></div>
                <h4 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-2">120</h4>
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Tons Recycled</p>
              </div>
              <div>
                <div className="flex justify-center mb-4"><ShieldCheck className="h-10 w-10 text-green-600" /></div>
                <h4 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-2">45</h4>
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Certified Partners</p>
              </div>
              <div>
                <div className="flex justify-center mb-4"><Recycle className="h-10 w-10 text-green-600" /></div>
                <h4 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-2">10M</h4>
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">EcoPoints Awarded</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 relative overflow-hidden bg-green-600">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-green-700 to-green-500"></div>
          <div className="container px-4 md:px-6 mx-auto relative z-10 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-5xl text-white mb-6">
              Ready to make an impact?
            </h2>
            <p className="max-w-2xl mx-auto text-green-100 text-lg mb-10">
              Join thousands of households and businesses that are already contributing to the circular economy.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto font-semibold text-green-700 hover:text-green-800">
                  Create an Account
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" className="w-full sm:w-auto bg-transparent border-white text-white hover:bg-white/10 shadow-none border">
                  Contact Sales (Corporate)
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
