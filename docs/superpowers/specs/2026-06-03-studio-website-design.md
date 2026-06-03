# 工作室網站設計規格

- **日期**：2026-06-03
- **狀態**：已核准設計，待寫實作計畫

## 目標

建立個人工作室網站，整合作品介紹、blog、關於與隱私權政策，並具備 tag 過濾與全文搜尋。內容以中文為主，架構為未來 i18n 與功能擴充預留空間。網站須維護成本低、純前端、可長期經營。

## 技術選型

| 項目 | 選擇 | 理由 |
|---|---|---|
| 框架 | Astro | 原生 Markdown/MDX、content collections、預設零 JS，最適合內容網站 |
| 部署 | Cloudflare Pages | 免費、CDN 快、git push 自動 build & deploy、未來可加邊緣函式 |
| 內容上稿 | 寫 Markdown 推 git | 對開發者最自然、免後台、免費 |
| 視覺風格 | 極簡編輯風 | 大留白、排版優先、內容為王、耐看 |
| 深色模式 | 支援切換並記住偏好 | 開發者受眾常見需求 |
| 流量分析 | Cloudflare Web Analytics | 匿名、免 cookie、隱私友善 |
| 留言 | Giscus（GitHub Discussions） | 免後端、免資料庫、與 GitHub 生態整合 |
| 搜尋 | Pagefind | build 後產生純前端全文索引，零後端、零成本 |

## 視覺設計（極簡編輯風）

設計 token 為起始基準，實作時可微調。

- **字體**：標題用襯線體（如 `Newsreader` / `Source Serif`），內文與 UI 用無襯線（如 `Inter` / 系統字體棧）；中文用 `Noto Sans TC`。襯線標題 + 無襯線內文是編輯風的核心對比。
- **色票**（淺色 / 深色）：
  - 背景：`#FAFAF8` / `#16161A`
  - 文字主色：`#1A1A1A` / `#EDEDED`
  - 次要文字：`#6B6B6B` / `#A1A1A1`
  - 強調色（連結 / 重點）：`#2D5BFF`（淺色）/ `#7AA2FF`（深色）
  - 分隔線 / 邊框：`#E5E3DE` / `#2A2A30`
- **間距系統**：8px 基準（4 / 8 / 16 / 24 / 32 / 48 / 64 / 96）。
- **排版**：內文行寬上限約 `68ch`、行高 1.6；大留白；以排版層級而非裝飾建立視覺層次。
- **元件原則**：扁平、無重陰影、無漸層；卡片以細邊框 + 留白區隔。

## 響應式 / 行動裝置

- **斷點**：mobile `< 640px`、tablet `640–1024px`、desktop `> 1024px`。
- **行動導覽**：漢堡選單 → 開啟為全螢幕或側邊 drawer；含深色切換。desktop 為水平導覽列。
- **觸控**：可點擊目標 ≥ 44px；卡片整塊可點。
- **作品 / 文章列表**：grid 隨斷點調整欄數（見下）。
- 圖片響應式（`srcset` / Astro `<Image>`）。

## 效能預算

- Lighthouse Performance / Best Practices / SEO 目標 > 95。
- 預設零 client-side JS；僅搜尋（Pagefind）、深色切換、tag 即時篩選、Giscus 採最小必要 JS 並延遲載入（Giscus 於進入留言區時才載入）。
- 字體用 `font-display: swap` 並自架 / preload 關鍵字重，避免 FOUT 過久。

## 網站結構（路由）

```
/                    首頁（精選作品 + 最新文章）
/productions         作品列表（手動策展卡片）
/productions/[slug]  單一作品說明頁（部分資訊 build 時抓 API）
/blog                文章列表第 1 頁（含 tag filter + 搜尋）
/blog/[page]         文章列表分頁（靜態分頁）
/blog/[slug]         單篇文章（含 Giscus 留言）
/blog/tags/[tag]     依 tag 過濾的文章列表（同樣靜態分頁）
/about               關於
/privacy             隱私權政策
404                  找不到頁面
```

### 列表頁行為

- **blog 列表**：採 Astro `paginate()` **靜態分頁**，每頁 10 篇，產生 `/blog`、`/blog/2` …；底部頁碼導覽。tag 頁同樣分頁。靜態分頁對 SEO 與純前端最友善（不用 load-more JS）。
- **productions 列表**：響應式 grid（mobile 1 欄、tablet 2 欄、desktop 3 欄），依 `order` 排序，`featured` 可視覺強調。提供依 `type`（github / appstore）的 client-side 篩選。
- **404 頁**：極簡風文案 + 返回首頁與前往 blog 的連結；沿用站台 layout。

