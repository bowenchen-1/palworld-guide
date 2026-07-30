# 部分语言页面缺少 hreflang

根据 `docs/03-internationalization-and-navigation.md`，多语言页面应声明自身及对应语言版本的绝对 `hreflang` 链接，并包含 `x-default`。

## 受影响页面

- `/guides`
- `/guides/{slug}`（全部指南详情页）
- `/map`
- `/zh/map`
- `/tools`
- `/team-builder`
- `/updates`
- `/items/hardwood`
- `/palworld-1-0`

这些页面使用了通用 metadata，但当前没有输出语言 alternate；只有首页、繁育计算器、Pals 列表和 Pal 详情页配置了语言 alternate。

## 修复建议

如果这些页面存在正式中文/英文对应版本，为每一组页面补充 `en`、`zh` 和 `x-default` 的绝对 HTTPS URL，并确保 reciprocal 链接与 canonical 一致。如果没有对应翻译页，不要伪造 hreflang，而应保持单语言页面并从 sitemap 与内部链接中明确其语言归属。
