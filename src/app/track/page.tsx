/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, CheckCircle2, Truck, Box, Recycle, Award, MapPin } from "lucide-react";

export default function TrackPage() {
  const [trackingId, setTrackingId] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingId) return;

    setIsSearching(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch(`/api/track/${trackingId}`);
      if (res.ok) {
        const data = await res.json();
        setResult(data);
      } else {
        setError("Tracking ID not found. Please check and try again.");
      }
    } catch (error: unknown) {
      setError("An error occurred while fetching tracking details.");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <main className="flex-1 py-12 md:py-24">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Track Your E-Waste</h1>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Enter your Tracking ID to see the real-time status of your e-waste collection, sorting, and recycling journey.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border p-4 md:p-8 mb-12 max-w-2xl mx-auto">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input 
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  placeholder="e.g. ECO-2026-000001" 
                  className="pl-10 h-12 text-lg uppercase"
                />
              </div>
              <Button type="submit" size="lg" className="h-12 bg-green-600 hover:bg-green-700" disabled={isSearching}>
                {isSearching ? "Searching..." : "Track Now"}
              </Button>
            </form>
            {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
          </div>

          {result && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border overflow-hidden">
              <div className="border-b p-6 bg-slate-50 dark:bg-slate-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-500">Tracking ID</p>
                  <p className="text-xl font-bold">{result.pickupId}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                    {result.status}
                  </span>
                </div>
              </div>
              <div className="p-6 md:p-10">
                <div className="relative border-l-2 border-slate-200 dark:border-slate-800 ml-4 md:ml-6 space-y-10">
                  
                  {result.events?.map((event: any, idx: number) => {
                    const isLast = idx === result.events.length - 1;
                    return (
                      <div key={event.id} className="relative pl-8 md:pl-12">
                        <div className={`absolute -left-[21px] flex h-10 w-10 items-center justify-center rounded-full border-4 border-white dark:border-slate-900 ${isLast ? 'bg-green-600 text-white' : 'bg-slate-200 text-slate-500 dark:bg-slate-800'}`}>
                          {event.status === "REQUESTED" && <CheckCircle2 className="h-5 w-5" />}
                          {event.status === "ASSIGNED" && <Truck className="h-5 w-5" />}
                          {event.status === "COLLECTED" && <Box className="h-5 w-5" />}
                          {event.status === "RECYCLING" && <Recycle className="h-5 w-5" />}
                          {event.status === "COMPLETED" && <Award className="h-5 w-5" />}
                          {!["REQUESTED","ASSIGNED","COLLECTED","RECYCLING","COMPLETED"].includes(event.status) && <CheckCircle2 className="h-5 w-5" />}
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between mb-1">
                          <h3 className="text-lg font-bold">{event.status.replace("_", " ")}</h3>
                          <span className="text-sm text-slate-500">
                            {new Date(event.timestamp).toLocaleString()}
                          </span>
                        </div>
                        {event.notes && (
                          <p className="text-slate-600 dark:text-slate-400 mt-1">{event.notes}</p>
                        )}
                        {event.location && (
                          <div className="flex items-center gap-1 text-sm text-slate-500 mt-2">
                            <MapPin className="h-4 w-4" /> {event.location}
                          </div>
                        )}
                      </div>
                    );
                  })}
                  
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
