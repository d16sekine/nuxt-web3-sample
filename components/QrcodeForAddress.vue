<template>
 
 <div class="center">
  <el-card class="box-card">
<h1 class="center">Address For Other Device</h1>
  <div>
  <el-button @click="dialogVisible = true" type="primary">QRコード表示</el-button>
  </div>
   </el-card>

  <el-dialog
    title="Login Info for your other device"
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
       return location.origin + "?xdsaddr=" + this.wallet.address
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

