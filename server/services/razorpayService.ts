import { Request, Response } from 'express';
import { paymentService } from './paymentService';

/**
 * Server-Side Price Calculation & Razorpay Intent Creation Handler
 */
export async function createPaymentIntentHandler(req: Request, res: Response) {
  try {
    const userId = (req as any).userId || (req.headers['x-user-id'] as string) || 'usr-current';
    const result = await paymentService.createPaymentIntent({
      ...req.body,
      userId
    });
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to create payment intent' });
  }
}

/**
 * Legacy endpoint fallback for direct Razorpay order creation
 */
export async function createRazorpayOrder(req: Request, res: Response) {
  try {
    const userId = (req as any).userId || (req.headers['x-user-id'] as string) || 'usr-current';
    const result = await paymentService.createPaymentIntent({
      userId,
      serviceType: req.body.serviceType || 'package',
      title: req.body.title || 'Travel Booking',
      destinationName: req.body.destinationName || 'ExploreX Destination',
      basePrice: req.body.amount || 100,
      travelDate: req.body.travelDate || new Date().toISOString().split('T')[0],
      passengersCount: req.body.passengersCount || 1,
      passengerDetails: req.body.passengerDetails || [{ name: 'Traveler', age: 28, gender: 'Any' }]
    });

    res.json({
      success: true,
      keyId: result.keyId,
      bookingId: result.bookingId,
      order: {
        id: result.orderId,
        amount: result.amountInPaise,
        currency: result.currency,
        status: 'created'
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to create Razorpay order' });
  }
}

/**
 * Payment Verification Handler with Provider Safety Net
 */
export async function verifyRazorpayPayment(req: Request, res: Response) {
  try {
    const userId = (req as any).userId || (req.headers['x-user-id'] as string) || 'usr-current';
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id) {
      return res.status(400).json({ error: 'Missing razorpay_order_id or razorpay_payment_id' });
    }

    const result = await paymentService.verifyPayment({
      bookingId: bookingId || req.body.booking_id,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature: razorpay_signature || 'mock_signature',
      userId,
      customerEmail: req.body.customerEmail || (req as any).user?.email,
      customerName: req.body.customerName || (req as any).user?.name
    } as any);

    if (!result.verified) {
      return res.status(400).json(result);
    }

    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Payment verification failed' });
  }
}

/**
 * Razorpay Webhook Receiver Handler
 * Securely verifies the X-Razorpay-Signature HMAC-SHA256 digest using the raw request body.
 */
export async function razorpayWebhookHandler(req: Request, res: Response) {
  try {
    const signature = (req.headers['x-razorpay-signature'] as string) || (req.get('X-Razorpay-Signature') as string) || '';
    
    // Obtain raw body string captured before JSON mutation
    const rawBody = (req as any).rawBody || (typeof req.body === 'string' ? req.body : JSON.stringify(req.body));

    if (!signature) {
      console.warn('⚠️ Razorpay Webhook received without X-Razorpay-Signature header');
      return res.status(400).json({
        error: 'Missing X-Razorpay-Signature header',
        code: 'MISSING_SIGNATURE'
      });
    }

    if (!rawBody) {
      console.warn('⚠️ Razorpay Webhook received with empty request body');
      return res.status(400).json({
        error: 'Missing webhook payload body',
        code: 'EMPTY_PAYLOAD'
      });
    }

    const isValid = paymentService.verifyWebhookSignature(rawBody, signature);
    if (!isValid) {
      console.warn('⚠️ Razorpay Webhook authentication failed: HMAC-SHA256 signature mismatch');
      return res.status(400).json({
        error: 'Invalid Razorpay webhook signature',
        code: 'INVALID_SIGNATURE',
        verified: false
      });
    }

    const event = req.body?.event;
    console.log(`📡 Razorpay Webhook Verified: Event "${event}"`);

    const result = await paymentService.processWebhookEvent(event, req.body?.payload);

    // Return 200 OK as required by Razorpay webhook contract
    return res.status(200).json({
      status: 'ok',
      verified: true,
      event,
      result
    });
  } catch (err: any) {
    console.error('❌ Razorpay Webhook handling exception:', err);
    return res.status(500).json({
      error: err.message || 'Internal webhook handling error',
      code: 'INTERNAL_ERROR'
    });
  }
}
