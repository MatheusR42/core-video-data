import { useState } from 'react'
import "bulma"
import ProductHelpers from './Helpers'

const urlsToArray = (urls) => {
  return urls.split("\n");
}

function forceDownload(url, fileName) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.responseType = "blob";
  xhr.onload = function () {
    var urlCreator = window.URL || window.webkitURL;
    var imageUrl = urlCreator.createObjectURL(this.response);
    var tag = document.createElement('a');
    tag.href = imageUrl;
    tag.download = fileName;
    document.body.appendChild(tag);
    tag.click();
    document.body.removeChild(tag);
  }
  xhr.send();
}

function App() {
  const [urlsString, setUrlsString] = useState('');
  const [jsonResult, setJsonResult] = useState('');

  const onSubmit = (e) => {
    e.preventDefault()
    const links = urlsToArray(urlsString)

    if (!links[0]) {
      return
    }

    Promise.all(links.map(async (link) => {
      try {
        const url = new URL(link)
        const res = await fetch(url.origin + '/api/catalog_system/pub/products/search' + url.pathname)
        const products = await res.json()

        const data = []

        if (products && products.length) {
          products.forEach(product => {
            product.items.forEach(item => {
              // const isAvaliable = ProductHelpers.isAvaliableInOneOfSellers(item.sellers);
              const { sellers, images } = item
              const imageUrls = images.map(image => image.imageUrl);

              const commertialOffer = Array.isArray(sellers)
                ? sellers[0].commertialOffer
                : {}

              const imageNames = []

              imageUrls.forEach((image, index) => {
                const imageName = `${item.nameComplete}-${index + 1}`
                console.log(imageName);
                forceDownload(image, imageName)
                imageNames.push(imageName)
              })

              data.push({
                "dado01": ProductHelpers.numberToReal(commertialOffer.Price).split(',')[0],
                "dado02": item.nameComplete,
                "dado03": `DE R$ ${ProductHelpers.numberToReal(commertialOffer.ListPrice)} POR`,
                "dado04": "," + ProductHelpers.numberToReal(commertialOffer.Price).split(',')[1],
                "dado05": ProductHelpers.numberToReal(commertialOffer.ListPrice).split(',')[0],
                "dado06": "," + ProductHelpers.numberToReal(commertialOffer.ListPrice).split(',')[1],
                imageNames
              })

            })
          })
        }

        return data
      } catch (error) {
        console.log('error' + error);
      }
    })).then(res => {
      console.log(res)
      const finalData = []
      res.forEach(item => item.forEach(product => finalData.push(product)))
      setJsonResult(JSON.stringify(finalData, null, 2))
    })
  }

  return (
    <div classname="App">
      <h1 className="has-text-weight-bold has-text-centered is-size-1">CoreVideoData</h1>
      <p className="has-text-centered">A app to get product data from vtex products urls</p>

      <section className="section">
        <div className="container">
          <p>To use you need to install and enable this extension: <a href="https://chrome.google.com/webstore/detail/cors-unblock/lfhmikememgdcahcdlaciloancbhjino">https://chrome.google.com/webstore/detail/cors-unblock/lfhmikememgdcahcdlaciloancbhjino</a></p><br/><br/>
          <form onSubmit={onSubmit}>
            <div className="field">
              <label className="label">Product URLs(Add one url per line)</label>
              <div className="control">
                <textarea className="textarea" placeholder={`https://www.cybelar.com.br/berco-confete-plus-em-mdp-3-niveis-de-regulagem-multimoveis/p\nhttps://www.cybelar.com.br/guarda-roupa-star-6-3-solteiro-em-mdp-6p-e-3g-santos-andira/p`} onChange={e => setUrlsString(e.target.value)} value={urlsString} />
              </div>
            </div>
            <div className="field is-grouped">
              <div className="control">
                <button className="button is-link">Submit</button>
              </div>
            </div>
          </form>
        </div>

      </section>
      <section className="section">
        <div className="container">
          <p>
            <strong>dado01:</strong> Preço Por sem centavos <br/>
            <strong>dado02:</strong> item.nameComplete <br/>
            <strong>dado03:</strong> Texto com preço formatado <br/>
            <strong>dado04:</strong> Preço Por centavos <br/>
            <strong>dado05:</strong> Preço De sem centavos <br/>
            <strong>dado06:</strong> Preço De centavos <br/>
            <strong>imageNames:</strong> Nome das imagens <br/>
          </p>
          <div className="field">
            <label className="label">Result</label>
            <div className="control">
              <textarea className="textarea" value={jsonResult} />
            </div>
          </div>
        </div>
      </section>
      <p className="has-text-weight-bold has-text-centered">Criado por: Matheus Araujo, Matheus Fiori e Jefferson Leite</p>
    </div>

  );
}

export default App;
