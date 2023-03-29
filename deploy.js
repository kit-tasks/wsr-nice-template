const fs = require('fs')
const web3 = require('./web3')
const { abi, bytecode } = require('./bin/contracts/CMON.json')

async function deploy() {
    await web3.eth.personal.unlockAccount(
        '0x8a6Dc83c48829e6AA19bb457C7ADe3A83CbbDE40',
        '1111',
        9999999
    )
    let factory = new web3.eth.Contract(abi)
    let txHash
    await factory
        .deploy({
            data: bytecode,
        })
        .send(
            {
                from: '0x8a6Dc83c48829e6AA19bb457C7ADe3A83CbbDE40',
            },
            (err, _txHash) => {
                txHash = _txHash
            }
        )
    let receipt = await web3.eth.getTransactionReceipt(txHash)
    return receipt.contractAddress
}

module.exports = deploy
