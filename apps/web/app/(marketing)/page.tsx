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

// Star Rating Component
function StarRating({ rating }: { rating: number }) {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className={`flex items-start mb-4 ${isRTL ? 'space-x-reverse space-x-1' : 'space-x-1'}`}>
      {/* Full Stars */}
      {[...Array(fullStars)].map((_, i) => (
        <svg key={`full-${i}`} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
      ))}
      
      {/* Half Star */}
      {hasHalfStar && (
        <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
          <defs>
            <linearGradient id={`half-fill-${isRTL ? 'rtl' : 'ltr'}`}>
              {isRTL ? (
                <>
                  <stop offset="50%" stopColor="transparent"/>
                  <stop offset="50%" stopColor="currentColor"/>
                </>
              ) : (
                <>
                  <stop offset="50%" stopColor="currentColor"/>
                  <stop offset="50%" stopColor="transparent"/>
                </>
              )}
            </linearGradient>
          </defs>
          <path fill={`url(#half-fill-${isRTL ? 'rtl' : 'ltr'})`} d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
          <path fill="none" stroke="currentColor" strokeWidth="1" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
      )}
      
      {/* Empty Stars */}
      {[...Array(emptyStars)].map((_, i) => (
        <svg key={`empty-${i}`} className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 20 20">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
      ))}
    </div>
  );
}
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
    <div className={'min-h-screen flex flex-col space-y-24 py-14'}>
      <div className={'portfolio-bg px-4 md:container md:mx-auto relative z-20 -mt-8'}>
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
            <div className="w-3/4 mx-auto dark:border-primary/10 rounded-2xl border border-gray-200 overflow-hidden">
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
        className={'px-4 md:container md:mx-auto'}
        variants={VARIANTS_CONTAINER}
        initial="hidden"
        animate="visible"
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

      {/* Reviews Section - Hidden */}
      {/* <motion.section 
        className="py-16 px-4 sm:px-6 lg:px-8"
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl mb-4">
              <Trans i18nKey="marketing:testimonials.title" />
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            <div className="relative overflow-hidden rounded-xl bg-zinc-300/30 dark:bg-zinc-600/30 p-[1px]">
              <Spotlight
                className="from-yellow-600 via-yellow-500 to-amber-400 blur-2xl"
                size={64}
              />
              <div className="relative h-full w-full rounded-[15px] bg-white dark:bg-zinc-950 p-8">
                <StarRating rating={5} />
                
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  <Trans i18nKey="marketing:testimonials.review1.title" />
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                  <Trans i18nKey="marketing:testimonials.review1.content" />
                </p>
                
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm mr-3">
                    A
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      <Trans i18nKey="marketing:testimonials.review1.author" />
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      <Trans i18nKey="marketing:testimonials.review1.position" />
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-xl bg-zinc-300/30 dark:bg-zinc-600/30 p-[1px]">
              <Spotlight
                className="from-green-600 via-green-500 to-emerald-400 blur-2xl"
                size={64}
              />
              <div className="relative h-full w-full rounded-[15px] bg-white dark:bg-zinc-950 p-8">
                <StarRating rating={4.5} />
                
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  <Trans i18nKey="marketing:testimonials.review2.title" />
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                  <Trans i18nKey="marketing:testimonials.review2.content" />
                </p>
                
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center text-white font-semibold text-sm mr-3">
                    O
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      <Trans i18nKey="marketing:testimonials.review2.author" />
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      <Trans i18nKey="marketing:testimonials.review2.position" />
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-xl bg-zinc-300/30 dark:bg-zinc-600/30 p-[1px]">
              <Spotlight
                className="from-orange-600 via-orange-500 to-red-400 blur-2xl"
                size={64}
              />
              <div className="relative h-full w-full rounded-[15px] bg-white dark:bg-zinc-950 p-8">
                <StarRating rating={4} />
                
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  <Trans i18nKey="marketing:testimonials.review3.title" />
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                  <Trans i18nKey="marketing:testimonials.review3.content" />
                </p>
                
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white font-semibold text-sm mr-3">
                    K
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      <Trans i18nKey="marketing:testimonials.review3.author" />
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      <Trans i18nKey="marketing:testimonials.review3.position" />
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-xl bg-zinc-300/30 dark:bg-zinc-600/30 p-[1px]">
              <Spotlight
                className="from-purple-600 via-purple-500 to-pink-400 blur-2xl"
                size={64}
              />
              <div className="relative h-full w-full rounded-[15px] bg-white dark:bg-zinc-950 p-8">
                <StarRating rating={5} />
                
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  <Trans i18nKey="marketing:testimonials.review4.title" />
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                  <Trans i18nKey="marketing:testimonials.review4.content" />
                </p>
                
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-semibold text-sm mr-3">
                    H
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      <Trans i18nKey="marketing:testimonials.review4.author" />
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      <Trans i18nKey="marketing:testimonials.review4.position" />
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section> */}
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
