import type { Plugin } from "@elizaos/core";
import { createPrediction } from "./actions/createPrediction.ts";

//export * from "./actions/bridge";
// export * from "./actions/submitData";
// export * from "./actions/transfer";
// import createPrediction from "./actions/createPrediction";

// import { bridgeAction } from "./actions/bridge";
// import transfer from "./actions/transfer";
// import submitData from "./actions/submitData";

export const pluginPrediciton: Plugin = {
  name: "prediciton",
  description: "Prediction Market plugin",
  providers: [],
  evaluators: [],
  services: [],
  actions: [createPrediction],
};
