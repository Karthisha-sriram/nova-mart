import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  CheckCircle2,
  Package,
  Truck,
  MapPin,
  Calendar,
  ArrowRight,
  Printer,
  Copy,
  Clock,
  Sparkles
} from 'lucide-react';
import { api } from '../services/api';
import { Order } from '../types';
import { useCart } from '../context/CartContext';

export const OrderConfirmationPage: React.FC = () => {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useCart();

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderNumber) return;
      try {
        const res = await api.getOrder(orderNumber);
        if (res.order) {
          setOrder(res.order);
        }
      } catch (err) {
        console.error('Failed to retrieve order confirmation:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderNumber]);

  const copyOrderNumber = () => {
    if (orderNumber) {
      navigator.clipboard.writeText(orderNumber);
      showToast({
        title: 'Copied!',
        message: 'Order ID copied to clipboard',
        type: 'info'
      });
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center animate-pulse">
        <div className="w-16 h-16 bg-slate-200 rounded-full mx-auto mb-4" />
        <div className="h-8 bg-slate-200 rounded w-64 mx-auto mb-4" />
        <div className="h-4 bg-slate-200 rounded w-48 mx-auto" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-slate-800">Order Not Found</h2>
        <p className="text-xs text-slate-500 mt-2">
          Unable to locate details for order reference: {orderNumber}
        </p>
        <Link to="/shop" className="mt-4 inline-block px-6 py-2.5 bg-indigo-600 text-white font-bold text-xs rounded-xl">
          Return to Shop
        </Link>
      </div>
    );
  }

  const steps = [
    { title: 'Order Placed', desc: 'Payment authorized', completed: true },
    { title: 'Processing', desc: 'Warehouse packing', completed: true },
    { title: 'Shipped', desc: 'In transit with courier', completed: false },
    { title: 'Delivered', desc: order.estimated_delivery, completed: false }
  ];

  return (
    <div
      data-testid="order-success"
      id="order-success-container"
      className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10"
    >
      {/* Success Hero Header */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-sm animate-in zoom-in-50 duration-300">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <span className="inline-flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          <Sparkles className="w-3.5 h-3.5" /> Confirmed &amp; In Production
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-['Space_Grotesk',sans-serif]">
          Thank You For Your Order!
        </h1>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          We&apos;ve sent a full receipt and tracking notification to{' '}
          <span className="font-bold text-slate-800">{order.customer_email}</span>.
        </p>

        {/* Order ID Pill */}
        <div
          data-testid="order-number"
          className="inline-flex items-center gap-2 bg-slate-100 border border-slate-200 px-4 py-2 rounded-2xl text-xs font-mono font-bold text-slate-800"
        >
          <span>Order ID: {order.order_number}</span>
          <button
            onClick={copyOrderNumber}
            className="p-1 hover:text-indigo-600 transition-colors"
            title="Copy Order ID"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Visual Tracking Stepper */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-extrabold text-slate-900">Delivery Status</h2>
          </div>
          <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
            {order.order_status}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative">
          {steps.map((step, idx) => (
            <div key={idx} className="flex flex-col items-center sm:items-start text-center sm:text-left space-y-1">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mb-1 ${
                  step.completed
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-400 border border-slate-200'
                }`}
              >
                {step.completed ? '✓' : idx + 1}
              </div>
              <p className="text-xs font-bold text-slate-900">{step.title}</p>
              <p className="text-[11px] text-slate-400 leading-tight">{step.desc}</p>
            </div>
          ))}
        </div>

        {/* Estimated delivery banner */}
        <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-700">
            <Calendar className="w-4 h-4 text-indigo-600" />
            <span>
              Estimated Delivery: <strong className="text-slate-900">{order.estimated_delivery}</strong>
            </span>
          </div>
          <span className="text-emerald-600 font-bold text-[11px]">On Schedule</span>
        </div>
      </div>

      {/* Order Details & Summary Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Shipping & Payment Info */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4 text-xs">
          <h3 className="font-extrabold text-slate-900 uppercase tracking-wider text-xs">
            Shipping &amp; Billing
          </h3>
          <div className="space-y-2 text-slate-600">
            <p>
              <span className="font-semibold text-slate-500">Recipient:</span>{' '}
              <strong className="text-slate-900">{order.customer_name}</strong>
            </p>
            <p>
              <span className="font-semibold text-slate-500">Address:</span>{' '}
              <span className="text-slate-800">{order.shipping_address}</span>
            </p>
            <p>
              <span className="font-semibold text-slate-500">Phone:</span>{' '}
              <span className="text-slate-800">{order.customer_phone}</span>
            </p>
            <p>
              <span className="font-semibold text-slate-500">Payment:</span>{' '}
              <span className="text-slate-800">{order.payment_method}</span>
            </p>
          </div>
        </div>

        {/* Financial Breakdown */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3 text-xs">
          <h3 className="font-extrabold text-slate-900 uppercase tracking-wider text-xs">
            Payment Summary
          </h3>
          <div className="space-y-1.5 divide-y divide-slate-100">
            <div className="flex justify-between text-slate-600 pt-1">
              <span>Subtotal</span>
              <span>₹{order.subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-slate-600 pt-1.5">
              <span>Shipping</span>
              <span>{order.shipping_fee === 0 ? 'Free' : `₹${order.shipping_fee}`}</span>
            </div>
            <div className="flex justify-between text-slate-600 pt-1.5">
              <span>GST Tax</span>
              <span>₹{order.tax.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-slate-900 font-black text-sm pt-2">
              <span>Total Paid</span>
              <span className="text-indigo-600">₹{order.total_amount.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Ordered Items List */}
      {order.items && order.items.length > 0 && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-extrabold text-slate-900 text-sm tracking-tight">
            Items in this Order ({order.items.length})
          </h3>
          <div className="divide-y divide-slate-100">
            {order.items.map((item) => (
              <div key={item.id} className="py-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <img
                    src={item.image_url}
                    alt={item.product_name}
                    className="w-12 h-12 object-cover rounded-xl border border-slate-200"
                  />
                  <div>
                    <p className="font-bold text-slate-900">{item.product_name}</p>
                    <p className="text-[11px] text-slate-400">Qty: {item.quantity}</p>
                  </div>
                </div>
                <span className="font-bold text-slate-900">
                  ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200">
        <button
          onClick={() => window.print()}
          className="w-full sm:w-auto px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors"
        >
          <Printer className="w-4 h-4" />
          <span>Print Receipt</span>
        </button>

        <Link
          to="/shop"
          className="w-full sm:w-auto px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-colors"
        >
          <span>Continue Shopping</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
