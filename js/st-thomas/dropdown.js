Reader.dropdown = {
  init() {
    this.skeleton = Reader.skeleton;
    this.leftMenu = document.getElementById("article-questions-nav");
    this.leftMenu.appendChild(this.createCategories());
    this.onloaded();
  },

  createCategories() {
    const menuCategories = document.createDocumentFragment();

    for (let i = 1, len = Reader.categoriesRange[1]; i <= len; i++) {
      const category = this.skeleton["C" + i];
      const box = document.createElement("div");

      box.classList.add("dropdown");
      box.classList.add("main-dropdown");

      box.innerHTML =
        `<div data-display="block" onclick="Reader.dropdown.hideAfter(this)" class="drop-head">` + `<p><i>${category.title}</i></p></div>`;

      box.appendChild(this.createQuestions(category));
      menuCategories.appendChild(box);
    }

    return menuCategories;
  },

  createQuestions(category) {
    const menuQuestions = document.createDocumentFragment();

    for (let i = category.range[0], len = category.range[1]; i <= len; i++) {
      const question = this.skeleton["Q" + i];
      const box = document.createElement("div");

      box.classList.add("dropdown");

      box.innerHTML =
        `<div data-display="block" onclick="Reader.dropdown.hideAfter(this)" class="drop-head"><i class="i-down ic"></i>` +
        `<p><b>QUESTION ${question.nb}</b>` +
        `<i>${question.title}</i></p></div>`;

      question.category = category.nb;
      box.appendChild(this.createArticles(question));
      menuQuestions.appendChild(box);
    }

    return menuQuestions;
  },

  createArticles(question) {
    const menuArticles = document.createDocumentFragment();

    for (let i = 1, len = question.articles; i <= len; i++) {
      const article = question["A" + i];
      const box = document.createElement("div");

      box.classList.add("dropdown");

      box.innerHTML =
        `<div data-display="block" onclick="Reader.dropdown.hideAfter(this)" class="drop-head">` +
        `<p><b>ARTICLE ${article.nb}</b>` +
        `<i>${article.title}</i></p></div>`;

      // Add event
      const target = {
        C: question.category,
        Q: question.nb,
        A: i
      };
      box.onclick = () => {
        console.log(target);
        Reader.navigation.open(target);
      };

      menuArticles.appendChild(box);
    }

    return menuArticles;
  },

  hideAfter(elem) {
    const display = elem.dataset.display;
    const parent = elem.parentElement;
    const childs = parent.childNodes;
    childs.forEach(e => {
      if (e.className === 'drop-head') return elem.dataset.display = (display === 'none') ? 'block' : 'none';
      e.style.display = (display === 'none') ? 'block' : 'none';
    });
  },

  onloaded() {
    const parent = document.getElementById('article-questions-nav');
    const elements = parent.querySelectorAll('.drop-head');
    elements.forEach(e => {
      this.hideAfter(e);
    })
  }
};
