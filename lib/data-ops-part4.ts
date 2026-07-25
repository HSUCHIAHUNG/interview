import type { MethodEntry } from './array-challenges'

export const dataOpsPart4: MethodEntry[] = [
  // ─── 購物車操作 ────────────────────────────────────────────────────
  {
    slug: 'shopping-cart',
    methodName: '購物車操作',
    title: '購物車業務邏輯實作',
    description: '實作真實電商購物車的資料處理：加減數量、折扣計算、優惠碼套用',
    subCategory: '業務場景實作',
    difficulty: 'medium',
    notes: {
      title: '購物車業務邏輯',
      sections: [
        {
          heading: '購物車核心邏輯',
          content: `購物車資料通常以陣列儲存，每筆商品包含：
- \`productId\`：商品識別碼
- \`price\`：單價
- \`quantity\`：數量
- \`discountRate\`（可選）：折扣率（0 表示無折扣，0.2 表示打八折）

計算小計時：\`subtotal = price * quantity\`
計算折扣後金額：\`discountedPrice = price * (1 - discountRate) * quantity\``,
        },
        {
          heading: '浮點數精度問題',
          content: `JavaScript 浮點數計算可能產生精度誤差：

\`\`\`js
0.1 + 0.2  // 0.30000000000000004
\`\`\`

常見解法：
\`\`\`js
// 四捨五入到小數點後兩位
Math.round(amount * 100) / 100

// 或使用 toFixed（回傳字串，需轉回數字）
parseFloat(amount.toFixed(2))
\`\`\`

金融計算建議使用整數（分）為單位再轉換。`,
        },
        {
          heading: '折扣套用順序',
          content: `折扣有兩種主要類型：
1. **商品折扣（discountRate）**：對每件商品個別套用，先計算
2. **優惠碼（coupon）**：對整張訂單套用，後計算

優惠碼類型：
- \`percent\`：百分比折扣，\`total * (1 - coupon.value)\`（例如 value=0.1 表示九折）
- \`fixed\`：固定金額折扣，\`total - coupon.value\`（例如 value=100 表示折抵 100 元）

注意：折扣後金額不應低於 0。`,
        },
        {
          heading: '運費與免運門檻',
          content: `電商常見的運費邏輯：

\`\`\`js
const SHIPPING_THRESHOLD = 1000  // 免運門檻
const SHIPPING_FEE = 60          // 運費

const shipping = subtotalAfterDiscount >= SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE
const total = subtotalAfterDiscount - couponDiscount + shipping
\`\`\`

實際計算順序：
1. 計算每項商品小計
2. 套用商品折扣
3. 加總得到小計
4. 套用優惠碼
5. 判斷是否免運
6. 得出最終總計`,
        },
      ],
    },
    keyPoints: [
      '購物車小計計算：先用 price * quantity 算出每項小計，再加總所有小計得到總計。',
      '合併相同商品時，用 Map 以 productId 為 key，遇到重複 key 時將 quantity 相加，最後轉回陣列。',
      '商品折扣（discountRate）應先套用到個別商品，優惠碼（coupon）再套用到整張訂單的小計，順序不能搞反。',
      '優惠碼有兩種：percent 類型是乘以折扣率，fixed 類型是直接減去固定金額，注意折扣後金額不能低於 0。',
      '完整結帳流程：計算小計 → 套用商品折扣 → 加總 → 套用優惠碼 → 判斷免運門檻 → 計算最終總計，每個步驟都要記錄下來以便顯示明細。',
    ],
    problems: [
      {
        id: 'subtotal',
        title: '計算購物車小計',
        difficulty: 'easy',
        description: `計算購物車中每件商品的小計（price × quantity），以及所有商品的總計。

請完成以下任務：
1. 為每個 item 加上 \`subtotal\` 欄位（price × quantity）
2. 將所有小計加總存到 \`total\``,
        examples: [
          {
            input: `items = [{ price: 100, quantity: 2 }, { price: 50, quantity: 3 }]`,
            output: `items[0].subtotal = 200, items[1].subtotal = 150, total = 350`,
          },
        ],
        initialCode: `const items = [
  { productId: 1, name: '滑鼠', price: 100, quantity: 2 },
  { productId: 2, name: '鍵盤', price: 50, quantity: 3 },
  { productId: 3, name: '螢幕', price: 800, quantity: 1 },
]

// TODO: 為每個 item 加上 subtotal 欄位，並計算總計
// items[0].subtotal 應為 200，items[1].subtotal 應為 150，items[2].subtotal 應為 800

let total // 所有小計的加總
`,
        testCases: [
          { label: 'items[0].subtotal 應為 200', test: `return items[0] && items[0].subtotal === 200` },
          { label: 'items[1].subtotal 應為 150', test: `return items[1] && items[1].subtotal === 150` },
          { label: 'items[2].subtotal 應為 800', test: `return items[2] && items[2].subtotal === 800` },
          { label: 'total 應為 1150', test: `return total === 1150` },
        ],
      },
      {
        id: 'merge-items',
        title: '合併相同商品',
        difficulty: 'easy',
        description: `使用者多次加入同一商品，購物車中出現重複的 \`productId\`。
請合併相同 \`productId\` 的商品（數量相加），每個商品只保留一筆紀錄。

結果存到 \`merged\` 陣列。`,
        examples: [
          {
            input: `cartItems = [{ productId: 1, quantity: 1 }, { productId: 1, quantity: 2 }]`,
            output: `merged = [{ productId: 1, quantity: 3, ... }]`,
          },
        ],
        initialCode: `const cartItems = [
  { productId: 1, name: '滑鼠', price: 100, quantity: 1 },
  { productId: 2, name: '鍵盤', price: 50, quantity: 2 },
  { productId: 1, name: '滑鼠', price: 100, quantity: 3 },
  { productId: 3, name: '耳機', price: 200, quantity: 1 },
  { productId: 2, name: '鍵盤', price: 50, quantity: 1 },
]

// TODO: 合併相同 productId 的商品，數量相加
let merged // 合併後的商品陣列
`,
        testCases: [
          { label: 'merged 應有 3 筆商品', test: `return Array.isArray(merged) && merged.length === 3` },
          { label: 'productId=1 的數量應為 4', test: `return merged && merged.find(i => i.productId === 1)?.quantity === 4` },
          { label: 'productId=2 的數量應為 3', test: `return merged && merged.find(i => i.productId === 2)?.quantity === 3` },
          { label: 'productId=3 的數量應為 1', test: `return merged && merged.find(i => i.productId === 3)?.quantity === 1` },
        ],
      },
      {
        id: 'discount-rate',
        title: '套用商品折扣',
        difficulty: 'medium',
        description: `每件商品有 \`discountRate\`（0~1）欄位，代表折扣比例（0.2 表示打八折）。

請計算：
1. 每件商品折扣後的金額 \`discountedAmount\`（price × (1 - discountRate) × quantity，四捨五入至整數）
2. 所有商品折扣後的總計 \`discountedTotal\``,
        examples: [
          {
            input: `{ price: 100, quantity: 2, discountRate: 0.1 }`,
            output: `discountedAmount = 180（100 × 0.9 × 2）`,
          },
        ],
        initialCode: `const items = [
  { productId: 1, name: '上衣', price: 500, quantity: 2, discountRate: 0.2 },
  { productId: 2, name: '褲子', price: 800, quantity: 1, discountRate: 0 },
  { productId: 3, name: '帽子', price: 300, quantity: 3, discountRate: 0.1 },
]

// TODO: 為每個 item 計算 discountedAmount（四捨五入至整數）
// 並計算所有折扣後金額的加總

let discountedTotal // 所有 discountedAmount 的加總
`,
        testCases: [
          { label: 'items[0].discountedAmount 應為 800', test: `return items[0] && items[0].discountedAmount === 800` },
          { label: 'items[1].discountedAmount 應為 800', test: `return items[1] && items[1].discountedAmount === 800` },
          { label: 'items[2].discountedAmount 應為 810', test: `return items[2] && items[2].discountedAmount === 810` },
          { label: 'discountedTotal 應為 2410', test: `return discountedTotal === 2410` },
        ],
      },
      {
        id: 'coupon',
        title: '優惠碼系統',
        difficulty: 'medium',
        description: `實作優惠碼套用邏輯。優惠碼物件格式：
- \`{ type: 'percent', value: 0.1 }\`：九折（減去 10%）
- \`{ type: 'fixed', value: 100 }\`：直接折抵 100 元

請計算套用優惠碼後的 \`finalTotal\`（不可低於 0）。`,
        examples: [
          {
            input: `subtotal = 1000, coupon = { type: 'percent', value: 0.1 }`,
            output: `finalTotal = 900`,
          },
          {
            input: `subtotal = 1000, coupon = { type: 'fixed', value: 150 }`,
            output: `finalTotal = 850`,
          },
        ],
        initialCode: `const subtotal = 1200

const couponPercent = { type: 'percent', value: 0.1 } // 九折
const couponFixed = { type: 'fixed', value: 200 }     // 折抵 200 元

// TODO: 分別計算套用兩種優惠碼後的金額
let finalTotalPercent // 套用 couponPercent 後
let finalTotalFixed   // 套用 couponFixed 後
`,
        testCases: [
          { label: 'finalTotalPercent 應為 1080', test: `return finalTotalPercent === 1080` },
          { label: 'finalTotalFixed 應為 1000', test: `return finalTotalFixed === 1000` },
          {
            label: '折扣後金額不可低於 0',
            test: `const s = 50; const c = { type: 'fixed', value: 200 }; const r = Math.max(0, s - c.value); return r === 0`,
          },
        ],
      },
      {
        id: 'checkout',
        title: '完整結帳計算',
        difficulty: 'hard',
        description: `實作完整的結帳流程，依序：
1. 計算每項小計（price × quantity）
2. 套用商品折扣（discountRate），計算折扣後小計
3. 套用優惠碼（coupon）
4. 計算運費（訂單滿 1000 免運，否則 60 元）
5. 回傳完整明細物件 \`result\`

\`result\` 格式：
\`\`\`
{
  items: [...],       // 每項加上 subtotal 和 discountedAmount
  subtotal: number,   // 折扣前加總
  discount: number,   // 商品折扣金額
  couponDiscount: number, // 優惠碼折扣金額
  shipping: number,   // 運費
  total: number       // 最終總計
}
\`\`\``,
        initialCode: `const cartItems = [
  { productId: 1, name: '外套', price: 1200, quantity: 1, discountRate: 0.1 },
  { productId: 2, name: 'T恤', price: 400, quantity: 2, discountRate: 0 },
]
const coupon = { type: 'percent', value: 0.05 } // 95 折

// TODO: 依序計算各步驟，最後組合成 result 物件
let result
`,
        testCases: [
          { label: 'result.subtotal 應為 2000', test: `return result && result.subtotal === 2000` },
          { label: 'result.discount 應為 120', test: `return result && result.discount === 120` },
          { label: 'result.couponDiscount 應為 94', test: `return result && result.couponDiscount === 94` },
          { label: 'result.shipping 應為 0（訂單金額超過 1000）', test: `return result && result.shipping === 0` },
          { label: 'result.total 應為 1786', test: `return result && result.total === 1786` },
        ],
      },
    ],
  },

  // ─── 權限管理 ────────────────────────────────────────────────────
  {
    slug: 'permission-system',
    methodName: '權限管理',
    title: '使用者權限管理系統',
    description: '實作角色繼承、資源授權判斷的權限管理邏輯',
    subCategory: '業務場景實作',
    difficulty: 'hard',
    notes: {
      title: '使用者權限管理',
      sections: [
        {
          heading: 'RBAC 概念',
          content: `RBAC（Role-Based Access Control）是最常見的權限管理模型：

- **使用者（User）**：系統中的人，可有多個角色
- **角色（Role）**：一組權限的集合，例如 \`admin\`、\`editor\`、\`viewer\`
- **權限（Permission）**：可執行的動作，例如 \`read:post\`、\`write:post\`、\`delete:post\`

判斷流程：使用者 → 查其角色 → 查角色擁有的權限 → 是否包含所需權限`,
        },
        {
          heading: '角色繼承',
          content: `角色可以繼承其他角色的所有權限：

\`\`\`js
const roleHierarchy = {
  admin:  { inherits: ['editor'], permissions: ['delete:any'] },
  editor: { inherits: ['viewer'], permissions: ['write:post'] },
  viewer: { inherits: [],         permissions: ['read:post'] },
}
\`\`\`

計算 \`admin\` 的完整權限，需要遞迴展開所有繼承：
- admin 自身：\`delete:any\`
- 繼承 editor：\`write:post\` + 繼承 viewer：\`read:post\`
- 最終：\`['delete:any', 'write:post', 'read:post']\`

注意：要防止循環繼承（用 visited Set 記錄已處理的角色）。`,
        },
        {
          heading: '最小權限原則',
          content: `安全設計原則：只給使用者完成任務所需的最小權限。

實作時的注意事項：
- 預設拒絕（Deny by Default）：沒有明確授權就拒絕
- 明確拒絕優先（Explicit Deny Wins）：有些系統中，明確的拒絕設定比允許設定優先
- 細粒度控制：不同欄位可以有不同的可見性設定`,
        },
        {
          heading: '權限展開實作',
          content: `遞迴展開角色權限的實作模式：

\`\`\`js
function expandPermissions(roleName, roles, visited = new Set()) {
  if (visited.has(roleName)) return new Set()
  visited.add(roleName)

  const role = roles[roleName]
  const perms = new Set(role.permissions)

  for (const inherited of role.inherits) {
    for (const perm of expandPermissions(inherited, roles, visited)) {
      perms.add(perm)
    }
  }
  return perms
}
\`\`\``,
        },
      ],
    },
    keyPoints: [
      'RBAC 的核心概念：使用者有角色，角色有權限，判斷授權時沿著 使用者→角色→權限 的路徑查找。',
      '角色繼承需要遞迴展開，計算一個角色的完整權限時，要把所有祖先角色的權限都合併進來，並用 Set 去重。',
      '實作角色繼承時要防止循環繼承（A 繼承 B，B 又繼承 A），用 visited Set 記錄已處理的角色可以避免無窮遞迴。',
      '最小權限原則：預設拒絕，只有明確授權才允許，這比「預設允許、明確拒絕」更安全。',
      '細粒度權限控制可以針對同一個資源的不同欄位設定不同的可見性，過濾使用者看不到的欄位時，先計算使用者的完整權限集合，再對欄位做篩選。',
    ],
    problems: [
      {
        id: 'has-permission',
        title: '檢查使用者權限',
        difficulty: 'easy',
        description: `實作 \`hasPermission(user, permission)\` 函式。

使用者物件有 \`roles\` 陣列，每個角色有對應的 \`permissions\` 陣列。
只要使用者任一角色包含指定 \`permission\`，就回傳 \`true\`。

請將結果存到 \`canRead\` 和 \`canDelete\`。`,
        initialCode: `const rolePermissions = {
  admin:  ['read:post', 'write:post', 'delete:post'],
  editor: ['read:post', 'write:post'],
  viewer: ['read:post'],
}

const user = { id: 1, name: '小明', roles: ['editor'] }

function hasPermission(user, permission) {
  // TODO: 實作權限檢查
}

const canRead   = hasPermission(user, 'read:post')    // 應為 true
const canDelete = hasPermission(user, 'delete:post')  // 應為 false
`,
        testCases: [
          { label: 'canRead 應為 true', test: `return canRead === true` },
          { label: 'canDelete 應為 false', test: `return canDelete === false` },
          {
            label: 'admin 應有 delete 權限',
            test: `const rp = { admin: ['delete:post'] }; const u = { roles: ['admin'] }; function hp(u,p){ return u.roles.some(r => rp[r]?.includes(p)) } return hp(u, 'delete:post') === true`,
          },
        ],
      },
      {
        id: 'role-inheritance',
        title: '角色繼承展開',
        difficulty: 'medium',
        description: `實作 \`expandRole(roleName)\` 函式，遞迴展開一個角色及其所有繼承角色的完整權限集合，回傳 \`Set<string>\`。

角色定義如下，\`admin\` 繼承 \`editor\`，\`editor\` 繼承 \`viewer\`。

請將 \`admin\` 和 \`editor\` 的完整權限分別存到 \`adminPerms\` 和 \`editorPerms\`（均為陣列）。`,
        initialCode: `const roles = {
  admin:  { inherits: ['editor'], permissions: ['delete:post', 'manage:user'] },
  editor: { inherits: ['viewer'], permissions: ['write:post', 'edit:post'] },
  viewer: { inherits: [],         permissions: ['read:post', 'list:post'] },
}

function expandRole(roleName, visited = new Set()) {
  // TODO: 遞迴展開角色權限，回傳 Set<string>
}

const adminPerms  = [...expandRole('admin')]   // 應包含 6 個權限
const editorPerms = [...expandRole('editor')]  // 應包含 4 個權限
`,
        testCases: [
          { label: 'adminPerms 應有 6 個權限', test: `return Array.isArray(adminPerms) && adminPerms.length === 6` },
          { label: 'adminPerms 應包含 read:post', test: `return adminPerms && adminPerms.includes('read:post')` },
          { label: 'adminPerms 應包含 manage:user', test: `return adminPerms && adminPerms.includes('manage:user')` },
          { label: 'editorPerms 應有 4 個權限', test: `return Array.isArray(editorPerms) && editorPerms.length === 4` },
          { label: 'editorPerms 不應包含 manage:user', test: `return editorPerms && !editorPerms.includes('manage:user')` },
        ],
      },
      {
        id: 'resource-auth',
        title: '資源授權判斷',
        difficulty: 'medium',
        description: `每個資源定義了讀、寫、刪各自所需的權限（\`requiredPermissions\`）。

實作 \`canAccess(user, resource, action)\` 函式，判斷使用者是否可以對資源執行 \`'read' | 'write' | 'delete'\` 操作。

請計算 \`results\` 物件（包含三個布林值）。`,
        initialCode: `const rolePermissions = {
  admin:  ['read:post', 'write:post', 'delete:post', 'read:user'],
  editor: ['read:post', 'write:post'],
  viewer: ['read:post'],
}

const resource = {
  id: 'post-1',
  requiredPermissions: {
    read:   'read:post',
    write:  'write:post',
    delete: 'delete:post',
  },
}

const user = { id: 2, roles: ['editor'] }

function canAccess(user, resource, action) {
  // TODO: 實作資源授權判斷
}

const results = {
  read:   canAccess(user, resource, 'read'),    // 應為 true
  write:  canAccess(user, resource, 'write'),   // 應為 true
  delete: canAccess(user, resource, 'delete'),  // 應為 false
}
`,
        testCases: [
          { label: 'editor 可以讀取 post', test: `return results && results.read === true` },
          { label: 'editor 可以寫入 post', test: `return results && results.write === true` },
          { label: 'editor 不可刪除 post', test: `return results && results.delete === false` },
        ],
      },
      {
        id: 'field-visibility',
        title: '細粒度欄位可見性',
        difficulty: 'hard',
        description: `同一資源的不同欄位對不同角色有不同的可見性設定。

給定 \`fieldPolicy\` 物件，定義每個欄位哪些角色可見。
實作函式過濾出使用者可以看到的欄位，結果存到 \`visibleRecord\`。`,
        initialCode: `const fieldPolicy = {
  id:       ['viewer', 'editor', 'admin'],
  name:     ['viewer', 'editor', 'admin'],
  email:    ['editor', 'admin'],
  salary:   ['admin'],
  password: [],  // 任何人都不可見
}

const record = {
  id: 1,
  name: '小華',
  email: 'xiaohua@example.com',
  salary: 80000,
  password: 'hashed_pw',
}

const user = { id: 3, roles: ['editor'] }

// TODO: 過濾出 user 可以看到的欄位
let visibleRecord
`,
        testCases: [
          { label: 'visibleRecord 應有 id 欄位', test: `return visibleRecord && 'id' in visibleRecord` },
          { label: 'visibleRecord 應有 email 欄位', test: `return visibleRecord && 'email' in visibleRecord` },
          { label: 'visibleRecord 不應有 salary 欄位', test: `return visibleRecord && !('salary' in visibleRecord)` },
          { label: 'visibleRecord 不應有 password 欄位', test: `return visibleRecord && !('password' in visibleRecord)` },
          { label: 'visibleRecord 應有 3 個欄位（id, name, email）', test: `return visibleRecord && Object.keys(visibleRecord).length === 3` },
        ],
      },
      {
        id: 'audit-filter',
        title: '完整鑑權：過濾未授權操作',
        difficulty: 'hard',
        description: `給一批操作紀錄 \`auditLogs\`（每筆有 \`userId\`、\`action\`、\`resource\`），過濾出沒有授權的操作。

每個使用者有自己的角色，角色有對應的允許操作清單。
結果存到 \`unauthorizedLogs\`（只保留未被授權的操作紀錄）。`,
        initialCode: `const users = [
  { id: 1, roles: ['admin'] },
  { id: 2, roles: ['editor'] },
  { id: 3, roles: ['viewer'] },
]

const roleActions = {
  admin:  ['read', 'write', 'delete'],
  editor: ['read', 'write'],
  viewer: ['read'],
}

const auditLogs = [
  { userId: 1, action: 'delete', resource: 'post-1' },  // 授權
  { userId: 2, action: 'write',  resource: 'post-2' },  // 授權
  { userId: 2, action: 'delete', resource: 'post-3' },  // 未授權
  { userId: 3, action: 'read',   resource: 'post-4' },  // 授權
  { userId: 3, action: 'write',  resource: 'post-5' },  // 未授權
]

// TODO: 過濾出未授權的操作紀錄
let unauthorizedLogs
`,
        testCases: [
          { label: 'unauthorizedLogs 應有 2 筆', test: `return Array.isArray(unauthorizedLogs) && unauthorizedLogs.length === 2` },
          { label: '應包含 userId=2 的 delete 操作', test: `return unauthorizedLogs && unauthorizedLogs.some(l => l.userId === 2 && l.action === 'delete')` },
          { label: '應包含 userId=3 的 write 操作', test: `return unauthorizedLogs && unauthorizedLogs.some(l => l.userId === 3 && l.action === 'write')` },
          { label: '不應包含 userId=1 的 delete 操作', test: `return unauthorizedLogs && !unauthorizedLogs.some(l => l.userId === 1 && l.action === 'delete')` },
        ],
      },
    ],
  },

  // ─── 待辦事項操作 ────────────────────────────────────────────────────
  {
    slug: 'todo-operations',
    methodName: '待辦事項操作',
    title: '進階待辦事項資料操作',
    description: '處理含有標籤、優先級、截止日的複雜待辦清單資料',
    subCategory: '業務場景實作',
    difficulty: 'medium',
    notes: {
      title: '進階待辦事項操作',
      sections: [
        {
          heading: '優先級排序',
          content: `待辦事項通常有三個優先級：\`high\`、\`medium\`、\`low\`。

排序時需要將字串轉換為數字比較：

\`\`\`js
const priorityOrder = { high: 0, medium: 1, low: 2 }

todos.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])
\`\`\``,
        },
        {
          heading: '標籤系統',
          content: `每個 todo 可以有多個標籤（\`tags: string[]\`）。

計算不重複標籤列表和每個標籤的 todo 數量：

\`\`\`js
const tagCount = todos.reduce((acc, todo) => {
  todo.tags.forEach(tag => {
    acc[tag] = (acc[tag] || 0) + 1
  })
  return acc
}, {})
\`\`\``,
        },
        {
          heading: '截止日分類',
          content: `根據截止日期（\`dueDate\`）將 todo 分成四類：

\`\`\`js
const now = new Date()
const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
const sevenDaysLater = new Date(today)
sevenDaysLater.setDate(today.getDate() + 7)

// 分類邏輯
if (dueDate < today)              category = 'overdue'
else if (dueDate <= today + 1day) category = 'today'
else if (dueDate <= sevenDaysLater) category = 'upcoming'
else                               category = 'later'
\`\`\``,
        },
        {
          heading: '拓撲排序與依賴關係',
          content: `當 todo 有 \`dependsOn\` 欄位時，需要拓撲排序找出可以開始的任務。

可以開始的 todo 條件：所有 \`dependsOn\` 的 todo 都已完成（\`completed: true\`）。

\`\`\`js
const canStart = todos.filter(todo => {
  if (todo.completed) return false
  return todo.dependsOn.every(depId => {
    const dep = todos.find(t => t.id === depId)
    return dep && dep.completed
  })
})
\`\`\`

完整的拓撲排序（Kahn's Algorithm）可以找出所有任務的合法執行順序。`,
        },
      ],
    },
    keyPoints: [
      '排序優先級時，將 high/medium/low 對應到 0/1/2 的數字，再用 sort 的比較函式排序，比直接比較字串更清晰。',
      '計算每個標籤的 todo 數量，先用 flatMap 展開所有標籤為一維陣列，再用 reduce 累加計數，最後可用 Object.entries 轉成排序後的列表。',
      '截止日期分類要特別注意日期比較的邊界：今天的截止日應該和今天的零點做比較，而不是和當前時間比較。',
      'todo 的依賴關係分析：一個 todo 可以開始，必須滿足它的所有依賴（dependsOn）都已完成，這是圖論中「入度為 0」概念的應用。',
      '拓撲排序可以用 Kahn\'s Algorithm（BFS 基礎）或 DFS 實作，面試時說明你選擇的演算法及其時間複雜度 O(V+E)。',
    ],
    problems: [
      {
        id: 'filter-sort',
        title: '過濾並排序未完成待辦',
        difficulty: 'easy',
        description: `從 \`todos\` 中只取出未完成的項目（\`completed: false\`），並依優先級排序（high → medium → low）。

結果存到 \`sortedTodos\` 陣列。`,
        examples: [
          {
            input: `[{ priority: 'low', completed: false }, { priority: 'high', completed: true }, { priority: 'medium', completed: false }]`,
            output: `[{ priority: 'medium' ... }, { priority: 'low' ... }]（high 的已完成，被過濾掉）`,
          },
        ],
        initialCode: `const todos = [
  { id: 1, title: '寫報告', priority: 'low',    completed: false },
  { id: 2, title: '開會',   priority: 'high',   completed: true  },
  { id: 3, title: '回信',   priority: 'medium', completed: false },
  { id: 4, title: '更新程式碼', priority: 'high', completed: false },
  { id: 5, title: '整理桌面', priority: 'low',  completed: true  },
]

// TODO: 過濾出未完成的 todos，並依優先級 high > medium > low 排序
let sortedTodos
`,
        testCases: [
          { label: 'sortedTodos 應有 3 筆', test: `return Array.isArray(sortedTodos) && sortedTodos.length === 3` },
          { label: '第一筆應為 high 優先級', test: `return sortedTodos && sortedTodos[0].priority === 'high'` },
          { label: '第二筆應為 medium 優先級', test: `return sortedTodos && sortedTodos[1].priority === 'medium'` },
          { label: '第三筆應為 low 優先級', test: `return sortedTodos && sortedTodos[2].priority === 'low'` },
          { label: '不應包含已完成的項目', test: `return sortedTodos && sortedTodos.every(t => !t.completed)` },
        ],
      },
      {
        id: 'completion-rate',
        title: '各優先級完成率統計',
        difficulty: 'easy',
        description: `計算各優先級（high、medium、low）的完成率，結果存到 \`completionRate\` 物件。

完成率 = 已完成數 / 總數（保留兩位小數，例如 0.67）。
若某優先級沒有任何項目，完成率設為 \`0\`。`,
        examples: [
          {
            input: `high 共 2 筆，1 筆完成`,
            output: `completionRate.high = 0.5`,
          },
        ],
        initialCode: `const todos = [
  { id: 1, priority: 'high',   completed: true  },
  { id: 2, priority: 'high',   completed: false },
  { id: 3, priority: 'high',   completed: true  },
  { id: 4, priority: 'medium', completed: false },
  { id: 5, priority: 'medium', completed: true  },
  { id: 6, priority: 'low',    completed: false },
  { id: 7, priority: 'low',    completed: false },
  { id: 8, priority: 'low',    completed: false },
]

// TODO: 計算各優先級完成率（保留兩位小數）
let completionRate // { high: number, medium: number, low: number }
`,
        testCases: [
          { label: 'completionRate.high 應約為 0.67', test: `return completionRate && Math.abs(completionRate.high - 0.67) < 0.01` },
          { label: 'completionRate.medium 應為 0.5', test: `return completionRate && completionRate.medium === 0.5` },
          { label: 'completionRate.low 應為 0', test: `return completionRate && completionRate.low === 0` },
        ],
      },
      {
        id: 'tag-system',
        title: '標籤系統統計',
        difficulty: 'medium',
        description: `分析 \`todos\` 的標籤資料：
1. 找出所有不重複標籤，存到 \`uniqueTags\` 陣列（排序後）
2. 計算每個標籤對應的 todo 數量，存到 \`tagCount\` 物件`,
        examples: [
          {
            input: `[{ tags: ['work', 'urgent'] }, { tags: ['work', 'meeting'] }]`,
            output: `uniqueTags = ['meeting', 'urgent', 'work'], tagCount = { work: 2, urgent: 1, meeting: 1 }`,
          },
        ],
        initialCode: `const todos = [
  { id: 1, title: '準備簡報', tags: ['work', 'urgent'] },
  { id: 2, title: '健身',     tags: ['personal', 'health'] },
  { id: 3, title: '讀書',     tags: ['personal', 'learning'] },
  { id: 4, title: 'code review', tags: ['work', 'learning'] },
  { id: 5, title: '回信',     tags: ['work'] },
]

// TODO: 計算不重複標籤列表（排序）和每個標籤的數量
let uniqueTags // 排序後的不重複標籤陣列
let tagCount   // { [tag]: count }
`,
        testCases: [
          { label: 'uniqueTags 應有 5 個不同標籤', test: `return Array.isArray(uniqueTags) && uniqueTags.length === 5` },
          { label: 'uniqueTags 應已排序', test: `return uniqueTags && JSON.stringify(uniqueTags) === JSON.stringify([...uniqueTags].sort())` },
          { label: 'tagCount.work 應為 3', test: `return tagCount && tagCount.work === 3` },
          { label: 'tagCount.personal 應為 2', test: `return tagCount && tagCount.personal === 2` },
          { label: 'tagCount.urgent 應為 1', test: `return tagCount && tagCount.urgent === 1` },
        ],
      },
      {
        id: 'due-date-classify',
        title: '截止日分類',
        difficulty: 'medium',
        description: `將 \`todos\` 依截止日分成四類，結果存到 \`classified\` 物件：
- \`overdue\`：截止日已過（早於今天）
- \`today\`：截止日為今天
- \`upcoming\`：截止日在未來 7 天內（不含今天）
- \`later\`：截止日超過 7 天後

測試用的「今天」固定為 \`2025-07-15\`（使用 \`new Date('2025-07-15')\`）。`,
        initialCode: `const TODAY = new Date('2025-07-15')

const todos = [
  { id: 1, title: '過期任務',  dueDate: '2025-07-10' },
  { id: 2, title: '今天到期',  dueDate: '2025-07-15' },
  { id: 3, title: '本週任務',  dueDate: '2025-07-18' },
  { id: 4, title: '下週任務',  dueDate: '2025-07-22' },
  { id: 5, title: '遠期任務',  dueDate: '2025-08-01' },
]

// TODO: 依截止日分類，以 TODAY 為基準
let classified // { overdue: [], today: [], upcoming: [], later: [] }
`,
        testCases: [
          { label: 'classified.overdue 應有 1 筆', test: `return classified && classified.overdue && classified.overdue.length === 1` },
          { label: 'classified.today 應有 1 筆', test: `return classified && classified.today && classified.today.length === 1` },
          { label: 'classified.upcoming 應有 2 筆', test: `return classified && classified.upcoming && classified.upcoming.length === 2` },
          { label: 'classified.later 應有 1 筆', test: `return classified && classified.later && classified.later.length === 1` },
          { label: 'overdue 中應包含 id=1 的任務', test: `return classified && classified.overdue && classified.overdue.some(t => t.id === 1)` },
        ],
      },
      {
        id: 'dependency-sort',
        title: '依賴關係：找出可開始的任務',
        difficulty: 'hard',
        description: `每個 todo 有 \`dependsOn: string[]\` 欄位，列出它依賴的其他 todo id。

實作邏輯，找出所有「可以開始」的未完成 todo：
- 自身未完成（\`completed: false\`）
- 所有依賴的 todo 都已完成（\`completed: true\`）

結果存到 \`readyTodos\` 陣列（依 id 排序）。`,
        initialCode: `const todos = [
  { id: 'a', title: '需求分析',   completed: true,  dependsOn: [] },
  { id: 'b', title: '系統設計',   completed: true,  dependsOn: ['a'] },
  { id: 'c', title: '前端開發',   completed: false, dependsOn: ['b'] },
  { id: 'd', title: '後端開發',   completed: false, dependsOn: ['b'] },
  { id: 'e', title: '整合測試',   completed: false, dependsOn: ['c', 'd'] },
  { id: 'f', title: '文件撰寫',   completed: false, dependsOn: [] },
]

// TODO: 找出可以開始的 todos（依賴都完成了，且自身未完成）
let readyTodos // 依 id 排序
`,
        testCases: [
          { label: 'readyTodos 應有 3 筆', test: `return Array.isArray(readyTodos) && readyTodos.length === 3` },
          { label: '應包含前端開發（id=c）', test: `return readyTodos && readyTodos.some(t => t.id === 'c')` },
          { label: '應包含後端開發（id=d）', test: `return readyTodos && readyTodos.some(t => t.id === 'd')` },
          { label: '應包含文件撰寫（id=f）', test: `return readyTodos && readyTodos.some(t => t.id === 'f')` },
          { label: '不應包含整合測試（id=e，依賴未完成）', test: `return readyTodos && !readyTodos.some(t => t.id === 'e')` },
        ],
      },
    ],
  },

  // ─── 庫存管理 ────────────────────────────────────────────────────
  {
    slug: 'inventory-calc',
    methodName: '庫存管理',
    title: '庫存管理計算',
    description: '從進出貨紀錄計算現有庫存、成本、低庫存警示',
    subCategory: '業務場景實作',
    difficulty: 'medium',
    notes: {
      title: '庫存管理計算',
      sections: [
        {
          heading: '庫存管理基礎',
          content: `庫存管理的核心是追蹤進出貨紀錄（transactions）：

\`\`\`js
// transaction 格式
{ productId: 'p1', type: 'in', quantity: 100, date: '2025-01-01', cost: 50 }
{ productId: 'p1', type: 'out', quantity: 30, date: '2025-01-05' }
\`\`\`

計算現有庫存：
\`\`\`js
transactions.reduce((stock, tx) => {
  stock[tx.productId] = (stock[tx.productId] || 0)
    + (tx.type === 'in' ? tx.quantity : -tx.quantity)
  return stock
}, {})
\`\`\``,
        },
        {
          heading: 'FIFO 先進先出法',
          content: `FIFO（First In, First Out）：最早進貨的庫存最先出貨。

成本計算範例：
- 第一批進貨：100 件，單價 50 元
- 第二批進貨：50 件，單價 60 元
- 出貨 120 件的成本：前 100 件 × 50 + 後 20 件 × 60 = 6200 元

實作時，維護一個進貨批次佇列（queue），出貨時從最舊的批次開始扣減。`,
        },
        {
          heading: '安全庫存與低庫存警示',
          content: `每個商品設有 \`minStock\`（最低庫存量）。

當現有庫存 < minStock 時，發出低庫存警示：

\`\`\`js
const lowStockProducts = products.filter(product => {
  const currentStock = stockMap[product.id] || 0
  return currentStock < product.minStock
})
\`\`\`

安全庫存計算公式（進階）：
安全庫存 = 日均需求量 × 前置時間（Lead Time）× 安全係數`,
        },
        {
          heading: '缺貨預測',
          content: `根據過去出貨速率，預測幾天後庫存歸零：

\`\`\`js
// 計算過去 30 天的日均出貨量
const thirtyDaysAgo = new Date()
thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

const recentOutQuantity = outTransactions
  .filter(tx => new Date(tx.date) >= thirtyDaysAgo)
  .reduce((sum, tx) => sum + tx.quantity, 0)

const dailyRate = recentOutQuantity / 30
const daysUntilStockout = currentStock / dailyRate
\`\`\``,
        },
      ],
    },
    keyPoints: [
      '計算現有庫存時，用 reduce 遍歷所有交易紀錄，type=in 就加上 quantity，type=out 就減去 quantity，以 productId 為 key 累積結果。',
      'FIFO 先進先出法的核心：維護一個進貨批次的佇列，出貨時從最早的批次開始消耗，記錄每批次的剩餘數量和成本。',
      '低庫存警示的判斷：現有庫存 < minStock，實作時先計算每個商品的現有庫存，再和商品的 minStock 做比較篩選。',
      '庫存快照是「時間維度」的查詢：只計算某個時間點之前的交易紀錄，可以用 filter 先過濾日期，再套用正常的庫存計算邏輯。',
      '缺貨預測 = 現有庫存 ÷ 日均出貨量，日均出貨量要從過去 N 天的出貨紀錄計算，注意除以 0 的邊界情況（出貨量為 0 時回傳 Infinity）。',
    ],
    problems: [
      {
        id: 'current-stock',
        title: '計算現有庫存',
        difficulty: 'easy',
        description: `從 \`transactions\` 陣列（每筆有 \`productId\`、\`type: 'in'|'out'\`、\`quantity\`）計算每個商品的現有庫存。

結果存到 \`stockMap\` 物件（key 為 productId，value 為現有數量）。`,
        examples: [
          {
            input: `[{ productId: 'p1', type: 'in', quantity: 100 }, { productId: 'p1', type: 'out', quantity: 30 }]`,
            output: `stockMap = { p1: 70 }`,
          },
        ],
        initialCode: `const transactions = [
  { productId: 'p1', type: 'in',  quantity: 100 },
  { productId: 'p1', type: 'out', quantity: 30  },
  { productId: 'p2', type: 'in',  quantity: 50  },
  { productId: 'p1', type: 'in',  quantity: 20  },
  { productId: 'p2', type: 'out', quantity: 10  },
  { productId: 'p3', type: 'in',  quantity: 200 },
]

// TODO: 計算每個商品的現有庫存
let stockMap
`,
        testCases: [
          { label: 'p1 的庫存應為 90', test: `return stockMap && stockMap.p1 === 90` },
          { label: 'p2 的庫存應為 40', test: `return stockMap && stockMap.p2 === 40` },
          { label: 'p3 的庫存應為 200', test: `return stockMap && stockMap.p3 === 200` },
        ],
      },
      {
        id: 'fifo-cost',
        title: 'FIFO 成本計算',
        difficulty: 'medium',
        description: `使用先進先出法（FIFO）計算出貨的總成本。

給定商品 p1 的進貨批次 \`batches\`（依時間順序），以及一次出貨數量 \`outQuantity\`。
從最早的批次開始扣減，計算出貨的總成本，存到 \`totalCost\`。`,
        examples: [
          {
            input: `batches = [{ qty: 100, cost: 50 }, { qty: 50, cost: 60 }], outQuantity = 120`,
            output: `totalCost = 100×50 + 20×60 = 6200`,
          },
        ],
        initialCode: `const batches = [
  { quantity: 100, unitCost: 50 },  // 第一批，較早進貨
  { quantity: 80,  unitCost: 60 },  // 第二批
  { quantity: 60,  unitCost: 70 },  // 第三批，最新進貨
]

const outQuantity = 150  // 出貨 150 件

// TODO: FIFO 計算出貨總成本（從最舊的批次開始扣）
let totalCost
`,
        testCases: [
          { label: 'totalCost 應為 8300', test: `return totalCost === 8300` },
        ],
      },
      {
        id: 'low-stock-alert',
        title: '低庫存警示',
        difficulty: 'medium',
        description: `對比每個商品的現有庫存與 \`minStock\`，找出庫存低於最低量的商品清單。

結果存到 \`lowStockItems\` 陣列（包含商品資訊和現有庫存）。`,
        initialCode: `const products = [
  { id: 'p1', name: '商品A', minStock: 50 },
  { id: 'p2', name: '商品B', minStock: 30 },
  { id: 'p3', name: '商品C', minStock: 100 },
]

const transactions = [
  { productId: 'p1', type: 'in',  quantity: 80  },
  { productId: 'p1', type: 'out', quantity: 40  },
  { productId: 'p2', type: 'in',  quantity: 50  },
  { productId: 'p2', type: 'out', quantity: 15  },
  { productId: 'p3', type: 'in',  quantity: 60  },
]

// TODO: 找出庫存低於 minStock 的商品，加上 currentStock 欄位
let lowStockItems
`,
        testCases: [
          { label: 'lowStockItems 應有 2 筆', test: `return Array.isArray(lowStockItems) && lowStockItems.length === 2` },
          { label: '應包含商品A（庫存 40 < minStock 50）', test: `return lowStockItems && lowStockItems.some(i => i.id === 'p1')` },
          { label: '應包含商品C（庫存 60 < minStock 100）', test: `return lowStockItems && lowStockItems.some(i => i.id === 'p3')` },
          { label: '不應包含商品B（庫存 35 >= minStock 30）', test: `return lowStockItems && !lowStockItems.some(i => i.id === 'p2')` },
          { label: '低庫存商品應有 currentStock 欄位', test: `return lowStockItems && lowStockItems[0] && 'currentStock' in lowStockItems[0]` },
        ],
      },
      {
        id: 'stock-snapshot',
        title: '庫存時間快照',
        difficulty: 'hard',
        description: `給一個時間點 \`snapshotDate\`，根據該時間點之前（含當天）的交易紀錄，算出當時每個商品的庫存狀態。

結果存到 \`snapshotStock\` 物件（格式同 stockMap）。`,
        initialCode: `const transactions = [
  { productId: 'p1', type: 'in',  quantity: 100, date: '2025-01-01' },
  { productId: 'p1', type: 'out', quantity: 20,  date: '2025-01-05' },
  { productId: 'p2', type: 'in',  quantity: 50,  date: '2025-01-03' },
  { productId: 'p1', type: 'out', quantity: 30,  date: '2025-01-10' },
  { productId: 'p2', type: 'out', quantity: 15,  date: '2025-01-12' },
]

const snapshotDate = '2025-01-07'  // 查詢此時間點的庫存

// TODO: 只計算 snapshotDate 當天或之前的交易
let snapshotStock
`,
        testCases: [
          { label: 'p1 在 2025-01-07 的庫存應為 80', test: `return snapshotStock && snapshotStock.p1 === 80` },
          { label: 'p2 在 2025-01-07 的庫存應為 50', test: `return snapshotStock && snapshotStock.p2 === 50` },
        ],
      },
      {
        id: 'stockout-prediction',
        title: '預測缺貨天數',
        difficulty: 'hard',
        description: `根據過去 30 天的出貨速率（日均出貨量），預測每個商品還有幾天會缺貨。

計算公式：預測天數 = 現有庫存 ÷ 日均出貨量（無出貨紀錄則回傳 \`Infinity\`）

結果存到 \`predictions\` 物件（key 為 productId，value 為預測天數，保留整數）。

測試中「今天」固定為 \`2025-07-15\`。`,
        initialCode: `const TODAY = new Date('2025-07-15')

const currentStock = { p1: 90, p2: 200 }

// 過去 30 天的出貨紀錄（只含 out 類型）
const outTransactions = [
  { productId: 'p1', quantity: 10, date: '2025-07-01' },
  { productId: 'p1', quantity: 5,  date: '2025-07-08' },
  { productId: 'p1', quantity: 15, date: '2025-07-14' },
  { productId: 'p2', quantity: 20, date: '2025-07-10' },
  // p3 沒有出貨紀錄
]

// TODO: 計算每個商品的預測缺貨天數
// p1：日均出貨量 = (10+5+15)/30 = 1，預測天數 = 90/1 = 90
// p2：日均出貨量 = 20/30 ≈ 0.667，預測天數 = 200/0.667 ≈ 300（取整數）
let predictions
`,
        testCases: [
          { label: 'p1 預測天數應為 90', test: `return predictions && predictions.p1 === 90` },
          { label: 'p2 預測天數應為 300', test: `return predictions && predictions.p2 === 300` },
        ],
      },
    ],
  },

  // ─── 資料處理管線 ────────────────────────────────────────────────────
  {
    slug: 'data-pipeline',
    methodName: '資料處理管線',
    title: '資料處理管線實作',
    description: '串接多個轉換步驟，建立可組合的資料處理流程',
    subCategory: '業務場景實作',
    difficulty: 'hard',
    notes: {
      title: '資料處理管線',
      sections: [
        {
          heading: '函式組合概念',
          content: `函式組合（Function Composition）是將多個函式串接，前一個函式的輸出成為下一個函式的輸入：

\`\`\`js
// pipe：由左到右執行（直覺）
const pipe = (...fns) => x => fns.reduce((v, f) => f(v), x)

// compose：由右到左執行（數學符號習慣）
const compose = (...fns) => x => fns.reduceRight((v, f) => f(v), x)

// 使用範例
const process = pipe(
  x => x * 2,
  x => x + 1,
  x => x ** 2
)
process(3)  // ((3*2)+1)^2 = 49
\`\`\``,
        },
        {
          heading: 'pipe vs compose',
          content: `| 特性 | pipe | compose |
|------|------|---------|
| 執行順序 | 左到右 | 右到左 |
| 實作 | reduce | reduceRight |
| 可讀性 | 與閱讀順序一致 | 類似數學符號 |
| 使用場景 | 資料處理管線 | 函式組合理論 |

前端實務上，\`pipe\` 比 \`compose\` 更常用，因為執行順序和我們閱讀程式碼的方向相同。`,
        },
        {
          heading: '錯誤處理策略',
          content: `管線中的錯誤處理有兩種主要策略：

**快速失敗（Fail Fast）**：遇到錯誤立即中止整個管線，回傳錯誤。
**容錯繼續（Fault Tolerant）**：記錄錯誤但繼續處理其他資料，最後回傳成功和失敗的結果。

\`\`\`js
// 容錯繼續的實作
const results = { successes: [], errors: [] }
for (const item of data) {
  try {
    results.successes.push(pipeline(item))
  } catch (err) {
    results.errors.push({ item, error: err.message })
  }
}
\`\`\``,
        },
        {
          heading: '批次處理策略',
          content: `處理大型資料集時，批次處理（Batch Processing）可以：
1. 避免記憶體爆滿
2. 方便進度追蹤
3. 支援部分失敗重試

\`\`\`js
function processBatch(data, batchSize, pipeline) {
  const results = []
  for (let i = 0; i < data.length; i += batchSize) {
    const batch = data.slice(i, i + batchSize)
    const batchResult = batch.map(pipeline)
    results.push(...batchResult)
  }
  return results
}
\`\`\``,
        },
      ],
    },
    keyPoints: [
      'pipe 函式的實作核心是 reduce：從左到右依序將每個函式套用到資料，前一個函式的輸出是下一個函式的輸入。',
      'pipe 和 compose 的差別在執行順序：pipe 由左到右（符合閱讀習慣），compose 由右到左（符合數學符號），前端實務幾乎都用 pipe。',
      '可配置管線的設計：將每個步驟抽象成 { type, fn } 物件，createPipeline 根據 type 決定是 filter、map 還是 reduce，這樣步驟可以動態組合。',
      '帶錯誤處理的管線應該採用容錯繼續策略：每筆資料獨立用 try/catch 包裹，一筆失敗不影響其他資料，最後回傳 { successes, errors } 兩個陣列。',
      '批次處理的核心：用 slice(i, i + batchSize) 切割資料，對每一批次套用管線，最後用展開運算子合併所有批次的結果，這樣可以控制記憶體使用量。',
    ],
    problems: [
      {
        id: 'pipe-function',
        title: '實作 pipe 函式',
        difficulty: 'easy',
        description: `實作 \`pipe(...fns)\` 函式：接受任意數量的轉換函式，回傳一個新函式，將這些轉換依序套用到輸入資料。

\`\`\`
pipe(f, g, h)(x) 等同於 h(g(f(x)))
\`\`\`

實作後，使用 \`process\` 來測試：依序套用「乘以 2」→「加 10」→「轉為字串並加上單位」。`,
        examples: [
          {
            input: `pipe(x => x * 2, x => x + 10)(5)`,
            output: `20（先 5*2=10，再 10+10=20）`,
          },
        ],
        initialCode: `function pipe(...fns) {
  // TODO: 實作 pipe，回傳一個函式，依序套用 fns
}

const process = pipe(
  x => x * 2,
  x => x + 10,
  x => \`\${x} 元\`
)

const result1 = process(5)   // 應為 '20 元'
const result2 = process(10)  // 應為 '30 元'
`,
        testCases: [
          { label: 'result1 應為 "20 元"', test: `return result1 === '20 元'` },
          { label: 'result2 應為 "30 元"', test: `return result2 === '30 元'` },
          {
            label: 'pipe 應支援任意數量的函式',
            test: `function pipe(...fns){ return x => fns.reduce((v,f)=>f(v),x) } const r = pipe(x=>x+1, x=>x*3, x=>x-2)(4); return r === 13`,
          },
        ],
      },
      {
        id: 'configurable-pipeline',
        title: '可配置的管線',
        difficulty: 'medium',
        description: `實作 \`createPipeline(steps)\` 函式，接受步驟配置陣列，回傳一個可執行的處理函式。

步驟格式：
- \`{ type: 'filter', fn }\`：過濾資料
- \`{ type: 'map', fn }\`：轉換資料

\`\`\`js
const pipeline = createPipeline([
  { type: 'filter', fn: x => x > 0 },
  { type: 'map', fn: x => x * 2 },
])
pipeline([-1, 2, 3])  // [4, 6]
\`\`\``,
        initialCode: `function createPipeline(steps) {
  // TODO: 根據 steps 陣列，建立並回傳一個資料處理函式
  // 每個 step 的 type 決定要對資料陣列做 filter 還是 map
}

const pipeline = createPipeline([
  { type: 'filter', fn: x => x % 2 === 0 },       // 只保留偶數
  { type: 'map',    fn: x => x * x },              // 平方
  { type: 'filter', fn: x => x > 10 },             // 只保留大於 10 的
])

const result = pipeline([1, 2, 3, 4, 5, 6])
// 偶數：[2, 4, 6] → 平方：[4, 16, 36] → 大於10：[16, 36]
`,
        testCases: [
          { label: 'result 應為 [16, 36]', test: `return Array.isArray(result) && result.length === 2 && result[0] === 16 && result[1] === 36` },
          {
            label: 'createPipeline 應回傳函式',
            test: `function createPipeline(steps){ return data => steps.reduce((d,s)=> s.type==='filter'?d.filter(s.fn):d.map(s.fn), data) } return typeof createPipeline([]) === 'function'`,
          },
        ],
      },
      {
        id: 'data-cleaning',
        title: '資料清洗管線',
        difficulty: 'medium',
        description: `建立一個資料清洗管線，依序對每筆記錄執行：
1. 移除值為 \`null\` 或 \`undefined\` 的欄位
2. 對所有字串值執行 \`trim()\`（去除頭尾空白）
3. 將可以轉為數字的字串轉換為數字型別
4. 移除整批資料中的重複項（以 JSON 序列化比較）

結果存到 \`cleaned\` 陣列。`,
        examples: [
          {
            input: `[{ name: ' Alice ', age: '25', score: null }, { name: 'Alice', age: 25 }]`,
            output: `[{ name: 'Alice', age: 25 }]（trim 後去重，null 移除，字串 25 轉數字）`,
          },
        ],
        initialCode: `const rawData = [
  { name: '  Alice  ', age: '25', score: null,      city: 'Taipei' },
  { name: 'Bob',       age: 30,   score: undefined, city: '  Kaohsiung  ' },
  { name: 'Alice',     age: 25,   city: 'Taipei' },
  { name: '  Bob  ',  age: 30,   city: 'Kaohsiung' },
]

// TODO: 依序執行四個清洗步驟
// 1. 移除 null/undefined 欄位
// 2. 字串 trim
// 3. 數字字串轉換
// 4. 去重
let cleaned
`,
        testCases: [
          { label: 'cleaned 應有 2 筆（去重後）', test: `return Array.isArray(cleaned) && cleaned.length === 2` },
          { label: 'Alice 的 age 應為數字 25', test: `return cleaned && cleaned.find(r=>r.name==='Alice')?.age === 25` },
          { label: 'Bob 的 city 應為 "Kaohsiung"（已 trim）', test: `return cleaned && cleaned.find(r=>r.name==='Bob')?.city === 'Kaohsiung'` },
          { label: '不應有 null 或 undefined 欄位', test: `return cleaned && cleaned.every(r => Object.values(r).every(v => v !== null && v !== undefined))` },
        ],
      },
      {
        id: 'error-handling-pipeline',
        title: '帶錯誤處理的管線',
        difficulty: 'hard',
        description: `建立一個帶錯誤處理的管線：對 \`data\` 中每一筆資料執行 \`pipeline\` 函式，但某些資料可能導致函式拋出錯誤。

不因單筆失敗中斷整個流程，最後回傳：
\`\`\`
{
  successes: [...],   // 成功處理的結果
  errors: [{ item, error }]  // 失敗的原始資料和錯誤訊息
}
\`\`\`

結果存到 \`processResult\`。`,
        initialCode: `const data = [
  { id: 1, value: 10 },
  { id: 2, value: null },    // 會導致錯誤
  { id: 3, value: 20 },
  { id: 4, value: 'abc' },   // 會導致錯誤
  { id: 5, value: 30 },
]

function pipeline(item) {
  if (item.value === null) throw new Error('value 不可為 null')
  if (typeof item.value !== 'number') throw new Error('value 必須是數字')
  return { id: item.id, result: item.value * 2 }
}

// TODO: 對每筆資料執行 pipeline，收集成功和失敗的結果
let processResult
`,
        testCases: [
          { label: 'processResult.successes 應有 3 筆', test: `return processResult && Array.isArray(processResult.successes) && processResult.successes.length === 3` },
          { label: 'processResult.errors 應有 2 筆', test: `return processResult && Array.isArray(processResult.errors) && processResult.errors.length === 2` },
          { label: 'successes 中 id=1 的結果應為 20', test: `return processResult && processResult.successes.find(s=>s.id===1)?.result === 20` },
          { label: 'errors 中應包含 id=2 的錯誤', test: `return processResult && processResult.errors.some(e=>e.item?.id === 2)` },
          { label: 'errors 中應包含 id=4 的錯誤', test: `return processResult && processResult.errors.some(e=>e.item?.id === 4)` },
        ],
      },
      {
        id: 'batch-processing',
        title: '批次處理管線',
        difficulty: 'hard',
        description: `對大型資料陣列 \`largeData\` 依 \`batchSize\` 分批處理，每批執行相同的管線（乘以 2），最後合併所有批次的結果。

實作 \`processBatch(data, batchSize, pipeline)\` 函式，結果存到 \`batchResult\`。`,
        examples: [
          {
            input: `data = [1,2,3,4,5], batchSize = 2, pipeline = x => x*2`,
            output: `batchResult = [2,4,6,8,10]（每批各自處理後合併）`,
          },
        ],
        initialCode: `const largeData = Array.from({ length: 10 }, (_, i) => i + 1)
// largeData = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

const batchSize = 3

function itemPipeline(x) {
  return x * 2
}

function processBatch(data, batchSize, pipeline) {
  // TODO: 分批處理，每批用 pipeline 對每個元素做轉換，最後合併
}

const batchResult = processBatch(largeData, batchSize, itemPipeline)
`,
        testCases: [
          { label: 'batchResult 應有 10 個元素', test: `return Array.isArray(batchResult) && batchResult.length === 10` },
          { label: 'batchResult[0] 應為 2', test: `return batchResult && batchResult[0] === 2` },
          { label: 'batchResult[9] 應為 20', test: `return batchResult && batchResult[9] === 20` },
          { label: 'batchResult 應為 [2,4,6,8,10,12,14,16,18,20]', test: `return batchResult && JSON.stringify(batchResult) === JSON.stringify([2,4,6,8,10,12,14,16,18,20])` },
        ],
      },
    ],
  },
]
