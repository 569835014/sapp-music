export const INVOICE_FORM_INFO = {
  invoiceCode: {
    name: 'invoiceCode',
    type: 'number',
    label: '发票代码',
    placeholder: '输入10或12位数字',
  },
  invoiceNo: {
    name: 'invoiceNo',
    type: 'number',
    label: '发票号码',
    placeholder: '输入8位数字',
  },
  invoiceAmount: {
    name: 'invoiceAmount',
    type: 'digit',
    isRequired: true,
    label: '发票金额',
    placeholder: '输入金额（不含税金额）',
  },
  invoiceDate: {
    name: 'invoiceDate',
    type: 'number',
    isRequired: true,
    label: '开票日期',
    placeholder: '输入格式20180101',
  },
};

export const INVOICE_DEFAULT_DATA = {
  invoiceCode: '',
  invoiceNo: '',
  invoiceAmount: '',
  invoiceDate: '',
  invoiceKind: '',
  areaCode: '',
};

export const INVOICE_TYPE_OPTIONS = [
  {
    label: '增值税普通发票',
    value: '04',
  },
  {
    label: '增值税电子普通发票',
    value: '10',
  },
  {
    label: '增值税普通发票（卷式）',
    value: '11',
  },
];

