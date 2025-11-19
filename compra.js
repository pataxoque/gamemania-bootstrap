$(function() {
  // Utilitários
  function getCart() {
    try { return JSON.parse(localStorage.getItem('cart') || '[]'); }
    catch (e) { return []; }
  }
  function saveCart(cart) { localStorage.setItem('cart', JSON.stringify(cart)); }
  function formatPrice(num) {
    return Number(num || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  // Toast Bootstrap
  function showToast(message) {
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.id = 'toast-container';
      toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
      document.body.appendChild(toastContainer);
    }
    const el = document.createElement('div');
    el.className = 'toast align-items-center text-bg-success border-0';
    el.innerHTML = `
      <div class="d-flex">
        <div class="toast-body">${message}</div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
      </div>`;
    toastContainer.appendChild(el);
    new bootstrap.Toast(el).show();
    el.addEventListener('hidden.bs.toast', () => el.remove());
  }

  // Renderizar carrinho
  function renderCart() {
    const $container = $('#carrinhoItens');
    if ($container.length === 0) return;

    const cart = getCart();
    $container.empty();

    if (!cart.length) {
      $container.html('<p class="text-center text-muted">Carrinho vazio.</p>');
      $('#totalCarrinho').text(formatPrice(0));
      return;
    }

    cart.forEach(item => {
      const line = item.price * item.qty;
     const $row = $(`
<div class="col-12">
      <div class="card p-3 d-flex flex-row align-items-center justify-content-between" data-id="${item.id}">
        <div class="d-flex align-items-center">
          <img src="${item.img}" alt="${item.title}" style="width:65px" class="me-3">
          <div>
            <h5 class="mb-1">${item.title}</h5>
            <p class="mb-0">Quantidade: ${item.qty} | Unitário: ${formatPrice(item.price)}</p>
          </div>
        </div>
        <div class="d-flex align-items-center">
          <span class="ms-3 fw-bold">Subtotal: ${formatPrice(line)}</span>
          <a href="#" class="text-danger ms-3 remove-item">Remover</a>
        </div>
      </div>
    </div>
`);

      $container.append($row);
    });

    updateTotals();
    $('.remove-item').on('click', function(e){
      e.preventDefault();
      const id = $(this).closest('[data-id]').data('id');
      const cart = getCart().filter(it => it.id !== id);
      saveCart(cart);
      renderCart();
    });
  }

  function updateTotals() {
    const cart = getCart();
    const subtotal = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
    $('#totalCarrinho').text(formatPrice(subtotal));
  }

  // Adicionar ao carrinho (produto.html)
  $(document).on('click', '.btn-carrinho', function(e) {
    e.preventDefault();

    const $rightCol = $(this).closest('.col-md-6');

    // tenta pegar de h2, se não achar pega de p strong
    let title = ($rightCol.find('h2').text() || '').trim();
    if (!title) {
      title = ($rightCol.find('p strong').text() || '').trim();
    }
    if (!title) return;

    const priceText = ($rightCol.find('.preco-produto').text() || '').trim();
    const cleaned = priceText.replace(/[^0-9,.-]+/g, '').replace(/\./g, '').replace(',', '.');
    const price = parseFloat(cleaned);
    if (isNaN(price)) return;

    const qty = Math.max(1, parseInt($('#quantidade').val(), 10) || 1);
    const img = $(this).closest('.row').find('.col-md-6 img').first().attr('src') || '';
    const id = title.replace(/\s+/g, '-').toLowerCase();

    const cart = getCart();
    const existing = cart.find(it => it.id === id);
    if (existing) {
      existing.qty += qty;
    } else {
      cart.push({ id, title, price, img, qty });
    }
    saveCart(cart);

    showToast('Produto adicionado ao carrinho!');
    setTimeout(() => { window.location.href = 'carrinho.html'; }, 700);
  });

  // Apagar carrinho
  $('#apagarCarrinho').on('click', function(){
    localStorage.removeItem('cart');
    renderCart();
  });

  // Inicialização
  renderCart();
});
