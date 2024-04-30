#!/bin/bash

rm -rf playwright-report
mkdir playwright-report
cp /C/Users/Tom/Downloads/playwright-report.zip playwright-report/
cd playwright-report
unzip playwright-report.zip
cd -
npx playwright show-report playwright-report