import uuidv4 from 'uuid/v4'

/**
 * Adds the mixin to the target object
 * 
 * @param {object} target 
 */
function addMixin(target) {
  Object.keys(objectPropertiesMixin).forEach((key) => {
    target[key] = objectPropertiesMixin[key]
  })
}
/**
 * Returns a key for an object that can be used as a custom property in MicroStrategy
 * 
 * @param {string} objectId 
 * @returns {string} MicroStrategy-safe custom property key
 */
function getObjectCustomPropertyKey (objectId) {
  return `obj-${objectId}`
}

function updateMetadataUUID (viz) {
  let metadata = viz.getProperty('mstr-viz-object-custom-props')
  metadata.uuid = uuidv4()
  viz.setProperty('mstr-viz-object-custom-props', metadata, { suppressData: true })
}

function checkMetdataVersion (viz) {
  let metadata = viz.getProperty('mstr-viz-object-custom-props')
  if (!metadata) {
    upgradeCustomObjectProperties (viz)
    metadata = { 
      version: 'v1',
      uuid: uuidv4()
    }
    viz.setProperty('mstr-viz-object-custom-props', metadata)
  }
}

function upgradeCustomObjectProperties (viz) {
  let properties = viz.getProperties()
  let objCustProps = {}
  Object.keys(properties).forEach((key) => {
    var parts = key.split('-')
    if (parts.length == 3) {
      let prefix = parts[0]
      let objID = parts[1]
      let propName = parts[2]
      if (prefix === 'metric' || prefix === 'object') {
        let prefixedObjID = 'obj-' + objID
        if (!objCustProps[prefixedObjID]) {
          objCustProps[prefixedObjID] = {}
        }
        objCustProps[prefixedObjID][propName] = properties[key]
        delete properties[key]
      }
    }
  })
  Object.keys(objCustProps).forEach((key) => {
    viz.setProperty(key, objCustProps[key], { suppressData: true })
  })
}

function deleteProperty (prop) {
  let properties = this.getProperties()
  delete properties[prop]
  updateMetadataUUID(this)
}

function decodeValue (val) {
  let returnVal = val
  if (typeof val === 'string') {
    try {
      returnVal = JSON.parse(val)
    } catch (error) {}
  }
  return returnVal
}

function encodeValue (val) {
  let returnVal = val
  if (typeof val === 'object') {
    try {
      returnVal = JSON.stringify(val)
    } catch (error) {}
  }
  return returnVal
}

/**
 * Saves a property pertaining to a specific object into the MicroStrategy object model
 *
 * @param {string} objectId the object UUID
 * @param {string} prop the property name to save
 * @param {string} value the property value to save
 * @returns {void}
 */
function setObjectCustomProperty (objectId, prop, value, configObject) {
  checkMetdataVersion(this)
  let objectKey = getObjectCustomPropertyKey(objectId)
  let objectProperties = this.getObjectProperties(objectId)
  if (!objectProperties) {
    objectProperties = {}
  }
  let oldPropValue = objectProperties[prop]
  if (value != oldPropValue) {
      objectProperties[prop] = value
  }
  this.setProperty(objectKey, JSON.stringify(objectProperties), configObject)
}

/**
 * Retrieves a property pertaining to a specific object from the MicroStrategy object model
 *
 * @param {string} objectId the object UUID
 * @param {string} prop the property name to retrieve
 * @returns {string} the property value
 */
function getObjectCustomProperty (objectId, prop) {
  checkMetdataVersion(this)
  let objectProps = this.getObjectProperties(objectId)
  return objectProps ? objectProps[prop] : undefined
}

/**
 * Retrieves all properties pertaining to a specific object from the MicroStrategy object model
 *
 * @param {any} objectId the object UUID
 * @returns {Object} a map of all the properties
 */
function getObjectProperties (objectId) {
  checkMetdataVersion(this)
  let props = this.getProperties()
  return decodeValue(props[getObjectCustomPropertyKey(objectId)])
}

let objectPropertiesMixin = {
  deleteProperty,
  getObjectProperties,
  getObjectCustomProperty,
  setObjectCustomProperty
}

export {
  addMixin,
  objectPropertiesMixin
}
