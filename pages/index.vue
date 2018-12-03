<template>
 

  <el-container>
  <el-header>
    <h2 class="title">XDS-Wallet-App</h2>
  </el-header>
  <el-main>

    <p>Create New XDS Address</p>
    <el-input placeholder="Please input Password"  v-model="newPassword"></el-input>
    <el-button @click="createNewAddress" type="primary">Address作成</el-button>
 
  </el-main>
  </el-container> 
     
</template>

<script>
import Web3 from 'web3'

const urlWs= "ws://" + location.hostname + ":8888"
const web3 = new Web3(urlWs);

export default {
 
  async asyncData(context){

    
    return {
      newPassword:""
    }

  },

  methods: {

    async createNewAddress(){

      console.log("inputted password:",this.newPassword);

      let address =  await web3.eth.personal.newAccount(this.newPassword);
      //let address = "test";

      console.log("created address:",address);

      if(confirm(address + 'をLocalStrageに保存しますか？')){

        window.localStorage.setItem('XDSaddress', address);
   
      }
      else{

      }

      alert('Addressとパスワードは安全に保管お願いします。')

      this.$router.push("/users/")

      return;

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

.el-header, .el-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
  }
</style>

