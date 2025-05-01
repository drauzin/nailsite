// js/menu.js
console.log('menu.js loaded');

var API_URL = 'https://nailsite.onrender.com';
var clienteLogado = JSON.parse(localStorage.getItem('usuarioLogado') || 'null');

// 1) Logout
var logoutBtn = document.getElementById('logout');
if (logoutBtn) {
  logoutBtn.addEventListener('click', function() {
    window.location.href = 'index.html';
  });
}

// 2) Menu hamburguer toggle
var menuIcon = document.getElementById('menu-icon');
if (menuIcon) {
  menuIcon.addEventListener('click', function() {
    var menu = document.getElementById('menu');
    menu.style.display = (menu.style.display === 'block') ? 'none' : 'block';
  });
}



// 4) Carregar foto ao abrir a página
function carregarFotoPerfil() {
  var img = document.getElementById('fotoPerfil');
  if (!clienteLogado || !clienteLogado.cpf) {
    img.src = 'images/default-avatar.png';
    return;
  }
  fetch(API_URL + '/usuario/' + clienteLogado.cpf)
    .then(function(res) {
      if (!res.ok) throw new Error('Usuário não encontrado');
      return res.json();
    })
    .then(function(dados) {
      img.src = dados.foto_url || 'images/default-avatar.png';
    })
    .catch(function(err) {
      console.error('Erro ao carregar foto:', err);
      img.src = 'images/default-avatar.png';
    });
}

document.addEventListener('DOMContentLoaded', carregarFotoPerfil);
