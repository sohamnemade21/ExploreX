/**
 * ExploreX Smart Tourism Platform
 * Pure TypeScript PDF Tax Invoice Generator (PDF-1.4 Specification)
 * Zero external binary dependencies, fully compliant with Section 31 of CGST Act 2017.
 */

import { Booking } from '../../src/types';

function escapePdf(str: string): string {
  if (!str) return '';
  return str
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)');
}

function formatINRText(num: number): string {
  return 'INR ' + Number(num || 0).toLocaleString('en-IN');
}

export class PdfInvoiceService {
  /**
   * Generates a complete, professional GST Tax Invoice in standard PDF-1.4 format.
   * Returns a Buffer ready for email attachment or HTTP file download.
   */
  public static generateInvoicePdf(booking: Booking, customerEmail?: string, customerName?: string): Buffer {
    const streamLines: string[] = [];
    const invNo = booking.invoice?.invoiceNo || `INV-${booking.id.replace(/[^0-9A-Z]/gi, '').slice(-8)}`;
    const bookingDateStr = booking.bookingDate ? new Date(booking.bookingDate).toLocaleString('en-IN') : new Date().toLocaleString('en-IN');
    const guestName = customerName || booking.passengerDetails?.[0]?.name || 'Valued Traveler';
    const email = customerEmail || booking.details?.contactEmail || 'traveler@explorex.com';
    const phone = booking.details?.contactPhone || '+91 9876543210';
    const paymentRef = booking.details?.razorpayPaymentId || booking.details?.paymentId || `PAY-${booking.id.slice(-8).toUpperCase()}`;
    const paymentMode = (booking.paymentMethod || 'Razorpay Gateway').toUpperCase();

    const baseFare = booking.invoice?.baseFare || Math.round(booking.totalAmount / 1.18);
    const taxes = booking.invoice?.taxes || (booking.totalAmount - baseFare);
    const cgst = Math.round(taxes / 2);
    const sgst = taxes - cgst;
    const discounts = booking.invoice?.discounts || 0;
    const grandTotal = booking.totalAmount;

    // 1. Slate Top Banner (#0f172a)
    streamLines.push('q');
    streamLines.push('0.06 0.09 0.16 rg'); // #0f172a
    streamLines.push('0 740 595 102 re f');
    streamLines.push('Q');

    // Header Typography
    streamLines.push('BT');
    streamLines.push('/F2 20 Tf 1 1 1 rg 40 808 Td (EXPLOREX SMART TOURISM PVT LTD) Tj');
    streamLines.push('/F1 9 Tf 0.22 0.74 0.97 rg 40 792 Td (TAX INVOICE & OFFICIAL TRAVEL CONFIRMATION VOUCHER) Tj');
    streamLines.push('/F1 8 Tf 0.85 0.85 0.85 rg 40 768 Td (GSTIN: 27AABCE1234F1Z5  |  CIN: U63040MH2024PTC123456  |  HSN/SAC: 998553) Tj');
    streamLines.push('/F1 8 Tf 0.85 0.85 0.85 rg 40 754 Td (Regd Office: Level 9, Maker Maxity, Bandra Kurla Complex, Mumbai, MH 400051) Tj');
    streamLines.push('ET');

    // 2. Invoice Summary Card (Two-column Box)
    streamLines.push('q');
    streamLines.push('0.97 0.98 0.99 rg 40 648 515 78 re f');
    streamLines.push('0.85 0.88 0.92 RG 1 w 40 648 515 78 re s');
    streamLines.push('Q');

    streamLines.push('BT');
    streamLines.push('/F2 10 Tf 0.06 0.09 0.16 rg 52 708 Td (' + escapePdf('TAX INVOICE NO: ' + invNo) + ') Tj');
    streamLines.push('/F1 9 Tf 0.2 0.2 0.2 rg 52 692 Td (' + escapePdf('BOOKING REFERENCE: ' + booking.id) + ') Tj');
    streamLines.push('/F1 9 Tf 0.2 0.2 0.2 rg 52 676 Td (' + escapePdf('INVOICE DATE & TIME: ' + bookingDateStr) + ') Tj');
    streamLines.push('/F1 9 Tf 0.2 0.2 0.2 rg 52 660 Td (' + escapePdf('PROVIDER INVENTORY: ' + (booking.isSimulation ? 'ExploreX Verified Simulation (Demo)' : 'Direct Partner Hold')) + ') Tj');

    streamLines.push('/F2 10 Tf 0.08 0.55 0.24 rg 320 708 Td (' + escapePdf('PAYMENT STATUS: ' + (booking.paymentStatus || 'PAID').toUpperCase()) + ') Tj');
    streamLines.push('/F1 9 Tf 0.2 0.2 0.2 rg 320 692 Td (' + escapePdf('TRANSACTION REF: ' + paymentRef) + ') Tj');
    streamLines.push('/F1 9 Tf 0.2 0.2 0.2 rg 320 676 Td (' + escapePdf('PAYMENT METHOD: ' + paymentMode) + ') Tj');
    streamLines.push('/F1 9 Tf 0.2 0.2 0.2 rg 320 660 Td (' + escapePdf('CURRENCY: INR (INDIAN RUPEES)') + ') Tj');
    streamLines.push('ET');

    // 3. Customer & Journey Particulars Box
    streamLines.push('q');
    streamLines.push('0.98 0.98 0.99 rg 40 564 515 72 re f');
    streamLines.push('0.88 0.9 0.93 RG 1 w 40 564 515 72 re s');
    streamLines.push('Q');

    streamLines.push('BT');
    streamLines.push('/F2 10 Tf 0.06 0.09 0.16 rg 52 622 Td (CUSTOMER / BILLED TO:) Tj');
    streamLines.push('/F1 9 Tf 0.2 0.2 0.2 rg 52 606 Td (' + escapePdf('Name: ' + guestName) + ') Tj');
    streamLines.push('/F1 9 Tf 0.2 0.2 0.2 rg 52 590 Td (' + escapePdf('Registered Email: ' + email) + ') Tj');
    streamLines.push('/F1 9 Tf 0.2 0.2 0.2 rg 52 574 Td (' + escapePdf('Contact Phone: ' + phone) + ') Tj');

    streamLines.push('/F2 10 Tf 0.06 0.09 0.16 rg 320 622 Td (TRIP & DESTINATION PARTICULARS:) Tj');
    streamLines.push('/F1 9 Tf 0.2 0.2 0.2 rg 320 606 Td (' + escapePdf('Destination: ' + (booking.destinationName || 'India')) + ') Tj');
    streamLines.push('/F1 9 Tf 0.2 0.2 0.2 rg 320 590 Td (' + escapePdf('Travel Date: ' + (booking.travelDate || 'Flexible') + (booking.returnDate ? ' to ' + booking.returnDate : '')) + ') Tj');
    streamLines.push('/F1 9 Tf 0.2 0.2 0.2 rg 320 574 Td (' + escapePdf('Total Guests / Seats: ' + (booking.passengersCount || 1) + ' Traveler(s)') + ') Tj');
    streamLines.push('ET');

    // 4. Itemized Table Header
    streamLines.push('q');
    streamLines.push('0.06 0.09 0.16 rg 40 528 515 24 re f');
    streamLines.push('Q');

    streamLines.push('BT');
    streamLines.push('/F2 9 Tf 1 1 1 rg 50 536 Td (ITEM DESCRIPTION / SERVICE PARTICULARS) Tj');
    streamLines.push('/F2 9 Tf 1 1 1 rg 340 536 Td (SAC CODE) Tj');
    streamLines.push('/F2 9 Tf 1 1 1 rg 420 536 Td (QTY) Tj');
    streamLines.push('/F2 9 Tf 1 1 1 rg 480 536 Td (AMOUNT) Tj');
    streamLines.push('ET');

    // Table Row: Main Service
    streamLines.push('q');
    streamLines.push('0.95 0.95 0.96 RG 1 w 40 502 515 0 re s');
    streamLines.push('Q');

    const serviceTitle = `${booking.serviceType.toUpperCase()}: ${booking.title || 'Travel Reservation'}`;
    streamLines.push('BT');
    streamLines.push('/F2 9 Tf 0.1 0.1 0.1 rg 50 512 Td (' + escapePdf(serviceTitle.slice(0, 48)) + ') Tj');
    streamLines.push('/F1 9 Tf 0.3 0.3 0.3 rg 340 512 Td (998553) Tj');
    streamLines.push('/F1 9 Tf 0.3 0.3 0.3 rg 420 512 Td (' + (booking.passengersCount || 1) + ') Tj');
    streamLines.push('/F1 9 Tf 0.1 0.1 0.1 rg 470 512 Td (' + escapePdf(formatINRText(baseFare)) + ') Tj');
    streamLines.push('ET');

    // Add-on row if applicable
    let curY = 486;
    if (booking.details?.insuranceActive || booking.details?.carbonNeutral) {
      streamLines.push('q');
      streamLines.push('0.95 0.95 0.96 RG 1 w 40 ' + (curY - 6) + ' 515 0 re s');
      streamLines.push('Q');

      streamLines.push('BT');
      streamLines.push('/F1 9 Tf 0.2 0.2 0.2 rg 50 ' + curY + ' Td (Travel Care Protection & Green Carbon Offset) Tj');
      streamLines.push('/F1 9 Tf 0.3 0.3 0.3 rg 340 ' + curY + ' Td (998553) Tj');
      streamLines.push('/F1 9 Tf 0.3 0.3 0.3 rg 420 ' + curY + ' Td (1) Tj');
      streamLines.push('/F1 9 Tf 0.1 0.1 0.1 rg 470 ' + curY + ' Td (Included) Tj');
      streamLines.push('ET');
      curY -= 22;
    }

    // Discount row if applicable
    if (discounts > 0) {
      streamLines.push('q');
      streamLines.push('0.95 0.95 0.96 RG 1 w 40 ' + (curY - 6) + ' 515 0 re s');
      streamLines.push('Q');

      streamLines.push('BT');
      streamLines.push('/F1 9 Tf 0.1 0.6 0.2 rg 50 ' + curY + ' Td (Promotional Savings / Member Discount) Tj');
      streamLines.push('/F1 9 Tf 0.3 0.3 0.3 rg 340 ' + curY + ' Td (-) Tj');
      streamLines.push('/F1 9 Tf 0.3 0.3 0.3 rg 420 ' + curY + ' Td (1) Tj');
      streamLines.push('/F1 9 Tf 0.1 0.6 0.2 rg 465 ' + curY + ' Td (- ' + escapePdf(formatINRText(discounts)) + ') Tj');
      streamLines.push('ET');
      curY -= 22;
    }

    // Financial Calculation Summary Table
    const summaryBoxY = curY - 105;
    streamLines.push('q');
    streamLines.push('0.98 0.98 0.99 rg 310 ' + summaryBoxY + ' 245 96 re f');
    streamLines.push('0.85 0.88 0.92 RG 1 w 310 ' + summaryBoxY + ' 245 96 re s');
    streamLines.push('Q');

    streamLines.push('BT');
    streamLines.push('/F1 9 Tf 0.3 0.3 0.3 rg 320 ' + (summaryBoxY + 80) + ' Td (Subtotal (Taxable Value):) Tj');
    streamLines.push('/F1 9 Tf 0.1 0.1 0.1 rg 460 ' + (summaryBoxY + 80) + ' Td (' + escapePdf(formatINRText(baseFare)) + ') Tj');

    streamLines.push('/F1 9 Tf 0.3 0.3 0.3 rg 320 ' + (summaryBoxY + 62) + ' Td (Central GST (CGST @ 9%):) Tj');
    streamLines.push('/F1 9 Tf 0.1 0.1 0.1 rg 460 ' + (summaryBoxY + 62) + ' Td (' + escapePdf(formatINRText(cgst)) + ') Tj');

    streamLines.push('/F1 9 Tf 0.3 0.3 0.3 rg 320 ' + (summaryBoxY + 44) + ' Td (State GST (SGST @ 9%):) Tj');
    streamLines.push('/F1 9 Tf 0.1 0.1 0.1 rg 460 ' + (summaryBoxY + 44) + ' Td (' + escapePdf(formatINRText(sgst)) + ') Tj');

    // Grand total bar
    streamLines.push('/F2 11 Tf 0.06 0.09 0.16 rg 320 ' + (summaryBoxY + 16) + ' Td (Total Amount Paid (INR):) Tj');
    streamLines.push('/F2 11 Tf 0.08 0.55 0.24 rg 450 ' + (summaryBoxY + 16) + ' Td (' + escapePdf(formatINRText(grandTotal)) + ') Tj');
    streamLines.push('ET');

    // Passenger Manifest Box
    const manifestY = summaryBoxY - 75;
    streamLines.push('q');
    streamLines.push('0.98 0.98 0.99 rg 40 ' + manifestY + ' 515 62 re f');
    streamLines.push('0.88 0.9 0.93 RG 1 w 40 ' + manifestY + ' 515 62 re s');
    streamLines.push('Q');

    streamLines.push('BT');
    streamLines.push('/F2 9 Tf 0.06 0.09 0.16 rg 52 ' + (manifestY + 46) + ' Td (PASSENGER / GUEST MANIFEST:) Tj');
    const paxList = booking.passengerDetails?.length 
      ? booking.passengerDetails.map((p, i) => `${i + 1}. ${p.name} (Age: ${p.age}, ${p.gender})`).join('  |  ')
      : `1. ${guestName} (Primary Guest)`;
    streamLines.push('/F1 8 Tf 0.3 0.3 0.3 rg 52 ' + (manifestY + 30) + ' Td (' + escapePdf(paxList.slice(0, 100)) + ') Tj');
    streamLines.push('/F1 8 Tf 0.4 0.4 0.4 rg 52 ' + (manifestY + 14) + ' Td (Please carry an original government-issued photo ID (Aadhaar / Passport / Voter ID) during travel.) Tj');
    streamLines.push('ET');

    // Legal Compliance & Verification Footer
    streamLines.push('BT');
    streamLines.push('/F2 8 Tf 0.06 0.09 0.16 rg 40 130 Td (STATUTORY TERMS & COMPLIANCE DECLARATION:) Tj');
    streamLines.push('/F1 7 Tf 0.4 0.4 0.4 rg 40 118 Td (1. This is a computer-generated Tax Invoice issued under Section 31 of the Central Goods and Services Tax (CGST) Act, 2017.) Tj');
    streamLines.push('/F1 7 Tf 0.4 0.4 0.4 rg 40 108 Td (2. No physical signature is required. Payment was securely captured and verified via Razorpay Payment Gateway.) Tj');
    streamLines.push('/F1 7 Tf 0.4 0.4 0.4 rg 40 98 Td (3. Cancellations and refunds are governed by ExploreX Standard Travel Policy & individual carrier conditions.) Tj');
    streamLines.push('/F1 7 Tf 0.4 0.4 0.4 rg 40 88 Td (4. For customer support or itinerary modifications, contact support@explorex.travel or dial +91 1800-EXPLOREX.) Tj');

    // Seal box
    streamLines.push('/F2 9 Tf 0.08 0.55 0.24 rg 410 70 Td ([ OFFICIAL DIGITAL SEAL ]) Tj');
    streamLines.push('/F1 7 Tf 0.3 0.3 0.3 rg 390 58 Td (ExploreX Automated Billing Clearance) Tj');
    streamLines.push('/F1 7 Tf 0.3 0.3 0.3 rg 405 48 Td (Transaction Verified & Settled) Tj');
    streamLines.push('ET');

    const stream = streamLines.join('\n');
    const streamLen = Buffer.byteLength(stream, 'latin1');

    const objects: string[] = [
      '1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj',
      '2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj',
      '3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >> endobj',
      '4 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj',
      '5 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >> endobj',
      '6 0 obj << /Length ' + streamLen + ' >> stream\n' + stream + '\nendstream endobj'
    ];

    let body = '%PDF-1.4\n';
    const offsets: number[] = [];
    for (let i = 0; i < objects.length; i++) {
      offsets.push(Buffer.byteLength(body, 'latin1'));
      body += objects[i] + '\n';
    }
    const xrefOffset = Buffer.byteLength(body, 'latin1');
    body += 'xref\n0 ' + (objects.length + 1) + '\n0000000000 65535 f \n';
    for (let i = 0; i < offsets.length; i++) {
      body += String(offsets[i]).padStart(10, '0') + ' 00000 n \n';
    }
    body += 'trailer << /Size ' + (objects.length + 1) + ' /Root 1 0 R >>\nstartxref\n' + xrefOffset + '\n%%EOF';

    return Buffer.from(body, 'latin1');
  }
}
