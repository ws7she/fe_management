export default {
    name: 'mainView',
    data () {
        return {
            username: '',
            path: {
                index: '/index',
            }
        }
    },
    components: {
        
    },
    watch: {
        
    },
    methods: {
        handleSelect(idx) {
            this.$router.push({
                name: idx
            })
        },
        logout() {}
    }
}