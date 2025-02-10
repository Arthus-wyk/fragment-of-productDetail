'use client';

import Card from '../../ui/AccountCard/Card';
import Button from '../../ui/AccountButton/Button';
import { handleRequest, updateName } from '@/lib/utils/auth-helpers/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Mail, User } from 'lucide-react';


export default function NameForm({ userName }: { userName: string }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsSubmitting(true);
    // Check if the new name is the same as the old name
    if (e.currentTarget.fullName.value === userName) {
      e.preventDefault();
      setIsSubmitting(false);
      return;
    }
    handleRequest(e, updateName, router);
    setIsSubmitting(false);
  };

  return (
    <Card
      title='昵称'
      description=""
      footer={
        <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
          <p className="pb-4 sm:pb-0 text-zinc-300">64 characters maximum</p>
          <Button
            variant="slim"
            type="submit"
            form="nameForm"
            loading={isSubmitting}
          >
            更新昵称
          </Button>
        </div>
      }
    >
      <div className="mt-8 mb-4 text-xl font-semibold">
        <form id="nameForm" onSubmit={(e) => handleSubmit(e)}
          className='flex w-1/2 items-center bg-purple-700 rounded'>
          <User className="ml-3 text-purple-300" />
          <input
            type="text"
            name="fullName"
            className="w-1/2 p-3 rounded-md bg-transparent border-none focus:ring-0 flex-grow text-white placeholder-purple-300 "
            defaultValue={userName}
            
            maxLength={64}
          />
        </form>
      </div>
    </Card>
  );
}
