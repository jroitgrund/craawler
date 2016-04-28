# GoCardless crawler

## How to run

* Clone the repo

* `node dist/index.js http://gocardless.com`

* Generate a coverage report with `npm run coverage`

## My thoughts

* That was pretty fun! I usually use JS for front-end stuff and it was really sweet to see how
  little code it took to write this in modern JS.

* The most challenging part was thorough testing, it's hard to think of all the edge cases and code
  coverage doesn't really help there. Ordinarily I would add more unit tests as the end-to-end
  testing revealed cases I'd forgotten but I intentionally left only the ones I caught in the first
  place while TDD'ing.

* Templating was also hard because I'd never used `Jade`.

* It's missing assets from CSS (`background-image`).

* It's pretty robust apart from that (dedupes same URL with different hash fragment or `http://`
  rather than `https://`).

## High-level design

I broke the crawler up into four parts.

* The `fetcher` takes a URL and returns all the links and assets it finds there. I didn't think it
  was necessary to break up fetching and parsing the HTML as most of this work is offloaded to
  external libraries anyway.

* The `crawler` takes a URL and recursively fetches all the links it finds there, while making sure
  to stay in the same domain and not crawl anything twice. It returns a flat structure where each
  URL maps to a list of links and static assets found there. Internally it has a separate map of
  seen URLs because when deduping we don't care whether a URL is https or not.

* The `nester` takes the flat structure returned by the crawler and turns it into a URL hierarchy.
The reason for splitting these two steps up is to ensure that the sitemap is breadth-first. In other
words, each page should be displayed at the shallowest level it can be found, rather than in
whatever order it was first found when making all the HTTP requests.

* The `formatter` builds a nested structure from the crawler output starting from the root URL and
  uses jade to generate a static HTML report. It's only tested with a golden test.

## Lower-level tidbits

* I used dependency injection because I'm not used to the hot replacement you can do in dynamic
  languages with things like `proxyquire`, and wasn't sure how well it would play with `babel`.

* Everything goes through `eslint` and `jscs`, so the style should be identical everywhere and
  conform to good practice (at least whatever good practice is agreed on at airbnb and detectable
  with static analysis).

* Everything is tested with high coverage as verified by `istanbul`.

## Use of node.js

Asynchrony, promises, and having a single event loop thread make this task much easier. This would
be extremely tedious in a threaded language because I would have to lock the URL map to make sure I
don't have a data race between setting a URL as crawled and checking whether I've already crawled
it.

JS is also extremely succinct thanks to ES2015, and testing async code is a breeze as libraries make
it easy to assert on the value of a Promise.
