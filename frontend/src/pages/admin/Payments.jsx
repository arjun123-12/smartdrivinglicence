import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import { CreditCard, RotateCcw, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';

export default function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Refund Modal
  const [refundPayment, setRefundPayment] = useState(null);
  const [refundAmount, setRefundAmount] = useState('');
  const [refundReason, setRefundReason] = useState('Customer cancellation within policy window');
  const [processingRefund, setProcessingRefund] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    setLoading(true);
    try {
      const data = await adminService.getPayments();
      setPayments(data?.data || []);
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  const openRefund = (pmt) => {
    setRefundPayment(pmt);
    setRefundAmount(pmt.amount);
    setRefundReason('Customer cancellation within policy window');
  };

  const handleRefundSubmit = async (e) => {
    e.preventDefault();
    if (!refundPayment) return;
    setProcessingRefund(true);
    try {
      await adminService.processRefund(refundPayment.id, {
        amount: refundAmount,
        reason: refundReason,
      });
      setAlertMsg(`Refund of $${refundAmount} AUD issued successfully.`);
      setRefundPayment(null);
      loadPayments();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to process refund.');
    } finally {
      setProcessingRefund(false);
    }
  };

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2>Payment Ledger & Refunds</h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)', margin: 0 }}>
            Audit payment receipts, verify gateway transactions, and issue server-verified refunds
          </p>
        </div>
        <button onClick={loadPayments} className="button button-sm button-outline">
          <RefreshCw size={14} /> Refresh Ledger
        </button>
      </div>

      {alertMsg && (
        <div className="alert alert-success" style={{ marginBottom: '1.5rem' }}>
          <CheckCircle size={18} />
          <span>{alertMsg}</span>
        </div>
      )}

      <div className="card" style={{ overflow: 'hidden' }}>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Payment Reference</th>
                <th>Booking Reference</th>
                <th>Customer</th>
                <th>Amount (AUD)</th>
                <th>Method & Gateway</th>
                <th>Status</th>
                <th>Paid At</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '2rem' }}>
                    <div className="loading-spinner" style={{ margin: '0 auto' }} />
                  </td>
                </tr>
              ) : payments.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '2rem' }}>
                    No payment transactions recorded yet.
                  </td>
                </tr>
              ) : (
                payments.map((p) => (
                  <tr key={p.id}>
                    <td style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{p.payment_reference}</td>
                    <td>{p.booking?.booking_reference}</td>
                    <td>{p.booking?.customer?.name || 'Guest / Direct'}</td>
                    <td style={{ fontWeight: 800 }}>${p.amount} {p.currency}</td>
                    <td>
                      <div style={{ textTransform: 'capitalize', fontWeight: 600 }}>{p.payment_method}</div>
                      <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{p.transaction_id || 'simulated_card'}</div>
                    </td>
                    <td>
                      <span className={`badge ${p.payment_status === 'succeeded' ? 'badge-success' : p.payment_status === 'refunded' ? 'badge-danger' : 'badge-warning'}`}>
                        {p.payment_status}
                      </span>
                    </td>
                    <td style={{ fontSize: 'var(--font-size-xs)' }}>
                      {p.paid_at ? new Date(p.paid_at).toLocaleString() : 'Pending'}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {p.payment_status === 'succeeded' && (
                        <button onClick={() => openRefund(p)} className="button button-sm button-outline">
                          <RotateCcw size={14} /> Refund
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Refund Modal */}
      {refundPayment && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }}>
          <div className="card" style={{ maxWidth: '440px', width: '100%', padding: '2rem' }}>
            <h3>Process Customer Refund</h3>
            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', marginBottom: '1.25rem' }}>
              Ref: <strong>{refundPayment.payment_reference}</strong> (Original Amount: ${refundPayment.amount} AUD)
            </p>

            <form onSubmit={handleRefundSubmit}>
              <div className="form-group">
                <label className="form-label">Refund Amount (AUD) *</label>
                <input
                  type="number"
                  step="0.01"
                  min="1"
                  max={refundPayment.amount}
                  className="form-control"
                  required
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Reason for Refund *</label>
                <textarea
                  className="form-control"
                  rows="3"
                  required
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setRefundPayment(null)} className="button button-outline">
                  Cancel
                </button>
                <button type="submit" disabled={processingRefund} className="button button-danger">
                  {processingRefund ? 'Processing...' : 'Confirm Refund'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

