import { callData } from './api.js'
import { personal } from './components/0_personal.js'
import { time } from './components/1_time.js'
import { token } from './components/2_token.js'
import { request } from './components/3_request.js'

const routes = [
    { path: '/', component: personal },
    { path: '/time', component: time },
    { path: '/token', component: token },
    { path: '/request', component: request },
]

const router = VueRouter.createRouter({
    history: VueRouter.createWebHashHistory(),
    routes,
})

export const app = Vue.createApp({})
app.use(router)
app.mount('#app')

let value
app.config.globalProperties.status = '4' // 4 - notAuth, 0 - owner, 1 - private, 2 - public, 3 - else
app.config.globalProperties.key = value

login()

ethereum.on('accountsChanged', (accounts) => {
    login()
})

async function login() {
    let res = await ethereum.request({
        method: 'eth_requestAccounts',
    })
    app.config.globalProperties.address = res[0]
    let res2 = await callData('getRoleID', res[0])
    app.config.globalProperties.status = res2.data
}
