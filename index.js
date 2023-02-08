url = `/data.json`;

async function getDashbordData(url) {
  const respons = await fetch(url);
  const data = await respons.json();
  console.log(data);
  return data;
}

class DashboardItem {
  static PERIOD = {
    daily: "day",
    weekly: "week",
    mountly: "mounth",
  };
  constructor(data, container = ".dashboard__content", view = "daily") {
    this.data = data;
    this.container = document.querySelector(container);
    this.view = view;
    this.createMurkup();
  }

  createMurkup() {
    const { title, timeframes } = this.data;
    const id = title.toLowerCase().replace(/ /g, "-");
    const { current, previous } = timeframes[this.view.toLowerCase()];

    this.container.insertAdjacentHTML(
      "beforeend",
      `
        <div class="dashboard__item dashboard__item--${id}">
        <article class="tracking-card">
        <header class="tracking-card__header">
          <h4 class="tracking-card__title">${title}</h4>
          <img src="images/icon-ellipsis.svg" alt="menu" class="tracking-card__menu">
        </header>
        <div class="tracking-card__body">
          <div class="tracking-card__time">${current}hrs</div>
          <div class="tracking-card__prev-period">Last ${
            DashboardItem.PERIOD[this.view]
          } - ${previous}hrs</div>
        </div>  
        </article>
      </div>`
    );
    this.time = this.container.querySelector(
      `.dashboard__item--${id} .tracking-card__time`
    );
    this.prev = this.container.querySelector(
      `.dashboard__item--${id} .tracking-card__prev-period`
    );
  }

  changeView(view) {
    this.view = view.toLowerCase();
    const { current, previous } = this.data.timeframes[this.view.toLowerCase()];
    this.time.innerText = `${current}hrs`;
    this.prev.innerText = `Last ${
      DashboardItem.PERIOD[this.view]
    } - ${previous}hrs`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  getDashbordData(url).then((data) => {
    const activities = data.map((activity) => new DashboardItem(activity));

    const selectors = document.querySelectorAll('.view_selector__item');
    selectors.forEach( selector => selector.addEventListener('click', ()=>{
      selectors.forEach( sel => sel.classList.remove(`view_selector__item--active`))
      selector.classList.add(`view_selector__item--active`)
      const currentView = selector.innerText.trim().toLowerCase();
      activities.forEach( activiti => activiti.changeView(currentView))
      
    }))
    
  });
});
