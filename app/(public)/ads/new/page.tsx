// "use client";

// import { useState, FormEvent } from "react";
// import { useRouter } from "next/navigation";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Button } from "@/components/ui/button";
// import { toast } from "sonner";
// import { FaTelegramPlane, FaYoutube, FaTiktok } from "react-icons/fa";
// /* eslint-disable @typescript-eslint/no-explicit-any */

// // Define the steps for our form
// const steps = [
//   { id: 1, name: "Platform" },
//   { id: 2, name: "Details" },
//   { id: 3, name: "Metrics" },
// ];

// export default function NewAdPage() {
//   const router = useRouter();
//   const [currentStep, setCurrentStep] = useState(1);
//   const [formData, setFormData] = useState({
//     platform: "telegram",
//     title: "",
//     description: "",
//     link: "",
//     category: "",
//     ad_type: "channel",
//     members: "",
//     price: "",
//     openedIn: "",
//   });
//   const [error, setError] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handlePlatformChange = (value: "telegram" | "tiktok" | "youtube") => {
//     // Also adjust ad_type based on platform for better UX
//     const newAdType = value === 'telegram' ? 'channel' : 'account';
//     setFormData((prev) => ({ ...prev, platform: value, ad_type: newAdType }));
//   };
  
//   const handleAdTypeChange = (value: "channel" | "group") => {
//     setFormData((prev) => ({ ...prev, ad_type: value }));
//   };

//   const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, steps.length));
//   const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault();
//     if (currentStep !== steps.length) {
//       nextStep();
//       return;
//     }
    
//     setIsSubmitting(true);
//     setError("");
//     try {
//       const res = await fetch("/api/ads", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           ...formData,
//           price: Number(formData.price),
//           members: Number(formData.members),
//           openedIn: Number(formData.openedIn),
//         }),
//       });
//       if (!res.ok) {
//         const errorData = await res.json();
//         throw new Error(errorData.message || "Failed to create ad.");
//       }
//       toast.success("Ad created successfully! Redirecting...");
//       router.push("/ads");
//     } catch (err: any) {
//       toast.error(err.message);
//       setError(err.message);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };
  
//   const inputStyles = "w-full px-4 py-3 bg-slate-700 text-slate-200 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-400";
//   const labelStyles = "block font-medium mb-2 text-slate-300";

//   return (
//     <div className="container mx-auto max-w-2xl p-4 md:p-6">
//       <h1 className="text-3xl font-bold mb-2 text-white">Create a New Listing</h1>
//       <p className="text-muted-foreground mb-6">Step {currentStep} of {steps.length}: {steps[currentStep - 1].name}</p>

//       <form onSubmit={handleSubmit} className="space-y-8 bg-slate-800 p-8 rounded-xl border border-slate-700">
//         {/* Step 1: Platform Selection */}
//         {currentStep === 1 && (
//           <div>
//             <Label className={`${labelStyles} text-lg`}>Which platform is your account on?</Label>
//             <RadioGroup defaultValue="telegram" value={formData.platform} onValueChange={handlePlatformChange} className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
//               <Label className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary">
//                 <RadioGroupItem value="telegram" id="telegram" className="sr-only" />
//                 <FaTelegramPlane className="mb-3 h-8 w-8 text-[#2AABEE]" /> Telegram
//               </Label>
//               <Label className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary">
//                 <RadioGroupItem value="tiktok" id="tiktok" className="sr-only" />
//                 <FaTiktok className="mb-3 h-8 w-8" /> TikTok
//               </Label>
//               <Label className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary">
//                 <RadioGroupItem value="youtube" id="youtube" className="sr-only" />
//                 <FaYoutube className="mb-3 h-8 w-8 text-[#FF0000]" /> YouTube
//               </Label>
//             </RadioGroup>
//           </div>
//         )}

//         {/* Step 2: Details */}
//         {currentStep === 2 && (
//           <div className="space-y-6">
//             {formData.platform === 'telegram' && (
//               <div>
//                 <Label className={labelStyles}>Type</Label>
//                 <RadioGroup defaultValue="channel" value={formData.ad_type} onValueChange={handleAdTypeChange} className="flex space-x-4">
//                   <div className="flex items-center space-x-2"><RadioGroupItem value="channel" id="channel" /><Label htmlFor="channel">Channel</Label></div>
//                   <div className="flex items-center space-x-2"><RadioGroupItem value="group" id="group" /><Label htmlFor="group">Group</Label></div>
//                 </RadioGroup>
//               </div>
//             )}
//             <div><Label htmlFor="title" className={labelStyles}>Title</Label><Input id="title" name="title" value={formData.title} onChange={handleInputChange} required className={inputStyles} /></div>
//             <div><Label htmlFor="description" className={labelStyles}>Description</Label><Textarea id="description" name="description" value={formData.description} onChange={handleInputChange} required className={inputStyles} /></div>
//             <div><Label htmlFor="category" className={labelStyles}>Category</Label><Input id="category" name="category" value={formData.category} onChange={handleInputChange} required className={inputStyles} /></div>
//             <div><Label htmlFor="link" className={labelStyles}>Link</Label><Input id="link" name="link" type="url" value={formData.link} onChange={handleInputChange} required className={inputStyles} /></div>
//           </div>
//         )}

