"use client";
import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle2, ArrowRight, MapPin, Plus, Loader2, Home, Briefcase, Map, CreditCard, Trash2, X, User, Lock as LockIcon, ChevronRight } from 'lucide-react'; 
import { CustomerService, CustomerProfile, Address, AddressType } from '@/services/customerService';
import { apiClient } from '@/apis/apiClient';
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
    lng: 77.2301
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

  // Ã°Å¸â€˜Â¤ Smart Profiling States
  const [phone, setPhone] = useState("");
  const [fullName, setFullName] = useState("");
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);

  // Ã°Å¸â€Â OTP Verification States
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", ""]);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [showFinalOtpGate, setShowFinalOtpGate] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<1 | 2 | 3 | 4>(1);
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
  const [isAddingNew, setIsAddingNew] = useState(true);
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
  const [deletingAddressId, setDeletingAddressId] = useState<number | null>(null);
  
  // Ã°Å¸Å½Å¸Ã¯Â¸Â Coupon & Discount States
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
  };

  const [isResolvingPincode, setIsResolvingPincode] = useState(false);

  const handlePincodeChange = async (pin: string) => {
    const cleanPin = pin.replace(/\D/g, "").slice(0, 6);
    setNewAddress(prev => ({ ...prev, pincode: cleanPin }));

    if (cleanPin.length === 6) {
      setIsResolvingPincode(true);
      try {
        const res = await fetch(`https://api.postalpincode.in/pincode/${cleanPin}`);
        if (res.ok) {
          const data = await res.json();
          if (data && data[0] && data[0].Status === "Success" && data[0].PostOffice && data[0].PostOffice[0]) {
            const office = data[0].PostOffice[0];
            setNewAddress(prev => ({
              ...prev,
              city: office.District || office.Division || prev.city,
              state: office.State || prev.state
            }));
          }
        }
      } catch (err) {
        console.warn("Pincode auto-resolution failed:", err);
      } finally {
        setIsResolvingPincode(false);
      }
    }
  };

  // Ã°Å¸â€â€ž Reset states on close
  useEffect(() => {
    if (!isOpen) {
      Promise.resolve().then(() => {
        setPhone("");
        setFullName("");
        setProfile(null);
        setSelectedAddressId(null);
        setIsAddingNew(true);
        setShowFinalOtpGate(false);
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
        setIsPhoneVerified(false);
        setOtpSent(false);
        setOtpCode("");
        setOtpDigits(["", "", "", ""]);
        setPaymentMethod("ONLINE");
        setShowPaymentSimulator(false);
        setPaymentErrorMessage(null);
        setTempOrderPayload(null);
        setPaymentTab("UPI");
        setSelectedUpiApp(null);
        setSimulatingUpiApp(null);
        setCustomUpiId("");
        setAlternativePhone("");
        setCheckoutStep(1);
      });
    }
  }, [isOpen]);

  // Ã°Å¸Å½Å¸Ã¯Â¸Â Auto-Apply Coupon from LocalStorage on open
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
      const data = await CustomerService.validateCoupon(codeToValidate.trim().toUpperCase(), phone, subtotal);
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
    ? appliedCoupon.discountType === 'PERCENTAGE'
      ? Math.round((subtotal * appliedCoupon.discountValue) / 100)
      : appliedCoupon.discountValue
    : 0;
  const finalPayable = subtotal - discountAmount;

  const handleSimulatedPaymentSuccess = async () => {
    if (!tempOrderPayload) return;
    setIsSubmitting(true);
    setPaymentErrorMessage(null);

    // If tempOrderPayload already has an id (placed via triggerRazorpayCheckout), verify payment signature
    if (tempOrderPayload.id) {
      try {
        await apiClient("/api/v1/payments/verify-signature", {
          method: "POST",
          body: JSON.stringify({
            orderId: tempOrderPayload.id.toString(),
            razorpay_order_id: `order_mock_${tempOrderPayload.id}`,
            razorpay_payment_id: `pay_mock_${Date.now()}`,
            razorpay_signature: "mock_sig_valid",
          }),
        });
        setPlacedOrderId(tempOrderPayload.id);
        setShowPaymentSimulator(false);
        setSimulatingUpiApp(null);
        setSelectedUpiApp(null);
        setCustomUpiId("");
        showToast("Payment Successful! Order Confirmed.", "success");
      } catch (error) {
        console.error("Signature verification error:", error);
        setPlacedOrderId(tempOrderPayload.id);
        setShowPaymentSimulator(false);
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    const finalPayload = {
      ...tempOrderPayload,
      paymentStatus: "COMPLETED",
      orderStatus: "CONFIRMED",
      paymentTransactionId: "txn_sim_" + Math.random().toString(36).substring(2, 10).toUpperCase()
    };

    try {
      console.log("Placing Prepaid paid order via API...");
      const savedOrder = await CustomerService.placeOrder(finalPayload);
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

  // Ã¢ÂÂ³ UPI Simulation Countdown Timer Hook
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

  const handleSendOtp = async () => {
    // Ã°Å¸â€ºÂ¡Ã¯Â¸Â Frontend validation: only valid Indian mobile numbers (starting with 6-9)
    const indianMobileRegex = /^[6-9]\d{9}$/;
    if (!indianMobileRegex.test(phone)) {
      showToast("Please enter a valid 10-digit mobile number starting with 6-9", "error");
      return;
    }

    setIsSendingOtp(true);
    try {
      await CustomerService.sendOtp(phone);
      setOtpSent(true);
      setOtpCode("");
      setOtpDigits(["", "", "", ""]);
      setCheckoutStep(2); // Go to Step 2: OTP Input
      showToast("OTP sent successfully to your phone number!", "success");
    } catch (error) {
      console.error("Send OTP failed:", error);
      const msg = error instanceof Error ? error.message : "Failed to send verification code. Please try again.";
      showToast(msg, "error");
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    // Derive OTP directly from otpDigits at call-time to avoid stale state
    // from the async useEffect that syncs otpDigits → otpCode
    const currentOtp = otpDigits.join("").trim();

    if (currentOtp.length !== 4) {
      showToast("Please enter the complete 4-digit verification code.", "error");
      return;
    }

    setIsVerifyingOtp(true);
    try {
      const data = await CustomerService.verifyOtp(phone, currentOtp);
      setProfile(data);
      if (data.fullName) setFullName(data.fullName);
      
      if (data.addresses && data.addresses.length > 0) {
        const defaultAddr = data.addresses.find(a => a.isDefault) || data.addresses[0];
        setSelectedAddressId(defaultAddr.id!);
        setIsAddingNew(false);
      } else {
        setIsAddingNew(true);
      }
      setIsPhoneVerified(true);
      setCheckoutStep(3); // Go to Step 3: Shipping Details
      showToast("Phone number verified successfully!", "success");
    } catch (error) {
      console.error("OTP verification failed:", error);
      const msg = error instanceof Error ? error.message : "Invalid OTP code. Please try again.";
      showToast(msg, "error");
    } finally {
      setIsVerifyingOtp(false);
    }
  };


  const handleDeleteAddress = (addressId: number) => {
    setDeletingAddressId(addressId);
  };

  const performAddressDelete = async (addressId: number) => {
    try {
      const updatedProfile = await CustomerService.deleteAddress(phone, addressId);
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

  // Ã°Å¸â€â€ž Reset verification if phone changes
  useEffect(() => {
    setIsPhoneVerified(false);
    setOtpSent(false);
    setOtpCode("");
    setOtpDigits(["", "", "", ""]);
    setProfile(null);
    setSelectedAddressId(null);
  }, [phone]);

  // Ã°Å¸â€â€ž Sync otpCode with otpDigits array
  useEffect(() => {
    setOtpCode(otpDigits.join(""));
  }, [otpDigits]);

  const handleOtpDigitChange = (index: number, val: string) => {
    const cleanVal = val.replace(/\D/g, "").slice(-1);
    const newDigits = [...otpDigits];
    newDigits[index] = cleanVal;
    setOtpDigits(newDigits);

    // Auto-focus next input
    if (cleanVal && index < 3) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) (nextInput as HTMLInputElement).focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      if (prevInput) {
        (prevInput as HTMLInputElement).focus();
        const newDigits = [...otpDigits];
        newDigits[index - 1] = "";
        setOtpDigits(newDigits);
      }
    }
  };

  // Ã°Å¸â€â€ž Sync abandoned cart to backend database
  useEffect(() => {
    if (phone.length === 10 && cartItems && cartItems.length > 0) {
      const triggerSync = async () => {
        try {
          await CustomerService.syncCart({
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

  // Ã°Å¸â€™Â³ Razorpay Official Checkout SDK & Gateway Handler
  const triggerRazorpayCheckout = async (orderPayload: any) => {
    try {
      setIsSubmitting(true);

      // 1. Place order on backend first (Status: PENDING)
      console.log("Placing initial order for online payment...");
      const savedOrder = await CustomerService.placeOrder(orderPayload);

      const rzpKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "";
      const isRealKeyConfigured = rzpKey.startsWith("rzp_test_") || rzpKey.startsWith("rzp_live_");

      if (isRealKeyConfigured) {
        // Load Razorpay script dynamically
        const scriptLoaded = await new Promise<boolean>((resolve) => {
          if (typeof window !== "undefined" && (window as any).Razorpay) {
            resolve(true);
            return;
          }
          const script = document.createElement("script");
          script.src = "https://checkout.razorpay.com/v1/checkout.js";
          script.onload = () => resolve(true);
          script.onerror = () => resolve(false);
          document.body.appendChild(script);
        });

        if (scriptLoaded) {
          let razorpayOrderId = "";
          try {
            const sessionRes = await apiClient<{ sessionUrl?: string; error?: string }>(
              `/api/v1/payments/create-session/${savedOrder.id}`,
              { method: "POST" }
            );
            if (sessionRes && sessionRes.sessionUrl && !sessionRes.sessionUrl.includes("mock")) {
              razorpayOrderId = sessionRes.sessionUrl;
            }
          } catch (err) {
            console.warn("Could not fetch backend Razorpay session.", err);
          }

          const options = {
            key: rzpKey,
            amount: Math.round(orderPayload.totalAmount * 100), // in paise
            currency: "INR",
            name: "MadhurGram",
            description: `Order #MG-000${savedOrder.id} - Pure Village Crafted Essentials`,
            order_id: razorpayOrderId.startsWith("order_") ? razorpayOrderId : undefined,
            prefill: {
              name: fullName,
              contact: phone,
            },
            notes: {
              order_id: savedOrder.id.toString(),
              customer_name: fullName,
              phone: phone,
            },
            theme: {
              color: "#D4AF37", // Gold theme
            },
            handler: async function (response: any) {
              console.log("Razorpay Checkout completed successfully on client:", response);
              try {
                await apiClient("/api/v1/payments/verify-signature", {
                  method: "POST",
                  body: JSON.stringify({
                    orderId: savedOrder.id.toString(),
                    razorpay_order_id: response.razorpay_order_id || razorpayOrderId,
                    razorpay_payment_id: response.razorpay_payment_id || `pay_${Date.now()}`,
                    razorpay_signature: response.razorpay_signature || "mock_sig",
                  }),
                });
                setPlacedOrderId(savedOrder.id);
                showToast("Payment Successful! Order Confirmed.", "success");
              } catch (err) {
                console.error("Signature verification error:", err);
                setPlacedOrderId(savedOrder.id);
              } finally {
                setIsSubmitting(false);
              }
            },
            modal: {
              ondismiss: function () {
                setIsSubmitting(false);
                showToast("Payment cancelled. You can retry anytime.", "info");
              },
            },
          };

          const razorpayModal = new (window as any).Razorpay(options);
          razorpayModal.open();
          return;
        }
      }

      // If mock key or dev mode, launch Interactive Gateway Simulator (PhonePe / GPay / Cards)
      console.log("Launching Interactive Payment Gateway Simulator for PhonePe/GPay/Cards...");
      setTempOrderPayload({ ...orderPayload, id: savedOrder.id });
      setShowPaymentSimulator(true);
      setPaymentErrorMessage(null);
      setIsSubmitting(false);
    } catch (err) {
      console.error("Razorpay Checkout Error:", err);
      showToast(err instanceof Error ? err.message : "Razorpay payment initialization failed.", "error");
      setIsSubmitting(false);
    }
  };

  // Ã°Å¸Å¡â‚¬ Ã Â¤Â«Ã Â¤Â¾Ã Â¤â€¡Ã Â¤Â¨Ã Â¤Â² Ã Â¤ÂªÃ Â¥ÂÃ Â¤Â²Ã Â¥â€¡Ã Â¤Â¸ Ã Â¤â€ Ã Â¤Â°Ã Â¥ÂÃ Â¤Â¡Ã Â¤Â° Ã Â¤Â²Ã Â¥â€°Ã Â¤Å“Ã Â¤Â¿Ã Â¤_ (Unified Single-Click Address Save + Checkout)
  const handlePlaceOrder = async () => {
    const nameRegex = /^[a-zA-Z\s]{2,50}$/;
    const locationRegex = /^[a-zA-Z\s]{2,40}$/;

    if (isAddingNew) {
      if (!fullName.trim()) {
        showToast("Please enter your Full Name.", "error");
        return;
      }
      if (!nameRegex.test(fullName.trim())) {
        showToast("Full Name must contain letters only (at least 2 characters).", "error");
        return;
      }
    }
    if (!phone || phone.length < 10) {
      showToast("Please enter a valid 10-digit phone number.", "error");
      return;
    }

    if (isAddingNew) {
      if (!newAddress.fullAddress.trim() || !newAddress.city.trim() || !newAddress.state.trim() || !newAddress.pincode.trim()) {
        showToast("Please fill in all address details.", "error");
        return;
      }
      if (!locationRegex.test(newAddress.city.trim())) {
        showToast("City name must contain only letters (at least 2 characters).", "error");
        return;
      }
      if (!locationRegex.test(newAddress.state.trim())) {
        showToast("State name must contain only letters (at least 2 characters).", "error");
        return;
      }
      if (newAddress.pincode.trim().length !== 6) {
        showToast("Pincode must be exactly 6 digits.", "error");
        return;
      }
    } else {
      if (!selectedAddressId) {
        showToast("Please select a delivery address first.", "error");
        return;
      }
    }

    // Ã°Å¸â€Â Gated verification check at final submit
    if (!isPhoneVerified) {
      setIsSubmitting(true);
      try {
        await CustomerService.sendOtp(phone);
        setOtpSent(true);
        setOtpCode("");
        setShowFinalOtpGate(true);
        showToast("Verification code sent to your phone!", "success");
      } catch (error) {
        console.error("Send OTP failed:", error);
        const msg = error instanceof Error ? error.message : "Failed to send verification OTP.";
        showToast(msg, "error");
      } finally {
        setIsSubmitting(false);
      }
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

        console.log("Saving new address to customer profile...");
        const updatedProfile = await CustomerService.addAddress(phone, newAddress);
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

      const resolvedName = fullName.trim() || (profile?.fullName ? profile.fullName.trim() : "") || "Customer";

      const orderPayload = {
        customerName: resolvedName,
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
        await triggerRazorpayCheckout(orderPayload);
        return;
      }

      console.log("Placing COD order via API...");
      const savedOrder = await CustomerService.placeOrder(orderPayload);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center max-sm:items-end p-4 max-sm:p-0 bg-black/75 backdrop-blur-sm transition-all duration-300">
      <div className="absolute inset-0" onClick={!placedOrderId && !isSubmitting ? onClose : undefined} />
      
      <div className="relative w-full max-w-4xl bg-[#121212] text-[#F5F5F5] rounded-[28px] max-sm:rounded-t-3xl max-sm:rounded-b-none p-4 sm:p-8 border border-[#D4AF37]/25 shadow-[0_20px_60px_-15px_rgba(212,175,55,0.25)] z-10 max-sm:h-[92vh] max-sm:max-h-[92vh] sm:max-h-[90vh] flex flex-col transition-all duration-500 max-sm:animate-slideUpMobile overflow-hidden">
        
        {/* Top Right Close Button */}
        {!placedOrderId && !isSubmitting && (
          <button 
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-full bg-[#1A1A1A] border border-gray-800 text-gray-400 hover:text-white hover:bg-gray-800 transition-colors z-20 shadow-sm cursor-pointer"
            title="Close Checkout"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        )}
        
        {/* Ã°Å¸Å½â€° Success Screen */}
        {placedOrderId ? (
          <div className="flex flex-col items-center text-center py-6 animate-fadeIn overflow-y-auto">
            <div className="h-20 w-20 rounded-full bg-[#D4AF37]/10 flex items-center justify-center mb-6 border border-[#D4AF37]/30 text-[#8C6B1C] animate-bounce">
              <CheckCircle2 className="h-12 w-12" />
            </div>
            <span className="text-[10px] font-bold tracking-[0.3em] text-[#8C6B1C] uppercase">Order Confirmed</span>
            <h3 className="font-serif text-3xl font-bold tracking-wide mt-2 text-[#111111]">Aapka Koshish, Hamara Vaada!</h3>
            <div className="mt-4 bg-[#FAF6EC] border border-[#EAE3D1] px-6 py-3 rounded-xl font-mono text-xs text-gray-700">
              Order ID: <span className="text-[#8C6B1C] font-bold">MG-000{placedOrderId}</span>
            </div>
            <p className="text-xs text-gray-600 max-w-sm mt-6 leading-relaxed font-light">
              Thank you for supporting traditional village artisans. Your batch of pure, handcrafted essentials is being securely packed at our MadhurGram facility and will be dispatched shortly.
            </p>
            <button 
              onClick={handleFinalClose}
              className="mt-8 w-full py-4 bg-[#D4AF37] text-[#111111] font-bold rounded-lg text-xs uppercase tracking-widest flex items-center justify-center space-x-2 hover:bg-[#111111] hover:text-[#FDFBF7] transition-all group active:scale-95 cursor-pointer shadow-sm"
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
                <div className="h-16 w-16 rounded-full bg-[#D4AF37]/25 border border-[#D4AF37]/45 flex items-center justify-center text-[#8C6B1C]">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              </div>
              
              <div className="space-y-2">
                <span className="text-[9px] font-bold tracking-[0.2em] text-[#8C6B1C] uppercase">Secure Processing</span>
                <h4 className="font-serif text-xl font-bold tracking-wide text-[#111111]">
                  {selectedUpiApp ? `Opening ${selectedUpiApp}...` : `Request Sent`}
                </h4>
                <p className="text-xs text-gray-600 max-w-xs mx-auto leading-relaxed font-light">
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

              <div className="bg-[#FAF6EC] px-6 py-2 border border-[#EAE3D1] rounded-full font-mono text-[10px] text-gray-600 shadow-sm">
                Verifying transaction status in <span className="text-[#8C6B1C] font-bold">{upiCountdown}s</span>...
              </div>
            </div>

            <button
              onClick={handleSimulatedPaymentCancel}
              className="mt-6 w-full py-3.5 border border-gray-200 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg text-xs uppercase tracking-widest transition-colors font-bold cursor-pointer"
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
              <div className="bg-[#FAF6EC] border border-[#EAE3D1] p-5 rounded-2xl max-w-sm mx-auto space-y-3 shadow-sm">
                <span className="text-[9px] uppercase tracking-widest text-[#8C6B1C] block font-bold">MadhurGram Checkout</span>
                <p className="text-2xl font-mono font-bold text-[#111111]">₹{finalPayable}.00</p>
                <div className="text-[10px] text-gray-500 font-medium">Simulated Test Mode</div>
              </div>

              {paymentTab === "UPI" ? (
                <div className="max-w-sm mx-auto space-y-4">
                  <div className="grid grid-cols-3 gap-2.5">
                    <div 
                      onClick={() => {
                        setSelectedUpiApp("PhonePe");
                        setCustomUpiId("");
                      }} 
                      className={`bg-white border p-3.5 rounded-xl cursor-pointer transition-all flex flex-col items-center gap-2.5 active:scale-95 ${
                        selectedUpiApp === "PhonePe" ? "border-[#D4AF37] bg-[#FAF6EC] shadow-sm" : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="h-10 w-10 rounded-lg bg-white flex items-center justify-center shadow-sm shrink-0 border border-gray-100">
                        <svg viewBox="0 0 100 100" className="w-8 h-8" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect width="100" height="100" rx="20" fill="#5F259F"/>
                          <path d="M50 20C33.4 20 20 33.4 20 50C20 66.6 33.4 80 50 80C66.6 80 80 66.6 80 50C80 33.4 66.6 20 50 20ZM53 62H42V38H53C58 38 61 40 61 44C61 48 58 50 53 50H49V56H53C55.8 56 57.5 57.5 57.5 60C57.5 61.2 57 62 53 62Z" fill="white"/>
                        </svg>
                      </div>
                      <span className="text-[10px] font-bold text-gray-700">PhonePe</span>
                    </div>
                    <div 
                      onClick={() => {
                        setSelectedUpiApp("Google Pay");
                        setCustomUpiId("");
                      }} 
                      className={`bg-white border p-3.5 rounded-xl cursor-pointer transition-all flex flex-col items-center gap-2.5 active:scale-95 ${
                        selectedUpiApp === "Google Pay" ? "border-[#D4AF37] bg-[#FAF6EC] shadow-sm" : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="h-10 w-10 rounded-lg bg-white flex items-center justify-center shadow-sm shrink-0 border border-gray-100">
                        <svg viewBox="0 0 24 24" className="w-7 h-7" xmlns="http://www.w3.org/2000/svg">
                          <path d="M21.35 11.1c0-.7-.06-1.35-.17-2H12v3.8h5.25c-.23 1.2-1 2.2-2.05 2.9v2.4h3.3c1.9-1.75 3-4.35 3-7.1z" fill="#4285F4"/>
                          <path d="M12 20.6c2.7 0 5-.9 6.6-2.4l-3.3-2.4c-.9.6-2.05 1-3.3 1-2.55 0-4.7-1.7-5.45-4H3.2v2.5c1.6 3.2 4.9 5.3 8.8 5.3z" fill="#34A853"/>
                          <path d="M6.55 12.8c-.2-.6-.3-1.25-.3-1.9s.1-1.3.3-1.9V6.5H3.2C2.4 8.1 2 9.8 2 11.6s.4 3.5 1.2 5.1l3.35-2.9z" fill="#FBBC05"/>
                          <path d="M12 6.4c1.45 0 2.75.5 3.8 1.5l2.85-2.85C16.9 3.4 14.65 2.5 12 2.5c-3.9 0-7.2 2.1-8.8 5.3l3.35 2.9c.75-2.3 2.9-4.1 5.45-4.1z" fill="#EA4335"/>
                        </svg>
                      </div>
                      <span className="text-[10px] font-bold text-gray-700">Google Pay</span>
                    </div>
                    <div 
                      onClick={() => {
                        setSelectedUpiApp("Paytm");
                        setCustomUpiId("");
                      }} 
                      className={`bg-white border p-3.5 rounded-xl cursor-pointer transition-all flex flex-col items-center gap-2.5 active:scale-95 ${
                        selectedUpiApp === "Paytm" ? "border-[#D4AF37] bg-[#FAF6EC] shadow-sm" : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="h-10 w-10 rounded-lg bg-white flex items-center justify-center shadow-sm shrink-0 border border-gray-100">
                        <span className="text-[#002970] font-black font-sans text-xs italic tracking-tighter">pay<span className="text-[#00BAF2]">tm</span></span>
                      </div>
                      <span className="text-[10px] font-bold text-gray-700">Paytm</span>
                    </div>
                  </div>

                  <div className="text-left bg-[#FAF6EC]/60 p-4 rounded-xl border border-[#EAE3D1] space-y-2">
                    <label className="text-[9px] uppercase tracking-widest text-[#8C6B1C] block font-bold">Or Enter UPI ID</label>
                    <input 
                      type="text" 
                      placeholder="e.g. customer@okaxis" 
                      value={customUpiId}
                      onChange={(e) => {
                        setCustomUpiId(e.target.value);
                        setSelectedUpiApp(null);
                      }}
                      className="w-full bg-white border border-[#EAE3D1] focus:border-[#D4AF37] rounded-lg p-2.5 text-xs text-[#111111] font-mono focus:outline-none transition-colors" 
                    />
                  </div>
                </div>
              ) : (
                <div className="text-left max-w-sm mx-auto space-y-4 bg-[#FAF6EC]/60 p-5 rounded-2xl border border-[#EAE3D1]">
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-widest text-gray-500 block font-bold">Dummy Card Number</label>
                    <input type="text" disabled value="4242 4242 4242 4242" className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-xs text-gray-500 font-mono focus:outline-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase tracking-widest text-gray-500 block font-bold">Expiry</label>
                      <input type="text" disabled value="12 / 29" className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-xs text-gray-500 font-mono focus:outline-none" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase tracking-widest text-gray-500 block font-bold">CVV</label>
                      <input type="text" disabled value="***" className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-xs text-gray-500 font-mono focus:outline-none" />
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

            <div className="border-t border-[#EAE3D1] pt-4 mt-6 shrink-0 bg-[#FCFAF6]">
              <div className="flex space-x-3">
                <button
                  disabled={isSubmitting}
                  onClick={handleSimulatedPaymentCancel}
                  className="flex-1 py-3.5 border border-gray-200 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg text-xs uppercase tracking-wider transition-colors disabled:opacity-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  disabled={isSubmitting || (paymentTab === "UPI" && !selectedUpiApp && !customUpiId.trim())}
                  onClick={handlePayClick}
                  className="flex-1 py-3.5 bg-[#D4AF37] text-[#111111] font-bold rounded-lg text-xs uppercase tracking-wider hover:bg-[#111111] hover:text-[#FDFBF7] transition-all active:scale-95 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
          /* Smart Shipping Flow */
          <div className="flex flex-col h-full max-h-full overflow-hidden relative text-[#F5F5F5] select-none min-h-0">
            
            {/* Header: Premium Progress Stepper */}
            <div className="flex items-end justify-center gap-0 mb-4 sm:mb-8 shrink-0 select-none px-2 sm:px-4">
              {/* Step 1 — Cart */}
              <div className="flex flex-col items-center gap-1">
                <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-[9px] sm:text-[10px] font-bold border-2 transition-all duration-300 ${
                  checkoutStep >= 1
                    ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#D4AF37] shadow-[0_0_10px_rgba(212,175,55,0.35)]'
                    : 'bg-[#1A1A1A] border-gray-700 text-gray-500'
                }`}>1</div>
                <span className={`hidden sm:block text-[8px] font-bold tracking-[0.12em] uppercase transition-colors duration-300 ${
                  checkoutStep >= 1 ? 'text-[#D4AF37]' : 'text-gray-600'
                }`}>Cart</span>
              </div>

              {/* Connector */}
              <div className="relative flex-1 mx-1 sm:mx-1.5 h-px bg-gray-800 overflow-hidden mb-3 sm:mb-3.5" style={{minWidth: '20px', maxWidth: '48px'}}>
                <div className={`absolute inset-0 bg-gradient-to-r from-[#D4AF37] to-[#B8960C] transition-transform duration-500 origin-left ${
                  checkoutStep >= 2 ? 'scale-x-100' : 'scale-x-0'
                }`} />
              </div>

              {/* Step 2 — Secure Checkout */}
              <div className="flex flex-col items-center gap-1">
                <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-[9px] sm:text-[10px] font-bold border-2 transition-all duration-300 ${
                  checkoutStep === 1 || checkoutStep === 2
                    ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#D4AF37] shadow-[0_0_12px_rgba(212,175,55,0.45)] scale-110'
                    : 'bg-[#1A1A1A] border-gray-700 text-gray-500'
                }`}>2</div>
                <span className={`text-[7px] sm:text-[8px] font-bold tracking-[0.1em] uppercase whitespace-nowrap transition-colors duration-300 ${
                  checkoutStep === 1 || checkoutStep === 2 ? 'text-[#D4AF37]' : 'hidden sm:block text-gray-600'
                }`}>Checkout</span>
              </div>

              {/* Connector */}
              <div className="relative flex-1 mx-1 sm:mx-1.5 h-px bg-gray-800 overflow-hidden mb-3 sm:mb-3.5" style={{minWidth: '20px', maxWidth: '48px'}}>
                <div className={`absolute inset-0 bg-gradient-to-r from-[#D4AF37] to-[#B8960C] transition-transform duration-500 origin-left ${
                  checkoutStep >= 3 ? 'scale-x-100' : 'scale-x-0'
                }`} />
              </div>

              {/* Step 3 — Payment */}
              <div className="flex flex-col items-center gap-1">
                <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-[9px] sm:text-[10px] font-bold border-2 transition-all duration-300 ${
                  checkoutStep === 3
                    ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#D4AF37] shadow-[0_0_12px_rgba(212,175,55,0.45)] scale-110'
                    : 'bg-[#1A1A1A] border-gray-700 text-gray-500'
                }`}>3</div>
                <span className={`text-[7px] sm:text-[8px] font-bold tracking-[0.1em] uppercase transition-colors duration-300 ${
                  checkoutStep === 3 ? 'text-[#D4AF37]' : 'hidden sm:block text-gray-600'
                }`}>Payment</span>
              </div>

              {/* Connector */}
              <div className="relative flex-1 mx-1 sm:mx-1.5 h-px bg-gray-800 overflow-hidden mb-3 sm:mb-3.5" style={{minWidth: '20px', maxWidth: '48px'}}>
                <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37] to-[#B8960C] transition-transform duration-500 origin-left scale-x-0" />
              </div>

              {/* Step 4 — Confirmation */}
              <div className="flex flex-col items-center gap-1">
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-[9px] sm:text-[10px] font-bold border-2 bg-[#1A1A1A] border-gray-700 text-gray-500 transition-all duration-300">
                  4
                </div>
                <span className="hidden sm:block text-[8px] font-bold tracking-[0.12em] uppercase text-gray-600">Confirm</span>
              </div>
            </div>



            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 flex-1 min-h-0 overflow-hidden">
              
              {/* Left Column: Interactive Flow Steps */}
              <div className="flex-1 flex flex-col overflow-y-auto pr-1 sm:pr-1.5 custom-scrollbar pb-4 space-y-4 min-h-0">
                
                {/* STEP 1: Enter Phone Number */}
                {checkoutStep === 1 && (
                  <div className="bg-[#1A1A1A] border border-gray-800 p-6 rounded-2xl shadow-xl space-y-6 animate-fadeIn max-w-md mx-auto w-full my-auto">
                    <div className="text-center space-y-1.5">
                      <span className="text-[10px] font-bold tracking-[0.2em] text-[#D4AF37] uppercase font-mono">Step 1 of 3</span>
                      <h4 className="font-serif text-2xl font-bold tracking-wide text-white">Verify Your Mobile Number</h4>
                      <p className="text-xs text-gray-400 font-light">
                        We will send you a One-Time Password (OTP) for secure verification.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[9px] uppercase tracking-widest text-[#D4AF37] block font-bold">Mobile Number (+91)</label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-mono">+91</span>
                          <input 
                            required 
                            type="tel" 
                            maxLength={10} 
                            value={phone} 
                            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                            className="w-full h-13 bg-[#121212] border border-gray-800 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/15 rounded-xl pl-14 pr-4 text-sm text-[#F5F5F5] font-mono focus:outline-none transition-all placeholder-gray-600" 
                            placeholder="Enter 10-digit number" 
                          />
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleSendOtp}
                        disabled={isSendingOtp || phone.length !== 10}
                        className="w-full h-12 bg-gradient-to-r from-[#D4AF37] via-[#E8C86B] to-[#AA7C11] text-[#111111] text-xs font-bold uppercase tracking-widest rounded-xl hover:brightness-110 active:scale-98 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                      >
                        {isSendingOtp ? (
                          <>
                            <Loader2 className="h-4.5 w-4.5 animate-spin" />
                            <span>Sending OTP...</span>
                          </>
                        ) : (
                          <span>Get OTP</span>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 2: Verify OTP Digit Grid */}
                {checkoutStep === 2 && (
                  <div className="bg-[#1A1A1A] border border-gray-800 p-6 rounded-2xl shadow-xl space-y-6 animate-fadeIn max-w-md mx-auto w-full my-auto">
                    <div className="text-center space-y-1.5">
                      <span className="text-[10px] font-bold tracking-[0.2em] text-[#D4AF37] uppercase font-mono">Step 2 of 3</span>
                      <h4 className="font-serif text-2xl font-bold tracking-wide text-white">Enter Verification Code</h4>
                      <p className="text-xs text-gray-400 font-light max-w-xs mx-auto">
                        Please enter the 4-digit code sent to <strong>+91 {phone}</strong>
                      </p>
                    </div>

                    <div className="space-y-5">
                      {/* Premium 4-Box Digital OTP Input */}
                      <div className="flex justify-center gap-3.5 my-2">
                        {otpDigits.map((digit, index) => (
                          <input
                            key={index}
                            id={`otp-input-${index}`}
                            type="text"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleOtpDigitChange(index, e.target.value)}
                            onKeyDown={(e) => handleOtpKeyDown(index, e)}
                            className="w-12 h-14 bg-[#121212] border border-gray-800 focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/15 rounded-xl text-center text-2xl font-bold font-mono text-white shadow-sm transition-all focus:outline-none focus:scale-105"
                            placeholder="-"
                          />
                        ))}
                      </div>

                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={handleSendOtp}
                          disabled={isSendingOtp}
                          className="flex-1 py-3.5 bg-transparent border border-gray-850 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl text-xs uppercase tracking-widest font-bold transition-all cursor-pointer active:scale-95"
                        >
                          Resend
                        </button>
                        <button
                          type="button"
                          onClick={handleVerifyOtp}
                          disabled={isVerifyingOtp || otpCode.length !== 4}
                          className="flex-1 py-3.5 bg-gradient-to-r from-[#D4AF37] via-[#E8C86B] to-[#AA7C11] text-[#111111] text-xs font-bold uppercase tracking-widest rounded-xl hover:brightness-110 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                        >
                          {isVerifyingOtp ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            "Verify OTP"
                          )}
                        </button>
                      </div>
                      
                      <button
                        type="button"
                        onClick={() => setCheckoutStep(1)}
                        className="text-[10px] text-gray-500 hover:text-[#D4AF37] block mx-auto pt-2 hover:underline cursor-pointer font-bold uppercase tracking-wider"
                      >
                        Change Phone Number
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 3: Shipping Address & Finalize Order */}
                {checkoutStep === 3 && (
                  <div className="space-y-6 animate-fadeIn">
                    
                    {/* User Verification Summary Alert */}
                    <div className="bg-[#1A1A1A] border border-gray-800 p-3 sm:p-4 rounded-xl flex items-center justify-between gap-2 text-xs flex-wrap">
                      <div className="flex items-center gap-2 flex-wrap">
                        <div className="h-2 w-2 rounded-full bg-green-500 animate-ping shrink-0" />
                        <span className="text-gray-400 whitespace-nowrap">Verified:</span>
                        <strong className="text-white font-mono">+91 {phone}</strong>
                      </div>
                      <button 
                        type="button"
                        onClick={() => {
                          setIsPhoneVerified(false);
                          setCheckoutStep(1);
                        }}
                        className="text-[#D4AF37] hover:underline font-bold text-[10px] uppercase tracking-wider shrink-0"
                      >
                        Change
                      </button>
                    </div>

                    {/* Saved Addresses list (if returning customer) */}
                    {profile && profile.addresses.length > 0 && !isAddingNew ? (
                      <div className="bg-[#1A1A1A] border border-gray-800 p-5 rounded-2xl space-y-4">
                        <div className="flex items-center justify-between border-b border-gray-800 pb-2.5">
                          <span className="text-xs uppercase tracking-wider text-[#D4AF37] font-bold font-serif">Select Saved Address</span>
                          <button 
                            type="button"
                            onClick={() => setIsAddingNew(true)}
                            className="text-xs text-[#D4AF37] hover:text-white font-bold"
                          >
                            + Add New Address
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
                                    ? "bg-[#1E190F] border-[#D4AF37] shadow-[0_4px_15px_rgba(212,175,55,0.08)]" 
                                    : "bg-[#121212] border-gray-800 hover:border-gray-700 text-gray-300"
                                }`}
                              >
                                <div className="flex items-start gap-3 justify-between">
                                  <div className="flex items-start gap-3 flex-1">
                                    <div className={`p-2 rounded-lg ${isSelected ? "bg-[#D4AF37]/15 text-[#D4AF37]" : "bg-gray-800 text-gray-500"}`}>
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
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                                          {addr.addressType}
                                        </span>
                                        {addr.isDefault && (
                                          <span className="text-[8px] bg-gray-800 px-1.5 py-0.5 rounded text-gray-400 font-bold uppercase">
                                            Default
                                          </span>
                                        )}
                                      </div>
                                      <p className="text-xs text-gray-400 font-light leading-relaxed">
                                        {addr.fullAddress}, {addr.city}, {addr.state} - <span className="font-mono text-white font-semibold">{addr.pincode}</span>
                                      </p>
                                    </div>
                                  </div>

                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      performAddressDelete(addr.id!);
                                    }}
                                    className="text-gray-500 hover:text-red-400 p-1.5 rounded-lg hover:bg-red-500/10 transition-all active:scale-95 self-start shrink-0 cursor-pointer"
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
                    ) : (
                      /* Manual New Address Form */
                      <div className="bg-[#1A1A1A] border border-gray-800 p-5 rounded-2xl space-y-4">
                        <div className="flex items-center justify-between border-b border-gray-800 pb-2.5">
                          <span className="text-xs uppercase tracking-wider text-[#D4AF37] font-bold font-serif">Shipping Address Form</span>
                          {profile && profile.addresses.length > 0 && (
                            <button 
                              type="button"
                              onClick={() => setIsAddingNew(false)}
                              className="text-xs text-gray-400 hover:text-white font-bold"
                            >
                              &larr; Saved Addresses
                            </button>
                          )}
                        </div>

                        {/* Customer Name */}
                        <div className="space-y-1.5">
                          <label className="text-[9px] uppercase tracking-widest text-[#D4AF37] block font-bold">Receiver Full Name</label>
                          <input 
                            required 
                            type="text" 
                            value={fullName} 
                            onChange={(e) => setFullName(e.target.value.replace(/[^a-zA-Z\s]/g, ""))}
                            className="w-full h-11 bg-[#121212] border border-gray-800 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/15 rounded-xl px-4 text-xs text-white focus:outline-none transition-all placeholder-gray-600" 
                            placeholder="Receiver name for parcel" 
                          />
                        </div>

                        {/* Full Address */}
                        <div className="space-y-1.5">
                          <label className="text-[9px] uppercase tracking-widest text-[#D4AF37] block font-bold">House No. / Street Address</label>
                          <div className="relative">
                            <input 
                              ref={inputRef}
                              required 
                              type="text" 
                              placeholder="Flat, House no., Area, Village" 
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
                              className="w-full h-11 bg-[#121212] border border-gray-800 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/15 rounded-xl px-4 text-xs text-white placeholder-gray-600 focus:outline-none transition-all" 
                            />
                            {showDropdown && suggestions.length > 0 && !googleMapsKey && (
                              <div className="absolute left-0 right-0 mt-1 bg-[#1A1A1A] border border-gray-800 rounded-xl overflow-hidden shadow-2xl z-50 divide-y divide-gray-800 max-h-48 overflow-y-auto">
                                {suggestions.map((loc, idx) => (
                                  <div
                                    key={idx}
                                    onClick={() => handleSelectSuggestion(loc)}
                                    className="px-4 py-2.5 text-xs text-gray-300 hover:text-white hover:bg-[#1E190F] cursor-pointer transition-all flex items-center gap-2"
                                  >
                                    <MapPin className="h-3.5 w-3.5 text-[#D4AF37] shrink-0" />
                                    <span className="truncate">{loc.description}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Pincode & Alternative Contact Grid */}
                        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 gap-3 sm:gap-4">
                          <div className="space-y-1.5">
                            <label className="text-[9px] uppercase tracking-widest text-[#D4AF37] block font-bold">Pincode (6 digits)</label>
                            <div className="relative">
                              <input 
                                required 
                                type="text" 
                                placeholder="6-digit pincode" 
                                maxLength={6} 
                                value={newAddress.pincode} 
                                onChange={(e) => handlePincodeChange(e.target.value)} 
                                className="w-full h-11 bg-[#121212] border border-gray-800 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/15 rounded-xl px-4 text-xs text-white font-mono placeholder-gray-600 focus:outline-none transition-all" 
                              />
                              {isResolvingPincode && (
                                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-[#D4AF37]" />
                              )}
                            </div>
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[9px] uppercase tracking-widest text-[#D4AF37] block font-bold">Alternate Phone (Optional)</label>
                            <input 
                              type="tel" 
                              maxLength={10} 
                              placeholder="Alternative number" 
                              value={alternativePhone} 
                              onChange={(e) => setAlternativePhone(e.target.value.replace(/\D/g, ""))} 
                              className="w-full h-11 bg-[#121212] border border-gray-800 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/15 rounded-xl px-4 text-xs text-white font-mono placeholder-gray-600 focus:outline-none transition-all" 
                            />
                          </div>
                        </div>

                        {/* City & State Grid */}
                        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 gap-3 sm:gap-4">
                          <div className="space-y-1.5">
                            <label className="text-[9px] uppercase tracking-widest text-[#D4AF37] block font-bold">City / Village</label>
                            <input 
                              required 
                              type="text" 
                              placeholder="City/District" 
                              value={newAddress.city} 
                              onChange={(e) => setNewAddress({...newAddress, city: e.target.value.replace(/[^a-zA-Z\s]/g, "")})} 
                              className="w-full h-11 bg-[#121212] border border-gray-800 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/15 rounded-xl px-4 text-xs text-white placeholder-gray-600 focus:outline-none transition-all" 
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[9px] uppercase tracking-widest text-[#D4AF37] block font-bold">State</label>
                            <input 
                              required 
                              type="text" 
                              placeholder="State" 
                              value={newAddress.state} 
                              onChange={(e) => setNewAddress({...newAddress, state: e.target.value.replace(/[^a-zA-Z\s]/g, "")})} 
                              className="w-full h-11 bg-[#121212] border border-gray-800 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/15 rounded-xl px-4 text-xs text-white placeholder-gray-600 focus:outline-none transition-all" 
                            />
                          </div>
                        </div>

                        {/* Save for Future Checkbox */}
                        <div className="flex items-center gap-2 pt-1">
                          <input 
                            type="checkbox"
                            id="save-addr-future"
                            defaultChecked
                            className="h-4 w-4 bg-[#121212] border-gray-800 rounded text-[#D4AF37] focus:ring-0 focus:ring-offset-0"
                          />
                          <label htmlFor="save-addr-future" className="text-[10px] text-gray-400 font-bold uppercase tracking-wider cursor-pointer">
                            Save address for future deliveries
                          </label>
                        </div>
                      </div>
                    )}

                    {/* Ã°Å¸â€™Â³ Payment Method Toggle Card */}
                    <div className="bg-[#1A1A1A] border border-gray-800 p-5 rounded-2xl space-y-4">
                      <div className="flex items-center gap-2 border-b border-gray-800 pb-2.5">
                        <CreditCard className="h-4 w-4 text-[#D4AF37]" />
                        <span className="text-xs uppercase tracking-wider text-[#D4AF37] font-bold font-serif">Payment Method</span>
                      </div>
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => setPaymentMethod("ONLINE")}
                          className={`flex-1 p-4 rounded-xl border text-left transition-all duration-300 cursor-pointer ${
                            paymentMethod === "ONLINE"
                              ? "bg-[#1E190F] border-[#D4AF37] shadow-sm"
                              : "bg-[#121212] border-gray-800 hover:border-gray-700"
                          }`}
                        >
                          <div className="font-bold text-xs text-white">Online Secure Prepaid</div>
                          <div className="text-[10px] text-gray-500 mt-1 font-light">UPI, Google Pay, Card</div>
                        </button>
                        <button
                          type="button"
                          onClick={() => setPaymentMethod("COD")}
                          className={`flex-1 p-4 rounded-xl border text-left transition-all duration-300 cursor-pointer ${
                            paymentMethod === "COD"
                              ? "bg-[#1E190F] border-[#D4AF37] shadow-sm"
                              : "bg-[#121212] border-gray-800 hover:border-gray-700"
                          }`}
                        >
                          <div className="font-bold text-xs text-white">Cash on Delivery (COD)</div>
                          <div className="text-[10px] text-gray-500 mt-1 font-light">Pay at your doorstep</div>
                        </button>
                      </div>
                    </div>

                    {/* Ã°Å¸Å½Å¸Ã¯Â¸Â Coupon validation code box */}
                    <div className="bg-[#1A1A1A] border border-gray-800 p-5 rounded-2xl space-y-3">
                      <label className="text-[9px] uppercase tracking-widest text-[#D4AF37] block font-bold">Promo / Coupon Code</label>
                      <div className="flex gap-2">
                        <input 
                          type="text"
                          placeholder="Enter coupon (e.g. PURE10)"
                          value={couponInput}
                          disabled={isCouponValidating || appliedCoupon !== null}
                          onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                          className="flex-1 h-11 bg-[#121212] border border-gray-800 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/15 rounded-xl px-4 text-xs text-white font-mono uppercase placeholder-gray-600 focus:outline-none transition-all"
                        />
                        {appliedCoupon ? (
                          <button
                            type="button"
                            onClick={handleRemoveCoupon}
                            className="px-4 bg-red-955/20 border border-red-900/60 hover:bg-red-900/30 text-red-400 font-bold rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer"
                          >
                            Remove
                          </button>
                        ) : (
                          <button
                            type="button"
                            disabled={isCouponValidating || !couponInput.trim()}
                            onClick={() => handleValidateCoupon(couponInput)}
                            className="px-5 bg-gradient-to-r from-[#D4AF37] via-[#E8C86B] to-[#AA7C11] text-[#111111] font-bold rounded-xl text-xs uppercase tracking-wider transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                          >
                            {isCouponValidating ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              "Apply"
                            )}
                          </button>
                        )}
                      </div>
                      {appliedCoupon && (
                        <p className="text-xs text-green-400 font-medium font-mono">
                          ✓ Coupon applied! Saved ₹{discountAmount} ({appliedCoupon.discountType === 'PERCENTAGE' ? `${appliedCoupon.discountValue}%` : `₹${appliedCoupon.discountValue}`})
                        </p>
                      )}
                    </div>

                    {/* Mobile Only: Pricing totals list */}
                    <div className="sm:hidden bg-[#1A1A1A] border border-gray-800 p-4 rounded-xl space-y-2 text-xs">
                      <div className="flex justify-between text-gray-400">
                        <span>Cart Subtotal:</span>
                        <span className="font-mono text-white">₹{subtotal}.00</span>
                      </div>
                      {appliedCoupon && (
                        <div className="flex justify-between text-green-400">
                          <span>Coupon Discount:</span>
                          <span>-₹{discountAmount}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-white font-bold text-sm border-t border-gray-800 pt-2 mt-2">
                        <span>Total Payable:</span>
                        <span className="font-mono text-[#D4AF37] text-base">₹{finalPayable}.00</span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
                      <button 
                        type="button" 
                        onClick={onClose} 
                        className="w-full sm:flex-1 py-3.5 bg-transparent border border-gray-800 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl text-xs uppercase tracking-wider transition-all active:scale-95 font-bold cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button 
                        type="button"
                        onClick={handlePlaceOrder}
                        disabled={
                          isSubmitting || 
                          (!selectedAddressId && !isAddingNew) || 
                          (isAddingNew && (!newAddress.fullAddress.trim() || !newAddress.pincode.trim() || !newAddress.city.trim() || !newAddress.state.trim()))
                        } 
                        className={`w-full sm:flex-1 py-4 sm:py-3.5 font-bold rounded-xl text-xs uppercase tracking-widest transition-all active:scale-95 text-center ${
                          isSubmitting || 
                          (!selectedAddressId && !isAddingNew) || 
                          (isAddingNew && (!newAddress.fullAddress.trim() || !newAddress.pincode.trim() || !newAddress.city.trim() || !newAddress.state.trim()))
                            ? "bg-gray-800 text-gray-500 cursor-not-allowed opacity-40 shadow-none"
                            : "bg-gradient-to-r from-[#D4AF37] via-[#E8C86B] to-[#AA7C11] text-[#111111] shadow-lg cursor-pointer hover:brightness-110"
                        }`}
                      >
                        {isSubmitting ? (
                          <span className="flex items-center justify-center gap-1.5">
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            Processing...
                          </span>
                        ) : (
                          paymentMethod === "ONLINE" ? "Proceed to Secure Payment" : "Confirm COD Order"
                        )}
                      </button>
                    </div>

                  </div>
                )}
              </div>

              {/* Ã°Å¸â€œÅ  Right Column: Persistent Order Summary (anchored sidebar) */}
              {checkoutStep === 3 && (
                <div className="w-full sm:w-[300px] shrink-0 bg-[#1A1A1A] border border-gray-800 p-4 sm:p-5 rounded-2xl hidden sm:flex flex-col justify-between animate-fadeIn">
                  <div className="space-y-4">
                    <div className="text-xs uppercase tracking-wider text-[#D4AF37] font-bold border-b border-gray-850 pb-2 flex items-center gap-1.5">
                      <span className="font-serif">Order Summary</span>
                    </div>
                    
                    {/* Cart Items list */}
                    <div className="max-h-40 overflow-y-auto space-y-3 custom-scrollbar pr-1">
                      {cartItems && cartItems.map(item => (
                        <div key={item.id} className="flex justify-between items-start gap-2.5 text-xs text-gray-300">
                          <div className="flex-1 min-w-0">
                            <p className="truncate text-white font-medium">{item.name}</p>
                            <span className="text-[10px] text-gray-500 font-mono">Qty: {item.quantity} | {item.volume}</span>
                          </div>
                          <span className="font-mono text-white shrink-0">₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>

                    {/* Cost Breakdown */}
                    <div className="border-t border-gray-800 pt-3.5 space-y-2 text-xs text-gray-400">
                      <div className="flex justify-between">
                        <span>Items Subtotal:</span>
                        <span className="font-mono text-white">₹{subtotal}.00</span>
                      </div>
                      {appliedCoupon && (
                        <div className="flex justify-between text-green-400 font-medium">
                          <span>Coupon Discount:</span>
                          <span>-₹{discountAmount}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>Shipping (Calculated):</span>
                        <span className="font-mono text-green-400 font-bold uppercase text-[10px]">FREE Delivery</span>
                      </div>
                      <div className="flex justify-between border-t border-gray-800 pt-3 text-white font-bold text-sm">
                        <span>Total Payable:</span>
                        <span className="font-mono text-[#D4AF37] text-base">₹{finalPayable}.00</span>
                      </div>
                    </div>
                  </div>

                  {/* Razorpay Trust Badge */}
                  <div className="border-t border-gray-800 pt-4 mt-6 flex flex-col items-center space-y-2">
                    <span className="text-[9px] uppercase tracking-widest text-gray-500 font-bold">Secured Transaction</span>
                    <div className="bg-[#121212] px-3.5 py-2 rounded-xl border border-gray-850 flex items-center justify-center gap-1.5 w-full">
                      <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#D4AF37]" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0110 0v4" />
                      </svg>
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Payments via Razorpay</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

