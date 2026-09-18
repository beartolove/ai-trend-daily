'use strict';
const $ = selector => document.querySelector(selector);
let issue = null, platform = 'all', request = 0;
const text = (tag, value, cls) => { const el = document.createElement(tag); el.textContent = value ?? '未提供'; if (cls) el.className = cls; return el; };
const available = value => value === null || value === undefined || value === '' ? '未提供' : value;
function render() {
  const all = Array.isArray(issue?.posts) ? issue.posts.slice(0, 5) : [];
  const posts = all.filter(post => platform === 'all' || post.platform === platform);
  $('#count').textContent = `${posts.length} 則精選`;
  $('#posts').replaceChildren();
  $('#status').textContent = issue?.notice || (all.length ? '互動數據以資料擷取時為準；不同平台的數據不宜直接比較。' : '本期尚未提供可驗證的社群貼文與互動數據。');
  if (!posts.length) {
    const box = text('div', '', 'empty');
    box.append(text('div', '↗', 'empty-icon'), text('h3', all.length ? '此平台尚無精選' : '值得分享的內容，值得仔細確認。'), text('p', all.length ? '試試其他平台，或切換至「全部」查看本期選讀。' : '網站已就緒。本期內容仍待查證，確認來源後才會刊登；目前沒有發布 Top 5 排名。'), text('p', '作者、發布時間、互動數據：未提供'));
    $('#posts').append(box); return;
  }
  for (const post of posts) {
    const card = text('article', '', 'card'), body = text('div', '');
    card.append(text('span', String(post.rank ?? all.indexOf(post) + 1).padStart(2, '0'), 'rank'), body);
    const meta = text('div', '', 'meta'); meta.append(text('span', available(post.platform), 'badge'), text('span', available(post.author)), text('span', available(post.published_at)));
    body.append(meta, text('h3', available(post.topic)), text('p', available(post.summary)), text('p', `AI 應用重點｜${available(post.application)}`, 'application'));
    const metrics = text('div', '', 'metrics');
    for (const [key, label] of Object.entries({likes:'讚',comments:'留言',shares:'分享',views:'瀏覽'})) metrics.append(text('span', `${label} ${available(post.metrics?.[key])}`));
    body.append(metrics);
    let url; try { url = new URL(post.url); } catch {}
    if (url && url.protocol === 'https:') { const link = text('a', '閱讀原始貼文 ↗', 'source'); link.href = url.href; link.target = '_blank'; link.rel = 'noopener noreferrer'; body.append(link); } else body.append(text('span', '原始貼文連結：未提供', 'muted'));
    $('#posts').append(card);
  }
}
async function json(path) { const response = await fetch(path, {cache:'no-cache'}); if (!response.ok) throw new Error('讀取失敗'); return response.json(); }
async function load(path) { const id = ++request; $('#status').textContent = '正在載入每日精選…'; try { const data = await json(path); if (id !== request) return; issue = data; render(); } catch { if (id !== request) return; issue = null; $('#posts').replaceChildren(); $('#count').textContent = ''; $('#status').textContent = '暫時無法讀取本期資料，請重新整理或選擇其他日期。'; } }
document.querySelectorAll('[data-platform]').forEach(button => button.addEventListener('click', () => { platform = button.dataset.platform; document.querySelectorAll('[data-platform]').forEach(item => item.setAttribute('aria-pressed', String(item === button))); if (issue) render(); }));
let saved; try { saved = localStorage.getItem('ai-trend-theme'); } catch {}
document.body.classList.toggle('dark', saved ? saved === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches);
$('#theme').addEventListener('click', () => { const dark = document.body.classList.toggle('dark'); try { localStorage.setItem('ai-trend-theme', dark ? 'dark' : 'light'); } catch {} });
$('#date').addEventListener('change', event => load(event.target.value));
(async () => { await load('data/latest.json'); try { const archive = await json('data/archive.json'); $('#date').replaceChildren(); const latest = text('option', `${issue?.date || '最新'} · 最新一期`); latest.value = 'data/latest.json'; $('#date').append(latest); for (const entry of archive.issues || []) { if (entry.date === issue?.date || !/^data\/[\w/-]+\.json$/.test(entry.path)) continue; const option = text('option', entry.date); option.value = entry.path; $('#date').append(option); } } catch { $('#date').replaceChildren(text('option', '最新一期')); $('#date').disabled = true; } })();
