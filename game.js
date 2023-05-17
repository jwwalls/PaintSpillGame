let movesUsed = 0;
let gridSize = 10;
const colorArray = [
  {
    color: "#FF1500",
    icon: "img/accesibility/icon-1.svg",
  },
  {
    color: "#f9c440",
    icon: "img/accesibility/icon-2.svg",
  },
  {
    color: "#68b723",
    icon: "img/accesibility/icon-3.svg",
  },
  {
    color: "#3689e6",
    icon: "img/accesibility/icon-4.svg",
  },
  {
    color: "#a56de2",
    icon: "img/accesibility/icon-5.svg",
  },
  {
    color: "#C16700",
    icon: "img/accesibility/icon-6.svg",
  },
];

let previous_color = "";

window.addEventListener("load", setup_board);

function setup_board(event = null) {
  document.querySelectorAll(".color-pot").forEach((el, i) => {
    let box_icon = colorArray[i].icon;
    el.style.backgroundColor = colorArray[i].color;

    el.setAttribute("data-color", colorArray[i].color);
    el.setAttribute("data-icon", box_icon);
    el.querySelector(".accesbility_box").src = box_icon;
    el.addEventListener("click", spill_color);

    el.classList.remove("last_clicked");
  });

  const playground = document.getElementById("playground");
  playground.innerHTML = "";
  for (let i = 0; i < gridSize; i++) {
    let row = document.createElement("div");
    row.className = "row";
    for (let j = 0; j < gridSize; j++) {
      let box = document.createElement("div");
      box.className = "box";
      let color_index = parseInt(Math.random() * colorArray.length);
      let box_color = colorArray[color_index].color;
      let box_icon = colorArray[color_index].icon;
      box.setAttribute("data-color", box_color);
      box.setAttribute("data-icon", box_icon);
      box.setAttribute("data-identifiers", `${i}-${j}`);
      let access_box = document.createElement("img");
      access_box.classList.add("accesbility_box");
      access_box.src = box_icon;
      box.appendChild(access_box);
      box.style.backgroundColor = box_color;    
      
      row.appendChild(box);
    }
    playground.appendChild(row);
  }
  if (event == null) {
    document.querySelector(".modal-wrapper").style.display = "none";
  }
  document.querySelector(".modal-wrapper .victory-message").innerHTML = "";
  update_high_scores_display();
  movesUsed = 0;
  update_score();

  // accesibility from localStorage
  let previous_accesibility_value = window.localStorage.getItem(
    "accesibility_show_icons"
  );
  if (previous_accesibility_value == null) {
    window.localStorage.setItem("accesibility_show_icons", "false");
    previous_accesibility_value = "false";
  }

  if (previous_accesibility_value == "true") {
    document
      .querySelector("#accesibility_checkbox")
      .setAttribute("checked", true);
  } else {
    document.querySelector("#accesibility_checkbox").removeAttribute("checked");
  }
  toggle_accesibility();
}

let user_high_scores;
function update_high_scores_display() {
  // finding previous high scores
  const prev_high_scores = window.localStorage.getItem("high_scores");
  if (prev_high_scores) {
    user_high_scores = JSON.parse(prev_high_scores);
    document.getElementById("score-easy-figure").innerText =
      user_high_scores.easy ?? "--";
    document.getElementById("score-normal-figure").innerText =
      user_high_scores.normal ?? "--";
    document.getElementById("score-hard-figure").innerText =
      user_high_scores.hard ?? "--";
  } else {
    window.localStorage.setItem(
      "high_scores",
      JSON.stringify({
        easy: null,
        normal: null,
        hard: null,
      })
    );
    update_high_scores_display();
  }
}

