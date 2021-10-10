Component({
    options : {
        multipleSlots: true,
        addGlobalClass: true,
    },
    relations: {
        '../form/form': {
          type: 'ancestor',
          linked(target) {
            this.setData({
              _formTarget: target,
            });
          },
        }
    },
    externalClasses:['won-we-class'],
    properties : {
        type:{
            type: String,
            value: 'default',
        },
        size: {
            type: String,
            value: 'normal',
        },
        icon: String,
        shape:{
            type: String,
            value:'round',
        },
        disabled: {
            type: Boolean,
            value: false,
        },
        loading: {
            type: Boolean,
            value: false,
        },
        formType: {
            type: String,
            value: '',
        },
        openType: {
            type: String,
            value: '',
        },
        hoverClass: {
            type: String,
            value: 'default',
        },
        hoverStopPropagation: {
            type: Boolean,
            value: false,
        },
        hoverStartTime: {
            type: Number,
            value: 20,
        },
        hoverStayTime: {
            type: Number,
            value: 70,
        },
        lang: {
            type: String,
            value: 'en',
        },
        sessionFrom: {
            type: String,
            value: '',
        },
        sendMessageTitle: {
            type: String,
            value: '',
        },
        sendMessagePath: {
            type: String,
            value: '',
        },
        sendMessageImg: {
            type: String,
            value: '',
        },
        showMessageCard: {
            type: Boolean,
            value: false,
        },
        appParameter: {
            type: String,
            value: '',
        },
    },
    methods: {
        bindtap() {
            if (!this.data.disabled && !this.data.loading) {
                const { formType, _formTarget } = this.data
                if (typeof formType == 'string' && ['submit', 'reset'].includes(formType)) { //提交 重置
                    _formTarget[formType]()
                } else {
                    this.triggerEvent('click')
                }
            }
        },
        bindgetuserinfo(e) {
            this.triggerEvent('getuserinfo', e.detail)
        },
        bindcontact(e) {
            this.triggerEvent('contact', e.detail)
        },
        bindgetphonenumber(e) {
            this.triggerEvent('getphonenumber', e.detail)
        },
        bindopensetting(e) {
            this.triggerEvent('opensetting', e.detail)
        },
        binderror(e) {
            this.triggerEvent('error', e.detail)
        },
        bindlaunchapp(e){
            this.triggerEvent('launchapp', e.detail)
        }
    },
})
