// Solution for 2020, day 04
const isValidNumerical = (digits: number, min: number, max: number) => (
  val: string
) => {
  const num = parseInt(val);
  if (isNaN(num)) return false;
  return val.length === digits && num >= min && num <= max;
};

const isValidHeight = (val: string) => {
  const regex = /^(?<hgt>[0-9]+)(?<un>in|cm)$/;
  const matches = val.match(regex);
  if (!matches?.groups) {
    return false;
  }

  const { hgt, un } = matches.groups;
  const height = parseInt(hgt);

  if (un === "cm") {
    return height >= 150 && height <= 193;
  } else if (un === "in") {
    return height >= 59 && height <= 76;
  }

  return false;
};

const isValidRegex = (regex: RegExp) => (val: string) => regex.test(val);

type Validator = (val: string) => boolean;

const requiredFields: [string, Validator][] = [
  ["byr", isValidNumerical(4, 1920, 2002)],
  ["iyr", isValidNumerical(4, 2010, 2020)],
  ["eyr", isValidNumerical(4, 2020, 2030)],
  ["hgt", isValidHeight],
  ["hcl", isValidRegex(/^#[0-9a-f]{6}$/)],
  ["ecl", isValidRegex(/^amb|blu|brn|gry|grn|hzl|oth$/)],
  ["pid", isValidRegex(/^[0-9]{9}$/)],
];

//type Passport = Partial<FullPassport>;
type Passport = Record<string, string>;

function isValidPassportSimple(passport: Passport) {
  return requiredFields.every(([field]) => !!passport[field]);
}

function isValidPassportAdvanced(passport: Passport/*, log = false*/) {
  /*return requiredFields.every(
    ([field, validate]) => !!passport[field] && validate(passport[field])
  );*/
  const valid = requiredFields.every(([field, validate]) => {
    const hasField = !!passport[field];
    if (!hasField) {
      //log && console.log(`missing ${field} field`);
      return false;
    }
    const valid = validate(passport[field]);
    if (!valid) {
      //log && console.log(`invalid ${field} field`);
      return false;
    }

    return true;
  });

  /*if (!valid) {
    log && console.log(passport);
  }*/

  return valid;
}

function assertTrue(val: boolean) {
  if (!val) throw Error(`Expected true but got false`);
}

function assertFalse(val: boolean) {
  if (val) throw Error(`Expected false but got true`);
}

function testValidators() {
  assertTrue(requiredFields[0][1]("2002"));
  assertFalse(requiredFields[0][1]("2003"));

  assertTrue(requiredFields[1][1]("2010"));
  assertTrue(requiredFields[1][1]("2020"));
  assertFalse(requiredFields[1][1]("2009"));
  assertFalse(requiredFields[1][1]("2021"));

  assertTrue(requiredFields[3][1]("60in"));
  assertTrue(requiredFields[3][1]("190cm"));
  assertFalse(requiredFields[3][1]("190in"));
  assertFalse(requiredFields[3][1]("190"));

  assertTrue(requiredFields[4][1]("#123abc"));
  assertFalse(requiredFields[4][1]("#123abz"));
  assertFalse(requiredFields[4][1]("123abc"));

  assertTrue(requiredFields[5][1]("brn"));
  assertFalse(requiredFields[5][1]("wat"));

  assertTrue(requiredFields[6][1]("000000001"));
  assertFalse(requiredFields[6][1]("0123456789"));
}

async function day04(input: string): Promise<void> {
  testValidators();

  const passports: Passport[] = [];

  let currentPassport: Passport = {};
  // Parse passports
  for (const line of input.split("\n")) {
    // If empty line, open new passport
    if (line.trim() === "") {
      passports.push(currentPassport);
      currentPassport = {};
    }

    // Parse fields
    currentPassport = line
      .split(" ")
      .map((kv) => kv.split(":"))
      .reduce(
        (pp, [k, v]) => ({
          ...pp,
          [k]: v,
        }),
        currentPassport
      );
  }

  assertTrue(passports.length === 287);

  // Validate passports (simple method)
  const validPassports = passports.filter(isValidPassportSimple);
  console.log(`There are ${validPassports.length} valid passports.`);

  // Validate passports (advanced method)
  const validPassportsAdvanced = passports.filter(isValidPassportAdvanced);
  console.log(`There are ${validPassportsAdvanced.length} valid passports.`);
  /*let numValid = 0;
  for (let i = 0; i < passports.length; i++) {
    try {
      const isValid = isValidPassportAdvanced(passports[i]);
      if (isValid) ++numValid;
    } catch (e) {
      console.log("Error at passport " + i, e);
      console.log(passports[i]);
      try {
        isValidPassportAdvanced(passports[i], true);
        
      } catch {}
    }
  }*/
}

export default day04;
