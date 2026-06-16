const btn = document.getElementById("loginBtn");
const message = document.getElementById("message");
const input = document.getElementById("password");
const loader = document.querySelector(".loader");
const bar = document.querySelector(".loader-bar");

btn.addEventListener("click", login);

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    login();
  }
});

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function typeLine(line) {
  return new Promise((resolve) => {
    let i = 0;
    const interval = setInterval(() => {
      message.innerHTML += line[i];
      i += 1;
      if (i >= line.length) {
        clearInterval(interval);
        resolve();
      }
    }, 30);
  });
}

async function typeLines(lines) {
  message.innerHTML = "";
  for (let index = 0; index < lines.length; index += 1) {
    await typeLine(lines[index]);
    if (index < lines.length - 1) {
      message.innerHTML += "<br>";
      await wait(250);
    }
  }
}

async function login() {
  const password = input.value.trim();

  input.classList.remove("error");
  message.classList.remove("denied", "success");
  loader.classList.add("oculto");
  bar.style.width = "0%";

  loader.classList.remove("oculto");

  if (password === "17122024") {
    await typeLines([
      "> Verificando archivo guardado...",
      "✓ Archivo encontrado",
      "✓ Acceso concedido",
    ]);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 6;
      bar.style.width = progress + "%";

      if (progress >= 100) {
        clearInterval(interval);
            message.classList.add("success");
            // show update modal (inside fullLoader)
            const full = document.getElementById("fullLoader");
            if (full) {
              full.classList.remove("oculto");

              const installBtn = document.getElementById("installBtn");
              const skipBtn = document.getElementById("skipBtn");
              const updateActions = document.getElementById("updateActions");
              const updateProgress = document.getElementById("updateProgress");
              const updateFill = document.getElementById("updateFill");
              const updateStatus = document.getElementById("updateStatus");

              // helper to type into the updateStatus
              function typeInto(el, text) {
                return new Promise((resolve) => {
                  el.textContent = "";
                  let i = 0;
                  const t = setInterval(() => {
                    el.textContent += text[i];
                    i += 1;
                    if (i >= text.length) {
                      clearInterval(t);
                      resolve();
                    }
                  }, 18);
                });
              }

              function runInstall() {
                updateActions.classList.add("oculto");
                updateProgress.classList.remove("oculto");
                let p = 0;
                typeInto(updateStatus, "Iniciando instalador...").then(() => {
                  const t = setInterval(() => {
                    p += Math.floor(Math.random() * 8) + 4; // random-ish progress
                    if (p > 100) p = 100;
                    updateFill.style.width = p + "%";
                    if (p >= 30 && p < 70) {
                      updateStatus.textContent = "Descargando archivos... " + p + "%";
                    } else if (p >= 70 && p < 95) {
                      updateStatus.textContent = "Instalando actualizaciones... " + p + "%";
                    } else if (p >= 95) {
                      updateStatus.textContent = "Finalizando... " + p + "%";
                    }
                    if (p >= 100) {
                      clearInterval(t);
                      updateStatus.textContent = "Instalación completada.";
                      setTimeout(() => {
                        window.location.href = "welcome.html";
                      }, 700);
                    }
                  }, 120);
                });
              }

              // attach once
              installBtn.onclick = () => runInstall();
              const updateMessageEl = document.getElementById("updateMessage");
              const updateModal = full.querySelector('.update-modal');

              skipBtn.onclick = () => {
                // Make clear installation is mandatory and prevent skipping
                if (updateMessageEl) {
                  updateMessageEl.textContent = "Actualización obligatoria. Debes instalar para continuar.";
                  updateMessageEl.style.color = "#ff7b72";
                }
                skipBtn.disabled = true;
                skipBtn.classList.add("secondary");
                if (updateModal) {
                  updateModal.classList.add("shake");
                  setTimeout(() => updateModal.classList.remove("shake"), 700);
                }
              };
            } else {
              setTimeout(() => {
                window.location.href = "welcome.html";
              }, 800);
            }
      }
    }, 40);
  } else {
    await typeLines([
      "> Verificando archivo guardado...",
      "✖ Archivo no encontrado",
      "✖ Acceso denegado",
    ]);
    loader.classList.add("oculto");
    message.classList.add("denied");
    input.classList.add("error");
  }
}

// removed duplicate updateCounter; the guarded version below handles real-time updates

// Only run the counter if the elements exist on the page
if (document.getElementById("days") && document.getElementById("hours") && document.getElementById("minutes")) {
  function updateCounter(){
    const startDate = new Date("2024-12-17T19:00:00");
    const now = new Date();
    const diff = now - startDate; // milliseconds elapsed since start

    const msPerMinute = 60 * 1000;
    const msPerHour = 60 * msPerMinute;
    const msPerDay = 24 * msPerHour;

    const days = Math.floor(diff / msPerDay);
    const hours = Math.floor((diff % msPerDay) / msPerHour);
    const minutes = Math.floor((diff % msPerHour) / msPerMinute);

    document.getElementById("days").textContent = days;
    document.getElementById("hours").textContent = hours;
    document.getElementById("minutes").textContent = minutes;
  }

  updateCounter();
  setInterval(updateCounter, 1000); // update every second for realtime accuracy
}