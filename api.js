export async function callData(method, ...args) {
    return await fetch(
        `/callData?method=${method}&args=${args != '' ? args.join('$') : null}`
    ).then((res) => res.json())
}

export async function encodeABI(method, ...args) {
    return await fetch(
        `/encodeABI?method=${method}&args=${args != '' ? args.join('$') : null}`
    ).then((res) => res.json())
}

export async function estimateGas(method, from, value, ...args) {
    console.log(args)
    return await fetch(
        `/estimateGas?method=${method}&from=${from}&value=${value}&args=${
            args != '' ? args.join('$') : null
        }`
    ).then((res) => res.json())
}

export async function contractAddress() {
    return await fetch(`/contractAddress`).then((res) => res.json())
}

export async function buildRequest(method, from, value, ...args) {
    let conAddr = await contractAddress()
    let txData = await encodeABI(method, ...args)
    let estimated = await estimateGas(method, from, value, ...args)
    if (estimated.error) {
        alert(estimated.error)
        throw new Error(estimated.error)
    }
    let chainId = 2304
    return {
        method: 'eth_sendTransaction',
        params: [
            {
                to: conAddr.data,
                from,
                value: '0x' + value.toString(16),
                data: txData.data,
                chainId: '0x' + chainId.toString(16),
            },
        ],
    }
}
