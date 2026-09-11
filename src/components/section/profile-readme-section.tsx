import { languageStore } from '@store/language-store';
import { observer } from 'mobx-react-lite';

const career = [
  [
    'M Biz Consultant Co., Ltd.',
    'Software Developer',
    'Jan 2025 – Present',
    'ม.ค. 2025 – ปัจจุบัน',
  ],
  ['ADot', 'Software Developer', 'May 2024 – Dec 2024', 'พ.ค. 2024 – ธ.ค. 2024'],
  [
    'Stream South Technology',
    'Developer Intern · nimitr.art',
    'Jul 2023 – Oct 2023',
    'ก.ค. 2023 – ต.ค. 2023',
  ],
  ['Isuzu Hatyai Co., Ltd.', 'Summer Intern', 'Mar 2019 – May 2019', 'มี.ค. 2019 – พ.ค. 2019'],
] as const;

export const ProfileReadmeSection = observer(() => {
  const thai = languageStore.language === 'th';
  return (
    <section
      id="profile-readme"
      className="container-responsive section-pad mx-auto w-full max-w-7xl"
    >
      <p className="eyebrow text-primary">WuttichaiSukantho / README</p>
      <h2 className="heading-section mt-4">
        {thai ? 'โปรไฟล์ด้านวิศวกรรม' : 'Engineering profile'}
      </h2>
      <p className="prose-muted mt-4 max-w-3xl">
        {thai
          ? 'ข้อมูลจาก GitHub profile README แสดงแยกจากประวัติในแอปด้านบน เนื่องจากวันที่ของ ADot และ Stream South รวมถึงรายการ M Biz ปี 2024 แตกต่างกันระหว่างแหล่งข้อมูล'
          : 'From the GitHub profile README, shown separately from the app history above. The sources differ on ADot and Stream South dates and the 2024 M Biz entry.'}
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {career.map(([company, role, en, th]) => (
          <article key={company} className="surface p-6">
            <p className="text-sm text-primary">{thai ? th : en}</p>
            <h3 className="mt-2 text-lg font-semibold">{company}</h3>
            <p className="prose-muted mt-1">{role}</p>
          </article>
        ))}
      </div>
      <div className="surface mt-6 p-6">
        <h3 className="text-lg font-semibold">
          {thai ? 'การศึกษาจากโปรไฟล์' : 'Education from the profile'}
        </h3>
        <p className="prose-muted mt-3">
          {thai
            ? 'บริหารธุรกิจบัณฑิต สาขาระบบสารสนเทศทางธุรกิจ · มหาวิทยาลัยเทคโนโลยีราชมงคลศรีวิชัย · ก.ค. 2020 – พ.ค. 2023 · เกรดเฉลี่ย 3.68'
            : 'BBA, Business Information System · Rajamangala University of Technology Srivijaya · July 2020 – May 2023 · Grade 3.68'}
        </p>
        <p className="prose-muted mt-3">
          {thai
            ? 'ประกาศนียบัตรวิชาชีพ คอมพิวเตอร์ธุรกิจ · วิทยาลัยเทคโนโลยีอำนวยวิทย์หาดใหญ่ · 2016 – 2020'
            : 'Vocational Certificate, Business Computer · Amnuaywit Hatyai Technology College · 2016 – 2020'}
        </p>
      </div>
      <img
        src="/wuttichai.github.io/profile/engineering-flow.svg"
        alt="TypeScript client, APIs, PostgreSQL and Redis request flow"
        width={900}
        height={190}
        loading="lazy"
        className="mt-8 h-auto w-full rounded-xl"
      />
      <a
        href="https://github.com/WuttichaiSukantho/WuttichaiSukantho"
        className="mt-5 inline-block text-primary underline underline-offset-4"
      >
        {thai ? 'อ่านโปรไฟล์ต้นฉบับบน GitHub' : 'Read the original GitHub profile'}
      </a>
      <figure className="surface mt-10 p-5 sm:p-8">
        <figcaption className="mb-5 text-xl font-semibold">
          {thai ? 'การทำงานของพอร์ตโฟลิโอ' : 'How this portfolio works'}
        </figcaption>
        <img
          src="/wuttichai.github.io/profile/architecture.svg"
          alt={thai ? 'แหล่งข้อมูลเข้าสู่การสร้างเว็บไซต์ GitHub Pages ให้บริการ React และสถานะ MobX ภายในเบราว์เซอร์' : 'Content sources feed the static build. GitHub Pages serves React with local MobX interactions.'}
          width={960}
          height={810}
          loading="lazy"
          className="mx-auto h-auto w-full max-w-3xl rounded-xl"
        />
        <a href="/wuttichai.github.io/profile/architecture.mmd" download className="mt-4 inline-block text-primary underline underline-offset-4">
          {thai ? 'ดาวน์โหลด Mermaid' : 'Download Mermaid source'}
        </a>
      </figure>
    </section>
  );
});
