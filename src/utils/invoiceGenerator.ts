/**
 * MADHURGRAM ULTRA-HD INVOICE GENERATOR UTILITY (ANTI-BLUR & CRISP FONTS)
 */

export interface OrderItem {
  id: number;
  productName: string;
  quantity: number;
  price: number;
  hsnCode?: string;
  gstRate?: number;
  taxableAmount?: number;
  cgstAmount?: number;
  sgstAmount?: number;
  igstAmount?: number;
}

export interface Order {
  id: number;
  customerName: string;
  phoneNumber: string;
  address: string;
  pincode: string;
  cityState: string;
  totalAmount: number;
  orderStatus: string;
  orderDate: string;
  paymentStatus?: string;
  paymentTransactionId?: string | null;
  trackingNumber?: string | null;
  courierName?: string | null;
  taxableAmount?: number;
  cgstTotal?: number;
  sgstTotal?: number;
  igstTotal?: number;
  couponCode?: string;
  discountAmount?: number;
  orderItems: OrderItem[];
}

// 📦 Formats auto-increment order IDs to professional format: MG-YYMMDD-XXXX
export const getFormattedOrderNumber = (order: Order) => {
  if (!order || !order.id) return "MG-0000";
  try {
    const date = new Date(order.orderDate);
    const year = (date.getFullYear() % 100).toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const paddedId = order.id.toString().padStart(4, '0');
    return `MG-${year}${month}${day}-${paddedId}`;
  } catch (e) {
    return `MG-0000-${order.id}`;
  }
};

