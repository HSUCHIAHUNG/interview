import Link from 'next/link'
import { getKeyPointsBySlug } from '@/lib/db/queries'
import CheatsheetClient from './CheatsheetClient'

export const dynamic = 'force-dynamic'

export type MethodEntry = {
  slug: string
  name: string
  mutates: boolean
  returns: string
  syntax: string
  subCategory: string
  note: string
}


const METHODS: MethodEntry[] = [
  // ── 會改變原始陣列 ──────────────────────────────────────────
  {
    slug: 'array-push',
    name: 'push()',
    mutates: true,
    returns: '新的陣列長度',
    syntax: 'arr.push(el)',
    subCategory: '會改變原始陣列',
    note: '在陣列末端加入一個或多個元素',
  },
  {
    slug: 'array-pop',
    name: 'pop()',
    mutates: true,
    returns: '被移除的元素；空陣列回傳 undefined',
    syntax: 'arr.pop()',
    subCategory: '會改變原始陣列',
    note: '移除並回傳陣列的最後一個元素',
  },
  {
    slug: 'array-shift',
    name: 'shift()',
    mutates: true,
    returns: '被移除的第一個元素；空陣列回傳 undefined',
    syntax: 'arr.shift()',
    subCategory: '會改變原始陣列',
    note: '移除並回傳陣列的第一個元素',
  },
  {
    slug: 'array-unshift',
    name: 'unshift()',
    mutates: true,
    returns: '新的陣列長度',
    syntax: 'arr.unshift(el)',
    subCategory: '會改變原始陣列',
    note: '在陣列開頭加入一個或多個元素',
  },
  {
    slug: 'array-splice',
    name: 'splice()',
    mutates: true,
    returns: '包含被刪除元素的陣列；無刪除則回傳 []',
    syntax: 'arr.splice(start, n, ...items)',
    subCategory: '會改變原始陣列',
    note: '從指定位置刪除或插入元素',
  },
  {
    slug: 'array-sort',
    name: 'sort()',
    mutates: true,
    returns: '排序後的原陣列（同一參考）',
    syntax: 'arr.sort(compareFn)',
    subCategory: '會改變原始陣列',
    note: '預設為字串排序，可傳入比較函式自訂邏輯',
  },
  {
    slug: 'array-reverse',
    name: 'reverse()',
    mutates: true,
    returns: '反轉後的原陣列（同一參考）',
    syntax: 'arr.reverse()',
    subCategory: '會改變原始陣列',
    note: '反轉陣列元素的順序',
  },
  {
    slug: 'array-fill',
    name: 'fill()',
    mutates: true,
    returns: '修改後的原陣列',
    syntax: 'arr.fill(value, start, end)',
    subCategory: '會改變原始陣列',
    note: '用指定值填充陣列的一段範圍',
  },
  {
    slug: 'array-copywithin',
    name: 'copyWithin()',
    mutates: true,
    returns: '修改後的原陣列',
    syntax: 'arr.copyWithin(target, start, end)',
    subCategory: '會改變原始陣列',
    note: '將陣列一段元素複製到同陣列的另一個位置',
  },

  // ── 回傳陣列元素資訊或索引值 ────────────────────────────────
  {
    slug: 'array-indexof',
    name: 'indexOf()',
    mutates: false,
    returns: '第一次出現的 index；找不到回傳 -1',
    syntax: 'arr.indexOf(value)',
    subCategory: '回傳陣列元素資訊或索引值',
    note: '無法偵測 NaN（使用嚴格相等 ===）',
  },
  {
    slug: 'array-lastindexof',
    name: 'lastIndexOf()',
    mutates: false,
    returns: '最後一次出現的 index；找不到回傳 -1',
    syntax: 'arr.lastIndexOf(value)',
    subCategory: '回傳陣列元素資訊或索引值',
    note: '從末端往前搜尋',
  },
  {
    slug: 'array-find',
    name: 'find()',
    mutates: false,
    returns: '第一個符合條件的元素；找不到回傳 undefined',
    syntax: 'arr.find(fn)',
    subCategory: '回傳陣列元素資訊或索引值',
    note: '回傳元素本身（非 index），找到即停止',
  },
  {
    slug: 'array-findindex',
    name: 'findIndex()',
    mutates: false,
    returns: '第一個符合條件元素的 index；找不到回傳 -1',
    syntax: 'arr.findIndex(fn)',
    subCategory: '回傳陣列元素資訊或索引值',
    note: '回傳 index（非元素），找到即停止',
  },
  {
    slug: 'array-filter',
    name: 'filter()',
    mutates: false,
    returns: '符合條件的新陣列；無符合回傳 []',
    syntax: 'arr.filter(fn)',
    subCategory: '回傳陣列元素資訊或索引值',
    note: '回傳所有符合條件的元素，不修改原陣列',
  },
  {
    slug: 'array-length',
    name: 'length',
    mutates: false,
    returns: '陣列元素數量（number）',
    syntax: 'arr.length',
    subCategory: '回傳陣列元素資訊或索引值',
    note: '賦值可截斷或擴展陣列',
  },

  // ── 針對每個元素處理 ────────────────────────────────────────
  {
    slug: 'array-foreach',
    name: 'forEach()',
    mutates: false,
    returns: 'undefined（永遠）',
    syntax: 'arr.forEach(fn)',
    subCategory: '針對每個元素處理',
    note: '執行副作用用，無法 break 提早停止',
  },

  // ── 產生新的陣列或新的值 ────────────────────────────────────
  {
    slug: 'array-map',
    name: 'map()',
    mutates: false,
    returns: '等長的新陣列',
    syntax: 'arr.map(fn)',
    subCategory: '產生新的陣列或新的值',
    note: '轉換每個元素，原陣列不變',
  },
  {
    slug: 'array-reduce',
    name: 'reduce()',
    mutates: false,
    returns: '累積後的單一值（型別由初始值決定）',
    syntax: 'arr.reduce(fn, initialValue)',
    subCategory: '產生新的陣列或新的值',
    note: '從左往右將陣列聚合成單一值',
  },
  {
    slug: 'array-reduceright',
    name: 'reduceRight()',
    mutates: false,
    returns: '從右往左累積後的單一值',
    syntax: 'arr.reduceRight(fn, initialValue)',
    subCategory: '產生新的陣列或新的值',
    note: '與 reduce() 相同但從右端開始',
  },
  {
    slug: 'array-flat',
    name: 'flat()',
    mutates: false,
    returns: '展平後的新陣列',
    syntax: 'arr.flat(depth)',
    subCategory: '產生新的陣列或新的值',
    note: '預設展平一層，Infinity 可展平所有層',
  },
  {
    slug: 'array-flatmap',
    name: 'flatMap()',
    mutates: false,
    returns: '先 map 再 flat(1) 的新陣列',
    syntax: 'arr.flatMap(fn)',
    subCategory: '產生新的陣列或新的值',
    note: '等於 map().flat(1)，效率較高',
  },
  {
    slug: 'array-slice',
    name: 'slice()',
    mutates: false,
    returns: '截取範圍的新陣列',
    syntax: 'arr.slice(start, end)',
    subCategory: '產生新的陣列或新的值',
    note: '不含 end，支援負數 index',
  },
  {
    slug: 'array-concat',
    name: 'concat()',
    mutates: false,
    returns: '合併後的新陣列',
    syntax: 'arr.concat(arr2)',
    subCategory: '產生新的陣列或新的值',
    note: '可合併多個陣列，原陣列不變',
  },
  {
    slug: 'array-join',
    name: 'join()',
    mutates: false,
    returns: '用分隔符連接的字串',
    syntax: "arr.join(separator)",
    subCategory: '產生新的陣列或新的值',
    note: '預設分隔符為逗號',
  },
  {
    slug: 'array-from',
    name: 'Array.from()',
    mutates: false,
    returns: '新的 Array 實例',
    syntax: 'Array.from(arrayLike, mapFn)',
    subCategory: '產生新的陣列或新的值',
    note: '從類陣列或可迭代物件建立陣列',
  },
  {
    slug: 'array-of',
    name: 'Array.of()',
    mutates: false,
    returns: '包含所有引數的新陣列',
    syntax: 'Array.of(...items)',
    subCategory: '產生新的陣列或新的值',
    note: '解決 new Array(n) 語意不一致的問題',
  },
  {
    slug: 'array-tostring',
    name: 'toString()',
    mutates: false,
    returns: '以逗號分隔的字串（同 join(\',\')）',
    syntax: 'arr.toString()',
    subCategory: '產生新的陣列或新的值',
    note: '型別轉換時由引擎自動呼叫',
  },

  // ── 判斷並回傳布林值 ────────────────────────────────────────
  {
    slug: 'array-every',
    name: 'every()',
    mutates: false,
    returns: '全部符合回傳 true，否則 false',
    syntax: 'arr.every(fn)',
    subCategory: '判斷並回傳布林值',
    note: '遇到不符合的元素立即停止',
  },
  {
    slug: 'array-some',
    name: 'some()',
    mutates: false,
    returns: '至少一個符合回傳 true，否則 false',
    syntax: 'arr.some(fn)',
    subCategory: '判斷並回傳布林值',
    note: '遇到符合的元素立即停止',
  },
  {
    slug: 'array-includes',
    name: 'includes()',
    mutates: false,
    returns: '包含回傳 true，否則 false',
    syntax: 'arr.includes(value)',
    subCategory: '判斷並回傳布林值',
    note: '可正確偵測 NaN（不同於 indexOf）',
  },
  {
    slug: 'array-isarray',
    name: 'Array.isArray()',
    mutates: false,
    returns: '是陣列回傳 true，否則 false',
    syntax: 'Array.isArray(value)',
    subCategory: '判斷並回傳布林值',
    note: '比 typeof 或 instanceof 更可靠的陣列判斷',
  },

  // ── 其他用法 ────────────────────────────────────────────────
  {
    slug: 'array-keys',
    name: 'keys()',
    mutates: false,
    returns: '包含每個 index 的 Array Iterator',
    syntax: 'arr.keys()',
    subCategory: '其他用法',
    note: '可用 for...of 遍歷所有鍵（index）',
  },
  {
    slug: 'array-valueof',
    name: 'valueOf()',
    mutates: false,
    returns: '陣列本身（原始參考）',
    syntax: 'arr.valueOf()',
    subCategory: '其他用法',
    note: '型別轉換時由引擎自動呼叫，通常不直接使用',
  },
]

export default async function ArrayCheatsheetPage() {
  const keyPointsMap: Record<string, { id: number; text: string }[]> = {}
  await Promise.all(
    METHODS.map(async (m) => {
      keyPointsMap[m.slug] = await getKeyPointsBySlug(m.slug)
    }),
  )

  return (
    <main className="min-h-screen bg-gray-950 px-4 py-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-2 mb-8 text-sm">
          <Link href="/cheatsheet" className="text-gray-500 hover:text-gray-300 transition">速查表</Link>
          <span className="text-gray-700">/</span>
          <span className="text-gray-300">陣列方法</span>
        </div>

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-100">陣列方法速查表</h1>
          <p className="text-gray-500 text-sm mt-1">
            {METHODS.length} 個方法 · 快速複習回傳值、語法，並新增自己的重點筆記
          </p>
        </div>

        <CheatsheetClient methods={METHODS} initialKeyPointsMap={keyPointsMap} />
      </div>
    </main>
  )
}
