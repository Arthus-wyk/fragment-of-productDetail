import { ReactNode } from 'react';

interface Props {
  title: string;
  description?: string;
  footer?: ReactNode;
  children: ReactNode;
}

export default function Card({ title, description, footer, children }: Props) {
  return (
    <div className="w-full max-w-3xl m-auto my-8  rounded-t-md p shadow-lg">
      <div className="bg-purple-700 shadow-lg rounded-lg bg-opacity-50  p-6 ">
        <h3 className="mb-1 text-2xl font-medium">{title}</h3>
        <p className="text-zinc-300">{description}</p>
        {children}
      </div>
      {footer && (
        <div className="p-4  rounded-b-md border-zinc-700 bg-purple-800 bg-opacity-50">
          {footer}
        </div>
      )}
    </div>
  );
}
