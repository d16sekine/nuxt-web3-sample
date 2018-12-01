<template>
 

  <el-container>
  <el-header>
    <h2 class="title">XDS-wallet-app</h2>
  </el-header>
  <el-main>
    <p>Coinbase Address</p>
    <el-input placeholder=""  v-model="addrCoinbase"  :disabled="true"></el-input>
    <p>Token Contract Address</p>
    <el-input placeholder=""  v-model="tokenContract"  :disabled="true"></el-input>
    <hr />
    <p>Total supply</p>
    {{totalSupply}} XDS
    <hr />
    <p>Target Address</p>
    <el-input v-model="targetAddress" placeholder="Please input XDS Address"></el-input>
    <p>{{balance}}</P>
     <el-button @click="getAmount" type="primary">GET Balance</el-button>
    <hr />
     <p>Sender Address</p>
    <el-input v-model="addrSender" placeholder="Please input XDS Address"></el-input>

    <p>Receiver Address</p>
    <el-input v-model="addrReceiver" placeholder="Please input XDS Address"></el-input>
    <p>XDS amount</p>
    <el-input v-model="amountTransfer" placeholder="Please input XDS Amount"></el-input>
    <p>Your Password</p>
    <el-input v-model="passwordSender" placeholder="Please Your Password"></el-input>
    <el-button @click="transferFromXDS" type="primary">SEND(transferFrom)</el-button>
    <el-button @click="transferXDS" type="primary">SEND(transfer)</el-button> 
  </el-main>
  </el-container> 
     
</template>

<script>
import Web3 from 'web3'
const MyToken = require("~/static/token/MyToken.json")
const tokenAddress = "0x6dc9d424b5514f249c73093295917440a1614474";
const web3 = new Web3('http://localhost:8545');

export default {
   
  async asyncData(){    
    
    //coinbase
    let addrCoinbase =  await web3.eth.getCoinbase();

    //token info
    let myContract =  await new web3.eth.Contract(MyToken.abi, tokenAddress);
    let totalSupply = await myContract.methods.totalSupply().call();
    //console.log("totalSupply:", totalSupply);

    return {
      addrCoinbase: addrCoinbase,
      tokenContract: tokenAddress,
      totalSupply: totalSupply,
      addrSender: addrCoinbase,
      addrReceiver: "0xa4a717ab24c148428180ae28a8947802c6ddfe71", //一時的に
      amountTransfer: 2,
      passwordSender: "",
      targetAddress: ""
    }
  },

  methods: {
    async getAmount(){

      if(this.targetAddress == ""){
        alert("XDSアドレスを入力してください！");
        return;
      }

      let myContract =  await new web3.eth.Contract(MyToken.abi, tokenAddress);
      console.log("targetAddress:", this.targetAddress);
      let balance = await myContract.methods.balanceOf(this.targetAddress).call();
      console.log("balance of XDS:", balance);
      this.$store.commit('setAmountToStore', balance);
    },

    async transferFromXDS(){

      let myContract =  await new web3.eth.Contract(MyToken.abi, tokenAddress);

      await web3.eth.personal.unlockAccount(this.addrSender, this.passwordSender, 1000);

      let transfer = await myContract.methods.transferFrom(this.addrSender, this.addrReceiver, this.amountTransfer)
      .send({from: this.addrSender});
    
      console.log("transfer:", transfer);
    },

    async transferXDS(){

      let coinbasePassword = "";

      let myContract =  await new web3.eth.Contract(MyToken.abi, tokenAddress);

      await web3.eth.personal.unlockAccount(this.addrCoinbase, this.coinbasePassword, 1000);

      let transfer = await myContract.methods.transfer(this.addrReceiver, this.amountTransfer)
      .send({from: this.addrCoinbase});
    
      console.log("transfer:", transfer);
    }
  },

  computed: {
    balance() {
       return this.$store.state.wallet.amount
    }
  }


}
</script>

<style>
.container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: "Quicksand", "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; /* 1 */
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.title {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>

