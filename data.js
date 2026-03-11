const I18N = {
  ko: {
    profileTitle: "사용자 프로필",
    wizardTitle: "단계별 계획",
    mvpTitle: "글로벌 교환·창업 통합 플래너",
    writerTitle: "문서 작성기",
    docType: "문서 종류",
    docInput: "핵심 키워드 입력",
    generateBtn: "초안 생성",
    footer: "Professional Model: 교환/비자/학점/창업 연계를 미세 단계로 분석.",
    tabs: ["능력 종합", "전공 매칭", "교수/연구실", "글로벌 대학", "교환 인텔리전스", "시장 트렌드"],
    wizard: ["프로필 입력(개인 비공개)", "대학/트랙 선택", "교환 타임라인 확인", "학점/비자 준비", "MVP 실행", "문서 제출/인터뷰"]
  },
  zh: {
    profileTitle: "用户档案",
    wizardTitle: "分步规划",
    mvpTitle: "全球交换+创业一体化规划器",
    writerTitle: "文书生成器",
    docType: "文书类型",
    docInput: "输入关键词",
    generateBtn: "生成草稿",
    footer: "Professional Model：把交换/签证/学分/创业拆成最小执行步骤。",
    tabs: ["能力总表", "专业匹配", "教授/实验室", "全球大学", "交换情报", "市场趋势"],
    wizard: ["输入个人资料（本地私有）", "选择学校轨道", "查看交换时间线", "准备签证和学分", "运行创业MVP", "提交文书和面试"]
  },
  en: {
    profileTitle: "User Profile",
    wizardTitle: "Step-by-Step Plan",
    mvpTitle: "Global Exchange + Startup Planner",
    writerTitle: "Document Writer",
    docType: "Document Type",
    docInput: "Input key phrases",
    generateBtn: "Generate Draft",
    footer: "Professional Model: decomposed micro-steps for exchange, visa, credits, and startup path.",
    tabs: ["Capability Matrix", "Major Matching", "Prof/Lab", "Global Universities", "Exchange Intelligence", "Market Trend"],
    wizard: ["Fill profile (private local)", "Choose university track", "Review exchange timeline", "Prepare visa and credits", "Run startup MVP", "Submit docs and interview"]
  }
};

const PROFILE = {
  name: "全智贤",
  nationality: "中国",
  situation: "单亲家庭 / 复读一年",
  target: "2026년 9월 한국 학부 입학",
  focus: "전공 선택 + 교환/대학원 전략 + 창업 MVP",
  idea: "로봇 + AI 학습/행동 가이드 플랫폼"
};

const TERMS = {
  MVP: { ko: "최소 기능 제품", zh: "最小可行产品", en: "Minimum Viable Product" },
  PMF: { ko: "제품-시장 적합성", zh: "产品市场匹配", en: "Product-Market Fit" },
  "Credit Transfer": { ko: "학점 이전 심사 체계", zh: "学分转换审核体系", en: "Credit transfer evaluation system" }
};

const EXCHANGE_INTELLIGENCE = {
  "Korea University": {
    tracks: ["undergraduate", "graduate", "exchange"],
    timelines: ["T-8M: 교내 공고 확인", "T-6M: 어학/성적 제출", "T-4M: 학과 승인+서류", "T-2M: 파견 확정/비자", "T: 출국"],
    procedure: ["1) 지도교수 상담", "2) 국제처 공지 확인", "3) 파견교 3지망", "4) 서류 제출", "5) 면접", "6) nomination", "7) host 합격", "8) 비자+학점 승인"],
    logistics: {
      visa: ["여권 만료 확인", "입학허가서/재정증빙 준비", "비자센터 예약"],
      language: ["IELTS/TOEFL 기준 충족", "전공 발표 영어 준비"],
      finance: ["등록금/생활비 계획", "장학금/잔고증명"],
      credit: ["과목 매칭표 작성", "syllabus 첨부", "귀국 후 환산 규정 확인"]
    },
    evaluation: { academics: "9/10", campus: "8/10", startup: "8/10", global: "8/10" },
    competencies: ["Academic Writing", "Interview Storytelling", "Credit Mapping", "Startup Validation"],
    startup_link: "서울 창업 커뮤니티/랩 네트워크 접근성이 좋음"
  },
  "Pusan National University": {
    tracks: ["undergraduate", "graduate", "exchange"],
    timelines: ["T-9M: 프로그램 탐색", "T-7M: 어학+추천서", "T-5M: 지원서", "T-3M: 파견/숙소", "T: 출국"],
    procedure: ["1) 학과 매칭", "2) 산업 연계 조사", "3) 지원서", "4) 승인", "5) 비자/학점 확정"],
    logistics: {
      visa: ["D-2/D-4 요건 확인", "재정증빙", "외국인등록 일정"],
      language: ["TOPIK/영어 병행"],
      finance: ["부산 생활비 계획"],
      credit: ["전공필수 우선 매핑", "실습 과목 대체 규칙 확인"]
    },
    evaluation: { academics: "8/10", campus: "8/10", startup: "9/10", global: "7/10" },
    competencies: ["Practical Engineering", "Budget Management", "Prototype Deployment"],
    startup_link: "부산 제조/물류 기반으로 하드웨어 MVP 테스트에 적합"
  },
  MIT: {
    tracks: ["graduate", "exchange"],
    timelines: ["T-12M: lab scan", "T-10M: score/portfolio", "T-8M: SOP", "T-5M: interview", "T-2M: visa"],
    procedure: ["1) 랩 선정", "2) 연구 적합성 메일", "3) 포트폴리오", "4) 합격+비자", "5) 창업 생태계 연결"],
    logistics: {
      visa: ["I-20/SEVIS/DS-160", "F-1 인터뷰"],
      language: ["TOEFL iBT 100+ 경쟁권"],
      finance: ["학비+생활비 현금흐름 계획"],
      credit: ["host/home 학점 정책 확인"]
    },
    evaluation: { academics: "10/10", campus: "8/10", startup: "10/10", global: "10/10" },
    competencies: ["Research Design", "Technical Communication", "Deep Prototyping"],
    startup_link: "딥테크 스핀오프와 VC 네트워크가 강함"
  }
};
