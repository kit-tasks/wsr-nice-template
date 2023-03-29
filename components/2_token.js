import { app } from '../app.js'
import { callData, buildRequest } from '../api.js'
export const token = {
    template: `
    <div>
        <div className="container mh">
            <div className="form-group">
                <p className="header"><strong>Управление токеном</strong></p>
                <div className="rounded row-block">
                    <p><strong>Узнать баланс</strong></p>
                    <div className="row mb">
                        <label className="col-sm-2">Баланс:</label>
                        <label className="col-sm-4">{{balance}}</label>
                    </div>
                    <button className="btn btn-primary" @click="balanceOf()">call</button>
                </div>
                <div className="rounded row-block">
                    <p><strong>Перевести</strong></p>
                    <div className="row mb">
                        <label className="col-sm-4">Адрес получателя</label>
                        <div className="col-sm-8"><input className="form-control" type="text" id="transfer_to"/></div>
                    </div>
                    <div className="row mb">
                        <label className="col-sm-4">Сумма отправления</label>
                        <div className="col-sm-8"><input className="form-control" type="text" id="transfer_amount"/></div>
                    </div>
                    <button className="btn btn-danger" @click="transfer">send</button>
                </div>
                <div className="rounded row-block">
                    <p><strong>Перевести с доверенного адреса</strong></p>
                    <div className="row mb">
                        <label className="col-sm-4">Адрес доверителя</label>
                        <div className="col-sm-8"><input className="form-control" type="text" id="transferFrom_from"/></div>
                    </div>
                    <div className="row mb">
                        <label className="col-sm-4">Адрес получателя</label>
                        <div className="col-sm-8"><input className="form-control" type="text" id="transferFrom_to"/></div>
                    </div>
                    <div className="row mb">
                        <label className="col-sm-4">Сумма отправления</label>
                        <div className="col-sm-8"><input className="form-control" type="text" id="transferFrom_amount"/></div>
                    </div>
                    <button className="btn btn-danger" @click="transferFrom()">send</button>
                </div>
                <div className="rounded row-block">
                    <p><strong>Доверить сумму</strong></p>
                    <div className="row mb">
                        <label className="col-sm-4">Адрес расточителя</label>
                        <div className="col-sm-8"><input className="form-control" type="text" id="approve_spender"/></div>
                    </div>
                    <div className="row mb">
                        <label className="col-sm-4">Сумма для трат</label>
                        <div className="col-sm-8"><input className="form-control" type="text" id="approve_amount"/></div>
                    </div>
                    <button className="btn btn-danger" @click="approve()">send</button>
                </div>
                <div className="rounded row-block">
                    <p><strong>Купить CMON</strong></p>
                    <div className="row mb">
                        <label className="col-sm-4">Желаемое количество CMON</label>
                        <div className="col-sm-8"><input className="form-control" type="text" id="buy_amount"/></div>
                    </div>
                    <button className="btn btn-danger" @click="buy()">send</button>
                </div>
            </div>
        </div>
    </div>
    `,
    // форма функции send (div>(strong+p>((li.arg+input)*2+button)))
    // форма функции get div>(strong+(p>button)+p)
    data() {
        return {
            balance: 0,
        }
    },
    methods: {
        async balanceOf() {
            let res = await callData(
                'balanceOf',
                app.config.globalProperties.address
            )
            this.balance = res.data
        },
        async transfer() {
            let res = await buildRequest(
                'transfer',
                app.config.globalProperties.address,
                0,
                document.getElementById('transfer_to').value,
                document.getElementById('transfer_amount').value
            )
            console.log(res)
            ethereum.request(res)
        },
        async transferFrom() {
            let res = await buildRequest(
                'transferFrom',
                app.config.globalProperties.address,
                0,
                document.getElementById('transferFrom_from').value,
                document.getElementById('transferFrom_to').value,
                document.getElementById('transferFrom_amount').value
            )
            console.log(res)
            ethereum.request(res)
        },
        async approve() {
            let res = await buildRequest(
                'approve',
                app.config.globalProperties.address,
                0,
                document.getElementById('approve_spender').value,
                document.getElementById('approve_amount').value
            )
            console.log(res)
            ethereum.request(res)
        },
        async buy() {
            let res = await buildRequest(
                'buy',
                app.config.globalProperties.address,
                0,
                document.getElementById('buy_amount').value
            )
            console.log(res)
            ethereum.request(res)
        },
    },
}
