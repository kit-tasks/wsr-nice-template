import { app } from '../app.js'
import { callData, buildRequest } from '../api.js'

export const personal = {
    template: `
    <div>
        <div className="container mh">
            <div className="form-group">
                <div className="row">
                    <p className="header"><strong>{{header_name}}</strong></p>
                </div>
                <div v-if="status==4" className="row">
                    <button className="btn btn-primary">Log in via Metamask</button>
                </div>
                <div v-if="status==1" className="row">
                    <div className="form-group">
                        <div className="rounded row-block">
                            <p><strong>Запустить контракт</strong></p>
                            <button className="btn btn-danger" @click="init()">send</button>
                        </div>
                        <div className="rounded row-block">
                            <p><strong>Узнать баланс</strong></p>
                            <div className="row">
                                <label className="col-sm-4">Адрес пользователя</label>
                                <div className="col-sm-8">
                                    <input type="text" className="form-control"  id="balanceOf_userAddr"/>
                                </div>
                            </div>
                            <div className="row mb">
                                <label className="col-sm-2">Баланс:</label>
                                <label className="col-sm-8">{{user_balance}}</label></div>
                            <button className="btn btn-primary" @click="balanceOf()">call</button>
                        </div>
                    </div>
                </div>
                <div v-if="status==2" className="row">
                    <div className="form-group">
                        <div className="rounded row-block">
                            <p><strong>Получить запросы на инвестирование</strong></p>
                            <button className="btn btn-primary" @click="getRequests()">call</button>
                        </div>
                        <div v-for="item in requests" className="rounded row-block">
                            <div className="row">
                                <label className="col-sm-2">id:</label>
                                <label className="col-sm-8">{{item[0]}}</label></div>
                            <div className="row">
                                <label className="col-sm-2">name:</label>
                                <label className="col-sm-8">{{item[1]}}</label></div>
                            <div className="row">
                                <label className="col-sm-2 mb">address:</label>
                                <label className="col-sm-8">{{item[2]}}</label></div>
                            <button className="btn btn-primary col-sm-2 mr" @click="answerRequest(item[0], true)">accept</button>
                            <button className="btn btn-danger col-sm-2" @click="answerRequest(item[0], false)">reject</button>
                        </div>
                    </div>
                </div>
                <div v-if="status==3" className="row">
                    <div className="form-group">
                        <div className="row-block">
                            <p><strong>Наградить токенами CMON</strong></p>
                            <div className="row mb  ">
                                <label className="col-sm-4">Адрес получателя</label>
                                <div className="col-sm-8">
                                    <input type="text" className="form-control col-sm-8" id="reward_to"/></div>
                                </div>
                            <div className="row mb">
                                <label className="col-sm-4">Сумма получения</label>
                                <div className="col-sm-8">
                                    <input type="text" className="form-control" id="reward_amount"/>
                                </div>
                            </div>
                            <button className="btn btn-danger" @click="reward()">send</button>
                        </div>
                    </div>
                </div>
                <div v-if="status==0    " className="row">
                    <p className="header">Личный кабинет для пользователя недоступен</p>
                </div>
            </div>
        </div>
    </div>
    `,
    data() {
        return {
            header_name: '',
            status: 0,
            address: '',
            user_balance: 0,
            requests: [[1, 'Vasya', 'very-long-address']],
        }
    },
    methods: {
        async login() {
            let res = await ethereum.request({
                method: 'eth_requestAccounts',
            })
            this.address = res[0]
            app.config.globalProperties.address = this.address
            let res2 = await callData('getRoleID', res[0])
            this.status = res2.data
            app.config.globalProperties.status = this.status
        },
        // owner
        async init() {
            let res = await buildRequest(
                'init',
                app.config.globalProperties.address,
                0
            )
            console.log(res)
            ethereum.request(res)
        },
        async balanceOf() {
            let res = await callData(
                'balanceOf',
                document.getElementById('balanceOf_userAddr').value
            )
            this.user_balance = res.data
        },
        // private
        async getRequests() {
            let res = await callData('getRequests')
            this.requests = res.data
        },
        async answerRequest(reqID, status) {
            let res = await buildRequest(
                'answerRequest',
                app.config.globalProperties.address,
                0,
                reqID,
                status
            )
            console.log(reqID, status)
            console.log(res)
            ethereum.request(res)
        },
        // public
        async reward() {
            let res = await buildRequest(
                'reward',
                app.config.globalProperties.address,
                0,
                document.getElementById('reward_to').value,
                document.getElementById('reward_amount').value
            )
            console.log(res)
            ethereum.request(res)
        },
        // utility
        calcHeader() {
            console.log(this.status)
            switch (this.status) {
                case '4':
                    this.header_name = 'Личный кабинет'
                    break
                case '1':
                    this.header_name = 'Личный кабинет Owner'
                    break
                case '2':
                    this.header_name = 'Личный кабинет Private'
                    break
                case '3':
                    this.header_name = 'Личный кабинет Public'
                    break
                case '0':
                    this.header_name = 'Личный кабинет User'
                    break
                default:
                    console.log(this.status)
            }
        },
    },
    async mounted() {
        this.address = app.config.globalProperties.address
        this.status = app.config.globalProperties.status
        await this.login()
        ethereum.on('accountsChanged', async (accounts) => {
            await this.login()
            this.calcHeader()
        })
        this.calcHeader()
    },
}
