/**
 * Structured CV data for د. سيف الدين عبد الفتاح.
 * Extracted from the legacy WordPress "about-us" page and restructured for
 * visual/timeline rendering and the printable CV.
 */

export const PERSONAL = {
  fullName: "سيف الدين عبد الفتاح إسماعيل",
  honorific: "أ.د.",
  birthDate: "11 نوفمبر 1954",
  birthYear: 1954,
  birthPlace: "القاهرة، جمهورية مصر العربية",
  nationality: "مصري",
  religion: "مسلم",
  maritalStatus: "متزوج — ثلاثة أبناء",
  currentTitle: "أستاذ العلوم السياسية",
  specialty: "النظرية السياسية — الفكر السياسي الإسلامي — الدراسات السياسية الإسلامية",
  affiliation: "كلية الاقتصاد والعلوم السياسية، قسم العلوم السياسية — جامعة القاهرة",
} as const;

export interface AcademicDegree {
  level: "bachelor" | "master" | "phd";
  degree: string;
  year: number;
  dateText: string;
  institution: string;
  grade: string;
  thesis?: string;
  advisors?: string[];
}

export const DEGREES: AcademicDegree[] = [
  {
    level: "bachelor",
    degree: "بكالوريوس العلوم السياسية",
    year: 1976,
    dateText: "مايو 1976",
    institution: "كلية الاقتصاد والعلوم السياسية — جامعة القاهرة",
    grade: "جيد جدًا مع مرتبة الشرف",
  },
  {
    level: "master",
    degree: "ماجستير العلوم السياسية",
    year: 1982,
    dateText: "أكتوبر 1982",
    institution: "قسم العلوم السياسية — جامعة القاهرة",
    grade: "امتياز",
    thesis:
      "الجانب السياسي لمفهوم الاختيار لدى المعتزلة بين الإدراك الذاتي والفهم الاستشراقي",
    advisors: ["أ.د. حامد عبد الله ربيع"],
  },
  {
    level: "phd",
    degree: "دكتوراه الفلسفة في العلوم السياسية",
    year: 1987,
    dateText: "ديسمبر 1987",
    institution: "قسم العلوم السياسية — جامعة القاهرة",
    grade:
      "مرتبة الشرف الأولى مع التوصية بتبادل الرسالة مع الجامعات المصرية والعربية والأجنبية",
    thesis: "التجديد السياسي والخبرة الإسلامية — نظرة في الواقع العربي المعاصر",
    advisors: [
      "أ.د. حامد ربيع",
      "أ.د. محمود خيري عيسى",
      "أ.د. حورية توفيق مجاهد",
    ],
  },
];

export interface CareerPosition {
  title: string;
  institution: string;
  fromYear: number;
  toYear: number | "present";
  fromText: string;
  toText: string;
  specialty?: string;
  highlight?: boolean;
}

export const CAREER: CareerPosition[] = [
  {
    title: "معيد",
    institution: "قسم العلوم السياسية — جامعة القاهرة",
    fromYear: 1976,
    toYear: 1983,
    fromText: "أكتوبر 1976",
    toText: "يناير 1983",
    specialty: "نظرية سياسية وفكر سياسي",
  },
  {
    title: "مدرس مساعد",
    institution: "قسم العلوم السياسية — جامعة القاهرة",
    fromYear: 1983,
    toYear: 1988,
    fromText: "يناير 1983",
    toText: "فبراير 1988",
    specialty: "النظرية السياسية — الفكر السياسي الإسلامي",
  },
  {
    title: "مدرس",
    institution: "قسم العلوم السياسية — جامعة القاهرة",
    fromYear: 1988,
    toYear: 1993,
    fromText: "فبراير 1988",
    toText: "يونيو 1993",
    specialty: "النظرية السياسية — الفكر السياسي الإسلامي",
  },
  {
    title: "أستاذ مشارك",
    institution: "قسم العلوم السياسية — جامعة القاهرة",
    fromYear: 1993,
    toYear: 1999,
    fromText: "يونيو 1993",
    toText: "1999",
  },
  {
    title: "أستاذ",
    institution: "قسم العلوم السياسية — جامعة القاهرة",
    fromYear: 1999,
    toYear: "present",
    fromText: "1999",
    toText: "حتى الآن",
    highlight: true,
  },
  {
    title: "مدير برنامج حوار الحضارات",
    institution: "جامعة القاهرة",
    fromYear: 2005,
    toYear: "present",
    fromText: "2005",
    toText: "حتى الآن",
  },
  {
    title: "نائب رئيس مركز البحوث والدراسات السياسية",
    institution: "جامعة القاهرة",
    fromYear: 2006,
    toYear: "present",
    fromText: "2006",
    toText: "حتى الآن",
  },
];

