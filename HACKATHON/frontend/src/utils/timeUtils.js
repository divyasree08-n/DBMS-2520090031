// Indian Standard Time (IST, UTC+05:30) Formatter Utility

/**
 * Returns current timestamp in Indian Standard Time (IST) formatted string
 * e.g. "30 Oct 2026, 09:30 PM IST"
 */
export function getCurrentISTString() {
  const now = new Date();
  return formatToIST(now);
}

/**
 * Formats any Date object or ISO string into Indian Standard Time (IST) format
 * Format: "DD MMM YYYY, hh:mm A IST"
 */
export function formatToIST(dateInput) {
  if (!dateInput) return 'N/A';
  
  const date = typeof dateInput === 'string' ? new Date(dateInput.replace(' IST', '')) : dateInput;
  
  // Format options with Indian locale and Asia/Kolkata timezone
  try {
    const formatted = new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(date);

    return `${formatted} IST`;
  } catch {
    return `${date.toLocaleDateString('en-IN')} IST`;
  }
}

/**
 * Formats a short date in IST: "DD/MM/YYYY"
 */
export function formatShortDateIST(dateInput) {
  if (!dateInput) return '';
  const date = typeof dateInput === 'string' ? new Date(dateInput.replace(' IST', '')) : dateInput;
  try {
    return new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  } catch {
    return date.toLocaleDateString('en-IN');
  }
}
