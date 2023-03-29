cd geth && rd geth /q /s
cd ..
geth --datadir ./geth init ./geth/genesis.json
geth -datadir ./geth --networkid 2304 --http --http.addr 127.0.0.1 --http.port 8545 --http.api "web3, eth, personal, admin, net" --http.corsdomain "*" --allow-insecure-unlock --mine --miner.threads 2 console
exit
