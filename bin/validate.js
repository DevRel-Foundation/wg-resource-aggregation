// node validate.js --schema ../events/schema/events.schema.json --data ../events/data/fossdem.org.json

const fs = require('fs');
const args = require('yargs')
    .command('--schema', 'schema to use for validation')
    .command('--data', 'data files to validate')
    .demand(['data','schema'])
    .argv;

const Ajv = require("ajv/dist/2020"); // https://ajv.js.org/guide/schema-language.html#draft-2019-09-and-draft-2020-12
const ajv = new Ajv({ strict: false })

const schema = JSON.parse(fs.readFileSync(args.schema, 'utf8'));
const validate = ajv.compile(schema);

const data = JSON.parse(fs.readFileSync(args.data, 'utf8'));
const valid = validate(data);
if (valid) {
    console.log("Looks Good");
} else {
    console.log("Invalid Resource");
    console.log(validate.errors);
}


