import { config } from 'dotenv'
config({ path: '.env.local' })
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from '../lib/db/schema'

const client = neon(process.env.DATABASE_URL!)
const db = drizzle(client, { schema })

const THEME = 'Git'

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
    slug: 'git-reset-revert',
    title: 'reset / revert / cherry-pick / stash',
    description: '掌握撤銷操作的核心工具：reset 的三種模式、revert 的安全撤銷、cherry-pick 的跨分支應用，以及 stash 的暫存用途。',
    difficulty: 'medium',
    subCategory: '歷史管理',
    questions: [
      {
        order: 1,
        question: 'git reset --soft、--mixed、--hard 的差別是什麼？',
        options: [
          '三種模式效果完全相同，只是速度不同',
          '--soft：移動 HEAD 到指定 commit，Staging Area 和 Working Tree 保留改動（commit 被撤銷，但 staged 改動仍在）；--mixed（預設）：移動 HEAD，Staging Area 清空，Working Tree 保留改動（等同 git reset HEAD，commit 和 stage 都撤銷）；--hard：移動 HEAD，Staging Area 和 Working Tree 都恢復到指定 commit（所有未提交的改動都「消失」）',
          '--soft 最安全，--hard 最危險，--mixed 不存在',
          '--hard 只重置 Staging Area，不影響 Working Tree',
        ],
        answer: 1,
        explanation: '三種模式的記憶方法：commit、staged、working tree 三個區域，soft 只動 commit 指標，mixed 動 commit + staged，hard 三個都動。實際使用：--soft 適合「想把最後幾個 commit 合成一個」（reset --soft HEAD~3 後重新 commit）；--mixed 適合「撤銷 commit 和 stage 但保留改動」（最常用）；--hard 適合「徹底放棄改動，回到某個乾淨狀態」（謹慎使用，工作會消失！）。--hard 之後若後悔，可用 git reflog 找到舊 commit hash 恢復。',
      },
      {
        order: 2,
        question: 'git reset 和 git revert 的核心差別是什麼？何時應該選哪個？',
        options: [
          '兩者完全相同，revert 是 reset 的新版本',
          'reset：重寫歷史（移動 HEAD，使舊 commit 不可見）；revert：建立一個「撤銷指定 commit 效果」的新 commit，不改變歷史。規則：reset 用於個人本地分支（未推送）；revert 用於已推送到共享分支的 commit（改寫歷史會影響他人）',
          'reset 只能撤銷最後一個 commit，revert 可以撤銷任意 commit',
          'revert 只能在 GitHub 網頁介面執行',
        ],
        answer: 1,
        explanation: '選擇依據：已推送到 main/共享分支的 commit → 只能用 revert（git revert abc123 → 建立新 commit，保留歷史，其他人可以正常 pull）；本地未推送的 commit → 可以用 reset（重寫歷史不影響任何人）。revert 的特殊情況：撤銷 merge commit 需要 git revert -m 1 <merge-commit-hash>（-m 1 保留第一個父 commit，即合併目標分支）。撤銷多個 commit：git revert A..B（撤銷從 A 到 B 的一系列 commit，各建立一個 revert commit）。',
      },
      {
        order: 3,
        question: 'git stash 的用途是什麼？常用的 stash 命令有哪些？',
        options: [
          'stash 是 Git 的遠端備份功能',
          'stash 臨時儲存 Working Tree 和 Staging Area 的未提交改動，讓你切換分支或拉取更新時有乾淨的工作區。常用命令：git stash（儲存）、git stash pop（取出最新並刪除）、git stash apply stash@{0}（取出不刪除）、git stash list（列出所有 stash）、git stash drop（刪除）、git stash branch new-branch（建立分支並套用）',
          'stash 只能儲存一個改動，存入後原來的 stash 被覆蓋',
          'stash 中的改動會自動 commit，離開分支時自動儲存',
        ],
        answer: 1,
        explanation: 'stash 的常見場景：1) 緊急切換：正在開發功能，突然要 hotfix，git stash → 切換分支修 bug → 切回 → git stash pop；2) 拉取更新：Working Tree 有改動又需要 git pull，git stash → git pull → git stash pop（若有衝突需手動解決）；3) 跨分支移植改動：git stash → 切到另一分支 → git stash pop（把改動帶到另一分支）。注意：git stash 預設不儲存 Untracked files（新建但未 add 的檔案），需要 git stash -u（--include-untracked）。',
      },
      {
        order: 4,
        question: 'git cherry-pick 的用途是什麼？',
        options: [
          'cherry-pick 讓你選擇性地下載遠端的某些 commit',
          'cherry-pick 讓你把「指定的 commit」套用到當前分支，建立一個內容相同但 hash 不同的新 commit。用途：把 hotfix 從修復分支移植到多個版本分支；把某個功能的特定 commit 移到另一個分支；不 merge 整個分支，只取其中某個改動',
          'cherry-pick 只能用於合併分支',
          'cherry-pick 和 git merge 的效果完全相同',
        ],
        answer: 1,
        explanation: 'cherry-pick 使用方式：git cherry-pick abc1234（套用單個 commit）；git cherry-pick A..B（套用 A 到 B 之間的 commit，不含 A）；git cherry-pick A^..B（含 A）。實際場景：main 分支上修了一個 bug（commit def456），這個 fix 也需要套用到 release/v1.2 分支：git checkout release/v1.2; git cherry-pick def456。cherry-pick 也可能有衝突，處理方式和 merge/rebase 相同（解決 → git add → git cherry-pick --continue）。',
      },
      {
        order: 5,
        question: '不小心執行了 git reset --hard 把重要改動刪掉了，還能恢復嗎？',
        options: [
          '一旦 git reset --hard，改動永遠消失無法恢復',
          '可以！使用 git reflog 找回：git reflog 顯示所有 HEAD 的移動歷史（包含 reset 前的 commit hash）→ 找到 reset 前的 commit hash → git checkout <hash>（查看）或 git reset --hard <hash>（恢復到該點）。git reflog 保留記錄 90 天（預設）',
          'git reset --hard 後只能靠遠端倉庫恢復',
          'git undo 命令可以撤銷任何 Git 操作',
        ],
        answer: 1,
        explanation: 'git reflog 是 Git 的「後悔藥」：它記錄了 HEAD 所有移動歷史（checkout、commit、reset、merge、rebase 等），即使 commit 已不在任何分支上，reflog 仍保留它的 hash。用法：git reflog → 找到目標 commit（如 HEAD@{3} abc1234 commit: feat: add login）→ git reset --hard abc1234 或 git checkout -b recovered abc1234。同樣可以恢復：誤刪的分支（找到分支最後 commit 的 hash）、誤 squash 的 commit。reflog 是本地的，不推送到遠端，換電腦就沒有了。',
      },
    ],
  },

  {
    slug: 'git-advanced',
    title: '進階 Git 操作',
    description: '了解 git reflog 的恢復能力、git bisect 的二分搜尋除錯、git tag 的版本標記，以及 git hooks 的自動化應用。',
    difficulty: 'hard',
    subCategory: '歷史管理',
    questions: [
      {
        order: 1,
        question: 'git reflog 是什麼？它和 git log 有什麼差別？',
        options: [
          'reflog 是 log 的遠端版本，顯示所有協作者的 commit',
          'git log 顯示「可達的 commit 歷史（從 HEAD 沿著父 commit 鏈）」；git reflog 顯示「本地 HEAD 所有移動記錄」，包含已不在任何分支上的孤立 commit、reset 前的狀態等。reflog 是本地的、不推送到遠端，用於個人操作的回溯和緊急恢復',
          'reflog 只能在 GitHub 網站上查看',
          'reflog 和 log 完全相同，只是顯示格式不同',
        ],
        answer: 1,
        explanation: 'reflog 的核心價值：任何 Git 操作都不會立刻「永久刪除」commit 物件（在 GC 前），reflog 讓你找到這些「遊離（dangling）」的 commit。可以恢復的情況：1) git reset --hard 後後悔 → reflog 找到 reset 前的 hash → git reset --hard <hash>；2) 誤刪分支 → reflog 找到分支尖端的 hash → git checkout -b recovered <hash>；3) rebase 搞砸 → reflog 找到 rebase 前的 ORIG_HEAD → git reset --hard ORIG_HEAD。reflog 記錄預設保留 90 天。',
      },
      {
        order: 2,
        question: 'git bisect 是什麼？如何用它快速找到引入 bug 的 commit？',
        options: [
          'bisect 讓你同時比較兩個分支的差異',
          'git bisect 用「二分搜尋」在 commit 歷史中找到引入 bug 的 commit。流程：git bisect start → git bisect bad（標記當前 commit 有 bug）→ git bisect good <old-commit>（標記某個無 bug 的舊 commit）→ Git 自動 checkout 中間點 → 測試後 git bisect good/bad → 重複直到找到第一個壞 commit',
          'bisect 讓你合併兩個分支的差異',
          'git bisect 只在 Linux 系統上有效',
        ],
        answer: 1,
        explanation: 'bisect 的效率：假設有 1000 個 commit，線性搜尋需要測試 1000 次；二分搜尋只需約 10 次（log₂(1000) ≈ 10）。自動化 bisect：git bisect run npm test（讓 Git 自動執行測試，回傳 0 = good，非 0 = bad），找到壞 commit 後自動停下。完成後 git bisect reset 回到原始 HEAD。實際場景：「昨天還正常，今天發現 bug，但中間有 50 個 commit」，bisect 讓你只需 6 次就能定位問題 commit。',
      },
      {
        order: 3,
        question: 'git tag 的兩種類型（lightweight 和 annotated）的差別是什麼？',
        options: [
          '兩種 tag 完全相同，只是建立命令不同',
          'lightweight tag：只是一個指向特定 commit 的簡單指標（類似分支，但不移動）；annotated tag（-a）：儲存額外資訊（標記者、日期、訊息），是一個完整的 Git 物件，可以被 GPG 簽署，git show v1.0 顯示 tag 資訊。版本發布建議用 annotated tag',
          'lightweight tag 只能在本地使用，annotated tag 才能推送',
          'annotated tag 是 Git 的新功能，舊版本只有 lightweight',
        ],
        answer: 1,
        explanation: 'tag 的使用：建立 annotated tag：git tag -a v1.0.0 -m "Release 1.0.0"；建立 lightweight tag：git tag v1.0.0；推送 tag：git push origin v1.0.0（tag 不會隨 git push 自動推送！）或 git push origin --tags（推送所有 tag）；刪除本地 tag：git tag -d v1.0.0；刪除遠端 tag：git push origin --delete v1.0.0；列出所有 tag：git tag 或 git tag -l "v1.*"（用 pattern 篩選）。Semantic Versioning（語義化版本）：v主.次.修（v2.3.1），tag 是版本管理的關鍵。',
      },
      {
        order: 4,
        question: 'Git Hooks 是什麼？pre-commit hook 的常見用途是什麼？',
        options: [
          'Git Hooks 是 GitHub 的 Webhook 功能',
          'Git Hooks 是在 Git 操作的特定時機自動執行的腳本（shell script），位於 .git/hooks/ 目錄。pre-commit hook 在 git commit 執行前觸發，常見用途：執行 ESLint 檢查（不通過則阻止 commit）、Prettier 格式化、執行單元測試、檢查 commit message 格式（commitlint）',
          'Git Hooks 只在 GitHub CI/CD 中使用',
          'Git Hooks 需要在 GitHub 設定介面啟用才能生效',
        ],
        answer: 1,
        explanation: '常用的 Git Hooks：pre-commit（commit 前）→ lint、format、test；commit-msg（建立 commit message 後）→ 驗證 message 格式（如必須符合 "feat: ", "fix: " 等 Conventional Commits）；pre-push（push 前）→ 執行完整測試套件。工具推薦：husky（最流行的 Git Hooks 管理工具，跨平台，配置在 package.json 或 .husky/ 目錄）+ lint-staged（只對 staged 的檔案執行 lint，比對全部檔案更快）。Hooks 在 .git/hooks/ 目錄不會被 git 追蹤，需要用 husky 等工具讓團隊共享設定。',
      },
      {
        order: 5,
        question: 'git worktree 解決什麼問題？它和 git stash 有什麼不同？',
        options: [
          'worktree 是 Git 的雲端備份功能',
          'git worktree 讓你同時在「多個分支」工作，每個 worktree 是獨立的工作目錄，共享同一個 .git 倉庫。stash 是「暫存改動、切換分支」，只能在一個目錄中工作；worktree 讓你不需要 stash，直接在不同目錄同時有多個分支的工作區',
          'worktree 和 stash 的功能完全相同',
          'worktree 只在 Windows 系統上有效',
        ],
        answer: 1,
        explanation: 'git worktree 的使用場景：同時進行功能開發（feature/login 分支）和緊急 hotfix（hotfix/security-patch 分支），不需要打斷當前工作。使用方式：git worktree add ../my-repo-hotfix hotfix/security-patch（在 ../my-repo-hotfix 目錄建立 hotfix 分支的工作樹）；在新目錄工作後，git worktree remove ../my-repo-hotfix 清除。vs stash：stash 適合快速暫存然後切換同一個目錄；worktree 適合需要長時間並行開發兩個分支（如同時 demo 兩個版本、比較兩個版本的行為）。',
      },
    ],
  },

  {
    slug: 'git-conflict',
    title: '衝突解決與常見問題處理',
    description: '了解 merge conflict 和 rebase conflict 的發生原因、衝突標記的含義、解決流程，以及如何預防和處理常見的 Git 問題。',
    difficulty: 'medium',
    subCategory: '協作工作流程',
    questions: [
      {
        order: 1,
        question: 'Merge conflict 的衝突標記中，<<<<<<< HEAD、=======、>>>>>>> branch-name 各代表什麼？',
        options: [
          '<<<<<<< 是開始符號，======= 是中間符號，>>>>>>> 是結束符號，沒有特別含義',
          '<<<<<<< HEAD 和 ======= 之間：是「當前分支（HEAD）」的版本；======= 和 >>>>>>> branch-name 之間：是「被合併分支（branch-name）」的版本。解決時選擇保留哪個版本（或混合兩者），刪除所有標記符號後 git add 再 git commit',
          '<<<<<<< 是需要刪除的舊版本，>>>>>>> 是需要保留的新版本',
          '======= 之前是遠端版本，之後是本地版本',
        ],
        answer: 1,
        explanation: '衝突內容範例：<<<<<<< HEAD（當前分支）const name = "Alice" =======（分隔線）const name = "Bob" >>>>>>> feature/rename（被合併的分支）。解決步驟：1) 閱讀兩個版本，決定正確的結果；2) 刪除衝突標記（<<<、===、>>>）和不需要的版本；3) 保存檔案；4) git add <解決的檔案>；5) git commit（merge）或 git rebase --continue（rebase）。工具：VSCode 的「Accept Current」「Accept Incoming」「Accept Both」按鈕讓衝突解決更直覺。',
      },
      {
        order: 2,
        question: '什麼情況會造成 merge conflict？如何預防？',
        options: [
          '任何 merge 操作都必然產生 conflict',
          'Merge conflict 發生在兩個分支「修改了同一個檔案的同一個部分（行）」。預防方式：1) 功能分支保持小而短命（降低分歧程度）；2) 頻繁同步主分支（減少差異積累）；3) 明確的檔案/模組分工（減少同時修改同一檔案的機會）；4) 重構和業務邏輯分開提交',
          'Merge conflict 只在兩個人同時 push 時發生',
          '使用 git pull 而非 git fetch 可以避免衝突',
        ],
        answer: 1,
        explanation: 'Conflict 的技術條件：Git 自動能解決的情況：同一檔案不同位置的修改（自動三方合併 three-way merge）；加入不同的新行；刪除不同的行。無法自動解決（產生 conflict）：兩個分支都修改了同一行；一個分支刪除了某行而另一個分支修改了該行；二進位檔案（圖片、PDF）的衝突。預防策略：使用 trunk-based development（短命分支）、每天 rebase/merge main、模組化程式碼（降低耦合，不同人負責不同模組）。',
      },
      {
        order: 3,
        question: '執行 git pull 後發生衝突，如何放棄這次 merge 並回到 pull 前的狀態？',
        options: [
          'git pull --abort 放棄',
          'git merge --abort（若 git pull 內部執行的是 merge）或 git rebase --abort（若用 git pull --rebase），讓工作區回到 pull 前的乾淨狀態，讓你可以重新決定如何處理衝突',
          'git reset HEAD 回到 pull 前',
          'git checkout . 放棄所有衝突',
        ],
        answer: 1,
        explanation: 'git pull 底層是 fetch + merge（或 fetch + rebase），因此：若 git pull 使用 merge（預設）產生衝突 → git merge --abort；若 git pull --rebase 產生衝突 → git rebase --abort。在解決衝突時若想暫時查看兩個版本：git checkout --ours filename（保留當前分支版本）；git checkout --theirs filename（保留被合併分支版本）。完整解決後 git add 再 git merge --continue（或 git rebase --continue）。',
      },
      {
        order: 4,
        question: '如何找到某段程式碼最後是被誰、在哪個 commit 修改的？',
        options: [
          'git log 搜尋關鍵字',
          'git blame filename：逐行顯示每行最後一次修改的 commit hash、作者、日期、行號和內容。git blame -L 10,20 filename 只顯示第 10-20 行。搭配 git show <commit-hash> 查看該 commit 的完整內容',
          'git diff --author 搜尋',
          'git log --grep 可以找到任何修改',
        ],
        answer: 1,
        explanation: 'git blame 是 Code Review 和 Debug 的重要工具，讓你知道「這行程式碼是誰在什麼時候為了什麼加的」。VSCode 的 GitLens 擴充套件讓 blame 資訊直接顯示在每行旁邊（inline）。Git blame 的限制：只顯示「最後一次」修改這行的 commit，若一行被重構移動過，blame 會顯示移動操作而非原始作者。解法：git log -p --follow filename 追蹤檔案的完整歷史（包含重命名）。git log -S "searchString"（Pickaxe）搜尋某個字串在歷史中的新增/刪除記錄。',
      },
      {
        order: 5,
        question: '如何把某個大型的 commit 分拆成多個小 commit？',
        options: [
          'Git 不支援分拆 commit，只能重新手動建立',
          '方法一（針對最新 commit）：git reset HEAD~1（--mixed，預設）→ 改動回到 Working Tree → 多次選擇性 git add -p 和 git commit 分批提交。方法二（針對歷史 commit）：git rebase -i HEAD~N → 把目標 commit 標記為 edit → git reset HEAD~1 → 分批 add 和 commit → git rebase --continue',
          'git commit --split 分拆 commit',
          'git cherry-pick --split 可以分拆 commit',
        ],
        answer: 1,
        explanation: '分拆 commit 的詳細步驟（使用 interactive rebase）：1) git rebase -i HEAD~3（若要分拆第 2 個 commit）；2) 在編輯器中把目標 commit 的 pick 改為 edit，儲存退出；3) Git 停在那個 commit，執行 git reset HEAD~1（把 commit 的改動 unstage）；4) 現在改動在 Working Tree，用 git add -p 選擇第一部分 → git commit -m "part 1"；5) 再 add 第二部分 → git commit -m "part 2"；6) git rebase --continue（繼續 rebase 後續的 commit）。',
      },
    ],
  },

  {
    slug: 'git-workflow',
    title: 'Git 工作流程與 PR 最佳實踐',
    description: '了解 Git Flow、GitHub Flow、Trunk-based Development 的差異，以及 Pull Request 的最佳實踐和 commit message 規範。',
    difficulty: 'medium',
    subCategory: '協作工作流程',
    questions: [
      {
        order: 1,
        question: 'Git Flow 的主要分支結構是什麼？適合什麼類型的團隊？',
        options: [
          'Git Flow 只有 main 和 dev 兩個分支',
          'Git Flow 有五種分支：main（生產環境，永遠穩定）、develop（開發主線）、feature/xxx（新功能，從 develop 分出合回 develop）、release/x.x（發布準備，從 develop 分出，合回 main 和 develop）、hotfix/xxx（緊急修復，從 main 分出，合回 main 和 develop）。適合：有明確版本發布計畫的團隊、多個版本並行維護的產品',
          'Git Flow 的所有分支都會推送到遠端',
          'Git Flow 只有一個 main 分支，其他都是臨時的',
        ],
        answer: 1,
        explanation: 'Git Flow 的優缺點：優點：分支職責清晰，同時支援多版本維護，適合有計畫版本發布的軟體；缺點：複雜（5種分支），合併頻繁（feature→develop→release→main），CI/CD 整合較複雜，不適合持續部署。適合場景：傳統桌面應用、需要維護 v1.x 和 v2.x 同時存在的 API、有固定 Sprint/Release Cycle 的團隊。不適合：持續部署的 Web 應用、小團隊、快速迭代的 SaaS 產品。',
      },
      {
        order: 2,
        question: 'GitHub Flow 和 Git Flow 的主要差別是什麼？',
        options: [
          'GitHub Flow 是 Git Flow 的新版本，功能完全相同',
          'GitHub Flow 極簡：只有 main 分支（永遠可部署）+ 功能分支（feature）。流程：從 main 建立功能分支 → 開發 → 推送分支 → 開 PR → Code Review → merge 到 main → 立即部署。比 Git Flow 簡單很多，適合持續部署的 Web 應用和小團隊',
          'GitHub Flow 需要付費的 GitHub Pro 才能使用',
          'GitHub Flow 只有一個分支，所有人都直接在 main 提交',
        ],
        answer: 1,
        explanation: 'GitHub Flow 的核心假設：main 永遠是可部署的，merge 到 main 就代表要部署。適合持續交付（CD）的團隊，每天多次部署。GitHub Flow 的流程：1) git checkout -b feature/login main；2) 開發，定期 push 到遠端；3) 開 Pull Request（可以在開發中先開 Draft PR）；4) Code Review + CI 通過；5) Merge 到 main；6) 自動部署（CI/CD）。Trunk-based Development 更極端：所有人都在同一個 trunk（main）上工作，功能分支生命週期 < 1 天，靠 Feature Flags 控制未完成功能的可見性。',
      },
      {
        order: 3,
        question: 'Conventional Commits 規範的 commit message 格式是什麼？為什麼要遵守這個規範？',
        options: [
          'Commit message 沒有規範，只要清楚說明改了什麼就好',
          'Conventional Commits 格式：<type>(<scope>): <description>。常見 type：feat（新功能）、fix（修 bug）、docs（文件）、style（格式）、refactor（重構）、test（測試）、chore（維護）。例：feat(auth): add Google OAuth login。好處：自動產生 CHANGELOG、語義化版本自動判斷（feat→次版本，fix→修訂版）、清楚的 git log',
          'Conventional Commits 讓 git commit 執行更快',
          'Conventional Commits 只在使用 GitHub 時有效',
        ],
        answer: 1,
        explanation: 'Conventional Commits 的實際好處：1) 自動化 CHANGELOG：根據 commit type 分類，feat 進 Features、fix 進 Bug Fixes；2) 自動版本號：standard-version 或 semantic-release 根據 commit type 自動決定 patch/minor/major 版本；3) 清晰的 git log：一眼看出每個 commit 的性質；4) CI 過濾：只在 feat/fix 的 commit 上觸發特定 CI 步驟。工具：commitlint 驗證格式（搭配 husky pre-commit hook）、Commitizen（互動式建立符合規範的 commit）。BREAKING CHANGE 在 footer 標記，表示不向後相容的改動，觸發 major 版本升級。',
      },
      {
        order: 4,
        question: '一個好的 Pull Request 應該具備哪些特點？',
        options: [
          'PR 越大越好，一次解決所有問題',
          '好的 PR：1) 範圍小而聚焦（單一目的，容易 review）；2) 清楚的 PR 描述（做了什麼、為什麼、如何測試）；3) 包含相關 issue 連結；4) 自我 review（先自己看一遍再送 review）；5) 有完整的測試；6) 沒有無關的改動混入；7) commit 歷史整潔（互動式 rebase 清理）',
          'PR 必須等所有測試通過才能開',
          'PR 只要有任何改動就應該立即 merge，不需要等 review',
        ],
        answer: 1,
        explanation: '好 PR 的實踐：小型 PR 好在哪：Review 時間短（大 PR 容易 review 疲勞，漏看問題）、更快 merge（不會拖延整個 feature）、衝突更少（差異小）。Draft PR 的用途：開發過程中先開 Draft PR，讓隊友知道你在做什麼、提早發現方向問題、CI 提早跑測試。PR 描述模板（常見結構）：「## Summary（做了什麼）」、「## Motivation（為什麼）」、「## Test Plan（如何驗證）」、「## Screenshots（UI 改動）」。Review 文化：建設性的評論、區分 blocker 和 suggestion、及時 review（不要讓 PR 等超過 1 天）。',
      },
      {
        order: 5,
        question: 'GitHub 的三種 PR Merge 策略（Merge commit、Squash and merge、Rebase and merge）各有什麼特點？',
        options: [
          '三種策略效果完全相同，只是介面不同',
          'Merge commit（Create a merge commit）：保留所有 commit 歷史 + 建立 merge commit，歷史有分叉；Squash and merge：把 PR 的所有 commit 壓成一個，main 保持線性且每個 commit 對應一個 PR，歷史最整潔；Rebase and merge：把 PR 的 commit 逐一 rebase 到 main，線性歷史但保留所有 commit（適合 commit 已整理好的情況）',
          'Squash and merge 會刪除 PR 分支的所有 commit',
          'Rebase and merge 不支援有衝突的 PR',
        ],
        answer: 1,
        explanation: '團隊選擇建議：Squash and merge（最流行）→ 簡潔的 main 歷史，每個 feature 一個 commit，git log 清晰；適合大多數 Web 應用團隊。Merge commit → 需要保留完整開發歷史的場合；缺點是 git log 混亂。Rebase and merge → commit 歷史已整理（interactive rebase 過）且想保留每個 commit 的場合；需要開發者維護整潔的 commit 歷史。無論哪種策略，團隊應統一使用一種，避免 main 分支歷史混亂。搭配 Conventional Commits 讓自動 CHANGELOG 更有效。',
      },
    ],
  },
]

async function seed() {
  console.log(`\n新增 ${topics.length} 個 Git 主題及題目（Topics 5–8）...`)
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

  console.log('\n✅ Git Topics 5–8 建立完成')
  process.exit(0)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
