"use client";
import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle2, ArrowRight, MapPin, Plus, Loader2, Home, Briefcase, Map, CreditCard } from 'lucide-react'; 
import { API_ENDPOINTS } from '@/apis/api';
import { fetchCustomerProfile, addCustomerAddress, CustomerProfile, Address, AddressType } from '@/apis/customerProfile';
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
  };

  // 🔄 Reset states on close
  useEffect(() => {
    if (!isOpen) {
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
    }
  }, [isOpen]);

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
    } finally {
      setIsLoadingProfile(false);
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

    if (!fullName.trim() || !nameRegex.test(fullName.trim())) {
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
        address: finalAddress,
        pincode: finalPincode,
        cityState: finalCityState,
        totalAmount: subtotal,
        orderStatus: paymentMethod === "COD" ? "CONFIRMED" : "PENDING",
        paymentStatus: paymentMethod === "COD" ? "COD" : "PENDING",
        orderItems: mappedOrderItems,
        latitude: finalLat,
        longitude: finalLng
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
      showToast("Failed to connect with Server. Please check your inventory or try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

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
    } catch (error) {
      console.error("Simulated Checkout Error:", error);
      setPaymentErrorMessage("Payment verification failed on the server. Please try again.");
      setSimulatingUpiApp(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePayClick = () => {
    if (paymentTab === "UPI") {
      if (!selectedUpiApp) return;
      setUpiCountdown(3);
      setSimulatingUpiApp(selectedUpiApp);
    } else {
      handleSimulatedPaymentSuccess();
    }
  };

  const handleSimulatedPaymentCancel = () => {
    setShowPaymentSimulator(false);
    setTempOrderPayload(null);
    setSimulatingUpiApp(null);
    setSelectedUpiApp(null);
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
      
      <div className="relative w-full max-w-lg bg-[#111111] text-[#FDFBF7] rounded-2xl p-8 border border-gray-800/80 shadow-2xl z-10 max-h-[90vh] flex flex-col transition-all duration-500">
        
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
                <h4 className="font-serif text-xl font-bold tracking-wide text-white">Opening {simulatingUpiApp}...</h4>
                <p className="text-xs text-gray-400 max-w-xs mx-auto leading-relaxed font-light">
                  We have sent a transaction request of <strong>₹{subtotal}.00</strong> to your mobile app. Please verify and approve it on your phone.
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
                <p className="text-2xl font-mono font-bold text-white">₹{subtotal}.00</p>
                <div className="text-[10px] text-gray-500">Simulated Test Mode</div>
              </div>

              {paymentTab === "UPI" ? (
                <div className="max-w-sm mx-auto space-y-4">
                  <div className="grid grid-cols-3 gap-2.5">
                    <div 
                      onClick={() => setSelectedUpiApp("PhonePe")} 
                      className={`bg-[#161616] border p-3.5 rounded-xl cursor-pointer transition-all flex flex-col items-center gap-1.5 active:scale-95 ${
                        selectedUpiApp === "PhonePe" ? "border-[#D4AF37] bg-[#D4AF37]/5" : "border-gray-800 hover:border-gray-700"
                      }`}
                    >
                      <div className="h-6 w-6 rounded-full bg-indigo-600/10 flex items-center justify-center font-bold text-[9px] text-indigo-400">PP</div>
                      <span className="text-[9px] font-bold text-gray-400">PhonePe</span>
                    </div>
                    <div 
                      onClick={() => setSelectedUpiApp("Google Pay")} 
                      className={`bg-[#161616] border p-3.5 rounded-xl cursor-pointer transition-all flex flex-col items-center gap-1.5 active:scale-95 ${
                        selectedUpiApp === "Google Pay" ? "border-[#D4AF37] bg-[#D4AF37]/5" : "border-gray-800 hover:border-gray-700"
                      }`}
                    >
                      <div className="h-6 w-6 rounded-full bg-blue-600/10 flex items-center justify-center font-bold text-[9px] text-blue-400">GP</div>
                      <span className="text-[9px] font-bold text-gray-400">Google Pay</span>
                    </div>
                    <div 
                      onClick={() => setSelectedUpiApp("Paytm")} 
                      className={`bg-[#161616] border p-3.5 rounded-xl cursor-pointer transition-all flex flex-col items-center gap-1.5 active:scale-95 ${
                        selectedUpiApp === "Paytm" ? "border-[#D4AF37] bg-[#D4AF37]/5" : "border-gray-800 hover:border-gray-700"
                      }`}
                    >
                      <div className="h-6 w-6 rounded-full bg-cyan-600/10 flex items-center justify-center font-bold text-[9px] text-cyan-400">PT</div>
                      <span className="text-[9px] font-bold text-gray-400">Paytm</span>
                    </div>
                  </div>

                  <div className="text-left bg-[#161616]/40 p-4 rounded-xl border border-gray-800/40 space-y-2">
                    <label className="text-[9px] uppercase tracking-widest text-gray-500 block font-bold">Or Enter UPI ID</label>
                    <input type="text" disabled value="customer@okaxis" className="w-full bg-black/60 border border-gray-800 rounded-lg p-2.5 text-xs text-gray-400 font-mono focus:outline-none" />
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
                  disabled={isSubmitting}
                  onClick={handlePayClick}
                  className="flex-1 py-3.5 bg-[#D4AF37] text-[#111111] font-bold rounded-lg text-xs uppercase tracking-wider hover:bg-[#FDFBF7] transition-all active:scale-95 disabled:bg-gray-700 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Authorizing...</span>
                    </>
                  ) : (
                    <span>Pay ₹{subtotal}.00</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        ) : (
          
          /* 📦 Smart Shipping Flow */
          <div className="flex flex-col h-full max-h-full overflow-hidden">
            <h3 className="font-serif text-2xl font-bold tracking-wide text-[#D4AF37] border-b border-gray-800 pb-4 shrink-0">
              Shipping Information
            </h3>
            
            <div className="mt-6 space-y-6 overflow-y-auto flex-1 pr-2 custom-scrollbar">
              
              {/* Step 1: Contact Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[9px] uppercase tracking-widest text-[#D4AF37] block mb-1.5 font-bold">Phone Number</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 font-mono">+91</span>
                    <input 
                      required type="tel" maxLength={10} value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                      className="w-full bg-[#161616] border border-gray-800 rounded-lg pl-10 pr-3 py-3 text-sm text-[#FDFBF7] focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/20 outline-none transition-all placeholder-gray-700" placeholder="10-digit number" 
                    />
                    {isLoadingProfile && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-[#D4AF37]" />}
                  </div>
                </div>
                <div>
                  <label className="text-[9px] uppercase tracking-widest text-[#D4AF37] block mb-1.5 font-bold">Full Name</label>
                  <input 
                    required type="text" value={fullName} onChange={(e) => setFullName(e.target.value.replace(/[^a-zA-Z\s]/g, ""))}
                    className="w-full bg-[#161616] border border-gray-800 rounded-lg p-3 text-sm text-[#FDFBF7] focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/20 outline-none transition-all placeholder-gray-700" placeholder="Enter your name" 
                  />
                </div>
              </div>

              {/* Locked/Guidance State */}
              {phone.length < 10 && (
                <div className="bg-[#161616]/50 border border-gray-800/40 rounded-2xl p-6 text-center space-y-3 opacity-60">
                  <MapPin className="h-8 w-8 text-gray-600 mx-auto" />
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Delivery Destination</h4>
                  <p className="text-[11px] text-gray-500 max-w-xs mx-auto leading-relaxed">
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
                          <div className="flex items-start gap-3">
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
                    <label className="text-[10px] uppercase tracking-widest text-[#D4AF37] block font-bold">Delivery Address</label>
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
                  
                  <div className="space-y-4 bg-[#161616] p-5 rounded-2xl border border-gray-800/80 shadow-inner">
                    {/* Address Type Selection */}
                    <div>
                      <label className="text-[9px] uppercase tracking-widest text-gray-500 block mb-2 font-bold">Address Type</label>
                      <div className="flex gap-2">
                        {['HOME', 'OFFICE', 'OTHER'].map((type) => (
                          <button 
                            key={type} 
                            type="button" 
                            onClick={() => setNewAddress({...newAddress, addressType: type as AddressType})} 
                            className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all duration-200 ${
                              newAddress.addressType === type 
                                ? "bg-[#D4AF37] text-black border-[#D4AF37]" 
                                : "bg-black text-gray-400 border-gray-800 hover:border-gray-700"
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Full Address */}
                    <div className="relative">
                      <label className="text-[9px] uppercase tracking-widest text-gray-500 block mb-1 font-bold">Full Address</label>
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
                        className="w-full bg-black border border-gray-800 rounded-lg p-3 text-sm text-[#FDFBF7] placeholder-gray-700 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/20 outline-none transition-all" 
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

                    {/* City and State Grid */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[9px] uppercase tracking-widest text-gray-500 block mb-1.5 font-bold">City</label>
                        <input 
                          required 
                          type="text" 
                          placeholder="City" 
                          value={newAddress.city} 
                          onChange={(e) => setNewAddress({...newAddress, city: e.target.value.replace(/[^a-zA-Z\s]/g, "")})} 
                          className="w-full bg-black border border-gray-800/80 rounded-lg p-3 text-sm text-[#FDFBF7] placeholder-gray-700 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/20 outline-none transition-all" 
                        />
                      </div>
                      <div>
                        <label className="text-[9px] uppercase tracking-widest text-gray-500 block mb-1.5 font-bold">State</label>
                        <input 
                          required 
                          type="text" 
                          placeholder="State" 
                          value={newAddress.state} 
                          onChange={(e) => setNewAddress({...newAddress, state: e.target.value.replace(/[^a-zA-Z\s]/g, "")})} 
                          className="w-full bg-black border border-gray-800/80 rounded-lg p-3 text-sm text-[#FDFBF7] placeholder-gray-700 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/20 outline-none transition-all" 
                        />
                      </div>
                    </div>

                    {/* Pincode */}
                    <div>
                      <label className="text-[9px] uppercase tracking-widest text-gray-500 block mb-1 font-bold">Pincode</label>
                      <input 
                        required 
                        type="text" 
                        placeholder="6-digit pincode" 
                        maxLength={6} 
                        value={newAddress.pincode} 
                        onChange={(e) => setNewAddress({...newAddress, pincode: e.target.value.replace(/\D/g, "")})} 
                        className="w-full bg-black border border-gray-800 rounded-lg p-3 text-sm text-[#FDFBF7] font-mono placeholder-gray-700 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/20 outline-none transition-all" 
                      />
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

            </div>

            {/* 💵 Footer: Pricing & Action Buttons */}
            <div className="border-t border-gray-800 pt-4 mt-6 shrink-0 bg-[#111111]">
              <div className="flex justify-between text-sm mb-2 text-gray-400">
                <span>Total Payable:</span>
                <span className="font-mono text-[#FDFBF7] font-bold text-lg">₹{subtotal}.00</span>
              </div>
              
              <div className="max-h-24 overflow-y-auto space-y-1 mb-4 bg-black/20 p-2 rounded-lg border border-gray-900 custom-scrollbar">
                {cartItems && cartItems.map(item => (
                  <div key={item.id} className="flex justify-between text-[11px] text-gray-500">
                    <span>{item.name} (x{item.quantity})</span>
                    <span>₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              {paymentErrorMessage && (
                <p className="text-xs text-red-500 font-medium mb-3 leading-relaxed">
                  {paymentErrorMessage}
                </p>
              )}

              <p className="text-[10px] text-gray-500 mb-4">
                Payment Method: {paymentMethod === "COD" ? "Cash on Delivery (COD)" : "Online Payment (Prepaid)"}
              </p>
              
              <div className="flex space-x-3">
                <button disabled={isSubmitting} type="button" onClick={onClose} className="flex-1 py-3.5 border border-gray-800 text-gray-400 rounded-lg text-xs uppercase tracking-wider hover:bg-gray-900 transition-colors disabled:opacity-50">
                  Cancel
                </button>
                <button 
                  onClick={handlePlaceOrder}
                  disabled={isSubmitting || !phone || phone.length < 10 || (!selectedAddressId && !isAddingNew)} 
                  className="flex-1 py-3.5 bg-[#D4AF37] text-[#111111] font-bold rounded-lg text-xs uppercase tracking-wider hover:bg-[#FDFBF7] transition-all active:scale-95 disabled:bg-gray-700 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Placing Order..." : "Place Order"}
                </button>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}