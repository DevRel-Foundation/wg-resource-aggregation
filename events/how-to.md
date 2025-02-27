
## How-to Run a Pre-Commit Validation Check

TODO


## How-to Fix an additionalProperties Error

You may see something similar to the following when validating data.

```
Invalid Resource
[
  {
    instancePath: '',
    schemaPath: '#/additionalProperties',
    keyword: 'additionalProperties',
    params: { additionalProperty: 'alias' },
    message: 'must NOT have additional properties'
  }
]
```

There are many properties that are optional and can be excluded, but additional properties that have not been defined by the schema cannot be added.

This particular instance actually catches an error, where the data used `alias` instead of `aliases` when specifying additional names that represent the event.

## How-to Get Sessionize Talk Details For Exchange

This is not a goal of the exchangers, but a Chrome extension can be helpful for speakers who are looking to quickly reuse their 
talk details with multiple submission tools.

https://github.com/jerdog/cfp-chrome-extension



