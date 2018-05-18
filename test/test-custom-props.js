import { escape, unescape } from 'lodash'
import sinon from 'sinon'
import chai from 'chai'
import 'chai/register-should'
import { addMixin, CUSTOM_PROPERTY_NAME } from '../src/obj-custom-props'
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
    spySet.should.have.been.calledOnce
    spySet.should.have.been.calledWith(CUSTOM_PROPERTY_NAME, escape(JSON.stringify({ id: {prop: 'value' }})))
  })
})

describe('#getObjectCustomProperty()', function () {
  let vizMock = new VizMock()
  addMixin(vizMock)

  it('should call getProperty appropriately on the viz', function () {
    let spyGetProp = sinon.spy(vizMock, 'getProperty')
    vizMock.getObjectCustomProperty('id', 'prop')
    spyGetProp.should.have.been.calledWith(CUSTOM_PROPERTY_NAME)
  })
})

describe('#getObjectProperties()', function () {
  it('should call getProperty appropriately', function () {
    let spyGet = sinon.spy()
    let vizMock = new VizMock()
    addMixin(vizMock)
    sinon.spy(vizMock, 'getProperty')
    vizMock.getObjectProperties()
    vizMock.getProperty.should.have.been.calledWith(CUSTOM_PROPERTY_NAME)
  })

  it('should return custom properties with an appropriately formatted key', function () {
    let vizMock = new VizMock()
    addMixin(vizMock)

    vizMock.setObjectCustomProperty('testId', 'testProp', 'testValue')
    vizMock.setObjectCustomProperty('testId', 'helloDave', 'you\'reMyWifeNow')

    sinon.spy(vizMock, 'getProperty')
    let results = vizMock.getObjectProperties('testId')
    vizMock.getProperty.should.have.been.calledWith(CUSTOM_PROPERTY_NAME)
    Object.keys(results).length.should.equal(2)
    results.testProp.should.equal('testValue')
    results.helloDave.should.equal('you\'reMyWifeNow')
  })

  it('should return an empty object when an attribute has no custom properties', function () {
    let vizMock = new VizMock()
    addMixin(vizMock)

    let results = vizMock.getObjectProperties('id')
    expect(results).to.deep.equal({})
  })
})

describe('#migrateCustomObjectProps()', function () {
  let jsonTest = JSON.stringify({
    prop1: 'value1',
    prop2: 'value2'
   })
  let escapedJsonText = escape(jsonTest)
  let testProperties = {
    'metric-574912-prop1': 'value1',
    'metric-574912-prop2': 'value2',
    'obj-253469-prop1': 'value1',
    'obj-253469-prop2': 'value2',
    'obj-313505': {
      prop1: 'value1',
      prop2: 'value2'
    },
    'obj-a': jsonTest,
    'obj-b': escapedJsonText
  }

  it('should parse old metric-xxx-xxx values', function () {
    let vizMock = new VizMock(testProperties)
    addMixin(vizMock)
    vizMock.migrateCustomObjectProps()
    vizMock.getObjectCustomProperty('574912', 'prop1').should.equal('value1')
    vizMock.getObjectCustomProperty('574912', 'prop2').should.equal('value2')
  })

  it('should parse old obj-xxx-xxx values', function () {
    let vizMock = new VizMock(testProperties)
    addMixin(vizMock)
    vizMock.migrateCustomObjectProps()
    vizMock.getObjectCustomProperty('253469', 'prop1').should.equal('value1')
    vizMock.getObjectCustomProperty('253469', 'prop2').should.equal('value2')
  })

  it('should parse old obj-xxx object-based values', function () {
    let vizMock = new VizMock(testProperties)
    addMixin(vizMock)
    vizMock.migrateCustomObjectProps()
    vizMock.getObjectCustomProperty('313505', 'prop1').should.equal('value1')
    vizMock.getObjectCustomProperty('313505', 'prop2').should.equal('value2')
  })

  it('should parse old obj-xxx JSON-based values', function () {
    let vizMock = new VizMock(testProperties)
    addMixin(vizMock)
    vizMock.migrateCustomObjectProps()
    vizMock.getObjectCustomProperty('a', 'prop1').should.equal('value1')
    vizMock.getObjectCustomProperty('a', 'prop2').should.equal('value2')
  })

  it('should parse old obj-xxx escaped JSON-based values', function () {
    let vizMock = new VizMock(testProperties)
    addMixin(vizMock)
    vizMock.migrateCustomObjectProps()
    vizMock.getObjectCustomProperty('b', 'prop1').should.equal('value1')
    vizMock.getObjectCustomProperty('b', 'prop2').should.equal('value2')
  })

  it('should have removed all old keys', function () {
    let vizMock = new VizMock(testProperties)
    addMixin(vizMock)
    vizMock.migrateCustomObjectProps()
    let newProps = Object.keys(vizMock.getProperties())
    Object.keys(testProperties).filter((el) => {
      newProps.includes(el)
    }).length.should.equal(0)
  })

})


