import { SitePageHeader } from '~/(marketing)/_components/site-page-header';
import { createI18nServerInstance } from '~/lib/i18n/i18n.server';
import { withI18n } from '~/lib/i18n/with-i18n';

export async function generateMetadata() {
  const { t } = await createI18nServerInstance();

  return {
    title: t('marketing:cookiePolicy'),
  };
}

async function CookiePolicyPage() {
  const { t } = await createI18nServerInstance();

  return (
    <div>
      <SitePageHeader
        title={t(`marketing:cookiePolicy`)}
        subtitle={t(`marketing:cookiePolicyDescription`)}
      />
      
      <div className="container py-8">
        <section>
          <h3 className="text-xl font-semibold mb-4 mt-6">
            {t('marketing:cookieSection1Title')}
          </h3>
          <p className="leading-relaxed">
            {t('marketing:cookieSection1Content')}
          </p>
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-4 mt-6">
            {t('marketing:cookieSection2Title')}
          </h3>
          <h4 className="text-lg font-medium mb-2 mt-4">{t('marketing:cookieSection2SubA')}</h4>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li className="leading-relaxed">{t('marketing:cookieSection2PointA1')}</li>
            <li className="leading-relaxed">{t('marketing:cookieSection2PointA2')}</li>
          </ul>
          <h4 className="text-lg font-medium mb-2">{t('marketing:cookieSection2SubB')}</h4>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li className="leading-relaxed">{t('marketing:cookieSection2PointB1')}</li>
            <li className="leading-relaxed">{t('marketing:cookieSection2PointB2')}</li>
          </ul>
          <h4 className="text-lg font-medium mb-2">{t('marketing:cookieSection2SubC')}</h4>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li className="leading-relaxed">{t('marketing:cookieSection2PointC1')}</li>
          </ul>
          <h4 className="text-lg font-medium mb-2">{t('marketing:cookieSection2SubD')}</h4>
          <ul className="list-disc pl-6 space-y-2">
            <li className="leading-relaxed">{t('marketing:cookieSection2PointD1')}</li>
            <li className="leading-relaxed">{t('marketing:cookieSection2PointD2')}</li>
          </ul>
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-4 mt-6">
            {t('marketing:cookieSection3Title')}
          </h3>
          <p className="leading-relaxed mb-3">
            {t('marketing:cookieSection3Intro')}
          </p>
          <ul className="list-disc pl-6 space-y-3">
            <li className="leading-relaxed">{t('marketing:cookieSection3Point1')}</li>
            <li className="leading-relaxed">{t('marketing:cookieSection3Point2')}</li>
            <li className="leading-relaxed">{t('marketing:cookieSection3Point3')}</li>
            <li className="leading-relaxed">{t('marketing:cookieSection3Point4')}</li>
            <li className="leading-relaxed">{t('marketing:cookieSection3Point5')}</li>
          </ul>
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-4 mt-6">
            {t('marketing:cookieSection4Title')}
          </h3>
          <p className="leading-relaxed">
            {t('marketing:cookieSection4Content')}
          </p>
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-4 mt-6">
            {t('marketing:cookieSection5Title')}
          </h3>
          <p className="leading-relaxed mb-3">
            {t('marketing:cookieSection5Content')}
          </p>
          <p className="leading-relaxed mb-3">
            {t('marketing:cookieSection5Info')}
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li className="leading-relaxed">
              <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                {t('marketing:cookieSection5Chrome')}
              </a>
            </li>
            <li className="leading-relaxed">
              <a href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                {t('marketing:cookieSection5Firefox')}
              </a>
            </li>
            <li className="leading-relaxed">
              <a href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                {t('marketing:cookieSection5Safari')}
              </a>
            </li>
            <li className="leading-relaxed">
              <a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                {t('marketing:cookieSection5Edge')}
              </a>
            </li>
          </ul>
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-4 mt-6">
            {t('marketing:cookieSection6Title')}
          </h3>
          <p className="leading-relaxed">
            {t('marketing:cookieSection6Content')}
          </p>
        </section>
      </div>
    </div>
  );
}

export default withI18n(CookiePolicyPage);
