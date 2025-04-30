document.getElementById("logout").addEventListener("click", function() {
    localStorage.removeItem("usuarioLogado");
    window.location.href = "index.html";
});


document.getElementById("menu-icon").addEventListener("click", function() {
    const menu = document.getElementById("menu");
    if (menu.style.display === "none" || menu.style.display === "") {
        menu.style.display = "block"; // Exibe o menu
    } else {
        menu.style.display = "none"; // Oculta o menu
    }
});

document.getElementById("inputFoto").addEventListener("change", function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();

        reader.onload = function(e) {
            const novaFoto = e.target.result;
            localStorage.setItem("fotoPerfil", novaFoto);

            atualizarFotoPerfil(); // Atualiza a imagem exibida
        };

        reader.readAsDataURL(file); // Converte para base64
    }
});

function atualizarFotoPerfil() {
    const img = document.getElementById("fotoPerfil");
    const fotoSalva = localStorage.getItem("fotoPerfil");

    if (fotoSalva) {
        img.src = fotoSalva;
    } else {
        img.src = "default-avatar.png"; // Se não tiver foto salva, usa a padrão
    }
}

// Rodar ao abrir a página para mostrar a foto certa
document.addEventListener("DOMContentLoaded", atualizarFotoPerfil);


//Foto perfil salvar Local Storage :D
const fotoPerfilImg = document.getElementById("fotoPerfil")


 // Função para carregar a foto com base no CPF
 function atualizarFotoPerfil() {
    if (clienteLogado && clienteLogado.cpf) {
        const fotoSalva = localStorage.getItem(`fotoPerfil_${clienteLogado.cpf}`);
        if (fotoSalva) {
            fotoPerfilImg.src = fotoSalva;
        } else {
            fotoPerfilImg.src = "images/default-avatar.png";
        }
    }
 }


// Quando escolher nova foto
document.getElementById("inputFoto").addEventListener("change", function(event) {
    const file = event.target.files[0];
    if (file && clienteLogado && clienteLogado.cpf) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const novaFoto = e.target.result;
            localStorage.setItem(`fotoPerfil_${clienteLogado.cpf}`, novaFoto);
            atualizarFotoPerfil();
        };
        reader.readAsDataURL(file);
    }
});

// Atualiza foto quando a página carrega
document.addEventListener("DOMContentLoaded", atualizarFotoPerfil);