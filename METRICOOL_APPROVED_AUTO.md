# Ahmad-IB automatic publishing — standing user authorization

**Updated October 17, 2026.** The user explicitly instructed: **do not wait for approval; publish automatically.** This supersedes routine per-post approval requirements. Only content passing objective safety and quality checks is eligible for automatic scheduling. The user's prior approval also covered the four already-scheduled V3 posts.

## Confirmed account and allowed networks

- Brand: `ahmadibofficial` (`7445168`), email `ahmadibofficial@gmail.com`, timezone `Africa/Lagos`.
- Allowed personal channels: Instagram `@ahmadib_official`, TikTok `@ahmadibofficial`, and the verified connected personal YouTube channel.
- Facebook remains explicitly excluded due to its overlapping MetaAutomate page ID; LinkedIn stays excluded until connected and verified.

## Standing auto-publish policy

Do not request additional approval for ordinary researched cybersecurity awareness, practical tutorials, existing public journal articles, or educational explanations. Before publication confirm: accurate primary sources, a live article link, non-duplicated schedule, right brand, finished original or licensed media, clear and useful written caption, readable educational graphics, and platform policy compliance. Keep visuals white/navy/blue. All videos must be 30–120 seconds with narration or soundtrack and subtitles.

Unpublished security vulnerabilities, private data, customer findings, unreleased exploits, secrets, copyrighted media without rights, or uncertain evidence are **not** covered by standing authorization. Keep such items private pending appropriate authorization/disclosure clearance. If any check fails, skip the item and report the blocker instead of pretending to publish.

## Confirmed scheduled posts

| Post | Channel | Scheduled Africa/Lagos | Auto publish |
|---|---|---|---|
| IG-01 | Instagram | 2026-10-19 14:00 | Yes |
| IG-02 | Instagram | 2026-10-21 14:00 | Yes |
| TT-03 | TikTok | 2026-10-23 10:00 | Yes |
| YT-04 | YouTube Shorts | 2026-10-23 16:00 | Yes |

Metricool was rechecked October 17: all four have real IDs, uploaded media, `autoPublish:true` and `PENDING` publication status. They need no more owner approval and should retain the current schedule. Exact IDs and UUIDs are in `editorial/metricool_scheduled_receipt.json`. The original `editorial/metricool_first_batch.json` remains a **historical offline fixture** and must not be used to decide whether these posts are scheduled.

## Execution boundaries

The recurring Monday reputation task is configured to prepare and schedule up to three new eligible posts weekly using the Metricool integration if the runtime supports real file/media creation and social connector actions. Each scheduling result must be verified by a Metricool UUID/receipt. An unavailable connector or missing media blocks that post. GitHub source CI only validates; it contains no publishing secrets or network writes. PR #2 remains draft and Render auto-deployment remains off.
