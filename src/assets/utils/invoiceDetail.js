
export const invoiceTypeInfo = {
  PLAIN: '电子发票',
  PAPER_INVOICE: '纸票信息',
  TRANSPORT_INVOICE: '纸票信息',
  SPECIAL: '纸票信息',
  PLAIN_INVOICE: '纸票信息',
  SALSE_INVOICE: '纸票信息',
  FINANCIAL_ELECTRONIC_BILL: '财政电子票据',
};

export let optMap = {
  'ALIPAY_CAMP': {
    content: '抽红包',
  },
  'LOTTERY': {
    content: '发票摇奖',
  },
  'PVW': {
    content: '查看发票',
  },
  'DOWN_PDF': {
    content: '发送到邮箱',
  },
  'CLAIM': {
    content: '我要报销',
  },
  'INV_SOURCE_VIEW': {},
};

const merchantLogo = {
  TM: '../../images/list/tianmao.png',
  TB: '../../images/list/taobao.png',
  default: '../../images/list/head-no-pic.png',
};

export const getMerchantsLogo = (platform, mLogo) => {
  if (platform === 'TM') {
    return merchantLogo.TM;
  } else if (platform === 'TB') {
    return merchantLogo.TB;
  } else {
    return mLogo ? mLogo : merchantLogo.default;
  }
};
