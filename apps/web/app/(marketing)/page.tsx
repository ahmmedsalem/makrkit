'use client';

import Link from 'next/link';

import { LayoutDashboard } from 'lucide-react';

// import { usePersonalAccountData } from '@kit/accounts/hooks/use-personal-account-data';
import {
  CtaButton,
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
import { Spotlight } from '~/components/ui/spotlight';
import { motion } from 'motion/react';

const VARIANTS_CONTAINER = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
}

const VARIANTS_SECTION = {
  hidden: { opacity: 0, y: 20, filter: 'blur(8px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
}

const TRANSITION_SECTION = {
  duration: 0.3,
}

function Home() {
  const { t, i18n } = useTranslation(['marketing']);
  // const user = usePersonalAccountData('ec9e869c-72b2-4eab-8df0-237492b17945');

  // console.log('user', user);
  return (
    <motion.div 
      className={'portfolio-bg min-h-screen flex flex-col space-y-24 py-14'}
      variants={VARIANTS_CONTAINER}
      initial="hidden"
      animate="visible"
    >
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
            <div className="w-full dark:border-primary/10 rounded-2xl border border-gray-200 overflow-hidden">
              <img 
                src="/images/trading-bg.jpg" 
                alt="Trading Dashboard"
                className="w-full h-auto"
              />
            </div>
          }
        />
      </div>

      <motion.section
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
      >
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
                <div className="relative col-span-2 overflow-hidden rounded-2xl bg-zinc-300/30 dark:bg-zinc-600/30 p-[1px]">
                  <Spotlight
                    className="from-blue-600 via-blue-500 to-cyan-400 blur-2xl"
                    size={64}
                  />
                  <div className="relative h-full w-full rounded-[15px] bg-white dark:bg-zinc-950 p-4">
                    <div className="space-y-2">
                      <h4 className="font-medium text-xl text-zinc-900 dark:text-zinc-100">
                        {t('instantDashboard')}
                      </h4>
                      <p className="text-muted-foreground max-w-xs text-sm font-normal">
                        {t('instantDashboardDescription')}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="relative col-span-2 w-full overflow-hidden lg:col-span-1 rounded-2xl bg-zinc-300/30 dark:bg-zinc-600/30 p-[1px]">
                  <Spotlight
                    className="from-purple-600 via-purple-500 to-pink-400 blur-2xl"
                    size={64}
                  />
                  <div className="relative h-full w-full rounded-[15px] bg-white dark:bg-zinc-950 p-4">
                    <div className="space-y-2">
                      <h4 className="font-medium text-xl text-zinc-900 dark:text-zinc-100">
                        {t('authentication')}
                      </h4>
                      <p className="text-muted-foreground max-w-xs text-sm font-normal">
                        {t('authenticationDescription')}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="relative col-span-2 overflow-hidden lg:col-span-1 rounded-2xl bg-zinc-300/30 dark:bg-zinc-600/30 p-[1px]">
                  <Spotlight
                    className="from-green-600 via-green-500 to-emerald-400 blur-2xl"
                    size={64}
                  />
                  <div className="relative h-full w-full rounded-[15px] bg-white dark:bg-zinc-950 p-4">
                    <div className="space-y-2">
                      <h4 className="font-medium text-xl text-zinc-900 dark:text-zinc-100">
                        {t('multiTenancy')}
                      </h4>
                      <p className="text-muted-foreground max-w-xs text-sm font-normal">
                        {t('multiTenancyDescription')}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="relative col-span-2 overflow-hidden rounded-2xl bg-zinc-300/30 dark:bg-zinc-600/30 p-[1px]">
                  <Spotlight
                    className="from-orange-600 via-orange-500 to-yellow-400 blur-2xl"
                    size={64}
                  />
                  <div className="relative h-full w-full rounded-[15px] bg-white dark:bg-zinc-950 p-4">
                    <div className="space-y-2">
                      <h4 className="font-medium text-xl text-zinc-900 dark:text-zinc-100">
                        {t('billing')}
                      </h4>
                      <p className="text-muted-foreground max-w-xs text-sm font-normal">
                        {t('billingDescription')}
                      </p>
                    </div>
                  </div>
                </div>
              </FeatureGrid>
            </FeatureShowcase>
          </div>
        </div>
      </motion.section>
    </motion.div>
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
