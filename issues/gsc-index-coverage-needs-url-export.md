# Google 索引覆盖问题需要具体 URL 清单

根据 `docs/08-content-quality-and-reporting.md`，索引问题必须定位到具体 URL 后才能判断是否为站点故障。当前提供的截图只有聚合数量，没有显示受影响 URL，因此无法逐条确认“备用网页”“被 noindex 排除”“已发现尚未编入索引”和“已抓取尚未编入索引”的实际页面。

## 受影响页面

- Google Search Console 截图中的 41 个“备用网页（有适当的规范标记）”URL
- Google Search Console 截图中的 8 个“被 `noindex` 标记排除”URL
- Google Search Console 截图中的 528 个“已发现 - 尚未编入索引”URL
- Google Search Console 截图中的 288 个“已抓取 - 尚未编入索引”URL

## 修复建议

从 Search Console 分别导出每类问题的 URL 列表，再按以下顺序处理：确认 URL 是否仍应存在；确认返回状态码、canonical、robots 和页面正文；删除 sitemap 中已删除或低价值 URL；对确实重复的 URL 保留自引用 canonical 或 301/308；对重要且独立的页面请求重新编入索引。

本次公开站点复核结果：`robots.txt` 允许抓取并声明了 sitemap；sitemap 返回 200、包含 644 个无重复的 HTTPS URL；无效 Pal URL 返回 404 并带有 `noindex`；旧 `/paldex` 和第一页分页 URL 返回 308 永久重定向。这些当前行为本身符合预期。
