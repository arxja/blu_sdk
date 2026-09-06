import { BluNode, type BluNodeOptions } from "@blu/sdk-node";

let serverInstance: BluNode | null = null;

export function getBluServer(options?: BluNodeOptions): BluNode {
  if (!serverInstance) {
    if (!options?.apiKey && !process.env.BLU_API_KEY) {
      throw new Error(
        "[Blu Next SDK] Missing API Key. Pass apiKey in options or set BLU_API_KEY env variable.",
      );
    }

    serverInstance = new BluNode({
      apiKey: options?.apiKey || process.env.BLU_API_KEY!,
      apiHost: options?.apiHost || process.env.BLU_API_HOST,
      ...options,
    });
  }

  return serverInstance;
}

export * from "@blu/sdk-node";
