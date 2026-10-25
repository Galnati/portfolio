# Portfólio Maicon Rodrigues

Site estático (HTML, CSS e JavaScript puros). Não precisa instalar nada para rodar.

## Estrutura

- index.html: página inicial
- projects/index.html: lista de projetos
- projects/NOME/index.html: um case por pasta
- contact-me/index.html: contato com formulário
- obrigado/index.html: página que aparece depois de enviar o formulário
- 404.html: página de erro
- contato.php: envia as mensagens do formulário para o seu e-mail
- .htaccess: ativa a página 404, força HTTPS e guarda cache das imagens
- css/style.css: todo o visual (cores e fontes ficam no topo, em :root)
- js/main.js: menu, animações e o avatar que olha para o cursor
- img/: todas as imagens em WebP

## Como ver no seu computador

Abra o index.html no navegador. Para os links funcionarem igual ao site no ar,
rode um servidor local dentro da pasta (o formulário só envia no site publicado):

    python -m http.server 8000

e acesse http://localhost:8000

## Como trocar um texto

Abra o .html da página em qualquer editor (VS Code é o mais prático),
procure o texto com Ctrl+F e edite. Salve e envie para o GitHub: a Hostinger
publica sozinha (se o deploy automático estiver ativo no hPanel).

## Como adicionar um projeto novo

1. Copie uma pasta de projects/ (por exemplo projects/balcao) e renomeie.
2. Troque textos e imagens no index.html dessa pasta.
3. Coloque as imagens em img/projetos/.
4. Adicione o card em projects/index.html (copie um bloco <a class="card ...">).
5. Ajuste os links "Projeto Anterior" e "Próximo projeto" dos vizinhos.
