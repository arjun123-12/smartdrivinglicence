/**
 * A1 Smart Driving - API Response & Array Normalization Helpers
 * Guarantees safe extraction of Array data regardless of backend serialization:
 * - Direct arrays: [ ... ]
 * - Standard Laravel ApiResponse: { status: 'success', data: [ ... ] }
 * - Laravel LengthAwarePaginator: { status: 'success', data: { data: [ ... ], current_page: 1 } }
 * - Direct Paginator: { data: [ ... ], current_page: 1 }
 * - Named wrapper payloads: { packages: [ ... ] }, { instructors: [ ... ] }, etc.
 * - Axios response wrapper: response.data
 * - Failed, undefined, null, or HTML error responses.
 */

export function extractArray(response, fallback = []) {
  if (Array.isArray(response)) {
    return response;
  }
  if (!response || typeof response !== 'object') {
    return Array.isArray(fallback) ? fallback : [];
  }

  // If response is an Axios response object
  const body = response.data !== undefined ? response.data : response;

  if (Array.isArray(body)) {
    return body;
  }

  if (body && typeof body === 'object') {
    // 1. Direct body.data array
    if (Array.isArray(body.data)) {
      return body.data;
    }

    // 2. Nested Laravel LengthAwarePaginator: body.data.data
    if (body.data && typeof body.data === 'object' && Array.isArray(body.data.data)) {
      return body.data.data;
    }

    // 3. Paginator without wrapper: body.items / body.records / body.results
    if (Array.isArray(body.items)) return body.items;
    if (Array.isArray(body.records)) return body.records;
    if (Array.isArray(body.results)) return body.results;

    // 4. Common named resource properties
    const candidates = [
      'slots',
      'packages',
      'instructors',
      'locations',
      'services',
      'bookings',
      'customers',
      'faqs',
      'testimonials',
      'payments',
      'schedules',
      'exceptions',
      'recent_bookings',
      'recent_logs',
      'audit_logs',
      'features',
    ];

    for (const key of candidates) {
      if (Array.isArray(body[key])) {
        return body[key];
      }
      if (body[key] && typeof body[key] === 'object' && Array.isArray(body[key].data)) {
        return body[key].data;
      }
    }
  }

  return Array.isArray(fallback) ? fallback : [];
}

/**
 * Ensures a value is always an array for safe iteration.
 * Never throws TypeError: Cannot read properties of undefined (reading 'map').
 */
export function safeArray(val, fallback = []) {
  if (Array.isArray(val)) return val;
  return extractArray(val, fallback);
}

