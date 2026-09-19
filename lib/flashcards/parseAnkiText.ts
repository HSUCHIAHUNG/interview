export type ParsedCard = {
  id: string
  front: string
  back: string
  valid: boolean
}

export function genId() {
  return Math.random().toString(36).slice(2, 10)
}

export function isValidCard(front: string, back: string): boolean {
  return front.trim() !== '' && back.trim() !== ''
}

export function parseAnkiText(raw: string): ParsedCard[] {
  return raw
    .split('\n')
    .map(line => line.replace(/\r$/, ''))
    .filter(line => line.trim() !== '')
    .map(line => {
      const [front = '', back = ''] = line.split('\t')
      const trimmedFront = front.trim()
      const trimmedBack = back.trim()
      return {
        id: genId(),
        front: trimmedFront,
        back: trimmedBack,
        valid: isValidCard(trimmedFront, trimmedBack),
      }
    })
}
