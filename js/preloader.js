/* =========================================================
   Abertura (preloader) da página inicial
   Versão em JavaScript puro do componente do Framer:
   1. texto e card aparecem desfocando
   2. pausa
   3. texto e card somem
   4. a tela preta some com desfoque e revela o site
   O card troca de imagem a cada INTERVALO segundos.
   ========================================================= */

(function () {
  const VELOCIDADE = 1;      // 1 = normal, 2 = duas vezes mais rápido
  const INTERVALO = 0.15;    // segundos entre cada imagem do card
  const IMAGENS = [
    "chef", "lacrei", "sumup", "itau", "dados", "balcao", "organiza",
  ].map((n) => "img/projetos/" + n + "-card.webp");

  const raiz = document.documentElement;
  const abertura = document.querySelector(".abertura");
  if (!abertura) return;

  // Já viu nesta sessão ou prefere menos movimento: some na hora
  if (raiz.classList.contains("sem-abertura")) {
    abertura.remove();
    return;
  }

  const texto = abertura.querySelector(".abertura__texto");
  const card = abertura.querySelector(".abertura__card");
  const imgCard = card.querySelector("img");
  const t = 1 / VELOCIDADE;

  // Pré-carrega as imagens e troca em sequência
  IMAGENS.forEach((src) => { new Image().src = src; });
  let i = 0;
  const troca = setInterval(() => {
    i = (i + 1) % IMAGENS.length;
    imgCard.src = IMAGENS[i];
  }, INTERVALO * 1000);

  raiz.classList.add("abertura-ativa"); // trava a rolagem

  // Anima um elemento e espera terminar
  function animar(el, de, para, duracao, easing, atraso) {
    const anim = el.animate([de, para], {
      duration: duracao * 1000,
      delay: (atraso || 0) * 1000,
      easing: easing,
      fill: "forwards",
    });
    return anim.finished;
  }

  const visivel = { opacity: 1, filter: "blur(0px)" };
  const desfocado = { opacity: 0, filter: "blur(10px)" };

  async function sequencia() {
    // 1. Entra
    await Promise.all([
      animar(texto, desfocado, visivel, 1.5 * t, "ease-out", 0.2 * t),
      animar(card, desfocado, visivel, 1.5 * t, "ease-out", 0.2 * t),
    ]);
    // 2. Pausa
    await new Promise((ok) => setTimeout(ok, 800 * t));
    // 3. Sai
    await Promise.all([
      animar(texto, visivel, desfocado, 0.5 * t, "ease-in"),
      animar(card, visivel, desfocado, 0.5 * t, "ease-in"),
    ]);
    // 4. Revela o site
    raiz.classList.remove("abertura-ativa");
    await animar(abertura, visivel, { opacity: 0, filter: "blur(20px)" }, 1 * t, "ease-in-out");
    clearInterval(troca);
    abertura.remove();
    try { sessionStorage.setItem("abertura-vista", "1"); } catch (e) {}
  }

  // Navegador sem suporte a animações: só remove
  if (!abertura.animate) {
    clearInterval(troca);
    raiz.classList.remove("abertura-ativa");
    abertura.remove();
    return;
  }

  sequencia();
})();
