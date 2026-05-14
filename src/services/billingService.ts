export const billingService = {
  async createCheckoutSession() {
    const response = await fetch('/api/billing/create-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await response.json();
    if (data.url) {
      window.location.href = data.url;
    }
  },

  async getBillingPortalUrl() {
    const response = await fetch('/api/billing/portal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await response.json();
    return data.url;
  }
};
