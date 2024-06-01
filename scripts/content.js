const config = { attributes: false, childList: true, subtree: false };
const panel = create_panel();

const add_to_list = (video_list, node_list) => {
  node_list.forEach((node) => {
    video_list.add(node.href);
  });
};

const add_buttons = (video_list, node_list) => {
  node_list.forEach((node) => {
    if (video_list.has(node.href)) {
      return;
    }
    const genBtn = document.createElement("button");
    genBtn.textContent = "Gen";
    genBtn.addEventListener("click", async () => {
      await get_summary(node.href, panel);
    });
    node.parentElement.parentElement.appendChild(genBtn);
  });
};

function callback_body(_mutationList, observer_body) {
  videoListElement = document.getElementById("contents");
  if (!videoListElement) return;

  const video_list = new Set();

  const video_title_list = videoListElement.querySelectorAll(
    "[id=video-title-link]"
  );
  add_buttons(video_list, video_title_list);
  add_to_list(video_list, video_title_list);

  observer_body.disconnect();

  const callback = (mutationList, observer) => {
    for (const mutation of mutationList) {
      if (mutation.type === "childList") {
        mutation.addedNodes.forEach((node_list) => {
          const video_title_list = node_list.querySelectorAll(
            "[id=video-title-link]"
          );
          add_buttons(video_list, video_title_list);
          add_to_list(video_list, video_title_list);
        });
      }
    }
  };
  const observer = new MutationObserver(callback);
  observer.observe(videoListElement, config);
}

const observer_body = new MutationObserver(callback_body);
observer_body.observe(document.body, config);