//         {/* Step 3: Metrics */}
//         {currentStep === 3 && (
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             <div><Label htmlFor="members" className={labelStyles}>Subscribers / Followers</Label><Input id="members" name="members" type="number" value={formData.members} onChange={handleInputChange} required className={inputStyles} /></div>
//             <div><Label htmlFor="price" className={labelStyles}>Price ($)</Label><Input id="price" name="price" type="number" value={formData.price} onChange={handleInputChange} required className={inputStyles} /></div>
//             <div><Label htmlFor="openedIn" className={labelStyles}>Year Created</Label><Input id="openedIn" name="openedIn" type="number" value={formData.openedIn} onChange={handleInputChange} required className={inputStyles} /></div>
//           </div>
//         )}

//         {/* Navigation */}
//         <div className="mt-8 pt-5 flex justify-between border-t border-slate-700">
//           {currentStep > 1 && <Button type="button" variant="outline" onClick={prevStep}>Back</Button>}
//           <div /> {/* Spacer */}
//           <Button type="submit" disabled={isSubmitting}>
//             {isSubmitting ? 'Submitting...' : (currentStep === steps.length ? 'Submit Ad' : 'Next Step')}
//           </Button>
//         </div>
//       </form>
//     </div>
//   );
// }

"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { FaTelegramPlane, FaYoutube, FaTiktok } from "react-icons/fa";
import { cn } from "@/lib/utils"; // Assuming this utility is available
/* eslint-disable @typescript-eslint/no-explicit-any */

// Define the steps for our form
const steps = [
  { id: 1, name: "Platform" },
  { id: 2, name: "Details" },
  { id: 3, name: "Metrics" },
];

// --- Custom Styles ---
const inputStyles = "w-full px-4 py-3 bg-sky-950 text-slate-200 border border-sky-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 placeholder:text-slate-500 transition-all duration-200";
const labelStyles = "block font-semibold mb-2 text-slate-300 tracking-wider";

// --- Step Indicator Component ---
const StepIndicator = ({ step, currentStep }: { step: typeof steps[0], currentStep: number }) => {
  const isActive = step.id === currentStep;
  const isCompleted = step.id < currentStep;

  return (
    <div className="flex-1">
      <div className="flex flex-col items-center">
        <div className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300",
          isActive
            ? "bg-sky-500 text-white shadow-lg shadow-sky-500/40 scale-105" // Active style
            : isCompleted
              ? "bg-sky-700 text-white" // Completed style
              : "bg-sky-900 text-slate-400 border-2 border-sky-700" // Inactive style
        )}>
          {step.id}
        </div>
        <div className="text-center mt-2 text-xs font-semibold text-slate-300 hidden sm:block">
          {step.name}
        </div>
      </div>
      {step.id < steps.length && (
        <div className={cn(
          "h-0.5 w-full -mt-7 sm:-mt-6 mx-auto transition-all duration-300",
          isCompleted ? "bg-sky-500" : "bg-sky-800"
        )} />
      )}
    </div>
  );
};


