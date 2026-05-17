export async function submitToIndexNow(urls: string[]) {
  const key = "a5dc33868966453ba7615aeabdc9ed7a";
  const host = "worthulator.com";

  const body = {
    host: host,
    key: key,
    urlList: urls,
  };

  try {
    await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  } catch (err) {
    console.error("IndexNow error:", err);
  }
}
