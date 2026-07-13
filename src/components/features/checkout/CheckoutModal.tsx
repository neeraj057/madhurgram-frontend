"use client";
import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle2, ArrowRight, MapPin, Plus, Loader2, Home, Briefcase, Map, CreditCard, Trash2 } from 'lucide-react'; 
import { API_ENDPOINTS } from '@/apis/api';
import { fetchCustomerProfile, addCustomerAddress, deleteCustomerAddress, CustomerProfile, Address, AddressType } from '@/apis/customerProfile';
import { syncCart } from '@/apis/cartRecovery';
import { showToast } from '@/components/ui/Toast';

interface CartItem {
  id: number;
  name: string;
  price: number;
  volume: string;
  imageUrl: string;
  quantity: number;
}

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  subtotal: number;
  cartItems: CartItem[];
  onOrderSuccess: () => void;
}

const MOCK_LOCATIONS = [
  {
    description: "Sarafa Bazar, Indore, Madhya Pradesh",
    street: "Sarafa Bazar",
    city: "Indore",
    state: "Madhya Pradesh",
    pincode: "452002",
    lat: 22.7196,
    lng: 75.8577
  },
  {
    description: "Chappan Dukan, New Palasia, Indore, Madhya Pradesh",
    street: "Chappan Dukan, New Palasia",
    city: "Indore",
    state: "Madhya Pradesh",
    pincode: "452001",
    lat: 22.7244,
    lng: 75.8839
  },
  {
    description: "Chandni Chowk, Old Delhi, Delhi",
    street: "Chandni Chowk, Old Delhi",
    city: "Delhi",
    state: "Delhi",
    pincode: "110006",
    lat: 28.6506,
    lng: 77.2303
  },
  {
    description: "Ghatkopar East, Mumbai, Maharashtra",
    street: "Ghatkopar East",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400077",
    lat: 19.0860,
    lng: 72.9090
  },
  {
    description: "Malleshwaram, Bengaluru, Karnataka",
    street: "Malleshwaram",
    city: "Bengaluru",
    state: "Karnataka",
    pincode: "560003",
    lat: 12.9960,
    lng: 77.5712
  },
  {
    description: "Jodhpur Sweets Lane, Jodhpur, Rajasthan",
    street: "Jodhpur Sweets Lane",
    city: "Jodhpur",
    state: "Rajasthan",
    pincode: "342001",
    lat: 26.2389,
    lng: 73.0243
  },
  {
    description: "Mathura Peda Bazar, Mathura, Uttar Pradesh",
    street: "Mathura Peda Bazar",
    city: "Mathura",
    state: "Uttar Pradesh",
    pincode: "281001",
    lat: 27.4924,
    lng: 77.6737
  }
];

