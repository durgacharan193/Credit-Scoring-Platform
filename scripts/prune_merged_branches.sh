#!/usr/bin/env bash
git branch --merged | grep -v '^*' | grep -v 'main' | xargs -n 1 git branch -d 2>/dev/null || true
