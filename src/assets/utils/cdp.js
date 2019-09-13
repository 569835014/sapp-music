export const DEFAULT_CDP_PARAMS = {
  spaceCode: '',
  extInfo: {},
  immediately: true,
};

export function getCdp (params = {}) { // 防空
  const normalizedParams = Object.assign(DEFAULT_CDP_PARAMS, params);

  return new Promise((resolve, reject) => {
    my.call('getCdpSpaceInfo', normalizedParams, result => {
      if (result && result.spaceObjectList && result.spaceObjectList.length > 0) {
        resolve(result.spaceObjectList);
      } else {
        reject(result);
      }
    });
  });
}

export function feedbackCdp (params) {
  return new Promise((resolve, reject) => {
    my.call('cdpFeedback', params, result => {
      // 文档中记载返回值为空，但是实际测试返回 {success: boolean},
      // 所以此处暂且认为返回值为空是正常情况
      if (result && !result.success) {
        reject(result);
      }
    });
  });
}
