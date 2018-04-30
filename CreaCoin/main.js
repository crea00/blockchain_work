// npm install --save crypto-js 명령어를 사용해서 설치
const SHA256 = require('crypto-js/sha256')


class Block{
    constructor(index, timestamp, data, previoushash = ''){
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previoushash = previoushash;
        this.hash = this.calculateHash();
    }


    calculateHash(){
        return SHA256(this.index + this.previoushash + this.timestamp + JSON.stringify(this.data)).toString();
    }
}


class Blockchain{
    constructor(){
        // array of Blocks
        this.chain = [this.createGenesisBlock()];

    }

    createGenesisBlock(){
        return new Block(0, "01/01/2017/", "Genesis block", "0");
    }

    getLatestBlock(){
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock){
        newBlock.previoushash = this.getLatestBlock().hash;
        newBlock.hash = newBlock.calculateHash();
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
creaCoin.addBlock(new Block(1, "10/07/2017", { amout : 4}));
creaCoin.addBlock(new Block(2, "12/07/2017", { amout : 10}));

console.log('Is blockchain valid?' + creaCoin.isChainValid());

//  첫번째 코인의 값을 변경하면
creaCoin.chain[1].data = { amout : 100 };
creaCoin.chain[1].hash = creaCoin.chain[1].calculateHash();
console.log('Is blockchain valid?' + creaCoin.isChainValid());




//console.log(JSON.stringify(creaCoin, null, 4));