<template>
  <section class="container">
    <div>
      <app-logo/>
      <h1 class="title">
        xds-app
      </h1>
      <h2 class="subtitle">
        Nuxt.js project
      </h2>
      <div class="links">
      
      </div>
    </div>
  </section>
</template>

<script>
import AppLogo from '~/components/AppLogo.vue'
import Web3 from 'web3'

export default {
  components: {
    AppLogo
  },
  async mounted(){

    const tokenAddress = "0x6dc9d424b5514f249c73093295917440a1614474";

    const MyToken = require("/static/token/MyToken.json")

    const web3 = new Web3('http://localhost:8545');
    let myContract =  await new web3.eth.Contract(MyToken.abi, tokenAddress);
    let totalSupply = await myContract.methods.totalSupply().call();
    console.log("totalSupply:", totalSupply);

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

.subtitle {
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

