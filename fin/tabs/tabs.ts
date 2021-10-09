/*
 * @Description: 标签页组件
 * @Author: duanwensheng
 * @Date: 2021-05-28 16:49:33
 */

Component({

    // 外部样式类
    externalClasses: [
        'won-we-class'
    ],

    relations: {
        '../tabpanel/tabpanel': {
            type: 'child', 
            // 子组件attached生命周期之后
            linked(target) { 
                this.updateTabs();
            }
        }
    },

    properties: {
        // 默认展示的tab页 
        activeKey: {
            type: null,
            value: 0
        },

        // 是否开启横向滚动
        scrollable: {
            type: Boolean,
            value: false
        }

    },

    data: {
        currentIndex: 0,
        isScrollable: false,
        scrollLeft: 0,
        tabList: []
    },

    methods: {
        updateTabs() {
            this.children = this.getRelationNodes('../tabpanel/tabpanel') || [];
            this.children.forEach((child, index) => {
                child.data.index = index;
                child.data.key = child.data.key ? child.data.key : index;
            });

            this.setData({
                tabList: this.children.map(child => child.data),
                isScrollable: this.properties.scrollable || this.children.length > 4
            });
            this.setCurrentIndexByActiveKey(this.data.activeKey);
            this.scrollToView();
        },

        setCurrentIndexByActiveKey(activeKey) {

            this.groupSetData(() => {
                this.children.forEach(child => {
                    let show = child.data.key === activeKey;
                    
                    if (show !== child.data.show) {
                        child.updateRender(show);
                    }
                    
                    if (show) {
                        this.setData({ currentIndex: child.data.index })
                    }
                })
            })      
        },

        onTap(event) {
            const { index } = event.currentTarget.dataset;
            const activeKey = this.children[index]?.data.key;
            this.setData({
                activeKey,
            })
            this.setCurrentIndexByActiveKey(activeKey);
            this.triggerEvent('change', {
                key: activeKey,
                title: this.children[index]?.data.title
            });

            this.scrollToView();
        },

        // 自动滚动至区域
        scrollToView() {
            const { isScrollable, currentIndex } = this.data;
            if (!isScrollable) {
                return;
            }

            Promise.all([
                this.getRect(this, '.won-tabs'),
                this.getRect(this, '.won-tabs-wrap')
            ]).then(([tabNavRect, tabsRect = []]) => {
                const currentTab = tabsRect[currentIndex]

                if (!currentTab) {
                    return;
                }

                // 获取元素左对齐时的偏移量
                const offset = tabsRect.slice(0, currentIndex).reduce((pre, curr) => pre + curr.width, 0);
                // 居中显示
                const scrollLeft = offset - ( tabNavRect[0].width - currentTab.width ) / 2;
                
                this.setData({ scrollLeft });
            });
        },

        // 查询元素节点信息
        getRect(context: any, selector: string) {
            return new Promise((resolve) => {
                wx.createSelectorQuery()
                .in(context)
                .selectAll(selector)
                .boundingClientRect()
                .exec((rect = []) => resolve(rect[0]))
            })
        }

    }
})