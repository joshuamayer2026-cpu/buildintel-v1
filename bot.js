import lookup from "./src/commands/lookup.js";
import report from "./src/commands/report.js";

function buildIntel(request, mode) {
  if (mode === "lookup") {
    return lookup(request);
  }

  if (mode === "report") {
    return report(request);
  }

  return { error: "Unknown mode" };
}

export default buildIntel;
