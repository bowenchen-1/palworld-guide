# sitemap 的 lastmod 日期滞后

根据 `docs/06-crawlability-and-index-control.md`，sitemap 的元数据应反映页面内容更新时间。当前 sitemap 中所有 URL 的 `lastmod` 都固定为 `2026-07-14T00:00:00.000Z`，但网站在 2026-07-27 至 2026-07-29 期间仍有地图和界面更新。

## 受影响页面

- `/sitemap.xml` 中的全部 644 个 URL

## 修复建议

不要为所有页面使用固定日期。应按页面或数据版本维护真实的 `lastModified`，至少在内容、页面模板或重要资源发生发布变更时更新对应日期。更新后重新提交 sitemap，并在 Google Search Console 中验证抓取状态。
