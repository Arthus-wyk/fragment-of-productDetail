'use client';

import Card from '../../ui/AccountCard/Card';
import Button from '../../ui/AccountButton/Button';
import { updateEmail } from '@/lib/utils/auth-helpers/server';
import { handleRequest } from '@/lib/utils/auth-helpers/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Mail } from 'lucide-react';


export default function EmailForm({
  userEmail
}: {
  userEmail: string | undefined;
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsSubmitting(true);
    // Check if the new email is the same as the old email
    if (e.currentTarget.newEmail.value === userEmail) {
      e.preventDefault();
      setIsSubmitting(false);
      return;
    }
    handleRequest(e, updateEmail, router);
    setIsSubmitting(false);
  };

  return (
    <Card
      title='邮箱'
      description='请输入您要用于登录的电子邮件地址。'
      footer={
        <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
          <p className="pb-4 sm:pb-0 text-zinc-300">
            我们将向您发送电子邮件以验证更改。
          </p>
          <Button
            variant="slim"
            type="submit"
            form="emailForm"
            loading={isSubmitting}
          >
            更新邮箱
          </Button>
        </div>
      }
    >
      <div className="mt-8 mb-4 text-xl font-semibold">
        <form id="emailForm" onSubmit={(e) => handleSubmit(e)}
          className='flex w-1/2 items-center bg-purple-700 rounded'>
          <Mail className="ml-3 text-purple-300" />
          <input
            type="text"
            name="newEmail"
            className="w-1/2 p-3 rounded-md bg-transparent border-none focus:ring-0 flex-grow text-white placeholder-purple-300"
            defaultValue={userEmail ?? ''}
            placeholder='你的邮箱'
            maxLength={64}
          />
        </form>
      </div>
    </Card>
  );
}
