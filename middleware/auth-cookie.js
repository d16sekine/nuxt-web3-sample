import Cookies from 'universal-cookie'

export default({req, store}) => {

    console.log("req:", req)

    if(process.browser){
        return;
    }
    const cookies = new Cookies(req.headers.cookie)
    const address = cookies.get("address")
    console.log("address in cookie", address)
    if(address){
        
        store.commit("setAddressToStore", address)
    }

}