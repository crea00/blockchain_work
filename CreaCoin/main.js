// npm install --save crypto-js 명령어를 사용해서 설치
const SHA256 = require('crypto-js/sha256')

class Transaction{
    constructor(fromAddress, toAddress, amount){
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}

class Block{
    constructor(timestamp, transactions, previoushash = ''){
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previoushash = previoushash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash(){
        return SHA256(this.index + this.previoushash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }

    mineBlock(difficulty){
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")){
            this.nonce++;
            this.hash = this.calculateHash();
        } 

        console.log("BLOCK MINED : " + this.hash);
    }
}

// 비트코인의 경우 블록의 해쉬값에 일정한 양의 0을 필요로함


class Blockchain{
    constructor(){
        // array of Blocks
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;
        this.pendingTransactions = [];
        this.miningReward = 100;

    }

    createGenesisBlock(){
        return new Block(Date.parse("2017-01-01"), [], "0");
    }

    getLatestBlock(){
        return this.chain[this.chain.length - 1];
    }

    minePendingTransactions(miningRewardAddress){
        let block = new Block(Date.now(), this.pendingTransactions, this.getLatestBlock().hash);
        block.mineBlock(this.difficulty);

        console.log('Block successfully mined!');
        this.chain.push(block);

        this.pendingTransactions = [
            new Transaction(null, miningRewardAddress, this.miningReward)
        ];
    }

    createTransaction(transaction){
        this.pendingTransactions.push(transaction);
    }

    getBalanceOfAddress(address){
        let balance = 0;

        for(const block of this.chain){
            for(const trans of block.transactions){
                if(trans.fromAddress === address){
                    balance -= trans.amount;
                }

                if(trans.toAddress === address){
                    balance += trans.amount;
                }
            }
        }

        return balance;
    }

    isChainValid(){
        // i=0일때는 Genesis block이므로 1부터 시작
        for(let i = 1; i < this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if(currentBlock.hash !== currentBlock.calculateHash()){
                return false;
            }

            if(currentBlock.previoushash !== previousBlock.hash){
                return false;
            }
        }

        return true;
    }
}



let creaCoin = new Blockchain();
creaCoin.createTransaction(new Transaction('address1', 'address2', 100));
creaCoin.createTransaction(new Transaction('address2', 'address1', 50));

console.log('\n Starting the miner...');
creaCoin.minePendingTransactions('crea-address');

console.log('\n Balance of crea is', creaCoin.getBalanceOfAddress('crea-address'));

console.log('\n Starting the miner again...');
creaCoin.minePendingTransactions('crea-address');

console.log('\n Balance of crea is', creaCoin.getBalanceOfAddress('crea-address'));



/*
console.log('Mining block 1...');
creaCoin.addBlock(new Block(1, "10/07/2017", { amout : 4}));

console.log('Mining block 2...');
creaCoin.addBlock(new Block(2, "12/07/2017", { amout : 10}));

console.log('Is blockchain valid?' + creaCoin.isChainValid());

//  첫번째 코인의 값을 변경하면
creaCoin.chain[1].data = { amout : 100 };
creaCoin.chain[1].hash = creaCoin.chain[1].calculateHash();
console.log('Is blockchain valid?' + creaCoin.isChainValid());

//console.log(JSON.stringify(creaCoin, null, 4));
*/