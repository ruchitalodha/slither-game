function createGrid() {
  document.getElementById("grid").innerHTML = "";
  var rows = Number(document.getElementById("rowInput").value);
  var cols = Number(document.getElementById("colInput").value);
  var grid = new Grid({
    rows,
    cols,
    render: {
      placeholder: "grid"
    }
  });
}

function getSlitherPath({ x: x2, y: y2 }, rows, cols) {
  var row = 0;
  var col = 0;
  var left = 0;
  var xdir = 0;
  var res = [{ x: 0, y: 0 }];
  while ((row < rows) & (col < cols)) {
    if (row === x2 && col === y2) {
      break;
    }
    xdir = row % 2 ? -1 : 1;
    if ((col === 0 && xdir === -1) || (col === (cols - 1) && xdir === 1)) {
      row += 1;
    } else {
      col += xdir;
    }
    res.push({ y: row, x: col });
  }
  return res;
}

class Cell {
  constructor({ x, y, onClick }) {
    this.el = document.createElement("div");
    this.el.className = "cell";
    this.x = x;
    this.y = y;
    this.setActive = active => {
      if (active) {
        this.el.classList.add("change");
      } else {
        this.el.classList.remove("change");
      }
    };
    this.el.addEventListener(
      "click",
      e => {
        onClick(this);
      },
      false
    );
  }
}

class Grid {
  constructor({ rows, cols, render }) {
    this.grid = []
    this.cells = []
    this.rowsCount = rows
    this.colsCount = cols
    this.rows = []
    this.cols = []
    this.currentActive = null
    this.timer = null
    if (render) {
      this.placeholder = render.placeholder;
      this.render();
    }
  }
  createCell(config) {
    return new Cell(config);
  }
  getCellAt(x, y) {
    if (!this.grid[y]) {
      return false;
    }
    if (!this.grid[y][x]) {
      return false;
    }
    return this.grid[y][x];
  }
  selectActive(cellObj) {
    this.currentActive && this.currentActive.setActive(false);
    this.currentActive = cellObj;
    this.currentActive.setActive(true);
  }
  slither (path) {
    if (!path.length) {
      return
    }
    let target = path.splice(0, 1)[0]
    this.selectActive(this.grid[target.y][target.x])
    window.clearTimeout(this.timer)
    this.timer = window.setTimeout(() => {this.slither(path)}, 50)
  }
  clickHandler(cellObj) {
    path = [];
    let grid = this.grid;
    var path = getSlitherPath(
      { x: cellObj.y, y: cellObj.x },
      this.rowsCount,
      this.colsCount
    );
    this.slither(path)
  }
  render() {
    var gridDiv = document.getElementById(this.placeholder);
    if (!this.placeholder || this.placeholder.length === 0) {
      return;
    }
    var i,
      j,
      row,
      cell,
      cellObj = 0;
    for (i = 0; i < this.rowsCount; i++) {
      this.grid[i] = [];
      var row = document.createElement("div");
      row.className = "row";
      gridDiv.appendChild(row);
      for (j = 0; j < this.colsCount; j += 1) {
        let x = j;
        let y = i;
        let cell = this.createCell({
          x,
          y,
          onClick: this.clickHandler.bind(this)
        });
        row.appendChild(cell.el);
        this.grid[i].push(cell);
        this.cells.push(cell);
      }
    }
    var self = this;
    this.grid.forEach(function(row) {
      self.rows.push(row);
    });
  }
}