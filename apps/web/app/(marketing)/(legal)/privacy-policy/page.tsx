import { SitePageHeader } from '~/(marketing)/_components/site-page-header';
import { createI18nServerInstance } from '~/lib/i18n/i18n.server';
import { withI18n } from '~/lib/i18n/with-i18n';

export async function generateMetadata() {
  const { t } = await createI18nServerInstance();

  return {
    title: t('marketing:privacyPolicy'),
  };
}

async function PrivacyPolicyPage() {
  const { t } = await createI18nServerInstance();

  return (
    <div>
      <SitePageHeader
        title={t('marketing:privacyPolicy')}
        subtitle={t('marketing:privacyPolicyDescription')}
      />
      
      <div className="container py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">
            {t('marketing:privacyPolicyTitle')}
          </h2>
          <p className="text-justify leading-relaxed">
            {t('marketing:privacyWelcomeText')}
          </p>
        </div>

        <section>
          <h3 className="text-xl font-semibold mb-4 mt-6">
            {t('marketing:privacySection1Title')}
          </h3>
          <p className="leading-relaxed mb-3">
            {t('marketing:privacySection1Intro')}
          </p>
          <h4 className="text-lg font-medium mb-2 mt-4">{t('marketing:privacySection1SubA')}</h4>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li className="leading-relaxed">{t('marketing:privacySection1PointA1')}</li>
            <li className="leading-relaxed">{t('marketing:privacySection1PointA2')}</li>
          </ul>
          <h4 className="text-lg font-medium mb-2">{t('marketing:privacySection1SubB')}</h4>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li className="leading-relaxed">{t('marketing:privacySection1PointB1')}</li>
            <li className="leading-relaxed">{t('marketing:privacySection1PointB2')}</li>
          </ul>
          <h4 className="text-lg font-medium mb-2">{t('marketing:privacySection1SubC')}</h4>
          <ul className="list-disc pl-6 space-y-2">
            <li className="leading-relaxed">{t('marketing:privacySection1PointC1')}</li>
            <li className="leading-relaxed">{t('marketing:privacySection1PointC2')}</li>
          </ul>
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-4 mt-6">
            {t('marketing:privacySection2Title')}
          </h3>
          <p className="leading-relaxed mb-3">
            {t('marketing:privacySection2Intro')}
          </p>
          <ul className="list-disc pl-6 space-y-3">
            <li className="leading-relaxed">{t('marketing:privacySection2Point1')}</li>
            <li className="leading-relaxed">{t('marketing:privacySection2Point2')}</li>
            <li className="leading-relaxed">{t('marketing:privacySection2Point3')}</li>
            <li className="leading-relaxed">{t('marketing:privacySection2Point4')}</li>
            <li className="leading-relaxed">{t('marketing:privacySection2Point5')}</li>
            <li className="leading-relaxed">{t('marketing:privacySection2Point6')}</li>
          </ul>
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-4 mt-6">
            {t('marketing:privacySection3Title')}
          </h3>
          <p className="leading-relaxed mb-3">
            {t('marketing:privacySection3Intro')}
          </p>
          <ul className="list-disc pl-6 space-y-3">
            <li className="leading-relaxed">{t('marketing:privacySection3Point1')}</li>
            <li className="leading-relaxed">{t('marketing:privacySection3Point2')}</li>
            <li className="leading-relaxed">{t('marketing:privacySection3Point3')}</li>
          </ul>
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-4 mt-6">
            {t('marketing:privacySection4Title')}
          </h3>
          <p className="leading-relaxed">
            {t('marketing:privacySection4Content')}
          </p>
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-4 mt-6">
            {t('marketing:privacySection5Title')}
          </h3>
          <p className="leading-relaxed">
            {t('marketing:privacySection5Content')}
          </p>
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-4 mt-6">
            {t('marketing:privacySection6Title')}
          </h3>
          <p className="leading-relaxed mb-3">
            {t('marketing:privacySection6Intro')}
          </p>
          <ul className="list-disc pl-6 space-y-3 mb-3">
            <li className="leading-relaxed">{t('marketing:privacySection6Point1')}</li>
            <li className="leading-relaxed">{t('marketing:privacySection6Point2')}</li>
            <li className="leading-relaxed">{t('marketing:privacySection6Point3')}</li>
            <li className="leading-relaxed">{t('marketing:privacySection6Point4')}</li>
          </ul>
          <p className="leading-relaxed">
            {t('marketing:privacySection6Contact')}
          </p>
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-4 mt-6">
            {t('marketing:privacySection7Title')}
          </h3>
          <p className="leading-relaxed">
            {t('marketing:privacySection7Content')}
          </p>
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-4 mt-6">
            {t('marketing:privacySection8Title')}
          </h3>
          <p className="leading-relaxed">
            {t('marketing:privacySection8Content')}
          </p>
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-4 mt-6">
            {t('marketing:privacySection9Title')}
          </h3>
          <p className="leading-relaxed">
            {t('marketing:privacySection9Content')}
          </p>
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-4 mt-6">
            {t('marketing:privacySection10Title')}
          </h3>
          <p className="leading-relaxed">
            {t('marketing:privacySection10Content')}
          </p>
        </section>
      </div>
    </div>
  );
}

export default withI18n(PrivacyPolicyPage);
