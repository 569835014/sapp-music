const { resolve } = require('path');
const r = url => resolve(__dirname, url);
const assetsPath = resolve(process.cwd(), './build');

module.exports = {
    json: {
        pages: [
            'pages/home/home',
            'pages/disc/disc',
            'pages/h5/h5',
            'pages/demo/demo',
            'pages/scroll/scroll',
        ],
        components: [
            'components/add-button/add-button',
            'components/navigation/navigation',
            'components/scroll/scroll',
        ],
        window: {
            "disableScroll": true,
            allowsBounceVertical: 'NO',
            pullRefresh: false,
        },
        tabBar: {
            textColor: '#999999',
            selectedColor: '#1B82D2',
            backgroundColor: '#FFFFFF',
            items: [
                {
                    pagePath: 'pages/index/index',
                    name: '首页',
                    icon: 'images/tab-bar/index.png',
                    activeIcon: 'images/tab-bar/index-active.png',
                },
                {
                    pagePath: 'pages/title/title',
                    name: '抬头',
                    icon: 'images/tab-bar/title.png',
                    activeIcon: 'images/tab-bar/title-active.png',
                },
                {
                    pagePath: 'pages/list/list',
                    name: '我的发票',
                    icon: 'images/tab-bar/list.png',
                    activeIcon: 'images/tab-bar/list-active.png',
                },
            ],
        },
    },
    entry: [],
    assetsPath: assetsPath,
    app: r('./app.js'),
};
