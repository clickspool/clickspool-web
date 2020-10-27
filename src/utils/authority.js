// use localStorage to store the authority info, which might be sent from server in actual project.
export function getAuthority(str) {
  // return localStorage.getItem('antd-pro-authority') || ['admin', 'user'];
  const authorityString = typeof str === 'undefined' ? localStorage.getItem('token') : str;
  // authorityString could be admin, "admin", ["admin"]
  let authority;
  try {
    authority = JSON.parse(authorityString);
  } catch (e) {
    authority = authorityString;
  }
  return authority || '';
}

export function setAuthority(authority) {
  return localStorage.setItem('token', JSON.stringify(authority));
}

export function removeAuthority() {
  return localStorage.removeItem('token');
}
