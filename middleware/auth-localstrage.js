export default(context) => {

    //const cookieRes = context.app.$cookies.get('XDSInfo')
    //console.log("cookieRes:",cookieRes);
    
    let XDSaddress = window.localStorage.getItem('XDSaddress');
    console.log("XDSaddress in local strage:", XDSaddress);

    if(!XDSaddress){
        context.redirect('/')
    }else{
        context.store.commit("setAddressToStore", XDSaddress)
    }

}