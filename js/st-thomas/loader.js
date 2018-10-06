Reader.loader = {
  init(callback) {
    this.loaded = {};
    this.loadUID = this.genUID();

    // Return Skeleton of the book
    this.get("SKELETON", callback);
  },

  genUID() {
    return Math.round(Math.random() * 1e16).toString(32);
  },

  get(file, callback) {
    // Already loaded before
    if (this.loaded[file]) return callback(this.loaded[file]);

    // Prevent load conflicts;
    const currentUID = this.genUID();
    this.loadUID = currentUID;

    // Need to be loaded
    fetch(`/ST-Thomas/${file}.json`)
      .then(response => response.json())
      .then(response => {
        if (this.loadUID != currentUID) return;
        this.loaded[file] = response;
        callback(this.loaded[file]);
      });
  },

  chainLoad(prefix, range, exec) {
    const chain = state => {
      if (state > maxState) return;

      this.get(prefix + state, result => {
        exec(result, state);
        chain(state + 1);
      });
    };

    const maxState = range[1];
    chain(range[0]);
  }
};
