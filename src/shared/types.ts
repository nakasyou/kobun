export type MorphToken = {
  surface: string
  base: string
  pos: string
  reading: string
  conjugation?: {
    kind?: string
    mizen: string
    renyo: string
    shushi: string
    rentai: string
    izen: string
    meirei: string
  }
  auxMeaning?: string
  jpMeaning?: string
}

export type ClassicalSample = {
  text: string
  source: string
  tokens: MorphToken[]
}
