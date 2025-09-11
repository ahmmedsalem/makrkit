'use client';

import Link from 'next/link';

import { LayoutDashboard } from 'lucide-react';

// import { usePersonalAccountData } from '@kit/accounts/hooks/use-personal-account-data';
import {
  CtaButton,
  FeatureCard,
  FeatureGrid,
  FeatureShowcase,
  FeatureShowcaseIconContainer,
  Hero,
  Pill,
} from '@kit/ui/marketing';
import { Trans } from '@kit/ui/trans';
import { DirectionalArrowRight } from '@kit/ui/directional-arrow';

import { useTranslation } from 'react-i18next';

import TradingViewTimeline from './_components/trading-view-timeline';

function Home() {
  const { t, i18n } = useTranslation(['marketing']);
  // const user = usePersonalAccountData('ec9e869c-72b2-4eab-8df0-237492b17945');

  // console.log('user', user);
  return (
    <div className={'mt-4 flex flex-col space-y-24 py-14'}>
      <div className={'container mx-auto'}>
        <Hero
          pill={
            <Pill label={t('heroTagNew')}>
              <span>
                <Trans i18nKey="marketing:heroTagline" />
              </span>
            </Pill>
          }
          title={
            <>
              <span>
                <Trans i18nKey="marketing:heroTitle1" />
              </span>
              <span>
                <Trans i18nKey="marketing:heroTitle2" />
              </span>
            </>
          }
          subtitle={
            <span>
              <Trans i18nKey="marketing:heroSubtitle" />
            </span>
          }
          cta={<MainCallToActionButton />}
          image={
            <div key={i18n.language} className="w-full dark:border-primary/10 rounded-2xl border border-gray-200 overflow-hidden">
              <TradingViewTimeline />
            </div>
          }
        />
      </div>

      <div className={'container mx-auto'}>
        <div
          className={'flex flex-col space-y-16 xl:space-y-32 2xl:space-y-36'}
        >
          <FeatureShowcase
            heading={
              <>
                <b className="font-semibold dark:text-white">
                  <Trans i18nKey="marketing:featureShowcaseHeading" />
                </b>
                .{' '}
                <span className="text-muted-foreground font-normal">
                  <Trans i18nKey="marketing:featureShowcaseSubheading" />
                </span>
              </>
            }
            icon={
              <FeatureShowcaseIconContainer>
                <LayoutDashboard className="h-5" />
                <span>
                  <Trans i18nKey="marketing:allInOneSolution" />
                </span>
              </FeatureShowcaseIconContainer>
            }
          >
            <FeatureGrid>
              <FeatureCard
                className={'relative col-span-2 overflow-hidden'}
                label={t('instantDashboard')}
                description={t('instantDashboardDescription')}
              />

              <FeatureCard
                className={
                  'relative col-span-2 w-full overflow-hidden lg:col-span-1'
                }
                label={t('authentication')}
                description={t('authenticationDescription')}
              />

              <FeatureCard
                className={'relative col-span-2 overflow-hidden lg:col-span-1'}
                label={t('multiTenancy')}
                description={t('multiTenancyDescription')}
              />

              <FeatureCard
                className={'relative col-span-2 overflow-hidden'}
                label={t('billing')}
                description={t('billingDescription')}
              />
            </FeatureGrid>
          </FeatureShowcase>
        </div>
      </div>
    </div>
  );
}

export default Home;

function MainCallToActionButton() {
  return (
    <div className={'flex space-x-4'}>
      <CtaButton>
        <Link href={'/auth?tab=signup'}>
          <span className={'flex items-center space-x-0.5'}>
            <span>
              <Trans i18nKey={'common:getStarted'} />
            </span>

            <DirectionalArrowRight
              className={
                'animate-in fade-in slide-in-from-left-8 h-4' +
                ' zoom-in fill-mode-both delay-1000 duration-1000'
              }
            />
          </span>
        </Link>
      </CtaButton>

      <CtaButton variant={'link'}>
        <Link href={'/contact'}>
          <Trans i18nKey={'common:contactUs'} />
        </Link>
      </CtaButton>
    </div>
  );
}
