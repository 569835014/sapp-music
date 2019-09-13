const FORM_RULES = {
  TITLE: {
    titleName: {
      required: true,
      tipName: '抬头名称',
      tooShortError: '请填写抬头名称',
      maxLen: 100,
    },
    taxRegisterNo: {
      required: true,
      tipName: '税号',
      tooShortError: '请填写税号',
      maxLen: 20,
      REG: /^[A-Z\d]+$/,
      inputFormatError: '请勿输入数字，大写字母以外的字符',
      finalREG: /^[A-Z\d]{1,20}$/,
      finalFormatError: '税号仅支持1到20个数字或大写字母，请正确输入',
    },
    address: {
      tipName: '公司地址',
      maxLen: 150,
    },
    mobilePhone: {
      tipName: '电话号码',
      maxLen: 30,
    },
    openBankName: {
      tipName: '开户银行',
      maxLen: 100,
    },
    openBankAccount: {
      tipName: '银行账号',
      maxLen: 50,
      REG: /^\d+$/,
      inputFormatError: '请勿输入除数字以外的字符',
      finalREG: /^\d{1,50}$/,
      finalFormatError: '银行账号仅支持1到50个数字，请正确输入',
    },
    telePhoneNo: {
      tipName: '手机号',
      maxLen: 15,
      REG: /^\d+$/,
      inputFormatError: '请勿输入除数字以外的字符',
      finalREG: /^\d{1,15}$/,
      finalFormatError: '手机号仅支持1到15个数字，请正确输入',
    },
    userEmail: {
      tipName: '邮箱',
      maxLen: 50,
      inputFormatError: '请输入正确的邮箱',
      finalREG: /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/,
    },
  },
  LOTTERY: {
    invoiceCode: {
      required: true,
      tipName: '发票代码',
      REG: /^\d+$/,
      inputFormatError: '请勿输入除数字以外的字符',
      finalREG: /^(\d{10}|\d{12})$/,
      finalFormatError: '发票代码应为10位或12位数字，请正确输入',
    },
    invoiceNo: {
      required: true,
      tipName: '发票号码',
      REG: /^\d+$/,
      inputFormatError: '请勿输入除数字以外的字符',
      finalREG: /^\d{8}$/,
      finalFormatError: '发票号码为8位数字，请正确输入',
    },
    invoiceDate: {
      required: true,
      tipName: '开票日期',
      REG: /^\d+$/,
      inputFormatError: '请勿输入除数字以外的字符',
      finalREG: /^\d{8}$/,
      finalFormatError: '请正确输入开票日期',
    },
    invoiceAmount: {
      required: true,
      tipName: '发票金额',
      REG: /^\d+\.?\d*$/,
      inputFormatError: '请正确输入发票金额（价税合计金额）',
      finalREG: /^\d+\.?\d*$/,
      finalFormatError: '请正确输入发票金额（价税合计金额）',
    },
  },
};

const doValidation = (field, value = '', { ruleSet, isTyping }) => {
  if (!FORM_RULES[ruleSet]) ruleSet = 'TITLE';
  const setting = FORM_RULES[ruleSet][field];

  if (value && typeof value.trim === 'function') {
    value = value.trim();
  }

  // 如果不存在该配置说明无需校验
  if (!setting) return { success: true };

  // 空值 && 必填项
  if (!value && !isTyping && setting.required) {
    return {
      success: false,
      errorType: 'INPUT_REQUIRED_EMPTY_ERROR',
      errorMessage: setting.tooShortError || `请输入${setting.tipName}`,
    };
  }

  // 格式校验
  const regRule = isTyping ? setting.REG : (setting.finalREG || setting.REG);
  if (regRule && value && !regRule.test(value)) {
    const errorMessage = isTyping ?
      (setting.inputFormatError || `请输入正确的${setting.tipName}`) :
      (setting.finalFormatError || setting.inputFormatError || `请输入正确的${setting.tipName}`);
    return {
      success: false,
      errorType: 'INPUT_FORMAT_ERROR',
      errorMessage,
    };
  }

  // 如果长度不符合规范，那么就返回长度校验失败
  // 如果正在输入，则跳过 minLen 检测
  if (!isTyping && setting.minLen && setting.minLen > value.length) {
    return {
      success: false,
      errorType: 'INPUT_LENGTH_ERROR',
      errorMessage: setting.tooShortError || `${setting.tipName}少于${setting.minLen}个字符`,
    };
  }
  if (setting.maxLen && setting.maxLen < value.length) {
    return {
      success: false,
      errorType: 'INPUT_LENGTH_ERROR',
      errorMessage: setting.tooLongError || `${setting.tipName}超过${setting.maxLen}个字符`,
    };
  }

  return { success: true };
};

const showTip = (errorMessage = '') => {
  if (!errorMessage) return;
  my.showToast({
    content: errorMessage,
    duration: 1500,
  });
};

export const validate = (field, value, { showErrorTip = false, ruleSet = 'TITLE', isTyping = true } = {}) => {
  const validationResult = doValidation(field, value, { ruleSet, isTyping });
  const { success, errorMessage } = validationResult;

  // Show error tip
  if (showErrorTip && !success) {
    showTip(errorMessage);
  }

  return validationResult;
};

export const validateAll = (data = {}, errorStatus = {}, { showErrorTip = false, ruleSet = 'TITLE' } = {}) => {
  let isAllDataValid = true;

  Object.keys(data).forEach(field => {
    const validationResult = errorStatus[field]
      || validate(field, data[field], { ruleSet, showErrorTip: false, isTyping: false });

    errorStatus[field] = validationResult;
    const { success, errorMessage = '' } = validationResult; // 防空

    // Only show the error message for the first field that does not pass
    if (!success && isAllDataValid) {
      if (showErrorTip) {
        showTip(errorMessage);
      }
      isAllDataValid = false;
    }
  });

  return { isAllDataValid, errorStatus };
};