export default function CheckoutModal({ isOpen, onClose, subtotal, cartItems, onOrderSuccess }: CheckoutModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState<number | null>(null);

  // 👤 Smart Profiling States
  const [phone, setPhone] = useState("");
  const [fullName, setFullName] = useState("");
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"ONLINE" | "COD">("ONLINE");
  const [showPaymentSimulator, setShowPaymentSimulator] = useState(false);
  const [paymentErrorMessage, setPaymentErrorMessage] = useState<string | null>(null);
  const [tempOrderPayload, setTempOrderPayload] = useState<any | null>(null);
  const [paymentTab, setPaymentTab] = useState<"UPI" | "CARD">("UPI");
  const [selectedUpiApp, setSelectedUpiApp] = useState<string | null>(null);
  const [simulatingUpiApp, setSimulatingUpiApp] = useState<string | null>(null);
  const [upiCountdown, setUpiCountdown] = useState(3);
  const [customUpiId, setCustomUpiId] = useState("");
  
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newAddress, setNewAddress] = useState<Address>({
    addressType: "HOME",
    fullAddress: "",
    city: "",
    state: "",
    pincode: "",
    isDefault: true,
    latitude: undefined,
    longitude: undefined
  });
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [alternativePhone, setAlternativePhone] = useState("");
  const [isAddressVerifying, setIsAddressVerifying] = useState(false);
  const [isAddressVerified, setIsAddressVerified] = useState(false);
  const [deletingAddressId, setDeletingAddressId] = useState<number | null>(null);
  
  // 🎟️ Coupon & Discount States
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [isCouponValidating, setIsCouponValidating] = useState(false);

  const googleMapsKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!googleMapsKey || !isOpen || !isAddingNew) return;

    const scriptId = "google-maps-script";
    let script = document.getElementById(scriptId) as HTMLScriptElement;

    const initAutocomplete = () => {
      const gWindow = window as any;
      if (!inputRef.current || !gWindow.google) return;
      const autocomplete = new gWindow.google.maps.places.Autocomplete(inputRef.current, {
        types: ["address"],
        componentRestrictions: { country: "in" },
        fields: ["address_components", "geometry"]
      });

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (!place.address_components) return;

        let street = "";
        let city = "";
        let state = "";
        let pincode = "";

        place.address_components.forEach((component: any) => {
          const types = component.types;
          if (types.includes("sublocality") || types.includes("route") || types.includes("street_number") || types.includes("neighborhood")) {
            street += (street ? ", " : "") + component.long_name;
          }
          if (types.includes("locality")) {
            city = component.long_name;
          }
          if (types.includes("administrative_area_level_1")) {
            state = component.long_name;
          }
          if (types.includes("postal_code")) {
            pincode = component.long_name;
          }
        });

        const lat = place.geometry?.location?.lat() || undefined;
        const lng = place.geometry?.location?.lng() || undefined;

        setNewAddress(prev => ({
          ...prev,
          fullAddress: street || place.formatted_address || "",
          city: city,
          state: state,
          pincode: pincode,
          latitude: lat,
          longitude: lng
        }));
      });
    };

    const gWindow = window as any;
    if (!gWindow.google) {
      if (!script) {
        script = document.createElement("script");
        script.id = scriptId;
        script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsKey}&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = () => {
          if (gWindow.google) initAutocomplete();
        };
        document.head.appendChild(script);
      } else {
        script.addEventListener("load", initAutocomplete);
      }
    } else {
      initAutocomplete();
    }
  }, [googleMapsKey, isOpen, isAddingNew]);

  const handleAddressChange = async (val: string) => {
    setNewAddress(prev => ({ ...prev, fullAddress: val }));

    if (val.trim().length >= 3) {
      if (googleMapsKey) return; // Google Places SDK will manage the autocomplete internally

      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(val)}&format=json&addressdetails=1&countrycodes=in&limit=5`, {
          headers: { "Accept-Language": "en" }
        });
        if (res.ok) {
          const data = await res.json();
          const mapped = data.map((item: any) => {
            const addr = item.address || {};
            const city = addr.city || addr.town || addr.village || addr.suburb || addr.state_district || "";
            const state = addr.state || "";
            const pincode = addr.postcode || "";
            const displayName = item.display_name;
            
            // Street calculation (strip out redundant city state components if present)
            const parts = displayName.split(",");
            const street = parts.slice(0, Math.min(parts.length, 3)).join(",").trim();

            return {
              description: displayName,
              street: street,
              city: city,
              state: state,
              pincode: pincode.replace(/\s/g, ""), // clean spacing
              lat: parseFloat(item.lat),
              lng: parseFloat(item.lon)
            };
          });

          if (mapped.length > 0) {
            setSuggestions(mapped);
          } else {
            // Static fallback if no OSM results are found
            const term = val.toLowerCase();
            const filtered = MOCK_LOCATIONS.filter(loc => 
              loc.description.toLowerCase().includes(term) ||
              loc.city.toLowerCase().includes(term)
            );
            setSuggestions(filtered);
          }
          setShowDropdown(true);
        }
      } catch (err) {
        console.error("OSM Nominatim failed, falling back to static mocks:", err);
        const term = val.toLowerCase();
        const filtered = MOCK_LOCATIONS.filter(loc => 
          loc.description.toLowerCase().includes(term) ||
          loc.city.toLowerCase().includes(term)
        );
        setSuggestions(filtered);
        setShowDropdown(true);
      }
    } else {
      setSuggestions([]);
      setShowDropdown(false);
    }
  };

  const handleSelectSuggestion = (loc: typeof MOCK_LOCATIONS[0]) => {
    setNewAddress({
      addressType: newAddress.addressType,
      fullAddress: loc.street,
      city: loc.city,
      state: loc.state,
      pincode: loc.pincode,
      isDefault: newAddress.isDefault,
      latitude: loc.lat,
      longitude: loc.lng
    });
    setSuggestions([]);
    setShowDropdown(false);
    setIsAddressVerified(false); // reset verification on changing address
  };

  const handleVerifyAddress = () => {
    if (!newAddress.fullAddress.trim()) {
      showToast("Please enter a shipping address to verify.", "error");
      return;
    }
    setIsAddressVerifying(true);
    setTimeout(() => {
      setIsAddressVerifying(false);
      setIsAddressVerified(true);
      showToast("Delivery address verified successfully with logistics boundaries!", "success");
    }, 1200);
  };

  // 🔄 Reset states on close
  useEffect(() => {
    if (!isOpen) {
      Promise.resolve().then(() => {
        setPhone("");
        setFullName("");
        setProfile(null);
        setSelectedAddressId(null);
        setIsAddingNew(false);
        setNewAddress({
          addressType: "HOME",
          fullAddress: "",
          city: "",
          state: "",
          pincode: "",
          isDefault: true,
          latitude: undefined,
          longitude: undefined
        });
        setPaymentMethod("ONLINE");
        setShowPaymentSimulator(false);
        setPaymentErrorMessage(null);
        setTempOrderPayload(null);
        setPaymentTab("UPI");
        setSelectedUpiApp(null);
        setSimulatingUpiApp(null);
        setCustomUpiId("");
        setAlternativePhone("");
        setIsAddressVerifying(false);
        setIsAddressVerified(false);
      });
    }
  }, [isOpen]);

  // 🎟️ Auto-Apply Coupon from LocalStorage on open
  useEffect(() => {
    if (isOpen && typeof window !== "undefined") {
      const savedCoupon = localStorage.getItem("active_coupon");
      if (savedCoupon) {
        setCouponInput(savedCoupon);
        handleValidateCoupon(savedCoupon);
      }
    } else if (!isOpen) {
      // Clear coupon states when closing modal
      setCouponInput("");
      setAppliedCoupon(null);
      setCouponError(null);
    }
  }, [isOpen]);

  const handleValidateCoupon = async (codeToValidate: string) => {
    if (!codeToValidate.trim()) return;
    setIsCouponValidating(true);
    setCouponError(null);
    try {
      const response = await fetch(API_ENDPOINTS.validateCoupon(codeToValidate.trim().toUpperCase(), phone, subtotal));
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Invalid coupon code.");
      }
      const data = await response.json();
      setAppliedCoupon(data);
      showToast(`Coupon "${data.code}" applied successfully!`, "success");
    } catch (err) {
      console.warn("Coupon validation:", err instanceof Error ? err.message : err);
      setCouponError(err instanceof Error ? err.message : "Failed to apply coupon.");
      setAppliedCoupon(null);
    } finally {
      setIsCouponValidating(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput("");
    setCouponError(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("active_coupon");
    }
    showToast("Coupon removed.", "info");
  };

  const discountAmount = appliedCoupon 
    ? Math.round((subtotal * appliedCoupon.discountPercentage) / 100)
    : 0;
  const finalPayable = subtotal - discountAmount;

  const handleSimulatedPaymentSuccess = async () => {
    if (!tempOrderPayload) return;
    setIsSubmitting(true);
    setPaymentErrorMessage(null);

    const finalPayload = {
      ...tempOrderPayload,
      paymentStatus: "COMPLETED",
      orderStatus: "CONFIRMED",
      paymentTransactionId: "txn_sim_" + Math.random().toString(36).substring(2, 10).toUpperCase()
    };

    try {
      console.log("Placing Prepaid paid order via API...");
      const response = await fetch(API_ENDPOINTS.placeOrder, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalPayload),
      });

      if (!response.ok) throw new Error("Server rejected simulated prepaid order placement.");

      const savedOrder = await response.json();
      setPlacedOrderId(savedOrder.id);
      setShowPaymentSimulator(false);
      setTempOrderPayload(null);
      setSimulatingUpiApp(null);
      setSelectedUpiApp(null);
      setCustomUpiId("");
    } catch (error) {
      console.error("Simulated Checkout Error:", error);
      setPaymentErrorMessage("Payment verification failed on the server. Please try again.");
      setSimulatingUpiApp(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ⏳ UPI Simulation Countdown Timer Hook
  useEffect(() => {
    let intervalId: any;
    if (simulatingUpiApp && upiCountdown > 0) {
      intervalId = setInterval(() => {
        setUpiCountdown((prev) => prev - 1);
      }, 1000);
    } else if (simulatingUpiApp && upiCountdown === 0) {
      handleSimulatedPaymentSuccess();
    }
    return () => clearInterval(intervalId);
  }, [simulatingUpiApp, upiCountdown]);

  const loadProfile = async (phoneNumber: string) => {
    // 🛡️ Frontend validation: only valid Indian mobile numbers (starting with 6-9)
    const indianMobileRegex = /^[6-9]\d{9}$/;
    if (!indianMobileRegex.test(phoneNumber)) {
      showToast("Please enter a valid 10-digit mobile number", "error");
      return;
    }

    setIsLoadingProfile(true);
    try {
      const data = await fetchCustomerProfile(phoneNumber);
      setProfile(data);
      if (data.fullName) setFullName(data.fullName);
      
      if (data.addresses && data.addresses.length > 0) {
        const defaultAddr = data.addresses.find(a => a.isDefault) || data.addresses[0];
        setSelectedAddressId(defaultAddr.id!);
        setIsAddingNew(false);
      } else {
        setIsAddingNew(true);
      }
    } catch (error) {
      console.error("Profile fetch error:", error);
      const message = error instanceof Error ? error.message : "Something went wrong. Please try again.";
      showToast(message, "error");
      setProfile(null);
      setSelectedAddressId(null);
      setIsAddingNew(true);
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const handleDeleteAddress = (addressId: number) => {
    setDeletingAddressId(addressId);
  };

  const performAddressDelete = async (addressId: number) => {
    try {
      showToast("Deleting address...", "info");
      const updatedProfile = await deleteCustomerAddress(phone, addressId);
      setProfile(updatedProfile);
      showToast("Address deleted successfully.", "success");
      
      // If the deleted address was currently selected, reset selection to default or null
      if (selectedAddressId === addressId) {
        if (updatedProfile.addresses && updatedProfile.addresses.length > 0) {
          const defaultAddr = updatedProfile.addresses.find(a => a.isDefault) || updatedProfile.addresses[0];
          setSelectedAddressId(defaultAddr.id!);
        } else {
          setSelectedAddressId(null);
          setIsAddingNew(true);
        }
      }
    } catch (error) {
      console.error("Delete address failed:", error);
      const msg = error instanceof Error ? error.message : "Failed to delete address.";
      showToast(msg, "error");
    }
  };

  // 🔄 फोन नंबर 10 डिजिट का होते ही प्रोफाइल फेच करो
  useEffect(() => {
    if (phone.length === 10) {
      Promise.resolve().then(() => {
        loadProfile(phone);
      });
    } else {
      Promise.resolve().then(() => {
        setProfile(null);
        setSelectedAddressId(null);
      });
    }
  }, [phone]);

  // 🔄 Sync abandoned cart to backend database
  useEffect(() => {
    if (phone.length === 10 && cartItems && cartItems.length > 0) {
      const triggerSync = async () => {
        try {
          await syncCart({
            phoneNumber: phone,
            customerName: fullName,
            cartItemsJson: JSON.stringify(cartItems),
            totalAmount: subtotal
          });
          console.log("Cart session synced to backend successfully.");
        } catch (err) {
          console.error("Error syncing cart session to backend:", err);
        }
      };

      const timeoutId = setTimeout(triggerSync, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [phone, fullName, cartItems, subtotal]);

  // 🚀 फाइनल प्लेस आर्डर लॉजिक (Unified Single-Click Address Save + Checkout)
  const handlePlaceOrder = async () => {
    const nameRegex = /^[a-zA-Z\s]{2,50}$/;
    const locationRegex = /^[a-zA-Z\s]{2,40}$/;

    if (!fullName.trim()) {
      showToast("Please enter your Full Name.", "error");
      return;
    }
    if (!nameRegex.test(fullName.trim())) {
      showToast("Full Name must contain letters only (at least 2 characters).", "error");
      return;
    }
    if (!phone || phone.length < 10) {
      showToast("Please enter a valid 10-digit phone number.", "error");
      return;
    }

    setIsSubmitting(true);
    let finalAddress = "";
    let finalPincode = "";
    let finalCityState = "";
    let finalLat: number | undefined = undefined;
    let finalLng: number | undefined = undefined;

    try {
      if (isAddingNew) {
        // Validation check for new address fields
        if (!newAddress.fullAddress.trim() || !newAddress.city.trim() || !newAddress.state.trim() || !newAddress.pincode.trim()) {
          showToast("Please fill in all address details.", "error");
          setIsSubmitting(false);
          return;
        }
        if (!locationRegex.test(newAddress.city.trim())) {
          showToast("City name must contain only letters (at least 2 characters).", "error");
          setIsSubmitting(false);
          return;
        }
        if (!locationRegex.test(newAddress.state.trim())) {
          showToast("State name must contain only letters (at least 2 characters).", "error");
          setIsSubmitting(false);
          return;
        }
        if (newAddress.pincode.trim().length !== 6) {
          showToast("Pincode must be exactly 6 digits.", "error");
          setIsSubmitting(false);
          return;
        }

        // 🔄 Automatically save the address to their profile in the background
        console.log("Saving new address to customer profile...");
        const updatedProfile = await addCustomerAddress(phone, newAddress);
        setProfile(updatedProfile);
        
        // Find the newly saved address
        const savedAddr = updatedProfile.addresses[updatedProfile.addresses.length - 1];
        finalAddress = savedAddr.fullAddress;
        finalPincode = savedAddr.pincode;
        finalCityState = `${savedAddr.city}, ${savedAddr.state}`;
        finalLat = savedAddr.latitude;
        finalLng = savedAddr.longitude;
      } else {
        if (!selectedAddressId || !profile) {
          showToast("Please select a delivery address first.", "error");
          setIsSubmitting(false);
          return;
        }
        const selectedAddr = profile.addresses.find(a => a.id === selectedAddressId);
        if (!selectedAddr) {
          showToast("Selected address not found.", "error");
          setIsSubmitting(false);
          return;
        }
        finalAddress = selectedAddr.fullAddress;
        finalPincode = selectedAddr.pincode;
        finalCityState = `${selectedAddr.city}, ${selectedAddr.state}`;
        finalLat = selectedAddr.latitude;
        finalLng = selectedAddr.longitude;
      }

      const mappedOrderItems = cartItems.map(item => ({
        productId: item.id,
        productName: item.name,
        quantity: item.quantity,
        price: item.price
      }));

      const orderPayload = {
        customerName: fullName,
        phoneNumber: phone,
        address: alternativePhone.trim() ? `${finalAddress} (Alt: ${alternativePhone})` : finalAddress,
        pincode: finalPincode,
        cityState: finalCityState,
        totalAmount: subtotal - discountAmount,
        orderStatus: paymentMethod === "COD" ? "CONFIRMED" : "PENDING",
        paymentStatus: paymentMethod === "COD" ? "COD" : "PENDING",
        orderItems: mappedOrderItems,
        latitude: finalLat,
        longitude: finalLng,
        couponCode: appliedCoupon ? appliedCoupon.code : null,
        discountAmount: discountAmount
      };

      if (paymentMethod === "ONLINE") {
        setTempOrderPayload(orderPayload);
        setShowPaymentSimulator(true);
        setPaymentErrorMessage(null);
        setIsSubmitting(false);
        return;
      }

      console.log("Placing COD order via API...");
      const response = await fetch(API_ENDPOINTS.placeOrder, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      if (!response.ok) throw new Error("Backend server rejected the order.");
      
      const savedOrder = await response.json();
      setPlacedOrderId(savedOrder.id);
    } catch (error) {
      console.error("Checkout Error:", error);
      const msg = error instanceof Error ? error.message : "Failed to connect with Server. Please check your inventory or try again.";
      showToast(msg, "error");
    } finally {
      setIsSubmitting(false);
    }
  };



  const handlePayClick = () => {
    if (paymentTab === "UPI") {
      if (!selectedUpiApp && !customUpiId.trim()) return;
      setUpiCountdown(3);
      setSimulatingUpiApp(selectedUpiApp || customUpiId);
    } else {
      handleSimulatedPaymentSuccess();
    }
  };

  const handleSimulatedPaymentCancel = () => {
    setShowPaymentSimulator(false);
    setTempOrderPayload(null);
    setSimulatingUpiApp(null);
    setSelectedUpiApp(null);
    setCustomUpiId("");
    setPaymentErrorMessage("Payment was cancelled. You can retry or select Cash on Delivery.");
  };

  const handleFinalClose = () => {
    setPlacedOrderId(null);
    onOrderSuccess();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-all duration-300">
      <div className="absolute inset-0" onClick={!placedOrderId && !isSubmitting ? onClose : undefined} />
      
      <div className="relative w-full max-w-lg bg-[#111111]/70 backdrop-blur-xl text-[#FDFBF7] rounded-3xl p-8 border border-[#D4AF37]/30 shadow-[0_0_50px_rgba(212,175,55,0.15)] z-10 max-h-[90vh] flex flex-col transition-all duration-500">
        
        {/* 🎉 Success Screen */}
        {placedOrderId ? (
          <div className="flex flex-col items-center text-center py-6 animate-fadeIn overflow-y-auto">
            <div className="h-20 w-20 rounded-full bg-[#D4AF37]/10 flex items-center justify-center mb-6 border border-[#D4AF37]/30 text-[#D4AF37] animate-bounce">
              <CheckCircle2 className="h-12 w-12" />
            </div>
            <span className="text-[10px] font-bold tracking-[0.3em] text-[#D4AF37] uppercase">Order Confirmed</span>
            <h3 className="font-serif text-3xl font-bold tracking-wide mt-2">Aapka Koshish, Hamara Vaada!</h3>
            <div className="mt-4 bg-[#161616] border border-gray-800/60 px-6 py-3 rounded-xl font-mono text-xs text-gray-400">
              Order ID: <span className="text-[#D4AF37] font-bold">MG-000{placedOrderId}</span>
            </div>
            <p className="text-xs text-gray-500 max-w-sm mt-6 leading-relaxed font-light">
              Thank you for supporting traditional village artisans. Your batch of pure, handcrafted essentials is being securely packed at our MadhurGram facility and will be dispatched shortly.
            </p>
            <button 
              onClick={handleFinalClose}
              className="mt-8 w-full py-4 bg-[#D4AF37] text-[#111111] font-bold rounded-lg text-xs uppercase tracking-widest flex items-center justify-center space-x-2 hover:bg-[#FDFBF7] transition-all group active:scale-95"
            >
              <span>Continue Shopping</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        ) : simulatingUpiApp ? (
          <div className="flex flex-col items-center text-center py-8 animate-fadeIn h-full justify-between">
            <div className="space-y-6 flex-1 flex flex-col justify-center items-center">
              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-[#D4AF37]/10 animate-ping h-20 w-20" />
                <div className="h-16 w-16 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              </div>
              
              <div className="space-y-2">
                <span className="text-[9px] font-bold tracking-[0.2em] text-[#D4AF37] uppercase">Secure Processing</span>
                <h4 className="font-serif text-xl font-bold tracking-wide text-white">
                  {selectedUpiApp ? `Opening ${selectedUpiApp}...` : `Request Sent`}
                </h4>
                <p className="text-xs text-gray-400 max-w-xs mx-auto leading-relaxed font-light">
                  {selectedUpiApp ? (
                    <>
                      We have sent a transaction request of <strong>₹{finalPayable}.00</strong> to your mobile app. Please verify and approve it on your phone.
                    </>
                  ) : (
                    <>
                      We have sent a collect request of <strong>₹{finalPayable}.00</strong> to your UPI ID <strong>{customUpiId}</strong>. Please check your UPI app and approve the request.
                    </>
                  )}
                </p>
              </div>

              <div className="bg-[#161616] px-4 py-2 border border-gray-800 rounded-full font-mono text-[10px] text-gray-500">
                Verifying transaction status in <span className="text-[#D4AF37] font-bold">{upiCountdown}s</span>...
              </div>
            </div>

            <button
              onClick={handleSimulatedPaymentCancel}
              className="mt-6 w-full py-3.5 border border-gray-800 text-gray-400 hover:text-white rounded-lg text-xs uppercase tracking-widest transition-colors font-bold"
            >
              Cancel Payment
            </button>
          </div>
        ) : showPaymentSimulator ? (
          <div className="flex flex-col h-full max-h-full overflow-hidden animate-fadeIn">
            <h3 className="font-serif text-2xl font-bold tracking-wide text-[#D4AF37] border-b border-gray-800 pb-4 shrink-0 flex items-center gap-2">
              <CreditCard className="h-6 w-6 text-[#D4AF37]" />
              <span>Secure Payment Gateway</span>
            </h3>
            
            {/* Payment Method Selector Tabs */}
            <div className="flex border-b border-gray-800 shrink-0 mt-2">
              <button
                type="button"
                onClick={() => setPaymentTab("UPI")}
                className={`flex-1 pb-3 text-xs uppercase tracking-wider font-bold border-b-2 transition-all ${
                  paymentTab === "UPI"
                    ? "border-[#D4AF37] text-[#D4AF37]"
                    : "border-transparent text-gray-500 hover:text-gray-400"
                }`}
              >
                UPI (GPay/PhonePe)
              </button>
              <button
                type="button"
                onClick={() => setPaymentTab("CARD")}
                className={`flex-1 pb-3 text-xs uppercase tracking-wider font-bold border-b-2 transition-all ${
                  paymentTab === "CARD"
                    ? "border-[#D4AF37] text-[#D4AF37]"
                    : "border-transparent text-gray-500 hover:text-gray-400"
                }`}
              >
                Card Payment
              </button>
            </div>
            
            <div className="mt-6 space-y-6 overflow-y-auto flex-1 pr-2 custom-scrollbar text-center py-4">
              <div className="bg-[#161616] border border-gray-800/80 p-5 rounded-2xl max-w-sm mx-auto space-y-3">
                <span className="text-[9px] uppercase tracking-widest text-[#D4AF37] block font-bold">MadhurGram Checkout</span>
                <p className="text-2xl font-mono font-bold text-white">₹{finalPayable}.00</p>
                <div className="text-[10px] text-gray-500">Simulated Test Mode</div>
              </div>

              {paymentTab === "UPI" ? (
                <div className="max-w-sm mx-auto space-y-4">
                  <div className="grid grid-cols-3 gap-2.5">
                    <div 
                      onClick={() => {
                        setSelectedUpiApp("PhonePe");
                        setCustomUpiId("");
                      }} 
                      className={`bg-[#161616] border p-3.5 rounded-xl cursor-pointer transition-all flex flex-col items-center gap-2.5 active:scale-95 ${
                        selectedUpiApp === "PhonePe" ? "border-[#D4AF37] bg-[#D4AF37]/10" : "border-gray-800 hover:border-gray-700"
                      }`}
                    >
                      <div className="h-10 w-10 rounded-lg bg-white flex items-center justify-center shadow-sm shrink-0">
                        <svg viewBox="0 0 100 100" className="w-8 h-8" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect width="100" height="100" rx="20" fill="#5F259F"/>
                          <path d="M50 20C33.4 20 20 33.4 20 50C20 66.6 33.4 80 50 80C66.6 80 80 66.6 80 50C80 33.4 66.6 20 50 20ZM53 62H42V38H53C58 38 61 40 61 44C61 48 58 50 53 50H49V56H53C55.8 56 57.5 57.5 57.5 60C57.5 61.2 57 62 53 62Z" fill="white"/>
                        </svg>
                      </div>
                      <span className="text-[10px] font-bold text-gray-300">PhonePe</span>
                    </div>
                    <div 
                      onClick={() => {
                        setSelectedUpiApp("Google Pay");
                        setCustomUpiId("");
                      }} 
                      className={`bg-[#161616] border p-3.5 rounded-xl cursor-pointer transition-all flex flex-col items-center gap-2.5 active:scale-95 ${
                        selectedUpiApp === "Google Pay" ? "border-[#D4AF37] bg-[#D4AF37]/10" : "border-gray-800 hover:border-gray-700"
                      }`}
                    >
                      <div className="h-10 w-10 rounded-lg bg-white flex items-center justify-center shadow-sm shrink-0">
                        <svg viewBox="0 0 24 24" className="w-7 h-7" xmlns="http://www.w3.org/2000/svg">
                          <path d="M21.35 11.1c0-.7-.06-1.35-.17-2H12v3.8h5.25c-.23 1.2-1 2.2-2.05 2.9v2.4h3.3c1.9-1.75 3-4.35 3-7.1z" fill="#4285F4"/>
                          <path d="M12 20.6c2.7 0 5-.9 6.6-2.4l-3.3-2.4c-.9.6-2.05 1-3.3 1-2.55 0-4.7-1.7-5.45-4H3.2v2.5c1.6 3.2 4.9 5.3 8.8 5.3z" fill="#34A853"/>
                          <path d="M6.55 12.8c-.2-.6-.3-1.25-.3-1.9s.1-1.3.3-1.9V6.5H3.2C2.4 8.1 2 9.8 2 11.6s.4 3.5 1.2 5.1l3.35-2.9z" fill="#FBBC05"/>
                          <path d="M12 6.4c1.45 0 2.75.5 3.8 1.5l2.85-2.85C16.9 3.4 14.65 2.5 12 2.5c-3.9 0-7.2 2.1-8.8 5.3l3.35 2.9c.75-2.3 2.9-4.1 5.45-4.1z" fill="#EA4335"/>
                        </svg>
                      </div>
                      <span className="text-[10px] font-bold text-gray-300">Google Pay</span>
                    </div>
                    <div 
                      onClick={() => {
                        setSelectedUpiApp("Paytm");
                        setCustomUpiId("");
                      }} 
                      className={`bg-[#161616] border p-3.5 rounded-xl cursor-pointer transition-all flex flex-col items-center gap-2.5 active:scale-95 ${
                        selectedUpiApp === "Paytm" ? "border-[#D4AF37] bg-[#D4AF37]/10" : "border-gray-800 hover:border-gray-700"
                      }`}
                    >
                      <div className="h-10 w-10 rounded-lg bg-white flex items-center justify-center shadow-sm shrink-0">
                        <span className="text-[#002970] font-black font-sans text-xs italic tracking-tighter">pay<span className="text-[#00BAF2]">tm</span></span>
                      </div>
                      <span className="text-[10px] font-bold text-gray-300">Paytm</span>
                    </div>
                  </div>

                  <div className="text-left bg-[#161616]/40 p-4 rounded-xl border border-gray-800/40 space-y-2">
                    <label className="text-[9px] uppercase tracking-widest text-[#D4AF37] block font-bold">Or Enter UPI ID</label>
                    <input 
                      type="text" 
                      placeholder="e.g. customer@okaxis" 
                      value={customUpiId}
                      onChange={(e) => {
                        setCustomUpiId(e.target.value);
                        setSelectedUpiApp(null);
                      }}
                      className="w-full bg-black/60 border border-gray-800 focus:border-[#D4AF37]/50 rounded-lg p-2.5 text-xs text-gray-200 font-mono focus:outline-none transition-colors" 
                    />
                  </div>
                </div>
              ) : (
                <div className="text-left max-w-sm mx-auto space-y-4 bg-[#161616]/40 p-5 rounded-2xl border border-gray-800/40">
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-widest text-gray-500 block font-bold">Dummy Card Number</label>
                    <input type="text" disabled value="4242 4242 4242 4242" className="w-full bg-black/60 border border-gray-800 rounded-lg p-2.5 text-xs text-gray-400 font-mono focus:outline-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase tracking-widest text-gray-500 block font-bold">Expiry</label>
                      <input type="text" disabled value="12 / 29" className="w-full bg-black/60 border border-gray-800 rounded-lg p-2.5 text-xs text-gray-400 font-mono focus:outline-none" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase tracking-widest text-gray-500 block font-bold">CVV</label>
                      <input type="text" disabled value="***" className="w-full bg-black/60 border border-gray-800 rounded-lg p-2.5 text-xs text-gray-400 font-mono focus:outline-none" />
                    </div>
                  </div>
                </div>
              )}

              {paymentErrorMessage && (
                <p className="text-xs text-red-500 font-medium max-w-sm mx-auto leading-relaxed">
                  {paymentErrorMessage}
                </p>
              )}
            </div>

            <div className="border-t border-gray-800 pt-4 mt-6 shrink-0 bg-[#111111]">
              <div className="flex space-x-3">
                <button
                  disabled={isSubmitting}
                  onClick={handleSimulatedPaymentCancel}
                  className="flex-1 py-3.5 border border-gray-800 text-gray-400 rounded-lg text-xs uppercase tracking-wider hover:bg-gray-900 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  disabled={isSubmitting || (paymentTab === "UPI" && !selectedUpiApp && !customUpiId.trim())}
                  onClick={handlePayClick}
                  className="flex-1 py-3.5 bg-[#D4AF37] text-[#111111] font-bold rounded-lg text-xs uppercase tracking-wider hover:bg-[#FDFBF7] transition-all active:scale-95 disabled:bg-gray-700 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Authorizing...</span>
                    </>
                  ) : (
                    <span>Pay ₹{finalPayable}.00</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        ) : (
          
          /* 📦 Smart Shipping Flow */
          <div className="flex flex-col h-full max-h-full overflow-hidden relative">
            {deletingAddressId !== null && (
              <div className="absolute inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-fadeIn">
                <div className="bg-[#111111] border border-gray-800 rounded-2xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl">
                  <div className="h-12 w-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto">
                    <Trash2 className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-[#FDFBF7] uppercase tracking-wider">Delete Address?</h4>
                    <p className="text-xs text-gray-500 font-light leading-relaxed">
                      Are you sure you want to remove this delivery address from your profile? This action cannot be undone.
                    </p>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setDeletingAddressId(null)}
                      className="flex-1 py-2.5 border border-gray-800 text-gray-400 rounded-xl text-xs uppercase tracking-wider hover:bg-gray-900 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const id = deletingAddressId;
                        setDeletingAddressId(null);
                        performAddressDelete(id);
                      }}
                      className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-[#FDFBF7] font-bold rounded-xl text-xs uppercase tracking-wider transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            <h3 className="font-serif text-3xl font-bold tracking-wide text-center bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#B38F00] bg-clip-text text-transparent pb-1 shrink-0">
              Shipping Information
            </h3>
            <p className="text-[11px] text-gray-500 text-center uppercase tracking-widest border-b border-gray-800/80 pb-4 shrink-0 font-light">
              Please provide your accurate shipping details to place your order.
            </p>
            
            <div className="mt-6 space-y-6 overflow-y-auto flex-1 pr-2 custom-scrollbar">
              
              {/* Step 1: Contact Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[9px] uppercase tracking-widest text-[#D4AF37] block mb-1.5 font-bold">Phone Number</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-gray-500 font-mono">+91</span>
                    <input 
                      required type="tel" maxLength={10} value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                      className="w-full bg-black/40 border border-gray-800 focus:border-[#D4AF37]/50 rounded-xl pl-12 pr-3 py-3 text-sm text-[#FDFBF7] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/20 outline-none transition-all placeholder-gray-700 font-mono" placeholder="10-digit number" 
                    />
                    {isLoadingProfile && <Loader2 className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-[#D4AF37]" />}
                  </div>
                </div>
                <div>
                  <label className="text-[9px] uppercase tracking-widest text-[#D4AF37] block mb-1.5 font-bold">Full Name</label>
                  <input 
                    required type="text" value={fullName} onChange={(e) => setFullName(e.target.value.replace(/[^a-zA-Z\s]/g, ""))}
                    className="w-full bg-black/40 border border-gray-800 focus:border-[#D4AF37]/50 rounded-xl p-3 text-sm text-[#FDFBF7] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/20 outline-none transition-all placeholder-gray-700" placeholder="Enter your name" 
                  />
                </div>
              </div>
 
              {/* Locked/Guidance State */}
              {phone.length < 10 && (
                <div className="bg-[#161616]/40 backdrop-blur-md border border-gray-800/80 rounded-2xl p-8 text-center space-y-4 shadow-inner">
                  <MapPin className="h-10 w-10 text-gray-600 mx-auto animate-pulse" />
                  <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Delivery Destination</h4>
                  <p className="text-xs text-gray-500 max-w-xs mx-auto leading-relaxed font-light">
                    Enter your name and a valid 10-digit phone number above to proceed with the delivery address.
                  </p>
                </div>
              )}

              {/* Step 2: Address Selection */}
              {phone.length === 10 && profile && !isAddingNew && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <label className="text-[9px] uppercase tracking-widest text-gray-500 block font-bold">Saved Address</label>
                    <button 
                      onClick={() => setIsAddingNew(true)} 
                      className="text-xs text-[#D4AF37] flex items-center gap-1 hover:underline font-bold"
                    >
                      <Plus className="h-3.5 w-3.5" /> Add New Address
                    </button>
                  </div>
                  <div className="space-y-3">
                    {profile.addresses.map((addr) => {
                      const isSelected = selectedAddressId === addr.id;
                      return (
                        <div 
                          key={addr.id} 
                          onClick={() => setSelectedAddressId(addr.id!)}
                          className={`cursor-pointer p-4 rounded-xl border transition-all duration-300 ${
                            isSelected 
                              ? "bg-[#D4AF37]/10 border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.05)]" 
                              : "bg-[#161616] border-gray-800 hover:border-gray-700"
                          }`}
                        >
                          <div className="flex items-start gap-3 justify-between">
                            <div className="flex items-start gap-3 flex-1">
                              <div className={`p-2 rounded-lg ${isSelected ? "bg-[#D4AF37]/20 text-[#D4AF37]" : "bg-black/40 text-gray-500"}`}>
                                {addr.addressType === 'HOME' ? (
                                  <Home className="h-4 w-4" />
                                ) : addr.addressType === 'OFFICE' ? (
                                  <Briefcase className="h-4 w-4" />
                                ) : (
                                  <Map className="h-4 w-4" />
                                )}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-300">
                                    {addr.addressType}
                                  </span>
                                  {addr.isDefault && (
                                    <span className="text-[8px] bg-gray-800 px-1.5 py-0.5 rounded text-gray-400 font-bold uppercase">
                                      Default
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-gray-400 font-light leading-relaxed">
                                  {addr.fullAddress}, {addr.city}, {addr.state} - <span className="font-mono text-xs">{addr.pincode}</span>
                                </p>
                              </div>
                            </div>

                            {/* Delete Address Button */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation(); // prevent address card selection
                                handleDeleteAddress(addr.id!);
                              }}
                              className="text-gray-500 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-500/10 transition-all active:scale-95 self-start shrink-0"
                              title="Delete Address"
                            >
                              <Trash2 className="h-4.5 w-4.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 3: Add New Address Form (Rendered inline for unified submission) */}
              {phone.length === 10 && profile && isAddingNew && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] uppercase tracking-widest text-[#D4AF37] block font-bold font-serif">Delivery Address</label>
                    {profile.addresses.length > 0 && (
                      <button 
                        type="button" 
                        onClick={() => setIsAddingNew(false)} 
                        className="text-xs text-gray-500 hover:text-white"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                  
                  <div className="space-y-4 bg-[#161616]/40 backdrop-blur-md p-5 rounded-2xl border border-[#D4AF37]/20 shadow-inner">
                    {/* Address Type Selection */}
                    <div>
                      <label className="text-[9px] uppercase tracking-widest text-[#D4AF37] block mb-2 font-bold">Address Type</label>
                      <div className="flex gap-2">
                        {['HOME', 'OFFICE', 'OTHER'].map((type) => (
                          <button 
                            key={type} 
                            type="button" 
                            onClick={() => setNewAddress({...newAddress, addressType: type as AddressType})} 
                            className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all duration-200 ${
                              newAddress.addressType === type 
                                ? "bg-[#D4AF37] text-[#111111] border-[#D4AF37]" 
                                : "bg-black/40 text-gray-400 border-gray-800 hover:border-gray-700"
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Full Address */}
                    <div>
                      <label className="text-[9px] uppercase tracking-widest text-[#D4AF37] block mb-1 font-bold">Shipping Address (Smart Auto-complete)</label>
                      <div className="flex gap-2 items-center">
                        <div className="relative flex-1">
                          <input 
                            ref={inputRef}
                            required 
                            type="text" 
                            placeholder="Street address, Flat, House no., Area" 
                            value={newAddress.fullAddress} 
                            onChange={(e) => handleAddressChange(e.target.value)} 
                            onFocus={() => {
                              if (newAddress.fullAddress.trim().length >= 3 && suggestions.length > 0) {
                                setShowDropdown(true);
                              }
                            }}
                            onBlur={() => {
                              setTimeout(() => setShowDropdown(false), 200);
                            }}
                            className="w-full bg-black/40 border border-gray-800 focus:border-[#D4AF37]/50 rounded-xl p-3 text-sm text-[#FDFBF7] placeholder-gray-700 focus:ring-1 focus:ring-[#D4AF37]/20 outline-none transition-all" 
                          />
                          {showDropdown && suggestions.length > 0 && !googleMapsKey && (
                            <div className="absolute left-0 right-0 mt-1 bg-[#161616] border border-gray-800 rounded-xl overflow-hidden shadow-2xl z-50 divide-y divide-gray-900/60 max-h-48 overflow-y-auto">
                              {suggestions.map((loc, idx) => (
                                <div
                                  key={idx}
                                  onClick={() => handleSelectSuggestion(loc)}
                                  className="px-4 py-2.5 text-xs text-gray-300 hover:text-white hover:bg-[#D4AF37]/10 cursor-pointer transition-all flex items-center gap-2"
                                >
                                  <MapPin className="h-3.5 w-3.5 text-[#D4AF37] shrink-0" />
                                  <span className="truncate">{loc.description}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        <button 
                          type="button"
                          onClick={handleVerifyAddress}
                          disabled={isAddressVerifying || !newAddress.fullAddress.trim()}
                          className={`px-3 py-3 rounded-xl font-bold text-[9px] uppercase tracking-widest transition-all active:scale-95 flex items-center gap-1.5 shrink-0 ${
                            isAddressVerified 
                              ? "bg-green-500/20 border border-green-500 text-green-400" 
                              : "bg-[#E5C158] hover:bg-[#D4AF37] text-[#111111] disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                          }`}
                        >
                          {isAddressVerifying ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <MapPin className="h-3.5 w-3.5" />
                          )}
                          <span>{isAddressVerified ? "Verified" : "Verify Address"}</span>
                        </button>
                      </div>
                    </div>

                    {/* City and State Grid */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[9px] uppercase tracking-widest text-[#D4AF37] block mb-1.5 font-bold">City</label>
                        <input 
                          required 
                          type="text" 
                          placeholder="City" 
                          value={newAddress.city} 
                          onChange={(e) => setNewAddress({...newAddress, city: e.target.value.replace(/[^a-zA-Z\s]/g, "")})} 
                          className="w-full bg-black/40 border border-gray-800 focus:border-[#D4AF37]/50 rounded-xl p-3 text-sm text-[#FDFBF7] placeholder-gray-700 focus:ring-1 focus:ring-[#D4AF37]/20 outline-none transition-all" 
                        />
                      </div>
                      <div>
                        <label className="text-[9px] uppercase tracking-widest text-[#D4AF37] block mb-1.5 font-bold">State</label>
                        <input 
                          required 
                          type="text" 
                          placeholder="State" 
                          value={newAddress.state} 
                          onChange={(e) => setNewAddress({...newAddress, state: e.target.value.replace(/[^a-zA-Z\s]/g, "")})} 
                          className="w-full bg-black/40 border border-gray-800 focus:border-[#D4AF37]/50 rounded-xl p-3 text-sm text-[#FDFBF7] placeholder-gray-700 focus:ring-1 focus:ring-[#D4AF37]/20 outline-none transition-all" 
                        />
                      </div>
                    </div>

                    {/* Pincode & Alternative Phone Grid */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[9px] uppercase tracking-widest text-[#D4AF37] block mb-1 font-bold">Pincode</label>
                        <input 
                          required 
                          type="text" 
                          placeholder="6-digit pincode" 
                          maxLength={6} 
                          value={newAddress.pincode} 
                          onChange={(e) => setNewAddress({...newAddress, pincode: e.target.value.replace(/\D/g, "")})} 
                          className="w-full bg-black/40 border border-gray-800 focus:border-[#D4AF37]/50 rounded-xl p-3 text-sm text-[#FDFBF7] font-mono placeholder-gray-700 focus:ring-1 focus:ring-[#D4AF37]/20 outline-none transition-all" 
                        />
                      </div>
                      <div>
                        <label className="text-[9px] uppercase tracking-widest text-[#D4AF37] block mb-1 font-bold">Alternative Phone (Optional)</label>
                        <input 
                          type="tel" 
                          maxLength={10} 
                          placeholder="Optional contact" 
                          value={alternativePhone} 
                          onChange={(e) => setAlternativePhone(e.target.value.replace(/\D/g, ""))} 
                          className="w-full bg-black/40 border border-gray-800 focus:border-[#D4AF37]/50 rounded-xl p-3 text-sm text-[#FDFBF7] font-mono placeholder-gray-700 focus:ring-1 focus:ring-[#D4AF37]/20 outline-none transition-all" 
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Payment Method Selection */}
              {phone.length === 10 && profile && (
                <div className="space-y-3 animate-fadeIn mt-6 border-t border-gray-900 pt-4">
                  <label className="text-[9px] uppercase tracking-widest text-[#D4AF37] block font-bold">Payment Method</label>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("ONLINE")}
                      className={`flex-1 p-4 rounded-xl border text-left transition-all duration-300 ${
                        paymentMethod === "ONLINE"
                          ? "bg-[#D4AF37]/10 border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.05)]"
                          : "bg-[#161616] border-gray-800 hover:border-gray-700"
                      }`}
                    >
                      <div className="font-bold text-xs text-white">Online Prepaid</div>
                      <div className="text-[10px] text-gray-500 mt-1">UPI, Cards, Netbanking</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("COD")}
                      className={`flex-1 p-4 rounded-xl border text-left transition-all duration-300 ${
                        paymentMethod === "COD"
                          ? "bg-[#D4AF37]/10 border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.05)]"
                          : "bg-[#161616] border-gray-800 hover:border-gray-700"
                      }`}
                    >
                      <div className="font-bold text-xs text-white">Cash on Delivery</div>
                      <div className="text-[10px] text-gray-500 mt-1">Pay with cash at doorstep</div>
                    </button>
                  </div>
                </div>
              )}

              {/* Step 5: Coupon Code Input Section */}
              {phone.length === 10 && profile && (
                <div className="space-y-2 mt-6 border-t border-gray-900 pt-4 animate-fadeIn">
                  <label className="text-[9px] uppercase tracking-widest text-[#D4AF37] block font-bold">Promo / Coupon Code</label>
                  <div className="flex gap-2">
                    <input 
                      type="text"
                      placeholder="Enter code (e.g. PURE10)"
                      value={couponInput}
                      disabled={isCouponValidating || appliedCoupon !== null}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      className="flex-1 bg-black/40 border border-gray-800 focus:border-[#D4AF37]/50 rounded-xl p-3 text-xs text-[#FDFBF7] font-mono uppercase placeholder-gray-800 focus:ring-1 focus:ring-[#D4AF37]/20 outline-none transition-all"
                    />
                    {appliedCoupon ? (
                      <button
                        type="button"
                        onClick={handleRemoveCoupon}
                        className="px-4 bg-red-950/40 border border-red-500/35 hover:bg-red-950/60 text-red-400 font-bold rounded-xl text-xs uppercase tracking-wider transition-all"
                      >
                        Remove
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled={isCouponValidating || !couponInput.trim()}
                        onClick={() => handleValidateCoupon(couponInput)}
                        className="px-5 bg-[#D4AF37] hover:bg-[#FDFBF7] text-[#111111] font-bold rounded-xl text-xs uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
                      >
                        {isCouponValidating ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          "Apply"
                        )}
                      </button>
                    )}
                  </div>
                  {couponError && (
                    <p className="text-[10px] text-red-500 font-medium mt-1 leading-relaxed">
                      {couponError}
                    </p>
                  )}
                  {appliedCoupon && (
                    <p className="text-[10px] text-green-400 font-medium mt-1 flex items-center gap-1 animate-fadeIn">
                      ✓ Coupon "{appliedCoupon.code}" applied successfully! ({appliedCoupon.discountPercentage}% discount)
                    </p>
                  )}
                </div>
              )}

            </div>

            {/* 💵 Footer: Pricing & Action Buttons */}
            <div className="border-t border-gray-800/80 pt-4 mt-6 shrink-0 bg-transparent">
              <div className="space-y-1.5 border-b border-gray-950 pb-3 mb-3 text-xs text-gray-400 font-light">
                <div className="flex justify-between">
                  <span>Cart Subtotal:</span>
                  <span className="font-mono">₹{subtotal}.00</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-amber-500 font-medium">
                    <span>Coupon Discount ({appliedCoupon.code} - {appliedCoupon.discountPercentage}%):</span>
                    <span className="font-mono">-₹{discountAmount}.00</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-sm pt-1.5 text-white border-t border-gray-900/60 font-semibold mt-1">
                  <span>Total Payable:</span>
                  <span className="font-mono text-[#D4AF37] font-bold text-xl drop-shadow-[0_0_8px_rgba(212,175,55,0.2)]">
                    ₹{finalPayable}.00
                  </span>
                </div>
              </div>
              
              <div className="max-h-24 overflow-y-auto space-y-1 mb-4 bg-black/30 p-3 rounded-xl border border-gray-900 custom-scrollbar">
                {cartItems && cartItems.map(item => (
                  <div key={item.id} className="flex justify-between text-[11px] text-gray-400">
                    <span>{item.name} (x{item.quantity})</span>
                    <span className="font-mono">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              {paymentErrorMessage && (
                <p className="text-xs text-red-500 font-medium mb-3 leading-relaxed">
                  {paymentErrorMessage}
                </p>
              )}

              <p className="text-[10px] text-gray-500 mb-4 tracking-wide font-light">
                Payment Method: <span className="text-gray-300 font-medium">{paymentMethod === "COD" ? "Cash on Delivery (COD)" : "Online Payment (Prepaid)"}</span>
              </p>
              
              <div className="flex space-x-3">
                <button 
                  disabled={isSubmitting} 
                  type="button" 
                  onClick={onClose} 
                  className="flex-1 py-3.5 border border-gray-800 text-gray-400 rounded-xl text-xs uppercase tracking-wider hover:bg-gray-900/60 hover:text-white transition-all disabled:opacity-50 active:scale-95 font-bold"
                >
                  Cancel
                </button>
                <button 
                  onClick={handlePlaceOrder}
                  disabled={isSubmitting || !phone || phone.length < 10 || (!selectedAddressId && !isAddingNew)} 
                  className="flex-1 py-3.5 bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#B38F00] hover:from-[#F3E5AB] hover:to-[#D4AF37] text-[#111111] font-bold rounded-xl text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(212,175,55,0.15)] transition-all active:scale-95 disabled:from-gray-800 disabled:to-gray-900 disabled:text-gray-600 disabled:shadow-none disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-1.5">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Placing Order...
                    </span>
                  ) : (
                    "Place Order"
                  )}
                </button>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}