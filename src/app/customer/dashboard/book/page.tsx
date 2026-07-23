import { BookingForm } from "@/components/booking/BookingForm";

export default function BookingPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Book a Pickup</h1>
        <p className="text-muted-foreground">Follow the steps to safely dispose of your e-waste.</p>
      </div>
      <BookingForm />
    </div>
  );
}
