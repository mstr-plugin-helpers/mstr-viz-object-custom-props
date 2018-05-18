const CUSTOM_PROPERTY_NAME = 'objectCustomProps'

function pickle (objectsProps) {
    return escape(JSON.stringify(objectsProps))
  }
function unPickle (inputString) {
    try {
      return JSON.parse(unescape(inputString))
    } catch (error) {
      console.warn(`Couldn\'t unpickle:\n ${inputString}`)
      console.warn(error)
    }
  }

function getObjectsProperties() {
  let rawProperty = this.getProperty(CUSTOM_PROPERTY_NAME)
  if (rawProperty) {
    return unPickle(rawProperty)
  } else {
    return {}
  }
}

function getObjectProperties(objectId) {
  const objProps = getObjectsProperties.call(this)
  return objProps[objectId] ? objProps[objectId] : {}
}

function getObjectCustomProperty(objectId, objectProp) {
  const objProps = getObjectProperties.call(this, objectId)
  return objProps ? objProps[objectProp] : undefined
}

function setObjectCustomProperty(objectId, objectProp, propValue, configObject) {
  let objectsProperties = getObjectsProperties.call(this)
  if (!objectsProperties[objectId]) {
    objectsProperties[objectId] = {}
  }
  objectsProperties[objectId][objectProp] = propValue
  this.setProperty(CUSTOM_PROPERTY_NAME, pickle(objectsProperties), configObject)
}

function deleteObjectProperties(objectId, configObject) {
  let objectsProperties = this.getObjectsProperties()
  delete objectsProperties[objectId]
  this.setProperty(CUSTOM_PROPERTY_NAME, pickle(objectsProperties), configObject)
}

function migrateCustomObjectProps() {
  let properties = this.getProperties()
  let collatedProperties = {}
  let propertiesToDelete = []
  for(let property in properties) {
    // determine if it's a property in the format we expect
    if (property.includes('-')) {
      const parts = property.split('-')
      // if it's an old-fashion property, deal with it appropriately
      if (parts.length === 3) {
        if (parts[0] === 'metric' || parts[0] === 'obj') {
          const objId = parts[1]
          const objProp = parts[2]
          const objValue = properties[property]
          if (!collatedProperties[objId]) {
            collatedProperties[objId] = {}
          }
          collatedProperties[objId][objProp] = objValue
          propertiesToDelete.push(property)
        }
      } else {
        if (parts[0] === 'obj') {
          const objId = parts[1]
          const objProps = properties[property]
          if (typeof objProps === 'object') {
            collatedProperties[objId] = objProps
            propertiesToDelete.push(property)
          }
          if (typeof objProps === 'string') {
            try {
              let parsedObjProps = JSON.parse(unescape(objProps))
              collatedProperties[objId] = parsedObjProps
              propertiesToDelete.push(property)
            } catch (error) {
              console.warn(error)
              console.warn(`Couldn't parse ${objectProps}`)
            }
          }
        }
      }
    }
  }

  let objectsProperties = this.getObjectsProperties()
  for (let oldKey in collatedProperties) {
    if (!objectsProperties[oldKey]) {
      objectsProperties[oldKey] = collatedProperties[oldKey]
    }
  }
  let allProperties = this.getProperties()
  propertiesToDelete.forEach(function (key) {
    delete allProperties[key]
  })
  this.setProperty(CUSTOM_PROPERTY_NAME, pickle(objectsProperties))
}

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

let objectPropertiesMixin = {
  deleteObjectProperties,
  getObjectProperties,
  getObjectsProperties,
  getObjectCustomProperty,
  setObjectCustomProperty,
  migrateCustomObjectProps
}

export {
  addMixin,
  objectPropertiesMixin,
  CUSTOM_PROPERTY_NAME
}
