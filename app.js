let currentLang = "ko";
let currentTab = 0;
let latestCourses = [];
let latestProfessors = [];
let latestUniversities = [];
let selectedUniversity = "Korea University";

const PROFILE_KEY = "gsc_profile_v2";
let userProfile = { ...PROFILE };

function t(key) {
  return I18N[currentLang][key] || key;
}

function loadProfile() {
  const saved = localStorage.getItem(PROFILE_KEY);
  if (saved) userProfile = { ...userProfile, ...JSON.parse(saved) };
}

function saveProfile() {
  userProfile = {
    name: document.getElementById("pfName").value.trim(),
    nationality: document.getElementById("pfNation").value.trim(),
    situation: document.getElementById("pfSituation").value.trim(),
    target: document.getElementById("pfTarget").value.trim(),
    idea: document.getElementById("pfIdea").value.trim(),
    focus: "전공 선택 + 교환/대학원 전략 + 창업 MVP"
  };
  localStorage.setItem(PROFILE_KEY, JSON.stringify(userProfile));
  renderProfile();
}

function bindProfileForm() {
  document.getElementById("pfName").value = userProfile.name || "";
  document.getElementById("pfNation").value = userProfile.nationality || "";
  document.getElementById("pfSituation").value = userProfile.situation || "";
  document.getElementById("pfTarget").value = userProfile.target || "";
  document.getElementById("pfIdea").value = userProfile.idea || "";
}

function renderStaticText() {
  document.querySelectorAll("[data-i18n]").forEach((el) => (el.textContent = t(el.dataset.i18n)));
}

function renderProfile() {
  document.getElementById("profileCard").innerHTML = `
    <div class="card"><strong>${userProfile.name || "Unknown"}</strong><br/>국적: ${userProfile.nationality || "-"}<br/>상황: ${userProfile.situation || "-"}<br/>목표: ${userProfile.target || "-"}<br/>아이디어: ${userProfile.idea || "-"}</div>
    <div class="card"><span class="tag" data-term="MVP">MVP</span><span class="tag" data-term="PMF">PMF</span><span class="tag" data-term="Credit Transfer">Credit Transfer</span></div>
  `;
}

function renderWizard() {
  document.getElementById("wizardSteps").innerHTML = t("wizard").map((s) => `<li>${s}</li>`).join("");
}

function renderTabs() {
  document.getElementById("mainTabs").innerHTML = t("tabs").map((tab, i) => `<button class="${i === currentTab ? "active" : ""}" data-tab="${i}">${tab}</button>`).join("");
}

function renderCoursesBlock() {
  if (!latestCourses.length) return `<p class="mini">아직 교과목 데이터를 불러오지 않았습니다.</p>`;
  return `<ul>${latestCourses.map((c) => `<li><b>${c.code}</b> ${c.name_ko} / ${c.name_en}<br/><span class='mini'>${c.skills.join(", ")}</span></li>`).join("")}</ul>`;
}

function renderProfBlock() {
  if (!latestProfessors.length) return `<p class="mini">아직 교수/논문 데이터를 불러오지 않았습니다.</p>`;
  return latestProfessors.map((p) => `<div class='card'><b>${p.name}</b> (${p.department})<br/>${p.focus}<ul>${p.papers.map((w) => `<li>${w.year} - ${w.title}</li>`).join("")}</ul></div>`).join("");
}

function renderUniversityBlock() {
  if (!latestUniversities.length) return `<p class="mini">트랙을 선택하고 글로벌 대학 목록을 불러오세요.</p>`;
  return latestUniversities.map((u) => `<div class='card'><b>${u.name}</b> - ${u.country}, ${u.city}<br/><span class='mini'>Track: ${u.tracks.join(" / ")}</span><br/>Focus: ${u.focus.join(", ")}<br/>Why fit: ${u.why_fit}</div>`).join("");
}

function renderExchangeIntel() {
  const uni = EXCHANGE_INTELLIGENCE[selectedUniversity];
  if (!uni) return `<p class='mini'>선택한 대학의 교환 인텔리전스 데이터가 없습니다.</p>`;
  return `
    <div class='card'><h3>${selectedUniversity}</h3><ol>${uni.timelines.map((x) => `<li>${x}</li>`).join("")}</ol></div>
    <div class='card'><p><b>Procedure</b></p><ol>${uni.procedure.map((x) => `<li>${x}</li>`).join("")}</ol></div>
    <div class='card'><p><b>Visa</b></p><ul>${uni.logistics.visa.map((x) => `<li>${x}</li>`).join("")}</ul>
      <p><b>Language</b></p><ul>${uni.logistics.language.map((x) => `<li>${x}</li>`).join("")}</ul>
      <p><b>Finance</b></p><ul>${uni.logistics.finance.map((x) => `<li>${x}</li>`).join("")}</ul>
      <p><b>Credit Transfer</b></p><ul>${uni.logistics.credit.map((x) => `<li>${x}</li>`).join("")}</ul>
      <p><b>Startup Link</b>: ${uni.startup_link}</p></div>`;
}

function renderTabContent() {
  const contents = [
    `<div class='card'><h3>능력 요구 종합</h3>${renderCoursesBlock()}</div>`,
    `<div class='card'><h3>전공 매칭 분석</h3>${renderCoursesBlock()}</div>`,
    `<div class='card'><h3>교수/연구실 + 최근5년 논문</h3>${renderProfBlock()}</div>`,
    `<div class='card'><h3>글로벌 대학 목록</h3>${renderUniversityBlock()}</div>`,
    `<div class='card'><h3>교환 인텔리전스</h3>${renderExchangeIntel()}</div>`,
    `<div class='card'><h3>시장 트렌드</h3><p>AI + Robotics + Education + Productivity 시장 연계</p></div>`
  ];
  document.getElementById("tabContent").innerHTML = contents[currentTab];
}

