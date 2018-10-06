Reader.navigation = {
  init() {
    this.contentElement = document.getElementById("article-content");
    this.current = this.getHash();
    this.open(this.current);

    window.onpopstate = ev => {
      if (ev.state) this.open(ev.state, true);
    };
  },

  getHash() {
    const reg = /C(\d+)-Q(\d+)-A(\d+)/gi;
    const hash = location.hash.replace("#", "");
    const result = reg.exec(hash);

    // Url correctly formed
    if (result && result.length == 4) {
      return {
        C: Number(result[1]),
        Q: Number(result[2]),
        A: Number(result[3])
      };
    }

    // Or ... not
    return false;
  },

  updateUrl(target) {
    if (history) {
      history.pushState(target, "", `#C${target.C}-Q${target.Q}-A${target.A}`);
    }
  },

  open(target, noHistory) {
    const boxContainer = document.createElement("div");
    boxContainer.classList.add("boxes-container");

    const loadingIcon = this.createLoadIcon();
    this.contentElement.parentElement.scrollTop = 0;

    /* Load home page ( Sommaire ) */

    if (!target || !target.C) {
      boxContainer.innerHTML =
        `<div class="head">` +
        `<h1>${Reader.sommaire.title}</h1>` +
        `<h2>${Reader.sommaire.description}</h2>` +
        `<h3>SOMMAIRE</h2>` +
        `</div>`;

      const boxes = {};

      // Prepare Categories boxes

      const min = Reader.categoriesRange[0];
      const max = Reader.categoriesRange[1];

      for (let i = min; i <= max; i++) {
        boxes[i] = document.createElement("div");
        boxes[i].classList.add("anim-fade");
        boxContainer.appendChild(boxes[i]);
      }

      this.contentElement.appendChild(boxContainer);

      // Display loading icon
      this.contentElement.appendChild(loadingIcon);

      // Event on load

      const displaySummaries = (content, index) => {
        boxes[index].innerHTML =
          `<div class="title">${content.title}</div>` +
          `<div class="text less">${content.introduction}</div>`;
        boxes[index].style.opacity = 1;

        // When it's done remove the loader icon
        if (index >= max) loadingIcon.parentElement.removeChild(loadingIcon);
      };

      // Get all categpries summaries
      Reader.loader.chainLoad("C", Reader.categoriesRange, displaySummaries);
      return;
    }

    /* Load Articles */

    this.contentElement.innerHTML = ``;
    this.contentElement.appendChild(loadingIcon);
    loadingIcon.classList.add("loader-full");

    Reader.loader.get("Q" + target.Q, result => {
      // Select article and open Summaries if it doesn't exist
      const article = result["A" + target.A];
      if (!article) return this.open();

      // Create next article button
      const nextButton = document.createElement("div");
      const hr = document.createElement("hr");
      hr.style.margin = '7.5em auto 0 auto';
      nextButton.classList.add("next-button");

      // Select next article
      let nextTarget = {
        article: Reader.skeleton["Q" + target.Q]["A" + (target.A + 1)],
        question: Reader.skeleton["Q" + target.Q]
      };

      // Select first article from next question
      if (!nextTarget.article) {
        const nextQuestion = Reader.skeleton["Q" + (target.Q + 1)];
        nextTarget = {
          article: nextQuestion ? nextQuestion.A1 : null,
          question: nextQuestion
        };
      }

      // Bottom reached use the very first article
      if (!nextTarget.article) {
        nextTarget = {
          article: Reader.skeleton.Q1.A1,
          question: Reader.skeleton.Q1
        };
      }

      // Create this button
      nextButton.innerHTML =
        `<div><i class="i-right"></i>` +
        `<h4>ARTICLE SUIVANT</h4></div>` +
        `<span>${nextTarget.article.title}</span>`;

      // Add events on this button
      nextButton.onclick = () =>
        this.open({
          C: nextTarget.question.category,
          Q: nextTarget.question.nb,
          A: nextTarget.article.nb
        });

      // Display content
      boxContainer.innerHTML =
        `<div class="head">` +
        `<h1>QUESTION ${result.nb}</h1>` +
        `<h2>ARTICLE ${article.nb} - ${
          article.title
        }</h2></div>` +
        `<hr>` +
        article.content;

      boxContainer.appendChild(hr);
      boxContainer.appendChild(nextButton);
      this.contentElement.removeChild(loadingIcon);
      this.contentElement.appendChild(boxContainer);

      if (!noHistory) this.updateUrl(target);
    });
  },

  createLoadIcon(callback) {
    const loadingIcon = document.createElement("i");
    loadingIcon.classList.add("i-spin");
    loadingIcon.classList.add("anim-spin");

    return loadingIcon;
  }
};
