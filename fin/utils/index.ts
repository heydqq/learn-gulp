function fetch(
    url: string,
    config: IAnyObject = {
        loading: true,
        toastError: true,
        login: false,
        header: {}, // header信息
    },
): Promise<any> {
    let RequestTask: any;
    const fetchPromise: any = new Promise((resolve, reject) => {
        // auto show loading
        if (config.loading) {
            wx.showLoading({
                title: '加载中',
                mask: true,
            });
        }
        RequestTask = wx.request({
            url,
            data: {},
            method: 'GET',
            header: {
                'content-type': 'application/json; charset=utf-8',
                'cache-control': 'no-cache',
                bussiness: 'miniprogram-customer',
                ...(config.header || {}),
            },
            dataType: 'json',
            responseType: 'text',
            success(res: any): void {
                wx.hideLoading();
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    // ems 请求返回 code = 200
                    if (res.data.code === 200 && url.indexOf('emsapi') > 0) {
                        resolve(res.data);

                        return;
                    }
                }
            },
            fail(err): void {
                wx.hideLoading();
                const _response = {
                    toastMsg: `请求失败，${err.errMsg}`,
                    errCode: 'REQUEST_FAILED',
                };
                wx.showToast({
                    title: `请求失败，${err.errMsg}`,
                    icon: 'none',
                    duration: 2000,
                });
                reject(_response);
            },
        });
    }).catch((err:any) => {
        console.log('request err:', err);

        return err;
    });

    fetchPromise.RequestTask = RequestTask;

    return fetchPromise;
}

export default fetch;