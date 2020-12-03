interface Password {
  pass: string;
  char: string;
  min: number;
  max: number;
}

function getPasswords(input: string): Password[] {
  const lines = input.split("\n").filter((l) => l.trim().length > 0);
  const passwords = lines.map((line) => {
    const groups = line
      .trim()
      .match(/^(?<min>\d+)-(?<max>\d+) (?<char>\w): (?<pass>.*)$/)?.groups;

    if (!groups) {
      return null;
    }

    return (groups as unknown) as Password;
  });

  if (lines.length !== passwords.length) {
    throw new Error("Invalid input!");
  }

  return passwords as Password[];
}

function isPasswordValid(password: Password): boolean {
  const numChar = password.pass
    .split("")
    .reduce((num, c) => (num += c === password.char ? 1 : 0), 0);

  return numChar >= password.min && numChar <= password.max;
}

function isPasswordValidNewPolicy(password: Password): boolean {
  const charInMinPos = password.pass[password.min - 1] === password.char;
  const charInMaxPos = password.pass[password.max - 1] === password.char;
  return charInMinPos && !charInMaxPos || charInMaxPos && !charInMinPos;
}

async function day2(input: string) {
  const passwords = getPasswords(input);

  const validPasswords = passwords.filter(isPasswordValid);
  const validPasswordsNewPolicy = passwords.filter(isPasswordValidNewPolicy);

  console.log(`There are ${validPasswords.length} valid passwords.`);
  console.log(`There are ${validPasswordsNewPolicy.length} valid passwords according to the new policy.`);
}

export default day2;
