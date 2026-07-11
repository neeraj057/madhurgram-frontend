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

  element.innerHTML = `
    <!-- Google Fonts Integration -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800&family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet">

    <div style="padding: 50px; font-family: 'Outfit', -apple-system, sans-serif; color: #222222; background-color: #ffffff; width: 720px; box-sizing: border-box; border: 1px solid #e5e5e0; position: relative;">
      
      <!-- Top Decorative Band -->
      <div style="display: flex; height: 4px; margin-bottom: 35px;">
        <div style="flex: 3; background-color: #d4af37;"></div>
        <div style="flex: 1; background-color: #1a1a1a;"></div>
      </div>

      <!-- Header Section -->
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 40px;">
        <tr>
          <td style="vertical-align: top;">
            <h1 style="font-size: 28px; font-family: 'Cinzel', serif; font-weight: 800; color: #1a1a1a; margin: 0; letter-spacing: 1.5px; line-height: 1.1;">MADHURGRAM</h1>
            <p style="font-size: 8px; font-family: 'Outfit', sans-serif; text-transform: uppercase; color: #a67c1e; margin: 6px 0 0 0; font-weight: 700; letter-spacing: 3px;">Pure Village Crafted Goods</p>
          </td>
          <td style="vertical-align: top; text-align: right;">
            <span style="display: inline-block; padding: 5px 12px; background-color: #faf6e8; border: 1px solid rgba(212, 175, 55, 0.3); border-radius: 4px; font-size: 10px; font-weight: 700; color: #a67c1e; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 12px; font-family: 'Outfit', sans-serif;">
              Tax Invoice
            </span>
            <div style="font-size: 12px; font-weight: 700; color: #1a1a1a; font-family: 'Outfit', monospace;">INVOICE NO: ${orderNumber}</div>
            <div style="font-size: 11px; color: #666666; margin-top: 4px; font-family: 'Outfit', sans-serif;">Date: ${new Date(order.orderDate).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' })}</div>
          </td>
        </tr>
      </table>

      <!-- Client & Warehouse Address Grid -->
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 40px; border-bottom: 1px solid #f0f0ed; padding-bottom: 25px;">
        <tr>
          <td style="width: 50%; vertical-align: top; padding-right: 30px; line-height: 1.6; font-size: 11.5px;">
            <strong style="color: #a67c1e; font-size: 9px; text-transform: uppercase; letter-spacing: 1.5px; display: block; margin-bottom: 8px; font-weight: 700;">Shipped From:</strong>
            <span style="font-size: 13px; font-weight: 700; color: #1a1a1a; display: block; margin-bottom: 4px; font-family: 'Cinzel', serif;">MadhurGram Warehouse</span>
            <span style="color: #555555; font-weight: 400;">
              Plot No. 42, G.T. Road, Gopiganj<br/>
              Bhadohi District, Uttar Pradesh - 221303<br/>
              <strong style="color: #222222; font-weight: 600;">GSTIN:</strong> 09AAAFM4592M1ZO
            </span>
          </td>
          <td style="width: 50%; vertical-align: top; padding-left: 30px; line-height: 1.6; font-size: 11.5px; border-left: 1px solid #f0f0ed;">
            <strong style="color: #a67c1e; font-size: 9px; text-transform: uppercase; letter-spacing: 1.5px; display: block; margin-bottom: 8px; font-weight: 700;">Deliver To:</strong>
            <span style="font-size: 13px; font-weight: 700; color: #1a1a1a; display: block; margin-bottom: 4px; font-family: 'Cinzel', serif;">${order.customerName}</span>
            <span style="color: #555555; font-weight: 400;">
              ${order.address}<br/>
              ${order.cityState} - ${order.pincode}<br/>
              <strong style="color: #222222; font-weight: 600;">Phone:</strong> ${order.phoneNumber}<br/>
              <strong style="color: #222222; font-weight: 600;">Place of Supply:</strong> ${placeOfSupply}
            </span>
          </td>
        </tr>
      </table>

      <!-- Table Header -->
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 35px; text-align: left; font-size: 12px;">
        <thead>
          <tr style="background-color: #fafaf9; border-bottom: 2px solid #1a1a1a;">
            <th style="width: 45%; padding: 12px 15px; font-weight: 700; color: #1a1a1a; text-transform: uppercase; font-size: 9.5px; letter-spacing: 1px;">Description</th>
            <th style="width: 15%; padding: 12px 15px; text-align: center; font-weight: 700; color: #1a1a1a; text-transform: uppercase; font-size: 9.5px; letter-spacing: 1px;">HSN</th>
            <th style="width: 10%; padding: 12px 15px; text-align: center; font-weight: 700; color: #1a1a1a; text-transform: uppercase; font-size: 9.5px; letter-spacing: 1px;">Qty</th>
            <th style="width: 15%; padding: 12px 15px; text-align: right; font-weight: 700; color: #1a1a1a; text-transform: uppercase; font-size: 9.5px; letter-spacing: 1px;">Unit Price</th>
            <th style="width: 15%; padding: 12px 15px; text-align: right; font-weight: 700; color: #1a1a1a; text-transform: uppercase; font-size: 9.5px; letter-spacing: 1px;">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${order.orderItems && order.orderItems.length > 0 
            ? order.orderItems.map((item, index) => `
                <tr style="border-bottom: 1px solid #eeeeee; background-color: ${index % 2 === 0 ? "#ffffff" : "#fafafa"};">
                  <td style="width: 45%; padding: 14px 15px; font-weight: 600; color: #1a1a1a; font-size: 12.5px;">${item.productName}</td>
                  <td style="width: 15%; padding: 14px 15px; text-align: center; color: #555555; font-family: 'Outfit', monospace; font-size: 11.5px;">${item.hsnCode || "—"}</td>
                  <td style="width: 10%; padding: 14px 15px; text-align: center; font-weight: 700; font-size: 11.5px;">${item.quantity}</td>
                  <td style="width: 15%; padding: 14px 15px; text-align: right; color: #555555; font-family: 'Outfit', monospace; font-size: 11.5px;">₹${item.price.toFixed(2)}</td>
                  <td style="width: 15%; padding: 14px 15px; text-align: right; font-weight: 700; font-family: 'Outfit', monospace; font-size: 11.5px;">₹${(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              `).join('')
            : `<tr><td colspan="5" style="padding: 25px; text-align: center; color: #888888; font-weight: 600;">No items declared in invoice.</td></tr>`
          }
        </tbody>
      </table>

      <!-- Billing Breakdown -->
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 40px; font-size: 11.5px;">
        <tr>
          <!-- Policy Terms Notes -->
          <td style="width: 50%; vertical-align: top; padding-right: 40px; color: #666666; line-height: 1.7;">
            <strong style="color: #1a1a1a; display: block; margin-bottom: 8px; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; font-weight: 700;">Terms & Conditions:</strong>
            <div style="font-weight: 300;">
              • All prices are inclusive of applicable GST (${cgstTotal > 0 || sgstTotal > 0 ? "CGST + SGST" : "IGST"}).<br/>
              • 100% natural, farm-fresh village crafted sweets and pantry essentials.<br/>
              • For queries, reach out to <span style="color: #a67c1e; font-weight: 500;">contact@madhurgram.com</span>.
            </div>
          </td>
          <!-- Bill Summary Card -->
          <td style="width: 50%; vertical-align: top;">
            <div style="padding: 20px; background-color: #fafaf9; border-radius: 8px; border: 1px solid #f0f0ed;">
              <table style="width: 100%; border-collapse: collapse; line-height: 2;">
                <tr>
                  <td style="color: #666666; font-weight: 400;">Base Value:</td>
                  <td style="text-align: right; font-weight: 600; font-family: 'Outfit', monospace; color: #1a1a1a;">₹${baseValue.toFixed(2)}</td>
                </tr>
                ${cgstTotal > 0 || sgstTotal > 0 ? `
                <tr>
                  <td style="color: #888888; font-size: 10.5px; padding-left: 0;">CGST:</td>
                  <td style="text-align: right; color: #666666; font-family: 'Outfit', monospace; font-size: 10.5px;">₹${cgstTotal.toFixed(2)}</td>
                </tr>
                <tr>
                  <td style="color: #888888; font-size: 10.5px; padding-left: 0;">SGST:</td>
                  <td style="text-align: right; color: #666666; font-family: 'Outfit', monospace; font-size: 10.5px;">₹${sgstTotal.toFixed(2)}</td>
                </tr>
                ` : igstTotal > 0 ? `
                <tr>
                  <td style="color: #888888; font-size: 10.5px; padding-left: 0;">IGST:</td>
                  <td style="text-align: right; color: #666666; font-family: 'Outfit', monospace; font-size: 10.5px;">₹${igstTotal.toFixed(2)}</td>
                </tr>
                ` : `
                <tr>
                  <td style="color: #888888; font-size: 10.5px; padding-left: 0;">Estimated GST (5%):</td>
                  <td style="text-align: right; color: #666666; font-family: 'Outfit', monospace; font-size: 10.5px;">₹${(order.totalAmount - baseValue).toFixed(2)}</td>
                </tr>
                `}
                <tr style="border-top: 1px dashed #e5e5e0; margin-top: 6px; padding-top: 6px;">
                  <td style="color: #666666; padding-top: 8px;">Payment Mode:</td>
                  <td style="text-align: right; font-weight: 700; color: #1a1a1a; padding-top: 8px;">
                    ${paymentMode}
                    ${isPrepaid && order.paymentTransactionId ? `<div style="font-size: 9px; color: #666666; font-weight: 400; margin-top: 2px; font-family: 'Outfit', monospace;">Txn ID: ${order.paymentTransactionId}</div>` : ""}
                  </td>
                </tr>
                <tr style="line-height: 2.5;">
                  <td style="font-size: 13px; font-weight: 700; color: #1a1a1a; padding-top: 10px;">Grand Total:</td>
                  <td style="text-align: right; font-size: 18px; font-weight: 800; color: #a67c1e; font-family: 'Outfit', monospace; padding-top: 10px;">₹${order.totalAmount.toFixed(2)}</td>
                </tr>
              </table>
            </div>
          </td>
        </tr>
      </table>

      <!-- Bottom Decorative Band & System Stamp -->
      <div style="border-top: 1px solid #f0f0ed; padding-top: 20px; display: flex; justify-content: space-between; align-items: center; font-size: 9.5px; color: #888888; font-family: 'Outfit', sans-serif;">
        <span>This is a computer-generated invoice document. No physical signature is required.</span>
        <strong style="color: #a67c1e; font-family: 'Cinzel', serif; font-size: 11px; letter-spacing: 0.5px; font-weight: 700;">Team MadhurGram 💛</strong>
      </div>
      <div style="display: flex; height: 4px; margin-top: 20px;">
        <div style="flex: 3; background-color: #d4af37;"></div>
        <div style="flex: 1; background-color: #1a1a1a;"></div>
      </div>

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