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
const web3 = new Web3('ws://192.168.10.5:8888');

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

      if(confirm(address + 'をcookieに保存しますか？')){

        window.localStorage.setItem('XDSaddress', address);
   
      }
      else{

        alert('キャンセルされました'); // 警告ダイアログを表示

      }

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

