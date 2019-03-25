/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @emails react-core
 */

'use strict';

let React;
let ReactDOMServer;

describe('quoteAttributeValueForBrowser', () => {
  beforeEach(() => {
    jest.resetModules();
    React = require('react');
    ReactDOMServer = require('react-dom/server');
  });

  it('ampersand is escaped inside attributes', () => {
    const response = ReactDOMServer.renderToString(<img data-attr="&" />);
    expect(response).toMatch('<img data-attr="&amp;" data-reactroot=""/>');
  });

  it('double quote is escaped inside attributes', () => {
    const response = ReactDOMServer.renderToString(<img data-attr={'"'} />);
    expect(response).toMatch('<img data-attr="&quot;" data-reactroot=""/>');
  });

  it('single quote is not escaped inside attributes', () => {
    const response = ReactDOMServer.renderToString(<img data-attr="'" />);
    expect(response).toMatch(`<img data-attr="'" data-reactroot=""/>`);
  });

  it('greater than entity is not escaped inside attributes', () => {
    const response = ReactDOMServer.renderToString(<img data-attr=">" />);
    expect(response).toMatch('<img data-attr=">" data-reactroot=""/>');
  });

  it('lower than entity is not escaped inside attributes', () => {
    const response = ReactDOMServer.renderToString(<img data-attr="<" />);
    expect(response).toMatch('<img data-attr="<" data-reactroot=""/>');
  });

  it('number is escaped to string inside attributes', () => {
    const response = ReactDOMServer.renderToString(<img data-attr={42} />);
    expect(response).toMatch('<img data-attr="42" data-reactroot=""/>');
  });

  it('object is passed to a string inside attributes', () => {
    const sampleObject = {
      toString: function() {
        return 'ponys';
      },
    };

    const response = ReactDOMServer.renderToString(
      <img data-attr={sampleObject} />,
    );
    expect(response).toMatch('<img data-attr="ponys" data-reactroot=""/>');
  });

  it('script tag is escaped inside attributes', () => {
    const response = ReactDOMServer.renderToString(
      <img data-attr={'<script type=\'\' src=""></script>'} />,
    );
    expect(response).toMatch(
      `<img data-attr=\"<script type='' src=&quot;&quot;></script>\" data-reactroot=\"\"/>`,
    );
  });
});
