Barteby
=======

Cultural map for Trondheim, reading RSS, making markers on map. Under slow
development.

Based on
--------

* node.js
* express
* mongoose
* passport
* jade
* ractive

Howto
-----

* Clone this repository: ``git clone git://github.com/sigurdga/barteby.git``
* Change directory: ``cd barteby``
* Install dependencies: ``make install``
* Create a settings file, and remember to edit it: ``cp server/settings.example.js server/settings.js``
* See that everything works on your side: ``make test``
* Run: ``node cluster``
* Open browser at localhost:3000

Developers howto
----------------

* Make everything: ``make``
* Compile sass on file changes: ``make watch``
* Restart cluster on file changes: ``nodemon cluster``

Bugs? Contributions?
--------------------

Please use the issues and pull requests at Github.

Copyright and license
---------------------
Copyright © 2014 Sigurd Gartmann, released under the [AGPL license](https://github.com/sigurdga/barteby/blob/master/LICENSE).
