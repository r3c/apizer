Apizer: Unofficial APIs for websites that deserve one
=====================================================

[![license](https://img.shields.io/github/license/r3c/apizer.svg)](https://opensource.org/licenses/MIT)


Overview
--------

Apizer provides REST JSON APIs for websites that don't provide a public one,
usually by scrapping websites or reusing endpoints that can be combined into
suitable API.

Goal of this project is to collect these unofficial APIs inside a Node.js
application and expose them through public unauthenticated endpoints. The
application is currently hosted by Heroku at https://apizer.herokuapp.com/.

If you want to add an API to the list, checkout the project, add your
implementation in "website/&lt;website domain&gt;" directory (read code from an
existing one as an example), then submit a pull request so it's available to
everyone.


Websites catalog
----------------

See available website APIs where: https://apizer.herokuapp.com/


Resource
--------

* Dependencies: [cheerio](https://github.com/cheeriojs/cheerio), [expressjs](https://expressjs.com/), [node-fetch](https://github.com/node-fetch/node-fetch), [tsoa](https://github.com/lukeautry/tsoa)
* License: [license.md](license.md)
