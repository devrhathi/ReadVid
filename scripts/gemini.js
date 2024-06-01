let API_KEY = "";

window.addEventListener("api_key_submitted", function (event) {
  const inputText = event.detail;
  API_KEY = inputText;
});

const get_metadata = async (video_id) => {
  const GOOGLE_CLOUD_API_KEY = "";
  const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${video_id}&key=${GOOGLE_CLOUD_API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.items.length === 0) {
      document.getElementById("metadata").innerText = "Video not found";
      return;
    }

    const video = data.items[0];
    //     const final_metadata = `
    //     Title: ${video.snippet.title}\n
    //     Description: ${video.snippet.description}\n
    //     Published at: ${video.snippet.publishedAt}\n
    //     Channel: ${video.snippet.channelTitle}\n
    //     View count: ${video.statistics.viewCount}\n
    //     Like count: ${video.statistics.likeCount}\n
    //     Dislike count: ${video.statistics.dislikeCount}\n
    // `;

    const final_metadata = `
      Title: ${video.snippet.title}\n
      Description: ${video.snippet.description}\n
      Published at: ${video.snippet.publishedAt}\n
      Channel: ${video.snippet.channelTitle}\n
  `;
    return final_metadata;
  } catch (error) {
    console.error("Error fetching video metadata:", error);
  }
};

const get_transcript = async (video_id) => {
  async function fetchCaptionsFromUrl(url) {
    let allCaptions = [];
    let nextUrl = url;

    while (nextUrl) {
      const response = await fetch(nextUrl);
      const captionsXml = await response.text();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(captionsXml, "text/xml");

      const texts = xmlDoc.getElementsByTagName("text");
      for (let i = 0; i < texts.length; i++) {
        allCaptions.push(texts[i].textContent);
      }

      // Check if there is a continuation token for next set of captions
      const nextPageUrl = xmlDoc.querySelector("continuation");
      nextUrl = nextPageUrl ? nextPageUrl.getAttribute("href") : null;
    }

    return allCaptions;
  }

  async function fetchYouTubeCaptions() {
    try {
      // Fetch the video page HTML
      const response = await fetch(
        `https://www.youtube.com/watch?v=${video_id}`
      );
      const html = await response.text();

      // Extract the caption tracks URL
      const regex = /"captionTracks":\[.*?("baseUrl":"(.*?)")/;
      const match = regex.exec(html);
      if (!match || match.length < 3) {
        throw new Error("Captions URL not found");
      }
      let captionsUrl = match[2].replace(/\\u0026/g, "&");

      // Fetch all captions by handling pagination
      const captions = await fetchCaptionsFromUrl(captionsUrl);

      // Output the captions
      final_captions = captions.join("\n");
    } catch (error) {
      console.error("Error fetching captions:", error);
    }
    return final_captions;
  }

  return await fetchYouTubeCaptions();
};

const get_summary = async (vid_url, panel) => {
  const video_id = vid_url.split("=")[1];
  const video_metadata = await get_metadata(video_id);
  const video_transcript = await get_transcript(video_id);

  const prompt = `Summarize this youtube video, keep the summary very concise and short:\nVideo Metadata:\n${video_metadata}\n\nVideo Transcript\n${video_transcript}`;

  const data = {
    contents: [
      {
        parts: [
          {
            text: prompt,
          },
        ],
      },
    ],
  };

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key=${API_KEY}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const responseData = await response.json();
  console.log(responseData);
  let modelResponse = responseData.candidates[0].content.parts[0].text;

  // for (let i = 0; i < responseData.candidates[0].content.parts.length; i++) {
  // modelResponse += responseData.candidates[0].content.parts[i].text;
  // }

  document.getElementById("summary-text").textContent = modelResponse;
  panel.style.display = "block";
};
