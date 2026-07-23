/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Check, ChevronRight, UploadCloud, MapPin, Calendar, Smartphone, Laptop, Tv, Monitor, Battery, Cpu, Box } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const CATEGORIES = [
  { id: "cm0q9v1xa0001", name: "Smartphones", icon: Smartphone },
  { id: "cm0q9v1xa0002", name: "Laptops & Computers", icon: Laptop },
  { id: "cm0q9v1xa0003", name: "Televisions", icon: Tv },
  { id: "cm0q9v1xa0004", name: "Monitors", icon: Monitor },
  { id: "cm0q9v1xa0005", name: "Batteries", icon: Battery },
  { id: "cm0q9v1xa0006", name: "PCBs & Components", icon: Cpu },
  { id: "cm0q9v1xa0007", name: "Other Electronics", icon: Box },
];

export function BookingForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form State
  const [categoryId, setCategoryId] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [weight, setWeight] = useState("");
  const [imageUploaded, setImageUploaded] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);
  const [address, setAddress] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // We need to compress/resize the image if it's too large, but for now just read as base64
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      
      toast.info("Analyzing image using Google Gemini AI...");
      try {
        const res = await fetch("/api/ai/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageBase64: base64 })
        });

        if (res.ok) {
          const data = await res.json();
          setAiResult(data);
          setImageUploaded(true);
          
          // Try to match the category based on string includes
          const foundCategory = CATEGORIES.find(c => 
            data.category.toLowerCase().includes(c.name.toLowerCase()) ||
            c.name.toLowerCase().includes(data.category.toLowerCase().split(" ")[0])
          );
          if (foundCategory) {
            setCategoryId(foundCategory.id);
          }
          
          toast.success("AI Analysis Complete!");
        } else {
          const errData = await res.json();
          toast.error(errData.message || "Failed to analyze image");
        }
      } catch (error) {
        toast.error("Network error during AI analysis");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/pickups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          categoryId,
          quantity: parseInt(quantity),
          estimatedWeight: parseFloat(weight),
          address,
          scheduledDate: new Date(date).toISOString(),
          scheduledTime: time,
          images: "user-uploaded-image" // In a real app we'd upload to S3/Cloudinary and store the URL
        })
      });

      if (res.ok) {
        toast.success("Pickup request submitted successfully!");
        router.push("/customer/dashboard/pickups");
      } else {
        toast.error("Failed to schedule pickup");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-xl shadow-green-500/5 rounded-3xl border-slate-200/60 dark:border-slate-800/60">
      <CardHeader className="bg-slate-50/50 dark:bg-slate-900/20 rounded-t-3xl pb-8 border-b border-slate-100 dark:border-slate-800/50">
        <div className="flex items-center justify-between mb-8 relative px-4">
          <div className="absolute top-1/2 left-8 right-8 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full -z-10 -translate-y-1/2"></div>
          <div className="absolute top-1/2 left-8 h-1.5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full -z-10 -translate-y-1/2 transition-all duration-500 ease-in-out" style={{ width: `calc(${((step - 1) / 3) * 100}% - 4rem)` }}></div>
          
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300 ${
              step > i 
                ? "bg-green-500 border-green-500 text-white shadow-lg shadow-green-500/30 scale-105" 
                : step === i
                  ? "bg-white dark:bg-slate-950 border-green-500 text-green-600 dark:text-green-400 ring-4 ring-green-50 dark:ring-green-900/30 scale-110"
                  : "bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-700 text-slate-400"
            }`}>
              {step > i ? <Check className="h-5 w-5" /> : i}
            </div>
          ))}
        </div>
        <CardTitle className="text-3xl text-center font-bold tracking-tight">Schedule E-Waste Pickup</CardTitle>
        <CardDescription className="text-center text-base">
          {step === 1 && "Select the type of electronic waste."}
          {step === 2 && "Provide details and upload images for AI analysis."}
          {step === 3 && "Where and when should we pick this up?"}
          {step === 4 && "Review your pickup details."}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="min-h-[300px]">
        {step === 1 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {CATEGORIES.map((cat) => (
              <div 
                key={cat.id} 
                onClick={() => setCategoryId(cat.id)}
                className={`p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 flex flex-col items-center justify-center text-center gap-4 hover:shadow-lg ${
                  categoryId === cat.id 
                    ? "border-green-500 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 shadow-md transform -translate-y-1" 
                    : "border-slate-100 hover:border-green-300 dark:border-slate-800 bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-900"
                }`}
              >
                <cat.icon className={`h-10 w-10 ${categoryId === cat.id ? "animate-bounce" : "text-slate-500 dark:text-slate-400"}`} />
                <span className="text-sm font-semibold">{cat.name}</span>
              </div>
            ))}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Estimated Quantity</Label>
                <Input type="number" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Estimated Total Weight (kg)</Label>
                <Input type="number" min="0.1" step="0.1" value={weight} onChange={(e) => setWeight(e.target.value)} />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Upload Image for AI Analysis</Label>
              {!imageUploaded ? (
                <label className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-12 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900/50 hover:border-green-400 transition-all duration-300 group">
                  <div className="h-16 w-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 group-hover:bg-green-100 dark:group-hover:bg-green-900/50 transition-colors duration-300">
                    <UploadCloud className="h-8 w-8 text-slate-500 group-hover:text-green-600 dark:group-hover:text-green-400" />
                  </div>
                  <p className="font-semibold text-lg">Click to upload or drag and drop</p>
                  <p className="text-sm text-slate-500 mt-2 max-w-sm">Gemini AI will automatically categorize your item and detect hazards.</p>
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </label>
              ) : (
                <div className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 p-4 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3 text-green-800 dark:text-green-300 font-medium mb-4">
                      <Check className="h-5 w-5" /> AI Analysis Complete
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setImageUploaded(false)}>Retake</Button>
                  </div>
                  {aiResult && (
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div><span className="text-slate-500">Detected Category:</span> <br/>{aiResult.category}</div>
                      <div><span className="text-slate-500">Condition:</span> <br/>{aiResult.condition}</div>
                      <div><span className="text-slate-500">Recyclability:</span> <br/>{aiResult.recyclability}</div>
                      <div><span className="text-slate-500 text-orange-500">Hazard Warning:</span> <br/>{aiResult.hazardous}</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Pickup Address</Label>
              <Textarea 
                placeholder="123 Main St, Apartment 4B, City, State, ZIP" 
                value={address} 
                onChange={(e) => setAddress(e.target.value)}
                className="resize-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Preferred Date</Label>
                <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Preferred Time Slot</Label>
                <Select value={time} onValueChange={(val) => setTime(val || "")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Morning (9 AM - 12 PM)">Morning (9 AM - 12 PM)</SelectItem>
                    <SelectItem value="Afternoon (12 PM - 4 PM)">Afternoon (12 PM - 4 PM)</SelectItem>
                    <SelectItem value="Evening (4 PM - 7 PM)">Evening (4 PM - 7 PM)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900/50 dark:to-slate-900 p-8 space-y-6 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                <Box className="w-40 h-40" />
              </div>
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Box className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="font-semibold text-lg text-slate-900 dark:text-white">Items to Recycle</p>
                  <p className="text-slate-600 dark:text-slate-400 mt-1">
                    {quantity}x <span className="font-medium">{CATEGORIES.find(c => c.id === categoryId)?.name}</span> (~{weight} kg)
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 bg-orange-100 dark:bg-orange-900/50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="font-semibold text-lg text-slate-900 dark:text-white">Pickup Location</p>
                  <p className="text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">{address}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 bg-green-100 dark:bg-green-900/50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Calendar className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="font-semibold text-lg text-slate-900 dark:text-white">Schedule</p>
                  <p className="text-slate-600 dark:text-slate-400 mt-1">{date} <span className="mx-2">•</span> {time}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between border-t border-slate-100 dark:border-slate-800 p-6 bg-slate-50/80 dark:bg-slate-900/30 rounded-b-3xl">
        <Button 
          variant="outline" 
          onClick={() => setStep(step - 1)} 
          disabled={step === 1 || isSubmitting}
          className="rounded-xl px-6 h-12"
        >
          Back
        </Button>
        {step < 4 ? (
          <Button 
            onClick={() => setStep(step + 1)} 
            disabled={
              (step === 1 && !categoryId) ||
              (step === 2 && (!quantity || !weight || !imageUploaded)) ||
              (step === 3 && (!address || !date || !time))
            }
            className="rounded-xl px-6 h-12 bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
          >
            Continue <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={isSubmitting} className="rounded-xl px-8 h-12 bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white shadow-lg shadow-green-500/20 text-base font-semibold transition-all duration-300">
            {isSubmitting ? "Confirming..." : "Confirm Booking"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
