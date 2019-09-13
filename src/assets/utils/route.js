  import api from './api';
  import { rpcReq } from './rpc';
  import { getIn } from 'herculex/dist/utils/manipulate';
  import { openUrl, getQueryData } from './util';

  const app = getApp();

  const urlMap = {
    'chooseType.htm': '/pages/choose-type/choose-type', // 选择类型
    'createDetail.htm': '/pages/apply-detail/apply-detail', // 申请详情
    'applyInvoice.htm': '/pages/apply-invoice/apply-invoice', // 申请开票
    'paperInvoiceTip.htm': '/pages/paper-invoice-tip/paper-invoice-tip', // 纸票成功的结果页
    'detail.htm': '/pages/invoice-detail/invoice-detail', // 发票详情
  };

  export async function reqRoute(query, isFromRoute = false) {
    const result = await rpcReq(api.applyRoute, query, { loadingContent: '加载中...' });
    // 如果存在params字段，那么需要缓存数据
    // result.params代表每个开票场景数据准备阶段所需的参数列表
    if (result.params) {
      await my.setStorage({
        key: 'applyInfo',
        data: {
          info: result.params,
        },
        success: function() {
          console.log('route setStorage写入成功');
        },
      });
    }
    console.log('//--//--result', result);
    app.globalData.routeData.invoiceParams = getIn(result, ['paperInvoiceParams'], '');
    app.globalData.routeData.secondUrl = getIn(result, ['secondUrl'], '');
    app.globalData.routeData.productCode = getIn(result, ['params', 'productCode'], '');
    if (result.url) {
      openAllTypeUrl(result.url);
    } else {
      throw new Error('没有可跳转链接');
    }
  }

  export const openAllTypeUrl = async (url, type = 'navigateTo') => {
    if (!url) return;
    const completeReg = /^(alipays:\/\/platformapi\/startapp).*$/;
    const miniReg = /^(\/pages\/).*$/;
    const hFiveReg = /^((http|https):\/\/).*$/;
    if (url.includes('url=%2Fwww%2Fdetail.htm')) { // 完整的H5发票详情的链接
      const params = decodeURIComponent(url.split('detail.htm%3F')[1]);
      const { code = '' } = getQueryData(params);
      if (!code) return;
      my[type]({
        url: `/pages/invoice-detail/invoice-detail?code=${code}&form=invoice_list`,
        fail (e) {
          console.error(`跳转至发票详情失败，错误原因为：${JSON.stringify(e)}`);
        },
      });
    } else if (url.includes('url=%2Fwww%2Froute.htm')) { // route链接
      const params = decodeURIComponent(url.split('route.htm%3F')[1]);
      const query = getQueryData(params, true);
      await reqRoute(query);
    } else if (completeReg.test(url) || hFiveReg.test(url)) { // 一个完整的Scheme链接
      openUrl(url);
    } else if (miniReg.test(url)) { // 小程序链接
      my[type]({ url });
    } else if (url.includes('route.htm')) { // route链接
      const query = getQueryData(url.splice('route.htm?', ''));
      await reqRoute(query);
    } else {
      for (let key in urlMap) {
        if (url.includes(key)) {
          my[type]({ url: url.replace(key, urlMap[key]) });
          return;
        }
      }
    }
  }
