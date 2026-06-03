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

## 網站結構（路由）

```
/                    首頁（精選作品 + 最新文章）
/productions         作品列表（手動策展卡片）
/productions/[slug]  單一作品說明頁（部分資訊 build 時抓 API）
/blog                文章列表（含 tag filter + 搜尋）
/blog/[slug]         單篇文章（含 Giscus 留言）
/blog/tags/[tag]     依 tag 過濾的文章列表
/about               關於
/privacy             隱私權政策
404                  找不到頁面
```

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

2. **搜尋（build time + client）**
   - build 後 Pagefind 掃描產生索引；前端載入後純 client-side 全文搜尋。

3. **Tag filter（build time + client）**
   - build 時從 blog collection 聚合所有 tag，產生各 tag 頁面（`/blog/tags/[tag]`）。
   - 列表頁支援即時 client-side tag 篩選。

## 跨頁共用元件

- **Layout**：共用 header（導覽 + 深色模式切換）、footer（聯絡方式 / 社群連結：email / GitHub / 其他社群）。
- **SEO / OG**：
  - 每頁產生 meta 標籤、Open Graph 卡片、sitemap。
  - **OG 圖策略（混合）**：站台層級頁面（首頁 / about / 作品頁）用一張乾淨的靜態預設 OG 圖；**blog 單篇文章在 build 時自動生成 OG 圖**（套極簡版型：文章標題 + 站名）。
- **RSS / Atom feed**：blog 提供 feed 供讀者訂閱。

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
