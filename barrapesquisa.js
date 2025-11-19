document.addEventListener('DOMContentLoaded', () => {
      const searchInput = document.querySelector('.search-input');
      const productList = document.querySelector('.product-list');
      const infoRodape = document.getElementById("info-pesquisa");

      if (searchInput && productList) {
        searchInput.addEventListener('keyup', event => {
          const searchTerm = event.target.value.toLowerCase();
          infoRodape.textContent = searchTerm ? `Você pesquisou por: "${searchTerm}"` : '';

          const products = productList.querySelectorAll('.product-item');
          products.forEach(product => {
            const productName = product.querySelector('.product-title').textContent.toLowerCase();
            if (productName.includes(searchTerm)) {
              product.style.visibility = 'visible';
              product.style.position = 'static';
            } else {
              product.style.visibility = 'hidden';
              product.style.position = 'absolute';
            }
          });
        });
      }
    });