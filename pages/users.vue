<template>
 

  <el-container>
  <el-header>
    <h2 class="title">XDS-Wallet-App</h2>
  </el-header>
  <el-main>
    <p>Your XDS Address</p>
    <el-input placeholder=""  v-model="wallet.address"></el-input>
    <p>Your XDS Amount</p>
    <p>{{wallet.balance}}</P>
     <el-button @click="getAmount" type="primary">GET XDS Balance</el-button>
    <hr />
    <p>XDS amount</p>
    <el-input v-model="amountTransfer" placeholder="Please input XDS Amount"></el-input>
    <p>Receiver Address</p>
    <div>
    <el-input v-model="addrReceiver" placeholder="Please input XDS Address"></el-input>
    <el-button @click="handleQRCodeReader" type="primary">{{textButtonQRCodeReader}}</el-button>
    </div>
    <p>Your Password</p>
    <el-input v-model="passwordSender" placeholder="Please Your Password"></el-input>
    <el-button @click="transferXDS" type="primary">SEND XDS</el-button> 
    <div id="qrGenarate"> 
    <vue-q-art :config=config></vue-q-art>
  </div>
  <div class="qrReader">
    <qrcode-reader :paused="paused" @init="onInit" @decode="onDecode" v-if="!destroyed"></qrcode-reader>
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
const web3 = new Web3('ws://127.0.0.1:8888');

export default {

  middleware: 'auth-cookie',

  components: {
    VueQArt,
    QrcodeReader
  },

  data () {
      return {
        paused: false,
        destroyed: true
      }
    },
   
  async asyncData(context){
     
    let wallet = context.store.getters["wallet"];

    let yourAddress = wallet.address;

    return {
      addrReceiver: "",
      amountTransfer: 2,
      passwordSender: "",
      textButtonQRCodeReader:"QR Code Reader:ON"
    }
  },

  methods: {
    async getAmount(){

      let myContract =  await new web3.eth.Contract(MyToken.abi, tokenAddress);
      console.log("targetAddress:", this.wallet.address);
      let balanceXDS = await myContract.methods.balanceOf(this.wallet.address).call();
      let balanceETH = await web3.eth.getBalance(this.wallet.address);
      console.log("balance of XDS:", balanceXDS);
      console.log("balance of ETH:", balanceETH);
      this.$store.commit('setBalanceToStore', balanceXDS);
    },

    async transferXDS(){

      let coinbasePassword = "";

      try{

        let myContract = await new web3.eth.Contract(MyToken.abi, tokenAddress);

        let estimatedGas = await myContract.methods.transfer(this.addrReceiver, this.amountTransfer).estimateGas();

        console.log("estimatedGas:",estimatedGas);

        //gas代をcoinbaseから取得
        let addrCoinbase =  await web3.eth.getCoinbase();
        let valueEthWei = estimatedGas * 10000000000;
        let addrSender = this.wallet.address;

        await web3.eth.personal.unlockAccount(addrCoinbase, coinbasePassword, 1000);
        let result_eth = await web3.eth.sendTransaction({from: addrCoinbase, to: addrSender, value: valueEthWei});

        console.log("result_eth:", result_eth);

        //XDS送金

        await web3.eth.personal.unlockAccount(addrSender, this.passwordSender, 1000);
        let transfer = await myContract.methods.transfer(this.addrReceiver, this.amountTransfer)
        .send({from: addrSender});

        console.log("transfer:", transfer);

      }catch(err){
        alert("Error!")
      }
    
      return;
    },
    async handleQRCodeReader(){
      if(this.destroyed){
        this.destroyed = false
        this.textButtonQRCodeReader = "QR Code Reader:OFF"
      }else{
        this.destroyed =  true
        this.textButtonQRCodeReader = "QR Code Reader:ON"
      }

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
      onDecode(decodeString){
        this.paused = true
        alert(decodeString)
        this.addrReceiver = decodeString
        //読み取ったらQRcode Readerを破棄する
        this.destroyed = true
      }
  
  },

  computed: {
    wallet: function(){
     return this.$store.state.wallet
    },
    config: function(){ //QRコード生成を動的に処理
      return{
        value: this.wallet.address, 
        imagePath: "/XDS195.png",
        filter: "color",
      }
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

