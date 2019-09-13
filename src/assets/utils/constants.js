export const SUCCESS_CODE = 100;

export const errMsg = {
  'common': '系统正忙，稍候再试',
  '1001': '拒绝访问',
  '1002': '人太多，客官请稍候',
  '3000': '缺少操作类型或者此操作类型不支持',
  '3001': '请求数据为空',
  '3002': '数据格式有误',
  '4001': '服务请求超时',
  '4002': '远程调用业务系统异常',
  '4003': '创建远程调用reference失败',
  '5000': '未知异常',
  'invoiceTipsEmail': '邮箱格式不正确',
};

export const errType = {
  err: 'error',
  empty: 'empty',
  blank: 'nofound',
  networkErr: 'network',
  busy: 'busy',
  loadingErr: 'LOADING-ERR',
};

const BLOCKCHAIN_MEDICAL_AUTH = 'BLOCKCHAIN_MEDICAL_AUTH';
const INVOICE_AUTO_OPEN = 'INVOICE_AUTO_OPEN';
const TRAVEL = 'TRAVEL';
const BLOCKCHAIN_MEDICAL_INVOICE = 'BLOCKCHAIN_MEDICAL_INVOICE';
export const AUTH_TYPE = {
  BLOCKCHAIN_MEDICAL_AUTH,
  INVOICE_AUTO_OPEN,
}
export const M_SORT_NAME = {
  TRAVEL,
  BLOCKCHAIN_MEDICAL_INVOICE,
}
