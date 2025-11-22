// 🔐 Supabase
const SUPABASE_URL = "https://kwktdbinfadztnkghuul.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt3a3RkYmluZmFkenRua2dodXVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc5NzI5NjAsImV4cCI6MjA2MzU0ODk2MH0.jN-ggFrIE1x_4kO8KE5G_bZq6V1yFT1El64oQ_ELubY";
const TABLE = "roleta_cadastros";

// 🎁 Prêmios e chances
const prizes = [
  { label: "1 Crispyzola", chance: 15 },
  { label: "1 porção de coxinha", chance: 15 },
  { label: "1 Dos Anjos", chance: 20 },
  { label: "1 1985", chance: 20 },
  { label: "1 batata frita P", chance: 20 },
  { label: "1 soda italiana", chance: 10 }
];

// 🎯 Elementos
const form = document.getElementById("register-form");
const screenForm = document.getElementById("screen-form");
const screenRoulette = document.getElementById("screen-roulette");
const playerNameEl = document.getElementById("player-name");
const wheel = document.getElementById("wheel");
const spinBtn = document.getElementById("spin-btn");
const resultBox = document.getElementById("result");
const resultText = document.getElementById("result-text");

let hasSpun = false;

// 📌 Salvar no Supabase
async function salvarNoSupabase({ nome, telefone, email, cidade }) {
  const resp = await fetch(`${SUPABASE_URL}/rest/v1/${TABLE}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      Prefer: "return=minimal"
    },
    body: JSON.stringify({
      nome,
      telefone,
      email,
      cidade,
      origem: "Roleta de brindes Black Friday 2025"
    })
  });

  if (!resp.ok) {
    const txt = await resp.text();
    console.error("Erro Supabase:", txt);
    throw new Error("Falha ao salvar no Supabase");
  }
}

// 💾 Cadastro
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const nome = document.getElementById("nome").value.trim();
  const telefone = document.getElementById("telefone").value.trim();
  const email = document.getElementById("email").value.trim();
  const cidade = document.getElementById("cidade").value.trim();

  if (!nome || !telefone || !email || !cidade) {
    return alert("Preencha todos os campos");
  }

  try {
    await salvarNoSupabase({ nome, telefone, email, cidade });
  } catch {
    return alert("Problema ao salvar, tente novamente");
  }

  playerNameEl.textContent = nome;
  screenForm.classList.remove("active");
  screenRoulette.classList.add("active");
});

// 🎲 Escolher prêmio
function pickPrizeWeighted() {
  let r = Math.random() * 100, acc = 0;
  for (let i = 0; i < prizes.length; i++) {
    acc += prizes[i].chance;
    if (r < acc) return { index: i, prize: prizes[i] };
  }
}

// 🎡 Girar roleta
function spinWheel() {
  if (hasSpun) return alert("Você só pode girar uma vez");
  hasSpun = true;
  spinBtn.disabled = true;
  spinBtn.textContent = "Girando...";

  const { index, prize } = pickPrizeWeighted();
  const sliceAngle = 360 / prizes.length;
  const centerAngle = index * sliceAngle + sliceAngle / 2;
  const rotation = 5 * 360 + (90 - centerAngle);
  wheel.style.transform = `rotate(${rotation}deg)`;

  setTimeout(() => {
    resultBox.style.display = "block";
    resultText.innerHTML = `
      <p>Parabéns, você ganhou</p>
      <p><strong>${prize.label}</strong></p>
      <p style="margin-top:6px;font-size:12px;color:#9ca3af;">
        Mostre esta tela para a equipe do Smash do Cabo para validar seu brinde, sujeito às regras da promoção.
      </p>
      <p style="margin-top:6px;font-size:12px;color:#f87171;">
        O brinde poderá ser retirado somente na loja Smash do Cabo na Praia dos Anjos na data de 28 de novembro de 2025, não haverá exceções.
      </p>`;
    spinBtn.textContent = "Brinde definido";
  }, 4200);
}
spinBtn.addEventListener("click", spinWheel);
