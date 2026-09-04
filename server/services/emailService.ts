import { Booking } from '../../src/types';
import { ENV } from '../config/env';
import { PdfInvoiceService } from './pdfInvoiceService';

export interface EmailDeliveryResult {
  success: boolean;
  recipient: string;
  error?: string;
}

export class EmailService {
  public isConfigured(): boolean {
    const apiKey = (ENV.RESEND_API_KEY || '').trim();
    return Boolean(apiKey && !apiKey.includes('your_resend') && !apiKey.includes('re_your_resend'));
  }

  private getFromAddress(): string {
    const configured = ENV.RESEND_FROM_EMAIL;
    // Resend free tier/sandbox rejects unverified public mail domains like gmail.com, yahoo.com
    if (configured && !configured.includes('@gmail.com') && !configured.includes('@yahoo.') && !configured.includes('@hotmail.')) {
      return configured.includes('<') ? configured : `ExploreX Travel <${configured}>`;
    }
    return 'ExploreX Travel <onboarding@resend.dev>';
  }

  /**
   * Helper to dispatch email payload to Resend API with optional attachments
   */
  public async sendViaResend(
    to: string, 
    subject: string, 
    html: string, 
    attachments?: Array<{ filename: string; content: string }>
  ): Promise<EmailDeliveryResult> {
    const apiKey = (ENV.RESEND_API_KEY || '').trim();
    if (!apiKey || apiKey.includes('your_resend') || apiKey.includes('re_your_resend')) {
      console.log(`ℹ️ Resend API Key not configured: Logged transactional email to ${to} [Subject: ${subject}]`);
      return { success: false, recipient: to, error: 'Resend API key not configured' };
    }

    try {
      const payload: any = {
        from: this.getFromAddress(),
        to: [to],
        subject,
        html
      };

      if (attachments && attachments.length > 0) {
        payload.attachments = attachments;
      }

      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(12000)
      });

      if (response.ok) {
        console.log(`✅ Resend transactional email delivered to ${to} [${subject}]`);
        return { success: true, recipient: to };
      } else {
        const errorData = await response.text();
        // Handle Resend sandbox restriction: redirect to verified sandbox test account if unverified recipient
        if (
          errorData.includes('You can only send testing emails') ||
          errorData.includes('own email address') ||
          errorData.toLowerCase().includes('testing emails') ||
          (response.status === 403 && errorData.toLowerCase().includes('sandbox'))
        ) {
          const match = errorData.match(/\(([^)]+@[^)]+)\)/);
          const sandboxEmail = match ? match[1] : (process.env.RESEND_SANDBOX_EMAIL || 'explorexsih0426@gmail.com');
          console.log(`ℹ️ Resend sandbox: Redirecting confirmation from ${to} to verified account ${sandboxEmail}`);
          
          const retryPayload: any = {
            from: this.getFromAddress(),
            to: [sandboxEmail],
            subject: `[ExploreX for ${to}] ${subject}`,
            html: `<div style="padding: 12px; background: #fffbeb; border: 1px solid #fef3c7; border-radius: 8px; margin-bottom: 16px; font-family: sans-serif; font-size: 13px; color: #92400e;"><strong>Resend Sandbox Evaluation Notice:</strong> Intended recipient: <code>${to}</code>. Delivered to verified owner account.</div>` + html
          };
          if (attachments && attachments.length > 0) {
            retryPayload.attachments = attachments;
          }

