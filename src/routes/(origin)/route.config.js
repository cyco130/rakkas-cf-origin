// @ts-check
import process from "node:process";

/** @type {import("rakkasjs").RouteConfigExport} */
export default (cfg) => ({
  disabled: cfg.build.ssr ? process.env.RAKKAS_BUILD_TYPE !== "origin" : false,
});
