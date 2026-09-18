# AI Trend Daily

繁體中文 AI 應用選讀網站，整理 Facebook、Instagram 與 X 的跨平台 Top 5。

網站：https://beartolove.github.io/ai-trend-daily/

## 目前狀態

第一版網站架構已完成：手機版、深淺色模式、平台篩選、歷史日期選單、來源連結與互動數據欄位。目前沒有已查證的貼文，首頁呈現待更新狀態，沒有虛構排行榜。尚未串接自動蒐集或每日排程。

## 更新一期

1. 先將舊的 `data/latest.json` 保存為 `data/YYYY-MM-DD.json`，再在 `data/archive.json` 的 `issues` 加上 `{"date":"YYYY-MM-DD","path":"data/YYYY-MM-DD.json"}`。只封存有實際內容的一期。
2. 更新 `data/latest.json`，使用台北日期；`posts` 最多五則，每則包含下方欄位。
3. 查證來源後再發布。沒有可取得的資料填 `null`，不要以 0 代替未知數據。排名為編輯精選順序，不宣稱全平台熱度排行。
4. 推送至 main 後由 GitHub Pages 發布。

```json
{
  "rank": 1,
  "platform": "X",
  "author": null,
  "published_at": null,
  "topic": "主題",
  "summary": "繁體中文摘要",
  "application": "可實際運用的方式",
  "metrics": {"likes": null, "comments": null, "shares": null, "views": null},
  "url": null
}
```

`platform` 支援 `Facebook`、`Instagram`、`X`。`published_at` 建議使用含時區的 ISO 8601 時間；`url` 必須使用 HTTPS 原始貼文網址。

## 本機預覽與部署

使用靜態 HTTP 伺服器開啟專案（不可直接雙擊 HTML，因為資料由 fetch 載入）。無需建置或安裝前端套件。
GitHub Settings → Pages → Deploy from a branch → main / (root)。
