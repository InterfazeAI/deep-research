import { JigsawStack } from "jigsawstack";

export class JigsawProvider {
  public jigsawInstance: ReturnType<typeof JigsawStack>;

  constructor({ apiKey }: { apiKey?: string }) {
    this.jigsawInstance = JigsawStack({
      apiKey: apiKey || process.env.JIGSAW_API_KEY,
    });
  }
}
