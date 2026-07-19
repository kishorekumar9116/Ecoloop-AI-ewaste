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
        toast.success("Pickup scheduled successfully!");
        router.push("/dashboard/pickups");
        router.refresh();
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
    <Card className="w-full max-w-3xl mx-auto shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between mb-8 relative">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-100 -z-10 -translate-y-1/2"></div>
          <div className="absolute top-1/2 left-0 h-1 bg-green-500 -z-10 -translate-y-1/2 transition-all duration-300" style={{ width: `${((step - 1) / 3) * 100}%` }}></div>
          
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium border-2 ${
              step >= i 
                ? "bg-green-600 border-green-600 text-white" 
                : "bg-white border-slate-200 text-slate-400"
            }`}>
              {step > i ? <Check className="h-4 w-4" /> : i}
            </div>
          ))}
        </div>
        <CardTitle>Schedule E-Waste Pickup</CardTitle>
        <CardDescription>
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
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col items-center justify-center text-center gap-3 ${
                  categoryId === cat.id 
                    ? "border-green-600 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400" 
                    : "border-slate-200 hover:border-green-300 dark:border-slate-800"
                }`}
              >
                <cat.icon className="h-8 w-8" />
                <span className="text-sm font-medium">{cat.name}</span>
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
                <label className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-10 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                  <UploadCloud className="h-10 w-10 text-slate-400 mb-4" />
                  <p className="font-medium">Click to upload or drag and drop</p>
                  <p className="text-sm text-slate-500 mt-1">Gemini AI will automatically categorize your item and detect hazards.</p>
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
            <div className="rounded-lg border bg-slate-50 dark:bg-slate-900/50 p-6 space-y-4">
              <div className="flex items-start gap-3">
                <Box className="h-5 w-5 text-slate-500 mt-0.5" />
                <div>
                  <p className="font-medium">Items to Recycle</p>
                  <p className="text-sm text-slate-500">
                    {quantity}x {CATEGORIES.find(c => c.id === categoryId)?.name} (~{weight} kg)
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-slate-500 mt-0.5" />
                <div>
                  <p className="font-medium">Pickup Location</p>
                  <p className="text-sm text-slate-500">{address}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-slate-500 mt-0.5" />
                <div>
                  <p className="font-medium">Schedule</p>
                  <p className="text-sm text-slate-500">{date} • {time}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between border-t p-6 bg-slate-50/50 dark:bg-slate-900/20 rounded-b-xl">
        <Button 
          variant="outline" 
          onClick={() => setStep(step - 1)} 
          disabled={step === 1 || isSubmitting}
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
          >
            Continue <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-green-600 hover:bg-green-700">
            {isSubmitting ? "Confirming..." : "Confirm Booking"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
