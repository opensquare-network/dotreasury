import { PluginOption } from "vite";

const transformDeps = ["@osn_polkadot-react-identicon"];
const viteDepsFileRegex = /\.[jt]sx?\?v\=[\w\d]+$/;

export function transformDepsProcessEnvToImportMetaEnv(): PluginOption {
  return {
    name: "transform-deps-process-env-to-import-meta-env",
    enforce: "pre",
    transform(code, id) {
      if (!transformDeps.some((name) => id.includes(name))) {
        return;
      }

      if (
        /process\.env/g.test(code) &&
        /node_modules/.test(id) &&
        viteDepsFileRegex.test(id)
      ) {
        return {
          code: code.replace(/process\.env/g, "import.meta.env"),
        };
      }
    },
  };
}
