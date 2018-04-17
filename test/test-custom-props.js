import sinon from 'sinon'
import chai from 'chai'
import 'chai/register-should'
import { objectPropertiesMixin } from '../src/obj-custom-props'
import { expect } from 'chai'

chai.use(require('chai-sinon'))

describe('#setObjectCustomProperty()', function () {
  let spySet = sinon.spy()
  let vizMock = {
    setProperty: spySet,
    setObjectCustomProperty: objectPropertiesMixin.setObjectCustomProperty
  }

  it('should call setProperty appropriately on the viz', function () {
    vizMock.setObjectCustomProperty('id', 'prop', 'value')
    spySet.should.have.been.calledOnce
    spySet.should.have.been.calledWith('object-id-prop', 'value')
  })
})

describe('#getObjectCustomProperty()', function () {
  let spyGet = sinon.spy()
  let vizMock = {
    getProperty: spyGet,
    getObjectCustomProperty: objectPropertiesMixin.getObjectCustomProperty
  }

  it('should call getProperty appropriately on the viz', function () {
    vizMock.getObjectCustomProperty('id', 'prop')
    spyGet.should.have.been.calledOnce
    spyGet.should.have.been.calledWith('object-id-prop')
  })
})

describe('#getObjectProperties()', function () {
  let spyGet = sinon.spy()
  let vizMock = {
    getProperty: spyGet,
    getObjectCustomProperty: objectPropertiesMixin.getObjectCustomProperty
  }

  it('should call getProperties appropriately', function () {
    let spyGet = sinon.spy()
    let vizMock = {
      getProperties: function () { return {} },
      getObjectProperties: objectPropertiesMixin.getObjectProperties
    }
    sinon.spy(vizMock, 'getProperties')
    vizMock.getObjectProperties()
    vizMock.getProperties.should.have.been.calledOnce
  })

  it('should return custom properties with an appropriately formatted key', function () {
    let spyGet = sinon.spy()
    let vizMock = {
      getProperties: function () { return {
        'object-id-key': 'value',
        'object-id-key2': 'value2',
        'hello-dave': 'ignore'
      } },
      getObjectProperties: objectPropertiesMixin.getObjectProperties
    }
    sinon.spy(vizMock, 'getProperties')
    let results = vizMock.getObjectProperties('id')
    vizMock.getProperties.should.have.been.calledOnce
    Object.keys(results).length.should.equal(2)
    results.key.should.equal('value')
    results.key2.should.equal('value2')
    expect(results['hello-dave']).to.equal(undefined)
  })
})