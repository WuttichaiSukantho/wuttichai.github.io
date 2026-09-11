import { ContentEntity } from './content.entity';

export class AboutStore {
  sectionVariant = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  };

  education = [
    new ContentEntity(
      '/wuttichai.github.io/image/education/primary-school.webp',
      'primary',
      'primary',
    ),

    new ContentEntity(
      '/wuttichai.github.io/image/education/secondary-school.webp',
      'secondary school',
      'secondary school',
    ),

    new ContentEntity(
      '/wuttichai.github.io/image/brand/university-logo.webp',
      'University',
      'University',
    ),
  ];
}

export const aboutStore = new AboutStore();
