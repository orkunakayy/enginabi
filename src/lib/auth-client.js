let verifyPromise = null;

export function checkAdminClient() {
  if (typeof window === 'undefined') {
    return Promise.resolve(false);
  }
  
  if (verifyPromise) {
    return verifyPromise;
  }
  
  verifyPromise = fetch('/api/admin/verify')
    .then(res => {
      if (!res.ok) {
        // Clear cache on failure so they can retry after logging in
        verifyPromise = null;
        return false;
      }
      return true;
    })
    .catch(() => {
      verifyPromise = null;
      return false;
    });
    
  return verifyPromise;
}

export function clearAdminClientCache() {
  verifyPromise = null;
}
