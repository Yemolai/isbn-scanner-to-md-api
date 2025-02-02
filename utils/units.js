const INCH_TO_CM = 2.54;
const POUND_TO_KG = 0.45359237;

function convertLength(value, fromUnit, toUnit = 'cm') {
  if (!value) return null;
  
  switch(`${fromUnit}-${toUnit}`) {
    case 'inches-cm':
      return value * INCH_TO_CM;
    default:
      return value;
  }
}

function convertWeight(value, fromUnit, toUnit = 'kg') {
  if (!value) return null;

  switch(`${fromUnit}-${toUnit}`) {
    case 'pounds-kg':
      return value * POUND_TO_KG;
    default:
      return value;
  }
}

module.exports = { convertLength, convertWeight };
