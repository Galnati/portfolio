<?php
// Recebe o formulário da página de contato e envia por e-mail.
// Funciona em qualquer hospedagem com PHP (ex.: Hostinger).

$destino   = "maicon.rodrigues45@gmail.com";
$remetente = "contato@portfmaicon.com.br"; // precisa ser do seu domínio

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    header("Location: /contact-me/");
    exit;
}

// Campo escondido: se veio preenchido, é robô
if (!empty($_POST["site"])) {
    header("Location: /obrigado/");
    exit;
}

$nome     = trim(strip_tags($_POST["nome"] ?? ""));
$email    = trim($_POST["email"] ?? "");
$mensagem = trim(strip_tags($_POST["mensagem"] ?? ""));

// Impede quebra de linha nos cabeçalhos
$nome = str_replace(["\r", "\n"], " ", $nome);

if ($nome === "" || $mensagem === "" || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    header("Location: /contact-me/?erro=1");
    exit;
}

$assunto = "=?UTF-8?B?" . base64_encode("Portfólio: mensagem de $nome") . "?=";
$corpo   = "Nome: $nome\nE-mail: $email\n\nMensagem:\n$mensagem\n";

$cabecalhos  = "From: Portfólio Maicon <$remetente>\r\n";
$cabecalhos .= "Reply-To: $email\r\n";
$cabecalhos .= "MIME-Version: 1.0\r\n";
$cabecalhos .= "Content-Type: text/plain; charset=UTF-8\r\n";

if (mail($destino, $assunto, $corpo, $cabecalhos)) {
    header("Location: /obrigado/");
} else {
    header("Location: /contact-me/?erro=1");
}
exit;
