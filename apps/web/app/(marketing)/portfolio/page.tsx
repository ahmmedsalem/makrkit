'use client';

import Link from 'next/link';

import { LayoutDashboard } from 'lucide-react';

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

import TradingViewTimeline from '../_components/trading-view-timeline';

function PortfolioPage() {
  const { t, i18n } = useTranslation(['marketing']);

  return (
    <div className={'portfolio-bg min-h-screen flex flex-col space-y-24 py-14'}>
      <div className={'px-4 md:container md:mx-auto relative z-20'}>
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
    </div>
  );
}

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

export default PortfolioPage;