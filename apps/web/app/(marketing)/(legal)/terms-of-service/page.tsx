import { SitePageHeader } from '~/(marketing)/_components/site-page-header';
import { createI18nServerInstance } from '~/lib/i18n/i18n.server';
import { withI18n } from '~/lib/i18n/with-i18n';

export async function generateMetadata() {
  const { t } = await createI18nServerInstance();

  return {
    title: t('marketing:termsOfService'),
  };
}

async function TermsOfServicePage() {
  const { t } = await createI18nServerInstance();

  return (
    <div>
      <SitePageHeader
        title={t(`marketing:termsOfService`)}
        subtitle={t(`marketing:termsOfServiceDescription`)}
      />
      
      <div className="container py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">
            {t('marketing:termsAndConditions')}
          </h2>
          <p className="text-justify leading-relaxed">
            {t('marketing:termsWelcomeText')}
          </p>
        </div>
        <section>
          <h3 className="text-xl font-semibold mb-4 mt-6">
            {t('marketing:section1Title')}
          </h3>
          <ul className="list-disc pl-6 space-y-3">
            <li className="leading-relaxed">
              {t('marketing:section1Point1')}
            </li>
            <li className="leading-relaxed">
              {t('marketing:section1Point2')}
            </li>
          </ul>
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-4 mt-6">
            {t('marketing:section2Title')}
          </h3>
          <ul className="list-disc pl-6 space-y-3">
            <li className="leading-relaxed">
              {t('marketing:section2Point1')}
            </li>
            <li className="leading-relaxed">
              {t('marketing:section2Point2')}
            </li>
            <li className="leading-relaxed">
              {t('marketing:section2Point3')}
            </li>
          </ul>
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-4 mt-6">
            {t('marketing:section3Title')}
          </h3>
          <ul className="list-disc pl-6 space-y-3">
            <li className="leading-relaxed">
              {t('marketing:section3Point1')}
            </li>
            <li className="leading-relaxed">
              {t('marketing:section3Point2')}
            </li>
            <li className="leading-relaxed">
              {t('marketing:section3Point3')}
            </li>
          </ul>
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-4 mt-6">
            {t('marketing:section4Title')}
          </h3>
          <ul className="list-disc pl-6 space-y-3">
            <li className="leading-relaxed">
              {t('marketing:section4Point1')}
            </li>
            <li className="leading-relaxed">
              {t('marketing:section4Point2')}
            </li>
          </ul>
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-4 mt-6">
            {t('marketing:section5Title')}
          </h3>
          <ul className="list-disc pl-6 space-y-3">
            <li className="leading-relaxed">
              {t('marketing:section5Point1')}
            </li>
            <li className="leading-relaxed">
              {t('marketing:section5Point2')}
            </li>
            <li className="leading-relaxed">
              {t('marketing:section5Point3')}
            </li>
          </ul>
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-4 mt-6">
            {t('marketing:section6Title')}
          </h3>
          <ul className="list-disc pl-6 space-y-3">
            <li className="leading-relaxed">
              {t('marketing:section6Point1')}
            </li>
            <li className="leading-relaxed">
              {t('marketing:section6Point2')}
            </li>
            <li className="leading-relaxed">
              {t('marketing:section6Point3')}
            </li>
          </ul>
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-4 mt-6">
            {t('marketing:section7Title')}
          </h3>
          <ul className="list-disc pl-6 space-y-3">
            <li className="leading-relaxed">
              {t('marketing:section7Point1')}
            </li>
            <li className="leading-relaxed">
              {t('marketing:section7Point2')}
            </li>
            <li className="leading-relaxed">
              {t('marketing:section7Point3')}
            </li>
          </ul>
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-4 mt-6">
            {t('marketing:section8Title')}
          </h3>
          <p className="leading-relaxed">
            {t('marketing:section8Content')}
          </p>
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-4 mt-6">
            {t('marketing:section9Title')}
          </h3>
          <p className="leading-relaxed">
            {t('marketing:section9Content')}
          </p>
        </section>
      </div>
    </div>
  );
}

export default withI18n(TermsOfServicePage);
