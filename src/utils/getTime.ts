const getCurrentTime = () => {
  return Date.now()
}

const getTommorow = () => {
  return Date.now() + 24 * 60 * 60 * 1000
}

export {
  getCurrentTime,
  getTommorow
}