export interface ForeignStudy {
  fromYear: number;
  toYear: number;
  period: string;
  institution: string;
  country: string;
  purpose: string;
}

export const FOREIGN_STUDY: ForeignStudy[] = [
  {
    fromYear: 1985,
    toYear: 1988,
    period: "أبريل 1985 — يونيو 1988",
    institution: "جامعة ميريلاند",
    country: "الولايات المتحدة الأمريكية",
    purpose: "مهمة علمية لجمع المعلومات والبحث بتمويل كلية الاقتصاد والعلوم السياسية",
  },
  {
    fromYear: 1995,
    toYear: 1995,
    period: "يونيو — يوليو 1995",
    institution: "جامعة برلين الحرة",
    country: "ألمانيا",
    purpose:
      "منحة المؤسسة الألمانية لإجراء بحوث وسلسلة محاضرات في الدراسات السياسية الإسلامية",
  },
  {
    fromYear: 1999,
    toYear: 2004,
    period: "1999 — 2004",
    institution: "جامعة زايد",
    country: "الإمارات العربية المتحدة",
    purpose: "إعارة للتدريس",
  },
  {
    fromYear: 2008,
    toYear: 2012,
    period: "2008 — 2012",
    institution: "مؤسسة قطر",
    country: "قطر",
    purpose: "أستاذ في مؤسسة قطر للتربية والعلوم وتنمية المجتمع",
  },
];

export const TEACHING = [
  "مبادئ العلوم السياسية (بكالوريوس)",
  "النظرية السياسية (بكالوريوس)",
  "الفكر السياسي الإسلامي (بكالوريوس)",
  "حقوق الإنسان (بكالوريوس)",
  "الفكر السياسي (بكالوريوس)",
  "الفكر السياسي الإسلامي (دراسات عليا)",
] as const;

export const MEMBERSHIPS = [
  "المستشار الأكاديمي للمعهد العالمي للفكر الإسلامي (سابقًا)",
  "عضو مجلس إدارة مركز الدراسات المعرفية بالقاهرة",
  "عضو الهيئة التحريرية والاستشارية لمجلة المسلم المعاصر",
  "مدير مركز الدراسات السياسية — جامعة القاهرة",
  "نائب مدير مركز الدراسات الحضارية وحوار الثقافات بالقاهرة",
  "مدير مركز الحكم الراشد والسياسات العامة — مؤسسة قطر (سابقًا)",
  'منسق مشروع "التحول الديمقراطي ومراحل الانتقال في البلدان العربية" — المركز العربي للأبحاث ودراسة السياسات',
  "عضو هيئة تدريس جامعة العلوم الإسلامية والاجتماعية — فرجينيا",
] as const;

export interface BookEntry {
  title: string;
  publisher: string;
  year: number;
}

export const SELECTED_BOOKS: BookEntry[] = [
  {
    title: "مفهوم المواطنة",
    publisher: "مركز الفكر الإسلامي والدراسات المعاصرة — إسطنبول",
    year: 2022,
  },
  {
    title: "المواطنة: المفهوم والإشكالات",
    publisher: "مركز الفكر السياسي الإسلامي الإستراتيجي — إسطنبول",
    year: 2022,
  },
  {
    title: "عقلية الوهن",
    publisher: "دار القارئ العربي — القاهرة",
    year: 1991,
  },
  {
    title: "التجديد السياسي والواقع العربي المعاصر: رؤية إسلامية",
    publisher: "كلية الاقتصاد والعلوم السياسية — مكتبة النهضة المصرية، القاهرة",
    year: 1989,
  },
  {
    title:
      "النظرية السياسية من منظور حضاري إسلامي — منهجية التجديد السياسي وخبرة الواقع العربي المعاصر",
    publisher: "المعهد العالمي للفكر الإسلامي — القاهرة",
    year: 2002,
  },
  {
    title: "المجتمع المدني وأبعاده الفكرية (سلسلة حوارات لقرن جديد)",
    publisher: "دار الفكر — دمشق",
    year: 2003,
  },
];

export interface ThesisEntry {
  student: string;
  title: string;
  type: "ماجستير" | "دكتوراه";
  year: number;
  coAdvisors?: string[];
}

