import Vuex from 'vuex'

const walletStore = () => {
  return new Vuex.Store({
    state: () => ({
      wallet: {
        balance:0,
        address:""
      }
    }),
    getters:{
      wallet:(state)=> state.wallet
    },
    mutations: {
      setBalanceToStore(state, value) {
        state.wallet.balance = value;
      },
      setAddressToStore(state, value) {
        state.wallet.address = value;
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