import { getEmbeddedVideoUrl } from "../FigureView";

describe("getEmbeddedVideoUrl", () => {
  it("construts a url using the id and start", () => {
    expect(
      getEmbeddedVideoUrl({ youtubeId: "f2a-3WfkFu4", start: 48, end: 50 })
    ).toBe(
      "https://www.youtube.com/embed/f2a-3WfkFu4?start=48&end=50&version=3"
    );
  });
});
