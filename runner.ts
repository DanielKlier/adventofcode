export {};

(async function () {
  const [year, day] = Deno.args;
  let foundModule;

  for (const ext of ["ts", "js"]) {
    const path = `./${year}/Day_${day}/index.${ext}`;
    try {
      foundModule = await import(path);
    } catch {}
  }

  if (!foundModule) {
    console.error(`Did not find a program for ${year}/day ${day}`);
    Deno.exit(1);
  }

  if (typeof foundModule.default !== "function") {
    console.error("The module does not export a default function");
    Deno.exit(1);
  }

  try {
    await foundModule.default();
  } catch (e) {
    console.error(e);
    Deno.exit(1);
  }
})();