export const SELECTED_THESES: ThesisEntry[] = [
  {
    student: "هشام أحمد جعفر",
    title: "الأبعاد السياسية لمفهوم الحاكمية",
    type: "ماجستير",
    year: 1993,
    coAdvisors: ["أ.د. حورية توفيق مجاهد"],
  },
  {
    student: "إبراهيم البيومي غانم",
    title:
      "الأوقاف والسياسة: دراسة حالة في تطور العلاقة بين المجتمع والدولة في مصر الحديثة",
    type: "دكتوراه",
    year: 1997,
    coAdvisors: ["أ.د. كمال المنوفي"],
  },
  {
    student: "أماني عبد الرحمن صالح",
    title:
      "أزمة الشرعية في مؤسسة الخلافة الإسلامية: دراسة تحليلية لركائز وآليات الشرعية",
    type: "دكتوراه",
    year: 1998,
    coAdvisors: ["أ.د. كمال المنوفي"],
  },
  {
    student: "محمد سليمان عبد الله أبو رمان",
    title: "الإصلاح السياسي في الفكر الإسلامي المعاصر",
    type: "دكتوراه",
    year: 2009,
  },
  {
    student: "سامح محمد السيد المتولي",
    title: "العمران السياسي لدى ابن خلدون",
    type: "ماجستير",
    year: 2009,
  },
  {
    student: "أحمد نبيل صادق",
    title: "إسهام ابن خلدون في النظرية الدولية بين الفكر والحركة",
    type: "ماجستير",
    year: 2011,
    coAdvisors: ["أ.د. نادية مصطفى"],
  },
  {
    student: "خالد حسين عبد الله الزماري",
    title:
      "الفكر السياسي لأبي المعالي الجويني وإسهامه في الفكر الإسلامي المعاصر",
    type: "دكتوراه",
    year: 2012,
    coAdvisors: ["أ.د. حورية توفيق مجاهد"],
  },
  {
    student: "رضوى محمد عبده عدس",
    title: "المركزية الغربية",
    type: "دكتوراه",
    year: 2013,
    coAdvisors: ["أ.د. هبة رؤوف"],
  },
  {
    student: "كريم حسين متولي",
    title:
      "خطاب القيادة السياسية في تركيا وإيران تجاه قضية العلاقة بين الحضارات",
    type: "ماجستير",
    year: 2014,
  },
  {
    student: "وسام محمد الضويني",
    title: "إشكالية علاقة المجتمع بالدولة في العالم العربي",
    type: "ماجستير",
    year: 2015,
    coAdvisors: ["أ.د. هبة رؤوف"],
  },
];

// ─── Timeline ────────────────────────────────────────────────────────────────

export type TimelineKind =
  | "birth"
  | "education"
  | "career"
  | "travel"
  | "milestone";

export interface TimelineEvent {
  year: number;
  title: string;
  subtitle?: string;
  kind: TimelineKind;
  description?: string;
}

/** Build a merged chronological timeline from the above structured data. */
export function buildTimeline(): TimelineEvent[] {
  const events: TimelineEvent[] = [];

  events.push({
    year: PERSONAL.birthYear,
    title: "الميلاد",
    subtitle: PERSONAL.birthPlace,
    kind: "birth",
  });

  for (const d of DEGREES) {
    events.push({
      year: d.year,
      title: d.degree,
      subtitle: d.institution,
      kind: "education",
      description: d.thesis ? `موضوع الرسالة: ${d.thesis}` : undefined,
    });
  }

  for (const c of CAREER) {
    events.push({
      year: c.fromYear,
      title: c.title,
      subtitle: c.institution,
      kind: "career",
      description:
        c.toYear === "present"
          ? `من ${c.fromText} — ${c.toText}`
          : `${c.fromText} — ${c.toText}`,
    });
  }

  for (const f of FOREIGN_STUDY) {
    events.push({
      year: f.fromYear,
      title: f.institution,
      subtitle: f.country,
      kind: "travel",
      description: `${f.period} — ${f.purpose}`,
    });
  }

  return events.sort((a, b) => a.year - b.year);
}

// ─── Aggregate stats for the hero cards ──────────────────────────────────────

export function getQuickStats() {
  const currentYear = new Date().getFullYear();
  const teachingYears = currentYear - 1976;
  return {
    birthYear: PERSONAL.birthYear,
    teachingYears,
    degrees: DEGREES.length,
    supervisedTheses: SELECTED_THESES.length,
    books: SELECTED_BOOKS.length,
    professorSince: 1999,
  };
}
