<template>
 

  <el-container>
  <el-header>
    <h2 class="title">XDS-Wallet-App</h2>
  </el-header>
  <el-main>
    <div>
  <el-card class="box-card">
  <h1 class="center">XDS Address</h1>
  <el-input placeholder=""  v-model="wallet.address"></el-input>
  <div id="qrGenarate" class="center"> 
    <vue-q-art :config=config></vue-q-art>
  </div>
  
  </el-card>
  <el-card class="box-card">
    <div class="center"> 
      <h1>XDS Amount</h1>
    <h2>{{wallet.balance}}</h2>
     <el-button @click="getAmount" class="center" type="primary">UPDATE Your Balance</el-button>
    </div>
  </el-card>
  <el-card class="box-card">
  <h1 class="center">Transfer XDS</h1>
  <p>送金するXDS量</p>
  <div class="center">
    <!-- <el-input v-model="amountTransfer" placeholder="Please input XDS Amount"></el-input> -->
    <el-input-number v-model="amountTransfer" @change="handleChange" :min="0" :max="100" :step="1"></el-input-number>
    </div>
  <p>Receiver Address</p>
    <el-input v-model="addrReceiver" placeholder="Please input XDS Address"></el-input>
  <p>Your Password</p>
  <el-input v-model="passwordSender" placeholder="Please Your Password"></el-input>

  <div class="center">
  <el-button @click="transferXDS" type="primary" icon="el-icon-upload2">Transfer</el-button>
      </div>
  </el-card>
  <QrcodeForReceive />
  <QrcodeForAddress />
  <p>future works ...</P>

  <div class="qrReader">
    <qrcode-reader :paused="paused" @init="onInit" @decode="onDecode" v-if="!destroyed"></qrcode-reader>
  </div>
  <el-button @click="handleQRCodeReader" type="primary" disabled>{{textButtonQRCodeReader}}</el-button>
  </div>
  </el-main>
  </el-container> 
     
</template>

<script>
import Web3 from 'web3'
import VueQArt from 'vue-qart'
import { QrcodeReader } from 'vue-qrcode-reader'
import QrcodeForReceive from '~/components/QrcodeForReceive'
import QrcodeForAddress from '~/components/QrcodeForAddress'

const MyToken = require("~/static/token/MyToken.json")
const tokenAddress = "0x6dc9d424b5514f249c73093295917440a1614474";

const urlWs= "ws://" + location.hostname + ":8888"

const web3 = new Web3(urlWs);

export default {

  middleware: 'auth-localstrage',

  components: {
    VueQArt,
    QrcodeReader,
    QrcodeForReceive,
    QrcodeForAddress
  },

  //TODO: asynDataに統合
  data () {

      return {
        paused: false,
        destroyed: true
      }
    },
   
  async asyncData(context){
     
    let wallet = context.store.getters["wallet"];

    let myContract =  await new web3.eth.Contract(MyToken.abi, tokenAddress);
    let balanceXDS = await myContract.methods.balanceOf(wallet.address).call();
    context.store.commit('setBalanceToStore', balanceXDS);

    return {
      addrReceiver: "",
      amountTransfer: 0,
      passwordSender: "",
      textButtonQRCodeReader:"QR Code Reader:ON",
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

      try{

        let coinbasePassword = "";

        let myContract = await new web3.eth.Contract(MyToken.abi, tokenAddress);

        console.log(this.amountTransfer);
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
        console.log(err);
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
      },

      handleChange(value) {
        //console.log(value)
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
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.center {
  text-align:center
}

.margin {
  margin:10px　0px　10px　0px
}

.el-header, .el-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
  }

.el-main {
    width: 100%;
    margin:auto;
  }
</style>

