
const formatterC6 = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 6
});

const formatterC3 = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 3
});

const formatterC2 = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2
});

const formatterC0 = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0
});

export const getAuthHeaders = () => {
  return {
    'Authorization': `Bearer ${localStorage.getItem('idToken')}`,
    'Content-Type': 'application/json'
  }
};

export const tenantId = () => process.env.PUBLIC_URL || '';

export const toColor = (num) => {
  num >>>= 0;
  let b = num & 0xFF,
    g = (num & 0xFF00) >>> 8,
    r = (num & 0xFF0000) >>> 16,
    a = ( (num & 0xFF000000) >>> 24 ) / 255 ;
  return "rgba(" + [r, g, b, a].join(",") + ")";
}

export const getSettings = (item) => {
  const state = {
    signalRUrl: localStorage.getItem('signalRUrl') || '',
    signalRMethod: localStorage.getItem('signalRMethod') || '',
    apiEndPoint: localStorage.getItem('apiEndPoint') ? localStorage.getItem('apiEndPoint') : `https://dsapi.dietechsoftware.com${tenantId()}/api`,
    reportsApiEndPoint: localStorage.getItem('reportsApiEndPoint') ? localStorage.getItem('reportsApiEndPoint') : `https://dsapi.dietechsoftware.com${tenantId()}/reports/api`,
    logoText: localStorage.getItem('logoText') ? localStorage.getItem('logoText') : 'PSI Support',
    copyRightText: localStorage.getItem('copyRightText') ? localStorage.getItem('copyRightText') : 'Dietech © 2019.',
    supportUrl: localStorage.getItem('supportUrl') ? localStorage.getItem('supportUrl') : 'https://www.psisupport.com/',
    facilityKey: localStorage.getItem('facilityKey') ? localStorage.getItem('facilityKey') : '',
    isShowHiddenFeatures: localStorage.getItem('isShowHiddenFeatures') ? String(localStorage.getItem('isShowHiddenFeatures')) === 'true' : '',
    isOverrideSettings: localStorage.getItem('isOverrideSettings') ? String(localStorage.getItem('isOverrideSettings')) === 'true' : '',
    isApprovalAccess: localStorage.getItem('isApprovalAccess') ? String(localStorage.getItem('isApprovalAccess')) === 'true' : false,
    settingsUpdatedAt: localStorage.getItem('settingsUpdatedAt') ? localStorage.getItem('settingsUpdatedAt') : '',
    dateFormat: localStorage.getItem('dateFormat') ? localStorage.getItem('dateFormat') || 'M/D/YYYY' : 'M/D/YYYY',
    sessionID: localStorage.getItem('sessionID') ? localStorage.getItem('sessionID') : '444594696',
  };
  return state[item] || '';
};

export const dateFormatDevX = () => {
  let dateFormat = getSettings('dateFormat');
  return dateFormat.replace(/Y/g, 'y').replace(/D/g, 'd')
}

export const formatNumber = (value, decimalPoint = 3) => {
  if (isNaN(String(value))) {
    return '';
  }
  if (decimalPoint === 6) {
    return formatterC6.format(value);
  } else if (decimalPoint === 3) {
    return formatterC3.format(value);
  } else if (decimalPoint === 0) {
    return formatterC0.format(value);
  } else {
    return formatterC2.format(value);
  }
};

export const dateFormat = getSettings('dateFormat');

export const max = (array) => {
  return array.length ? Math.max(...array) : 0;
};

export const getSelectedFacilityData = (facilitiesData, facilityKey) => {
  if (facilitiesData && facilitiesData.length && facilityKey) {
    return facilitiesData.find(x=>x.PKey_Facility === Number(facilityKey || '0'));
  }
  return null;
}

export const POS_INVOICE_STATUS = {
  PENDING: 1,
  CONFIRM: 2,
  REJECT: 3,
  ALL: 0
};

export const approvalAccess = getSettings('isApprovalAccess')

export const decodeJWTToken = (token) => {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
};

export const getSubID = () => {
  const decoded = decodeJWTToken(localStorage.getItem('idToken'))
  return decoded.sub || "";
};
