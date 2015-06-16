# Gumshoe [![Build Status](https://travis-ci.org/gilt/Gumshoe.svg?branch=master)](https://travis-ci.org/gilt/Gumshoe)

An analytics and event tracking sleuth.

## Background

Companies of all sizes are heavily dependent upon analytics to improve the user experience and forecast varying business data points. Gilt has leveraged Google Analytics (henceforth known as GA) heavily, utilizing the data redirection feature of GA. At some point in late 2015, that feature will be no more. Gumshoe was built to fill that void and to extend upon the data-collection abilities of GA. 

## Browser Support

Gumshoe supports the latest versions of:

`Chrome`

`Firefox`

`Safari`

And versions 8 - Latest of `Internet Explorer`. Sorry, but Gumshoe will not be supporting other `OldIE` versions.


## Structure

Gumshoe is comprised of several simple sturctural elements:

`dist` contains the compiled gumshoe files meant for distribution and use in the browser. Comes in minified and unminified flavors.

`examples` contains small examples of working with Gumshoe.

`lib` contains third party libraries bundled with Gumshoe which facilitate standardized and privately scoped functionality for each gumshoe instance.

`src` contains the source for the Gumshoe library itself.

`test` contains [mocha BDD](http://mochajs.org/) tests

## Project Goals

- Parity with Google Analytics base page data
- Organized event names and data
- High level of data integrity and confidence
- Low page footprint
- Low failure and miss rate

## Base Concepts

**Transport**

**Event Name**

An event name should be carefully considered, and all event names should be of the same format, tense, and general structure. At Gilt we use a dot-delimited event naming notation. eg. `'checkout.country.selected'`. 

**Event Data**

Event data can be anything, of any type, that you or your organization decide upon. At Gilt, all event data is serialized to a string using JSON.stringify. Event data should be chosen carefully, should be documented and should not change in structure for a particular event, if time-over-time reporting is a priority.

## Testing

```
npm install
gulp test
```

To independently test the distribution version of Gumshoe, run:

```
gulp test-dist
```

## Contributing

Please fork the project and submit a pull request for all bugfixes, patches, or suggested improvements for Gumshoe.

Please take into consideration our formatting style when submitting pull requests. Pull requests which don't follow our simple style guide won't be accepted.

- Indentation is 2 spaces, no tabs.
- `var` blocks should be separated by newlines.
- Strings should be single-quoted
- Logical and functional blocks should have a newline after the opening brace or paren, and before the closing brace or paren.


## Support

Please post support requests and bugs to the Github Issues page for this project.

