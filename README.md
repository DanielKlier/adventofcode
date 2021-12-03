# Daniel's Advent Of Code Solutions

These are the puzzle solutions for https://adventofcode.com.

They are written in TypeScript and run with [Deno](https://deno.land/).

## Getting started

Get your Advent of Code session from the developer. Just examine any request made to the AoC backend
(e.g. getting the input) and then getting the `session` cookie out of the request headers.

Create a .env file in the root directory with the following contents:

```
AOC_SESSION=<YOUR_SESSION_COOKIE_VALUE>
```

## Bootstrapping a New Day

Use the `new.sh` script to quickly create a new solution file.
It will create the TypeScript `index.ts` script and the `input.txt` file with your puzzle input.

This example creates the skeleton for day 1 in the directory `2020/Day_01`.
```
./new.sh 2020 1
```

## Running a solution

There is also a handy wrapper script that can run the solutio for a specific day.

```
./run.sh 2020 1
```
