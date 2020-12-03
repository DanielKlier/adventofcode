export {};

function usage() {
  console.log("./run.sh year day");
  console.log("Example: ./run.sh 2020 3");
}

function exitError(error: string|Error) {
  console.error(error);
  Deno.exit(1);
}

function exitErrorUsage(error: string|Error) {
  console.error(error);
  usage();
  Deno.exit(1);
}

(async function () {
  const [year, day] = Deno.args;

  if (!year || !day) {
    exitErrorUsage("Invalid arguments given");
  }

  const dayForPath = day.padStart(2, '0');

  let foundModule;

  for (const ext of ["ts", "js"]) {
    const path = `./${year}/Day_${dayForPath}/index.${ext}`;
    try {
      foundModule = await import(path);
    } catch {}
  }

  if (!foundModule) {
    exitError(`Did not find a program for ${year}/day ${day}`);
  }

  if (typeof foundModule.default !== "function") {
    exitError("The module does not export a default function");
  }

  let input;
  const inputPath = `./${year}/Day_${dayForPath}/input.txt`
  try {
    input = await Deno.readTextFile(inputPath);
  } catch {
    exitError(`Could not read problem input. Place your input in a file '${inputPath}'`)
  }
  
  try {
    await foundModule.default(input);
  } catch (e) {
    exitError(e);
  }
})();
