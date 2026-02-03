// Capturar envio do formulário
document.getElementById('formularioLogin').addEventListener('submit', function (event) {
    event.preventDefault(); // Não fazer recarga da página

    showLoading();

    // Pegar os valores dos inputs
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    // Fazer requisição POST para a API
    fetch('/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, senha })
    })
        .then(response => response.json())
        .then(data => {
            // Se houve erro na resposta
            hideLoading();
            if (data.erro) {
                mostrarErro(data.erro);
                return;
            }

            // Se login foi bem sucedido
            if (data.sessionId && data.usuario) {
                // Armazenar dados no localStorage
                localStorage.setItem('sessionId', data.sessionId);
                localStorage.setItem('usuario', JSON.stringify(data.usuario));

                // Redirecionar para o dashboard
                window.location.href = '/dashboard';
            }
        })
        .catch(error => {
            hideLoading();
            console.error('Erro:', error);
            mostrarErro('Erro ao fazer login! Tente novamente.');
        });
});

function mostrarErro(mensagem) {
    const erroDiv = document.getElementById('erro');
    const mensagemErro = document.getElementById('mensagemErro');
    mensagemErro.textContent = mensagem;
    erroDiv.classList.remove('hidden');

    // Desaparecer o erro após 5 segundos
    setTimeout(() => {
        erroDiv.classList.add('hidden');
    }, 5000);
}