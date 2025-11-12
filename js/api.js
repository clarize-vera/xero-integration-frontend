// API helper for calling Supabase Edge Functions
// Replace YOUR_PROJECT_URL with your actual Supabase project URL

const API_BASE_URL = 'https://tcjkmswrhvpcbwgvtdhp.supabase.co/functions/v1'

// Helper to make API calls
async function callFunction(functionName, options = {}) {
  const url = `${API_BASE_URL}/${functionName}`
  
  const response = await fetch(url, {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    body: options.body ? JSON.stringify(options.body) : undefined
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }))
    throw new Error(error.error || `API error: ${response.status}`)
  }

  return response.json()
}

// API methods
const API = {
  // OAuth
  connectOrganization() {
    window.location.href = `${API_BASE_URL}/oauth-connect`
  },

  async getSession(sessionId) {
    return callFunction(`get-session?sessionId=${sessionId}`)
  },

  async saveOrganizations(sessionId, selectedTenantIds) {
    return callFunction('save-organizations', {
      method: 'POST',
      body: { sessionId, selectedTenantIds }
    })
  },

  // Organizations
  async listOrganizations() {
    return callFunction('list-organizations')
  },

  async disconnectOrganization(tenantId) {
    return callFunction('disconnect-org', {
      method: 'POST',
      body: { tenantId }
    })
  },

  // Syncing
  async syncOrganization(tenantId, fromDate = null, toDate = null) {
    return callFunction('sync-organization', {
      method: 'POST',
      body: { tenantId, fromDate, toDate }
    })
  },

  async syncAll(batchSize = 5) {
    return callFunction('sync-all', {
      method: 'POST',
      body: { batchSize }
    })
  },

  // Monitoring
  async getDashboardStats() {
    return callFunction('dashboard-stats')
  },

  async getRateLimitStats() {
    return callFunction('rate-limit-stats')
  }
}

// Export for use in other files
if (typeof window !== 'undefined') {
  window.API = API
}
