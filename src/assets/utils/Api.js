export default function Api(options) {
  return new Promise((resolve, reject) => {
    my.request({
      ...options,
      success(result) {
        if (result && result.data) {
          resolve(result.data.data ? result.data.data : result.data);
        } else {
          resolve(true);
        }
      },
      fail(...arg) {
        reject(new Error(arg));
      },
      complete() {
        options.complete && options.complete(...arguments);
      },
    });
  });
}
