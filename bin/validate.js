// Given a schema validate any given data files against the schema
// Validate a single file:
//   node validate.js --schema ../events/events.schema.json --data ../events/data/fossdem.org.json
// Validate an entire collection:
//   node validate.js --schema ../events/events.schema.json --data ../events/data/*.json

const fs = require('fs');
const args = require('yargs')
    .command('schema', 'schema to use for validation')
    .option('data', {type: 'array', desc: 'data files to validate'})
    .option('verbose', {type: 'boolean'})
    .demand(['data','schema'])
    .argv;

const Ajv = require("ajv/dist/2020"); // https://ajv.js.org/guide/schema-language.html#draft-2019-09-and-draft-2020-12
const ajv = new Ajv({ strict: false })

// Load schema
const schema = JSON.parse(fs.readFileSync(args.schema, 'utf8'));
const validate = ajv.compile(schema);

let report = {
    valid: 0,
    invalid: 0,
    review: []
}

// Iterate over each data file to validate it
args.data.forEach(item => {
    log(item); 
    const asset = JSON.parse(fs.readFileSync(item, 'utf8'));
    if (validate(asset)) {
        log("Valid");
        report.valid++;
    } else {
        log("Invalid");
        report.invalid++;
        report.review.push(item);
        log(validate.errors);
        console.warn(`${item} => ${JSON.stringify(validate.errors)}`);
    }
});

if (report.invalid > 0) {
    console.error(`Failed to validate:\n${report.review.join('\n')}`)
}
console.log(`Validated ${report.valid} out of ${args.data.length} resources checked.`)


function log(msg) {
    if (args.verbose) {
        console.log(msg)
    }
}
