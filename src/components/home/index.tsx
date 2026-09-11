import { Footer } from '@components/Footer';
import { PlaygroundSection } from '@components/playground';
import { AboutSection } from '@components/section/about-section';
import { HomeSection } from '@components/section/home-section';
import { Component } from 'react';

export class IndexClass extends Component {
  override render(): React.ReactNode {
    return (
      <div className="flex w-full flex-col">
        <HomeSection />
        <PlaygroundSection />
        <AboutSection />
        <Footer />
      </div>
    );
  }
}
