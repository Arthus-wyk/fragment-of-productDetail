'use client'
import Button from "@/components/ui/AccountButton/Button";
import { handleRequest } from "@/lib/utils/auth-helpers/client";
import { SignOut } from "@/lib/utils/auth-helpers/server";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignOutFrom() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const handleLogout = async (e: React.FormEvent<HTMLFormElement>) => {
        setIsSubmitting(true);

        handleRequest(e, SignOut, router);
        setIsSubmitting(false);
    };
    return (
        <form id="SignOutFrom" className="flex justify-center mt-8"
            onSubmit={(e) => handleLogout(e)}>
            <Button
                variant="slim"
                type="submit"
                form="SignOutFrom"
                loading={isSubmitting}
                className="px-6 py-2 font-bold text-white bg-red-600 rounded hover:bg-red-700"
            >
                登出
            </Button>
        </form>
    )
}