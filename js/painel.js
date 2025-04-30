

    // Função para sair da conta do admin
    const logoutButton = document.getElementById("logout");
    if (logoutButton) {
        logoutButton.addEventListener("click", function () {
            localStorage.removeItem("usuarioLogado");
            window.location.href = "index.html";  // Redireciona para a página de login
        });
    }
    
    // Ações dos botões do painel administrativo
    document.getElementById("painelagendamento").addEventListener("click", function () {
        window.location.href = "painelagendamento.html";  // Redireciona para a página de consulta de agendamentos
    });

    document.getElementById("novocliente").addEventListener("click", function () {
        window.location.href = "novocliente.html";  // Redireciona para a página de cadastro de cliente
    });

    document.getElementById("cadastrarcupom").addEventListener("click", function () {
        window.location.href = "cadastrarcupom.html";  // Redireciona para a página de cadastro de cupons
    });

    document.getElementById("listaclientes").addEventListener("click", function () {
        window.location.href = "listaclientes.html";  // Redireciona para a página de lista de clientes
    });

    document.getElementById("horarios").addEventListener("click", function () {
        window.location.href = "horarios.html";  // Redireciona para a página de liberação de horários
    });
;
