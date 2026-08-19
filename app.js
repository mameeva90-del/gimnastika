const plan = [
  ["Понедельник", [
    ["10:30", "Шея и плечи", "Наклоны головы вправо/влево по 6 раз; круги плечами 10 раз"],
    ["14:00", "Ноги и спина", "12 приседаний до стула; 10 подъёмов на носки"],
    ["16:30", "Осанка и разгрузка", "Растяжка груди у дверного проёма по 20 секунд x 2; прогулка 3 минуты"],
  ]],
  ["Вторник", [
    ["10:30", "Шея и плечи", "«Подбородок назад» 8 раз; сведение лопаток 12 раз"],
    ["14:00", "Ноги и спина", "Выпады назад с опорой на стул по 8 на ногу"],
    ["16:30", "Осанка и разгрузка", "Наклоны корпуса в стороны по 8 раз; ходьба 1-2 минуты"],
  ]],
  ["Среда", [
    ["10:30", "Шея и плечи", "Растяжка боковой поверхности шеи по 20 секунд x 2; плечи вверх-вниз 12 раз"],
    ["14:00", "Ноги и спина", "Вставания со стула 12 раз; махи ногой назад по 10 на ногу"],
    ["16:30", "Осанка и разгрузка", "«Кошка-корова» стоя, руки на бёдрах, 10 раз; растяжка икр по 20 секунд"],
  ]],
  ["Четверг", [
    ["10:30", "Шея и плечи", "Повороты головы вправо/влево по 6 раз; круги руками 10 раз"],
    ["14:00", "Ноги и спина", "Неглубокие приседания 12 раз; подъёмы коленей стоя по 10 на ногу"],
    ["16:30", "Осанка и разгрузка", "Растяжка сгибателей бедра в выпаде по 20 секунд на сторону; прогулка 3 минуты"],
  ]],
  ["Пятница", [
    ["10:30", "Шея и плечи", "Сведение лопаток 12 раз; мягкая растяжка шеи по 20 секунд"],
    ["14:00", "Ноги и спина", "Вставания со стула 12 раз; отведение ноги в сторону по 10 на ногу"],
    ["16:30", "Осанка и разгрузка", "Растяжка груди и икр по 20 секунд x 2; ходьба 3 минуты"],
  ]],
];

const storageKey = "office-gymnastics-progress-v1";
const saved = JSON.parse(localStorage.getItem(storageKey) || "{}");
const schedule = document.querySelector("#schedule");

function render() {
  schedule.innerHTML = plan.map(([day, sessions], dayIndex) => {
    const completed = sessions.filter((_, sessionIndex) => saved[`${dayIndex}-${sessionIndex}`]).length;
    return `<article class="day-card" data-day="${dayIndex}">
      <header class="day-header"><h2>${day}</h2><span class="day-total">${completed} из 3 выполнено</span></header>
      <div class="sessions">${sessions.map(([time, focus, exercise], sessionIndex) => {
        const key = `${dayIndex}-${sessionIndex}`;
        const done = Boolean(saved[key]);
        return `<section class="session ${done ? "done" : ""}">
          <label class="session-label">
            <input class="check" type="checkbox" data-key="${key}" ${done ? "checked" : ""} aria-label="Отметить ${day}, ${time}">
            <span class="box" aria-hidden="true">✓</span>
            <span><span class="time">${time}</span><span class="focus">${focus}</span></span>
          </label>
          <p class="exercise">${exercise}</p>
        </section>`;
      }).join("")}</div>
    </article>`;
  }).join("");
  updateProgress();
}

function updateProgress() {
  const completed = Object.values(saved).filter(Boolean).length;
  const percent = Math.round((completed / 15) * 100);
  document.querySelector("#week-count").textContent = `${completed} из 15`;
  document.querySelector("#week-percent").textContent = `${percent}%`;
  document.querySelector("#week-bar").style.width = `${percent}%`;
  document.querySelector("#encouragement").textContent = completed === 15
    ? "Неделя завершена - великолепная работа!"
    : completed === 0 ? "Начните с первой короткой разминки." : `Отлично! Осталось ${15 - completed} ${15 - completed === 1 ? "разминка" : "разминок"}.`;
}

schedule.addEventListener("change", (event) => {
  if (!event.target.matches(".check")) return;
  saved[event.target.dataset.key] = event.target.checked;
  localStorage.setItem(storageKey, JSON.stringify(saved));
  render();
});

document.querySelector("#reset-button").addEventListener("click", () => {
  if (confirm("Сбросить все отметки за неделю?")) {
    Object.keys(saved).forEach((key) => delete saved[key]);
    localStorage.setItem(storageKey, JSON.stringify(saved));
    render();
  }
});

render();
