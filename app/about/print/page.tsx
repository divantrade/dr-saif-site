import type { Metadata } from "next";
import Image from "next/image";
import PrintButton from "@/components/PrintButton";
import {
  PERSONAL,
  DEGREES,
  CAREER,
  FOREIGN_STUDY,
  TEACHING,
  MEMBERSHIPS,
  SELECTED_BOOKS,
  SELECTED_THESES,
} from "@/lib/cv";
import { SITE } from "@/lib/site";

const PORTRAIT =
  "https://www.saifabdelfattah.net/wp-content/uploads/2023/02/dr-site-m.png";

const currentYear = new Date().getFullYear();

export const metadata: Metadata = {
  title: "السيرة الذاتية — نسخة للطباعة",
  description: `السيرة الذاتية الكاملة للأستاذ ${PERSONAL.fullName}`,
  robots: { index: false, follow: false },
};

export default function PrintCVPage() {
  return (
    <>
      <PrintButton />
      <div className="cv-page">
        {/* ── Page header ────────────────────────────────────────────────── */}
        <header className="cv-hero">
          <div className="cv-hero-side">
            <div className="cv-portrait">
              <Image
                src={PORTRAIT}
                alt={PERSONAL.displayName}
                fill
                className="object-cover"
                style={{ objectPosition: "center top" }}
                sizes="120px"
                priority
              />
            </div>
            <div className="cv-contact">
              <p className="cv-contact-label">{SITE.url.replace("https://", "")}</p>
            </div>
          </div>
          <div className="cv-hero-main">
            <p className="cv-eyebrow">السيرة الذاتية</p>
            <h1 className="cv-name">
              {PERSONAL.honorific} {PERSONAL.displayName}
            </h1>
            <p className="cv-title">{PERSONAL.currentTitle}</p>
            <p className="cv-affiliation">{PERSONAL.affiliation}</p>
          </div>
        </header>

        {/* ── Summary bar ────────────────────────────────────────────────── */}
        <section className="cv-summary-bar">
          <Fact label="تاريخ الميلاد" value={PERSONAL.birthDate} />
          <Fact label="محل الميلاد" value={PERSONAL.birthPlace} />
          <Fact label="الجنسية" value={PERSONAL.nationality} />
          <Fact label="الحالة الاجتماعية" value={PERSONAL.maritalStatus} />
        </section>

        <section className="cv-specialty">
          <span className="cv-specialty-label">التخصص الدقيق: </span>
          <span>{PERSONAL.specialty}</span>
        </section>

        {/* ── Degrees ────────────────────────────────────────────────────── */}
        <CvSection title="الدرجات العلمية والأكاديمية" number="١">
          <div className="cv-degrees">
            {DEGREES.map((d, i) => (
              <article key={i} className="cv-degree">
                <div className="cv-degree-year">{d.year}</div>
                <div className="cv-degree-body">
                  <h3 className="cv-degree-title">{d.degree}</h3>
                  <p className="cv-degree-inst">{d.institution}</p>
                  <p className="cv-degree-meta">
                    <span>التاريخ: {d.dateText}</span>
                    <span>التقدير: {d.grade}</span>
                  </p>
                  {d.thesis && (
                    <p className="cv-degree-thesis">
                      <strong>موضوع الرسالة: </strong>
                      {d.thesis}
                    </p>
                  )}
                  {d.advisors && (
                    <p className="cv-degree-advisors">
                      <strong>الإشراف: </strong>
                      {d.advisors.join("، ")}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        </CvSection>

        {/* ── Career ─────────────────────────────────────────────────────── */}
        <CvSection title="تطوّر الوظائف المهنية" number="٢">
          <table className="cv-career-table">
            <thead>
              <tr>
                <th>المدة</th>
                <th>الوظيفة</th>
                <th>المؤسسة</th>
              </tr>
            </thead>
            <tbody>
              {CAREER.map((c, i) => (
                <tr key={i} className={c.highlight ? "cv-row-highlight" : ""}>
                  <td className="cv-nowrap">
                    {c.fromText} — {c.toText}
                  </td>
                  <td>
                    <strong>{c.title}</strong>
                    {c.specialty && (
                      <div className="cv-subtle">{c.specialty}</div>
                    )}
                  </td>
                  <td>{c.institution}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CvSection>

        {/* ── Foreign study ──────────────────────────────────────────────── */}
        <CvSection title="فترات الدراسة والبحث في الخارج" number="٣">
          <ul className="cv-list">
            {FOREIGN_STUDY.map((f, i) => (
              <li key={i} className="cv-list-item">
                <strong>
                  {f.period} — {f.institution} ({f.country})
                </strong>
                <div className="cv-subtle">{f.purpose}</div>
              </li>
            ))}
          </ul>
        </CvSection>

        {/* ── Teaching ───────────────────────────────────────────────────── */}
        <CvSection title="المواد التي قام بتدريسها" number="٤">
          <ul className="cv-teaching">
            {TEACHING.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        </CvSection>

        {/* ── Memberships ────────────────────────────────────────────────── */}
        <CvSection title="الأنشطة العلمية والعضويات" number="٥">
          <ul className="cv-list">
            {MEMBERSHIPS.map((m, i) => (
              <li key={i} className="cv-list-item">
                {m}
              </li>
            ))}
          </ul>
        </CvSection>

        {/* ── Theses ─────────────────────────────────────────────────────── */}
        <CvSection title="نماذج من الإشراف الأكاديمي" number="٦">
          <table className="cv-theses-table">
            <thead>
              <tr>
                <th>السنة</th>
                <th>النوع</th>
                <th>الباحث والعنوان</th>
              </tr>
            </thead>
            <tbody>
              {SELECTED_THESES.map((t, i) => (
                <tr key={i}>
                  <td className="cv-nowrap cv-center tabular-nums">{t.year}</td>
                  <td className="cv-nowrap cv-center">{t.type}</td>
                  <td>
                    <strong>{t.title}</strong>
                    <div className="cv-subtle">
                      الباحث: {t.student}
                      {t.coAdvisors && t.coAdvisors.length > 0 && (
                        <> — بالإشراف مع {t.coAdvisors.join("، ")}</>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CvSection>

        {/* ── Books ──────────────────────────────────────────────────────── */}
        <CvSection title="نماذج من المؤلفات والكتب" number="٧">
          <ul className="cv-books">
            {SELECTED_BOOKS.map((b, i) => (
              <li key={i} className="cv-book">
                <strong>{b.title}</strong>
                <div className="cv-subtle">
                  {b.publisher} — {b.year}
                </div>
              </li>
            ))}
          </ul>
        </CvSection>

        <footer className="cv-footer">
          <p>
            السيرة الذاتية — {PERSONAL.fullName} — نسخة مُحدَّثة {currentYear}
          </p>
          <p>{SITE.url}</p>
        </footer>
      </div>

      {/* ── Styles scoped to this page ─────────────────────────────────── */}
      <style>{`
        /* Hide the site chrome (header, footer) while this print page is shown */
        body > header, body > footer { display: none !important; }
        main { flex: none !important; }
        body { background: #f3f4f6 !important; min-height: auto !important; }
        @media print {
          body { background: #ffffff !important; }
        }
        @page {
          size: A4;
          margin: 14mm 16mm;
        }
        .cv-page {
          max-width: 210mm;
          min-height: 297mm;
          margin: 24px auto;
          padding: 28px 32px;
          background: #ffffff;
          color: #111827;
          box-shadow: 0 10px 40px rgba(0,0,0,0.08);
          line-height: 1.7;
          font-size: 10.5pt;
        }
        @media print {
          .cv-page {
            margin: 0;
            padding: 0;
            box-shadow: none;
            min-height: auto;
          }
        }
        .cv-hero {
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 20px;
          align-items: center;
          padding-bottom: 18px;
          border-bottom: 3px solid #047857;
          margin-bottom: 18px;
        }
        .cv-hero-side {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }
        .cv-portrait {
          position: relative;
          width: 110px;
          height: 110px;
          border-radius: 50%;
          overflow: hidden;
          border: 3px solid #047857;
          box-shadow: 0 4px 12px rgba(4,120,87,0.2);
        }
        .cv-contact-label {
          font-size: 8pt;
          color: #047857;
          font-weight: 600;
          letter-spacing: 0.2px;
        }
        .cv-eyebrow {
          color: #047857;
          font-size: 10pt;
          font-weight: 700;
          letter-spacing: 2px;
          margin-bottom: 4px;
        }
        .cv-name {
          font-size: 22pt;
          font-weight: 800;
          color: #064e3b;
          margin: 0 0 6px;
          line-height: 1.25;
        }
        .cv-title {
          font-size: 13pt;
          color: #047857;
          font-weight: 600;
          margin: 0 0 2px;
        }
        .cv-affiliation {
          font-size: 10pt;
          color: #6b7280;
          margin: 0;
        }
        .cv-summary-bar {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          border-radius: 8px;
          padding: 10px 14px;
          margin-bottom: 12px;
        }
        .cv-fact-label {
          font-size: 8.5pt;
          color: #065f46;
          font-weight: 700;
          margin-bottom: 2px;
        }
        .cv-fact-value {
          font-size: 9.5pt;
          color: #111827;
        }
        .cv-specialty {
          background: #f9fafb;
          border-right: 3px solid #047857;
          padding: 8px 14px;
          margin-bottom: 22px;
          border-radius: 0 6px 6px 0;
          font-size: 9.5pt;
        }
        .cv-specialty-label {
          font-weight: 700;
          color: #047857;
        }
        .cv-section {
          margin-bottom: 20px;
          page-break-inside: avoid;
        }
        .cv-section-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 12px;
          padding-bottom: 6px;
          border-bottom: 2px solid #e5e7eb;
        }
        .cv-section-number {
          width: 26px;
          height: 26px;
          background: #047857;
          color: white;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 11pt;
        }
        .cv-section-title {
          font-size: 14pt;
          font-weight: 800;
          color: #064e3b;
          margin: 0;
        }
        .cv-degrees {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .cv-degree {
          display: grid;
          grid-template-columns: 56px 1fr;
          gap: 14px;
          background: #fafafa;
          border: 1px solid #f3f4f6;
          border-radius: 8px;
          padding: 10px 14px;
          page-break-inside: avoid;
        }
        .cv-degree-year {
          font-size: 18pt;
          font-weight: 900;
          color: #047857;
          text-align: center;
          align-self: center;
        }
        .cv-degree-title {
          font-size: 11.5pt;
          font-weight: 700;
          color: #111827;
          margin: 0 0 2px;
        }
        .cv-degree-inst {
          color: #6b7280;
          margin: 0 0 4px;
          font-size: 9.5pt;
        }
        .cv-degree-meta {
          display: flex;
          gap: 18px;
          flex-wrap: wrap;
          font-size: 9pt;
          color: #374151;
          margin: 0 0 4px;
        }
        .cv-degree-thesis, .cv-degree-advisors {
          font-size: 9pt;
          color: #374151;
          margin: 2px 0 0;
        }
        .cv-career-table,
        .cv-theses-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 9.5pt;
        }
        .cv-career-table th,
        .cv-theses-table th {
          background: #064e3b;
          color: #fff;
          font-weight: 700;
          text-align: right;
          padding: 8px 10px;
          font-size: 9.5pt;
        }
        .cv-career-table th:first-child,
        .cv-theses-table th:first-child {
          border-radius: 0 6px 0 0;
        }
        .cv-career-table th:last-child,
        .cv-theses-table th:last-child {
          border-radius: 6px 0 0 0;
        }
        .cv-career-table td,
        .cv-theses-table td {
          padding: 7px 10px;
          border-bottom: 1px solid #e5e7eb;
          vertical-align: top;
        }
        .cv-career-table tr:last-child td,
        .cv-theses-table tr:last-child td {
          border-bottom: none;
        }
        .cv-row-highlight {
          background: #ecfdf5;
        }
        .cv-nowrap { white-space: nowrap; }
        .cv-center { text-align: center; }
        .cv-subtle {
          color: #6b7280;
          font-size: 8.5pt;
          margin-top: 2px;
          line-height: 1.5;
        }
        .cv-list { margin: 0; padding: 0; list-style: none; }
        .cv-list-item {
          padding: 6px 14px;
          border-right: 3px solid #047857;
          margin-bottom: 6px;
          background: #f9fafb;
          border-radius: 0 4px 4px 0;
          font-size: 9.5pt;
        }
        .cv-teaching {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 6px 14px;
          margin: 0;
          padding: 0;
          list-style: none;
        }
        .cv-teaching li {
          padding: 6px 10px;
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          border-radius: 6px;
          font-size: 9.5pt;
          color: #064e3b;
        }
        .cv-books {
          margin: 0;
          padding: 0;
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .cv-book {
          padding: 8px 12px;
          background: #fafafa;
          border-right: 3px solid #047857;
          border-radius: 0 4px 4px 0;
          font-size: 9.5pt;
        }
        .cv-footer {
          margin-top: 28px;
          padding-top: 12px;
          border-top: 2px solid #e5e7eb;
          text-align: center;
          color: #9ca3af;
          font-size: 8.5pt;
        }
        .cv-footer p { margin: 2px 0; }
        @media (max-width: 640px) {
          .cv-hero { grid-template-columns: 1fr; text-align: center; }
          .cv-summary-bar { grid-template-columns: repeat(2, 1fr); }
          .cv-teaching { grid-template-columns: 1fr; }
        }
      `}</style>
    </>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="cv-fact-label">{label}</div>
      <div className="cv-fact-value">{value}</div>
    </div>
  );
}

function CvSection({
  title,
  number,
  children,
}: {
  title: string;
  number: string;
  children: React.ReactNode;
}) {
  return (
    <section className="cv-section">
      <header className="cv-section-header">
        <span className="cv-section-number">{number}</span>
        <h2 className="cv-section-title">{title}</h2>
      </header>
      {children}
    </section>
  );
}
