'use client'
import { redirect } from "next/navigation"

export default function AccountTitle() {
    const handleClick = () => {
        window.location.href = '/'
    }
    return (<div className="max-w-6xl px-4 py-8 mx-auto sm:px-6 sm:pt-24 lg:px-8">
        {/* 添加返回主页按钮 */}
        <button
            onClick={handleClick}
            className="absolute top-4 left-4 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full text-lg font-semibold shadow-lg hover:from-blue-600 hover:to-cyan-600 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
        >
            Return to Home
        </button>
        <div className="sm:align-center sm:flex sm:flex-col">
            <h1 className="text-4xl font-extrabold text-white sm:text-center sm:text-6xl">
                Account
            </h1>
            <p className="max-w-2xl m-auto mt-5 text-xl  sm:text-center sm:text-2xl">
                We partnered with Stripe for a simplified billing.
            </p>
        </div>
    </div>)
}