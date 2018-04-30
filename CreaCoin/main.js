// npm install --save crypto-js 명령어를 사용해서 설치
const SHA256 = require('crypto-js/sha256')


class Block{
    constructor(index, timestamp, data, previoushash = ''){
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previoushash = previoushash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash(){
        return SHA256(this.index + this.previoushash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }

    mineBlock(difficulty){
        while(this.hash.substring(0,difficulty) !== Array(difficulty + 1).join("0")){
            this.nonce++;
            this.hash = this.calculateHash();
        } 

        console.log("Block mined : " + this.hash);
    }
}

// 비트코인의 경우 블록의 해쉬값에 일정한 양의 0을 필요로함


class Blockchain{
    constructor(){
        // array of Blocks
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 4;

    }

    createGenesisBlock(){
        return new Block(0, "01/01/2017/", "Genesis block", "0");
    }

    getLatestBlock(){
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock){
        newBlock.previoushash = this.getLatestBlock().hash;
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
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
console.log('Mining block 1...');
creaCoin.addBlock(new Block(1, "10/07/2017", { amout : 4}));

console.log('Mining block 2...');
creaCoin.addBlock(new Block(2, "12/07/2017", { amout : 10}));




/*
console.log('Is blockchain valid?' + creaCoin.isChainValid());

//  첫번째 코인의 값을 변경하면
creaCoin.chain[1].data = { amout : 100 };
creaCoin.chain[1].hash = creaCoin.chain[1].calculateHash();
console.log('Is blockchain valid?' + creaCoin.isChainValid());

//console.log(JSON.stringify(creaCoin, null, 4));
*/