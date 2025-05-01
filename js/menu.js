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

// 3) Envio da nova foto de perfil
var inputFoto = document.getElementById('inputFoto');
if (inputFoto) {
  inputFoto.addEventListener('change', function () {
    if (!clienteLogado || !clienteLogado.cpf) return alert("Usuário não logado");

    const formData = new FormData();
    formData.append('foto', inputFoto.files[0]);
    formData.append('cpf', clienteLogado.cpf);

    fetch(API_URL + '/usuario/upload-foto', {
      method: 'POST',
      body: formData
    })
      .then(res => res.json())
      .then(data => {
        if (data.caminho) {
          document.getElementById('fotoPerfil').src = API_URL + '/' + data.caminho;
        } else {
          alert('Erro ao atualizar a foto');
        }
      })
      .catch(err => {
        console.error('Erro no upload da foto:', err);
        alert('Erro ao enviar a foto');
      });
  });
}

// 4) Carregar foto ao abrir a página
function carregarFotoPerfil() {
  var img = document.getElementById('fotoPerfil');
  var nomeSpan = document.getElementById('nome-usuario');

  if (!clienteLogado || !clienteLogado.cpf) {
    img.src = 'images/default-avatar.png';
    nomeSpan.textContent = "Usuário";
    return;
  }

  fetch(API_URL + '/usuario/' + clienteLogado.cpf)
    .then(res => res.json())
    .then(dados => {
      img.src = dados.foto ? (API_URL + '/' + dados.foto) : 'images/default-avatar.png';
      nomeSpan.textContent = dados.nome || "Usuário";
    })
    .catch(err => {
      console.error('Erro ao carregar dados do usuário:', err);
      img.src = 'images/default-avatar.png';
      nomeSpan.textContent = "Usuário";
    });
}

document.addEventListener('DOMContentLoaded', carregarFotoPerfil);