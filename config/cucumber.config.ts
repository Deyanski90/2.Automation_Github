export default {
  require: ['step-definitions/**/*.ts', 'support/**/*.ts'],
  requireModule: ['ts-node/register'],
  format: [
    'json:reports/cucumber-report.json',
    'html:reports/cucumber-report.html',
    'progress-bar'
  ],
  formatOptions: { snippetInterface: 'async-await' },
  paths: ['features/**/*.feature'],
  publishQuiet: true
};
