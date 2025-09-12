'use client'
import { motion } from 'motion/react'
import { Spotlight } from '@/components/ui/spotlight'
import { Magnetic } from '@/components/ui/magnetic'
import {
  WORK_EXPERIENCE,
  SOCIAL_LINKS,
  SKILLS,
  EDUCATION,
} from './data'

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

function MagneticSocialLink({
  children,
  link,
}: {
  children: React.ReactNode
  link: string
}) {
  return (
    <Magnetic springOptions={{ bounce: 0 }} intensity={0.3}>
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative inline-flex shrink-0 items-center gap-[1px] rounded-full bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 text-sm text-zinc-700 dark:text-zinc-100 transition-colors duration-200 hover:bg-zinc-200 dark:hover:bg-zinc-700"
      >
        {children}
        <svg
          width="15"
          height="15"
          viewBox="0 0 15 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-3 w-3"
        >
          <path
            d="M3.64645 11.3536C3.45118 11.1583 3.45118 10.8417 3.64645 10.6465L10.2929 4L6 4C5.72386 4 5.5 3.77614 5.5 3.5C5.5 3.22386 5.72386 3 6 3L11.5 3C11.6326 3 11.7598 3.05268 11.8536 3.14645C11.9473 3.24022 12 3.36739 12 3.5L12 9.00001C12 9.27615 11.7761 9.50001 11.5 9.50001C11.2239 9.50001 11 9.27615 11 9.00001V4.70711L4.35355 11.3536C4.15829 11.5488 3.84171 11.5488 3.64645 11.3536Z"
            fill="currentColor"
            fillRule="evenodd"
            clipRule="evenodd"
          ></path>
        </svg>
      </a>
    </Magnetic>
  )
}

