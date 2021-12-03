#!/usr/bin/env bash

deno run --unstable --allow-net --allow-env --allow-read=.. --allow-write=.. support/new.ts $1 $2
