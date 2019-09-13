export const openUrl = (url, params = {}) => {
  if (!url) {
    console.log('Empty url!');
    return;
  }
  my.call('startApp', {
    appId: '20000067',
    param: {
      startMultApp: 'YES',
      appClearTop: 'false',
      url,
      ...params,
    },
  });
};

export const imageViewer = (imageUri = '') => {
  let _u = '';

  my.call('getClientInfo', (res) => {
    let name = 'os.name';
    if (res && res[name] && /^.*(iphone|ipod|ipad|iOS|iPhone|iPod|iPad).*$/gi.test(res[name])) {
      _u = 'alipay-cloud-id://';
    }

    my.call('imageViewer',
      {
        images: [{ u: _u + (imageUri || ''), t: '' }],
        init: 0,
        enablesavephoto: true,
      }
    );
  });
};

export const getEnv = () => {
  return new Promise(resolve => {
    my.call('getConfig', { configKeys: ['rpcUrl'] }, result => {
      if (!result || !result.data || !result.data.rpcUrl) {
        console.error('get env error, return prod');
        return resolve('prod');
      }
      const { rpcUrl = '' } = result.data;
      if (rpcUrl.indexOf('mobilegwpre.alipay.com') >= 0) {
        return resolve('pre');
      }
      if (/mobilegw.+\.alipay\.net/.test(rpcUrl)) {
        if (rpcUrl.indexOf('test') >= 0) {
          resolve('test');
        }
        return resolve('dev');
      }
      return resolve('prod');
    });
  });
};

export const getH5data = async (path) => {
  const env = await getEnv();
  return new Promise((resolve, reject) => {
    my.httpRequest({
      url: `https://render.alipay.com/p/s/h5data/${env}/${path}.json`,
      dataType: 'json',
      // 增加超时时间，如果获取凤蝶配置超时会自动终止
      timeout: 3000,
      success: function(res) {
        if (res && res.data) {
          resolve(res.data);
        }
        reject(res);
      },
      fail: function(err) {
        reject(err);
      },
    });
  });
};

export const pick = (raw = {}, keys = []) => { // 防空
  return Object.keys(raw).filter(key => keys.indexOf(key) > -1).reduce((obj, key) => {
    return { ...obj, [key]: raw[key] };
  }, {});
};

export const hideShareMenu = () => {
  my.canIUse('hideShareMenu') && my.hideShareMenu();
};

export const isArray = (arr) => {
  return Array.isArray ? Array.isArray(arr) : Object.prototype.toString.call(arr) === '[object Array]';
};

export const objectToQueryString = (params = {}) => {
  return Object.keys(params).map(key => key + '=' + params[key]).join('&');
};

export const getQueryData = (query = '', shouldDecode = false) => {
  let object = {};
  const queryArr = query.split('&');
  queryArr.forEach(element => {
    const arr = element.split('=');
    let value = arr[1];
    if (shouldDecode) {
      try {
        value = decodeURIComponent(arr[1]);
      } catch (e) {
        console.warn('decode error:', arr[1]);
      }
    }
    object[arr[0]] = value;
  });
  return object;
};

export const getParamDate = (year, month) => {
  const day = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  let date = new Date();
  const Year = year || date.getFullYear();
  const isLeapYear = !(Year % (Year % 100 ? 4 : 400));
  let y = Year;
  let m = month || date.getMonth() + 1;
  let d = isLeapYear ? 29 : day[m - 1];
  m = m > 9 ? m : '0' + m;
  return {
    startDate: y + '-' + m + '-' + '01' + ' 00:00:00',
    endDate: y + '-' + m + '-' + d + ' 23:59:59',
  };
};

export const yearData = () => {
  let minYear = 2008;
  let maxYear = new Date().getFullYear();
  let arr = [];
  while (minYear <= maxYear) {
    arr.push(minYear++);
  }
  return arr;
};

const merchantLogo = {
  TM: 'https://gw.alipayobjects.com/zos/rmsportal/KAxupIDrDVfYzKPFULLO.png',
  TB: 'https://gw.alipayobjects.com/zos/rmsportal/hTOPbNJoNrniJUbnuSUP.png',
  default: 'https://gw.alipayobjects.com/zos/rmsportal/WPhFvRtxaxyKmgvFkFRI.png',
};

export const getDefaultLogo = (type = 'default', logoUrl) => {
  const defaultLogo = merchantLogo[type] || merchantLogo.default;
  return logoUrl || defaultLogo;
};

export function serialize (json) {
  let result = '';
  Object.keys(json).forEach((key, idx) => {
    result += `${idx ? '&' : ''}${key}=${json[key]}`;
  });
  return result;
}

export const unserialize = getQueryData;
export const objectValues = function (object) {
  let valuse = [];
  try {
    if (typeof Object.values === 'function') return Object.values(object);
    if (Object.prototype.toString.call(object) !== '[object Object]') {
      return valuse;
    }
    for (let key in object) {
      valuse.push(object[key]);
    }
  } catch (e) {
    console.log(e);
  }
  return valuse;
}

