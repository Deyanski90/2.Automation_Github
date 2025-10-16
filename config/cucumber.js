module.exports = {
  default: `--require-module ts-node/register --require step-definitions/**/*.ts --require support/**/*.ts --publish-quiet --format json:reports/cucumber-report.json --format html:reports/cucumber-report.html --format progress-bar --paths features` 
};
