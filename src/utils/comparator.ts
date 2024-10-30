const isNotEqual = <T>(item: T) => {
  return (value: T) => {
    return item !== value
  }
}

export {
  isNotEqual
}