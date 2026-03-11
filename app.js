const I18N = {
  ko: { title:'나의 성장 게임', status:'오늘의 상태', build:'퀘스트 생성', done:'완료', stuck:'막힘', skip:'건너뛰기' },
  zh: { title:'我的成长游戏', status:'今日状态', build:'生成任务', done:'完成', stuck:'卡住', skip:'跳过' },
  en: { title:'My Growth Game', status:'Today Status', build:'Generate Quests', done:'Done', stuck:'Stuck', skip:'Skip' }
};

const state = JSON.parse(localStorage.getItem('otome_state') || '{}');
Object.assign(state, {
  lang: state.lang || 'ko',
  day: state.day || 1,
  xp: state.xp || 0,
  energy: state.energy ?? 100,
  affinity: state.affinity || 0,
  steps: state.steps || [],
  idx: state.idx || 0,
  quests: state.quests || [],
  logs: state.logs || [],
  profile: state.profile || { name: '', stage: '', target: '' },
  latestDraft: state.latestDraft || '',
});

const $ = (s) => document.querySelector(s);
const personaLines = {
  gentle: ['천천히 가도 괜찮아. 내가 옆에 있어요 🌷', '아주 좋아요, 지금처럼만 해요 ✨'],
  leader: ['좋아, 집중. 다음 동작 바로 들어가자.', '완벽해. 리듬 안 놓치고 계속 간다.'],
  mentor: ['좋은 판단이에요. 핵심을 정확히 잡았네요.', '기록까지 해두면 성장 속도가 더 빨라져요.'],
};

function save() { localStorage.setItem('otome_state', JSON.stringify(state)); }
function pushLog(x) {
  state.logs.unshift(`${new Date().toLocaleTimeString()} · ${x}`);
  state.logs = state.logs.slice(0, 30);
  save(); renderLogs();
}
function renderLogs(){ $('#log').innerHTML = state.logs.map(x=>`<div class="item">${x}</div>`).join(''); }

function renderTop() {
  $('#app-title').textContent = I18N[state.lang].title;
  $('#status-title').textContent = I18N[state.lang].status;
  $('#build-plan').textContent = I18N[state.lang].build;
  $('#btn-complete').textContent = I18N[state.lang].done;
  $('#btn-stuck').textContent = I18N[state.lang].stuck;
  $('#btn-skip').textContent = I18N[state.lang].skip;
  $('#day').textContent = state.day;
  $('#xp').textContent = state.xp;
  $('#energy').textContent = state.energy;
  $('#affinity').textContent = state.affinity;
  document.documentElement.lang = state.lang;
  document.title = I18N[state.lang].title;
}

