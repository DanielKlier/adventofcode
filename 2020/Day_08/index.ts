// Solution for 2020, day 08

enum Op {
  acc = "acc",
  jmp = "jmp",
  nop = "nop",
}

interface Inst {
  op: Op,
  arg: number;
  ln: number;
}

function getInstructions(input: string): Inst[] {
  return input.split('\n').map(str => str.split(' ')).map(([op, arg], ln) => ({
    op: Op[op as keyof typeof Op], arg: parseInt(arg, 10), ln
  }));
}

function flip(op: Op): Op {
    if (op === Op.jmp) return Op.nop;
    else if (op === Op.nop) return Op.jmp;
    else return op;
}

function run(instructions: Inst[], trySwitch?: number): number {
  const linesExecuted = new Set<number>();

  let acc = 0;
  let currentLine = 0;

  while(true) {
    let {op, arg, ln} = instructions[currentLine];

    // Part2: switch line
    if (ln === trySwitch) {
      op = flip(op);
    }

    if (linesExecuted.has(currentLine)) {
      throw new Error(`Infinite loop detected at line ${currentLine}. Acc value is ${acc}`);
    }

    linesExecuted.add(currentLine);

    switch(op) {
      case Op.acc:
        acc += arg;
        currentLine += 1;
        break;
      case Op.jmp:
        currentLine += arg;
        break;
      case Op.nop:
      default:
        currentLine += 1;
        break;
    }

    if (currentLine >= instructions.length) {
      break;
    }
  }

  return acc;
}

async function day08(input: string): Promise<void> {
  const instructions = getInstructions(input);
  // Part 1
  try {
    run(instructions);
  } catch(e) {
    console.log(e.message);
  }

  // Part 2
  for (let i = 0; i <instructions.length; i++) {
    let acc;
    
    try {
      acc = run(instructions, i);
    } catch {}

    if (acc !== undefined) {
      const flipped = flip(instructions[i].op);
      console.log(`Fixed the program by flipping '${instructions[i].op}' in line ${i} to '${flipped}'.`);
      console.log(`The accumulator value was ${acc}`);
      break;
    }
  }
}

export default day08;
