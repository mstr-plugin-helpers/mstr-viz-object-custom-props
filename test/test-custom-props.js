import sinon from 'sinon'
import chai from 'chai'
import 'chai/register-should'
import { objectPropertiesMixin, addMixin } from '../src/obj-custom-props'
import { expect } from 'chai'

chai.use(require('chai-sinon'))

class VizMock {
  constructor(properties) {
    if (properties) {
      this.properties = properties
    } else {
      this.properties = {}
    }
  }
  getProperties() {
    return this.properties
  }

  getProperty(prop) {
    return this.properties[prop]
  }
  setProperty(prop, value) {
    this.properties[prop] = value
  }
}

describe('#setObjectCustomProperty()', function () {
  let vizMock = new VizMock()
  let spySet = sinon.spy(vizMock, 'setProperty')
  addMixin(vizMock)

  it('should call setProperty appropriately on the viz', function () {
    vizMock.setObjectCustomProperty('id', 'prop', 'value')
    spySet.should.have.been.calledTwice
    spySet.should.have.been.calledWith('obj-id', JSON.stringify({ prop: 'value' }))
  })
})

describe('#getObjectCustomProperty()', function () {
  let vizMock = new VizMock()
  addMixin(vizMock)

  it('should call getProperty appropriately on the viz', function () {
    let spyGetProps = sinon.spy(vizMock, 'getObjectProperties')
    vizMock.getObjectCustomProperty('id', 'prop')
    spyGetProps.should.have.been.calledOnce
  })
})

describe('#getObjectProperties()', function () {
  it('should call getProperties appropriately', function () {
    let spyGet = sinon.spy()
    let vizMock = new VizMock()
    addMixin(vizMock)
    sinon.spy(vizMock, 'getProperties')
    vizMock.getObjectProperties()
    vizMock.getProperties.should.have.been.calledTwice
  })

  it('should return custom properties with an appropriately formatted key', function () {
    let vizMock = new VizMock({
      'obj-id': {
        key: 'value',
        key2: 'value2'
      },
      'hello-dave': 'ignore'
    })

    addMixin(vizMock)

    sinon.spy(vizMock, 'getProperties')
    let results = vizMock.getObjectProperties('id')
    vizMock.getProperties.should.have.been.calledTwice
    Object.keys(results).length.should.equal(2)
    results.key.should.equal('value')
    results.key2.should.equal('value2')
    expect(results['hello-dave']).to.equal(undefined)
  })

  it('should return custom properties from a JSON value with an appropriately formatted key', function () {
    let jsonValue = JSON.stringify({
      key: 'value',
      key2: 'value2'
    })
    let vizMock = new VizMock({
      'obj-id': jsonValue,
      'hello-dave': 'ignore'
    })

    addMixin(vizMock)

    sinon.spy(vizMock, 'getProperties')
    let results = vizMock.getObjectProperties('id')
    vizMock.getProperties.should.have.been.calledTwice
    Object.keys(results).length.should.equal(2)
    results.key.should.equal('value')
    results.key2.should.equal('value2')
    expect(results['hello-dave']).to.equal(undefined)
  })
})
