function getGecko(){
//base coingecko API
const URL = "https://api.coingecko.com/api/v3//coins/markets?vs_currency=BTC&order=market_cap_desc&per_page=100&sparkline=false&price_change_percentage=24h,7d,30d,1y&page="
//get data from URL
return fetch(URL)
    .then(res => {
        return res.json()
    }).then(data => {
        //set data into variable and returns
        return data
        //if errors
    }).catch(error => {
        console.log(error)
    });
}

async function getGeckoData(){
let _data = await getGecko()
let _logos = []
for(let _key in _data){
  let _coin = _data[_key]
  let _coinData = {_name: _coin.id, _logoUrl: _coin.image}
  _logos.push(_coinData)
}
return _logos
}