## 內容架構（content collections）

### `productions`
每個產品一個 `.md`，frontmatter：

- `title`（string）
- `description`（string，列表卡片用的短描述）
- `type`（`github` | `appstore`）
- `repo`（string，選填，type=github 時填 `owner/name`）
- `appStoreId`（string，選填，type=appstore 時填 App Store ID）
- `featured`（boolean，是否在首頁精選）
- `order`（number，排序）

內文（Markdown 本體）為該產品的獨立說明頁內容。

### `blog`
每篇一個 `.md`，frontmatter：

- `title`（string）
- `date`（date）
- `tags`（string[]）
- `description`（string）
- `draft`（boolean，true 時不發布）

### i18n 預留
兩個 collection 皆使用結構化 frontmatter，未來要加英文版時，可加語言欄位或改採 `[locale]/` 路由而不破壞現有中文內容。HTML 須語意化、`lang` 屬性正確，讓瀏覽器內建翻譯效果良好。

## 資料流

1. **作品 API 抓取（build time）**
   - type=github：呼叫 GitHub REST API 取 star 數、最新 release、主要語言等。
   - type=appstore：呼叫 iTunes Lookup API 取評分、版本等。
   - **預設不需 token**（抓公開資料）。若 build 遇 GitHub rate limit，可加一個 read-only token 到 Cloudflare 環境變數。
   - **失敗 fallback**：API 失敗時改用 frontmatter 既有值，build 不得中斷。
   - **過期資料**：API 取得的 star 數 / 版本等為「裝飾性」資訊，非核心內容。若 API 持續無回應，頁面顯示 frontmatter 的基準值（可能過期但穩定），不顯示錯誤、不阻斷頁面。frontmatter 基準值由人工偶爾更新即可，不引入額外快取機制（YAGNI）。

2. **搜尋（build time + client）**
   - build 後 Pagefind 掃描產生索引；前端載入後純 client-side 全文搜尋。

3. **Tag filter（build time + client）**
   - build 時從 blog collection 聚合所有 tag，產生各 tag 頁面（`/blog/tags/[tag]`）。
   - 列表頁支援即時 client-side tag 篩選。

## 跨頁共用元件

- **Layout**：共用 header、footer（聯絡方式 / 社群連結：email / GitHub / 其他社群）。
  - **導覽項目**：Productions、Blog、About（privacy 放 footer）。header 含深色模式切換。
  - **行動導覽**：< 640px 收為漢堡選單（drawer），含同樣導覽項目與深色切換。
- **SEO / OG**：
  - 每頁產生 meta 標籤、Open Graph 卡片、sitemap。
  - **OG 圖策略（混合）**：站台層級頁面（首頁 / about / 作品頁）用一張乾淨的靜態預設 OG 圖；**blog 單篇文章在 build 時自動生成 OG 圖**（套極簡版型：文章標題 + 站名）。
- **RSS / Atom feed**：blog 提供 feed；於所有頁面 `<head>` 加 `<link rel="alternate" type="application/rss+xml">` autodiscovery 標籤，讓閱讀器自動偵測。
- **深色模式 / Giscus 同步**：站台主題以 `class` + `localStorage` 持久化偏好並避免閃爍（inline script 於 `<head>` 早期套用）。切換時透過 `postMessage` 通知 Giscus iframe 切換對應 theme，使留言區與站台主題一致。

## 隱私權政策內容

頁面須說明以下事實：

- **Cloudflare Web Analytics**：匿名、無 cookie、不追蹤個人。
- **Giscus 留言**：載入 GitHub 資源；留言公開儲存於 GitHub Discussions，受 GitHub 隱私政策規範；需 GitHub 帳號才能留言。
- 無其他追蹤或第三方資料蒐集。

## 非目標（YAGNI）

- 不做網頁後台 CMS。
- 現在不建空的雙語 routing（只做中文，架構預留）。
- 不自建翻譯 API（依賴瀏覽器內建翻譯）。
- 不接需 cookie 同意的分析工具（如 GA）。

## 開放細節（不影響架構，可實作時定）

- OG 自動生成的具體套件選型（如 satori / astro-og-canvas）於實作時決定。
- 社群連結的實際清單由使用者提供。
