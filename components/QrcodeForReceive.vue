<template>
 
 <div class="center">
  <el-card class="box-card">
<h1 class="center">Receive XDS</h1>
<p class="center">受け取るXDS量</p>
<div>
    <el-input-number v-model="amountReceive" :min="0" :max="100" :step="1"></el-input-number>
</div>
  <div>
  <el-button @click="dialogVisible = true" type="primary">QRコード表示</el-button>
  </div>
   </el-card>

  <el-dialog
    title="Receive XDS Info"
    :visible.sync="dialogVisible"
    width="90%"
    :before-close="handleClose">
  <div>
    <p class="break">{{urlForQr}}</p>
  </div>
    <div id="qrGenarate" class="center"> 
      <vue-q-art :config=config></vue-q-art>
    </div>
      <el-button type="primary" @click="dialogVisible = false">OK</el-button>
  </el-dialog>



  </div>
</template>

<script>
import VueQArt from 'vue-qart'

export default {

  components: {
    VueQArt
  },
   
  data(){

    return {
      amountReceive: 0,
      dialogVisible: false,
    }
  },

  methods: {

    handleClose(done) {
        
      }
    
  },

  computed: {
    wallet: function(){
     return this.$store.state.wallet
    },
    urlForQr:function(){
       return location.origin + "/users?readdr=" + this.wallet.address + "&amount=" + this.amountReceive
    },
    config: function(){ //QRコード生成を動的に処理

      return{
        value: this.urlForQr, 
        imagePath: "/XDS195.png",
        filter: "color",
      }
    }
  }


}
</script>

<style>

.center {
  text-align:center
}

p.break{
  word-wrap: break-word;
}

</style>