function renderProfile() {
  $('#profile-name').value = state.profile.name || '';
  $('#profile-stage').value = state.profile.stage || '';
  $('#profile-target').value = state.profile.target || '';

  const preview = $('#profile-preview');
  if (!state.profile.name && !state.profile.stage && !state.profile.target) {
    preview.textContent = '暂无简介，保存后会显示在这里。';
  } else {
    preview.innerHTML = [
      `<strong>姓名：</strong>${state.profile.name || '-'}`,
      `<strong>阶段：</strong>${state.profile.stage || '-'}`,
      `<strong>目标：</strong>${state.profile.target || '-'}`,
    ].join('<br/>');
  }

  if (state.latestDraft) {
    $('#draft-output').innerHTML = `<div class="item" style="white-space:pre-wrap">${escapeHtml(state.latestDraft)}</div>`;
  }
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function renderQuests() {
  if (!state.quests.length) {
    $('#quest-list').innerHTML = '<div class="item">아직 퀘스트가 없어요. 환경 체크 후 생성하세요.</div>';
    return;
  }
  $('#quest-list').innerHTML = state.quests.map((q,i)=>`<div class="item">${q.done?'✅':'⏳'} Q${i+1}. ${q.text}</div>`).join('');
}

function plan(goal, env) {
  const map = {
    hair: ['도구 배치', '예비세정 60초', '두피 중심 샴푸', '드라이 15cm'],
    skin: ['손 20초 세정', '저자극 세안 45초', '보습 30초 내 도포', '자극도 기록'],
    fitness: ['자세 점검', '코어 브레이싱 5회', '스쿼트 8회', '호흡/무릎궤적 기록'],
    study: ['책상 정리', '25분 집중', '핵심 1개 필기', '2문장 복기'],
  };
  return (map[goal] || map.hair).map((x,i)=>`Step ${i+1}. ${x} (장소:${env.location}, 시간:${env.minutes}분, 도구:${env.tools})`);
}

function showStep() {
  if (!state.steps.length) return;
  if (state.idx >= state.steps.length) {
    $('#step-box').textContent = '✅ Quest complete!';
    return;
  }
  $('#step-box').textContent = state.steps[state.idx];
  $('#timeline').innerHTML = state.steps.map((s,i)=>`<div class="item">${i<state.idx?'✅':i===state.idx?'➡️':'⏳'} ${s}</div>`).join('');
}

function reward(done=true) {
  if (done) { state.xp += 15; state.energy = Math.max(0, state.energy - 8); state.affinity += 2; }
  else { state.energy = Math.max(0, state.energy - 3); }
  save(); renderTop();
}

function personaSpeak(type='gentle') {
  const lines = personaLines[type] || personaLines.gentle;
  $('#coach-line').textContent = lines[Math.floor(Math.random()*lines.length)];
}

$('#profile-form').addEventListener('submit', (e) => {
  e.preventDefault();
  state.profile = {
    name: $('#profile-name').value.trim(),
    stage: $('#profile-stage').value.trim(),
    target: $('#profile-target').value.trim(),
  };
  save();
  renderProfile();
  pushLog('Profile saved');
});

$('#generate-draft').addEventListener('click', async () => {
  const profileText = [
    `姓名:${$('#profile-name').value.trim() || state.profile.name || ''}`,
    `阶段:${$('#profile-stage').value.trim() || state.profile.stage || ''}`,
    `目标:${$('#profile-target').value.trim() || state.profile.target || ''}`,
  ].join('；');
  const direction = $('#draft-direction').value;

  if (!profileText.replace(/[；:姓名阶段目标]/g, '').trim()) {
    $('#draft-output').innerHTML = '<div class="item">请先填写并保存“使用者简介”。</div>';
    return;
  }

  $('#draft-output').innerHTML = '<div class="item">Gemini 生成中，请稍候...</div>';
  pushLog(`Draft generation started (${direction})`);

  try {
    const resp = await fetch('/api/generate-draft', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profile: profileText, direction }),
    });
    const data = await resp.json();

    if (!resp.ok) {
      throw new Error(data?.error || 'Draft generation failed');
    }

    state.latestDraft = data.draft;
    save();
    renderProfile();
    pushLog('Draft generated via Gemini');
  } catch (err) {
    $('#draft-output').innerHTML = `<div class="item">生成失败：${escapeHtml(err.message || '未知错误')}</div>`;
    pushLog(`Draft generation failed: ${err.message}`);
  }
});

$('#env-form').addEventListener('submit', (e)=>{
  e.preventDefault();
  const env = { location: $('#location').value.trim(), tools: $('#tools').value.trim(), minutes: Number($('#minutes').value||10) };
  const goal = $('#goal').value;
  state.steps = plan(goal, env);
  state.idx = 0;
  state.quests = state.steps.slice(0,3).map(s=>({text:s,done:false}));
  save();
  showStep(); renderQuests();
  pushLog(`New quest generated: ${goal}`);
});

$('#btn-complete').addEventListener('click', ()=>{
  if (!state.steps.length || state.idx >= state.steps.length) return;
  if (state.quests[state.idx]) state.quests[state.idx].done = true;
  state.idx += 1;
  reward(true);
  personaSpeak($('#persona').value);
  showStep(); renderQuests();
  pushLog('Step completed');
});

$('#btn-stuck').addEventListener('click', ()=>{
  if (!state.steps.length) return;
  reward(false);
  personaSpeak($('#persona').value);
  pushLog('Stuck: correction hint sent');
});

$('#btn-skip').addEventListener('click', ()=>{
  if (!state.steps.length) return;
  state.idx += 1;
  reward(false);
  showStep();
  pushLog('Step skipped');
});

$('#btn-new-day').addEventListener('click', ()=>{
  state.day += 1;
  state.energy = 100;
  state.steps = [];
  state.idx = 0;
  state.quests = [];
  save();
  renderTop(); renderQuests();
  $('#step-box').textContent = '새로운 하루가 시작됐어요. 퀘스트를 생성하세요!';
  pushLog('New day started');
});

$('#btn-reset').addEventListener('click', ()=>{
  localStorage.removeItem('otome_state');
  location.reload();
});

document.querySelectorAll('[data-lang]').forEach(btn=>btn.addEventListener('click', ()=>{
  state.lang = btn.dataset.lang;
  save(); renderTop();
  pushLog(`Language switched: ${state.lang}`);
}));

$('#enable-notify').addEventListener('click', async ()=>{
  if (!('Notification' in window)) return pushLog('Notification unsupported');
  const p = await Notification.requestPermission();
  pushLog(`Notification permission: ${p}`);
  if (p==='granted') new Notification('Otome Live Quest', { body:'다음 스텝 할 시간이에요 💌' });
});

renderTop();
renderQuests();
renderLogs();
renderProfile();
showStep();
personaSpeak($('#persona').value);
