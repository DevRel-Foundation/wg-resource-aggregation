# Event Directory Design

The event directory should support a variety of use cases.

## Data Description

To maintain the event directory we want to define and collect structured data. This means a certain amount of validation is needed to ensure data integrity so that it can reliably be used in sensible ways.

- json-schema: standardized representation of how data is to be specified
- ajv: another JSON validator is a CLI to validate JSON against a schema
- schema.org: a semantic reference for property specification

### JSON-Schema

https://json-schema.org/
> While JSON is probably the most popular format for exchanging data, JSON Schema is the vocabulary that enables JSON data consistency, validity, and interoperability at scale.

### AJV

https://ajv.js.org/
> It allows implementing complex data validation logic via declarative schemas for your JSON data, without writing code. Out of the box, Ajv supports JSON Schema (drafts 04, 06, 07, 2019-09 and 2020-12) and JSON Type Definition (RFC8927).

### Schema.org

The data definition has some influences from RDF and JSON-LD for semantic meaning within web applications. The schema does not have strict adherence to the community but it serves as inspiration.

https://schema.org/Event
>Schema.org is a collaborative, community activity with a mission to create, maintain, and promote schemas for structured data on the Internet, on web pages, in email messages, and beyond.

## Architecture

The objective is not to build end-user experiences but provide a reference implementation for how others might use the aggregated data to build them or exchange data with other existing tools.

### Overview

                           ┌────────────────┐                                                
                           │                │                                                
                           │  GitHub Action │                                                
                           │                │                                                
                           └────────┬───────┘                                                
 ┌────────────────┐                 │                ┌────────────────┐   ┌────────────────┐ 
 │                │                 │                │                │   │                │ 
 │     /data      │                 │                │   /indexers    │   │   /exchange    │ 
 │                │                 │                │                │   │                │ 
 └────────────────┘                 │                └────────────────┘   └────────────────┘ 
     ┌───────┐                      │                                                        
     │ .json │             ┌────────▼───────┐                                                
     └───┬───┘             │                │                                                
┌───────┐│┌───────┐        │   validate.js  │                                                
│ .json │││ .json ◄────────┼                │                                                
└───┬───┘│└────┬──┘        └────────────────┘        ┌────────────────┐    ┌────────────────┐
    │    │     │                                     │                │    │                │
    │    │     │                                     │    to_csv.js   │    │  conftech.js   │
    │    │     │                                     │                │    │                │
    │    │     │                                     └────────┬───────┘    └────────────────┘
    └────┼─────┘                                              │                              
         │                                                    │                              
      ┌──▼────┐                                               │                              
      │ .csv  │ ◄─────────────────────────────────────────────┘                              
      └───────┘                                                                              
                                                      ┌────────────────┐   ┌────────────────┐
                                                      │                │   │                │
                                                      │    to_md.js    │   │   devpost.js   │
                                                      │                │   │                │
                                                      └────────────────┘   └────────────────┘
                                                      ┌────────────────┐                     
                                                      │                │                     
                                                      │ to_airtable.js │                     
                                                      │                │                     
                                                      └────────────────┘                     
                                                      ┌────────────────┐                     
                                                      │                │                     
                                                      │    to_...js    │                     
                                                      │                │                     
                                                      └────────────────┘                     


### Validation

GitHub Actions provide a hook that submissions are validated or checked against the schema to insure a base level of data integrity.

### Indexing

To assist with providing value, indexers gather all of the data into a format that is transferrable to other systems and uses.

* Comma-separated Values (CSV) can be a useful representation for all JSON records in a tabular record appropriate to be imported into Google Sheets, AirTable, or Excel.
* Markdown can be a useful representation for casual review of events that share certain properties in a simple linear list, such as viewing a list of all events in January of 20xx.

Indexing is the mechanism that can make the list of events valuable for multiple use cases by also filtering out certain criteria based on the underlying data.

### Exchange

Given the existence of other event repositories, an exchange or synchronization step may be a natural byproduct to export and import data between our aggregation and their system.

See [events.md](./events.md) for a list of example aggregators that may exchange data contributions.

## Guidelines

### File Naming Convention

The name of individual records will follow the naming convention of being the domain name for the event.

Rationale:
- avoids collisions when events share a similar name
- can be computed or validated based on the `url` in the event data itself
- promotes fairness when sorting a filesystem directory
- avoids ambiguity when identifying the topics of an event as an organizing principle
- improves discoverability by not ordering by date or when event dates change

Examples:
- Developer Week is stored in developerweek.com.json. 
- Techcrunch Disrupt 2024 is stored in techcrunch.com.json. If it followed the pattern 2024.techcrunch.com it would still be the same.

### Single File Per Event

Events that occur with non-overlapping dates are stored in a single file and represented as a series.

Rationale:
- allows for discovering of events before official dates or locations have been set
- helps manage frequently recurring events getting same attention as annual events

Examples:
- CES is a single file, but has a series as part of the data that allows for each year to be set with dates and optional unique URL
- Tracy Devs Meetup group does not have twelve separate files to manage for a monthly recurring event

# Appendix

## Future Work

Additional ideas under consideration

- [ ] external reference to personas library for attendees
- [ ] index to airtable
- [ ] index to rss feed
- [ ] index to public google calendar
- [ ] exchange with confs.tech
- [ ] exchange with sessionize
- [ ] exchange with devpost
