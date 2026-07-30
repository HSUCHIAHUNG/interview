import type { MethodEntry } from './array-challenges'

export const objChallengesPart2: MethodEntry[] = [
  // ─── obj-assign ───────────────────────────────────────────────────────────
  {
    slug: 'obj-assign',
    methodName: 'Object.assign()',
    title: 'Object.assign()',
    description: '將一個或多個來源物件的可列舉自有屬性複製到目標物件，回傳修改後的目標物件。',
    subCategory: '物件操作',
    difficulty: 'easy',
    notes: {
      title: 'Object.assign()',
      sections: [
        {
          heading: '語法與回傳值',
          content: `\`Object.assign(target, ...sources)\`

回傳：**目標物件本身**（已被修改），不是新的物件。
- 來源物件的屬性會依序覆蓋到目標，後面的來源會覆蓋前面同名屬性。`,
        },
        {
          heading: '程式碼範例',
          content: `\`\`\`js
const defaults = { theme: 'light', lang: 'en', size: 14 }
const userConfig = { theme: 'dark', size: 16 }

const result = Object.assign({}, defaults, userConfig)
// { theme: 'dark', lang: 'en', size: 16 }

// 淺複製
const clone = Object.assign({}, defaults)
clone.theme = 'pink'
console.log(defaults.theme) // 'light'（未受影響）
\`\`\``,
        },
        {
          heading: '注意事項',
          content: `- **直接修改目標物件**，若不想修改原物件，第一個參數傳 \`{}\`
- 只做**淺複製（shallow copy）**，巢狀物件仍是同一個參考
- 不複製原型鏈上的屬性，只複製**自有可列舉屬性**
- 現代開發中展開語法 \`{ ...a, ...b }\` 與 \`Object.assign({}, a, b)\` 效果相同`,
        },
      ],
    },
    keyPoints: [
      'Object.assign 會直接修改第一個參數（目標物件），並將後續來源物件的屬性複製進去，最後回傳目標物件本身。',
      '如果不想修改現有物件，第一個參數傳空物件 {}，這是最常見的淺複製（shallow copy）寫法。',
      '當多個來源物件有同名屬性時，後面的來源會覆蓋前面的，這個特性常用來實作「預設值 + 使用者設定」的合併模式。',
      'Object.assign 只做淺複製，巢狀物件的值仍然是同一個參考，修改複製品的巢狀屬性會影響到原物件，這是最常見的陷阱。',
      '在現代 JavaScript 中，展開語法 { ...a, ...b } 可以取代大多數 Object.assign({}, a, b) 的使用場景，語法更簡潔。',
    ],
    problems: [
      {
        id: 'basic',
        title: '合併應用程式設定',
        difficulty: 'easy',
        description: `你正在開發一個應用程式，需要將使用者設定合併到預設設定上。

請使用 \`Object.assign()\` 將 \`userConfig\` 的屬性合併到 \`appConfig\`，讓 \`appConfig\` 被就地修改。

合併後：
- \`theme\` 應被 \`userConfig\` 的值覆蓋
- \`lang\` 應保持 \`appConfig\` 原本的值（userConfig 沒有這個屬性）
- \`fontSize\` 應被 \`userConfig\` 的值覆蓋`,
        examples: [
          {
            input: `appConfig = { theme: 'light', lang: 'zh-TW', fontSize: 14 }\nuserConfig = { theme: 'dark', fontSize: 16 }`,
            output: `appConfig = { theme: 'dark', lang: 'zh-TW', fontSize: 16 }`,
          },
        ],
        initialCode: `const appConfig = { theme: 'light', lang: 'zh-TW', fontSize: 14 }
const userConfig = { theme: 'dark', fontSize: 16 }

// TODO: 用 Object.assign() 將 userConfig 合併到 appConfig
`,
        testCases: [
          { label: 'appConfig.theme 應為 "dark"', test: `return appConfig.theme === 'dark'` },
          { label: 'appConfig.lang 應保留為 "zh-TW"', test: `return appConfig.lang === 'zh-TW'` },
          { label: 'appConfig.fontSize 應為 16', test: `return appConfig.fontSize === 16` },
          {
            label: '回傳值應是 appConfig 本身',
            test: `const result = Object.assign(appConfig, userConfig); return result === appConfig`,
          },
        ],
      },
      {
        id: 'clone',
        title: '用 Object.assign 做淺複製',
        difficulty: 'easy',
        description: `你需要複製一份使用者設定，讓修改複製品時不影響原物件。

請用 \`Object.assign({}, source)\` 的方式建立 \`cloned\`（淺複製），
然後修改 \`cloned.theme = 'pink'\`。

驗證：修改 \`cloned\` 的頂層屬性後，原物件 \`source.theme\` 不受影響。`,
        examples: [
          {
            input: `source = { theme: 'dark', fontSize: 14 }`,
            output: `cloned.theme === 'pink'，source.theme 仍為 'dark'`,
          },
        ],
        initialCode: `const source = { theme: 'dark', fontSize: 14 }

// TODO: 用 Object.assign({}, source) 建立淺複製，存到 cloned
let cloned

// TODO: 修改 cloned.theme = 'pink'
`,
        testCases: [
          { label: 'cloned.theme 應為 "pink"', test: `return cloned.theme === 'pink'` },
          { label: 'source.theme 應仍為 "dark"（不受影響）', test: `return source.theme === 'dark'` },
          { label: 'cloned 應是不同的物件參考', test: `return cloned !== source` },
          { label: 'cloned.fontSize 應為 14', test: `return cloned.fontSize === 14` },
        ],
      },
      {
        id: 'deep-trap',
        title: '淺複製陷阱：巢狀物件共用參考',
        difficulty: 'medium',
        description: `\`Object.assign\` 只做**淺複製**，巢狀物件不會被深層複製，複製品與原物件會共用同一個巢狀物件的參考。

請完成以下步驟：
1. 用 \`Object.assign({}, original)\` 建立 \`copied\`
2. 修改 \`copied.address.city = 'Kaohsiung'\`
3. 將 \`original.address.city\` 存到 \`originalCity\`

觀察：修改 \`copied\` 的巢狀屬性後，\`original\` 的巢狀屬性也會跟著改變。`,
        examples: [
          {
            input: `original = { name: 'Alice', address: { city: 'Taipei' } }`,
            output: `copied.address.city === 'Kaohsiung'，original.address.city 也變成 'Kaohsiung'`,
            note: '巢狀物件是同一個參考，所以兩者都被改變',
          },
        ],
        initialCode: `const original = { name: 'Alice', address: { city: 'Taipei' } }

// TODO: 用 Object.assign({}, original) 建立淺複製，存到 copied
let copied

// TODO: 修改 copied.address.city = 'Kaohsiung'

// TODO: 將 original.address.city 存到 originalCity
let originalCity
`,
        testCases: [
          { label: 'copied.address.city 應為 "Kaohsiung"', test: `return copied.address.city === 'Kaohsiung'` },
          {
            label: 'original.address.city 也應變成 "Kaohsiung"（共用參考）',
            test: `return originalCity === 'Kaohsiung'`,
          },
          { label: 'copied.address 與 original.address 是同一個參考', test: `return copied.address === original.address` },
          { label: 'copied 本身是不同的物件', test: `return copied !== original` },
        ],
      },
    ],
  },

  // ─── obj-spread ───────────────────────────────────────────────────────────
  {
    slug: 'obj-spread',
    methodName: 'Spread {...obj}',
    title: '展開語法 {...obj}',
    description: '用展開運算子合併物件或建立不可變更新，後面的 key 會覆蓋前面的同名屬性。',
    subCategory: '物件操作',
    difficulty: 'easy',
    notes: {
      title: '展開語法 {...obj}',
      sections: [
        {
          heading: '語法與回傳值',
          content: `\`const merged = { ...obj1, ...obj2 }\`

- 建立一個**新物件**，包含所有來源的可列舉自有屬性
- 後面的屬性會覆蓋前面同名的屬性
- 效果等同於 \`Object.assign({}, obj1, obj2)\``,
        },
        {
          heading: '程式碼範例',
          content: `\`\`\`js
// 合併物件
const base = { a: 1, b: 2 }
const extra = { b: 99, c: 3 }
const merged = { ...base, ...extra }
// { a: 1, b: 99, c: 3 }

// 不可變更新（React 常見模式）
const state = { name: 'Alice', age: 25 }
const newState = { ...state, age: 26 }
// state 不變，newState 是新物件
\`\`\``,
        },
        {
          heading: '注意事項',
          content: `- 展開語法也只做**淺複製**，巢狀物件仍是同一個參考
- 屬性覆蓋順序由左到右，**右邊的覆蓋左邊**
- React 的 setState 和 Redux reducer 中極常用此模式
- 空物件展開 \`{ ...{} }\` 不會造成錯誤`,
        },
      ],
    },
    keyPoints: [
      '展開語法 { ...obj } 會建立一個新物件，把 obj 的所有可列舉自有屬性複製進去，原物件不會被修改。',
      '合併多個物件時，屬性的覆蓋順序是由左到右，越後面的物件優先權越高，同名屬性會被覆蓋。',
      '這是 React 中更新 state 的標準寫法：const newState = { ...state, changedProp: newValue }，確保 immutability。',
      '展開語法和 Object.assign({}, ...) 一樣只做淺複製，巢狀物件的參考不會被複製，而是共用。',
      '可以同時展開多個物件並新增額外屬性，例如：{ ...defaults, ...user, timestamp: Date.now() }，這在設定合併場景很常用。',
    ],
    problems: [
      {
        id: 'basic',
        title: '合併主題設定',
        difficulty: 'easy',
        description: `你正在開發一個主題系統，需要將基礎主題和深色主題的設定合併。

請用展開語法 \`{ ...base, ...dark }\` 建立 \`merged\`，讓 \`dark\` 的屬性覆蓋 \`base\` 的同名屬性。`,
        examples: [
          {
            input: `base = { bg: 'white', text: 'black', primary: 'blue' }\ndark = { bg: '#1a1a1a', text: '#ffffff' }`,
            output: `merged = { bg: '#1a1a1a', text: '#ffffff', primary: 'blue' }`,
          },
        ],
        initialCode: `const base = { bg: 'white', text: 'black', primary: 'blue' }
const dark = { bg: '#1a1a1a', text: '#ffffff' }

// TODO: 用展開語法合併 base 和 dark，存到 merged
let merged
`,
        testCases: [
          { label: 'merged.bg 應為 "#1a1a1a"', test: `return merged.bg === '#1a1a1a'` },
          { label: 'merged.text 應為 "#ffffff"', test: `return merged.text === '#ffffff'` },
          { label: 'merged.primary 應保留 "blue"', test: `return merged.primary === 'blue'` },
          { label: 'base 原物件不應被修改', test: `return base.bg === 'white'` },
        ],
      },
      {
        id: 'update',
        title: '不可變 State 更新',
        difficulty: 'medium',
        description: `在 React 中，更新 state 必須保持不可變（immutability）——不能直接修改原物件，而是建立一個新物件。

請用展開語法將 \`user\` 的 \`age\` 更新為 \`26\`，存到 \`updatedUser\`。
原本的 \`user\` 物件必須保持不變。`,
        examples: [
          {
            input: `user = { name: 'Alice', age: 25, role: 'admin' }`,
            output: `updatedUser = { name: 'Alice', age: 26, role: 'admin' }，user.age 仍為 25`,
          },
        ],
        initialCode: `const user = { name: 'Alice', age: 25, role: 'admin' }

// TODO: 用展開語法建立 updatedUser，age 改為 26，其他屬性保持不變
let updatedUser
`,
        testCases: [
          { label: 'updatedUser.age 應為 26', test: `return updatedUser.age === 26` },
          { label: 'updatedUser.name 應仍為 "Alice"', test: `return updatedUser.name === 'Alice'` },
          { label: 'updatedUser.role 應仍為 "admin"', test: `return updatedUser.role === 'admin'` },
          { label: 'user.age 不應被修改，仍為 25', test: `return user.age === 25` },
          { label: 'updatedUser 應是新的物件參考', test: `return updatedUser !== user` },
        ],
      },
      {
        id: 'override',
        title: '多層展開：設定優先順序',
        difficulty: 'medium',
        description: `系統設定有三層優先順序（由低到高）：預設設定 → 使用者設定 → 緊急覆蓋設定。

請用展開語法依序合併 \`defaultConfig\`、\`userConfig\`、\`emergencyOverride\`，存到 \`finalConfig\`。

最終 \`finalConfig\` 的屬性應反映正確的優先順序：緊急覆蓋 > 使用者設定 > 預設值。`,
        examples: [
          {
            input: `defaultConfig = { debug: false, timeout: 3000, retries: 3 }\nuserConfig = { timeout: 5000 }\nemergencyOverride = { debug: true, timeout: 1000 }`,
            output: `finalConfig = { debug: true, timeout: 1000, retries: 3 }`,
            note: 'timeout 最終用 emergencyOverride 的值',
          },
        ],
        initialCode: `const defaultConfig = { debug: false, timeout: 3000, retries: 3 }
const userConfig = { timeout: 5000 }
const emergencyOverride = { debug: true, timeout: 1000 }

// TODO: 用展開語法合併三個設定物件，存到 finalConfig
let finalConfig
`,
        testCases: [
          { label: 'finalConfig.debug 應為 true（來自 emergencyOverride）', test: `return finalConfig.debug === true` },
          { label: 'finalConfig.timeout 應為 1000（來自 emergencyOverride）', test: `return finalConfig.timeout === 1000` },
          { label: 'finalConfig.retries 應為 3（來自 defaultConfig）', test: `return finalConfig.retries === 3` },
          { label: '原物件均不應被修改', test: `return defaultConfig.debug === false && userConfig.timeout === 5000` },
        ],
      },
    ],
  },

  // ─── obj-freeze ───────────────────────────────────────────────────────────
  {
    slug: 'obj-freeze',
    methodName: 'Object.freeze()',
    title: 'Object.freeze()',
    description: '凍結物件，使其屬性無法被新增、刪除或修改，適合保護常數設定。',
    subCategory: '物件保護',
    difficulty: 'medium',
    notes: {
      title: 'Object.freeze()',
      sections: [
        {
          heading: '語法與回傳值',
          content: `\`Object.freeze(obj)\`

回傳：**同一個被凍結的物件**（不是新物件）。
- \`Object.isFrozen(obj)\` 可以檢查物件是否已被凍結`,
        },
        {
          heading: '程式碼範例',
          content: `\`\`\`js
const config = Object.freeze({ host: 'localhost', port: 3000 })

config.port = 9999        // 無效，非 strict mode 靜默失敗
config.newProp = 'hello'  // 無效
delete config.host        // 無效

console.log(config.port)         // 3000（未被改變）
console.log(Object.isFrozen(config)) // true
\`\`\``,
        },
        {
          heading: '注意事項',
          content: `- 在 **strict mode** 下嘗試修改會拋出 TypeError
- 只做**淺凍結（shallow freeze）**，巢狀物件的屬性仍可修改
- 常用於保護**常數設定**、**列舉值**等不應被改變的物件
- \`const\` 只防止重新賦值，\`freeze\` 才能防止屬性被修改`,
        },
      ],
    },
    keyPoints: [
      'Object.freeze 會讓物件變成不可修改的狀態，任何新增、刪除、或修改屬性的操作都會靜默失敗（非 strict mode）或拋出 TypeError（strict mode）。',
      'Object.freeze 的回傳值是同一個物件本身，不是新物件，所以 freeze 後的物件和 freeze 前是同一個參考。',
      'freeze 只是淺凍結，巢狀物件的屬性不會被凍結，如果需要深層凍結，必須遞迴地對每個巢狀物件也呼叫 freeze。',
      'const 關鍵字只防止變數被重新賦值，但無法防止物件的屬性被修改；freeze 才是真正的屬性保護。',
      '可以用 Object.isFrozen(obj) 來檢查一個物件是否已被凍結，這在測試和防禦性程式碼中很有用。',
    ],
    problems: [
      {
        id: 'basic',
        title: 'freeze 後的修改無效',
        difficulty: 'easy',
        description: `你有一個 API 端點設定物件，freeze 後任何修改都不應生效。

請完成以下步驟：
1. 呼叫 \`Object.freeze(apiConfig)\`
2. 嘗試修改 \`apiConfig.port = 9999\`
3. 將 \`apiConfig.port\` 存到 \`portAfterChange\`

觀察：freeze 後的修改會靜默失敗，\`port\` 仍維持原值。`,
        examples: [
          {
            input: `apiConfig = { host: 'api.example.com', port: 443 }`,
            output: `portAfterChange === 443（修改無效）`,
          },
        ],
        initialCode: `const apiConfig = { host: 'api.example.com', port: 443 }

// TODO: 呼叫 Object.freeze(apiConfig)

// TODO: 嘗試修改 apiConfig.port = 9999

// TODO: 將 apiConfig.port 存到 portAfterChange
let portAfterChange
`,
        testCases: [
          { label: 'portAfterChange 應仍為 443（修改無效）', test: `return portAfterChange === 443` },
          { label: 'apiConfig.host 應仍為 "api.example.com"', test: `return apiConfig.host === 'api.example.com'` },
          { label: 'Object.isFrozen(apiConfig) 應為 true', test: `return Object.isFrozen(apiConfig) === true` },
        ],
      },
      {
        id: 'const-config',
        title: '實作不可變設定物件',
        difficulty: 'medium',
        description: `你需要建立一個應用程式常數設定，確保設定在初始化後絕對不能被修改。

請將 \`APP_CONFIG\` 用 \`Object.freeze()\` 保護，然後嘗試：
1. 新增屬性 \`APP_CONFIG.version = '2.0'\`
2. 修改屬性 \`APP_CONFIG.name = 'Hacked'\`
3. 刪除屬性 \`delete APP_CONFIG.env\`

驗證所有修改均無效，且 \`isFrozen\` 為 \`true\`。`,
        initialCode: `const APP_CONFIG = {
  name: 'MyApp',
  env: 'production',
  maxRetries: 3,
}

// TODO: 用 Object.freeze() 保護 APP_CONFIG

// TODO: 嘗試新增 APP_CONFIG.version = '2.0'

// TODO: 嘗試修改 APP_CONFIG.name = 'Hacked'

// TODO: 嘗試刪除 delete APP_CONFIG.env
`,
        testCases: [
          { label: 'APP_CONFIG.name 應仍為 "MyApp"', test: `return APP_CONFIG.name === 'MyApp'` },
          { label: 'APP_CONFIG.env 應仍存在並為 "production"', test: `return APP_CONFIG.env === 'production'` },
          { label: 'APP_CONFIG.version 不應被新增', test: `return APP_CONFIG.version === undefined` },
          { label: 'APP_CONFIG.maxRetries 應仍為 3', test: `return APP_CONFIG.maxRetries === 3` },
          { label: 'Object.isFrozen(APP_CONFIG) 應為 true', test: `return Object.isFrozen(APP_CONFIG) === true` },
        ],
      },
    ],
  },

  // ─── obj-seal ─────────────────────────────────────────────────────────────
  {
    slug: 'obj-seal',
    methodName: 'Object.seal()',
    title: 'Object.seal()',
    description: '封印物件，允許修改現有屬性值，但不允許新增或刪除屬性。',
    subCategory: '物件保護',
    difficulty: 'medium',
    notes: {
      title: 'Object.seal()',
      sections: [
        {
          heading: '語法與回傳值',
          content: `\`Object.seal(obj)\`

回傳：**同一個被封印的物件**。
- \`Object.isSealed(obj)\` 可以檢查是否已被封印`,
        },
        {
          heading: '程式碼範例',
          content: `\`\`\`js
const user = Object.seal({ name: 'Alice', age: 25 })

user.age = 26         // 成功！可以修改現有屬性
user.email = 'a@b.c'  // 無效，不能新增屬性
delete user.name      // 無效，不能刪除屬性

console.log(user)     // { name: 'Alice', age: 26 }
console.log(Object.isSealed(user)) // true
\`\`\``,
        },
        {
          heading: '注意事項',
          content: `- **可以修改**現有屬性的值（這是 seal 和 freeze 的核心差異）
- **不能新增**新屬性
- **不能刪除**現有屬性
- \`Object.isSealed\` 和 \`Object.isFrozen\` 是不同的檢查
- 一個 frozen 物件必然也是 sealed（因為 freeze 更嚴格）`,
        },
      ],
    },
    keyPoints: [
      'Object.seal 封印一個物件後，可以修改現有屬性的值，但不能新增或刪除屬性，這是它和 freeze 最重要的差異。',
      'seal 的使用情境是：物件結構固定（不能增刪屬性），但屬性值可以更新，例如代表固定欄位的表單資料。',
      'Object.isSealed(obj) 可以檢查物件是否被封印；注意 frozen 的物件也會通過 isSealed 的檢查，因為 freeze 比 seal 更嚴格。',
      '和 freeze 一樣，seal 只是淺層操作，巢狀物件的屬性不受保護。',
      '在 strict mode 下嘗試新增或刪除屬性會拋出 TypeError，非 strict mode 則靜默失敗。',
    ],
    problems: [
      {
        id: 'basic',
        title: 'seal 後可改值但不能增刪屬性',
        difficulty: 'easy',
        description: `你有一個代表使用者資料的物件，需要確保欄位不能被任意新增或刪除，但現有欄位的值可以更新。

請完成以下步驟：
1. 呼叫 \`Object.seal(profile)\`
2. 將 \`profile.age\` 修改為 \`30\`（應成功）
3. 嘗試新增 \`profile.email = 'alice@example.com'\`（應無效）
4. 嘗試刪除 \`delete profile.name\`（應無效）`,
        examples: [
          {
            input: `profile = { name: 'Alice', age: 25 }`,
            output: `profile.age === 30，profile.email === undefined，profile.name 仍存在`,
          },
        ],
        initialCode: `const profile = { name: 'Alice', age: 25 }

// TODO: 用 Object.seal(profile) 封印物件

// TODO: 修改 profile.age = 30

// TODO: 嘗試新增 profile.email = 'alice@example.com'

// TODO: 嘗試刪除 delete profile.name
`,
        testCases: [
          { label: 'profile.age 應為 30（可以修改現有屬性）', test: `return profile.age === 30` },
          { label: 'profile.email 應為 undefined（不能新增屬性）', test: `return profile.email === undefined` },
          { label: 'profile.name 應仍存在（不能刪除屬性）', test: `return profile.name === 'Alice'` },
          { label: 'Object.isSealed(profile) 應為 true', test: `return Object.isSealed(profile) === true` },
        ],
      },
      {
        id: 'vs-freeze',
        title: 'seal vs freeze：修改值的差異',
        difficulty: 'medium',
        description: `理解 \`seal\` 和 \`freeze\` 的核心差異：
- **seal** 後可以修改現有屬性的值
- **freeze** 後連現有屬性的值也不能修改

請分別對 \`sealedObj\` 和 \`frozenObj\` 進行保護，然後嘗試修改兩者的 \`score\` 屬性為 \`100\`，觀察兩者行為的差異。`,
        examples: [
          {
            input: `兩個物件都有 score: 0`,
            output: `sealedObj.score === 100（seal 允許改值），frozenObj.score === 0（freeze 不允許改值）`,
          },
        ],
        initialCode: `const sealedObj = { label: 'sealed', score: 0 }
const frozenObj = { label: 'frozen', score: 0 }

// TODO: 用 Object.seal(sealedObj) 封印
// TODO: 用 Object.freeze(frozenObj) 凍結

// TODO: 嘗試修改 sealedObj.score = 100
// TODO: 嘗試修改 frozenObj.score = 100
`,
        testCases: [
          { label: 'sealedObj.score 應為 100（seal 允許改值）', test: `return sealedObj.score === 100` },
          { label: 'frozenObj.score 應仍為 0（freeze 不允許改值）', test: `return frozenObj.score === 0` },
          { label: 'Object.isSealed(sealedObj) 應為 true', test: `return Object.isSealed(sealedObj) === true` },
          { label: 'Object.isFrozen(frozenObj) 應為 true', test: `return Object.isFrozen(frozenObj) === true` },
          {
            label: 'frozenObj 也應通過 isSealed 檢查（freeze 包含 seal 的效果）',
            test: `return Object.isSealed(frozenObj) === true`,
          },
        ],
      },
    ],
  },

  // ─── obj-create ───────────────────────────────────────────────────────────
  {
    slug: 'obj-create',
    methodName: 'Object.create()',
    title: 'Object.create()',
    description: '建立一個以指定物件為原型的新物件，用來實作原型繼承。',
    subCategory: '原型鏈',
    difficulty: 'medium',
    notes: {
      title: 'Object.create()',
      sections: [
        {
          heading: '語法與回傳值',
          content: `\`Object.create(proto[, propertiesObject])\`

回傳：一個**新物件**，其 \`[[Prototype]]\` 設為 \`proto\`。
- 傳入 \`null\` 可建立沒有原型的純物件（不繼承任何方法）`,
        },
        {
          heading: '程式碼範例',
          content: `\`\`\`js
const animal = {
  speak() {
    return \`\${this.name} makes a sound.\`
  }
}

const dog = Object.create(animal)
dog.name = 'Rex'
dog.bark = function() { return 'Woof!' }

console.log(dog.speak())             // 'Rex makes a sound.'
console.log(Object.getPrototypeOf(dog) === animal) // true
\`\`\``,
        },
        {
          heading: '注意事項',
          content: `- 新物件本身是**空的**，繼承的方法來自原型鏈
- 可用 \`Object.getPrototypeOf(obj)\` 查看原型
- \`hasOwnProperty\` 回傳 \`false\` 表示屬性來自原型
- 在 ES6 以後，多數原型繼承場景已改用 \`class\` 語法，但理解 \`Object.create\` 有助於理解 JavaScript 原型機制`,
        },
      ],
    },
    keyPoints: [
      'Object.create(proto) 建立一個新物件，其原型鏈（[[Prototype]]）指向 proto，新物件本身是空的，但可以存取 proto 的所有方法。',
      '這是 JavaScript 原型繼承最直接的實作方式，幫助理解 class 語法的底層機制。',
      '透過 Object.getPrototypeOf(obj) 可以查詢物件的原型，確認繼承關係。',
      '新物件自己設定的屬性（own properties）不影響原型，hasOwnProperty 可以區分自有屬性和繼承屬性。',
      '傳入 null 可建立一個沒有任何原型的純物件，常用於建立不繼承 Object.prototype 的字典（dictionary）物件。',
    ],
    problems: [
      {
        id: 'basic',
        title: '建立繼承原型的物件',
        difficulty: 'easy',
        description: `你有一個 \`vehicleProto\` 原型物件，內含 \`getInfo()\` 方法。

請用 \`Object.create(vehicleProto)\` 建立 \`myCar\`，然後設定：
- \`myCar.brand = 'Toyota'\`
- \`myCar.year = 2024\`

驗證 \`myCar\` 可以呼叫從原型繼承來的 \`getInfo()\` 方法。`,
        examples: [
          {
            input: `vehicleProto 有 getInfo 方法`,
            output: `myCar.getInfo() 回傳 "Toyota (2024)"`,
          },
        ],
        initialCode: `const vehicleProto = {
  getInfo() {
    return \`\${this.brand} (\${this.year})\`
  }
}

// TODO: 用 Object.create(vehicleProto) 建立 myCar
let myCar

// TODO: 設定 myCar.brand = 'Toyota'
// TODO: 設定 myCar.year = 2024
`,
        testCases: [
          { label: 'myCar.getInfo() 應回傳 "Toyota (2024)"', test: `return myCar.getInfo() === 'Toyota (2024)'` },
          { label: 'myCar.brand 應為 "Toyota"', test: `return myCar.brand === 'Toyota'` },
          { label: 'myCar.year 應為 2024', test: `return myCar.year === 2024` },
          {
            label: 'Object.getPrototypeOf(myCar) 應為 vehicleProto',
            test: `return Object.getPrototypeOf(myCar) === vehicleProto`,
          },
          {
            label: 'getInfo 不是 myCar 的自有屬性（來自原型）',
            test: `return myCar.hasOwnProperty('getInfo') === false`,
          },
        ],
      },
      {
        id: 'inherit',
        title: '原型繼承：動物叫聲',
        difficulty: 'medium',
        description: `請實作一個簡單的原型繼承結構：

1. 建立 \`animalProto\` 物件，包含 \`speak()\` 方法，回傳 \`\`\${this.name} says \${this.sound}\`\`
2. 用 \`Object.create(animalProto)\` 建立 \`dog\`
3. 設定 \`dog.name = 'Rex'\`，\`dog.sound = 'Woof'\`
4. 用 \`Object.create(animalProto)\` 建立 \`cat\`
5. 設定 \`cat.name = 'Whiskers'\`，\`cat.sound = 'Meow'\`

兩個物件共用同一個 \`speak\` 方法，但各自有不同的 \`name\` 和 \`sound\`。`,
        examples: [
          {
            input: `dog.name = 'Rex', dog.sound = 'Woof'`,
            output: `dog.speak() === "Rex says Woof"`,
          },
        ],
        initialCode: `// TODO: 建立 animalProto 物件，包含 speak() 方法
// speak() 回傳 \`\${this.name} says \${this.sound}\`
let animalProto

// TODO: 用 Object.create(animalProto) 建立 dog
let dog
// TODO: 設定 dog.name = 'Rex'，dog.sound = 'Woof'

// TODO: 用 Object.create(animalProto) 建立 cat
let cat
// TODO: 設定 cat.name = 'Whiskers'，cat.sound = 'Meow'
`,
        testCases: [
          { label: 'dog.speak() 應回傳 "Rex says Woof"', test: `return dog.speak() === 'Rex says Woof'` },
          { label: 'cat.speak() 應回傳 "Whiskers says Meow"', test: `return cat.speak() === 'Whiskers says Meow'` },
          {
            label: 'dog 和 cat 共用同一個原型',
            test: `return Object.getPrototypeOf(dog) === Object.getPrototypeOf(cat)`,
          },
          {
            label: 'dog 的 speak 不是自有屬性',
            test: `return dog.hasOwnProperty('speak') === false`,
          },
          {
            label: 'dog 的 name 是自有屬性',
            test: `return dog.hasOwnProperty('name') === true`,
          },
        ],
      },
    ],
  },

  // ─── obj-query ────────────────────────────────────────────────────────────
  {
    slug: 'obj-query',
    methodName: 'hasOwnProperty / in / Object.is()',
    title: '屬性查詢：hasOwnProperty、in、Object.is',
    description: '三種屬性查詢工具：hasOwnProperty 只找自有屬性、in 查整條原型鏈、Object.is 做精確值比較。',
    subCategory: '屬性查詢',
    difficulty: 'easy',
    notes: {
      title: '屬性查詢：hasOwnProperty、in、Object.is',
      sections: [
        {
          heading: '語法與回傳值',
          content: `\`obj.hasOwnProperty(key)\` → boolean，只查**自有屬性**
\`key in obj\` → boolean，查**自有 + 原型鏈**
\`Object.is(a, b)\` → boolean，比 \`===\` 更精確的值比較`,
        },
        {
          heading: '程式碼範例',
          content: `\`\`\`js
const parent = { inherited: true }
const child = Object.create(parent)
child.own = 'hello'

'own' in child         // true（自有屬性）
'inherited' in child   // true（來自原型）
child.hasOwnProperty('own')       // true
child.hasOwnProperty('inherited') // false

// Object.is 特殊情況
NaN === NaN            // false（JavaScript 怪異行為）
Object.is(NaN, NaN)    // true

+0 === -0              // true
Object.is(+0, -0)      // false
\`\`\``,
        },
        {
          heading: '注意事項',
          content: `- 安全寫法：\`Object.prototype.hasOwnProperty.call(obj, key)\`（防止物件覆蓋 hasOwnProperty）
- 或使用 ES2022 的 \`Object.hasOwn(obj, key)\`（更推薦）
- \`Object.is\` 等同 \`===\` 但修正了兩個邊緣案例：NaN 和 ±0
- \`for...in\` 會迭代原型鏈上的可列舉屬性，通常要配合 hasOwnProperty 過濾`,
        },
      ],
    },
    keyPoints: [
      'hasOwnProperty 只會檢查物件本身的屬性，不會往原型鏈查找；in 運算子則會沿著原型鏈向上查找，所以繼承的屬性也會回傳 true。',
      '在需要區分「自有屬性」和「繼承屬性」時，hasOwnProperty 是必要的工具，例如在 for...in 迴圈中過濾原型屬性。',
      'Object.is 的行為幾乎和 === 相同，但修正了兩個例外：NaN === NaN 是 false，但 Object.is(NaN, NaN) 是 true；+0 === -0 是 true，但 Object.is(+0, -0) 是 false。',
      'Object.is 特別適合用在需要精確判斷 NaN 的場景，例如 Redux 的 state 比較或 React 的 memo 判斷。',
      '更現代的寫法是使用 ES2022 的 Object.hasOwn(obj, key)，它比 obj.hasOwnProperty(key) 更安全，因為物件可能覆蓋 hasOwnProperty 這個方法。',
    ],
    problems: [
      {
        id: 'basic',
        title: 'hasOwnProperty vs in 運算子',
        difficulty: 'easy',
        description: `理解 \`hasOwnProperty\` 和 \`in\` 的差異：
- \`in\` 會沿著原型鏈查找（自有屬性 + 繼承屬性都算）
- \`hasOwnProperty\` 只查自有屬性

請計算以下四個布林值，存到對應變數：
1. \`inOwn\`：\`'role' in child\`
2. \`inInherited\`：\`'type' in child\`（type 是 parent 的屬性）
3. \`hasOwn\`：\`child.hasOwnProperty('role')\`
4. \`hasInherited\`：\`child.hasOwnProperty('type')\``,
        initialCode: `const parent = { type: 'admin' }
const child = Object.create(parent)
child.role = 'editor'

// TODO: 計算四個布林值
let inOwn       // 'role' in child
let inInherited // 'type' in child
let hasOwn      // child.hasOwnProperty('role')
let hasInherited // child.hasOwnProperty('type')
`,
        testCases: [
          { label: 'inOwn 應為 true（in 找到自有屬性）', test: `return inOwn === true` },
          { label: 'inInherited 應為 true（in 能找到繼承屬性）', test: `return inInherited === true` },
          { label: 'hasOwn 應為 true（hasOwnProperty 找到自有屬性）', test: `return hasOwn === true` },
          {
            label: 'hasInherited 應為 false（hasOwnProperty 找不到繼承屬性）',
            test: `return hasInherited === false`,
          },
        ],
      },
      {
        id: 'objectis',
        title: 'Object.is 與 === 的差異',
        difficulty: 'medium',
        description: `\`Object.is\` 和 \`===\` 大部分行為相同，但有兩個重要差異：
- \`NaN === NaN\` → \`false\`，但 \`Object.is(NaN, NaN)\` → \`true\`
- \`+0 === -0\` → \`true\`，但 \`Object.is(+0, -0)\` → \`false\`

請計算以下四個值，存到對應變數：
1. \`strictNaN\`：\`NaN === NaN\`
2. \`objectIsNaN\`：\`Object.is(NaN, NaN)\`
3. \`strictZero\`：\`+0 === -0\`
4. \`objectIsZero\`：\`Object.is(+0, -0)\``,
        examples: [
          {
            input: 'NaN, NaN',
            output: 'strictNaN: false，objectIsNaN: true',
            note: 'Object.is 正確處理 NaN',
          },
          {
            input: '+0, -0',
            output: 'strictZero: true，objectIsZero: false',
            note: 'Object.is 區分正負零',
          },
        ],
        initialCode: `// TODO: 計算以下四個值
let strictNaN    // NaN === NaN
let objectIsNaN  // Object.is(NaN, NaN)
let strictZero   // +0 === -0
let objectIsZero // Object.is(+0, -0)
`,
        testCases: [
          { label: 'strictNaN 應為 false（=== 無法比較 NaN）', test: `return strictNaN === false` },
          { label: 'objectIsNaN 應為 true（Object.is 可以比較 NaN）', test: `return objectIsNaN === true` },
          { label: 'strictZero 應為 true（=== 不區分 +0 和 -0）', test: `return strictZero === true` },
          { label: 'objectIsZero 應為 false（Object.is 區分 +0 和 -0）', test: `return objectIsZero === false` },
        ],
      },
      {
        id: 'safe-check',
        title: '安全屬性存取：safeGet',
        difficulty: 'medium',
        description: `請實作 \`safeGet(obj, key)\` 函式：
- 如果 \`obj\` 的**自有屬性**中有 \`key\`，回傳 \`obj[key]\` 的值
- 否則回傳 \`undefined\`

注意：要用 \`hasOwnProperty\` 確認是自有屬性，不能用 \`in\`（否則會誤抓原型上的屬性）。`,
        examples: [
          {
            input: `obj = { name: 'Alice' }，key = 'name'`,
            output: `'Alice'`,
          },
          {
            input: `obj = { name: 'Alice' }，key = 'toString'`,
            output: `undefined（toString 是原型屬性，不是自有屬性）`,
          },
        ],
        initialCode: `// TODO: 實作 safeGet(obj, key) 函式
// 若 obj 有自有屬性 key，回傳 obj[key]，否則回傳 undefined
function safeGet(obj, key) {
  // 在這裡實作
}
`,
        testCases: [
          {
            label: 'safeGet 找到自有屬性應回傳對應值',
            test: `const obj = { name: 'Alice', age: 25 }; return safeGet(obj, 'name') === 'Alice'`,
          },
          {
            label: 'safeGet 找不到屬性應回傳 undefined',
            test: `const obj = { name: 'Alice' }; return safeGet(obj, 'email') === undefined`,
          },
          {
            label: 'safeGet 對原型屬性（toString）應回傳 undefined',
            test: `const obj = { name: 'Alice' }; return safeGet(obj, 'toString') === undefined`,
          },
          {
            label: 'safeGet 正確處理值為 0 的屬性',
            test: `const obj = { score: 0 }; return safeGet(obj, 'score') === 0`,
          },
          {
            label: 'safeGet 正確處理值為 false 的屬性',
            test: `const obj = { active: false }; return safeGet(obj, 'active') === false`,
          },
        ],
      },
    ],
  },
]
