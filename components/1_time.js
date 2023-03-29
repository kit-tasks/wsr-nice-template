import { app } from '../app.js'
import { callData, buildRequest } from '../api.js'
export const time = {
    template: `
    <div>
        <div className="container mh">
            <div className="form-group">
                <p className="header"><strong>Управление временем</strong></p>
                <div className="rounded row-block">
                    <p><strong>Изменить time_dif</strong></p>
                    <div className="row">
                        <label htmlFor="" className="col-sm-3">time_start:</label>
                        <label htmlFor="" className="col-sm-4">{{time_start}}</label>
                    </div>
                    <div className="row">
                        <label htmlFor="" className="col-sm-3">time_now:</label>
                        <label htmlFor="" className="col-sm-4">{{time_now}}</label>
                    </div>
                    <div className="row">
                        <label htmlFor="" className="col-sm-3">time_system:</label>
                        <label htmlFor="" className="col-sm-4">{{time_system}}</label>
                    </div>
                    <div className="row">
                        <label htmlFor="" className="col-sm-3">time_dif:</label>
                        <label htmlFor="" className="col-sm-4">{{time_dif}}</label>
                    </div>
                    <div className="row mb">
                        <label htmlFor="" className="col-sm-3">state:</label>
                        <label htmlFor="" className="col-sm-4">{{state}}</label>
                    </div>
                    <button className="btn btn-primary" @click="getState()">call</button>
                </div>
                <div className="rounded row-block">
                    <p><strong>Изменить time_dif</strong></p>
                    <div className="row mb">
                        <label htmlFor="" className="col-sm-4">новое значение</label>
                        <div className="col-sm-8">
                            <input type="text" className="form-control" id="upDif_amount"/>
                        </div>
                    </div>
                    <button className="btn btn-danger" @click="upDif">send</button>
                </div>
            </div>
        </div>
    </div>
    `,
    data() {
        return {
            time_start: 0,
            time_now: 0,
            time_system: 0,
            time_dif: 0,
            state: 'not started',
        }
    },
    methods: {
        async getState() {
            let res = await callData('getState')
            // [this.time_start, this.time_now, this.time_system, this.time_dif, this.state] = res.data
            let [time_start, time_now, time_system, time_dif, state] = res.data
            this.time_start = time_start
            this.time_now = time_now
            this.time_system = time_system
            this.time_dif = time_dif
            switch (state) {
                case '1':
                    this.state = 'seed'
                    break
                case '2':
                    this.state = 'private'
                    break
                case '3':
                    this.state = 'public'
                    break
                default:
                    this.state = 'not started'
                    break
            }
        },
        async upDif() {
            let res = await buildRequest(
                'upDif',
                app.config.globalProperties.address,
                0,
                document.getElementById('upDif_amount').value
            )
            console.log(res)
            ethereum.request(res)
        },
    },
}
