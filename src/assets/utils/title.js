export const ALL_FIELDS = ['titleType', 'byDefault', 'titleName', 'taxRegisterNo', 'address', 'mobilePhone', 'openBankName', 'openBankAccount', 'telePhoneNo', 'userEmail'];
export const CORPORATION_FIELDS = ['titleType', 'byDefault', 'titleName', 'taxRegisterNo', 'address', 'mobilePhone', 'openBankName', 'openBankAccount', 'telePhoneNo', 'userEmail'];
export const PERSONAL_FIELDS = ['titleType', 'byDefault', 'titleName', 'telePhoneNo', 'userEmail'];

export const DEFAULT_TITLE_DATA = {
  titleType: 'CORPORATION',
  byDefault: false,
  titleName: '',
  taxRegisterNo: '',
  address: '',
  mobilePhone: '',
  openBankName: '',
  openBankAccount: '',
  telePhoneNo: '',
  userEmail: '',
  enterpriseCode: '',
};

export const DEFAULT_TITLE_FIELDS_INFO = {
  titleType: {},
  byDefault: {},
  titleName: {
    name: 'titleName',
    type: 'text',
    isRequired: true,
    label: '名称',
    placeholder: '填写准确的抬头名称(必填)',
  },
  taxRegisterNo: {
    name: 'taxRegisterNo',
    type: 'text',
    isRequired: true,
    label: '税号',
    placeholder: '输入纳税人识别号(必填)',
  },
  address: {
    name: 'address',
    type: 'text',
    label: '公司地址',
    placeholder: '输入公司地址',
  },
  mobilePhone: {
    name: 'mobilePhone',
    type: 'text',
    label: '电话号码',
    placeholder: '输入公司电话号码',
  },
  openBankName: {
    name: 'openBankName',
    type: 'text',
    label: '开户银行',
    placeholder: '输入公司开户银行',
  },
  openBankAccount: {
    name: 'openBankAccount',
    type: 'number',
    label: '银行账号',
    placeholder: '输入公司银行账号',
  },
  telePhoneNo: {
    name: 'telePhoneNo',
    type: 'number',
    label: '手机号',
    placeholder: '输入个人手机号码',
  },
  userEmail: {
    name: 'userEmail',
    type: 'text',
    label: '邮箱',
    placeholder: '输入个人邮箱',
  },
};