function update_high_score_localstorage() {
  const current_mode = { 5: "easy", 10: "normal", 15: "hard" }[gridSize];
  if (
    user_high_scores[current_mode] > movesUsed ||
    user_high_scores[current_mode] == null
  ) {
    user_high_scores[current_mode] = movesUsed;
    window.localStorage.setItem(
      "high_scores",
      JSON.stringify(user_high_scores)
    );
    update_high_scores_display();
  }
}
function set_game_mode(tiles = 10) {
  gridSize = tiles;
}
function spill_color(event) {
  let color_box = event.target;
  document
    .querySelectorAll(".color-pot")
    .forEach((el) => el.classList.remove("last_clicked"));
  color_box.classList.add("last_clicked");
  let color_to_spread = color_box.getAttribute("data-color");
  let icon_to_spread = color_box.getAttribute("data-icon");

  let first_box = document.querySelector(
    ".playground .row:first-of-type .box:first-of-type"
  );
  previous_color = getcolor(first_box).color;

  // to be done, check if the color clicked is different from what already is
  if (color_to_spread == previous_color) {
    return;
  }

  movesUsed++;
  update_score();
  setcolor(first_box, color_to_spread, icon_to_spread);

  spill_to_adjacent_boxes(first_box);
 
 
  

  let victory = check_if_game_over();
  if (victory) {
    do_a_victory_lap();
  }
}

function do_a_victory_lap() {
  document.querySelector(
    ".modal-wrapper .victory-message"
  ).innerHTML = `Victory in ${movesUsed} moves.`;
  document.querySelector(".modal-wrapper").style.display = "";
  confetti({
    particleCount: 200,
    spread: 70,
    origin: { y: 0.6 },
  });
  // updating high scores
  update_high_score_localstorage();
}
function check_if_game_over() {
  let color_pending = new Set();
  document
    .querySelectorAll(".box")
    .forEach((box) => color_pending.add(getcolor(box).color));
  return color_pending.size == 1;
}

function update_score() {
  const score_span = document.querySelector(".info-box .score");
  score_span.innerText = `Moves used ${movesUsed}`;
}
function find_adjacent_boxes(box) {
    let return_arary = [];
  
    const to_right = box.nextElementSibling;
    const to_left = box.previousElementSibling;
  
    const row_id = parseInt(box.getAttribute("data-identifiers").split("-")[0]);
    const col_id = parseInt(box.getAttribute("data-identifiers").split("-")[1]);
  
    const to_top = document.querySelector(`.box[data-identifiers='${row_id - 1}-${col_id}']`);
    const to_bottom = document.querySelector(`.box[data-identifiers='${row_id + 1}-${col_id}']`);
  
    if (to_right) {
      return_arary.push(to_right);
    }
    if (to_left) {
      return_arary.push(to_left);
    }
    if (to_top) {
      return_arary.push(to_top);
    }
    if (to_bottom) {
      return_arary.push(to_bottom);
    }  
    return return_arary;
  }
  

  function spill_to_adjacent_boxes(first_box) {
    let adjacent_boxes = find_adjacent_boxes(first_box);
    var current_color = getcolor(first_box).color;
    var current_icon = getcolor(first_box).icon;
  
    let more_boxes_to_process = [];
    adjacent_boxes.forEach((box) => {
      if (getcolor(box).color == previous_color) {
        setcolor(box, current_color, current_icon);
   
        more_boxes_to_process.push(box);
      }
    });
    more_boxes_to_process.forEach((box) => spill_to_adjacent_boxes(box));
  }

  
  
  
  
  

function getcolor(box) {
  return {
    color: box.getAttribute("data-color"),
    icon: box.querySelector(".accesbility_box").src,
  };
}

function setcolor(box, color, icon) {
    box.setAttribute("data-color", color);
    box.style.backgroundColor = color;
    box.querySelector(".accesbility_box").src = icon;
  }
  

function toggle_accesibility() {
  const accesibility = document.querySelector("#accesibility_checkbox").checked;
  if (accesibility) {
    document.querySelector(".playground").classList.add("show_icons");
    document.querySelector(".color-pots").classList.add("show_icons");
    window.localStorage.setItem("previous_accesibility_value", "true");
  } else {
    document.querySelector(".playground").classList.remove("show_icons");
    document.querySelector(".color-pots").classList.remove("show_icons");

    window.localStorage.setItem("previous_accesibility_value", "false");
  }
}
