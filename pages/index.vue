<template>
 

  <el-container>
  <el-header>
    <h2 class="title">XDS-wallet-app</h2>
  </el-header>
  <el-main>
    <p>Token Contract Address</p>
    <el-input placeholder=""  v-model="tokenContract"  :disabled="true"></el-input>
    <hr />
    <p>Total supply</p>
    {{totalSupply}} XDS
    <hr />
    <p>Your XDS Address</p>
    <p>{{address}}</P>
    <el-button @click="createQRCode" type="primary">QRコード</el-button> 
    <p>{{balance}}</P>
     <el-button @click="getAmount" type="primary">GET XDS Balance</el-button>
    <hr />
    <p>XDS amount</p>
    <el-input v-model="amountTransfer" placeholder="Please input XDS Amount"></el-input>
    <p>Receiver Address</p>
    <el-input v-model="addrReceiver" placeholder="Please input XDS Address"></el-input>
  
    <p>Your Password</p>
    <el-input v-model="passwordSender" placeholder="Please Your Password"></el-input>
    <el-button @click="transferXDS" type="primary">SEND XDS</el-button> 
    <div id="qrGenarate"> 
    <vue-q-art :config=config></vue-q-art>
  </div>
  <div class="qrReader">
    <qrcode-reader :paused="paused" @init="onInit" @decode="onDecode"></qrcode-reader>
  </div>
  </el-main>
  </el-container> 
     
</template>

<script>
import Web3 from 'web3'
import VueQArt from 'vue-qart'
import { QrcodeReader } from 'vue-qrcode-reader'

const MyToken = require("~/static/token/MyToken.json")
const tokenAddress = "0x6dc9d424b5514f249c73093295917440a1614474";
const web3 = new Web3('http://localhost:8545');

export default {

  components: {
    VueQArt,
    QrcodeReader
  },

  data () {
      return {
        paused: false
      }
    },
   
  async asyncData(context){

    //coinbase
    let addrCoinbase = "";
    let totalSupply = 0;
    
    //token info
    let myContract =  await new web3.eth.Contract(MyToken.abi, tokenAddress);

    try{
      addrCoinbase =  await web3.eth.getCoinbase();
      totalSupply = await myContract.methods.totalSupply().call();
    }catch(err){
      console.log("err:", err);
    }
     
    //console.log("totalSupply:", totalSupply);

    let yourAddress = "0x1ac995f1e67ce3b0b66064b24669b26124db7e1e";

    context.store.commit('setAddressToStore', yourAddress);

    return {
      addrCoinbase: addrCoinbase,
      tokenContract: tokenAddress,
      totalSupply: totalSupply,
      addrSender: addrCoinbase,
      addrReceiver: "",
      amountTransfer: 2,
      passwordSender: "",
      config: {
        // valueにはinput v-modelにて動的に入力した値が設定されるため空文字を設定
        value: yourAddress, 
        imagePath: "/XDS195.png",
        filter: "color",
      }
    }
  },

  methods: {
    async getAmount(){

      let myContract =  await new web3.eth.Contract(MyToken.abi, tokenAddress);
      console.log("targetAddress:", this.targetAddress);
      let balanceXDS = await myContract.methods.balanceOf(this.targetAddress).call();
      let balanceETH = await web3.eth.getBalance(this.targetAddress);
      console.log("balance of XDS:", balanceXDS);
      console.log("balance of ETH:", balanceETH);
      this.$store.commit('setAmountToStore', balanceXDS);
    },

    async transferXDS(){

      let coinbasePassword = "";

      let myContract =  await new web3.eth.Contract(MyToken.abi, tokenAddress);


      let estimatedGas = await myContract.methods.transfer(this.addrReceiver, this.amountTransfer).estimateGas();

      console.log("estimatedGas:",estimatedGas);


      //gas代をcoinbaseから取得
      let valueEthWei = estimatedGas * 10000000000;

      await web3.eth.personal.unlockAccount(this.addrCoinbase, coinbasePassword, 1000);
      let result_eth = await web3.eth.sendTransaction({from: this.addrCoinbase, to: this.addrSender, value: valueEthWei});

      console.log("result_eth:", result_eth);

      //XDS送金
      await web3.eth.personal.unlockAccount(this.addrSender, this.passwordSender, 1000);
      let transfer = await myContract.methods.transfer(this.addrReceiver, this.amountTransfer)
      .send({from: this.addrSender});
    
      console.log("transfer:", transfer);

      return;
    },
    async createQRCode(){

      
      return;
    },

    async onInit (promise) {
        // show loading indicator
        try {
          await promise
          // successfully initialized
        } catch (error) {
          if (error.name === 'NotAllowedError') {
            // user denied camera access permisson
          } else if (error.name === 'NotFoundError') {
            // no suitable camera device installed
          } else if (error.name === 'NotSupportedError') {
            // page is not served over HTTPS (or localhost)
          } else if (error.name === 'NotReadableError') {
            // maybe camera is already in use
          } else if (error.name === 'OverconstrainedError') {
            // passed constraints don't match any camera. Did you requested the front camera although there is none?
          } else {
            // browser is probably lacking features (WebRTC, Canvas)
          }
        } finally {
          // hide loading indicator
        }
      },
      onDecode(content){
        this.paused = true
        alert(content)
      }
  
  },

  computed: {
    balance() {
       return this.$store.state.wallet.amount
    },
    address(){
       return this.$store.state.wallet.address
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

