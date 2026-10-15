# Ahmad-IB Metricool approved-auto workflow

**Confirmed workspace:** `ahmadibofficial` / brand `7445168`, account `ahmadibofficial@gmail.com`, timezone `Africa/Lagos`.

**Meaning of approved-auto:** The user separately approves the exact caption, imagery/video, destination, date and time for every individual post. Once approved, a scheduled Metricool post may use `draft:false` and `autoPublish:true` to publish on that approved schedule. **Selecting approved-auto is not approval of the batch or any post.**

## Current approved destinations for review
Instagram `@ahmadib_official`, TikTok `@ahmadibofficial`, and connected personal YouTube. All need original, reviewed media.

Facebook is **blocked** because its page ID overlaps the earlier MetaAutomate workspace. LinkedIn is **blocked** because no personal LinkedIn connection appears in the Metricool workspace.

## Proposed first batch (Nigeria local time)
- **Oct 19, 14:00:** Instagram carousel about Android toolkit, original 3-slide visual
- **Oct 21, 14:00:** Instagram carousel about exported components, original 3-slide visual
- **Oct 23, 10:00:** TikTok educational short on API authorization
- **Oct 23, 16:00:** YouTube short on API authorization

These times use Metricool posting-time suggestions. All four records in `editorial/metricool_first_batch.json` are `PENDING_OWNER_APPROVAL`. The six graphics and silent 24-second faceless draft video are supplied separately in the local review pack; they are not uploaded or publicly hosted.

## Manual launch gates
1. Check the article URL is live and facts are sourced. Never publish confidential or unpatched third-party vulnerabilities without authorization and disclosure clearance.
2. Review each full caption and media file, verify the correct personal channel, and accept the exact local date/time.
3. Require the owner's explicit approval identifying the selected post(s) and final media. Any modifications require reapproval.
4. Verify Metricool brand ID **7445168** and obtain a genuine public media URL (or supported user-upload attachment). Never invent a URL.
5. Only **after** approval, schedule with Metricool's connected publishing action, using the exact approved settings and `autoPublish:true`; verify a returned planner URL/post ID.
6. Verify actual publication afterwards and collect analytics. If any requirement fails, keep the post offline as a draft.

GitHub contains only a review manifest and offline validations: **no Metricool tokens, network writes or approvals**. Run:
```bash
python scripts/metricool_approved_auto.py validate
python -m unittest discover -s tests -v
```

PR #2 remains draft, Render auto-deploy disabled, and nothing here triggers a deployment or scheduled post.
