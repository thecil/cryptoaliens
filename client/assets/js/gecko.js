function getGecko(){
//base coingecko API
  const URL = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=BTC&order=market_cap_desc&per_page=250&sparkline=false&page="
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
  let _coin, _coinData
  let _data = await getGecko()
  let _logos = []
  for(let _key in _data){
    for(let i in coinLogosId){
      _coin = _data[_key]
      if(_coin.id == coinLogosId[i]){
        _coinData = {_name: _coin.id, _logoUrl: _coin.image}
        _logos.push(_coinData)
      }
    }
  }
  return _logos
}
