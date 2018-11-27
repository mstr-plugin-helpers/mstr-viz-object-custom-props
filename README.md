# mstr-viz-object-custom-properties
A plugin to allow per-object custom properties to be set within MicroStrategy custom visualisations.

If you have a custom plugin that allows users to set properties on individual metrics or attributes displayed within the visualisation, there's no built-in mechanism for storing these values when the dossier or document is saved, so this mixin can be added to your code to facilitate that.

## Build Status
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com)
[![version](https://badge.fury.io/js/mstr-viz-object-custom-props.svg)](https://www.npmjs.com/package/mstr-viz-object-custom-props) [![Build Status](https://travis-ci.org/mstr-plugin-helpers/mstr-viz-object-custom-props.svg?branch=master)](https://travis-ci.org/mstr-plugin-helpers/mstr-viz-object-custom-props) [![codecov](https://codecov.io/gh/mstr-viz-helpers/mstr-viz-object-custom-props/branch/master/graph/badge.svg)](https://codecov.io/gh/mstr-viz-helpers/mstr-viz-object-custom-props)

### Usage
Add `objectPropertiesMixin` as a mixin to your custom visualisation class constructor. This adds the following methods to your visualisation class:

* `getObjectsProperties()`
* `getObjectProperties(objectId)`
* `getObjectCustomProperty(objectId, objectProp)`
* `setObjectCustomProperty(objectId, objectProp, propValue, configObject)`
* `deleteObjectProperties(objectId, configObject)`
* `migrateCustomObjectProps()`

Full documentation is available at [https://mstr-plugin-helpers.github.io/mstr-viz-object-custom-props/](https://mstr-plugin-helpers.github.io/mstr-viz-object-custom-props/)
