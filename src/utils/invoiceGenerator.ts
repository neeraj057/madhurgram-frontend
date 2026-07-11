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
  const baseValue = order.taxableAmount !== undefined ? order.taxableAmount : (order.totalAmount / 1.05);
  const cgstTotal = order.cgstTotal || 0;
  const sgstTotal = order.sgstTotal || 0;
  const igstTotal = order.igstTotal || 0;
  const placeOfSupply = order.cityState || "Uttar Pradesh";

  element.innerHTML = `
    <div style="padding: 45px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #111111; background-color: #ffffff; width: 720px; box-sizing: border-box; border: 1px solid #EAEAEA;">
      
      <!-- Top Decorative Band -->
      <div style="height: 6px; background-color: #D4AF37; margin-bottom: 30px;"></div>

      <!-- Header Section -->
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 40px;">
        <tr>
          <td style="vertical-align: top;">
            <h1 style="font-size: 32px; font-family: 'Georgia', serif; font-weight: 900; color: #111111; margin: 0; letter-spacing: 0.5px;">MADHURGRAM</h1>
            <p style="font-size: 9px; text-transform: uppercase; color: #D4AF37; margin: 4px 0 0 0; font-weight: 800; letter-spacing: 3px;">PURE VILLAGE CRAFTED GOODS</p>
          </td>
          <td style="vertical-align: top; text-align: right;">
            <span style="display: inline-block; padding: 6px 14px; background-color: #FDFBF7; border: 1px solid #D4AF37/30; border-radius: 8px; font-size: 11px; font-weight: bold; color: #D4AF37; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px;">
              Tax Invoice
            </span>
            <div style="font-size: 13px; font-weight: 800; color: #111111; font-family: monospace;">Invoice No: ${orderNumber}</div>
            <div style="font-size: 11px; color: #777777; margin-top: 3px;">Date: ${new Date(order.orderDate).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' })}</div>
          </td>
        </tr>
      </table>

      <!-- Client & Warehouse Address Grid -->
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 35px; border-bottom: 1px solid #F4F4F4; padding-bottom: 25px;">
        <tr>
          <td style="width: 50%; vertical-align: top; padding-right: 25px; line-height: 1.5; font-size: 12px;">
            <strong style="color: #D4AF37; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 8px; font-weight: bold;">Shipped From:</strong>
            <span style="font-size: 13px; font-weight: 700; color: #111111; display: block; margin-bottom: 2px;">MadhurGram Warehouse</span>
            <span style="color: #666666; font-weight: 400;">
              Plot No. 42, G.T. Road, Gopiganj<br/>
              Bhadohi District, Uttar Pradesh - 221303<br/>
              GSTIN: 09AAAFM4592M1ZO
            </span>
          </td>
          <td style="width: 50%; vertical-align: top; padding-left: 25px; line-height: 1.5; font-size: 12px; border-left: 1px solid #F4F4F4;">
            <strong style="color: #D4AF37; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 8px; font-weight: bold;">Deliver To:</strong>
            <span style="font-size: 13px; font-weight: 700; color: #111111; display: block; margin-bottom: 2px;">${order.customerName}</span>
            <span style="color: #666666; font-weight: 400;">
              ${order.address}<br/>
              ${order.cityState} - ${order.pincode}<br/>
              Phone: ${order.phoneNumber}<br/>
              <strong>Place of Supply:</strong> ${placeOfSupply}
            </span>
          </td>
        </tr>
      </table>

      <!-- Table Header -->
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 35px; text-align: left; font-size: 13px;">
        <thead>
          <tr style="background-color: #FDFBF7; border-bottom: 2px solid #EAEAEA;">
            <th style="padding: 12px 15px; font-weight: 700; color: #111111;">Description</th>
            <th style="padding: 12px 15px; text-align: center; font-weight: 700; color: #111111;">HSN</th>
            <th style="padding: 12px 15px; text-align: center; font-weight: 700; color: #111111;">Qty</th>
            <th style="padding: 12px 15px; text-align: right; font-weight: 700; color: #111111;">Unit Price</th>
            <th style="padding: 12px 15px; text-align: right; font-weight: 700; color: #111111;">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${order.orderItems && order.orderItems.length > 0 
            ? order.orderItems.map((item, index) => `
                <tr style="border-bottom: 1px solid #F0F0F0; background-color: ${index % 2 === 0 ? "#FFFFFF" : "#FCFCFC"};">
                  <td style="padding: 14px 15px; font-weight: 600; font-family: 'Georgia', serif; font-size: 14px;">${item.productName}</td>
                  <td style="padding: 14px 15px; text-align: center; color: #555555; font-family: monospace;">${item.hsnCode || "—"}</td>
                  <td style="padding: 14px 15px; text-align: center; font-weight: 700; font-family: monospace;">${item.quantity}</td>
                  <td style="padding: 14px 15px; text-align: right; color: #555555; font-family: monospace;">₹${item.price.toFixed(2)}</td>
                  <td style="padding: 14px 15px; text-align: right; font-weight: 700; font-family: monospace;">₹${(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              `).join('')
            : `<tr><td colspan="5" style="padding: 25px; text-align: center; color: #888888; font-weight: 600;">No items declared in invoice.</td></tr>`
          }
        </tbody>
      </table>

      <!-- Billing Breakdown -->
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 40px; font-size: 12px;">
        <tr>
          <!-- Policy Terms Notes -->
          <td style="width: 55%; vertical-align: top; padding-right: 40px; color: #777777; line-height: 1.6;">
            <strong style="color: #111111; display: block; margin-bottom: 6px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px;">Terms & Conditions:</strong>
            - All prices are inclusive of applicable GST (${cgstTotal > 0 || sgstTotal > 0 ? "CGST + SGST" : "IGST"}).<br/>
            - 100% natural, farm-fresh village crafted sweets and pantry essentials.<br/>
            - For return queries or shelf-life reports, reach out to contact@madhurgram.com.
          </td>
          <!-- Bill Summary -->
          <td style="width: 45%; vertical-align: top;">
            <div style="padding: 15px 20px; background-color: #FAFAFA; border-radius: 12px; border: 1px solid #EAEAEA;">
              <table style="width: 100%; border-collapse: collapse; line-height: 2;">
                <tr>
                  <td style="color: #666666;">Base Value:</td>
                  <td style="text-align: right; font-weight: 600; font-family: monospace;">₹${baseValue.toFixed(2)}</td>
                </tr>
                ${cgstTotal > 0 || sgstTotal > 0 ? `
                <tr>
                  <td style="color: #888888; font-size: 11px; padding-left: 10px;">CGST:</td>
                  <td style="text-align: right; color: #666666; font-family: monospace; font-size: 11px;">₹${cgstTotal.toFixed(2)}</td>
                </tr>
                <tr>
                  <td style="color: #888888; font-size: 11px; padding-left: 10px;">SGST:</td>
                  <td style="text-align: right; color: #666666; font-family: monospace; font-size: 11px;">₹${sgstTotal.toFixed(2)}</td>
                </tr>
                ` : igstTotal > 0 ? `
                <tr>
                  <td style="color: #888888; font-size: 11px; padding-left: 10px;">IGST:</td>
                  <td style="text-align: right; color: #666666; font-family: monospace; font-size: 11px;">₹${igstTotal.toFixed(2)}</td>
                </tr>
                ` : `
                <tr>
                  <td style="color: #888888; font-size: 11px; padding-left: 10px;">Estimated GST (5%):</td>
                  <td style="text-align: right; color: #666666; font-family: monospace; font-size: 11px;">₹${(order.totalAmount - baseValue).toFixed(2)}</td>
                </tr>
                `}
                <tr style="border-bottom: 1px dashed #DDD; padding-bottom: 6px;">
                  <td style="color: #666666;">Payment Method:</td>
                  <td style="text-align: right; font-weight: bold; color: #111111;">
                    ${paymentMode}
                    ${paymentTxnDetail}
                  </td>
                </tr>
                <tr style="line-height: 2.5;">
                  <td style="font-size: 14px; font-weight: bold; color: #111111; padding-top: 10px;">Grand Total:</td>
                  <td style="text-align: right; font-size: 18px; font-weight: 800; color: #D4AF37; font-family: monospace; padding-top: 10px;">₹${order.totalAmount.toFixed(2)}</td>
                </tr>
              </table>
            </div>
          </td>
        </tr>
      </table>

      <!-- Bottom Decorative Band & System Stamp -->
      <div style="border-top: 1px solid #F0F0F0; padding-top: 20px; display: flex; justify-content: space-between; align-items: center; font-size: 10px; color: #999999;">
        <span>This is a computer-generated invoice document. No physical signature is required.</span>
        <strong style="color: #D4AF37; font-family: 'Georgia', serif; font-size: 12px; letter-spacing: 0.5px;">Team MadhurGram 💛</strong>
      </div>
      <div style="height: 6px; background-color: #D4AF37; margin-top: 20px;"></div>

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