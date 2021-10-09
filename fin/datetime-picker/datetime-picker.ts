/*
 * @Author: huoyuhuan
 * @Date: 2021-06-02 17:51:58
 * @LastEditTime: 2021-06-02 20:11:47
 * @LastEditors: huoyuhuan
 * @Description: 日期时间选择组件
 */
import fieldItem from "../utils/behavior/field-item";
interface IDateProps {
    mode?: string,
}

Component({
    behaviors: [fieldItem, "wx://form-field"],
    relations: {
        "../field/field": {
        type: "parent",
        },
    },
    externalClasses: ['won-we-datetime'],
    properties: {
        value: {
            type: null,
            value: null,
        },
        mode: {
            type: String,
            value: 'datetime',
        },
        minDate: {
            type: null,
            value: null,
        },
        maxDate: {
            type: null,
            value: null,
        },
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
    data: {
        inputValue: [],
        cols: [],
        minHour: 0,
        maxHour: 23,
        minMinute: 0,
        maxMinute: 59,
        oneDay: 24 * 60 * 60 * 1000
    },
    observers: {
        value(value: string | Array<string> | null) {
            const { mode } = this.data;
            let date = new Date();
            let inputValue = [];
            if (mode === 'time') {
                const year = date.getFullYear();
                const month = date.getMonth();
                const day = date.getDate();
                if (typeof value === 'string') {
                    date = !!value && new Date(year + '-'+ month + '-' + day + '-' + value);
                    inputValue = [date.getHours() + '', date.getMinutes() + ''];
                } else {
                    inputValue = value;
                }
                
            } else {
                if (typeof value === 'string') {
                    date = !!value && new Date(value);
                    inputValue = [date.getFullYear() + '', date.getMonth() + '', date.getDate() + '', date.getHours() + '', date.getMinutes() + ''];
                } else {
                    inputValue = [...value];
                    inputValue[1] = (parseInt(inputValue[1]) - 1) + '';
                }
                
            }
            console.log('inputValue', inputValue);
            this.updatedCols(inputValue);
        }
    },
    methods: {
        /****
         * 根据入参min，max，step，输出min~max之间的数组
         */
        fomartArray(min: number, max: number, step = 1) {
            let i = min;
            let result = [];
            while (i <= max) {
                result.push(i)
                i += step
            };
            return result;
        },

        /****
         * 返回入参date中月的天数
         */
        getDaysInMonth(date: Date) {
            return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
        },

        pad(n: number) {
            return n < 10 ? `0${n}` : n + '';
        },
        /****
         * 规范时间格式
         */
        cloneDate(date: Date) {
            return new Date(+date);
        },

        setMonth(date: Date, month: number) {
            date.setDate(Math.min(date.getDate(), this.getDaysInMonth(new Date(date.getFullYear(), month))));
            date.setMonth(month);
        },
        /****
         * 把入参value根据mode返回new Date()
         */
        valueToDate(value: string | number | Array<string | number>, props: IDateProps = {}) {
            if (!Array.isArray(value)) {
                if (typeof value === 'string') {
                    value = value.replace(/\-/g, '/');
                }
                if (!isNaN(Number(value))) {
                    value = Number(value);
                }
                return new Date(value);
            }

            const { mode } = props;
            const now = new Date();
            const year = now.getFullYear();
            const month = now.getMonth();
            const day = now.getDate();
            const newValue = value.map((v) => Number(v));
            if (mode === 'time') {
                newValue.unshift(day);
                newValue.unshift(month);
                newValue.unshift(year);
            } else if (mode === 'month') {
                newValue.push(day);
            } else if (mode === 'year') {
                newValue.push(month);
                newValue.push(day);
            }
            while (newValue.length <= 6) {
                newValue.push(0);
            }
            //  return new Date(...newValue)
            return new Date(newValue[0], newValue[1], newValue[2], newValue[3], newValue[4]);
        },
        /****
         * 获取最小日期
         */
        getMinDate() {
            return this.data.minDate ? this.valueToDate(this.data.minDate, this.data) : new Date(2000, 0, 1, 0, 0, 0);
        },
        /****
         * 获取最大日期
         */
        getMaxDate() {
            return this.data.maxDate ? this.valueToDate(this.data.maxDate, this.data) : new Date(2030, 11, 31, 23, 59, 59);
        },
        getDateMember(type = 'min', member = 'year') {
            const methods = {
                min: 'getMinDate',
                max: 'getMaxDate',
                year: 'getFullYear',
                month: 'getMonth',
                day: 'getDate',
                hour: 'getHours',
                minute: 'getMinutes',
            };
            return this[methods[type]]()[methods[member]]();
        },
        /****
         * 根据index更新values中对应列的数据
         */
        getNewDate(values: Array<string>, index:number) {
            const value = parseInt(values[index], 10);
            const { mode } = this.data;
            let newValue = this.cloneDate(this.getDate());
            if (mode === 'datetime' || mode === 'date' || mode === 'year' || mode === 'month') {
                switch (index) {
                    case 0:
                        newValue.setFullYear(value);
                        break;
                    case 1:
                        this.setMonth(newValue, value);
                        break;
                    case 2:
                        newValue.setDate(value);
                        break;
                    case 3:
                        newValue.setHours(value);
                        break;
                    case 4:
                        newValue.setMinutes(value);
                        break;
                    default:
                        break;
                }
            } else if (mode === 'time') {
                switch (index) {
                    case 0:
                        newValue.setHours(value);
                        break;
                    case 1:
                        newValue.setMinutes(value);
                        break;
                    default:
                        break;
                }
            }
            return this.clipDate(newValue);
        },
        /****
         * 判断date是否在最大日期和最小日期范围内，并返回在范围内的日期
         */
        clipDate(date: Date) {
            const { mode, oneDay } = this.data;
            const minDate = this.getMinDate();
            const maxDate = this.getMaxDate();
            if (mode === 'datetime') {
                if (date < minDate) {
                    return this.cloneDate(minDate);
                }
                if (date > maxDate) {
                    return this.cloneDate(maxDate);
                }
            } else if (mode === 'date' || mode === 'year' || mode === 'month') {
                if (+date + oneDay <= minDate) {
                    return this.cloneDate(minDate);
                }
                if (+date >= +maxDate + oneDay) {
                    return this.cloneDate(maxDate);
                }
            } else if (mode === 'time') {
                const maxHour = maxDate.getHours();
                const maxMinutes = maxDate.getMinutes();
                const minHour = minDate.getHours();
                const minMinutes = minDate.getMinutes();
                const hour = date.getHours();
                const minutes = date.getMinutes();
                if (hour < minHour || hour === minHour && minutes < minMinutes) {
                    return this.cloneDate(minDate);
                }
                if (hour > maxHour || hour === maxHour && minutes > maxMinutes) {
                    return this.cloneDate(maxDate);
                }
            }
            return date;
        },
        /****
         * 判断入参d是否存在，返回在范围内日期
         */
        getDate(d: Date) {
            const date = d ? d : (this.data.inputValue.length === 0 ? this.data.value: this.data.inputValue);
            return this.clipDate(date ? this.valueToDate(date, this.data) : this.getMinDate());
        },
        /****
         * 根据入参date，返回在范围内的数组数据[years, months, days]
         */
        getDateData(date: Date) {
            const { mode } = this.data;
            const selYear = date.getFullYear();
            const selMonth = date.getMonth();

            const minDateYear = this.getDateMember('min', 'year');
            const maxDateYear = this.getDateMember('max', 'year');
            const minDateMonth = this.getDateMember('min', 'month');
            const maxDateMonth = this.getDateMember('max', 'month');
            const minDateDay = this.getDateMember('min', 'day');
            const maxDateDay = this.getDateMember('max', 'day');

            const years = this.fomartArray(minDateYear, maxDateYear).map((i) => ({
                value: i + '',
                label: i + '',
            }));

            if (mode === 'year') {
                return [years];
            }

            const minMonth = minDateYear === selYear ? minDateMonth : 0;
            const maxMonth = maxDateYear === selYear ? maxDateMonth : 11;
            const months = this.fomartArray(minMonth, maxMonth).map((i: number) => ({
                value: i + '',
                label: i + 1 + '',
            }));

            if (mode === 'month') {
                return [years, months];
            }

            const minDay = minDateYear === selYear && minDateMonth === selMonth ? minDateDay : 1;
            const maxDay = maxDateYear === selYear && maxDateMonth === selMonth ? maxDateDay : this.getDaysInMonth(date);

            const days = this.fomartArray(minDay, maxDay).map((i: number) => ({
                value: i + '',
                label: i + '',
            }));

            return [years, months, days];
        },
        /****
         * 根据入参date，返回在范围内的数组数据[hours, minutes]
         */
        getTimeData(date: Date) {
            let { minHour, maxHour, minMinute, maxMinute } = this.data;
            const { mode } = this.data;
            const minDateMinute = this.getDateMember('min', 'minute');
            const maxDateMinute = this.getDateMember('max', 'minute');
            const minDateHour = this.getDateMember('min', 'hour');
            const maxDateHour = this.getDateMember('max', 'hour');
            const hour = date.getHours();

            if (mode === 'datetime') {
                const year = date.getFullYear();
                const month = date.getMonth();
                const day = date.getDate();
                const minDateYear = this.getDateMember('min', 'year');
                const maxDateYear = this.getDateMember('max', 'year');
                const minDateMonth = this.getDateMember('min', 'month');
                const maxDateMonth = this.getDateMember('max', 'month');
                const minDateDay = this.getDateMember('min', 'day');
                const maxDateDay = this.getDateMember('max', 'day');
                if (minDateYear === year && minDateMonth === month && minDateDay === day) {
                    minHour = minDateHour;
                    if (minDateHour === hour) {
                        minMinute = minDateMinute;
                    }
                }
                if (maxDateYear === year && maxDateMonth === month && maxDateDay === day) {
                    maxHour = maxDateHour;
                    if (maxDateHour === hour) {
                        maxMinute = maxDateMinute;
                    }
                }
            } else {
                minHour = minDateHour;
                if (minDateHour === hour) {
                    minMinute = minDateMinute;
                }
                maxHour = maxDateHour;
                if (maxDateHour === hour) {
                    maxMinute = maxDateMinute;
                }
            }

            let hours = [];
            hours = [...hours, ...this.fomartArray(minHour, maxHour).map((i: number) => ({
                value: i + '',
                label: this.pad(i),
            }))];

            const minutes = [];
            const selMinute = date.getMinutes();
            for (let i = minMinute; i <= maxMinute; i += 1) {
                minutes.push({
                    value: i + '',
                    label: this.pad(i),
                });
                if (selMinute > i && selMinute < i + 1) {
                    minutes.push({
                        value: selMinute + '',
                        label: this.pad(selMinute),
                    });
                }
            }
            return [hours, minutes];
        },
        /****
         * 根据入参d，返回在范围内的数组数据cols和当前选中value
         */
        getValueCols(d: Date) {
            const { mode } = this.data;
            const date = this.getDate(d);
            let cols = [];
            let value = [];

            if (mode === 'year') {
                return {
                    cols: this.getDateData(date),
                    value: [date.getFullYear() + ''],
                };
            }

            if (mode === 'month') {
                return {
                    cols: this.getDateData(date),
                    value: [date.getFullYear() + '', date.getMonth() + ''],
                };
            }

            if (mode === 'datetime' || mode === 'date') {
                cols = this.getDateData(date)
                value = [date.getFullYear() + '', date.getMonth() + '', date.getDate() + '']
            }

            if (mode === 'datetime' || mode === 'time') {
                cols = cols.concat(this.getTimeData(date));
                const hour = date.getHours();
                const selMinute = date.getMinutes();
                let dtValue = [hour + '', selMinute + ''];
                value = value.concat(dtValue);
            }

            return {
                value,
                cols,
            }
        },
        /****
         * 选项改变时触发
         */
        onValueChange(e: any) {
            const index = e.detail.index;
            const value = e.detail.selectValue;
            const newDate = this.getNewDate(value, index);
            const { value: newValue, cols: newCols } = this.getValueCols(newDate);
            this.setData({
                inputValue: newValue,
                cols: newCols,
            });
        },
        updatedCols(inputValue: Array<string>) {
            const { value: newValue, cols: newCols } = this.getValueCols(inputValue);
            console.log('cols', newValue, newCols);
            this.setData({
                cols: newCols,
                inputValue: newValue
            });
        },
        // 点击确定按钮时触发
        onConfirm () {
            const { mode } = this.data;
            let current = [...this.data.inputValue];
            if (mode !== 'time' || mode === 'year') {
                current[1] = (parseInt(current[1]) + 1).toString();
            }
            this.setValue(current);
            this.triggerEvent("formitemchange", current, {
                bubbles: true,
                composed: true,
                capturePhase: true,
            });
            this.triggerEvent('onConfirm', current);
        }
    },
    attached() {
        // 如果value没有赋初值，根据mode设置初值
        const date = new Date();
        let { mode, inputValue, value }  = this.data;
        inputValue = [date.getFullYear() + '', date.getMonth() + '', date.getDate() + '', date.getHours() + '', date.getMinutes() + ''];
        this.selectComponent('#datetime-picker').changeFlag();
        if (!value) {
            if (mode === 'time') {
                inputValue = inputValue.slice(3);
            }
            this.updatedCols(inputValue);
        }
    }
})

