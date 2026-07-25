import { config } from 'dotenv'
config({ path: '.env.local' })
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from '../lib/db/schema'

const client = neon(process.env.DATABASE_URL!)
const db = drizzle(client, { schema })

const THEME = 'Git'

const subCategories = [
  { name: '基礎操作', order: 1 },
  { name: '分支與合併', order: 2 },
  { name: '歷史管理', order: 3 },
  { name: '協作工作流程', order: 4 },
]

interface TopicSeed {
  slug: string
  title: string
  description: string
  difficulty: 'easy' | 'medium' | 'hard'
  subCategory: string
  questions: {
    order: number
    question: string
    options: string[]
    answer: number
    explanation: string
  }[]
}

const topics: TopicSeed[] = [
  {
    slug: 'git-basics',
    title: 'Git 核心概念與基礎命令',
    description: '掌握 Git 的三個工作區域、add/commit 的流程、.gitignore 設定，以及 git diff 的使用方式。',
    difficulty: 'easy',
    subCategory: '基礎操作',
    questions: [
      {
        order: 1,
        question: 'Git 的三個工作區域：Working Tree、Staging Area（Index）、Repository 各自的作用是什麼？',
        options: [
          '三者完全相同，只是命名不同',
          'Working Tree：本地實際的檔案目錄，你直接編輯的地方；Staging Area（Index）：暫存區，git add 後的變更會在這裡等待提交；Repository（.git 目錄）：git commit 後的版本歷史永久存放的地方',
          'Working Tree 是遠端伺服器；Staging Area 是本地；Repository 是備份',
          'Staging Area 只在 git push 時才有用',
        ],
        answer: 1,
        explanation: '三個區域的運作流程：1) Working Tree：你修改 index.js 後，這個改動只在 Working Tree；2) git add index.js：將這個改動「快照」到 Staging Area（Index）；3) git commit -m "fix bug"：將 Staging Area 的快照永久寫入 Repository（建立一個 commit 物件）。這個設計讓你可以精確控制哪些改動放進同一個 commit（選擇性 stage），而不是把所有修改一次全部提交。',
      },
      {
        order: 2,
        question: '為什麼 Git 需要 git add 和 git commit 兩個步驟？直接 commit 所有改動不就好了嗎？',
        options: [
          '這是 Git 的設計缺陷，現代 VCS 都直接一步 commit',
          'Staging Area 讓你精確控制一個 commit 的內容：可以只 stage 部分改動（git add -p 交互式選擇）、可以把多個相關改動放進同一 commit 而把不相關的留下。這讓 commit 歷史更清晰有意義',
          '兩步驟只是為了讓 Git 伺服器有時間處理',
          'git add 只是把檔案複製到 .git 資料夾的備份',
        ],
        answer: 1,
        explanation: 'Staging Area 的實際價值：假設你同時修改了 A（修 bug）和 B（加新功能），你可以 git add A 只提交 bug fix，讓 commit 只包含相關改動。git add -p（patch 模式）甚至可以交互式選擇「同一個檔案中哪幾行要 stage」，讓 commit 粒度極細。好的 commit 歷史讓 git log 和 git bisect 更有效，code review 也更清楚。',
      },
      {
        order: 3,
        question: '.gitignore 的作用是什麼？以下哪些檔案「應該」被 gitignore？',
        options: [
          '.gitignore 讓 git status 顯示更少資訊，不影響實際追蹤',
          '.gitignore 讓 Git 完全不追蹤指定的檔案或目錄。應該 ignore 的：node_modules/（可從 package.json 重建）、.env（含敏感資訊）、build/dist/（建置產物）、.DS_Store（OS 系統檔）、IDE 設定（.vscode/）',
          '.gitignore 會永久刪除指定的檔案',
          'gitignore 只對新建的檔案有效，已追蹤的檔案無法 ignore',
        ],
        answer: 1,
        explanation: '.gitignore 的規則：以 / 結尾表示目錄（node_modules/）；以 ! 開頭表示排除（!important.env 不 ignore）；** 匹配多層目錄。重要注意：.gitignore 只對「尚未追蹤（untracked）」的檔案有效。若一個檔案已被 git 追蹤（曾經 commit 過），後來加入 .gitignore 不會停止追蹤，需要先執行 git rm --cached filename 移除追蹤後 .gitignore 才生效。.env 等機敏檔案應從一開始就 ignore，不要 commit 後再處理。',
      },
      {
        order: 4,
        question: 'git diff 的以下三種用法各自比較什麼？\nA: git diff\nB: git diff --staged\nC: git diff HEAD',
        options: [
          '三者都比較相同的內容，只是語法不同',
          'A: git diff — 比較 Working Tree 和 Staging Area 的差異（尚未 stage 的改動）；B: git diff --staged — 比較 Staging Area 和最新 commit（HEAD）的差異（已 stage 但未 commit 的改動）；C: git diff HEAD — 比較 Working Tree 和 HEAD 的差異（所有未 commit 的改動，包含已 stage 和未 stage）',
          'A 比較兩個分支；B 比較本地和遠端；C 比較兩個 commit',
          'git diff 在沒有衝突時不顯示任何輸出',
        ],
        answer: 1,
        explanation: '三種 diff 的使用場景：A) git diff：「我改了什麼但還沒 add？」，適合在 git add 前確認改動；B) git diff --staged（或 --cached）：「我 add 了什麼？commit 前的最後確認」，適合 commit 前 review；C) git diff HEAD：「相較上一個 commit，我總共改了什麼？」，綜合檢視所有未提交的改動。也可以比較兩個 commit：git diff abc123 def456，或比較分支：git diff main feature/login。',
      },
      {
        order: 5,
        question: 'git log 的常用選項，以下哪個組合可以顯示簡潔的一行 log 並有分支圖示？',
        options: [
          'git log --all --graph',
          'git log --oneline --graph --all，--oneline 讓每個 commit 只顯示一行（hash + message）；--graph 顯示 ASCII 分支圖；--all 顯示所有分支的 commit',
          'git log -1 顯示所有分支',
          'git log --pretty --branches --lines=1',
        ],
        answer: 1,
        explanation: 'git log 常用選項：--oneline（簡短 hash + message）、--graph（分支樹狀圖）、--all（包含所有分支，不只是當前分支）、-n 5（只顯示最近 5 個）、--author="John"（過濾作者）、--since="2024-01-01"（過濾時間）、--grep="fix"（過濾 message）、-p（顯示每個 commit 的 diff）。常用組合：git log --oneline --graph --all --decorate（顯示所有分支的 commit 樹，含標籤）。git log --follow filename 可以追蹤特定檔案的變更歷史。',
      },
    ],
  },

  {
    slug: 'git-remote',
    title: '遠端倉庫操作',
    description: '掌握 git clone、fetch、pull、push 的差異，upstream tracking 設定，以及 fork 與 clone 的不同用途。',
    difficulty: 'easy',
    subCategory: '基礎操作',
    questions: [
      {
        order: 1,
        question: 'git fetch 和 git pull 的主要差別是什麼？',
        options: [
          '兩者完全相同，pull 只是 fetch 的別名',
          'git fetch：從遠端下載最新的 commit 和分支資訊到本地，但不修改你的 Working Tree 和當前分支；git pull：等同於 git fetch + git merge（或 git fetch + git rebase），下載後立即合併到當前分支',
          'git fetch 只能下載一個分支；git pull 可以下載所有分支',
          'git pull 比 git fetch 更安全，不會產生衝突',
        ],
        answer: 1,
        explanation: 'fetch vs pull 的選擇：git fetch 讓你「看看遠端有什麼新東西」而不影響本地工作。執行後可以 git log origin/main 查看遠端的 commit，再決定是否 merge。git pull 是快捷操作，適合信任遠端且確定要合併。在有複雜合併或 rebase 工作流的團隊，建議用 fetch + 手動 merge/rebase，讓合併操作更受控。git pull --rebase 讓 pull 時用 rebase 代替 merge，保持線性歷史。',
      },
      {
        order: 2,
        question: 'git push -u origin main 中的 -u（--set-upstream）選項是什麼作用？',
        options: [
          '-u 讓 push 強制覆蓋遠端的 commit',
          '-u 將本地分支和遠端分支建立「追蹤關係（tracking）」。建立後，後續直接執行 git push（不需要指定 origin main）、git pull、git status（顯示遠端差異），都會自動使用這個追蹤關係',
          '-u 讓 push 動作以 unstaged 的方式進行',
          '-u 是 URL 的縮寫，用來指定遠端地址',
        ],
        answer: 1,
        explanation: 'Tracking Branch 的意義：git push -u origin main 執行後，本地 main 分支追蹤 origin/main。此後：git push（無參數）自動推送到 origin/main；git pull（無參數）自動從 origin/main 拉取；git status 顯示「Your branch is ahead of origin/main by 2 commits」，讓你清楚與遠端的差距。若未設定 tracking，每次 push 都需要完整寫 git push origin main。新分支第一次 push 時建議加 -u，之後就方便了。',
      },
      {
        order: 3,
        question: 'git clone 和 fork 的主要差別是什麼？',
        options: [
          'fork 和 clone 完全相同，只是不同平台的命名',
          'git clone：把遠端倉庫複製到本地，仍然指向原本的 remote（你可能有/沒有 push 權限）；fork（GitHub/GitLab 功能，非 Git 命令）：在雲端建立一個完全屬於你的「倉庫副本」，你對這個 fork 有完整權限，再 clone 到本地。適合向沒有直接 write 權限的開源專案貢獻程式碼',
          'fork 比 clone 更快，因為不需要下載完整歷史',
          'clone 只複製最新的 commit，fork 複製所有歷史',
        ],
        answer: 1,
        explanation: '開源貢獻流程（Fork Workflow）：1) Fork 原始倉庫到自己帳號（GitHub UI）；2) Clone 自己的 fork 到本地：git clone https://github.com/YOUR_NAME/repo；3) 加入上游（upstream）遠端：git remote add upstream https://github.com/ORIGINAL/repo；4) 建立分支、開發、推送到自己的 fork；5) 在 GitHub 開啟 Pull Request，從 fork 的分支 → 原始倉庫的 main。用 git fetch upstream; git rebase upstream/main 保持與原始倉庫同步。',
      },
      {
        order: 4,
        question: '如何查看和管理本地設定的遠端（remote）？',
        options: [
          '只能在 GitHub 網頁介面管理遠端設定',
          'git remote -v：列出所有遠端及其 URL（fetch 和 push URL）；git remote add <name> <url>：新增遠端；git remote remove <name>：刪除遠端；git remote set-url origin <new-url>：更改遠端 URL（如 SSH 改 HTTPS）；git remote rename origin upstream：重命名遠端',
          'git remotes --list 列出所有遠端',
          'git config --global remote.origin 查看遠端',
        ],
        answer: 1,
        explanation: '常見的多遠端設定：Fork Workflow 中通常有兩個遠端：origin（自己的 fork，有 push 權限）和 upstream（原始倉庫，通常只有 fetch 權限）。git remote -v 輸出示例：origin https://github.com/you/repo.git (fetch/push)；upstream https://github.com/org/repo.git (fetch/push)。更改 remote URL 的常見場景：從 HTTPS 改為 SSH（git remote set-url origin git@github.com:you/repo.git），讓 push 時不需要每次輸入密碼。',
      },
      {
        order: 5,
        question: 'git push --force 和 git push --force-with-lease 的差別是什麼？什麼情況下可以 force push？',
        options: [
          '兩者完全相同，force-with-lease 只是更長的寫法',
          '--force：強制推送，完全覆蓋遠端分支歷史，可能覆蓋他人的 commit；--force-with-lease：安全版本，若遠端分支在你上次 fetch 後被他人修改（有新 commit），則拒絕推送，防止覆蓋他人工作。force push 只應在個人功能分支上使用，永遠不要在 main/master 上 force push',
          'force push 在所有情況下都是安全的',
          '--force 只能用於空的倉庫',
        ],
        answer: 1,
        explanation: 'Force push 的安全準則：可以 force push 的情況：個人功能分支（只有你在用）、在 PR 被 merge 前需要修改歷史（git commit --amend 後、interactive rebase 後）。絕對不要 force push 的情況：main/master/develop 等共享分支、多人協作的分支。--force-with-lease 的機制：在 push 前檢查「你最後一次 fetch 後，遠端是否有新 commit」，若有則拒絕，讓你先 fetch 並處理衝突。這是比 --force 更安全的選擇，現代團隊建議用 --force-with-lease 取代 --force。',
      },
    ],
  },

  {
    slug: 'git-branch-merge',
    title: '分支管理與 Merge 策略',
    description: '掌握分支的建立、切換、刪除，以及 fast-forward、no-ff、squash 三種 merge 模式的差異和使用場景。',
    difficulty: 'medium',
    subCategory: '分支與合併',
    questions: [
      {
        order: 1,
        question: 'git merge 的三種模式（fast-forward、--no-ff、--squash）的主要差別是什麼？',
        options: [
          '三種模式效果完全相同，只是速度不同',
          'fast-forward（預設）：若目標分支是直線延伸（沒有分叉），直接移動指標，不建立 merge commit，歷史是線性的；--no-ff：強制建立 merge commit，即使可以 fast-forward，保留分支的合併歷史；--squash：把功能分支的所有 commit 壓縮成一個，staged 後需手動 commit，不自動建立 merge commit',
          'fast-forward 只能在 main 分支使用',
          '--squash 會刪除功能分支的所有 commit 歷史',
        ],
        answer: 1,
        explanation: '三種模式的使用場景：fast-forward → 個人的小修改、hotfix，保持歷史整潔線性；--no-ff → 團隊功能開發，保留「這組 commit 屬於同一功能」的脈絡，方便 git log --graph 看到清楚的分支合併點；--squash → 程式碼審查過後只想保留一個乾淨的 commit（把功能開發的雜亂 commit 歸整）。選擇建議：GitHub 的 PR merge 按鈕對應：Merge commit = --no-ff；Squash and merge = --squash；Rebase and merge = 線性 rebase。',
      },
      {
        order: 2,
        question: 'Git 的 HEAD 是什麼？什麼是 detached HEAD 狀態？',
        options: [
          'HEAD 是 Git 伺服器的主機位址',
          'HEAD 是一個指向「當前所在位置」的指標，通常指向某個分支名稱（如 main）。Detached HEAD 發生在 HEAD 直接指向某個 commit hash 而非分支名稱時（如 git checkout abc1234），在此狀態下建立的新 commit 不屬於任何分支，切換回分支後可能被垃圾回收',
          'HEAD 代表最新的 commit，永遠不會改變',
          'Detached HEAD 是 Git 的嚴重錯誤，需要重新 clone',
        ],
        answer: 1,
        explanation: 'HEAD 的運作：通常 HEAD → main → commit ABC。當你 git checkout abc1234，HEAD 直接指向 commit abc1234（不透過分支名稱），就是 detached HEAD。這在查看舊版本時常見。若在 detached HEAD 狀態下建立新 commit，這些 commit 不屬於任何分支；切換到其他分支後，這些 commit 會成為「孤立 commit」，最終被 Git GC（garbage collection）清除。解決：若要保留這些 commit，在 detached HEAD 狀態下先 git checkout -b new-branch 建立分支來保存它們。',
      },
      {
        order: 3,
        question: '建立並立即切換到新分支的命令是什麼？',
        options: [
          'git branch new-feature && git checkout new-feature',
          'git checkout -b new-feature（傳統方式）或 git switch -c new-feature（現代方式，Git 2.23+）。兩者都建立並切換到 new-feature 分支。也可以從指定的 commit/分支建立：git checkout -b hotfix main（從 main 建立 hotfix 分支）',
          'git create branch new-feature',
          'git branch --new new-feature',
        ],
        answer: 1,
        explanation: 'Git 2.23 引入了語意更清晰的 git switch 和 git restore 取代 git checkout 的部分功能：git switch branch-name（切換分支，相當於 git checkout branch-name）；git switch -c new-branch（建立並切換，相當於 git checkout -b）；git restore file.txt（還原檔案，相當於 git checkout -- file.txt）。建議：新版 Git 使用 switch/restore，讓操作意圖更明確；但 checkout 在所有版本通用，面試或舊環境仍需熟悉。',
      },
      {
        order: 4,
        question: '如何刪除分支？git branch -d 和 git branch -D 的差別是什麼？',
        options: [
          '刪除分支會一併刪除所有 commit',
          'git branch -d branch-name：安全刪除，若分支有未 merge 的 commit 會拒絕刪除並提示警告；git branch -D branch-name：強制刪除，不管是否 merge。刪除遠端分支：git push origin --delete branch-name 或 git push origin :branch-name',
          'git branch -d 只能刪除空分支，-D 可以刪除有 commit 的分支',
          '刪除本地分支會自動刪除遠端對應分支',
        ],
        answer: 1,
        explanation: '-d 和 -D 的選擇：通常在功能分支成功 merge 回 main 後用 -d 刪除（Git 確認已 merge，安全）。若建立了一個實驗性分支、決定不要了，需要用 -D 強制刪除（commit 未 merge 但你確定不需要）。注意：刪除分支只是刪除「指標」，commit 物件仍然存在（直到 GC）。若誤刪，可以用 git reflog 找到分支尖端的 commit hash，再 git checkout -b recovered-branch <hash> 恢復。',
      },
      {
        order: 5,
        question: '執行 git merge feature-branch 後發現有問題，如何完整撤銷這次 merge？',
        options: [
          '重新 clone 倉庫',
          'merge 剛完成且未 push：git merge --abort（若衝突未解決）或 git reset --hard HEAD~1（已完成 merge commit，回到 merge 前的狀態）。若已 push：git revert -m 1 HEAD（建立一個撤銷 merge 的新 commit，保留歷史，適合共享分支）',
          'git merge --undo 撤銷最近的 merge',
          'git branch -d feature-branch 可以撤銷 merge',
        ],
        answer: 1,
        explanation: '撤銷 merge 的三種情況：1) merge 進行中有衝突、還在解決中：git merge --abort，回到 merge 前的狀態；2) merge 已完成（--no-ff 產生了 merge commit）但未 push：git reset --hard ORIG_HEAD（ORIG_HEAD 是 merge 前的 HEAD），或 git reset --hard HEAD~1；3) merge 已完成且已 push 到共享分支：git revert -m 1 HEAD（-m 1 指定保留第一個父 commit，即合併目標分支），建立一個新的「撤銷 commit」，不改變歷史。',
      },
    ],
  },

  {
    slug: 'git-rebase',
    title: 'Rebase 原理與 Merge 的選擇',
    description: '深入了解 git rebase 的工作原理、與 merge 的核心差異、interactive rebase 的用途，以及「不能 rebase 公共分支」的原因。',
    difficulty: 'medium',
    subCategory: '分支與合併',
    questions: [
      {
        order: 1,
        question: 'git rebase 的核心工作原理是什麼？',
        options: [
          'rebase 把兩個分支的 commit 混合在一起',
          'rebase 把當前分支上「比目標分支新」的 commit，一個個「重播（replay）」到目標分支的最新 commit 之後，產生新的 commit（hash 不同），讓分支歷史變成線性',
          'rebase 和 merge 做一樣的事，只是介面不同',
          'rebase 把所有 commit 合併成一個',
        ],
        answer: 1,
        explanation: 'rebase 的步驟（git rebase main 在 feature 分支上執行）：1) 找到 feature 和 main 的共同祖先（common ancestor）；2) 把 feature 上比 main 新的 commit（C3、C4）暫存起來；3) 把 feature 的 HEAD 移到 main 的最新 commit（C5）；4) 把暫存的 C3、C4 依序重新套用，產生 C3"、C4"（新 hash，內容相同但基底不同）。結果：feature 分支的歷史變成「從 main 最新 commit 延伸出來」的線性歷史，就像是在 main 更新後才開始開發 feature 一樣。',
      },
      {
        order: 2,
        question: 'rebase 和 merge 的主要差別是什麼？各自適合什麼情況？',
        options: [
          'rebase 比 merge 更安全，應優先使用',
          'merge：保留完整的分支歷史，建立 merge commit，歷史有分岔，適合共享分支和需要保留「何時合併」資訊的場景；rebase：重寫 commit 歷史，讓歷史呈線性，適合在功能分支上同步主分支最新進度（讓 PR 更好 review），或清理本地 commit',
          'merge 只能合併兩個分支，rebase 可以合併多個',
          'rebase 會刪除原始 commit，merge 不會',
        ],
        answer: 1,
        explanation: '選擇原則：1) 個人功能分支同步主分支：用 rebase（git rebase main），讓 PR 的 commit 整齊在主分支後，review 更清楚；2) 合併功能分支回主分支：視團隊策略，--no-ff merge 保留分支脈絡，squash merge 清理歷史；3) 共享分支同步：用 merge，不用 rebase（rebase 改寫歷史，其他人的本地倉庫會出現問題）。GitHub PR 合併按鈕：Merge commit、Squash and merge、Rebase and merge 各對應不同策略，團隊應統一選擇。',
      },
      {
        order: 3,
        question: 'git rebase -i（interactive rebase）可以做什麼操作？',
        options: [
          'interactive rebase 只能用來 squash commit',
          'git rebase -i HEAD~N 進入互動模式，可以對最近 N 個 commit 做：pick（保留）、squash/fixup（合併進上一個 commit）、reword（修改 commit message）、edit（停下來修改 commit 內容）、drop（刪除 commit）、reorder（調整 commit 順序）',
          'interactive rebase 需要 root 權限才能執行',
          'git rebase -i 只在 GitHub 網頁介面才能使用',
        ],
        answer: 1,
        explanation: 'interactive rebase 的實際使用場景：1) 清理 commit 歷史：把「WIP」、「fix typo」等雜亂 commit squash 進有意義的 commit；2) 修改 commit message：用 reword 修正措辭；3) 把一個大 commit 分拆（edit 後 git reset HEAD~，再分別 add 和 commit）；4) 刪除特定 commit（drop）；5) 調整 commit 順序（直接拖動行序）。注意：所有 interactive rebase 的操作都重寫了 commit hash，只能在個人分支（未推送或已推送但只有自己用）上使用。',
      },
      {
        order: 4,
        question: '為什麼「不能對已推送到公共分支的 commit 做 rebase」？',
        options: [
          'Git 技術上不允許這樣做',
          'rebase 重寫了 commit hash（新的 commit 物件，新的 hash），若其他人已 clone 並基於舊的 commit 繼續工作，他們的歷史和 rebase 後的歷史會分叉，造成嚴重混亂（需要每個人 force pull 或重新設置）',
          '公共分支預設有 rebase 鎖，需要管理員解鎖',
          'rebase 後分支會被刪除，所以不能用在重要分支',
        ],
        answer: 1,
        explanation: '「Golden Rule of Rebasing」：不要在公共（shared）分支上做 rebase。場景：團隊成員 Alice 的 feature 基於 main 的 commit M1、M2。若有人把 main rebase 了，M1 和 M2 被改寫成 M1"、M2"（新 hash），Alice 本地的 feature 還在基於舊的 M1、M2，她 pull 時 Git 發現歷史衝突，不知道如何合併。解決辦法：若意外 rebase 了公共分支，所有協作者需要 git fetch + git rebase origin/main（或 git pull --rebase），重新 rebase 到新歷史。這非常痛苦，所以預防勝於治療。',
      },
      {
        order: 5,
        question: 'git rebase 發生衝突時，正確的處理流程是什麼？',
        options: [
          '直接 git rebase --abort 放棄',
          '1) 衝突發生，rebase 暫停；2) 手動解決衝突（編輯衝突標記 <<<<、====、>>>>）；3) git add 解決後的檔案（不需要 git commit）；4) git rebase --continue 繼續 rebase 下一個 commit；5) 若需要放棄整個 rebase：git rebase --abort',
          'rebase 衝突要用 git merge --resolve 處理',
          '解決衝突後需要 git commit -m "resolve conflict" 然後 git rebase --continue',
        ],
        answer: 1,
        explanation: 'rebase vs merge 衝突處理的差別：merge 衝突時，解決後 git add 然後 git commit（建立 merge commit）；rebase 衝突時，解決後 git add 然後 git rebase --continue（繼續播放下一個 commit，不建立新的 merge commit）。rebase 可能要解決多次衝突（每個 commit 重播時都可能衝突），而 merge 通常只需解決一次。若 rebase 時衝突太複雜，可以考慮改用 merge；或用 git rerere（Reuse Recorded Resolution）自動重用之前的衝突解法。',
      },
    ],
  },
]

