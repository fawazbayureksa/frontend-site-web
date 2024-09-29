export const FormatCurrency = (price)=>{
    try{
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    } catch(Exception){
        return price
    }
}

export default FormatCurrency;