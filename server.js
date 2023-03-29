const express = require('express')
const { abi } = require('./bin/contracts/CMON.json')
const web3 = require('./web3')
const deploy = require('./deploy')
const app = express()

let contract
let contractAddress
deploy().then((addr) => {
    console.log('ready', addr.toString())
    contract = new web3.eth.Contract(abi, addr.toString())
    contractAddress = addr.toString()
})

function parseArg(rowArgs) {
    if (rowArgs == 'null') {
        return 'null'
    } else {
        let args = rowArgs.split('$')
        args.forEach((arg) => {
            if (arg == 'true' || arg == 'false') {
                return Boolean(arg)
            }
        })
        return args
    }
}

app.get('/', (req, res) => {
    try {
        res.sendFile(`${__dirname}/index.html`)
    } catch (e) {
        console.log(e)
        res.end(e)
    }
})

app.get('/callData', async (req, res) => {
    let body = {}
    try {
        const { method, args } = req.query
        const myMethod =
            args == 'null'
                ? contract.methods[method]()
                : contract.methods[method](...args.split('$'))
        const callData = await myMethod.call()
        body = { data: callData }
    } catch (e) {
        console.log(e)
        body = { error: e }
    }
    res.json(body)
})

app.get('/encodeABI', async (req, res) => {
    let body = {}
    try {
        const { method, args } = req.query
        const parsedArgs = parseArg(args)
        console.log(parsedArgs)
        const myMethod =
            parsedArgs == 'null'
                ? contract.methods[method]()
                : contract.methods[method](...parsedArgs)
        txData = myMethod.encodeABI()
        body = { data: txData }
    } catch (e) {
        console.log(e)
        body = { error: e.message }
    }
    res.json(body)
})

app.get('/estimateGas', async (req, res) => {
    let body = {}
    try {
        const { method, from, value, args } = req.query
        const parsedArgs = parseArg(args)
        const myMethod =
            parsedArgs == 'null'
                ? contract.methods[method]()
                : contract.methods[method](...parsedArgs)
        await myMethod.estimateGas({ from, value }).catch(function (e) {
            body = { error: e.message }
        })
    } catch (e) {
        console.log(e)
        body = { error: e.message }
    }
    res.json(body)
})
app.get('/contractAddress', async (req, res) => {
    try {
        res.json({ data: contractAddress })
    } catch (e) {
        console.log(e)
        res.json({ error: e })
    }
})

app.get('/*', (req, res) => {
    try {
        res.sendFile(`${__dirname}/${req.url}`)
    } catch (e) {
        console.log(e)
        res.end(e)
    }
})

app.listen(8888)
