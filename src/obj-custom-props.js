/**
 * Saves a property pertaining to a specific object into the MicroStrategy object model
 *
 * @param {any} objectId the object UUID
 * @param {any} prop the property name to save
 * @param {any} value the property value to save
 * @returns {undefined}
 */
function setObjectCustomProperty (objectId, prop, value, configObject) {
  let objectKey = 'object-' + objectId + '-' + prop
  this.setProperty(objectKey, value, configObject)
}
/**
 * Retrieves a property pertaining to a specific object from the MicroStrategy object model
 *
 * @param {any} objectId the object UUID
 * @param {any} prop the property name to retrieve
 * @returns {string} the property value
 */
function getObjectCustomProperty (objectId, prop) {
  let objectKey = 'object-' + objectId + '-' + prop
  return this.getProperty(objectKey)
}
/**
 * Retrieves all properties pertaining to a specific object from the MicroStrategy object model
 *
 * @param {any} objectId the object UUID
 * @returns {Object} a map of all the properties
 */
function getObjectProperties (objectId) {
  let props = this.getProperties()
  let objectProps = Object.keys(props)
    .map(function (key) {
      if (key.startsWith('object-' + objectId)) {
        return key
      }
    })
    .filter(function (k) {
      return k !== undefined
    })

  let returnObj = {}
  for (let key in objectProps) {
    let oldKey = objectProps[key]
    let value = props[oldKey]
    let newKey = oldKey.split('-')[2]
    returnObj[newKey] = value
  }

  return returnObj
}

let objectPropertiesMixin = {
  getObjectProperties,
  getObjectCustomProperty,
  setObjectCustomProperty
}

export {
  objectPropertiesMixin
}
