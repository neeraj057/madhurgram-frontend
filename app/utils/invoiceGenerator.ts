/**
 * MADHURGRAM ULTRA-HD INVOICE GENERATOR UTILITY (ANTI-BLUR & CRXISP FONTS)
 */

interface OrderItem {
  id: number;
  productName: string;
  quantity: number;
  price: number;
}

interface Order {
  id: number;
  customerName: string;
  phoneNumber: string;
  address: string;
  pincode: string;
  cityState: string;
  totalAmount: number;
  orderStatus: string;
  orderDate: string;
  orderItems: OrderItem[];
}

export const downloadInvoicePDF = async (order: Order) => {
  const html2pdf = (await import('html2pdf.js')).default;

  const element = document.createElement('div');
  
  // 🌟 विजिबिलिटी और क्रिस्पनेस के लिए inline styles को बिल्कुल परफेक्ट कर दिया है भाई
  element.innerHTML = `
    <div style="padding: 50px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #000000; background-color: #ffffff; width: 700px; box-sizing: border-box;">
      
      <div style="border-bottom: 3px solid #B38F00; padding-bottom: 25px; margin-bottom: 35px; display: flex; justify-content: space-between; align-items: center;">
        <div>
          <h1 style="font-size: 30px; margin: 0; font-family: 'Georgia', serif; color: #000000; font-weight: bold; letter-spacing: 1px;">MADHURGRAM</h1>
          <p style="font-size: 11px; text-transform: uppercase; tracking: 3px; color: #B38F00; margin: 6px 0 0 0; font-weight: bold; letter-spacing: 2px;">Handcrafted Village Essentials</p>
        </div>
        <div style="text-align: right;">
          <h2 style="font-size: 18px; margin: 0; color: #222222; font-weight: 800; letter-spacing: 0.5px;">INVOICE RECEIPT</h2>
          <p style="font-family: monospace; font-size: 14px; color: #000000; margin: 6px 0 0 0; font-weight: bold;">Invoice No: MG-000${order.id}</p>
        </div>
      </div>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 35px; font-size: 14px; line-height: 1.6; color: #000000;">
        <tr>
          <td style="width: 50%; vertical-align: top; padding-right: 20px;">
            <strong style="color: #B38F00; font-size: 12px; letter-spacing: 1px; display: block; margin-bottom: 6px; font-weight: bold;">SHIPPED FROM:</strong>
            <span style="color: #111111; font-weight: 500;">MadhurGram Warehouse</span><br/>
            <span style="color: #333333; font-weight: 300;">Gopiganj, Bhadohi<br/>Uttar Pradesh - 221303</span>
          </td>
          <td style="width: 50%; vertical-align: top; text-align: right; padding-left: 20px;">
            <strong style="color: #B38F00; font-size: 12px; letter-spacing: 1px; display: block; margin-bottom: 6px; font-weight: bold;">DELIVER TO:</strong>
            <span style="font-weight: 800; color: #000000; font-size: 15px; display: block; margin-bottom: 2px;">${order.customerName}</span>
            <span style="color: #222222; font-weight: 400;">${order.address}<br/>${order.cityState} - ${order.pincode}</span><br/>
            <span style="font-family: monospace; font-weight: bold; font-size: 13px; display: block; margin-top: 5px;">Mob: +91 ${order.phoneNumber}</span>
          </td>
        </tr>
      </table>

      <div style="margin-bottom: 35px; padding: 12px 15px; background-color: #F8F9FA; border-left: 4px solid #B38F00; font-size: 13px; font-family: monospace; color: #111111; display: flex; justify-content: space-between; font-weight: bold;">
        <span>DATE: ${new Date(order.orderDate).toLocaleDateString()}</span>
        <span>STATUS: <span style="color: #B38F00;">${order.orderStatus}</span></span>
      </div>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 40px; font-size: 14px; color: #000000;">
        <thead>
          <tr style="background-color: #F5EFCF; border-bottom: 2px solid #B38F00; text-align: left; font-size: 12px; font-weight: bold;">
            <th style="padding: 12px 10px; color: #000000;">PRODUCT DESCRIPTION</th>
            <th style="padding: 12px 10px; text-align: center; width: 80px; color: #000000;">QTY</th>
            <th style="padding: 12px 10px; text-align: right; width: 110px; color: #000000;">PRICE</th>
            <th style="padding: 12px 10px; text-align: right; width: 130px; color: #000000;">TOTAL</th>
          </tr>
        </thead>
        <tbody>
          ${order.orderItems && order.orderItems.length > 0 
            ? order.orderItems.map(item => `
                <tr style="border-bottom: 1px solid #E0E0E0;">
                  <td style="padding: 15px 10px; font-family: 'Georgia', serif; font-weight: bold; color: #000000;">${item.productName}</td>
                  <td style="padding: 15px 10px; text-align: center; font-family: monospace; font-weight: bold; color: #000000;">${item.quantity}</td>
                  <td style="padding: 15px 10px; text-align: right; font-family: monospace; color: #333333;">₹${item.price}.00</td>
                  <td style="padding: 15px 10px; text-align: right; font-family: monospace; font-weight: bold; color: #000000;">₹${item.price * item.quantity}.00</td>
                </tr>
              `).join('')
            : `<tr><td colspan="4" style="padding: 20px 10px; text-align: center; color: #666666; font-weight: bold;">No Items Found</td></tr>`
          }
        </tbody>
      </table>

      <div style="border-top: 1px solid #E0E0E0; padding-top: 25px; display: flex; justify-content: space-between; align-items: flex-start;">
        <div style="font-size: 12px; color: #555555; font-style: italic; max-w: 340px; line-height: 1.5;">
          Thank you for supporting traditional village artisans and choosing unadulterated purity from MadhurGram.
        </div>
        <div style="text-align: right; width: 260px;">
          <div style="display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 10px; color: #333333;">
            <span>Mode of Payment:</span>
            <strong style="color: #000000;">COD</strong>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 20px; font-weight: bold; color: #000000; border-top: 2px solid #B38F00; padding-top: 12px; margin-top: 5px;">
            <span>Grand Total:</span>
            <span style="color: #B38F00; font-family: monospace; font-size: 22px;">₹${order.totalAmount}.00</span>
          </div>
        </div>
      </div>
    </div>
  `;

  // 🛡️ ULTRA-HD PRESETS TO FIX BLUR AND PIXELATION
  const opt = {
    margin:       0.1,
    filename:     `MadhurGram_Invoice_MG-000${order.id}.pdf`,
    image:        { type: 'jpeg', quality: 1.0 }, // मैक्सिमम क्वालिटी
    html2canvas:  { 
      scale: 3, // 🚀 स्केल को बढ़ाकर 3 कर दिया ताकि टेक्स्ट बिल्कुल क्रिस्प प्रिंट हो
      useCORS: true, 
      logging: false,
      letterRendering: true // फॉन्ट फटने से रोकता है भाई
    },
    jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
  } as const;

  html2pdf().set(opt).from(element).save();
};