import Vuex from 'vuex'

const walletStore = () => {
  return new Vuex.Store({
    state: () => ({
      wallet: {
        amount:0,
        address:""
      }
    }),
    mutations: {
      setAmountToStore(state, value) {
        console.log("mutations");
        state.wallet.amount = value;
      }
    },
    // actions: {
    //   setAmount(commit, value) {
    //     // コミットすることで状態変更が反映される
    //     commit('setAmountToStore', value)
    //   }
    // }
  })
}

export default  walletStore