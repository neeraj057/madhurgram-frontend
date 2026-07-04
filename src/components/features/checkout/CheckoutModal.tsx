"use client";
import React, { useState, useEffect } from 'react';
import { CheckCircle2, ArrowRight, MapPin, Plus, Loader2, Home, Briefcase, Map } from 'lucide-react'; 
import { API_ENDPOINTS } from '@/apis/api';
import { fetchCustomerProfile, addCustomerAddress, CustomerProfile, Address, AddressType } from '@/apis/customerProfile';

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
      // Run asynchronously to avoid calling setState synchronously within the effect body
      Promise.resolve().then(() => {
        loadProfile(phone);
      });
    } else {
      // Run asynchronously to avoid calling setState synchronously within the effect body
      Promise.resolve().then(() => {
        setProfile(null);
        setSelectedAddressId(null);
      });
    }
  }, [phone]);

  const handleSaveNewAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoadingProfile(true);
    try {
      const updatedProfile = await addCustomerAddress(phone, newAddress);
      setProfile(updatedProfile);
      setIsAddingNew(false);
      // नया ऐड हुआ एड्रेस सेलेक्ट कर लो
      const latestAddress = updatedProfile.addresses[updatedProfile.addresses.length - 1];
      if (latestAddress.id) setSelectedAddressId(latestAddress.id);
    } catch {
      alert("Failed to save address. Please try again.");
    } finally {
      setIsLoadingProfile(false);
    }
  };

  // 🚀 फाइनल प्लेस आर्डर लॉजिक
  const handlePlaceOrder = async () => {
    if (!selectedAddressId || !profile) {
      alert("Please select a delivery address first.");
      return;
    }
    if (!fullName.trim()) {
      alert("Please enter your full name.");
      return;
    }

    setIsSubmitting(true);
    const selectedAddr = profile.addresses.find(a => a.id === selectedAddressId);
    
    const mappedOrderItems = cartItems.map(item => ({
      productId: item.id,
      productName: item.name,
      quantity: item.quantity,
      price: item.price
    }));

    const orderPayload = {
      customerName: fullName,
      phoneNumber: phone,
      address: selectedAddr?.fullAddress,
      pincode: selectedAddr?.pincode,
      cityState: `${selectedAddr?.city}, ${selectedAddr?.state}`,
      totalAmount: subtotal,
      orderStatus: "PENDING",
      orderItems: mappedOrderItems
    };

    try {
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
      
      <div className="relative w-full max-w-lg bg-[#111111] text-[#FDFBF7] rounded-2xl p-8 border border-gray-800 shadow-2xl z-10 max-h-[90vh] flex flex-col transition-all duration-500">
        
        {/* 🎉 CONDITION 1: Success Screen (तुम्हारा ओरिजिनल कोड) */}
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
          
          /* 📦 CONDITION 2: Smart Shipping Flow */
          <div className="flex flex-col h-full max-h-full">
            <h3 className="font-serif text-2xl font-bold tracking-wide text-[#D4AF37] border-b border-gray-800 pb-4 shrink-0">
              Shipping Information
            </h3>
            
            <div className="mt-6 space-y-6 overflow-y-auto flex-1 pr-2 custom-scrollbar">
              
              {/* Step 1: Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-gray-400 block mb-1">Phone Number</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 font-mono">+91</span>
                    <input 
                      required type="tel" maxLength={10} value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                      className="w-full bg-[#161616] border border-gray-800 rounded-lg pl-10 pr-3 py-3 text-sm text-[#FDFBF7] focus:outline-none focus:border-[#D4AF37]" placeholder="10-digit number" 
                    />
                    {isLoadingProfile && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-[#D4AF37]" />}
                  </div>
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-gray-400 block mb-1">Full Name</label>
                  <input 
                    required type="text" value={fullName} onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-[#161616] border border-gray-800 rounded-lg p-3 text-sm text-[#FDFBF7] focus:outline-none focus:border-[#D4AF37]" placeholder="Enter your name" 
                  />
                </div>
              </div>

              {/* Step 2: Address Selection */}
              {profile && !isAddingNew && (
                <div className="space-y-3 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] uppercase tracking-widest text-gray-400 block">Saved Addresses</label>
                    <button onClick={() => setIsAddingNew(true)} className="text-xs text-[#D4AF37] flex items-center gap-1 hover:underline">
                      <Plus className="h-3 w-3" /> Add New
                    </button>
                  </div>
                  <div className="space-y-3">
                    {profile.addresses.map((addr) => (
                      <div 
                        key={addr.id} onClick={() => setSelectedAddressId(addr.id!)}
                        className={`cursor-pointer p-4 rounded-xl border transition-all ${selectedAddressId === addr.id ? "bg-[#D4AF37]/10 border-[#D4AF37]" : "bg-[#161616] border-gray-800 hover:border-gray-600"}`}
                      >
                        <div className="flex items-start gap-3">
                          {addr.addressType === 'HOME' ? <Home className="h-4 w-4 text-gray-400 mt-0.5" /> : addr.addressType === 'OFFICE' ? <Briefcase className="h-4 w-4 text-gray-400 mt-0.5" /> : <Map className="h-4 w-4 text-gray-400 mt-0.5" />}
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-bold uppercase tracking-wider text-gray-300">{addr.addressType}</span>
                              {addr.isDefault && <span className="text-[9px] bg-gray-800 px-2 py-0.5 rounded text-gray-400">DEFAULT</span>}
                            </div>
                            <p className="text-sm text-gray-400 font-light leading-relaxed">
                              {addr.fullAddress}, {addr.city}, {addr.state} - <span className="font-mono">{addr.pincode}</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3: Add New Address Form */}
              {profile && isAddingNew && (
                <form onSubmit={handleSaveNewAddress} className="space-y-4 animate-fadeIn bg-[#161616] p-5 rounded-xl border border-gray-800">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-bold text-[#D4AF37]">Add New Address</h3>
                    {profile.addresses.length > 0 && (
                      <button type="button" onClick={() => setIsAddingNew(false)} className="text-xs text-gray-500 hover:text-white">Cancel</button>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {['HOME', 'OFFICE', 'OTHER'].map((type) => (
                      <button key={type} type="button" onClick={() => setNewAddress({...newAddress, addressType: type as AddressType})} className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all ${newAddress.addressType === type ? "bg-[#D4AF37] text-black border-[#D4AF37]" : "bg-black text-gray-400 border-gray-800"}`}>
                        {type}
                      </button>
                    ))}
                  </div>
                  <input required type="text" placeholder="Full Street Address" value={newAddress.fullAddress} onChange={(e) => setNewAddress({...newAddress, fullAddress: e.target.value})} className="w-full bg-black border border-gray-800 rounded-lg p-3 text-sm focus:border-[#D4AF37] outline-none" />
                  <div className="grid grid-cols-2 gap-3">
                    <input required type="text" placeholder="City" value={newAddress.city} onChange={(e) => setNewAddress({...newAddress, city: e.target.value})} className="w-full bg-black border border-gray-800 rounded-lg p-3 text-sm focus:border-[#D4AF37] outline-none" />
                    <input required type="text" placeholder="Pincode" maxLength={6} value={newAddress.pincode} onChange={(e) => setNewAddress({...newAddress, pincode: e.target.value.replace(/\D/g, "")})} className="w-full bg-black border border-gray-800 rounded-lg p-3 text-sm font-mono focus:border-[#D4AF37] outline-none" />
                  </div>
                  <input required type="text" placeholder="State" value={newAddress.state} onChange={(e) => setNewAddress({...newAddress, state: e.target.value})} className="w-full bg-black border border-gray-800 rounded-lg p-3 text-sm focus:border-[#D4AF37] outline-none" />
                  <button type="submit" disabled={isLoadingProfile} className="w-full bg-gray-800 text-white py-3 rounded-lg text-xs uppercase tracking-widest font-bold hover:bg-gray-700 transition-colors flex items-center justify-center gap-2">
                    {isLoadingProfile ? <Loader2 className="h-4 w-4 animate-spin" /> : <MapPin className="h-4 w-4" />} Save Address
                  </button>
                </form>
              )}

            </div>

            {/* 💵 Footer: Pricing & Action Buttons (तुम्हारा ओरिजिनल फुटर) */}
            <div className="border-t border-gray-800 pt-4 mt-6 shrink-0">
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
                  disabled={isSubmitting || !selectedAddressId || !phone || phone.length < 10} 
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