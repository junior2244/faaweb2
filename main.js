import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm"

const supabase = createClient(
  "YOUR_SUPABASE_URL",
  "YOUR_PUBLISHABLE_KEY"
);

async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return alert(error.message);

  window.location.href = "dashboard.html";
}

async function getUser() {
  const { data } = await supabase.auth.getUser();
  return data.user;
}

async function toggleDuty(action) {
  const user = await getUser();

  await fetch('/.netlify/functions/duty', {
    method: 'POST',
    body: JSON.stringify({ userId: user.id, action })
  });

  alert("Duty updated.");
}

async function promote() {
  const user = await getUser();
  const targetId = document.getElementById("targetId").value;
  const newRank = parseInt(document.getElementById("newRank").value);

  await fetch('/.netlify/functions/promote', {
    method: 'POST',
    body: JSON.stringify({ promoterId: user.id, targetId, newRank })
  });

  alert("Promotion attempted.");
}

async function addPlane() {
  const user = await getUser();
  const planeName = document.getElementById("planeName").value;

  await fetch('/.netlify/functions/planes', {
    method: 'POST',
    body: JSON.stringify({ userId: user.id, planeName })
  });

  alert("Plane added.");
}

window.login = login;
window.toggleDuty = toggleDuty;
window.promote = promote;
window.addPlane = addPlane;
