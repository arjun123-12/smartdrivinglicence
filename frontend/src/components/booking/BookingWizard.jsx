import '../../styles/booking-wizard.css';
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import bookingService from '../../services/bookingService';
import paymentService from '../../services/paymentService';
import { useAuth } from '../../context/AuthContext';
import { extractArray, safeArray } from '../../utils/apiHelpers';
import { mockServices, mockLocations } from '../../services/mockData';
import {
  Calendar,
  Clock,
  MapPin,
  Car,
  User,
  ShieldCheck,
  CreditCard,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';

const formatAdelaideDate = (dateString) => {
  if (!dateString) return '';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return String(dateString);
    return new Intl.DateTimeFormat('en-AU', {
      timeZone: 'Australia/Adelaide',
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(d);
  } catch {
    return String(dateString);
  }
};

export default function BookingWizard({ defaultServiceSlug = null, forcedIsTest = null }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  // Wizard step: 1 (Service & Location), 2 (Date & Slot), 3 (Details), 4 (Payment), 5 (Confirmed)
  const [step, setStep] = useState(1);

  // Catalog data
  const [services, setServices] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loadingInitial, setLoadingInitial] = useState(true);

  // User selections
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [selectedLocationId, setSelectedLocationId] = useState('');
  const [selectedTransmission, setSelectedTransmission] = useState('auto');
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });

  // Slot lookup state
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);

  // Customer form details
  const [customerDetails, setCustomerDetails] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    licence_number: user?.customer_profile?.licence_number || '',
    licence_type: user?.customer_profile?.licence_type || 'learner',
    pickup_address: user?.customer_profile?.address || '',
    notes: '',
  });

  // Booking & payment state
  const [submittingBooking, setSubmittingBooking] = useState(false);
  const [createdBooking, setCreatedBooking] = useState(null);
  const [paymentData, setPaymentData] = useState({
    cardholder_name: user?.name || '',
    card_number: '4242 4242 4242 4242',
    expiry: '12/28',
    cvc: '123',
    payment_method: 'card',
  });
  const [processingPayment, setProcessingPayment] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Update customer details if user logs in
  useEffect(() => {
    if (user) {
      setCustomerDetails((prev) => ({
        ...prev,
        name: prev.name || user.name,
        email: prev.email || user.email,
        phone: prev.phone || user.phone || '',
      }));
    }
  }, [user]);

  // Load initial services & locations
  useEffect(() => {
    async function init() {
      try {
        const results = await Promise.allSettled([
          bookingService.getServices(),
          bookingService.getLocations(),
        ]);

        const servicesRes = results[0].status === 'fulfilled' ? extractArray(results[0].value, mockServices) : mockServices;
        const locationsRes = results[1].status === 'fulfilled' ? extractArray(results[1].value, mockLocations) : mockLocations;

        let filteredServices = servicesRes;
        if (forcedIsTest !== null && forcedIsTest !== undefined) {
          const matched = safeArray(servicesRes).filter((s) => {
            const isTest = s.is_test === true || s.is_test === 1 || s.is_test === '1' || s.is_test === 'true';
            return isTest === Boolean(forcedIsTest);
          });
          if (matched.length > 0) {
            filteredServices = matched;
          }
        }

        setServices(filteredServices);
        setLocations(locationsRes);

        // Preselect service
        let serviceToSelect = null;
        if (defaultServiceSlug) {
          serviceToSelect = safeArray(filteredServices).find((s) => s.slug === defaultServiceSlug);
        }
        if (!serviceToSelect && searchParams.get('service_id')) {
          serviceToSelect = safeArray(filteredServices).find((s) => s.id.toString() === searchParams.get('service_id'));
        }
        if (!serviceToSelect && safeArray(filteredServices).length > 0) {
          serviceToSelect = filteredServices[0];
        }

        if (serviceToSelect) {
          setSelectedServiceId(serviceToSelect.id.toString());
        }

        // Preselect location from query param if given
        const locParam = searchParams.get('location_id');
        if (locParam) {
          setSelectedLocationId(locParam);
        } else if (locationsRes.length > 0) {
          setSelectedLocationId(locationsRes[0].id.toString());
        }
      } catch (err) {
        console.warn('Booking wizard init caught error, using fallbacks:', err);
        let fallbackServices = mockServices;
        if (forcedIsTest !== null && forcedIsTest !== undefined) {
          const matched = safeArray(mockServices).filter((s) => {
            const isTest = s.is_test === true || s.is_test === 1 || s.is_test === '1' || s.is_test === 'true';
            return isTest === Boolean(forcedIsTest);
          });
          if (matched.length > 0) fallbackServices = matched;
        }
        setServices(fallbackServices);
        setLocations(mockLocations);
        if (fallbackServices.length > 0) setSelectedServiceId(fallbackServices[0].id.toString());
        if (mockLocations.length > 0) setSelectedLocationId(mockLocations[0].id.toString());
      } finally {
        setLoadingInitial(false);
      }
    }
    init();
  }, [defaultServiceSlug, forcedIsTest, searchParams]);

  // Query availability slots when step 2 or filter changes
  useEffect(() => {
    if (step === 2 && selectedServiceId && selectedLocationId && selectedDate) {
      fetchSlots();
    }
  }, [step, selectedServiceId, selectedLocationId, selectedDate, selectedTransmission]);

  // Helper for 7-day quick date navigation
  const getNext7Days = () => {
    const list = [];
    const base = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const dateStr = `${y}-${m}-${day}`;
      const dayName = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-AU', { weekday: 'short' });
      const dayNum = d.toLocaleDateString('en-AU', { day: 'numeric', month: 'short' });
      list.push({ dateStr, dayName, dayNum });
    }
    return list;
  };

  const handleNextDay = () => {
    const parts = (selectedDate || '').split('-').map(Number);
    if (parts.length === 3) {
      const next = new Date(parts[0], parts[1] - 1, parts[2] + 1);
      const y = next.getFullYear();
      const m = String(next.getMonth() + 1).padStart(2, '0');
      const d = String(next.getDate()).padStart(2, '0');
      setSelectedDate(`${y}-${m}-${d}`);
    } else {
      const next = new Date();
      next.setDate(next.getDate() + 1);
      setSelectedDate(next.toISOString().split('T')[0]);
    }
  };

  const fetchSlots = async () => {
    setLoadingSlots(true);
    setErrorMessage('');
    setSelectedSlot(null);
    try {
      const res = await bookingService.searchAvailability({
        service_type_id: selectedServiceId,
        location_id: selectedLocationId,
        date: selectedDate,
        transmission: selectedTransmission,
      });
      const slots = extractArray(res?.slots || res?.data?.slots || res?.data || res, []);
      setAvailableSlots(slots);
      if (slots.length > 0) {
        setSelectedSlot(slots[0]); // Auto-select first slot so user can proceed immediately
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Could not fetch availability slots for selected date.');
      setAvailableSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleStep1Submit = (e) => {
    e.preventDefault();
    if (!selectedServiceId || !selectedLocationId) {
      setErrorMessage('Please select a service type and your location/suburb.');
      return;
    }
    setErrorMessage('');
    setStep(2);
  };

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
    setErrorMessage('');
  };

  const handleStep2Submit = () => {
    if (!selectedSlot) {
      setErrorMessage('Please pick an available time slot to proceed.');
      return;
    }
    setErrorMessage('');
    setStep(3);
  };

  const handleStep3Submit = (e) => {
    e.preventDefault();
    if (!customerDetails.name || !customerDetails.email || !customerDetails.phone || !customerDetails.pickup_address) {
      setErrorMessage('Please fill in all required customer and pickup address fields.');
      return;
    }

    setErrorMessage('');
    setStep(4);
  };

  const handlePayAndBookStripe = async (e) => {
    if (e) e.preventDefault();
    if (!selectedSlot) return;

    setProcessingPayment(true);
    setErrorMessage('');

    try {
      const payload = {
        service_type_id: selectedSlot.service_type_id,
        instructor_id: selectedSlot.instructor_id,
        location_id: selectedSlot.location_id,
        package_id: searchParams.get('package_id') || undefined,
        start_time: selectedSlot.start_time,
        end_time: selectedSlot.end_time,
        pickup_address: customerDetails.pickup_address,
        notes: customerDetails.notes,
        customer_name: customerDetails.name,
        customer_email: customerDetails.email,
        customer_phone: customerDetails.phone,
        licence_number: customerDetails.licence_number,
        licence_type: customerDetails.licence_type,
      };

      const res = await paymentService.createStripeCheckoutSession(payload);
      if (res && res.checkout_url) {
        window.location.href = res.checkout_url;
      } else {
        throw new Error('Unable to create Stripe checkout session. Please try again.');
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || err.message || 'Payment initiation failed. Please try again.');
      setProcessingPayment(false);
    }
  };

  const selectedService = services.find((s) => s.id.toString() === selectedServiceId);
  const selectedLocation = locations.find((l) => l.id.toString() === selectedLocationId);

  if (loadingInitial) {
    return (
      <div className="flex-center" style={{ minHeight: '300px' }}>
        <div className="loading-spinner" />
      </div>
    );
  }

  return (
    <div className="card" style={{ maxWidth: '900px', margin: '0 auto', boxShadow: 'var(--shadow-lg)' }}>
      {/* Wizard Step Header */}
      <div className="card-header" style={{ flexDirection: 'column', gap: '1rem' }}>
        <div className="booking-steps-nav" style={{ width: '100%', marginBottom: 0 }}>
          <div className={`booking-step-indicator ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`} aria-current={step === 1 ? 'step' : undefined}>
            <div className="step-number">1</div>
            <span className="step-label">Service & Area</span>
          </div>
          <div className={`booking-step-indicator ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`} aria-current={step === 2 ? 'step' : undefined}>
            <div className="step-number">2</div>
            <span className="step-label">Date & Time</span>
          </div>
          <div className={`booking-step-indicator ${step >= 3 ? 'active' : ''} ${step > 3 ? 'completed' : ''}`} aria-current={step === 3 ? 'step' : undefined}>
            <div className="step-number">3</div>
            <span className="step-label">Learner Details</span>
          </div>
          <div className={`booking-step-indicator ${step >= 4 ? 'active' : ''} ${step > 4 ? 'completed' : ''}`} aria-current={step === 4 ? 'step' : undefined}>
            <div className="step-number">4</div>
            <span className="step-label">Payment</span>
          </div>
          <div className={`booking-step-indicator ${step === 5 ? 'active completed' : ''}`} aria-current={step === 5 ? 'step' : undefined}>
            <div className="step-number">5</div>
            <span className="step-label">Confirmed</span>
          </div>
        </div>
      </div>

      <div className="card-body">
        {errorMessage && (
          <div className="alert alert-error">
            <AlertCircle size={20} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* STEP 1: SERVICE & LOCATION */}
        {step === 1 && (
          <form onSubmit={handleStep1Submit}>
            <h3 style={{ marginBottom: '1.25rem' }}>Select Booking Type & Location</h3>

            <div className="form-group">
              <label className="form-label">Service Type</label>
              <div className="grid grid-2" style={{ gap: '0.75rem', marginBottom: '1rem' }}>
                {safeArray(services).map((service) => (
                  <label
                    key={service.id}
                    className="card booking-service-option"
                    style={{
                      padding: '1rem',
                      cursor: 'pointer',
                      border: selectedServiceId === service.id.toString() ? '2px solid var(--color-secondary)' : '1px solid var(--color-border)',
                      backgroundColor: selectedServiceId === service.id.toString() ? 'var(--color-primary-light)' : 'var(--color-surface)',
                    }}
                  >
                    <div className="flex-between">
                      <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{service.name}</span>
                      <input
                        type="radio"
                        name="service_type"
                        value={service.id}
                        checked={selectedServiceId === service.id.toString()}
                        onChange={(e) => setSelectedServiceId(e.target.value)}
                      />
                    </div>
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', margin: '0.5rem 0' }}>
                      {service.description}
                    </div>
                    <div className="flex-between" style={{ marginTop: 'auto', paddingTop: '0.5rem', borderTop: '1px dashed var(--color-border)' }}>
                      <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600 }}>{service.default_duration_minutes || service.duration_minutes || 60} Minutes</span>
                      <span style={{ fontWeight: 800, color: 'var(--color-secondary)' }}>From ${service.default_price} AUD</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-2">
              <div className="form-group">
                <label className="form-label">Location / Suburb / Test Centre</label>
                <select
                  className="form-select"
                  value={selectedLocationId}
                  onChange={(e) => setSelectedLocationId(e.target.value)}
                  required
                >
                  <option value="">-- Choose Suburb or Centre --</option>
                  {safeArray(locations).map((loc) => (
                    <option key={loc.id} value={loc.id}>
                      {loc.name} (Postcode {loc.postcode}) {loc.is_test_centre ? '★ DIT Test Hub' : ''}
                    </option>
                  ))}
                </select>
                <span className="form-hint">Home/school pickup available for lessons; test centres used for VORT start.</span>
              </div>

              <div className="form-group">
                <label className="form-label">Vehicle Transmission</label>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                  <button
                    type="button"
                    className="button button-full button-primary"
                    style={{ cursor: 'default' }}
                  >
                    Automatic (Dual-Control)
                  </button>
                </div>
                <span className="form-hint">All lessons and tests are exclusively conducted in modern automatic dual-control vehicles.</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <button type="submit" className="button button-primary button-lg">
                Continue to Availability <ArrowRight size={18} />
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: DATE & TIME SLOTS */}
        {step === 2 && (
          <div>
            <div className="flex-between" style={{ marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <h3>Available Appointments</h3>
                <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)' }}>
                  Showing accredited instructors for <strong>{selectedService?.name}</strong> in <strong>{selectedLocation?.name}</strong>
                </p>
              </div>
              <button onClick={() => setStep(1)} className="button button-sm button-outline">
                <ArrowLeft size={16} /> Change Selection
              </button>
            </div>

            {/* Quick 7-Day Date Navigation Pills */}
            <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
              {getNext7Days().map((d) => {
                const isCurrent = selectedDate === d.dateStr;
                return (
                  <button
                    key={d.dateStr}
                    type="button"
                    onClick={() => setSelectedDate(d.dateStr)}
                    style={{
                      padding: '0.45rem 0.85rem',
                      borderRadius: 'var(--radius-sm)',
                      border: isCurrent ? '2px solid var(--color-secondary)' : '1px solid var(--color-border)',
                      backgroundColor: isCurrent ? 'var(--color-secondary)' : 'var(--color-surface)',
                      color: isCurrent ? '#ffffff' : 'inherit',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      minWidth: '78px',
                      fontWeight: 600,
                      transition: 'all 0.15s ease',
                      boxShadow: isCurrent ? '0 2px 8px rgba(27,108,49,0.25)' : 'none',
                    }}
                  >
                    <span style={{ fontSize: '11px', textTransform: 'uppercase', opacity: isCurrent ? 0.95 : 0.7 }}>
                      {d.dayName}
                    </span>
                    <span style={{ fontSize: '13px', fontWeight: 800 }}>
                      {d.dayNum}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Date selector toolbar */}
            <div className="card" style={{ padding: '0.85rem 1rem', backgroundColor: 'var(--color-surface-subtle)', marginBottom: '1.25rem' }}>
              <div className="flex" style={{ gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Calendar size={18} color="var(--color-secondary)" />
                  <span style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)' }}>Or Custom Date:</span>
                </div>
                <input
                  type="date"
                  className="form-control"
                  style={{ width: 'auto', minWidth: '180px' }}
                  value={selectedDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
                <button type="button" onClick={fetchSlots} className="button button-sm button-outline">
                  Refresh Availability
                </button>
              </div>
            </div>

            {loadingSlots ? (
              <div className="flex-center" style={{ minHeight: '200px' }}>
                <div className="loading-spinner" />
                <span style={{ marginLeft: '1rem', color: 'var(--color-text-muted)' }}>Checking real-time calendar...</span>
              </div>
            ) : availableSlots.length === 0 ? (
              <div className="empty-state">
                <Clock size={40} color="var(--color-text-muted)" style={{ margin: '0 auto' }} />
                <h3>No Available Slots on This Date</h3>
                <p style={{ color: 'var(--color-text-muted)', maxWidth: '450px', margin: '0 auto 1rem auto' }}>
                  All instructors servicing {selectedLocation?.name} are fully booked on {selectedDate}. Try selecting the next available day.
                </p>
                <button
                  type="button"
                  onClick={handleNextDay}
                  className="button button-secondary"
                >
                  Check Next Day
                </button>
              </div>
            ) : (
              <div>
                <div className="flex-between" style={{ marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <p style={{ fontWeight: 700, fontSize: 'var(--font-size-sm)', margin: 0 }}>
                    Select an Appointment Time ({availableSlots.length} available):
                  </p>
                  <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-secondary)', fontWeight: 600 }}>
                    {selectedSlot ? `✓ Selected: ${selectedSlot.display_time}` : 'Click any slot to select'}
                  </span>
                </div>

                <div className="slot-grid" style={{ marginBottom: '1.5rem' }}>
                  {safeArray(availableSlots).map((slot, idx) => {
                    const isSelected = selectedSlot?.start_time === slot.start_time && selectedSlot?.instructor_id === slot.instructor_id;
                    return (
                      <button
                        key={idx}
                        type="button"
                        className={`time-slot ${isSelected ? 'selected' : ''}`}
                        onClick={() => handleSlotSelect(slot)}
                        style={{
                          border: isSelected ? '2px solid var(--color-secondary)' : '1px solid var(--color-border)',
                          backgroundColor: isSelected ? 'var(--color-secondary)' : 'var(--color-surface)',
                          color: isSelected ? '#ffffff' : 'inherit',
                          transform: isSelected ? 'scale(1.02)' : 'none',
                          boxShadow: isSelected ? '0 4px 12px rgba(27,108,49,0.25)' : 'none',
                        }}
                      >
                        <div style={{ fontSize: '1.05rem', fontWeight: 800 }}>{slot.display_time}</div>
                        <div style={{ fontSize: '11px', opacity: isSelected ? 0.95 : 0.85 }}>{slot.instructor_name}</div>
                        <div style={{ fontSize: '11px', color: isSelected ? '#ffffff' : 'var(--color-secondary)', fontWeight: 700, marginTop: '2px' }}>
                          ${slot.price} AUD
                        </div>
                        {isSelected && (
                          <div style={{ fontSize: '10px', fontWeight: 800, marginTop: '3px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            ✓ Selected
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {selectedSlot && (
                  <div className="card" style={{ padding: '1.25rem', backgroundColor: 'var(--color-primary-light)', borderColor: 'var(--color-secondary)' }}>
                    <div className="flex-between" style={{ flexWrap: 'wrap', gap: '1rem' }}>
                      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <div className="brand-icon" style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-full)' }}>
                          <Car size={24} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 800, color: 'var(--color-primary)' }}>
                            {selectedSlot.display_time} - {selectedSlot.display_end} with {selectedSlot.instructor_name}
                          </div>
                          <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                            Vehicle: {selectedSlot.car_model} ({selectedSlot.car_transmission.toUpperCase()}) | {selectedSlot.is_examiner ? 'Authorised VORT Examiner' : 'Accredited Driving Instructor'}
                          </div>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                          ${selectedSlot.price} AUD
                        </div>
                        <span className="badge badge-success">Slot Available</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex-between" style={{ marginTop: '2rem' }}>
              <button onClick={() => setStep(1)} className="button button-outline">
                <ArrowLeft size={16} /> Back
              </button>
              <button
                onClick={handleStep2Submit}
                disabled={!selectedSlot}
                className="button button-primary button-lg"
              >
                Proceed to Details <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: LEARNER DETAILS & PICKUP */}
        {step === 3 && (
          <form onSubmit={handleStep3Submit}>
            <div className="flex-between" style={{ marginBottom: '1.25rem' }}>
              <h3>Learner & Pickup Information</h3>
              <button type="button" onClick={() => setStep(2)} className="button button-sm button-outline">
                <ArrowLeft size={16} /> Change Time Slot
              </button>
            </div>

            <div className="grid grid-2">
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  value={customerDetails.name}
                  onChange={(e) => setCustomerDetails({ ...customerDetails, name: e.target.value })}
                  placeholder="e.g. Liam Smith"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input
                  type="email"
                  className="form-control"
                  required
                  value={customerDetails.email}
                  onChange={(e) => setCustomerDetails({ ...customerDetails, email: e.target.value })}
                  placeholder="name@example.com"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Mobile Phone Number *</label>
                <input
                  type="tel"
                  className="form-control"
                  required
                  value={customerDetails.phone}
                  onChange={(e) => setCustomerDetails({ ...customerDetails, phone: e.target.value })}
                  placeholder="0412 345 678"
                />
              </div>

              <div className="form-group">
                <label className="form-label">SA Driver's Licence / Client Number</label>
                <input
                  type="text"
                  className="form-control"
                  value={customerDetails.licence_number}
                  onChange={(e) => setCustomerDetails({ ...customerDetails, licence_number: e.target.value })}
                  placeholder="e.g. P1234567 (or leave blank if overseas)"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Pickup Address / Meeting Location *</label>
              <input
                type="text"
                className="form-control"
                required
                value={customerDetails.pickup_address}
                onChange={(e) => setCustomerDetails({ ...customerDetails, pickup_address: e.target.value })}
                placeholder="Residential address, school, or test centre meeting hub"
              />
              <span className="form-hint">Our instructor will meet you in a dual-controlled car at this address.</span>
            </div>

            <div className="form-group">
              <label className="form-label">Special Notes / Experience / Logbook Status</label>
              <textarea
                className="form-control"
                rows="3"
                value={customerDetails.notes}
                onChange={(e) => setCustomerDetails({ ...customerDetails, notes: e.target.value })}
                placeholder="Mention any areas you want to practice, your current supervised hours, or questions..."
              />
            </div>

            {/* Booking Summary Box */}
            <div className="card" style={{ padding: '1rem', backgroundColor: 'var(--color-surface-subtle)', margin: '1.5rem 0' }}>
              <div style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Reservation Summary</div>
              <div className="grid grid-2" style={{ fontSize: 'var(--font-size-sm)' }}>
                <div><strong>Service:</strong> {selectedSlot.service_name}</div>
                <div><strong>Date & Time:</strong> {formatAdelaideDate(selectedSlot.start_time)} @ {selectedSlot.display_time}</div>
                <div><strong>Instructor:</strong> {selectedSlot.instructor_name}</div>
                <div><strong>Total Payable:</strong> ${selectedSlot.price} AUD</div>
              </div>
            </div>

            <div className="flex-between">
              <button type="button" onClick={() => setStep(2)} className="button button-outline">
                <ArrowLeft size={16} /> Back
              </button>
              <button type="submit" className="button button-primary button-lg">
                Review & Pay <ArrowRight size={18} />
              </button>
            </div>
          </form>
        )}

        {/* STEP 4: ORDER REVIEW & SECURE STRIPE CHECKOUT */}
        {step === 4 && selectedSlot && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <ShieldCheck size={36} color="var(--color-secondary)" style={{ margin: '0 auto' }} />
              <h3 style={{ marginTop: '0.5rem' }}>Review & Complete Booking</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)' }}>
                You will be redirected to Stripe Checkout for secure card payment in AUD.
              </p>
            </div>

            <div className="card" style={{ padding: '1.25rem', backgroundColor: 'var(--color-surface-subtle)', marginBottom: '1.5rem' }}>
              <div className="flex-between" style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem', marginBottom: '0.75rem' }}>
                <span style={{ fontWeight: 600, fontSize: 'var(--font-size-base)' }}>{selectedSlot.service_name}</span>
                <span style={{ fontWeight: 800, fontSize: 'var(--font-size-lg)', color: 'var(--color-primary)' }}>${selectedSlot.price} AUD</span>
              </div>
              <div className="grid grid-2" style={{ fontSize: 'var(--font-size-sm)', gap: '0.5rem' }}>
                <div><strong>Instructor:</strong> {selectedSlot.instructor_name}</div>
                <div><strong>Location:</strong> {selectedLocation?.name || 'Selected Suburb'}</div>
                <div><strong>Date:</strong> {formatAdelaideDate(selectedSlot.start_time)}</div>
                <div><strong>Time:</strong> {selectedSlot.display_time}</div>
                <div><strong>Learner:</strong> {customerDetails.name}</div>
                <div><strong>Contact:</strong> {customerDetails.phone}</div>
                <div style={{ gridColumn: 'span 2' }}><strong>Pickup Address:</strong> {customerDetails.pickup_address}</div>
              </div>
            </div>

            <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <ShieldCheck size={24} color="#16a34a" style={{ flexShrink: 0 }} />
              <div style={{ fontSize: 'var(--font-size-xs)', color: '#166534' }}>
                <strong>Stripe Sandbox Hosted Checkout:</strong> Upon clicking Pay, your slot is held atomically on the server and you are redirected to Stripe. We accept Visa, Mastercard, and American Express. Full payment in AUD is processed upon completion.
              </div>
            </div>

            <div className="flex-between" style={{ gap: '1rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => setStep(3)}
                disabled={processingPayment}
                className="button button-outline"
              >
                <ArrowLeft size={16} /> Back to Details
              </button>
              <button
                type="button"
                onClick={handlePayAndBookStripe}
                disabled={processingPayment}
                className="button button-accent button-lg"
                style={{ flex: 1, minWidth: '240px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
              >
                <CreditCard size={18} />
                {processingPayment ? 'Redirecting to Stripe...' : `Pay $${selectedSlot.price} AUD & Book Slot`}
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: CONFIRMATION */}
        {step === 5 && confirmedBooking && (
          <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-success-bg)',
                border: '2px solid var(--color-success)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem auto',
                color: 'var(--color-success)',
              }}
            >
              <CheckCircle size={36} />
            </div>

            <h2 style={{ color: 'var(--color-primary)' }}>Booking Confirmed!</h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-base)', maxWidth: '520px', margin: '0 auto 1.5rem auto' }}>
              Your driving appointment has been locked into our database. We have sent a confirmation email with instructor details and test preparation guide.
            </p>

            <div className="card" style={{ maxWidth: '480px', margin: '0 auto 2rem auto', textAlign: 'left', padding: '1.25rem' }}>
              <div className="flex-between" style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: 'var(--font-size-xs)', textTransform: 'uppercase', color: 'var(--color-text-muted)', fontWeight: 700 }}>
                  Booking Reference
                </span>
                <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-secondary)' }}>
                  {confirmedBooking.booking_reference}
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: 'var(--font-size-sm)' }}>
                <div><strong>Service:</strong> {confirmedBooking.service_type?.name}</div>
                <div><strong>Instructor:</strong> {confirmedBooking.instructor?.name}</div>
                <div><strong>Date & Time:</strong> {new Date(confirmedBooking.start_time).toLocaleString()}</div>
                <div><strong>Pickup Location:</strong> {confirmedBooking.pickup_address}</div>
                <div><strong>Payment Status:</strong> <span className="badge badge-success">Paid (${confirmedBooking.price_snapshot} AUD)</span></div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={() => navigate('/dashboard/bookings')} className="button button-primary">
                View in My Dashboard
              </button>
              <button onClick={() => window.print()} className="button button-outline">
                Print Confirmation
              </button>
              <button onClick={() => { setStep(1); setSelectedSlot(null); setCreatedBooking(null); }} className="button button-secondary">
                Book Another Lesson
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

