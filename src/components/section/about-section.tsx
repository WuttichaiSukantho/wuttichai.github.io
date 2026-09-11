import { ProfileStats } from '@components/profile/profile-stats';

import { Section } from '.';
import { AboutEducation } from './about-education';
import { AboutHero } from './about-hero';
import { AboutStory } from './about-story';
import { ExperienceSection } from './experience-section';
import { ProfileReadmeSection } from './profile-readme-section';
import { ProfileStackSection } from './profile-stack-section';

class AboutSectionClass {
  render = () => {
    return (
      <>
        <Section id="about-hero">
          <AboutHero />
        </Section>

        {/* story */}

        <Section id="about-story">
          <AboutStory />
        </Section>

        <ExperienceSection />

        <ProfileReadmeSection />

        <ProfileStats />

        <ProfileStackSection />

        {/* education */}

        <Section id="education">
          <AboutEducation />
        </Section>
      </>
    );
  };
}
const aboutsectionInstance = new AboutSectionClass();

export const AboutSection = aboutsectionInstance.render;
