export default Behavior({
    data: {
        value: null
    },

    methods: {
        setValue(v) {
            this.setData({ value: v })
        },
        getValue() {
            return this.data.value
        }
    }
})