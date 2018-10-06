const Reader = {
  init() {
    /* Default configuration */

    this.sommaire = {
      title: `<span style="font-family: 'Playfair'; font-weight: normal; font-size: 1.6em;">
                ST THOMAS D'AQUIN
              </span>`,
      description: `LA MORALE PRISE PAR LE PARTICULIER<br/><hr>`
    };

    this.categoriesRange = [1, 11];

    /* Init page load */

    this.loader.init(skeleton => {
      this.skeleton = skeleton;

      this.dropdown.init();
      this.navigation.init();
    });
  }
};

document.addEventListener("DOMContentLoaded", () => Reader.init());
