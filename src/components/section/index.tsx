import type { ComponentPropsWithoutRef, ReactNode } from 'react';

type SectionProps = ComponentPropsWithoutRef<'section'> & {
  id: string;
  children: ReactNode;
};

class SectionClass {
  render = ({ id, children, className, ...props }: SectionProps) => {
    return (
      <section
        id={id}
        className={`
      w-full
      scroll-mt-[calc(var(--header-height)+1rem)]
      snap-start

      flex
      flex-col
      items-center
      justify-center

      ${className ?? ''}
      `}
        {...props}
      >
        {children}
      </section>
    );
  };
}
const sectionInstance = new SectionClass();

export const Section = sectionInstance.render;
