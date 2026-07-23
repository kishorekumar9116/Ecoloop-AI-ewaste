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
        <section className="relative overflow-hidden bg-gradient-to-br from-green-50 via-emerald-100 to-teal-50 dark:from-green-950/40 dark:via-emerald-950/20 dark:to-teal-950/30 pt-20 md:pt-32 lg:pt-40 pb-20">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-green-400/20 dark:bg-green-500/10 blur-[120px] rounded-full pointer-events-none"></div>
          <div className="container px-4 md:px-6 mx-auto relative z-10">
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-16 items-center">
              <div className="flex flex-col justify-center space-y-6">
                <div className="inline-flex items-center rounded-full border border-green-300/50 bg-white/60 backdrop-blur-sm px-4 py-1.5 text-sm font-medium text-green-800 dark:border-green-700/50 dark:bg-green-900/40 dark:text-green-300 w-fit mb-2 shadow-sm transition-transform hover:scale-105 cursor-default">
                  <span className="flex h-2.5 w-2.5 rounded-full bg-green-500 mr-2 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
                  Next-Gen AI E-Waste Management
                </div>
                <div className="space-y-4">
                  <h1 className="text-5xl font-black tracking-tight sm:text-6xl xl:text-7xl/none text-slate-900 dark:text-white leading-[1.1]">
                    Recycle Smart. <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-400 dark:from-green-400 dark:to-emerald-300">
                      Save the Planet.
                    </span>
                  </h1>
                  <p className="max-w-[600px] text-lg text-slate-600 dark:text-slate-300 md:text-xl/relaxed font-medium">
                    EcoLoop AI connects you with certified recyclers. Schedule a pickup, track your e-waste in real-time, and earn premium rewards for environmentally responsible disposal.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Link href="/register">
                    <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white shadow-lg hover:shadow-xl hover:shadow-green-500/20 transition-all duration-300 gap-2 h-12 px-8 text-base rounded-full">
                      Schedule Pickup <ArrowRight className="h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href="/track">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto border-green-200 hover:bg-green-50/80 dark:border-green-800/50 dark:hover:bg-green-900/30 transition-all duration-300 h-12 px-8 text-base rounded-full backdrop-blur-sm bg-white/50 dark:bg-slate-900/50">
                      Track Your E-Waste
                    </Button>
                  </Link>
                </div>
                <div className="flex items-center gap-4 pt-8 text-sm text-slate-600 dark:text-slate-400">
                  <div className="flex -space-x-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="inline-block h-10 w-10 rounded-full ring-4 ring-white dark:ring-slate-950 bg-gradient-to-br from-slate-200 to-slate-300 shadow-sm" />
                    ))}
                  </div>
                  <p className="font-medium">Join <span className="font-bold text-slate-900 dark:text-white">10,000+</span> users recycling responsibly.</p>
                </div>
              </div>
              <div className="mx-auto flex w-full max-w-[500px] items-center justify-center lg:max-w-none relative">
                {/* Abstract visualization replacing image for now */}
                <div className="relative w-full aspect-square rounded-[3rem] bg-gradient-to-tr from-green-100/80 via-emerald-50/80 to-teal-50/80 dark:from-green-900/20 dark:via-emerald-900/10 dark:to-teal-900/20 flex items-center justify-center overflow-hidden border border-white/50 dark:border-white/10 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] backdrop-blur-xl group">
                   <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30 mix-blend-overlay"></div>
                   <div className="absolute inset-0 bg-gradient-to-tr from-green-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                   <div className="relative z-10 grid grid-cols-2 gap-6 p-8 w-full max-w-md">
                      <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-6 rounded-3xl shadow-xl border border-white/20 dark:border-slate-700/50 transform -translate-y-4 transition-all duration-500 hover:-translate-y-8 hover:shadow-2xl hover:shadow-blue-500/10">
                        <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center mb-4">
                          <Cpu className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <p className="font-bold text-slate-900 dark:text-white">Smartphones</p>
                        <p className="text-xs text-slate-500 mt-1">AI Identified</p>
                      </div>
                      <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-6 rounded-3xl shadow-xl border border-white/20 dark:border-slate-700/50 transform translate-y-8 transition-all duration-500 hover:translate-y-4 hover:shadow-2xl hover:shadow-green-500/10">
                        <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center mb-4">
                          <Recycle className="h-6 w-6 text-green-600 dark:text-green-400" />
                        </div>
                        <p className="font-bold text-slate-900 dark:text-white">EcoPoints</p>
                        <p className="text-xs text-slate-500 mt-1">Earn rewards</p>
                      </div>
                      <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-6 rounded-3xl shadow-xl border border-white/20 dark:border-slate-700/50 transform -translate-x-2 transition-all duration-500 hover:-translate-x-6 hover:shadow-2xl hover:shadow-orange-500/10">
                        <div className="h-12 w-12 rounded-full bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center mb-4">
                          <Truck className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                        </div>
                        <p className="font-bold text-slate-900 dark:text-white">Fast Pickup</p>
                        <p className="text-xs text-slate-500 mt-1">Same-day logic</p>
                      </div>
                      <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-6 rounded-3xl shadow-xl border border-white/20 dark:border-slate-700/50 transform translate-x-2 translate-y-4 transition-all duration-500 hover:translate-x-6 hover:-translate-y-0 hover:shadow-2xl hover:shadow-purple-500/10">
                        <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center mb-4">
                          <ShieldCheck className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                        </div>
                        <p className="font-bold text-slate-900 dark:text-white">Secure Data</p>
                        <p className="text-xs text-slate-500 mt-1">100% Wiped</p>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="how-it-works" className="py-20 md:py-32 bg-white dark:bg-slate-950 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-40 -mt-40 w-96 h-96 rounded-full bg-green-50 dark:bg-green-900/10 blur-3xl pointer-events-none"></div>
          <div className="container px-4 md:px-6 mx-auto relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl text-slate-900 dark:text-white mb-6">How EcoLoop AI Works</h2>
              <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
                A seamless end-to-end platform connecting households and businesses with certified e-waste recyclers.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 lg:gap-12 relative">
              <div className="hidden md:block absolute top-1/2 left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-green-100 via-green-400 to-green-100 dark:from-green-900 dark:via-green-600 dark:to-green-900 -z-10 transform -translate-y-1/2"></div>
              
              <div className="group flex flex-col items-center text-center p-8 bg-white dark:bg-slate-900 rounded-[2rem] shadow-lg hover:shadow-2xl hover:shadow-green-500/10 border border-slate-100 dark:border-slate-800 transition-all duration-300 transform hover:-translate-y-2">
                <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-green-100 to-emerald-50 dark:from-green-900/50 dark:to-emerald-900/30 flex items-center justify-center mb-8 ring-8 ring-white dark:ring-slate-950 group-hover:scale-110 transition-transform duration-300 shadow-inner">
                  <span className="text-3xl font-black text-green-600 dark:text-green-400">1</span>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">AI Identification</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  Upload a photo of your e-waste. Our AI categorizes the device and estimates its recyclability and hazards instantly.
                </p>
              </div>

              <div className="group flex flex-col items-center text-center p-8 bg-white dark:bg-slate-900 rounded-[2rem] shadow-lg hover:shadow-2xl hover:shadow-emerald-500/10 border border-slate-100 dark:border-slate-800 transition-all duration-300 transform hover:-translate-y-2">
                <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-50 dark:from-emerald-900/50 dark:to-teal-900/30 flex items-center justify-center mb-8 ring-8 ring-white dark:ring-slate-950 group-hover:scale-110 transition-transform duration-300 shadow-inner">
                  <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">2</span>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Smart Pickup</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  Schedule a pickup at your convenience. Our optimized logistics network assigns the nearest certified eco-collector.
                </p>
              </div>

              <div className="group flex flex-col items-center text-center p-8 bg-white dark:bg-slate-900 rounded-[2rem] shadow-lg hover:shadow-2xl hover:shadow-teal-500/10 border border-slate-100 dark:border-slate-800 transition-all duration-300 transform hover:-translate-y-2">
                <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-teal-100 to-cyan-50 dark:from-teal-900/50 dark:to-cyan-900/30 flex items-center justify-center mb-8 ring-8 ring-white dark:ring-slate-950 group-hover:scale-110 transition-transform duration-300 shadow-inner">
                  <span className="text-3xl font-black text-teal-600 dark:text-teal-400">3</span>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Track & Earn</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
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