function runStartupMvp() {
  const type = document.getElementById("mvpType").value;
  const idea = document.getElementById("mvpInput").value.trim() || userProfile.idea || "startup idea";
  const out = document.getElementById("mvpOutput");

  if (type === "idea2action") {
    out.textContent = `【Idea2Action MVP】\nIdea: ${idea}\n1) Problem 정의\n2) 타겟 사용자 20명 인터뷰\n3) 핵심 기능 3개로 MVP 제작\n4) 2주 내 사용성 테스트\n5) PMF 지표: 재방문율/유료전환율 추적`;
  } else if (type === "task_ai") {
    out.textContent = `【AI Task Supervisor MVP】\nInput Goal: ${idea}\n- AI 분해: 오늘/이번주/이번달 작업\n- 감독자 매칭: 기술/비즈니스 멘토\n- 상태추적: 완료율, 지연원인, 다음 액션\n- 알림 규칙: 미완료 48시간 경과 시 리마인드`;
  } else {
    out.textContent = `【Outreach Pack MVP】\n创业主题: ${idea}\nA) 教授邮件模板（研究匹配）\nB) 学长邮件模板（执行与资源）\nC) 合作方邮件模板（MVP试点）\nD) 一页式项目简介（问题-方案-验证-下一步）`;
  }
}

function populateIntelUniversitySelect() {
  const sel = document.getElementById("intelUniversitySelect");
  if (!sel) return;
  const keys = Object.keys(EXCHANGE_INTELLIGENCE);
  sel.innerHTML = keys.map((k) => `<option value="${k}">${k}</option>`).join("");
  sel.value = selectedUniversity;
}

async function fetchCourses() {
  const major = document.getElementById("majorSelect").value;
  const live = document.getElementById("liveUrl").value.trim();
  const q = live ? `&live_url=${encodeURIComponent(live)}` : "";
  const r = await fetch(`/api/courses?major=${major}${q}`);
  const data = await r.json();
  latestCourses = data.seed_courses || [];
  renderAll();
}

async function fetchProfessors() {
  const r = await fetch("/api/professors");
  const data = await r.json();
  latestProfessors = data.professors || [];
  currentTab = 2;
  renderAll();
}

async function fetchUniversities() {
  const track = document.getElementById("trackSelect").value;
  const r = await fetch(`/api/universities?track=${encodeURIComponent(track)}`);
  const data = await r.json();
  latestUniversities = data.universities || [];
  currentTab = 3;
  renderAll();
}

async function generateDoc() {
  const type = document.getElementById("docType").value;
  const keyword = document.getElementById("docInput").value.trim() || userProfile.idea || "robotics";
  const output = document.getElementById("docOutput");
  if (type === "full") {
    const r = await fetch(`/api/plan?q=${encodeURIComponent(keyword)}`);
    const data = await r.json();
    output.textContent = `${data.ko}\n\n${data.zh}`;
    return;
  }
  const sample = {
    study: `학업계획서 초안\n- 목표: 글로벌 교환+창업 실행형 인재\n- 키워드: ${keyword}`,
    intro: `자기소개서 초안\n저는 실행 중심으로 교환/연구/창업을 연결해 성과를 만드는 학생입니다.\n핵심 분야: ${keyword}`,
    email: `메일 초안\n안녕하세요 교수님, 저는 ${userProfile.name || "지원자"}입니다.\n${keyword} 관련 협업 미팅을 요청드립니다.`
  };
  output.textContent = sample[type];
}

function setupEvents() {
  document.getElementById("langSelect").addEventListener("change", (e) => {
    currentLang = e.target.value;
    renderAll();
  });
  document.getElementById("mainTabs").addEventListener("click", (e) => {
    if (e.target.matches("button[data-tab]")) {
      currentTab = Number(e.target.dataset.tab);
      renderAll();
    }
  });
  document.getElementById("saveProfileBtn").addEventListener("click", saveProfile);
  document.getElementById("loadCoursesBtn").addEventListener("click", fetchCourses);
  document.getElementById("loadProfBtn").addEventListener("click", fetchProfessors);
  document.getElementById("loadUnivBtn").addEventListener("click", fetchUniversities);
  document.getElementById("openIntelBtn").addEventListener("click", () => {
    selectedUniversity = document.getElementById("intelUniversitySelect").value;
    currentTab = 4;
    renderAll();
  });
  document.getElementById("runMvpBtn").addEventListener("click", runStartupMvp);
  document.getElementById("generateBtn").addEventListener("click", generateDoc);
  document.body.addEventListener("click", (e) => {
    if (e.target.matches(".tag[data-term]")) {
      const term = e.target.dataset.term;
      document.getElementById("termTitle").textContent = term;
      document.getElementById("termBody").textContent = TERMS[term][currentLang];
      document.getElementById("termModal").classList.remove("hidden");
    }
  });
  document.getElementById("closeTerm").addEventListener("click", () => document.getElementById("termModal").classList.add("hidden"));
}

function renderAll() {
  renderStaticText();
  renderProfile();
  bindProfileForm();
  renderWizard();
  renderTabs();
  populateIntelUniversitySelect();
  renderTabContent();
}

loadProfile();
setupEvents();
renderAll();
