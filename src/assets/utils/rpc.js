import RPCClient from '@alipay/koi-tiny-rpc';
import { SUCCESS_CODE } from 'utils/constants';
import { errMsg } from './constants';

export function rpcReq(url, data = {}, { loadingContent = '', showErrorToast = true } = {}) {
  return new Promise(async (resolve, reject) => {
    if (loadingContent) {
      my.showLoading({
        content: loadingContent,
      });
    }

    const client = new RPCClient({});
    const result = await client.mobilegw({
      operationType: url,
      requestData: [data],
    }).catch(err => {
      console.error('RPC request failed, error message: ' + JSON.stringify(err));
    });

    console.log('requestUrl:' + url, 'requestData:', data, 'requestResult', result);

    my.hideLoading();

    const { resultCode = '', resultMsg = '' } = result; // 防空
    const isSuccess = resultCode === SUCCESS_CODE;

    if (!isSuccess) {
      if (showErrorToast) {
        my.showToast({
          type: 'fail',
          content: resultMsg || errMsg.common,
          duration: 1000,
        });
      }
      reject(result);
    } else {
      resolve(result);
    }
  });
};
