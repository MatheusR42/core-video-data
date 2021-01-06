class ProductHelpers {
  getProductField(product, field) {
      let { properties } = product;

      if (properties) {
          properties = properties.filter(property => {
              return property.name == field;
          });
          return properties.length > 0 ? properties[0].values[0] : null;
      }
      return null;
  }

  filterSkuDisponibleInProduct(product, showOutStock) {
      const sku = product.items
          .map((item, index) => {
              return { ...item, itemIndex: index };
          })
          .filter(item => {
              return (
                  this.isAvaliableInOneOfSellers(item.sellers) || showOutStock
              );
          })[0];

      return sku;
  }

  getFirstSkuAvaliable(product) {
      const sku = product.items.filter(item => {
          return this.isAvaliableInOneOfSellers(item.sellers);
      })[0];

      return sku;
  }

  isAvaliableInOneOfSellers(sellers) {
      return sellers.filter(seller => {
          return seller.commertialOffer.AvailableQuantity > 0;
      }).length;
  }

  isAvaliable(product) {
      const skus = product.items.filter(item => {
          return this.isAvaliableInOneOfSellers(item.sellers);
      });

      return skus.length;
  }

  mapInstallments(installments) {
      installments = installments.map(installment => {
          return {
              NumberOfInstallments: installment.NumberOfInstallments,
              InterestRate: installment.InterestRate
          };
      });

      if (!installments.length > 0) {
          return null;
      }

      const noInterestRateInstallments = installments.filter(
          installment => !installment.InterestRate
      );

      const installment = (!noInterestRateInstallments.length
          ? installments
          : noInterestRateInstallments
      ).reduce((previous, current) =>
          previous.NumberOfInstallments > current.NumberOfInstallments
              ? previous
              : current
      );

      return installment.NumberOfInstallments;
  }

  getNumberOfInstallments(installments) {
      if (!installments) return;

      let numberOfInstallments = null;

      if (!installments.length > 0 && typeof installments === 'number') {
          numberOfInstallments = installments;
      } else {
          installments = installments.filter((installment, index) => {
              return installment !== null;
          });

          numberOfInstallments = this.mapInstallments(installments);
      }

      return numberOfInstallments;
  }

  getProductField(product, field) {
      let { properties } = product;

      if (properties) {
          properties = properties.filter(property => {
              return property.name == field;
          });
          return properties.length > 0 ? properties[0].values[0] : null;
      }
      return null;
  }

  numberToReal(numero) {
    var numero = numero.toFixed(2).split('.');
    numero[0] = numero[0].split(/(?=(?:...)*$)/).join('.');
    return numero.join(',');
  }

  getPrincipalImageFromProduct(product) {
      const sku = product.items[0];
      let image = sku.images[0].imageUrl;

      sku.images.forEach(({ imageText, imageUrl }) => {
          if (imageText === 'principal') {
              image = imageUrl;
          }
      });

      return image;
  }

  isInCollection(product, name) {
      return (
          product && product.productClusters.find(item => item.name === name)
      );
  }

  isInArr(product) {
      return product && product.properties.find(item => item.values);
  }

  isCategory(product) {
      let category = product.properties.filter(item => {
          return item.name === 'Categoria';
      });
      return category[0].values[0];
  }

  isfootwear(product) {
      if (!product || !product.categories) {
          return null
      }
      let category = product.categories.filter(item => {
          return item === "/Calçado/Tênis/";
      });
      return category[0]
  }

  isBenefits(product) {
      let category = product.properties.filter(item => {
          return item.name === 'Benefícios';
      });
      return category[0].values;
  }

  isCategoryIsLessThan(product) {
      let category = product.properties.filter(item => {
          return item.name === 'Categoria';
      });
      let word = category[0].values[0];
      if (word === 'Cross Training') {
          category[0].values.unshift('CrossTraining');
          return true;
      }
      if (word.length >= 10) {
          return true;
      }
      return false;
  }

  isDetails(product) {
      let category = product.properties.filter(item => {
          return item.name === 'Detalhes do produto';
      });
      return category[0].values;
  }

  isHtmlDescription(product) {
      let html = product.properties.filter(item => {
          return item.name === 'Descrição HTML';
      });
      if (html && html[0]) {
          return html[0].values[0];
      }
      return null;
  }

  getItems(arr) {
      const newArray = [];
      const numbersArray = [];

      if (!arr.length) {
          return [];
      }

      arr.forEach((item, originalIndex) => {
          if (arr.indexOf(item) > -1) {
              if (item.name === 'PP' || item.name === 'U') {
                  newArray.push({
                      originalIndex,
                      item: item.name,
                      order: 0,
                      sellers: item.sellers[0].commertialOffer.AvailableQuantity
                  });
              }
              if (item.name === 'P') {
                  newArray.push({
                      originalIndex,
                      item: item.name,
                      order: 1,
                      sellers: item.sellers[0].commertialOffer.AvailableQuantity
                  });
              }
              if (item.name === 'M') {
                  newArray.push({
                      originalIndex,
                      item: item.name,
                      order: 2,
                      sellers: item.sellers[0].commertialOffer.AvailableQuantity
                  });
              }
              if (item.name === 'G') {
                  newArray.push({
                      originalIndex,
                      item: item.name,
                      order: 3,
                      sellers: item.sellers[0].commertialOffer.AvailableQuantity
                  });
              }
              if (item.name === 'GG') {
                  newArray.push({
                      originalIndex,
                      item: item.name,
                      order: 4,
                      sellers: item.sellers[0].commertialOffer.AvailableQuantity
                  });
              } else {
                  numbersArray.push({
                      originalIndex,
                      item: parseFloat(item.name.replace(',', '.')),
                      sellers: item.sellers[0].commertialOffer.AvailableQuantity
                  });
              }
          }
      });

      return newArray.length
          ? newArray.sort((a, b) => {
                return a.order - b.order;
            })
          : numbersArray.sort((a, b) => {
                return a.item - b.item;
            });
  }
}

export default new ProductHelpers();