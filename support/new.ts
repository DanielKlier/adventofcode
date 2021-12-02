// Generates a new puzzle from a template
import { emptyDir, exists } from "https://deno.land/std/fs/mod.ts";
import { dirname, fromFileUrl, join } from "https://deno.land/std/path/mod.ts";
import { engineFactory } from "https://deno.land/x/view_engine@v1.5.0/mod.ts";

const wd = dirname(fromFileUrl(import.meta.url));
const handlebarsEngine = engineFactory.getHandlebarsEngine();

export {};

async function readTemplate(name: string): Promise<string> {
  const path = join(wd, `${name}.handlebars`);
  console.debug(`Reading template from ${path}`);
  return await Deno.readTextFile(path);
}

(async function generate() {
  const [year, day] = Deno.args;
  const dayPadded = day.padStart(2, "0");
  const targetDir = join(wd, `../${year}/Day_${dayPadded}`);

  if (await exists(targetDir)) {
    console.log(
      `Directory ${targetDir} already exists. Skipping bootstrapping.`
    );
    Deno.exit(1);
  }

  await emptyDir(targetDir);

  for (const name of ["index.ts", "input.txt"]) {
    const template = await readTemplate(name);
    const rendered = handlebarsEngine(template, { year, day: dayPadded });
    console.debug(`Writing template to ${join(wd, targetDir, name)}`);
    await Deno.writeTextFile(join(targetDir, name), rendered);
  }
})();
