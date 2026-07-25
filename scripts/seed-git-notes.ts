import { config } from 'dotenv'
config({ path: '.env.local' })
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from '../lib/db/schema'
import { eq } from 'drizzle-orm'

const client = neon(process.env.DATABASE_URL!)
const db = drizzle(client, { schema })

const notes: { slug: string; sections: { heading: string; content: string }[] }[] = [
  {
    slug: 'git-basics',
    sections: [
      {
        heading: 'Git 三個工作區域',
        content: `Git 的工作流程分為三個區域：

**Working Tree（工作目錄）**：你實際編輯的檔案所在位置，修改都在這裡發生。

**Staging Area / Index（暫存區）**：用 \`git add\` 將變更放到暫存區，這裡決定下一個 commit 要包含什麼內容。

**Repository（儲存庫）**：用 \`git commit\` 將暫存區的內容永久記錄到歷史中。

\`\`\`
Working Tree  →（git add）→  Staging Area  →（git commit）→  Repository
\`\`\`

**為什麼需要兩步驟？**
兩步驟讓你能精確控制 commit 的內容。例如你修改了 A、B、C 三個檔案，但只想將 A 和 B 放進這次 commit，就可以只 \`add\` A 和 B。

**git add -p（交互式暫存）**

\`\`\`bash
git add -p            # 逐個 hunk 詢問是否要 stage
# 常用回應：y（是）、n（否）、s（拆分更小的 hunk）、e（手動編輯）
\`\`\`

這在同一個檔案中有多個不相關的修改時非常有用，可以將不同邏輯的改動分成不同 commit。`,
      },
      {
        heading: 'git diff 的三種用法',
        content: `\`\`\`bash
git diff              # Working Tree vs Staging Area（未 stage 的改動）
git diff --staged     # Staging Area vs HEAD（已 stage 但未 commit 的改動）
git diff HEAD         # Working Tree vs HEAD（全部未 commit 的改動）
\`\`\`

**commit 前確認改動的流程：**

\`\`\`bash
# 1. 確認工作目錄有哪些改動尚未 stage
git diff

# 2. 將想要的改動放入暫存區
git add src/feature.ts

# 3. 確認暫存區的內容是否正確
git diff --staged

# 4. commit
git commit -m "feat: add feature"
\`\`\`

| 指令 | 比較範圍 | 常用時機 |
|------|----------|----------|
| \`git diff\` | Working Tree vs Staging | 確認還沒 stage 的改動 |
| \`git diff --staged\` | Staging vs HEAD | commit 前最後確認 |
| \`git diff HEAD\` | Working Tree vs HEAD | 查看所有未 commit 的改動 |`,
      },
      {
        heading: '.gitignore 規則與 git log 常用選項',
        content: `**.gitignore 語法規則：**

\`\`\`
node_modules/     # / 結尾表示只匹配目錄
*.log             # * 匹配任意字元（不含 /）
**/*.test.js      # ** 跨目錄匹配
!important.log    # ! 開頭表示排除（不 ignore 這個檔案）
/dist             # / 開頭表示從根目錄開始匹配
\`\`\`

**注意**：已被 Git 追蹤的檔案即使加入 .gitignore 也不會停止追蹤，需要先執行：

\`\`\`bash
git rm --cached <file>    # 從追蹤清單移除（不刪除本地檔案）
\`\`\`

常見應 ignore 的項目：\`node_modules/\`、\`.env\`、\`dist/\`、\`*.log\`、\`.DS_Store\`

**git log 常用選項：**

\`\`\`bash
git log --oneline --graph --all    # 一行顯示 + 圖形化分支 + 所有分支

# 過濾選項
git log --author="Alice"           # 指定作者
git log --since="2024-01-01"       # 指定時間範圍
git log --grep="fix"               # 搜尋 commit 訊息
git log -S "functionName"          # 搜尋程式碼新增/刪除（Pickaxe）
git log --follow src/utils.ts      # 追蹤含重命名的完整歷史
\`\`\``,
      },
    ],
  },
  {
    slug: 'git-remote',
    sections: [
      {
        heading: 'fetch vs pull vs push',
        content: `**git fetch**：只下載遠端的最新資料到本地的遠端追蹤分支（\`origin/main\`），**不會**修改你的工作目錄或本地分支。

**git pull**：相當於 \`git fetch\` + \`git merge\`（預設）。

\`\`\`bash
git fetch origin              # 下載遠端更新
git log origin/main..HEAD     # 比較差異
git merge origin/main         # 確認無誤後再合併

# 等效於以上三步的簡化做法
git pull origin main
\`\`\`

**何時選 fetch + 手動 merge？**
在重要功能開發中，建議先 fetch 再檢視差異，避免意外的 auto-merge 衝突打斷工作流程。

**git push -u（建立 tracking branch）**

\`\`\`bash
git push -u origin feature/login
# -u / --set-upstream 讓本地分支追蹤遠端分支
# 之後只需要 git push / git pull 即可，不用指定 remote 和分支名
\`\`\``,
      },
      {
        heading: '遠端管理與 fork workflow',
        content: `**git remote 常用命令：**

\`\`\`bash
git remote -v                          # 列出所有遠端及 URL
git remote add upstream <url>          # 新增遠端
git remote remove upstream             # 移除遠端
git remote set-url origin <new-url>    # 修改遠端 URL
git remote rename origin old           # 重命名遠端
\`\`\`

**fork vs clone 的差別：**
- \`clone\`：直接在本地複製一個 repository
- \`fork\`：在 GitHub 上建立一個屬於你的副本，適合貢獻沒有寫入權限的開源專案

**開源貢獻的 fork workflow：**

\`\`\`bash
# 1. 在 GitHub fork 原始 repo
# 2. clone 你的 fork
git clone https://github.com/你的帳號/專案.git

# 3. 新增上游遠端
git remote add upstream https://github.com/原始作者/專案.git

# 4. 開發
git checkout -b feature/my-fix
# ... 修改、commit ...

# 5. 保持與上游同步
git fetch upstream
git rebase upstream/main

# 6. 推送並開 PR
git push origin feature/my-fix
\`\`\``,
      },
      {
        heading: 'force push 安全指南',
        content: `**git push --force 的危險性**

force push 會覆蓋遠端歷史，如果有其他人已基於被覆蓋的 commit 開發，他們的歷史將與遠端分叉，造成嚴重混亂。

**--force-with-lease（更安全的替代方案）**

\`\`\`bash
git push --force-with-lease origin feature/my-branch
\`\`\`

只有在你上次 fetch 後遠端**沒有新 commit** 的情況下才允許 push。若有人在你不知情的狀況下推送了新 commit，這個指令會**拒絕**你的 force push 並提示你先拉取。

**規則總結：**

| 情況 | 做法 |
|------|------|
| 個人功能分支、還沒有人基於它開發 | 可以 force push（建議用 --force-with-lease） |
| 已有他人基於此分支開發 | 禁止 force push |
| main / master / release 分支 | **絕對禁止** force push |

\`\`\`bash
# 常見需要 force push 的場景：rebase 後或修改 commit 歷史後
git rebase -i HEAD~3
git push --force-with-lease origin feature/my-branch
\`\`\``,
      },
    ],
  },
  {
    slug: 'git-branch-merge',
    sections: [
      {
        heading: 'Merge 三種模式',
        content: `**1. Fast-forward（預設，線性移動）**

當目標分支是當前分支的直接後代時，Git 直接移動指標，不建立 merge commit。

\`\`\`bash
git merge feature/login       # 預設 fast-forward
# git log 看起來是一條直線，看不出曾經有分支
\`\`\`

**2. --no-ff（強制建立 merge commit）**

即使可以 fast-forward，也強制建立一個 merge commit，保留分支歷史。

\`\`\`bash
git merge --no-ff feature/login
# git log 會顯示分叉合併的節點，清楚看出功能分支的存在
\`\`\`

**3. --squash（壓縮合併）**

將分支上所有 commit 壓縮成一個 staged 狀態，需要手動 commit。

\`\`\`bash
git merge --squash feature/login
git commit -m "feat: add login feature"
# 分支的多個 WIP commit 被合併成一個乾淨的 commit
\`\`\`

| 模式 | Merge commit | git log 視覺 | 適用場景 |
|------|-------------|-------------|----------|
| fast-forward | 無 | 線性 | 個人小分支 |
| --no-ff | 有 | 分叉 | 團隊功能分支，要保留分支歷史 |
| --squash | 無（手動 commit） | 線性 | 整理 WIP commit，保持 main 整潔 |`,
      },
      {
        heading: 'HEAD 與 detached HEAD',
        content: `**HEAD** 是 Git 中指向「當前位置」的特殊指標，通常指向一個**分支名稱**（而非直接指向 commit）。

\`\`\`
HEAD → main → commit abc123
\`\`\`

當你切換分支時，HEAD 跟著移動：

\`\`\`bash
git switch feature/login
# HEAD → feature/login → commit def456
\`\`\`

**Detached HEAD（游離 HEAD）**

當 HEAD 直接指向一個 commit hash 而非分支時，就進入 detached HEAD 狀態。

\`\`\`bash
git checkout abc123          # 觸發 detached HEAD
git log --oneline            # HEAD 直接顯示 commit hash

# ⚠️ 危險：在此狀態建立的 commit 沒有分支指向它
# 一旦離開，這些 commit 可能被 Git GC（垃圾回收）清除
\`\`\`

**如何在 detached HEAD 狀態保存工作：**

\`\`\`bash
# 方法一：建立新分支
git switch -c my-experiment

# 方法二：切換後從 reflog 找回
git reflog                   # 找到遺失的 commit hash
git switch -c recover-branch <hash>
\`\`\``,
      },
      {
        heading: '分支操作與 merge 撤銷',
        content: `**分支操作：**

\`\`\`bash
# 建立並切換（現代語法，推薦）
git switch -c feature/login

# 刪除分支
git branch -d feature/login    # 安全刪除（只有當分支已合併才能刪）
git branch -D feature/login    # 強制刪除（未合併也能刪，注意會遺失 commit）

# 刪除遠端分支
git push origin --delete feature/login
\`\`\`

**Merge 後撤銷（三種情況）：**

\`\`\`bash
# 情況一：合併時發生衝突，想放棄合併
git merge --abort

# 情況二：合併後尚未 push，後悔了
git reset --hard ORIG_HEAD    # ORIG_HEAD 自動記錄 merge 前的位置

# 情況三：合併後已 push 到共享分支，不能改寫歷史
git revert -m 1 HEAD          # -m 1 指定保留哪個父分支（1 = 當前分支）
# 這會建立一個新的「撤銷 commit」，安全地還原改動
\`\`\``,
      },
    ],
  },
  {
    slug: 'git-rebase',
    sections: [
      {
        heading: 'Rebase 工作原理',
        content: `Rebase 的本質是「**重播 commit**」，而非合併。

**詳細步驟：**
1. 找到當前分支與目標分支的**共同祖先**
2. 暫存當前分支在祖先之後的所有 commit（計算 diff patch）
3. 將 HEAD 移動到目標分支的最新 commit
4. 逐一將暫存的 commit **重播**到新的基底上

\`\`\`bash
# feature 分支 rebase 到 main 的最新狀態
git switch feature/login
git rebase main
\`\`\`

**為什麼 commit hash 會改變？**

Hash 是根據 commit 內容（包含父 commit hash）計算的，rebase 後父 commit 改變了，所以即使程式碼相同，hash 也會不同。

**視覺差異：**

\`\`\`
Merge 結果（分叉）：
    A---B---C  (main)
         \\
          D---E  (feature) + merge commit M

Rebase 結果（線性）：
    A---B---C---D'---E'  (feature 接在 main 後面)
\`\`\``,
      },
      {
        heading: 'Interactive Rebase 操作指南',
        content: `**啟動 Interactive Rebase：**

\`\`\`bash
git rebase -i HEAD~3    # 互動式修改最近 3 個 commit
git rebase -i main      # 互動式修改從 main 分叉後的所有 commit
\`\`\`

**各指令說明：**

| 指令 | 縮寫 | 作用 |
|------|------|------|
| pick | p | 保留此 commit（不做任何變更） |
| squash | s | 合併到上一個 commit，保留訊息 |
| fixup | f | 合併到上一個 commit，**丟棄**此 commit 的訊息 |
| reword | r | 保留 commit，但修改訊息 |
| edit | e | 暫停，讓你修改此 commit 的內容 |
| drop | d | 刪除此 commit |

**常見使用場景：**

\`\`\`bash
# 1. 合併多個 WIP commit
pick abc1234 feat: add login page
squash def5678 wip: fix typo
squash ghi9012 wip: adjust styles

# 2. 刪除錯誤 commit（例如不小心 commit 了 .env）
drop bad1234 accidentally added .env

# 3. 修改舊 commit 的訊息
reword old1234 fix: correct function name
\`\`\`

操作完成後儲存離開編輯器，Git 會逐步執行。`,
      },
      {
        heading: 'Rebase 衝突處理與黃金準則',
        content: `**Rebase 衝突處理流程：**

\`\`\`bash
# 衝突發生時
git status              # 查看哪些檔案衝突
# 手動編輯衝突檔案，解決衝突
git add <resolved-file>
git rebase --continue   # 繼續 rebase

# 想放棄整個 rebase
git rebase --abort
\`\`\`

**與 merge 衝突的差別：**
- Merge 衝突只需解決一次
- Rebase 衝突可能需要逐 commit 解決（每個重播的 commit 都可能衝突）

**黃金準則：不能 rebase 公共分支**

\`\`\`
❌ 錯誤做法：
git switch main
git rebase feature/login    # 千萬不要 rebase main！

✅ 正確做法：
git switch feature/login
git rebase main             # feature 分支 rebase 到 main
\`\`\`

原因：rebase 會改變 commit hash。如果 A 和 B 都在 main 開發，A 對 main 做了 rebase，B 的本地 main 就與遠端歷史分叉，產生難以解決的混亂。

**git pull --rebase（保持線性歷史）：**

\`\`\`bash
git pull --rebase origin main
# 等效於 fetch + rebase，不產生多餘的 merge commit
\`\`\``,
      },
    ],
  },
  {
    slug: 'git-reset-revert',
    sections: [
      {
        heading: 'git reset 三種模式',
        content: `\`git reset\` 移動 HEAD（和分支指標）到指定的 commit，三種模式決定 Staging Area 和 Working Tree 如何處理。

| 模式 | HEAD | Staging Area | Working Tree | 使用場景 |
|------|------|-------------|-------------|----------|
| \`--soft\` | 移動 | 不動（保留 staged）| 不動 | 合併最近幾個 commit |
| \`--mixed\`（預設）| 移動 | 清空（unstage）| 不動 | 撤銷 stage，保留修改 |
| \`--hard\` | 移動 | 清空 | 清空（改動消失）| 徹底回滾，丟棄所有改動 |

\`\`\`bash
git reset --soft HEAD~1     # 撤銷 commit，改動仍在 staging area
git reset HEAD~1            # 撤銷 commit，改動回到 working tree
git reset --hard HEAD~1     # 撤銷 commit，改動**徹底刪除**（⚠️ 不可逆）

# ORIG_HEAD：記錄危險操作前的位置
git reset --hard ORIG_HEAD  # reset / merge / rebase 前的快速回退
\`\`\`

**合併最近 3 個 commit（常見用法）：**

\`\`\`bash
git reset --soft HEAD~3
git commit -m "feat: consolidated feature commits"
\`\`\``,
      },
      {
        heading: 'reset vs revert 選擇指南',
        content: `**核心差別：**

| | git reset | git revert |
|-|-----------|------------|
| 機制 | 移動 HEAD，改寫歷史 | 建立新 commit 撤銷改動 |
| 歷史 | 歷史被修改 | 歷史保留 |
| 適用 | 本地未推送的 commit | 已推送到共享分支的 commit |
| 安全性 | 可能影響他人 | 安全 |

\`\`\`bash
# reset（本地使用）
git reset --hard HEAD~2     # 回到兩個 commit 前，歷史消失

# revert（共享分支使用）
git revert HEAD             # 建立一個新 commit 來撤銷 HEAD 的改動
git revert HEAD~2..HEAD     # 撤銷範圍內的多個 commit
\`\`\`

**撤銷 merge commit 的特殊語法：**

\`\`\`bash
git revert -m 1 <merge-commit-hash>
# -m 1 表示「以第一個父 commit（merge 前的主分支）為基準」
# merge commit 有兩個父 commit，必須指定保留哪一邊
\`\`\``,
      },
      {
        heading: 'stash 與 cherry-pick',
        content: `**git stash（臨時儲存工作）：**

\`\`\`bash
git stash                   # 儲存目前改動（working tree + staging area）
git stash -u                # 含 untracked 檔案一起儲存
git stash list              # 列出所有 stash
git stash pop               # 恢復最新 stash 並刪除它
git stash apply stash@{1}   # 恢復指定 stash（不刪除）
git stash drop stash@{0}    # 刪除指定 stash
\`\`\`

常見組合：

\`\`\`bash
# 臨時切換分支處理緊急 bug
git stash
git switch hotfix/urgent
# 修完後
git switch feature/my-work
git stash pop
\`\`\`

**git cherry-pick（移植特定 commit）：**

\`\`\`bash
git cherry-pick <commit-hash>          # 移植單一 commit
git cherry-pick A..B                   # 移植 A 之後到 B 的所有 commit（不含 A）
git cherry-pick A^..B                  # 移植 A 到 B（含 A）

# 衝突時
git cherry-pick --continue             # 解決衝突後繼續
git cherry-pick --abort                # 放棄整個 cherry-pick
\`\`\`

**常見場景：**

\`\`\`bash
# hotfix 移植到多個版本分支
git switch release/v1.2
git cherry-pick fix/security-patch     # 從 main 移植修復
git switch release/v1.3
git cherry-pick fix/security-patch
\`\`\``,
      },
    ],
  },
  {
    slug: 'git-advanced',
    sections: [
      {
        heading: 'git reflog 恢復操作',
        content: `**reflog vs log 的差別：**

\`git log\` 只顯示當前分支可達的 commit 歷史，而 \`git reflog\` 記錄 **HEAD 的所有移動歷史**，包含 reset、rebase、switch 等操作，以及沒有分支指向的孤立 commit。

\`\`\`bash
git reflog                  # 查看 HEAD 的完整操作歷史
git reflog show feature/login   # 查看特定分支的 reflog
\`\`\`

**常見恢復場景：**

\`\`\`bash
# 情況一：git reset --hard 後悔
git reflog
# 找到 reset 前的 hash，例如 abc1234
git reset --hard abc1234

# 情況二：不小心刪除分支
git reflog                  # 找到刪除前的最後一個 commit hash
git switch -c recover-branch <hash>

# 情況三：rebase 搞砸了
git reflog
git reset --hard HEAD@{3}   # 回到 rebase 前的狀態
\`\`\`

**Reflog 的限制：**
- 預設保留 **90 天**（可設定 \`gc.reflogExpire\`）
- 只存在於本地，不會 push 到遠端

\`\`\`bash
# ORIG_HEAD：merge、rebase、reset 前的快捷指標
git reset --hard ORIG_HEAD   # 比查 reflog 更快
\`\`\``,
      },
      {
        heading: 'git bisect 二分搜尋 Bug',
        content: `bisect 使用**二分搜尋**在 commit 歷史中快速定位引入 bug 的 commit。

**效率：** 1000 個 commit 只需約 log₂(1000) ≈ **10 次**測試即可定位。

**手動流程：**

\`\`\`bash
git bisect start            # 開始 bisect
git bisect bad              # 標記當前 commit 是壞的
git bisect good v1.0.0      # 標記某個已知正常的 commit 或 tag

# Git 自動 checkout 中間點，你進行測試後標記
git bisect good             # 這個 commit 正常
git bisect bad              # 這個 commit 有問題

# 重複直到 Git 找出第一個壞的 commit
# 結束後記得重置
git bisect reset
\`\`\`

**自動化流程（推薦）：**

\`\`\`bash
git bisect start
git bisect bad HEAD
git bisect good v1.0.0

# 用測試腳本自動標記（腳本 exit 0 = good，exit 非0 = bad）
git bisect run npm test
# 或
git bisect run sh -c "node test.js | grep 'PASS'"

git bisect reset            # 完成後恢復原本狀態
\`\`\``,
      },
      {
        heading: 'git tag 與 git hooks',
        content: `**Lightweight tag vs Annotated tag：**

\`\`\`bash
# Lightweight tag（輕量標籤）：只是一個 commit 的指標
git tag v1.0.0

# Annotated tag（附註標籤，推薦）：包含作者、日期、訊息的完整物件
git tag -a v1.0.0 -m "Release version 1.0.0"

# 查看與推送
git tag                          # 列出所有 tag
git show v1.0.0                  # 查看 tag 詳情
git push origin v1.0.0           # 推送單一 tag（tag 不自動 push）
git push origin --tags           # 推送所有 tag
git push origin --delete v1.0.0  # 刪除遠端 tag
git tag -d v1.0.0                # 刪除本地 tag
\`\`\`

**Git Hooks：**

Hooks 放在 \`.git/hooks/\` 目錄，是特定 Git 操作前後自動執行的腳本。

\`\`\`bash
# 常用 hooks
pre-commit      # commit 前執行（可用於 lint、format 檢查）
commit-msg      # 驗證 commit 訊息格式
pre-push        # push 前執行（可用於跑測試）
\`\`\`

**使用 husky + lint-staged（推薦做法）：**

\`\`\`bash
npm install -D husky lint-staged
npx husky init

# .husky/pre-commit
npx lint-staged

# package.json
# "lint-staged": {
#   "*.{ts,tsx}": ["eslint --fix", "prettier --write"]
# }
\`\`\``,
      },
    ],
  },
  {
    slug: 'git-conflict',
    sections: [
      {
        heading: '衝突標記解讀與解決流程',
        content: `**衝突標記的含義：**

\`\`\`
<<<<<<< HEAD
當前分支的版本（你的改動）
=======
被合併分支的版本（他人的改動）
>>>>>>> feature/login
\`\`\`

**完整解決流程：**

1. 執行 \`git status\` 查看所有衝突檔案
2. 開啟衝突檔案，閱讀兩個版本的差異
3. 決定保留哪個版本（或手動合併兩者）
4. 刪除所有衝突標記（\`<<<<<<<\`、\`=======\`、\`>>>>>>>\`）
5. 儲存檔案
6. 標記為已解決並繼續

\`\`\`bash
git add <resolved-file>
git commit                  # merge 衝突解決後
# 或
git rebase --continue       # rebase 衝突解決後
\`\`\`

**VSCode 快捷操作：**

衝突檔案上方會出現按鈕：
- **Accept Current Change**：保留 HEAD（當前分支）版本
- **Accept Incoming Change**：保留被合併分支的版本
- **Accept Both Changes**：兩個版本都保留（上下排列）
- **Compare Changes**：開啟 diff 視圖比較`,
      },
      {
        heading: '衝突的發生條件與預防',
        content: `**Git 能自動解決（不衝突）：**
- 兩個人修改了**不同的檔案**
- 兩個人修改了同一檔案的**不同行**

**會產生衝突的情況：**
- 兩個人修改了同一檔案的**同一行**
- 一個人修改了某行，另一個人**刪除了整個檔案**
- 兩個人同時新增了同名檔案但內容不同
- **二進位檔案**（圖片、PDF）發生修改，Git 無法自動合併

**預防策略：**
- 保持功能分支**小而短命**（幾天內合併，不要拖很久）
- 頻繁同步主分支（每天 \`git pull --rebase\` 或 \`git fetch + rebase\`）
- 團隊之間**模組化分工**，減少同時修改相同檔案的機率
- 使用 \`.editorconfig\` 統一格式設定，避免格式衝突

**快速取一方版本（跳過手動編輯）：**

\`\`\`bash
git checkout --ours <file>      # 保留當前分支版本（HEAD）
git checkout --theirs <file>    # 保留被合併分支版本

git add <file>
\`\`\``,
      },
      {
        heading: 'git blame 與 git log 追蹤',
        content: `**git blame（逐行追蹤修改者）：**

\`\`\`bash
git blame src/utils.ts          # 每一行顯示最後修改的 commit、作者、時間
git blame -L 10,20 src/utils.ts # 只顯示第 10-20 行
\`\`\`

VSCode 搭配 **GitLens** 可以直接在編輯器看 inline blame，hover 查看 commit 詳情。

**git log 追蹤檔案歷史：**

\`\`\`bash
git log -p src/utils.ts         # 顯示每個 commit 的 diff
git log --follow src/utils.ts   # 含重命名的完整歷史（不加 --follow 會在重命名時中斷）
git log -S "functionName"       # Pickaxe：搜尋某字串被新增/刪除的 commit
\`\`\`

**大型 commit 分拆步驟（commit 包含不相關的改動）：**

\`\`\`bash
# 步驟一：撤銷最後一個 commit，但保留改動在 working tree
git reset HEAD~1

# 步驟二：交互式分批 stage
git add -p src/feature-a.ts    # 只 stage 功能 A 的改動
git commit -m "feat: add feature A"

git add -p src/feature-b.ts    # 再 stage 功能 B 的改動
git commit -m "feat: add feature B"
\`\`\``,
      },
    ],
  },
  {
    slug: 'git-workflow',
    sections: [
      {
        heading: 'Git Flow vs GitHub Flow vs Trunk-based',
        content: `| | Git Flow | GitHub Flow | Trunk-based Development |
|---|---|---|---|
| **分支結構** | main、develop、feature、release、hotfix（5種） | main + 功能分支 | 主要在 main，短期功能分支 |
| **適合規模** | 中大型團隊、版本化產品 | 中小型團隊 | 成熟 DevOps 團隊 |
| **部署頻率** | 定期版本發布 | 持續部署（每次 merge 即部署） | 多次/天 |
| **複雜度** | 高（需嚴格分支管理） | 低 | 低（需 Feature Flags） |
| **特點** | 清晰的版本控制、支援多版本並行維護 | 簡單、快速 | 需要 Feature Flags 隔離未完成功能 |

**Git Flow 適用情境：** 行動 App、有明確版本號的套件（需同時維護 v1.x 和 v2.x）

**GitHub Flow 適用情境：** 持續交付的 Web 產品，不需維護多版本

**Trunk-based 適用情境：** 高頻部署、有完善 CI/CD 和測試覆蓋率的成熟團隊

**Feature Flags 概念（Trunk-based 必備）：**

\`\`\`js
if (featureFlags.isEnabled('new-checkout-flow')) {
  return <NewCheckout />
}
return <OldCheckout />
\`\`\`

未完成的功能 merge 進 main 但用 flag 關閉，可以隨時上線/關閉而不需要 revert。`,
      },
      {
        heading: 'Conventional Commits 與 PR 最佳實踐',
        content: `**Conventional Commits 格式：**

\`\`\`
type(scope): description

[optional body]

[optional footer]
\`\`\`

**常見 type：**

| type | 用途 |
|------|------|
| feat | 新功能 |
| fix | 修復 bug |
| docs | 文件更新 |
| style | 格式調整（不影響邏輯） |
| refactor | 重構（非新功能、非 bug 修復） |
| test | 新增或修改測試 |
| chore | 建構工具、依賴更新等 |

**實際範例：**

\`\`\`
feat(auth): add Google OAuth login
fix(cart): correct total price calculation when discount applied
docs: update API authentication guide
refactor(user): extract profile validation to separate module

# BREAKING CHANGE（重大不相容變更）
feat(api)!: change user endpoint response format

BREAKING CHANGE: user.name is now split into user.firstName and user.lastName
\`\`\`

**好 PR 的特點：**
- 小而聚焦（單一目的，易於 review）
- 清楚的標題和描述（說明做了什麼、為什麼）
- 自我 review 後再發出
- 使用 Draft PR 在開發中獲取早期反饋

**commitlint + husky 自動驗證：**

\`\`\`bash
npm install -D @commitlint/cli @commitlint/config-conventional
echo "export default { extends: ['@commitlint/config-conventional'] }" > commitlint.config.js

# .husky/commit-msg
npx --no -- commitlint --edit $1
\`\`\``,
      },
      {
        heading: 'PR Merge 策略選擇',
        content: `GitHub 提供三種 merge 策略，每種對 git log 的影響不同：

| 策略 | 機制 | git log 結果 | 適用場景 |
|------|------|------------|----------|
| **Merge commit** | 建立一個 merge commit | 保留所有歷史 + 分叉節點 | 需要完整保留分支歷史 |
| **Squash and merge** | 將 PR 所有 commit 壓縮成 1 個 | main 最整潔，每個 PR 一個 commit | main 分支歷史整潔優先 |
| **Rebase and merge** | 逐一重播 commit（線性） | 保留所有 commit，但線性排列 | 想保留詳細 commit 且不要分叉 |

**各策略詳細說明：**

\`\`\`
Merge commit：
main:  A---B-----------M  (M = merge commit)
              \\       /
feature:       C---D---E

Squash and merge：
main:  A---B---CDE  (C+D+E 壓縮成一個 commit)

Rebase and merge：
main:  A---B---C'---D'---E'  (C、D、E 線性重播，hash 改變)
\`\`\`

**建議：**
- 團隊應**統一選擇一種策略**，避免 git log 混亂
- 搭配 Conventional Commits，Squash and merge 效果最好（每個 PR = 一個標準格式的 commit）
- 可在 GitHub Repository Settings > General 中限制只允許特定策略`,
      },
    ],
  },
]

async function seedNote(note: { slug: string; sections: { heading: string; content: string }[] }) {
  await db.delete(schema.topicNoteSections).where(eq(schema.topicNoteSections.slug, note.slug))

  for (let i = 0; i < note.sections.length; i++) {
    await db.insert(schema.topicNoteSections).values({
      slug: note.slug,
      heading: note.sections[i].heading,
      content: note.sections[i].content,
      order: i,
    })
  }
}

async function main() {
  for (const note of notes) {
    console.log(`處理 ${note.slug}...`)
    await seedNote(note)
    console.log(`✅ ${note.slug} 完成（${note.sections.length} 個章節）`)
  }
  console.log(`🎉 所有 Git 主題筆記新增完成`)
  process.exit(0)
}

main().catch(e => { console.error(e); process.exit(1) })
