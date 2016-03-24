# revv

![CI Status](https://api.travis-ci.org/nicholaswyoung/revv.svg?branch=master)

A simple, modular JavaScript tool for versioning static assets.

## Install

```
npm install revv --save
```

## Usage

```javascript
import revv from 'revv';
revv('<glob|path>').then(revved => {});
```

Alternatively, you can import individual actions:

```javascript
import { exists, read, copy, tidy } from 'revv/actions';
```

## Looking for a [CLI](https://github.com/nicholaswyoung/revv-cli)?

Just use `npm i -g revv-cli`.

## License

&copy; 2016 Nicholas Young, released under the 3-Clause-BSD License. For further
details, see the included `LICENSE` document.