export default function NewAdPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    platform: "telegram",
    title: "",
    description: "",
    link: "",
    category: "",
    ad_type: "channel",
    members: "",
    price: "",
    openedIn: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ... (all handler functions remain the same) ...
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlatformChange = (value: "telegram" | "tiktok" | "youtube") => {
    const newAdType = value === 'telegram' ? 'channel' : 'account';
    setFormData((prev) => ({ ...prev, platform: value, ad_type: newAdType }));
  };
  
  const handleAdTypeChange = (value: "channel" | "group") => {
    setFormData((prev) => ({ ...prev, ad_type: value }));
  };

  const nextStep = () => {
    // Simple client-side validation for Step 1 before proceeding
    if (currentStep === 1 && !formData.platform) {
        toast.error("Please select a platform.");
        return;
    }
    // You'd add more rigorous validation here...
    setCurrentStep((prev) => Math.min(prev + 1, steps.length));
  }
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (currentStep !== steps.length) {
      nextStep();
      return;
    }
    
    // ... (submission logic remains the same) ...
    setIsSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/ads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price),
          members: Number(formData.members),
          openedIn: Number(formData.openedIn),
        }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to create ad.");
      }
      toast.success("Ad created successfully! Redirecting...");
      router.push("/ads");
    } catch (err: any) {
      toast.error(err.message);
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="container mx-auto max-w-3xl p-4 md:p-6">
      {/* Updated Heading style */}
      <h1 className="text-3xl font-extrabold mb-8 text-white tracking-wider">Create a New Listing</h1>
      
      {/* Cool Step Indicator */}
      <div className="relative flex justify-between items-start mb-10">
        {steps.map((step) => (
          <StepIndicator key={step.id} step={step} currentStep={currentStep} />
        ))}
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-8 bg-sky-900 p-8 rounded-2xl border border-sky-700 shadow-2xl shadow-sky-950/20">

        {/* Step 1: Platform Selection */}
        {currentStep === 1 && (
          <div>
            <Label className={cn(labelStyles, "text-lg text-white")}>Select the platform:</Label>
            <RadioGroup 
              value={formData.platform} 
              onValueChange={handlePlatformChange} 
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4"
            >
              {/* --- Platform Card Component (Sleek Redesign) --- */}
              {/* Use custom Tailwind classes for the card effect */}
              {[{ value: "telegram", icon: FaTelegramPlane, color: "#2AABEE" }, { value: "tiktok", icon: FaTiktok, color: "#000000" }, { value: "youtube", icon: FaYoutube, color: "#FF0000" }].map((platform) => {
                const Icon = platform.icon;
                const isSelected = formData.platform === platform.value;
                return (
                  <Label 
                    key={platform.value} 
                    className={cn(
                      "flex flex-col items-center justify-center rounded-xl p-6 cursor-pointer border-2 transition-all duration-200",
                      "bg-sky-950 hover:bg-sky-800",
                      isSelected 
                        ? "border-sky-500 shadow-xl shadow-sky-500/20" // Active style
                        : "border-sky-800" // Inactive style
                    )}
                  >
                    <RadioGroupItem value={platform.value} id={platform.value} className="sr-only" />
                    <Icon className="mb-3 h-10 w-10" style={{ color: platform.color }} />
                    <span className="text-white font-semibold">{platform.value.charAt(0).toUpperCase() + platform.value.slice(1)}</span>
                  </Label>
                )
              })}
            </RadioGroup>
          </div>
        )}

        {/* Step 2: Details */}
        {currentStep === 2 && (
          <div className="space-y-6">
            {formData.platform === 'telegram' && (
              <div>
                <Label className={labelStyles}>Type</Label>
                {/* Updated Radio Group for Channel/Group */}
                <RadioGroup 
                  value={formData.ad_type} 
                  onValueChange={handleAdTypeChange} 
                  className="flex space-x-6 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="channel" id="channel" className="border-sky-500 data-[state=checked]:bg-sky-500 text-white" /><Label htmlFor="channel" className="text-white">Channel</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="group" id="group" className="border-sky-500 data-[state=checked]:bg-sky-500 text-white" /><Label htmlFor="group" className="text-white">Group</Label>
                  </div>
                </RadioGroup>
              </div>
            )}
            <div><Label htmlFor="title" className={labelStyles}>Title</Label><Input id="title" name="title" value={formData.title} onChange={handleInputChange} required className={inputStyles} /></div>
            <div><Label htmlFor="description" className={labelStyles}>Description</Label><Textarea id="description" name="description" value={formData.description} onChange={handleInputChange} required className={inputStyles} /></div>
            <div><Label htmlFor="category" className={labelStyles}>Category</Label><Input id="category" name="category" value={formData.category} onChange={handleInputChange} required className={inputStyles} /></div>
            <div><Label htmlFor="link" className={labelStyles}>Link to your listing</Label><Input id="link" name="link" type="url" value={formData.link} onChange={handleInputChange} required className={inputStyles} /></div>
          </div>
        )}

        {/* Step 3: Metrics */}
        {currentStep === 3 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div><Label htmlFor="members" className={labelStyles}>Subscribers / Followers</Label><Input id="members" name="members" type="number" value={formData.members} onChange={handleInputChange} required className={inputStyles} /></div>
            <div><Label htmlFor="price" className={labelStyles}>Price (USD $)</Label><Input id="price" name="price" type="number" value={formData.price} onChange={handleInputChange} required className={inputStyles} /></div>
            <div><Label htmlFor="openedIn" className={labelStyles}>Year Created</Label><Input id="openedIn" name="openedIn" type="number" value={formData.openedIn} onChange={handleInputChange} required className={inputStyles} /></div>
          </div>
        )}

        {/* Navigation */}
        <div className="mt-8 pt-6 flex justify-between border-t border-sky-700">
          {currentStep > 1 ? (
            <Button type="button" onClick={prevStep} className="px-6 py-2 bg-sky-950 text-sky-400 border border-sky-700 rounded-full hover:bg-sky-800 transition-all duration-200">
                Back
            </Button>
          ) : <div />} {/* Empty div for spacing */}

          <Button 
            type="submit" 
            disabled={isSubmitting}
            className={cn(
              "px-8 py-3 font-bold rounded-full shadow-lg transition-all duration-300 tracking-wider",
              isSubmitting 
                ? "bg-sky-700 text-slate-300" // Submitting state
                : "bg-sky-600 text-white hover:bg-sky-700 shadow-sky-500/40" // Ready state
            )}
          >
            {isSubmitting ? 'Submitting...' : (currentStep === steps.length ? 'Submit Ad' : 'Next Step')}
          </Button>
        </div>
        {error && <p className="text-red-400 text-center mt-4">{error}</p>}
      </form>
    </div>
  );
}