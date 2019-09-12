CaltechPEOPLE - a prototype people object repository
=====================================================

This is the static website content for a proof of concept 
curation tool for use by Caltech Library and the Library's
People Identity project. It is built on a prototype
of a multi-user version of [dataset](https://github.com/caltechlibrary/dataset)
called [And/Or](https://github.com/caltechlibrary/andor).
It is intended to show an alternative tool for curating data
we currently maintain in a GoogleSheet.

[![License](https://img.shields.io/badge/License-BSD%203--Clause-blue.svg?style=flat-square)](https://choosealicense.com/licenses/bsd-3-clause)
[![Latest release](https://img.shields.io/badge/Latest_release-1.1.0-b44e88.svg?style=flat-square)](http://shields.io)


Table of contents
-----------------

* [Introduction](#introduction)
* [Installation](#installation)
* [Known issues and limitations](#known-issues-and-limitations)
* [Getting help](#getting-help)
* [License](#license)
* [Acknowledgments](#authors-and-acknowledgments)


Introduction
------------

people.library.caltech.edu is a static website designed
to use the [And/Or](https://github.com/caltechlibrary/andor)
web service to curate content maintained in [dataset](https://github.com/caltechlibrary/dataset) collections. The format of the people
objects reflects both what is currently curated in a GoogleSheet
and data we merge from other sources (e.g. Caltech Directory and
ORCID.org). This is a prototype exploring this approach.


Installation
------------

The website implentation depends on the following software

+ A front end web server like Apache 
    + Need to provide reverse proxy to/from __And/Or__ service
    + Provide/require authentication (e.g. BasicAUTH, Shibboleth, Open ID Conect)
    + secure transport (e.g. https via TLS or OpenSSL)
+ [Golang v1.13](https://golang.org)
+ [mkpage](https://github.com/caltechlibrary/mkpage)
+ [dataset](https://github.com/caltechlibrary/dataset)
+ [And/Or](https://github.com/caltechlibrary/andor)

Refer to [Apache.org](https://apache.org) for how to install configure 
apache, instructions for installing __mkpage__ can be found at https://caltechlibrary.github.io/mkpage, __dataset__ can be found at
https://caltechlibrary.github.io/dataset and for __And/Or__ at
https://github.com/caltechlibrary/andor.

For __mkpage__, __dataset__, and __And/Or__ if you have Golang version
1.13 installed you can do something like--

```bash
    export GOPATH="${HOME}"
    go get -u github.com/caltechlibrary/mkpage/...
    go get -u github.com/caltechlibrary/dataset/...
    go get -u github.com/caltechlibrary/andor/...
```

Known issues and limitations
----------------------------

This is website is a prototype and not intended for production. 
The purpose of it is to serve as a starting point for what
a People Object repository might look like and work like for
Caltech Library.


Getting help, making suggestions
------------

See [GitHub Issues](https://github.com/caltechlibrary/people.library.caltech.edu/issues) for this project.



License
-------

Software produced by the Caltech Library is Copyright (C) 2019, Caltech.  This software is freely distributed under a BSD/MIT type license.  Please see the [LICENSE](LICENSE) file for more information.


Acknowledgments
---------------

This work was funded by the California Institute of Technology Library.

(If this work was also supported by other organizations, acknowledge them here.  In addition, if your work relies on software libraries, or was inspired by looking at other work, it is appropriate to acknowledge this intellectual debt too.)

<div align="center">
  <br>
  <a href="https://www.caltech.edu">
    <img width="100" height="100" src="/assets/caltech-round.svg">
  </a>
</div>
