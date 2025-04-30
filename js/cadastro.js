document.querySelector('#cadastroForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  const nome = document.querySelector('#nome').value;
  const cpf = document.querySelector('#cpf').value;
  const foto = document.querySelector('#foto').files[0];

  const formData = new FormData();
  formData.append('nome', nome);
  formData.append('cpf_cliente', cpf);
  formData.append('foto_url', foto);

  const response = await fetch('http://localhost:3000/cliente', {
    method: 'POST',
    body: formData
  });

  const data = await response.json();
  alert('Cliente cadastrado com sucesso');
});

