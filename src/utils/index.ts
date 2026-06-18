export function formatDate(dateString: any) {
  if (!dateString) return 'N/A';
  
  // if firestore timestamp
  if (dateString.toDate && typeof dateString.toDate === 'function') {
      const d = dateString.toDate();
      return new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(d);
  }
  
  try {
      const d = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(d);
  } catch(e) {
      return 'Invalid Date';
  }
}

export function formatCurrency(amount: string | number) {
  let numStr = String(amount).replace(/[^0-9.-]+/g, "");
  const num = parseFloat(numStr);
  if(isNaN(num)) return '₦0';
  return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
  }).format(num);
}
