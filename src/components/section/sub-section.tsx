import type { ComponentPropsWithoutRef, ReactNode } from 'react';

type SubSectionProps = ComponentPropsWithoutRef<'div'> & {
  children: ReactNode;
};

class SubSectionClass {
  render = ({ children, className, ...props }: SubSectionProps) => {
    return (
      <div
        className={`
      container-responsive

      flex
      flex-col
      items-center

      gap-12
      py-16

      ${className ?? ''}
      `}
        {...props}
      >
        {children}
      </div>
    );
  };
}
const subsectionInstance = new SubSectionClass();

export const SubSection = subsectionInstance.render;
