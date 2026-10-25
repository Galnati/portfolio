/* =========================================================
   Portfólio Maicon Rodrigues
   1. Menu
   2. Animação de entrada dos blocos
   3. Avatar 3D que olha para o cursor
   ========================================================= */

// ---------- 1. Menu ----------
const botaoMenu = document.querySelector(".nav__botao");
const menu = document.getElementById("menu");

function alternarMenu(abrir) {
  document.body.classList.toggle("menu-aberto", abrir);
  botaoMenu.setAttribute("aria-expanded", String(abrir));
  botaoMenu.setAttribute("aria-label", abrir ? "Fechar menu" : "Abrir menu");
  menu.setAttribute("aria-hidden", String(!abrir));
}

botaoMenu.addEventListener("click", () => {
  alternarMenu(!document.body.classList.contains("menu-aberto"));
});

// Fecha ao clicar num link, fora do menu ou ao apertar Esc
menu.addEventListener("click", (e) => {
  if (e.target.closest("a")) alternarMenu(false);
});
document.addEventListener("click", (e) => {
  if (!e.target.closest(".menu, .nav__botao")) alternarMenu(false);
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") alternarMenu(false);
});

// ---------- 2. Animação de entrada ----------
const blocos = document.querySelectorAll(".revelar");

if ("IntersectionObserver" in window) {
  const observador = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
          entrada.target.classList.add("visivel");
          observador.unobserve(entrada.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  blocos.forEach((bloco) => observador.observe(bloco));
} else {
  blocos.forEach((bloco) => bloco.classList.add("visivel"));
}

// ---------- 3. Avatar que olha para o cursor ----------
const avatar = document.querySelector(".hero__avatar");

if (avatar) {
  const imagens = {};
  avatar.querySelectorAll("img").forEach((img) => {
    imagens[img.dataset.olhar] = img;
  });

  let atual = "centro";

  function olharPara(direcao) {
    if (direcao === atual || !imagens[direcao]) return;
    imagens[atual].classList.remove("ativo");
    imagens[direcao].classList.add("ativo");
    atual = direcao;
  }

  // Descobre para onde o cursor está em relação ao rosto
  function direcaoDoCursor(x, y) {
    const caixa = avatar.getBoundingClientRect();
    const centroX = caixa.left + caixa.width / 2;
    const centroY = caixa.top + caixa.height * 0.4; // altura dos olhos
    const dx = x - centroX;
    const dy = y - centroY;
    const zonaMorta = caixa.width * 0.18; // perto do rosto, olha pra frente

    if (Math.abs(dx) < zonaMorta && Math.abs(dy) < zonaMorta) return "centro";
    if (Math.abs(dx) > Math.abs(dy)) return dx < 0 ? "esquerda" : "direita";
    return dy < 0 ? "cima" : "baixo";
  }

  const temMouse = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const reduzirMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (temMouse) {
    window.addEventListener("mousemove", (e) => {
      olharPara(direcaoDoCursor(e.clientX, e.clientY));
    });
    document.addEventListener("mouseleave", () => olharPara("centro"));
  } else if (!reduzirMovimento) {
    // No celular não tem cursor, então ele olha em volta sozinho
    const sequencia = ["centro", "esquerda", "centro", "direita", "centro", "cima"];
    let passo = 0;
    setInterval(() => {
      passo = (passo + 1) % sequencia.length;
      olharPara(sequencia[passo]);
    }, 1800);
  }
}

// ---------- 4. Aviso de erro no formulário ----------
const formulario = document.querySelector(".form");
if (formulario && new URLSearchParams(location.search).has("erro")) {
  const aviso = document.createElement("p");
  aviso.className = "form__erro";
  aviso.setAttribute("role", "alert");
  aviso.textContent = "Não consegui enviar sua mensagem. Confira os campos ou me chame por e-mail.";
  formulario.prepend(aviso);
}