export const downloadInvoicePDF = async (order: Order) => {
  const html2pdf = (await import('html2pdf.js')).default;
  const orderNumber = getFormattedOrderNumber(order);

  // Fetch branding logo SVG content dynamically to inline it
  let logoSvgHtml = '';
  try {
    const response = await fetch('/images/newlogo.svg');
    if (response.ok) {
      const rawText = await response.text();
      logoSvgHtml = rawText
        .replace(/<\?xml[^>]*\?>/i, '')
        .replace(/<!DOCTYPE[^>]*>/i, '')
        .trim();
    }
  } catch (e) {
    console.error("Failed to fetch logo SVG:", e);
  }

  const logoHeaderContent = logoSvgHtml 
    ? `<div style="width: 280px; height: 75px; display: block; filter: drop-shadow(0px 1px 2px rgba(0,0,0,0.25));">${logoSvgHtml.replace('<svg', '<svg style="width: 100%; height: 100%; display: block;"')}</div>`
    : `<div style="display: flex; align-items: center; gap: 15px;">
        <!-- Fallback SVG Gold Logo -->
        <svg viewBox="0 0 100 100" style="width: 55px; height: 55px;">
          <circle cx="50" cy="50" r="45" fill="none" stroke="#d4af37" stroke-width="1.5"/>
          <path d="M20,65 C35,55 45,70 80,65 L80,85 L20,85 Z" fill="#d4af37" opacity="0.3"/>
          <path d="M15,75 C35,65 50,80 85,72 L85,90 L15,90 Z" fill="#d4af37"/>
          <circle cx="50" cy="40" r="12" fill="#d4af37"/>
          <line x1="50" y1="20" x2="50" y2="24" stroke="#d4af37" stroke-width="1.5"/>
          <line x1="36" y1="26" x2="39" y2="29" stroke="#d4af37" stroke-width="1.5"/>
          <line x1="64" y1="26" x2="61" y2="29" stroke="#d4af37" stroke-width="1.5"/>
          <line x1="30" y1="40" x2="34" y2="40" stroke="#d4af37" stroke-width="1.5"/>
          <line x1="70" y1="40" x2="66" y2="40" stroke="#d4af37" stroke-width="1.5"/>
        </svg>
        <div>
          <h1 style="font-size: 24px; font-family: 'Cinzel', serif; font-weight: 800; color: #d4af37; margin: 0; letter-spacing: 1px; line-height: 1.1;">MadhurGram</h1>
          <p style="font-size: 7px; font-family: 'Outfit', sans-serif; text-transform: uppercase; color: #fdfbf7; margin: 4px 0 0 0; font-weight: 600; letter-spacing: 2.5px; opacity: 0.85;">— GAON KI ASLI MITHAAS —</p>
        </div>
      </div>`;

  const element = document.createElement('div');
  
  // Dynamic Payment Mode calculation
  const isPrepaid = order.paymentStatus === "COMPLETED";
  const paymentMode = isPrepaid ? "Online (Prepaid)" : "Cash on Delivery (COD)";
  const paymentTxnDetail = isPrepaid && order.paymentTransactionId 
    ? `<div style="font-size: 10px; color: #555555; margin-top: 2px;">Txn ID: ${order.paymentTransactionId}</div>`
    : "";

  // Dynamic GST Resolution
  const baseValue = (order.taxableAmount !== undefined && order.taxableAmount !== null) 
    ? order.taxableAmount 
    : (order.totalAmount / 1.05);
  const cgstTotal = order.cgstTotal || 0;
  const sgstTotal = order.sgstTotal || 0;
  const igstTotal = order.igstTotal || 0;
  const placeOfSupply = order.cityState || "Uttar Pradesh";

  // Dynamic Tax calculations
  const totalTax = (cgstTotal > 0 || sgstTotal > 0 || igstTotal > 0)
    ? (cgstTotal + sgstTotal + igstTotal)
    : (order.totalAmount - baseValue);

  element.innerHTML = `
    <!-- Google Fonts Integration -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800&family=Outfit:wght@300;400;500;600;700&family=Playball&display=swap" rel="stylesheet">

    <div style="padding: 50px; font-family: 'Outfit', -apple-system, sans-serif; color: #222222; background-color: #ffffff; width: 720px; box-sizing: border-box; border: 1px solid #e5e5e0; position: relative;">
      
      <!-- Header Banner (Dark Charcoal) -->
      <div style="background-color: #1a1a1a; padding: 25px 35px; margin: -50px -50px 35px -50px; display: flex; justify-content: space-between; align-items: center;">
        ${logoHeaderContent}
        <div style="text-align: right; font-family: 'Outfit', sans-serif;">
          <h2 style="font-size: 32px; font-family: 'Cinzel', serif; font-weight: 700; color: #d4af37; margin: 0 0 4px 0; letter-spacing: 2px; line-height: 1;">INVOICE</h2>
          <div style="font-size: 11px; font-weight: 500; color: #dcdccb; font-family: monospace;">Invoice #: ${orderNumber}</div>
          <div style="font-size: 10px; color: #aaaaaa; margin-top: 3px;">Date: ${new Date(order.orderDate).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' })}</div>
        </div>
      </div>

      <!-- Billing & Shipping Details Title -->
      <div style="margin-bottom: 20px;">
        <h3 style="font-size: 14px; font-weight: 600; color: #1a1a1a; margin: 0 0 6px 0; font-family: 'Outfit', sans-serif; text-transform: uppercase; letter-spacing: 0.5px;">Billing & Shipping Details</h3>
        <div style="height: 1px; background-color: #d4af37; opacity: 0.5; width: 100%;"></div>
      </div>

      <!-- Address Grid -->
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px; font-size: 11px; line-height: 1.6; color: #333333;">
        <tr>
          <!-- Sold By (Seller) -->
          <td style="width: 50%; vertical-align: top; padding-right: 25px;">
            <strong style="color: #1a1a1a; font-size: 12px; display: block; margin-bottom: 8px; font-family: 'Outfit', sans-serif; text-transform: uppercase; letter-spacing: 0.5px;">Sold By (Seller):</strong>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="width: 65px; font-weight: 700; color: #1a1a1a; vertical-align: top;">Name:</td>
                <td style="color: #444444; font-weight: 600;">MadhurGram Warehouse</td>
              </tr>
              <tr>
                <td style="font-weight: 700; color: #1a1a1a; vertical-align: top;">Address:</td>
                <td style="color: #444444;">Plot No. 42, G.T. Road, Gopiganj, Bhadohi, UP - 221303</td>
              </tr>
              <tr>
                <td style="font-weight: 700; color: #1a1a1a; vertical-align: top;">Contact:</td>
                <td style="color: #444444; font-family: monospace;">+91 9988776655</td>
              </tr>
              <tr>
                <td style="font-weight: 700; color: #1a1a1a; vertical-align: top;">GSTIN:</td>
                <td style="color: #444444; font-family: monospace; font-weight: 600;">09AAAFM4592M1ZO</td>
              </tr>
            </table>
          </td>
          <!-- Billing & Shipping Address (Buyer) -->
          <td style="width: 50%; vertical-align: top; padding-left: 25px; border-left: 1px solid #f0f0ed;">
            <strong style="color: #1a1a1a; font-size: 12px; display: block; margin-bottom: 8px; font-family: 'Outfit', sans-serif; text-transform: uppercase; letter-spacing: 0.5px;">Billing & Shipping (Buyer):</strong>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="width: 65px; font-weight: 700; color: #1a1a1a; vertical-align: top;">Name:</td>
                <td style="color: #444444; font-weight: 600;">${order.customerName}</td>
              </tr>
              <tr>
                <td style="font-weight: 700; color: #1a1a1a; vertical-align: top;">Address:</td>
                <td style="color: #444444;">${order.address}, ${order.cityState} - ${order.pincode}</td>
              </tr>
              <tr>
                <td style="font-weight: 700; color: #1a1a1a; vertical-align: top;">Contact:</td>
                <td style="color: #444444; font-family: monospace;">+91 ${order.phoneNumber.replace("+91", "").trim()}</td>
              </tr>
              <tr>
                <td style="font-weight: 700; color: #1a1a1a; vertical-align: top;">Supply:</td>
                <td style="color: #444444;">${placeOfSupply}</td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      <!-- Order Summary Title -->
      <h3 style="font-size: 13px; font-weight: 600; color: #1a1a1a; margin: 0 0 10px 0; font-family: 'Outfit', sans-serif; text-transform: uppercase; letter-spacing: 0.5px;">Order Summary</h3>

      <!-- Products Table -->
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 11px; border: 1px solid #e5e5e0;">
        <thead>
          <tr style="background: linear-gradient(to right, #c5a059, #e2c28b); color: #1a1a1a; border-bottom: 1.5px solid #a67c1e;">
            <th style="width: 8%; padding: 10px; font-weight: 700; text-transform: uppercase; font-size: 8.5px; letter-spacing: 0.5px; text-align: center; border-right: 1px solid rgba(26,26,26,0.15);">Item</th>
            <th style="width: 44%; padding: 10px; font-weight: 700; text-transform: uppercase; font-size: 8.5px; letter-spacing: 0.5px; border-right: 1px solid rgba(26,26,26,0.15);">Description</th>
            <th style="width: 14%; padding: 10px; text-align: center; font-weight: 700; text-transform: uppercase; font-size: 8.5px; letter-spacing: 0.5px; border-right: 1px solid rgba(26,26,26,0.15);">HSN Code</th>
            <th style="width: 8%; padding: 10px; text-align: center; font-weight: 700; text-transform: uppercase; font-size: 8.5px; letter-spacing: 0.5px; border-right: 1px solid rgba(26,26,26,0.15);">Qty</th>
            <th style="width: 14%; padding: 10px; text-align: right; font-weight: 700; text-transform: uppercase; font-size: 8.5px; letter-spacing: 0.5px; border-right: 1px solid rgba(26,26,26,0.15);">Unit Price (₹)</th>
            <th style="width: 12%; padding: 10px; text-align: center; font-weight: 700; text-transform: uppercase; font-size: 8.5px; letter-spacing: 0.5px;">Tax (GST %)</th>
          </tr>
        </thead>
        <tbody>
          ${order.orderItems && order.orderItems.length > 0 
            ? order.orderItems.map((item, index) => {
                const itemGst = item.gstRate || 5;
                const itemBase = item.price / (1 + (itemGst / 100));
                return `
                  <tr style="border-bottom: 1px solid #e5e5e0; background-color: #ffffff;">
                    <td style="width: 8%; padding: 10px; text-align: center; font-weight: bold; border-right: 1px solid #e5e5e0; color: #555555;">${index + 1}</td>
                    <td style="width: 44%; padding: 10px; font-weight: 600; color: #1a1a1a; font-size: 11.5px; border-right: 1px solid #e5e5e0;">${item.productName}</td>
                    <td style="width: 14%; padding: 10px; text-align: center; color: #444444; font-family: 'Outfit', monospace; border-right: 1px solid #e5e5e0;">${item.hsnCode || "—"}</td>
                    <td style="width: 8%; padding: 10px; text-align: center; font-weight: 700; border-right: 1px solid #e5e5e0;">${item.quantity}</td>
                    <td style="width: 14%; padding: 10px; text-align: right; color: #444444; font-family: 'Outfit', monospace; border-right: 1px solid #e5e5e0;">₹${itemBase.toFixed(2)}</td>
                    <td style="width: 12%; padding: 10px; text-align: center; color: #444444; font-weight: 500;">${itemGst.toFixed(0)}%</td>
                  </tr>
                `;
              }).join('')
            : `<tr><td colspan="6" style="padding: 20px; text-align: center; color: #888888; font-weight: 600;">No items declared in invoice.</td></tr>`
          }
        </tbody>
      </table>

      <!-- Totals & Taxes Alignment Row -->
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px; font-size: 11.5px;">
        <tr>
          <td style="width: 55%;"></td>
          <td style="width: 45%; vertical-align: top;">
            <table style="width: 100%; border-collapse: collapse; line-height: 1.8;">
              ${order.discountAmount && order.discountAmount > 0 ? `
              <tr style="border-bottom: 1px solid #f0f0ed;">
                <td style="color: #666666; padding: 4px 0; text-align: right; padding-right: 15px;">Subtotal (Gross):</td>
                <td style="text-align: right; font-weight: 600; font-family: 'Outfit', monospace; color: #222222; width: 100px;">₹${(order.totalAmount + order.discountAmount).toFixed(2)}</td>
              </tr>
              <tr style="border-bottom: 1px solid #f0f0ed; color: #b45309;">
                <td style="padding: 4px 0; text-align: right; padding-right: 15px; font-weight: 600;">Coupon (${order.couponCode || "Redeemed"}):</td>
                <td style="text-align: right; font-weight: 700; font-family: 'Outfit', monospace;">-₹${order.discountAmount.toFixed(2)}</td>
              </tr>
              ` : ""}
              ${cgstTotal > 0 || sgstTotal > 0 ? `
              <tr style="border-bottom: 1px solid #f0f0ed;">
                <td style="color: #666666; padding: 4px 0; text-align: right; padding-right: 15px;">CGST:</td>
                <td style="text-align: right; font-weight: 600; font-family: 'Outfit', monospace; color: #222222; width: 100px;">₹${cgstTotal.toFixed(2)}</td>
              </tr>
              <tr style="border-bottom: 1px solid #f0f0ed;">
                <td style="color: #666666; padding: 4px 0; text-align: right; padding-right: 15px;">SGST:</td>
                <td style="text-align: right; font-weight: 600; font-family: 'Outfit', monospace; color: #222222;">₹${sgstTotal.toFixed(2)}</td>
              </tr>
              ` : `
              <tr style="border-bottom: 1px solid #f0f0ed;">
                <td style="color: #666666; padding: 4px 0; text-align: right; padding-right: 15px;">IGST:</td>
                <td style="text-align: right; font-weight: 600; font-family: 'Outfit', monospace; color: #222222; width: 100px;">₹${igstTotal.toFixed(2)}</td>
              </tr>
              `}
              <tr style="border-bottom: 1px solid #f0f0ed;">
                <td style="color: #666666; padding: 4px 0; text-align: right; padding-right: 15px; font-weight: 600;">Total Tax (GST):</td>
                <td style="text-align: right; font-weight: 700; font-family: 'Outfit', monospace; color: #222222;">₹${totalTax.toFixed(2)}</td>
              </tr>
              <tr style="line-height: 2.2;">
                <td style="font-size: 13px; font-weight: 700; color: #1a1a1a; text-align: right; padding-right: 15px; padding-top: 5px;">Grand Total:</td>
                <td style="text-align: right; font-size: 16px; font-weight: 800; color: #a67c1e; font-family: 'Outfit', monospace; padding-top: 5px; border-top: 1.5px solid #1a1a1a;">₹${order.totalAmount.toFixed(2)}</td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      <!-- Bottom Operational & Legal Section -->
      <table style="width: 100%; border-collapse: collapse; margin-top: 15px; border-top: 1px solid #f0f0ed; padding-top: 20px; font-size: 11px; line-height: 1.6;">
        <tr>
          <!-- Left Column: Payment & Custom Greeting -->
          <td style="width: 60%; vertical-align: top; padding-right: 25px;">
            <div style="margin-bottom: 12px;">
              <strong style="color: #1a1a1a; text-transform: uppercase; font-size: 9px; letter-spacing: 0.5px; display: block; margin-bottom: 4px;">Payment Info:</strong>
              <span style="color: #444444; font-weight: 500;">Method: ${paymentMode}</span>
              ${isPrepaid && order.paymentTransactionId ? `<span style="display: block; font-size: 9.5px; color: #666666; margin-top: 1px; font-family: monospace;">Transaction ID: ${order.paymentTransactionId}</span>` : ""}
            </div>
            
            <div style="margin-top: 15px; background-color: #faf6e8; border-left: 3px solid #d4af37; padding: 10px 12px; border-radius: 4px; font-size: 10.5px; color: #554010; line-height: 1.5; font-family: 'Outfit', sans-serif;">
              <strong>Namaste ${order.customerName.split(" ")[0]},</strong> thank you for choosing MadhurGram. We hope our pure village-crafted goods add to your health and happiness! Use code <strong style="color: #a67c1e;">PURE10</strong> on your next order for a <strong>10% discount</strong>!
            </div>
          </td>
          
          <!-- Right Column: QR Code & Authorized Signatory -->
          <td style="width: 40%; vertical-align: middle; text-align: right;">
            <div style="display: inline-flex; align-items: center; justify-content: flex-end; gap: 20px;">
              <!-- QR Code Box -->
              <div style="border: 1px solid rgba(212, 175, 55, 0.4); border-radius: 6px; padding: 5px; display: inline-block; text-align: center; background-color: #fafaf9; width: 92px; box-sizing: border-box;">
                <div style="font-size: 6.5px; font-weight: 700; color: #666666; text-transform: uppercase; margin-bottom: 3px; letter-spacing: 0.2px;">Special Gift</div>
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodeURIComponent((typeof window !== 'undefined' ? window.location.origin : 'https://madhurgram.com') + '/?coupon=PURE10')}" style="width: 64px; height: 64px; display: block; margin: 0 auto;" />
                <div style="font-size: 6px; font-weight: 800; color: #a67c1e; text-transform: uppercase; margin-top: 3px; letter-spacing: 0.1px;">Scan for 10% Off</div>
              </div>
              
              <!-- Signatory Box -->
              <div style="text-align: center; width: 130px; display: inline-block; vertical-align: middle;">
                <div style="font-family: 'Playball', cursive; font-size: 24px; color: #a67c1e; line-height: 1; transform: rotate(-5deg); margin-bottom: 6px; font-weight: 500; height: 25px;">MadhurGram</div>
                <div style="border-top: 1.5px solid #1a1a1a; padding-top: 5px; font-size: 9px; font-weight: 700; color: #1a1a1a; text-transform: uppercase; letter-spacing: 0.5px; font-family: 'Outfit', sans-serif;">
                  MadhurGram
                </div>
                <div style="font-size: 8px; color: #666666; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 2px;">
                  Authorized Signatory
                </div>
              </div>
            </div>
          </td>
        </tr>
      </table>

      <!-- Tear-off dashed cut line -->
      <div style="border-top: 2px dashed #d4af37; margin: 35px 0 20px 0; position: relative;">
        <span style="position: absolute; top: -7px; left: 20px; background-color: #ffffff; padding: 0 10px; font-size: 7.5px; color: #a67c1e; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; font-family: 'Outfit', sans-serif;">
          ✂️ Cut along line for warehouse packaging slip
        </span>
      </div>

      <!-- Warehouse Packaging Slip Section -->
      <div style="font-family: 'Outfit', sans-serif; color: #222222; position: relative;">
        <h4 style="font-family: 'Cinzel', serif; font-size: 11px; font-weight: 700; color: #1a1a1a; margin: 0 0 12px 0; letter-spacing: 1px; text-transform: uppercase;">
          Warehouse Packaging Slip (Internal Use Only)
        </h4>
        
        <table style="width: 100%; border-collapse: collapse; font-size: 11px; line-height: 1.5;">
          <tr>
            <td style="width: 70%; vertical-align: top;">
              <div style="margin-bottom: 8px;">
                <strong style="color: #666666;">ORDER ID:</strong> <span style="font-family: monospace; font-weight: bold; color: #111111; font-size: 11.5px;">${orderNumber}</span>
              </div>
              <div>
                <strong style="color: #666666; display: block; margin-bottom: 5px; font-size: 9px; text-transform: uppercase; letter-spacing: 0.5px;">Items to Pack:</strong>
                <table style="width: 100%; border-collapse: collapse;">
                  <thead>
                    <tr style="border-bottom: 1px solid #eeeeee; text-align: left; font-size: 8.5px; color: #666666; text-transform: uppercase;">
                      <th style="padding: 4px 0; font-weight: 600;">Product Name</th>
                      <th style="padding: 4px 0; text-align: center; width: 60px; font-weight: 600;">Qty</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${order.orderItems && order.orderItems.length > 0 
                      ? order.orderItems.map(item => `
                          <tr style="border-bottom: 1px solid #f9f9f9; font-size: 11px; color: #111111;">
                            <td style="padding: 5px 0; font-weight: 600;">${item.productName}</td>
                            <td style="padding: 5px 0; text-align: center; font-weight: bold; font-family: monospace;">${item.quantity}</td>
                          </tr>
                        `).join('')
                      : `<tr><td colspan="2" style="padding: 10px 0; text-align: center; color: #999999;">No items to pack.</td></tr>`
                    }
                  </tbody>
                </table>
              </div>
            </td>
            <td style="width: 30%; vertical-align: bottom; text-align: right; position: relative;">
              <!-- Watermark Stamp -->
              <svg viewBox="0 0 100 100" style="width: 75px; height: 75px; opacity: 0.15; display: inline-block;">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#d4af37" stroke-width="1.5"/>
                <path d="M20,65 C35,55 45,70 80,65 L80,85 L20,85 Z" fill="#d4af37"/>
                <path d="M15,75 C35,65 50,80 85,72 L85,90 L15,90 Z" fill="#d4af37"/>
                <circle cx="50" cy="40" r="12" fill="#d4af37"/>
              </svg>
            </td>
          </tr>
        </table>
      </div>
  `;

  // 🛡️ ULTRA-HD PRESETS TO FIX BLUR AND PIXELATION
  const opt = {
    margin:       0.2,
    filename:     `MadhurGram_Invoice_${orderNumber}.pdf`,
    image:        { type: 'jpeg', quality: 1.0 },
    html2canvas:  { 
      scale: 3, // 🚀 High scale factors to render crystal-clear text layers
      useCORS: true, 
      logging: false,
      letterRendering: true
    },
    jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
  } as const;

  html2pdf().set(opt).from(element).save();
};