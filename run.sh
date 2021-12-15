#!/usr/bin/env bash

deno run --allow-net --allow-write --allow-read=. runner.ts $1 $2
