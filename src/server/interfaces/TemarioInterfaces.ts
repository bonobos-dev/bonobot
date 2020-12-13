interface ThemeData {
  title?:string,
  subtitles?: string[]
}

interface TemarioData {
  name?:string,
  date?:string,
  schedule?:string,
  active?:string,
  content?:ThemeData[]
}


export { ThemeData , TemarioData }

