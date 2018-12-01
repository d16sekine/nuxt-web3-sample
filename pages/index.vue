<template>
 

  <el-container>
  <el-header>
    <h2 class="title">xds-app</h2>
  </el-header>
  <el-main>
    <p>Coinbase Address</p>
    <el-input placeholder=""  v-model="coinbase"  :disabled="true"></el-input>
    <p>Token Contract Address</p>
    <el-input placeholder=""  v-model="tokenContract"  :disabled="true"></el-input>
    <p>Total supply XDS</p>
    <el-input placeholder=""  v-model="totalSupply"  :disabled="true"></el-input>
  </el-main>
  </el-container> 
     
</template>

<script>
import Web3 from 'web3'

export default {
  data () {
    return {
      input: null
    }
  },

  async asyncData(){

    const MyToken = require("~/static/token/MyToken.json")
    //console.log("MyToken.json:", MyToken)

    const tokenAddress = "0x6dc9d424b5514f249c73093295917440a1614474";

    const web3 = new Web3('http://localhost:8545');

    //coinbase
    let addr_coinbase =  await web3.eth.getCoinbase();

    let myContract =  await new web3.eth.Contract(MyToken.abi, tokenAddress);
    let totalSupply = await myContract.methods.totalSupply().call();
    console.log("totalSupply:", totalSupply);

    return {
      coinbase: addr_coinbase,
      tokenContract: tokenAddress,
      totalSupply: totalSupply    

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