async function seed() {
  console.log(`新增 Git 主題子類別...`)
  for (const sub of subCategories) {
    await db
      .insert(schema.themeSubCategories)
      .values({ theme: THEME, name: sub.name, order: sub.order })
      .onConflictDoUpdate({
        target: [schema.themeSubCategories.theme, schema.themeSubCategories.name],
        set: { order: sub.order },
      })
    console.log(`  ✓ ${sub.name}`)
  }

  console.log(`\n新增 ${topics.length} 個 Git 主題及題目...`)
  for (const topic of topics) {
    const [inserted] = await db
      .insert(schema.topics)
      .values({
        slug: topic.slug,
        title: topic.title,
        description: topic.description,
        category: 'Git',
        difficulty: topic.difficulty,
        theme: THEME,
        subCategory: topic.subCategory,
      })
      .onConflictDoUpdate({
        target: schema.topics.slug,
        set: {
          title: topic.title,
          description: topic.description,
          category: 'Git',
          difficulty: topic.difficulty,
          theme: THEME,
          subCategory: topic.subCategory,
        },
      })
      .returning({ id: schema.topics.id })

    const topicId = inserted.id
    console.log(`  ✓ ${topic.slug} (id: ${topicId})`)

    for (const q of topic.questions) {
      await db
        .insert(schema.questions)
        .values({
          topicId,
          order: q.order,
          question: q.question,
          options: q.options,
          answer: q.answer,
          explanation: q.explanation,
        })
        .onConflictDoUpdate({
          target: [schema.questions.topicId, schema.questions.order],
          set: {
            question: q.question,
            options: q.options,
            answer: q.answer,
            explanation: q.explanation,
          },
        })
    }
    console.log(`    → ${topic.questions.length} 道題目`)
  }

  console.log('\n✅ Git 主題建立完成')
  process.exit(0)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
