import { createStarryNight } from "@wooorm/starry-night";

// https://vercel.com/guides/why-does-my-serverless-function-work-locally-but-not-when-deployed
// https://github.com/wooorm/starry-night/issues/9
export function createStarryNightWithLocal(
  grammars: Parameters<typeof createStarryNight>[0]
) {
  return createStarryNight(grammars, {
    getOnigurumaUrlFs: () => {
      return new URL(
        "./vendor/vscode-oniguruma/onig.wasm",
        `file://${process.cwd()}/`
      );
    },
  });
}
