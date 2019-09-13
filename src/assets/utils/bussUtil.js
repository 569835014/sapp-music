import api from 'utils/api';
import { rpcReq } from 'utils/rpc';
import { AUTH_TYPE } from './constants';

export async function isAuthed(payload) {
  let isAuthed = false;
  try {
    const { authList } = await rpcReq(api.authBatchQuery, {
      authTypeList: [AUTH_TYPE.INVOICE_AUTO_OPEN],
    });
    isAuthed = authList.some((item) => {
      return Object.keys(payload).every(key => item[key] === payload[key]);
    });
  } catch (e) {
    console.error('查询授权列表失败', JSON.stringify(e));
  }
  return isAuthed;
}
