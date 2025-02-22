import type { Plugin } from "@elizaos/core";
import { createPrediction } from "./actions/createPrediction.js";

//export * from "./actions/bridge";
// export * from "./actions/submitData";
// export * from "./actions/transfer";
// import createPrediction from "./actions/createPrediction";

// import { bridgeAction } from "./actions/bridge";
// import transfer from "./actions/transfer";
// import submitData from "./actions/submitData";

export const predictionPlugin: Plugin = {
  name: "prediction",
  description: "Creates prediction markets for betting on future outcomes",
  providers: [],
  evaluators: [],
  services: [],
  actions: [createPrediction],
};
