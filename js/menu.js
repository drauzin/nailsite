// js/menu.js
console.log('menu.js loaded');

var API_URL = 'http://localhost:3000';
var clienteLogado = JSON.parse(localStorage.getItem('usuarioLogado') || 'null');

// 1) Logout
var logoutBtn = document.getElementById('logout');
if (logoutBtn) {
  logoutBtn.addEventListener('click', function() {
    localStorage.removeItem('usuarioLogado');
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

// 3) Alterar foto de perfil
var alterarFotoLabel = document.querySelector('.alterar-foto');
var inputFoto = document.getElementById('inputFoto');
if (alterarFotoLabel && inputFoto) {
  alterarFotoLabel.addEventListener('click', function() {
    inputFoto.click();
  });
  inputFoto.addEventListener('change', function(event) {
    var file = event.target.files[0];
    if (!file || !clienteLogado || !clienteLogado.cpf) return;
    var reader = new FileReader();
    reader.onload = function(e) {
      var fotoData = e.target.result;
      fetch(API_URL + '/usuario/foto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cpf: clienteLogado.cpf, foto_url: fotoData })
      })
      .then(function(resp) {
        if (resp.ok) {
          document.getElementById('fotoPerfil').src = fotoData;
        } else {
          console.error('Erro ao atualizar foto no servidor');
        }
      })
      .catch(console.error);
    };
    reader.readAsDataURL(file);
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