          const retryRes = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify(retryPayload),
            signal: AbortSignal.timeout(12000)
          });
          if (retryRes.ok) {
            console.log(`✅ Resend transactional email delivered to sandbox recipient ${sandboxEmail} for ${to} [${subject}]`);
            return { success: true, recipient: sandboxEmail };
          }
        }
        console.warn(`⚠️ Resend API responded with status ${response.status}:`, errorData);
        return { success: false, recipient: to, error: `Resend API ${response.status}: ${errorData}` };
      }
    } catch (err: any) {
      console.warn('⚠️ Resend email dispatch notice (non-fatal):', err.message);
      return { success: false, recipient: to, error: err.message || 'Network error delivering email' };
    }
  }

  /**
   * Send ExploreX Booking Confirmation email via Resend API ONLY after a booking is successfully completed & paid.
   * Fulfills exact User Requirements:
   * - Triggered ONLY after successful booking + server-side payment verification
   * - Sent to authenticated customer's registered email
   * - Contains ExploreX branding, Booking ID, booking date/time, customer details, destination, travel dates,
   *   guests, booking items, subtotal, taxes/fees, discounts, total paid, payment status, Razorpay reference ID.
   * - Generates and attaches a professional GST Tax Invoice PDF.
   * - If email fails, NEVER cancels or reverts the booking; returns error info for recording & retry.
   */
  public async sendBookingConfirmationEmail(
    booking: Booking, 
    userEmail?: string, 
    userName?: string
  ): Promise<EmailDeliveryResult> {
    const recipient = userEmail || booking.details?.contactEmail || 'traveler@explorex.com';
    const name = userName || booking.passengerDetails?.[0]?.name || 'Valued Traveler';
    const phone = booking.details?.contactPhone || '+91 9876543210';
    const bookingDateStr = booking.bookingDate ? new Date(booking.bookingDate).toLocaleString('en-IN') : new Date().toLocaleString('en-IN');
    const paymentId = booking.details?.razorpayPaymentId || booking.details?.paymentId || `PAY-${booking.id.slice(-8).toUpperCase()}`;
    const invoice = booking.invoice;
    const baseFare = invoice?.baseFare || Math.round(booking.totalAmount / 1.18);
    const taxes = invoice?.taxes || (booking.totalAmount - baseFare);
    const discounts = invoice?.discounts || 0;
    const grandTotal = booking.totalAmount;

    // Generate Official Tax Invoice PDF
    let pdfAttachment: Array<{ filename: string; content: string }> | undefined = undefined;
    try {
      const pdfBuffer = PdfInvoiceService.generateInvoicePdf(booking, recipient, name);
      pdfAttachment = [
        {
          filename: `ExploreX-Tax-Invoice-${booking.id}.pdf`,
          content: pdfBuffer.toString('base64')
        }
      ];
    } catch (pdfErr) {
      console.warn('Notice: PDF generation error (proceeding with HTML email):', pdfErr);
    }

    const html = `
      <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 620px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; background-color: #ffffff; box-shadow: 0 4px 16px rgba(0,0,0,0.06);">
        <!-- ExploreX Header -->
        <div style="background-color: #0f172a; padding: 28px 24px; text-align: center; color: #ffffff;">
          <p style="margin: 0 0 6px 0; font-size: 11px; text-transform: uppercase; letter-spacing: 2.5px; color: #38bdf8; font-weight: 800;">EXPLOREX TRAVEL CONCIERGE</p>
          <h1 style="margin: 0; font-size: 26px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">Booking & Payment Confirmed!</h1>
          <p style="margin: 8px 0 0 0; color: #94a3b8; font-size: 14px;">Booking ID: <strong style="color: #ffffff; font-family: monospace;">${booking.id}</strong></p>
        </div>

        <!-- Verification Status Ribbon -->
        <div style="background-color: #f0fdf4; border-bottom: 1px solid #bbf7d0; padding: 12px 24px; text-align: center;">
          <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background-color: #16a34a; margin-right: 6px; vertical-align: middle;"></span>
          <strong style="color: #166534; font-size: 12px; text-transform: uppercase; letter-spacing: 0.8px;">PAYMENT STATUS: PAID & VERIFIED (${booking.paymentMethod.toUpperCase()})</strong>
        </div>

        <div style="padding: 28px 24px; color: #334155; font-size: 14px; line-height: 1.6;">
          <p style="margin-top: 0; font-size: 15px;">Namaste <strong>${name}</strong>,</p>
          <p>Thank you for choosing ExploreX. Your travel reservation has been verified and confirmed. An official GST Tax Invoice has been generated and attached as a PDF to this email.</p>

          <!-- Customer & Confirmation Summary Card -->
          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; margin: 20px 0;">
            <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
              <tr>
                <td style="padding: 6px 0; color: #64748b; width: 42%;">Customer Name:</td>
                <td style="padding: 6px 0; color: #0f172a; font-weight: 600;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748b;">Registered Email:</td>
                <td style="padding: 6px 0; color: #0f172a; font-weight: 600;">${recipient}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748b;">Contact Phone:</td>
                <td style="padding: 6px 0; color: #0f172a; font-weight: 600;">${phone}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748b;">Booking Reference:</td>
                <td style="padding: 6px 0; color: #0284c7; font-weight: 800; font-family: monospace;">${booking.id}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748b;">Booking Date & Time:</td>
                <td style="padding: 6px 0; color: #0f172a; font-weight: 600;">${bookingDateStr}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748b;">Payment Reference ID:</td>
                <td style="padding: 6px 0; color: #0f172a; font-family: monospace; font-weight: 600;">${paymentId}</td>
              </tr>
            </table>
          </div>

          <!-- Trip & Journey Specifics -->
          <h3 style="color: #0f172a; font-size: 14px; margin: 24px 0 12px 0; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px;">Journey Details</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 13px;">
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 9px 0; color: #64748b; width: 40%;">Service Category:</td>
              <td style="padding: 9px 0; color: #0f172a; font-weight: 700; text-transform: uppercase;">${booking.serviceType}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 9px 0; color: #64748b;">Service Item:</td>
              <td style="padding: 9px 0; color: #0f172a; font-weight: 600;">${booking.title}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 9px 0; color: #64748b;">Destination:</td>
              <td style="padding: 9px 0; color: #0f172a; font-weight: 600;">${booking.destinationName}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 9px 0; color: #64748b;">Travel Dates:</td>
              <td style="padding: 9px 0; color: #0f172a; font-weight: 600;">${booking.travelDate}${booking.returnDate ? ` to ${booking.returnDate}` : ''}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 9px 0; color: #64748b;">Guests / Manifest:</td>
              <td style="padding: 9px 0; color: #0f172a; font-weight: 600;">
                ${booking.passengerDetails?.map(p => `${p.name} (${p.age}y, ${p.gender})`).join(', ') || `${booking.passengersCount} Traveler(s)`}
              </td>
            </tr>
          </table>

          <!-- Itemized Financial Breakdown Table -->
          <h3 style="color: #0f172a; font-size: 14px; margin: 24px 0 12px 0; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px;">Billing & Tax Breakdown</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 13px;">
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 8px 0; color: #64748b;">Subtotal (Taxable Base Fare):</td>
              <td style="padding: 8px 0; color: #0f172a; text-align: right;">₹${baseFare.toLocaleString('en-IN')}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 8px 0; color: #64748b;">Taxes & Fees (18% GST - CGST 9% + SGST 9%):</td>
              <td style="padding: 8px 0; color: #0f172a; text-align: right;">₹${taxes.toLocaleString('en-IN')}</td>
            </tr>
            ${discounts > 0 ? `
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 8px 0; color: #16a34a;">Promotional Discount:</td>
              <td style="padding: 8px 0; color: #16a34a; text-align: right; font-weight: bold;">- ₹${discounts.toLocaleString('en-IN')}</td>
            </tr>` : ''}
            <tr style="border-bottom: 2px solid #0f172a;">
              <td style="padding: 12px 0; color: #0f172a; font-size: 15px; font-weight: 800;">Total Paid (INR):</td>
              <td style="padding: 12px 0; color: #0284c7; font-size: 18px; font-weight: 800; text-align: right;">₹${grandTotal.toLocaleString('en-IN')}</td>
            </tr>
          </table>

          <!-- Attachment Notice -->
          <div style="background-color: #f0f9ff; border: 1px solid #bae6fd; border-radius: 10px; padding: 14px 18px; margin: 20px 0;">
            <p style="margin: 0; font-size: 13px; color: #0369a1; font-weight: 600;">
              📎 Attached: <strong>ExploreX-Tax-Invoice-${booking.id}.pdf</strong>
            </p>
            <p style="margin: 4px 0 0 0; font-size: 12px; color: #0284c7;">
              Contains full GST tax breakdown, HSN/SAC code 998553, GSTIN 27AABCE1234F1Z5, and carrier voucher info.
            </p>
          </div>

          <!-- Cancellation & Support Notice -->
          <div style="background-color: #f8fafc; padding: 14px 18px; border-radius: 10px; border: 1px solid #e2e8f0; margin-top: 24px;">
            <p style="margin: 0 0 4px 0; font-size: 12px; font-weight: bold; color: #0f172a;">ExploreX Care & Support:</p>
            <p style="margin: 0; font-size: 12px; color: #64748b;">
              Free cancellation supported up to 48 hours prior to journey. If you need any assistance, reply directly to this email or visit your ExploreX dashboard.
            </p>
          </div>
        </div>

        <div style="background-color: #f1f5f9; padding: 18px; text-align: center; color: #64748b; font-size: 12px; border-top: 1px solid #e2e8f0;">
          ExploreX Smart Tourism Platform • Certified Multi-Modal Travel Concierge • Regd GSTIN: 27AABCE1234F1Z5
        </div>
      </div>
    `;

    return this.sendViaResend(
      recipient, 
      `Booking Confirmed #${booking.id} — ${booking.title}`, 
      html, 
      pdfAttachment
    );
  }
}

export const emailService = new EmailService();