export default function HomePage() {
  return (
    <motion.main
      className="space-y-24"
      variants={VARIANTS_CONTAINER}
      initial="hidden"
      animate="visible"
    >
      <motion.section
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
      >
        <div className="flex-1">
          <div className="mb-4 space-y-2">
            <p className="text-zinc-600 dark:text-zinc-400 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-map-pin">
                <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              Riyadh, Saudi Arabia
            </p>
            <p className="text-zinc-600 dark:text-zinc-400 flex items-center gap-2">
              <a href="mailto:ahmed-salem.moustafa@outlook.com" className="hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail">
                  <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"/>
                  <rect x="2" y="4" width="20" height="16" rx="2"/>
                </svg>
                ahmed-salem.moustafa@outlook.com
              </a>
            </p>
            <p className="text-zinc-600 dark:text-zinc-400 flex items-center gap-2">
              <a href="tel:+966569875170" className="hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-phone">
                  <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"/>
                </svg>
                +966 56 987 5170
              </a>
            </p>
          </div>
          <p className="text-zinc-600 dark:text-zinc-400 mb-4">
            Senior Frontend Developer from Cairo, Egypt, currently based in Riyadh, KSA, with 6+ years of experience building high-performance, scalable, and visually engaging web applications. Expert in React, TypeScript, and modern frontend architecture, with a proven track record in delivering complex government and enterprise projects. Adept at transforming business requirements into seamless, accessible, and user-friendly experiences.
          </p>
          <div className="flex items-center justify-start space-x-3">
            {SOCIAL_LINKS.map((link) => (
              <MagneticSocialLink key={link.label} link={link.link}>
                {link.label}
              </MagneticSocialLink>
            ))}
          </div>
        </div>
      </motion.section>

      {/* <motion.section
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
      >
        <h3 className="mb-5 text-lg font-medium">Key Projects</h3>
        <div className="grid grid-cols-1 gap-4">
          {PROJECTS.map((project) => (
            <div key={project.name} className="relative overflow-hidden rounded-2xl bg-zinc-300/30 dark:bg-zinc-600/30 p-[1px]">
              <Spotlight
                className="from-zinc-100 via-zinc-200 to-zinc-50 blur-2xl"
                size={64}
              />
              <div className="relative h-full w-full rounded-[15px] bg-white dark:bg-zinc-950 p-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-lg text-zinc-900 dark:text-zinc-100">
                    {project.name}
                  </h4>
                  <p className="text-zinc-600 dark:text-zinc-400">
                    {project.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.section> */}

      <motion.section
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
      >
        <h3 className="mb-5 text-lg font-medium">Work Experience</h3>
        <div className="flex flex-col space-y-4">
          {WORK_EXPERIENCE.map((job) => (
            <div
              className="relative overflow-hidden rounded-2xl bg-zinc-300/30 dark:bg-zinc-600/30 p-[1px]"
              key={job.id}
            >
              <Spotlight
                className="from-zinc-100 via-zinc-200 to-zinc-50 blur-2xl"
                size={64}
              />
              <div className="relative h-full w-full rounded-[15px] bg-white dark:bg-zinc-950 p-6">
                <div className="relative flex w-full flex-col space-y-3">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                    <div className="flex-1">
                      <h4 className="font-medium text-lg text-zinc-900 dark:text-zinc-100">
                        {job.title}
                      </h4>
                      <p className="text-zinc-600 dark:text-zinc-400 font-medium">
                        <a 
                          href={job.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors inline-flex items-center gap-1 relative group"
                        >
                          <span className="relative">
                            <span className="absolute bottom-0 left-0 w-0 h-px bg-zinc-600 dark:bg-zinc-400 transition-all duration-300 group-hover:w-full"></span>
                            {job.company}
                          </span>
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-external-link">
                            <path d="M15 3h6v6"/>
                            <path d="M10 14 21 3"/>
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                          </svg>
                        </a>
                      </p>
                      {job.location && (
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                          {job.location}
                        </p>
                      )}
                    </div>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1 sm:mt-0">
                      {job.start} - {job.end}
                    </p>
                  </div>
                  {job.description && (
                    <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                      {job.description.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-zinc-600 dark:text-zinc-400 mr-2 mt-1.5 flex-shrink-0">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      <motion.section
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
      >
        <h3 className="mb-5 text-lg font-medium">Education</h3>
        <div className="flex flex-col space-y-4">
          {EDUCATION.map((edu) => (
            <div
              className="relative overflow-hidden rounded-2xl bg-zinc-300/30 dark:bg-zinc-600/30 p-[1px]"
              key={edu.id}
            >
              <Spotlight
                className="from-zinc-100 via-zinc-200 to-zinc-50 blur-2xl"
                size={64}
              />
              <div className="relative h-full w-full rounded-[15px] bg-white dark:bg-zinc-950 p-6">
                <div className="relative flex w-full flex-col space-y-3">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                    <div className="flex-1">
                      <h4 className="font-medium text-lg text-zinc-900 dark:text-zinc-100">
                        {edu.degree}
                      </h4>
                      <p className="text-zinc-600 dark:text-zinc-400 font-medium">
                        {edu.faculty}
                      </p>
                      <p className="text-zinc-600 dark:text-zinc-400 font-medium">
                        <a 
                          href={edu.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors inline-flex items-center gap-1 relative group"
                        >
                          <span className="relative">
                            <span className="absolute bottom-0 left-0 w-0 h-px bg-zinc-600 dark:bg-zinc-400 transition-all duration-300 group-hover:w-full"></span>
                            {edu.university}
                          </span>
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-external-link">
                            <path d="M15 3h6v6"/>
                            <path d="M10 14 21 3"/>
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                          </svg>
                        </a>
                      </p>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        {edu.location}
                      </p>
                    </div>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1 sm:mt-0">
                      Graduated: {edu.graduation}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      <motion.section
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
      >
        <h3 className="mb-5 text-lg font-medium">Technical Skills</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SKILLS.map((skillCategory) => (
            <div key={skillCategory.id} className="space-y-3">
              <h4 className="font-medium text-zinc-900 dark:text-white">
                {skillCategory.category}
              </h4>
              <div className="flex flex-wrap gap-2">
                {skillCategory.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 text-sm bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-white rounded-full border border-zinc-300 dark:border-zinc-600 hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.section>

    </motion.main>
  )
}