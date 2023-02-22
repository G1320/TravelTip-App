function getFormData(ev) {
  ev.preventDefault()

  const elForm = ev.target
  console.log('🚀 ~ file: user.controller.js:5 ~ getFormData ~ elForm', elForm)
  const formData = new FormData(elForm)
  console.log('formData', formData)

  const user = Object.fromEntries(formData)
  console.log('🚀 ~ file: user.controller.js:9 ~ getFormData ~ user', user)
  user.loc = handleLocationInput(user.loc)

  if (!user.loc) {
    alert('Invalid location input')
    return
  }

  saveUser(user)
  elForm.reset()
}

function handleLocationInput(location) {
  const savedLocations = getPlaces()

  switch (location) {
    case 'First saved location':
      return savedLocations.length ? savedLocations[0] : null
    case 'Random saved location':
      return savedLocations.length
        ? savedLocations[getRandomIntInclusive(0, savedLocations.length - 1)]
        : null
    case 'Last selected saved location':
      return getSelectedPlace()
    case 'Current location':
      return 'Current location'
    default:
      if (location.length >= 3 && location.includes(',')) {
        const [lat, lng] = location.split(',').map((val) => +val)
        if (lat <= 90 && lng <= 90) {
          return { lat, lng }
        }
      }
      return null
  }
}

function renderValue({ value }) {
  const elSpan = document.querySelector('.rangeValue')
  elSpan.innerText = value
  console.log('value', value)
}

function onInit() {
  const user = getUser()
  if (!user) return
  const { bgColor, textColor } = user
  const elBody = document.querySelector('body')
  elBody.style.backgroundColor = bgColor
  elBody.style.color = textColor
}
