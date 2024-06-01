const create_panel = () => {
  const panel = document.createElement("div");
  panel.classList.add("summary-panel");
  panel.innerHTML = `
  <button class="close-btn">Close</button>
  <div id="summary-text-container">
    <p id="summary-text">
    Hello
    </p>
    </div>
    `;

  const close_btn = panel.querySelector(".close-btn");
  close_btn.addEventListener("click", function () {
    panel.style.display = "none";
  });

  panel.style.cssText = `
    border: 2px solid black;
    position: fixed;
    bottom: 0;
    right: 0;
    background-color: #090909;
    padding: 10px;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
    display: none;
    font-size: 1.5rem;
    width: 20%;
    height: 50%;
    overflow-y: scroll;
    z-index: 1000;
    `;

  close_btn.style.cssText = `
    float: right;
    padding: 5px;
    border: none;
    cursor: pointer;
    position: sticky;
    top: 0px;
    `;

  document.body.appendChild(panel);

  return panel;
};
