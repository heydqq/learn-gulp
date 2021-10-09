/*
 * @Author: huoyuhuan
 * @Date: 2021-06-02 17:51:58
 * @LastEditTime: 2021-06-02 20:11:47
 * @LastEditors: huoyuhuan
 * @Description: 地区选择组件
 */
import fieldItem from "../utils/behavior/field-item";
import fetch from "../utils/index";

Component({
    behaviors: [fieldItem, "wx://form-field"],
    relations: {
        "../field/field": {
        type: "parent",
        },
    },
    externalClasses: ['won-we-region'],
    data: {
        enabledConfirm: true,
        dataOption: [],  //地区数据源
        cityOption: [],  //市数据
        areaOption: [],  //区数据
        province: 0,  //已选择的省的数组下标
        city: 0,
        currentChangeCol: "0", // 当前选择改变的列
        currentValue: [0,0,0],
        maskClosable: false,
        title: '请选择',
        confirmColor: '#5146fe'  // 确定按钮的颜色
    },
    properties: {
        // 传入数据源
        options: Array,
        // 传入默认选中数据
        value: Array,
        show: {
            type: Boolean,
            value: false,
        },
        // 确定按钮的颜色
        confirmBtnColor: {
            type: String,
            value: '#5146fe',
        }
    },
    observers: {
        'currentValue, currentChangeCol': function(currentValue: Array<string>, currentChangeCol: string) {
            const { dataOption } = this.data;
            if (currentValue.length > 0 && currentChangeCol === "0") {
                let currentCityList = dataOption[currentValue[0]]?.childs || [];
                // 如果当前城市的区不足，则置为最后一个区
                let flag = currentCityList[currentValue[1]];
                let cityLength = flag === undefined ? currentCityList.length - 1 : currentValue[1];
                this.setData({
                    province: currentValue[0],
                    city: cityLength,
                    cityOption: dataOption[currentValue[0]]?.childs || [],
                    areaOption: dataOption[currentValue[0]].childs[cityLength]?.childs || []
                });
            } else if(currentValue.length > 0 && currentChangeCol === "1") {
                this.setData({
                    city: currentValue[1],
                    areaOption: dataOption[currentValue[0]].childs[currentValue[1]]?.childs || []
                });
            }
        },
        show(val: Boolean) {
            if(!val) {
                return;
            }
            const { value } = this.data;
            if (Array.isArray(value) && value.length > 0) {
                this.setData({
                    currentValue: value
                })
            }
        }
    },
    methods: {
        touchStart: function () {
            this.setData({
                enabledConfirm: false,
                confirmColor: '#999999'
            });
        },
        // 监听值的变化
        bindChange: function (e: any) {
            const value = e.detail.value;
            this.setData({
                currentValue: value,
                enabledConfirm: true,
                confirmColor: this.data.confirmBtnColor
            });
        },
        getIndex: function (e: any) {
            const index = e.currentTarget.dataset.index;
            this.setData({
                currentChangeCol: index,
                confirmColor: this.data.confirmBtnColor
            });
        },
        // 点击确定按钮时触发
        onConfirm: function () {
            if (!this.data.enabledConfirm) {
                return;
            }
            const {currentValue: value, dataOption, cityOption, areaOption} = this.data;
            let cityCode = [], cityName = [];
            cityCode[0] = dataOption[value[0]].cityCode;
            cityName[0] = dataOption[value[0]].cityName;
            cityCode[1] = cityOption[value[1]].cityCode;
            cityName[1] = cityOption[value[1]].cityName;
            if (!!areaOption[value[2]]) {
                cityCode[2] = areaOption[value[2]].cityCode;
                cityName[2] = areaOption[value[2]].cityName;
            }
            this.setData({
                show: false,
            });
            this.setValue({value, cityCode, cityName});
            this.triggerEvent("formitemchange", this.data.innerValue, {
                bubbles: true,
                composed: true,
                capturePhase: true,
            });
            this.triggerEvent('onConfirm', {value, cityCode, cityName})
        },
    },
    attached: function() {
        const { options, confirmBtnColor } = this.data;
        let dataOption = [];
        fetch('https://emsapi.58.com/api/ems/get/data?type=get&id=20210813000474').then((res: any) => {
            if (!res.data || !res.data.list['20210813000474']) {
                return;
            }
            dataOption = res.data.list['20210813000474'].regionData;
            if (Array.isArray(options) && options.length > 0) {
                dataOption = [...options];
            } 
            this.setData({
                dataOption: dataOption,
                cityOption: dataOption && dataOption[0]?.childs || [],  //市数据
                areaOption: dataOption[0]?.childs[0]?.childs || [],  //区数据
                confirmColor: confirmBtnColor,
            });
        });
        
    }
})