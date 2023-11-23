const { program } = require('commander');

// import { program } from 'commander';

program
  .option('--first')
  .option('-s, --separator <char>');

// This function parses the command-line arguments and extracts the values for the defined options.
program.parse();



// used to retrieve the values of the parsed options. The returned value is stored in the options variable.
const options = program.opts();

const limit = options.first ? 1 : undefined;

console.log(program.args[0].split(options.separator, limit));
