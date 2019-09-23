+++
markup = "mmark"
+++


# Welcome to the People Demo

This is a demonstration of using And/Or for curating metadata 
objects that form a people object collection. The collection
is based on [dataset](https://caltechlibrary.org/dataset).
[And/Or](https://github.com/caltechlibrary/andor) is a simplified
multi-user version of the `dataset` implemented as a web service.

## Demonstration

The demonstration explores the following

1. A simple web service built on a dataset collections
2. A role/object state permission model 
3. An approach available for when we out grow spreadsheets

Goto [/people/](/people/) to try the demo.


## The People Object

Demo shows one approach to curating individual people objects.
The people object has the following attributes (fields).


cl\_people\_id
: The key to the people record in the people object collection

family\_name
: A normalized version of a family name (e.g. Doiel, Johnson, Porter)

given\_name
: A normalized version of the given name (e.g. Robert, Kathy, George)

thesis\_id
: The creator id used in CaltechTHESIS if it exists

author\_id
: The creator id used in CaltechAUTHORS if it exists

archivesspace\_id
: The agent id from our Archives' ArchivesSpace implementation

viaf\_id
: A person's viaf id if known

lcnaf
: A person's lcnaf if known

isni
: A person's isni if known

wikidata
: A person's wikidata id if known

snac
: An ark associated with a persons' numeric SNAC id

orcid
: The ORCID associated with the person if known

image\_url
: A URL pointing at an a image of the individual (e.g. a picture of Feynman)

educated\_at
: A free text field, such as would be found in the directory, describing education

caltech
: A boolean value set to true if we know the person is affiliated with Caltech

jpl
: A boolean value set to true if we know the person is affiliated with JPL

faculty
: A boolean value set to true if we know the person is/was faculty

alumni
: A boolean value set to true if we know the person is an alum of Caltech

notes
: A free text field for any internal notes about the record

status
: The object state of the record, e.g. deposited, review, published, embargoed


