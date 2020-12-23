// Solution for 2020, day 21
import { lines } from "../utils/input.ts";

type Ingredient = string;
type Allergen = string;
interface FoodListing {
  ingredients: Set<Ingredient>;
  allergens: Set<Allergen>;
}
interface Input {
  allergens: Set<Allergen>;
  foods: FoodListing[];
  mapAllergensToIngredients: Map<Allergen, FoodListing[]>;
}

function intersection<T>(...sets: Set<T>[]): Set<T> {
  const result = new Set<T>();
  if (!sets.length) return result;
  sets[0].forEach(item => {
    if (sets.every(s => s.has(item))) result.add(item);
  })
  return result;
}

function difference<T>(a: Set<T>, b: Set<T>) {
  const result = new Set<T>();
  a.forEach(item => {
    if (!b.has(item)) result.add(item);
  });
  return result;
}

function union<T>(...sets: Set<T>[]): Set<T> {
  const result = new Set<T>();
  sets.forEach(s => s.forEach(it => result.add(it)));
  return result;
}

function parseList(input: string): Input {
  const allergens = new Set<Allergen>();
  const foods: FoodListing[] = [];
  const mapAllergensToIngredients = new Map<Allergen, FoodListing[]>();

  lines(input).forEach((line) => {
    const regex = /([a-z ]+) \(contains ([a-z ,]+)\)/;
    const matches = line.match(regex);
    const ing = matches![1].split(" ")!;
    const all = matches![2].split(", ")!;
    const food: FoodListing = {
      allergens: new Set<Allergen>(all),
      ingredients: new Set<Ingredient>(ing),
    };
    foods.push(food);
    all.forEach((a) => allergens.add(a));
    all.forEach((a) => {
      if (!mapAllergensToIngredients.has(a)) {
        mapAllergensToIngredients.set(a, []);
      }
      mapAllergensToIngredients.get(a)!.push(food);
    });
  });

  return { allergens, foods, mapAllergensToIngredients };
}

function getInertIngredients(input: Input): Set<Ingredient>[] {
  let intersected = new Set<Ingredient>();
  const allIngredients = input.foods.map(f=>f.ingredients);
  for (const [k, v] of input.mapAllergensToIngredients.entries()) {
    const inter = intersection(...v.map(fl => fl.ingredients));
    intersected = union(intersected, inter);
  }
  return allIngredients.map(il => difference(il, intersected));

}

function part1(input: Input): number {
  const inert = getInertIngredients(input);
  return inert.reduce((s, l) => s + l.size, 0);
}

function part2(input: Input): string {
  const inert = getInertIngredients(input);
  const allInter = union(...inert);
  // Remove inert
  for (const list of input.mapAllergensToIngredients.values()) {
    list.forEach(l => {
      l.ingredients = difference(l.ingredients, allInter);
    });
  }
  const knownIngredients = new Map<Allergen, Ingredient>();
  while(knownIngredients.size < input.allergens.size) {
    for (const [k, v] of input.mapAllergensToIngredients) {
      const inter = intersection(...v.map(f => f.ingredients));
      if (inter.size === 1) {
        const ing = Array.from(inter.values())[0];
        knownIngredients.set(k, ing);
        for (const food of input.foods) {
          food.ingredients.delete(ing);
        }
      }
    }
  }
  const knownArr = Array.from(knownIngredients.entries());
  knownArr.sort((a, b) => a[0].localeCompare(b[0]));
  return knownArr.map(i => i[1]).join(',');
}

async function day21(input: string): Promise<void> {
  const foodInput = parseList(input);
  console.log(foodInput);

  console.log(`Part1: ${part1(foodInput)}`);
  console.log(`Part2: ${part2(foodInput)}`);
}

export default day21;
