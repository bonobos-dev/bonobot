export function booleanFromString(string: string): boolean {
  let value: boolean;
  if (string === 'true') value = true;
  else if (string === 'false') value = false;
  else value = undefined;
  return value;
}

export function isValidColor(str: string): boolean {
  return str.match(/^#[a-f0-9]{6}$/i) !== null;
}

export function arraysEqual(_arr1: any[], _arr2: any[]): boolean {
  if (!Array.isArray(_arr1) || !Array.isArray(_arr2) || _arr1.length !== _arr2.length) {
    return false;
  }

  const arr1 = _arr1.concat().sort();
  const arr2 = _arr2.concat().sort();

  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }

  return true;
}

export function stringlength(input: string, options: { min?: number; max?: number }): boolean {
  if (input.length < options.min || input.length > options.max) return false;
  return true;
}

export function isNormalInteger(str: string): boolean {
  const n = Math.floor(Number(str));
  return n !== Infinity && String(n) === str && n >= 0;
}
