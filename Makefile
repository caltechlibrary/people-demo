#
# Simple Makefile for managing feeds.library.caltech.edu bucket
#
PROJECT = people-demo

VERSION = $(shell grep -m 1 'Version =' version.txt | cut -d\`  -f 2)

BRANCH = $(shell git branch | grep '* ' | cut -d\  -f 2)

PROJECT_LIST = people-demo

OS = $(shell uname)

EXT = 
ifeq ($(OS), Windows)
	EXT = .exe
endif

status:
	git status

save:
	if [ "$(msg)" != "" ]; then git commit -am "$(msg)"; else git commit -am "Quick Save"; fi
	git push origin $(BRANCH)

website:
	./mk_website.py

publish: website
	./publish.bash


FORCE:
