'use client'
import { useState } from "react";
import { Button } from "./ui/button";
import { string } from "zod";
import { Input } from "./ui/input";
import UploadQiNiu from "./uploadQiNiu";
import { Textarea } from "./ui/textarea";
export type Basic_Form = {
    name: string;
    price: string;
    pic: string[];
    desc: string;
    spec: string;
}

export default function Basic_Form({ byAI, handleBasicFormChange, handleFileChange }
    : {
        byAI: boolean
        handleBasicFormChange: (
            event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, // 事件类型
            key: string // 表单字段的名字
        ) => void;
        handleFileChange: (change: string[]) => void;
    }
) {


    return (
        <div>
            <div>
                <div className='space-y-2 grid grid-4'>
                    <label>商品名称：</label>
                    <Input 
                        required
                        disabled={byAI}
                        onChange={(e) => handleBasicFormChange(e, 'name')} />
                </div >
                <div className="space-y-2 grid grid-4">
                    <label>商品价格：</label>
                    <Input
                        type='number'
                        onChange={(e) => handleBasicFormChange(e, 'price')}
                        required
                        disabled={byAI} />
                </div>
                <div className='space-y-2 grid grid-4 m-4'>
                    <UploadQiNiu onFileContentRead={handleFileChange} />
                </div>
                <div className="space-y-2 grid grid-4">
                    <label>商品详情：</label>
                    <Textarea
                        className='min-h-[80px] rounded-md border border-input px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground
                                             focus-visible:ring-ring ring-offset-2 disabled:cursor-not-allowed max-h-40'
                        placeholder='精选高品质纯棉面料，柔软透气，舒适亲肤。经典简约设计，百搭必备，适合各种场合穿搭，让你时尚又舒适。'
                        onChange={(e) => handleBasicFormChange(e, 'desc')}
                        required
                        disabled={byAI} />
                </div>
                <div className="space-y-2 grid grid-4">
                    <label>商品规格：</label>
                    <Textarea className='min-h-[80px] rounded-md border border-input px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground
                                             focus-visible:ring-ring ring-offset-2 disabled:cursor-not-allowed max-h-40'
                        placeholder='材质:100%羊毛;版型:宽松型'
                        onChange={(e) => handleBasicFormChange(e, 'spec')}
                        required
                        disabled={byAI} />
                </div>

            </div>

        </div>
    )
}