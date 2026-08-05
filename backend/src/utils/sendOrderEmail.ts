import transporter from '../config/email';
import PDFDocument from 'pdfkit';

interface OrderItem {
  name: string;
  size: number;
  color: string;
  quantity: number;
  price: number;
  image?: string;
}

interface OrderData {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerAddress: string;
  customerCity: string;
  items: OrderItem[];
  subtotal: number;
  deliveryCharges: number;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  transactionId?: string;
  notes?: string;
  createdAt: Date;
}

// ─────────────────────────────────────
// GENERATE PDF BUFFER
// ─────────────────────────────────────
export const generateOrderPDF = (order: OrderData): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margin: 36,
        autoFirstPage: true,
      });

      const buffers: Buffer[] = [];
      doc.on('data', (chunk) => buffers.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', reject);

      const GOLD = '#B8860B';
      const DARK = '#1A1714';
      const GRAY = '#5C5650';
      const LIGHT = '#F5F3EE';

      const L = 36; // left margin
      const pageWidth = doc.page.width - L * 2;

      // ── HEADER (compact) ──
      doc.rect(0, 0, doc.page.width, 72).fill(DARK);
      doc.fillColor('#FFFFFF').font('Helvetica-Bold').fontSize(18)
        .text('DIVENECRAFT', L, 14, { align: 'center', width: pageWidth });
      doc.fillColor(GOLD).font('Helvetica').fontSize(8)
        .text('Unveiling the Soul of Handmade Artistry', L, 36, { align: 'center', width: pageWidth });
      doc.fillColor('#FFFFFF').font('Helvetica').fontSize(7)
        .text('ORDER RECEIPT', L, 52, { align: 'center', width: pageWidth });

      let y = 82;

      // ── ORDER INFO BOX ──
      const orderDate = new Date(order.createdAt);
      const dateStr = orderDate.toLocaleDateString('en-PK', { day: '2-digit', month: 'long', year: 'numeric' });
      const timeStr = orderDate.toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit' });

      doc.rect(L, y, pageWidth, 52).fill(LIGHT);
      // Left col
      doc.fillColor(GRAY).font('Helvetica').fontSize(8).text('Order Number:', L + 8, y + 8);
      doc.fillColor(DARK).font('Helvetica-Bold').fontSize(8).text(order.orderNumber, L + 8, y + 18);
      doc.fillColor(GRAY).font('Helvetica').fontSize(8).text('Date:', L + 8, y + 32);
      doc.fillColor(DARK).font('Helvetica').fontSize(8).text(`${dateStr} at ${timeStr}`, L + 8, y + 42);
      // Right col
      const rxCol = L + pageWidth / 2;
      doc.fillColor(GRAY).font('Helvetica').fontSize(8).text('Payment:', rxCol, y + 8);
      doc.fillColor(DARK).font('Helvetica-Bold').fontSize(8)
        .text(order.paymentMethod.toUpperCase().replace('_', ' '), rxCol, y + 18);
      doc.fillColor(GRAY).font('Helvetica').fontSize(8).text('Status:', rxCol, y + 32);
      const statusColor = order.paymentStatus === 'paid' ? '#2D6A4F' : '#854D0E';
      doc.fillColor(statusColor).font('Helvetica-Bold').fontSize(8)
        .text(order.paymentStatus.toUpperCase(), rxCol, y + 42);

      y += 60;

      // ── SECTION HEADER helper ──
      const sectionHeader = (title: string) => {
        doc.fillColor(DARK).font('Helvetica-Bold').fontSize(9).text(title, L, y);
        doc.moveTo(L, y + 12).lineTo(L + pageWidth, y + 12)
          .strokeColor(GOLD).lineWidth(0.8).stroke();
        y += 18;
      };

      // ── CUSTOMER DETAILS ──
      sectionHeader('CUSTOMER DETAILS');
      const custData: [string, string][] = [
        ['Name',    order.customerName],
        ['Phone',   order.customerPhone],
        ['Email',   order.customerEmail || 'Not provided'],
        ['City',    order.customerCity],
        ['Address', order.customerAddress],
      ];
      if (order.notes) custData.push(['Notes', order.notes]);

      custData.forEach(([label, value]) => {
        doc.fillColor(GRAY).font('Helvetica').fontSize(8).text(`${label}:`, L, y, { width: 60 });
        doc.fillColor(DARK).font('Helvetica').fontSize(8).text(value, L + 64, y, { width: pageWidth - 64 });
        // Measure rendered height to advance y correctly for multi-line values
        const h = doc.heightOfString(value, { width: pageWidth - 64 });
        y += Math.max(14, h + 2);
      });

      y += 6;

      // ── ORDER ITEMS TABLE ──
      sectionHeader('ORDER ITEMS');

      // Table header
      const cols = { product: L + 2, color: L + 240, qty: L + 298, price: L + 340, total: L + 408 };
      doc.rect(L, y, pageWidth, 18).fill(DARK);
      doc.fillColor('#FFFFFF').font('Helvetica-Bold').fontSize(7);
      doc.text('PRODUCT',  cols.product, y + 5);
      doc.text('COLOR',    cols.color,   y + 5);
      doc.text('QTY',      cols.qty,     y + 5);
      doc.text('PRICE',    cols.price,   y + 5);
      doc.text('TOTAL',    cols.total,   y + 5);
      y += 18;

      order.items.forEach((item, index) => {
        const rowBg = index % 2 === 0 ? '#FFFFFF' : LIGHT;
        doc.rect(L, y, pageWidth, 16).fill(rowBg);
        const itemTotal = item.price * item.quantity;
        doc.fillColor(DARK).font('Helvetica').fontSize(7);
        doc.text(item.name.substring(0, 38), cols.product, y + 4);
        doc.text(item.color || 'N/A',                      cols.color,   y + 4);
        doc.text(item.quantity.toString(),                  cols.qty,     y + 4);
        doc.text(`PKR ${item.price.toLocaleString()}`,     cols.price,   y + 4);
        doc.text(`PKR ${itemTotal.toLocaleString()}`,      cols.total,   y + 4);
        y += 16;
      });

      // Table border
      doc.rect(L, y - (order.items.length * 16) - 18, pageWidth, order.items.length * 16 + 18)
        .strokeColor('#E8E4DC').lineWidth(0.4).stroke();

      y += 4;

      // ── PRICE SUMMARY ──
      const sumX = L + pageWidth - 200;
      const sumW = 200;
      const priceRows: [string, string][] = [
        ['Subtotal:', `PKR ${order.subtotal.toLocaleString()}`],
        ['TCS Delivery:', order.deliveryCharges === 0 ? 'FREE' : `PKR ${order.deliveryCharges.toLocaleString()}`],
      ];
      priceRows.forEach(([label, value]) => {
        doc.fillColor(GRAY).font('Helvetica').fontSize(8).text(label, sumX, y, { width: 100 });
        doc.fillColor(DARK).font('Helvetica').fontSize(8)
          .text(value, sumX + 100, y, { align: 'right', width: 96 });
        y += 14;
      });
      doc.rect(sumX, y, sumW, 20).fill(DARK);
      doc.fillColor('#FFFFFF').font('Helvetica-Bold').fontSize(9).text('TOTAL:', sumX + 4, y + 5);
      doc.fillColor(GOLD).font('Helvetica-Bold').fontSize(9)
        .text(`PKR ${order.totalAmount.toLocaleString()}`, sumX + 4, y + 5, { align: 'right', width: sumW - 8 });
      y += 24;

      // ── PAYMENT INSTRUCTIONS ──
      y += 6;
      sectionHeader('PAYMENT INSTRUCTIONS');

      const method = order.paymentMethod.toLowerCase();
      let payLines: string[] = [];
      if (method === 'cod') {
        payLines = [
          `Please keep PKR ${order.totalAmount.toLocaleString()} ready in cash for payment on delivery.`,
          'Our TCS courier will deliver within 2 business days.',
        ];
      } else if (method === 'jazzcash') {
        payLines = [
          'JazzCash Number: +92 300 7709173 (Rimsha Ali)',
          `Amount: PKR ${order.totalAmount.toLocaleString()}`,
          order.transactionId ? `Transaction ID: ${order.transactionId}` : 'Please send payment and share Transaction ID on WhatsApp.',
        ];
      } else if (method === 'easypaisa') {
        payLines = [
          'Easypaisa Number: +92 300 7709173 (Rimsha Ali)',
          `Amount: PKR ${order.totalAmount.toLocaleString()}`,
          order.transactionId ? `Transaction ID: ${order.transactionId}` : 'Please send payment and share Transaction ID on WhatsApp.',
        ];
      } else if (method === 'bank_transfer') {
        payLines = [
          'Bank: Meezan Bank | Account: 48010112475304 | Title: DiveneCraft',
          `Amount: PKR ${order.totalAmount.toLocaleString()}`,
          order.transactionId ? `Reference ID: ${order.transactionId}` : 'Please transfer and share Reference on WhatsApp.',
        ];
      }

      doc.rect(L, y, pageWidth, payLines.length * 14 + 12).fill(LIGHT)
        .strokeColor('#E8E4DC').lineWidth(0.4).stroke();
      payLines.forEach((line, i) => {
        doc.fillColor(DARK).font('Helvetica').fontSize(8)
          .text(line, L + 8, y + 6 + i * 14, { width: pageWidth - 16 });
      });
      y += payLines.length * 14 + 16;

      // ── FOOTER (immediately after content) ──
      doc.moveTo(L, y).lineTo(L + pageWidth, y).strokeColor('#E8E4DC').lineWidth(0.4).stroke();
      y += 6;
      doc.fillColor(DARK).font('Helvetica-Bold').fontSize(8)
        .text('Thank you for shopping with DiveneCraft!', L, y, { align: 'center', width: pageWidth });
      y += 12;
      doc.fillColor(GRAY).font('Helvetica').fontSize(7)
        .text('WhatsApp: +92 300 770 9173  |  7-day exchange on unused items', L, y, { align: 'center', width: pageWidth });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

// ─────────────────────────────────────
// SEND EMAIL WITH PDF ATTACHMENT
// ─────────────────────────────────────
export const sendOrderEmail = async (order: OrderData): Promise<void> => {
  try {
    // Generate PDF
    const pdfBuffer = await generateOrderPDF(order);

    const orderDate = new Date(order.createdAt);
    const dateStr = orderDate.toLocaleDateString('en-PK', {
      day: '2-digit', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });

    const method = order.paymentMethod.toLowerCase();

    // Payment details HTML block
    let paymentHTML = '';
    if (method === 'cod') {
      paymentHTML = `
        <div style="background:#FEF9C3;border:1px solid #EAB308;padding:16px;margin-top:16px;border-radius:4px;">
          <strong style="color:#854D0E;">💵 Cash on Delivery</strong><br>
          <span style="color:#854D0E;font-size:13px;">
            Customer will pay <strong>PKR ${order.totalAmount.toLocaleString()}</strong> in cash on delivery.
          </span>
        </div>`;
    } else if (method === 'jazzcash') {
      paymentHTML = `
        <div style="background:#FFF7ED;border:1px solid #F97316;padding:16px;margin-top:16px;border-radius:4px;">
          <strong style="color:#9A3412;">📱 JazzCash Payment</strong><br>
          <span style="color:#9A3412;font-size:13px;">
            Number: <strong>+92 300 7709173</strong> (Rimsha Ali)<br>
            Amount: <strong>PKR ${order.totalAmount.toLocaleString()}</strong><br>
            ${order.transactionId ? `Transaction ID: <strong>${order.transactionId}</strong>` : '⚠️ Payment verification pending'}
          </span>
        </div>`;
    } else if (method === 'easypaisa') {
      paymentHTML = `
        <div style="background:#F0FDF4;border:1px solid #22C55E;padding:16px;margin-top:16px;border-radius:4px;">
          <strong style="color:#166534;">📱 Easypaisa Payment</strong><br>
          <span style="color:#166534;font-size:13px;">
            Number: <strong>+92 300 7709173</strong> (Rimsha Ali)<br>
            Amount: <strong>PKR ${order.totalAmount.toLocaleString()}</strong><br>
            ${order.transactionId ? `Transaction ID: <strong>${order.transactionId}</strong>` : '⚠️ Payment verification pending'}
          </span>
        </div>`;
    } else if (method === 'bank_transfer') {
      paymentHTML = `
        <div style="background:#EFF6FF;border:1px solid #3B82F6;padding:16px;margin-top:16px;border-radius:4px;">
          <strong style="color:#1E40AF;">🏦 Bank Transfer (Meezan Bank)</strong><br>
          <span style="color:#1E40AF;font-size:13px;">
            Account: <strong>48010112475304</strong> | Title: <strong>DiveneCraft</strong><br>
            Amount: <strong>PKR ${order.totalAmount.toLocaleString()}</strong><br>
            ${order.transactionId ? `Reference ID: <strong>${order.transactionId}</strong>` : '⚠️ Payment verification pending'}
          </span>
        </div>`;
    }

    // Items table rows
    const itemRows = order.items.map((item, i) => `
      <tr style="background:${i % 2 === 0 ? '#FFFFFF' : '#F5F3EE'};">
        <td style="padding:10px 12px;font-size:13px;color:#1A1714;border-bottom:1px solid #E8E4DC;">${item.name}</td>
        <td style="padding:10px 12px;font-size:13px;color:#5C5650;border-bottom:1px solid #E8E4DC;text-align:center;">${item.color || 'N/A'}</td>
        <td style="padding:10px 12px;font-size:13px;color:#5C5650;border-bottom:1px solid #E8E4DC;text-align:center;">${item.quantity}</td>
        <td style="padding:10px 12px;font-size:13px;color:#1A1714;border-bottom:1px solid #E8E4DC;text-align:right;">PKR ${item.price.toLocaleString()}</td>
        <td style="padding:10px 12px;font-size:13px;font-weight:600;color:#1A1714;border-bottom:1px solid #E8E4DC;text-align:right;">PKR ${(item.price * item.quantity).toLocaleString()}</td>
      </tr>`).join('');

    // Full HTML email
    const htmlEmail = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>New Order — ${order.orderNumber}</title>
</head>
<body style="margin:0;padding:0;background:#F5F3EE;font-family:Arial,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F3EE;padding:24px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#FFFFFF;max-width:600px;">

        <!-- HEADER -->
        <tr>
          <td style="background:#1A1714;padding:28px 40px;text-align:center;">
            <h1 style="color:#FFFFFF;font-size:22px;margin:0;letter-spacing:4px;font-family:Georgia,serif;">
              DIVENECRAFT
            </h1>
            <p style="color:#B8860B;font-size:11px;margin:6px 0 0;letter-spacing:2px;">
              UNVEILING THE SOUL OF HANDMADE ARTISTRY
            </p>
          </td>
        </tr>

        <!-- ALERT BANNER -->
        <tr>
          <td style="background:#B8860B;padding:14px 40px;text-align:center;">
            <p style="color:#FFFFFF;font-size:14px;font-weight:bold;margin:0;">
              🛍️ NEW ORDER RECEIVED — ${order.orderNumber}
            </p>
            <p style="color:#FBF6E9;font-size:12px;margin:4px 0 0;">${dateStr}</p>
          </td>
        </tr>

        <!-- BODY -->
        <tr>
          <td style="padding:32px 40px;">

            <!-- ORDER INFO -->
            <table width="100%" cellpadding="0" cellspacing="0"
              style="background:#F5F3EE;border:1px solid #E8E4DC;margin-bottom:24px;">
              <tr>
                <td style="padding:14px 16px;border-right:1px solid #E8E4DC;">
                  <p style="font-size:10px;color:#9C9890;margin:0;letter-spacing:1px;text-transform:uppercase;">Order Number</p>
                  <p style="font-size:15px;font-weight:bold;color:#B8860B;margin:4px 0 0;">${order.orderNumber}</p>
                </td>
                <td style="padding:14px 16px;border-right:1px solid #E8E4DC;">
                  <p style="font-size:10px;color:#9C9890;margin:0;letter-spacing:1px;text-transform:uppercase;">Payment</p>
                  <p style="font-size:13px;font-weight:bold;color:#1A1714;margin:4px 0 0;">${order.paymentMethod.toUpperCase().replace('_',' ')}</p>
                </td>
                <td style="padding:14px 16px;">
                  <p style="font-size:10px;color:#9C9890;margin:0;letter-spacing:1px;text-transform:uppercase;">Status</p>
                  <p style="font-size:13px;font-weight:bold;color:${order.paymentStatus === 'paid' ? '#166534' : '#854D0E'};margin:4px 0 0;">
                    ${order.paymentStatus.toUpperCase()}
                  </p>
                </td>
              </tr>
            </table>

            <!-- CUSTOMER DETAILS -->
            <h3 style="font-size:12px;letter-spacing:2px;color:#9C9890;margin:0 0 12px;
                        text-transform:uppercase;border-bottom:1px solid #E8E4DC;padding-bottom:8px;">
              Customer Details
            </h3>
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
              ${[
                ['Name', order.customerName],
                ['Phone', order.customerPhone],
                ['Email', order.customerEmail || 'Not provided'],
                ['City', order.customerCity],
                ['Address', order.customerAddress],
                ['Notes', order.notes || 'None'],
              ].map(([label, value]) => `
              <tr>
                <td style="padding:6px 0;font-size:12px;color:#9C9890;width:80px;">${label}:</td>
                <td style="padding:6px 0;font-size:13px;color:#1A1714;font-weight:500;">${value}</td>
              </tr>`).join('')}
            </table>

            <!-- ORDER ITEMS -->
            <h3 style="font-size:12px;letter-spacing:2px;color:#9C9890;margin:0 0 12px;
                        text-transform:uppercase;border-bottom:1px solid #E8E4DC;padding-bottom:8px;">
              Order Items
            </h3>
            <table width="100%" cellpadding="0" cellspacing="0"
              style="border:1px solid #E8E4DC;margin-bottom:24px;">
              <tr style="background:#1A1714;">
                <th style="padding:10px 12px;font-size:10px;color:#FFFFFF;letter-spacing:1px;text-align:left;">PRODUCT</th>
                <th style="padding:10px 12px;font-size:10px;color:#FFFFFF;letter-spacing:1px;text-align:center;">COLOR</th>
                <th style="padding:10px 12px;font-size:10px;color:#FFFFFF;letter-spacing:1px;text-align:center;">QTY</th>
                <th style="padding:10px 12px;font-size:10px;color:#FFFFFF;letter-spacing:1px;text-align:right;">PRICE</th>
                <th style="padding:10px 12px;font-size:10px;color:#FFFFFF;letter-spacing:1px;text-align:right;">TOTAL</th>
              </tr>
              ${itemRows}
              <!-- Subtotal -->
              <tr style="background:#F5F3EE;">
                <td colspan="4" style="padding:10px 12px;font-size:12px;color:#5C5650;text-align:right;">Subtotal:</td>
                <td style="padding:10px 12px;font-size:13px;color:#1A1714;text-align:right;">PKR ${order.subtotal.toLocaleString()}</td>
              </tr>
              <!-- Delivery -->
              <tr style="background:#F5F3EE;">
                <td colspan="4" style="padding:6px 12px;font-size:12px;color:#5C5650;text-align:right;">TCS Delivery:</td>
                <td style="padding:6px 12px;font-size:13px;color:#1A1714;text-align:right;">
                  ${order.deliveryCharges === 0 ? '<span style="color:#166534;font-weight:bold;">FREE</span>' : `PKR ${order.deliveryCharges.toLocaleString()}`}
                </td>
              </tr>
              <!-- Total -->
              <tr style="background:#1A1714;">
                <td colspan="4" style="padding:12px;font-size:13px;font-weight:bold;color:#FFFFFF;text-align:right;letter-spacing:1px;">TOTAL:</td>
                <td style="padding:12px;font-size:15px;font-weight:bold;color:#C9A84C;text-align:right;">PKR ${order.totalAmount.toLocaleString()}</td>
              </tr>
            </table>

            <!-- PAYMENT INSTRUCTIONS -->
            <h3 style="font-size:12px;letter-spacing:2px;color:#9C9890;margin:0 0 8px;
                        text-transform:uppercase;border-bottom:1px solid #E8E4DC;padding-bottom:8px;">
              Payment Instructions
            </h3>
            ${paymentHTML}

          </td>
        </tr>

        <!-- FOOTER -->
        <tr>
          <td style="background:#1A1714;padding:20px 40px;text-align:center;">
            <p style="color:#9C9890;font-size:11px;margin:0;">
              This email was sent automatically by DiveneCraft order system.
            </p>
            <p style="color:#C9A84C;font-size:11px;margin:8px 0 0;">
              WhatsApp: +92 300 770 9173 | Return Policy: 7-day exchange on unused items
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>

</body>
</html>`;

    // Send email
    const mailOptions = {
      from: `"DiveneCraft" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL || 'Hafizhaideraliuet@gmail.com',
      subject: `🛍️ New Order — ${order.orderNumber} — PKR ${order.totalAmount.toLocaleString()}`,
      html: htmlEmail,
      attachments: [
        {
          filename: `Order_${order.orderNumber}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ],
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Order email sent for ${order.orderNumber}`);

  } catch (error) {
    // IMPORTANT: Never throw — order must succeed even if email fails
    console.error(`❌ Email failed for order ${(order as any).orderNumber}:`, error);
  }
};
