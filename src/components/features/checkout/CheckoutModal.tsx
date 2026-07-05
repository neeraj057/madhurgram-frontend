"use client";
import React, { useState, useEffect } from 'react';
import { CheckCircle2, ArrowRight, MapPin, Plus, Loader2, Home, Briefcase, Map } from 'lucide-react'; 
import { API_ENDPOINTS } from '@/apis/api';
import { fetchCustomerProfile, addCustomerAddress, CustomerProfile, Address, AddressType } from '@/apis/customerProfile';
import { syncCart } from '@/apis/cartRecovery';

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

export default function CheckoutModal({ isOpen, onClose, subtotal, cartItems, onOrderSuccess }: CheckoutModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState<number | null>(null);

  // 👤 Smart Profiling States
  const [phone, setPhone] = useState("");
  const [fullName, setFullName] = useState("");
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newAddress, setNewAddress] = useState<Address>({
    addressType: "HOME",
    fullAddress: "",
    city: "",
    state: "",
    pincode: "",
    isDefault: true
  });

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
        isDefault: true
      });
    }
  }, [isOpen]);

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
    if (!fullName.trim()) {
      alert("Please enter your full name.");
      return;
    }
    if (!phone || phone.length < 10) {
      alert("Please enter a valid 10-digit phone number.");
      return;
    }

    setIsSubmitting(true);
    let finalAddress = "";
    let finalPincode = "";
    let finalCityState = "";

    try {
      if (isAddingNew) {
        // Validation check for new address fields
        if (!newAddress.fullAddress.trim() || !newAddress.city.trim() || !newAddress.state.trim() || !newAddress.pincode.trim()) {
          alert("Please fill in all address details.");
          setIsSubmitting(false);
          return;
        }
        if (newAddress.pincode.trim().length !== 6) {
          alert("Pincode must be exactly 6 digits.");
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
      } else {
        if (!selectedAddressId || !profile) {
          alert("Please select a delivery address first.");
          setIsSubmitting(false);
          return;
        }
        const selectedAddr = profile.addresses.find(a => a.id === selectedAddressId);
        if (!selectedAddr) {
          alert("Selected address not found.");
          setIsSubmitting(false);
          return;
        }
        finalAddress = selectedAddr.fullAddress;
        finalPincode = selectedAddr.pincode;
        finalCityState = `${selectedAddr.city}, ${selectedAddr.state}`;
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
        orderStatus: "PENDING",
        orderItems: mappedOrderItems
      };

      console.log("Placing order via API...");
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
      alert("Failed to connect with Server. Please check your inventory or try again.");
    } finally {
      setIsSubmitting(false);
    }
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
                    required type="text" value={fullName} onChange={(e) => setFullName(e.target.value)}
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
                    <div>
                      <label className="text-[9px] uppercase tracking-widest text-gray-500 block mb-1 font-bold">Full Address</label>
                      <input 
                        required 
                        type="text" 
                        placeholder="Street address, Flat, House no., Area" 
                        value={newAddress.fullAddress} 
                        onChange={(e) => setNewAddress({...newAddress, fullAddress: e.target.value})} 
                        className="w-full bg-black border border-gray-800 rounded-lg p-3 text-sm text-[#FDFBF7] placeholder-gray-700 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/20 outline-none transition-all" 
                      />
                    </div>

                    {/* City and State Grid */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[9px] uppercase tracking-widest text-gray-500 block mb-1 font-bold">City</label>
                        <input 
                          required 
                          type="text" 
                          placeholder="City" 
                          value={newAddress.city} 
                          onChange={(e) => setNewAddress({...newAddress, city: e.target.value})} 
                          className="w-full bg-black border border-gray-800/80 rounded-lg p-3 text-sm text-[#FDFBF7] placeholder-gray-700 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/20 outline-none transition-all" 
                        />
                      </div>
                      <div>
                        <label className="text-[9px] uppercase tracking-widest text-gray-500 block mb-1 font-bold">State</label>
                        <input 
                          required 
                          type="text" 
                          placeholder="State" 
                          value={newAddress.state} 
                          onChange={(e) => setNewAddress({...newAddress, state: e.target.value})} 
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

              <p className="text-[10px] text-gray-500 mb-4">Payment Method: Cash on Delivery (COD)</p>
              
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