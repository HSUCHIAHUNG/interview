export type MethodEntry = {
  slug: string
  name: string
  mutates: boolean
  badge?: string
  returns: string
  syntax: string
  subCategory: string
  note: string
}

export type ColumnConfig = {
  col2Label: string
  col2Type: 'boolean' | 'badge'
}
