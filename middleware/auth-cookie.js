export default(context) => {

    const cookieRes = context.app.$cookies.get('XDSInfo')

    console.log("cookieRes:",cookieRes);

    if(!cookieRes){
        context.redirect('/')
    }

    if(cookieRes.address){
        
        context.store.commit("setAddressToStore", cookieRes.address)
    }

}