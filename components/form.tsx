'use client'
import { useRouter } from 'next/navigation';
import { ChangeEvent, useState } from 'react';
import UploadQiNiu from './uploadQiNiu';
import { Card } from 'antd';
import { ExpandableCheckboxContent } from './ui/expandableCheckbox';
import Customer_reviews from './customer_reviews';
import { Button } from './ui/button';
import Basic_Form from './basic_form';

type Basic_Form = {
    name: string;
    price: string;
    pic: string[];
    desc: string;
    spec: string;
}
type Extend_Form = {
    content: string[];
    style: string;
    layout: string;
    interactive: string[];
}

interface FormData extends Basic_Form, Extend_Form {
    [key: string]: string | string[]; // 允许通过字符串索引访问其它字段
};

type OptionValue = {
    content: string;
    value: string;
    children?: React.ReactNode
};

const product_detail: OptionValue[] = [
    { content: '顾客评价', value: 'customer_reviews', children: <Customer_reviews /> },
    { content: '产品推荐', value: 'product_recommendations', children: <Customer_reviews /> },
    { content: 'FAQ部分', value: 'faq', children: <Customer_reviews /> },
    { content: '售后服务', value: 'after_sales_service', children: <Customer_reviews /> },
    { content: '优惠信息', value: 'promotions', children: <Customer_reviews /> },
    { content: '社交分享', value: 'social_sharing', children: <Customer_reviews /> },
];

const product_style: OptionValue[] = [
    { content: '简约', value: 'simple' },
    { content: '现代', value: 'modern' },
    { content: '复古', value: 'vintage' },
    { content: '科技', value: 'tech' },
    { content: '极简', value: 'minimalist' },
    { content: '卡通', value: 'cartoon' },
    { content: '豪华', value: 'luxury' },
];

const product_layout: OptionValue[] = [
    { content: '单页滚动式', value: 'scroll' },
    { content: '分屏布局', value: 'split' },
    { content: '网格布局', value: 'grid' },
    { content: '卡片式布局', value: 'card' },
];

const product_interaction: OptionValue[] = [
    { content: '实时聊天', value: 'live_chat' },
    { content: '动态交互', value: 'dynamic_interaction' },
];
const byAI = '由ai生成'
export default function Form() {
    const [formData, setFormData] = useState<FormData>({
        name: '',
        price: '',
        pic: [],
        desc: '',
        spec: '',
        content: [],
        style: 'modern',
        layout: '',
        interactive: [],
    });
    const [byAI, setByAI] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<string>('');  // 错误信息
    const router = useRouter();
    if (!router) {
        return null; // 或者返回一个加载状态
    }
    const handleAI = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { checked } = e.target;
        setByAI(checked)
    }
    // 处理复选框选择状态变化
    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, checked } = e.target;
        console.log("value:", value)
        setFormData((prevData) => {
            if (checked) {
                return { ...prevData, [name]: [...prevData[name] as string[], value] };
            } else {
                return {
                    ...prevData,
                    [name]: (prevData[name] as string[]).filter((item: string) => item !== value),
                };
            }
        });
    };


    function handleFileChange(change: string[]) {
        console.log("当前图片:", change)
        setFormData((prevFormData) => ({
            ...prevFormData,
            ['pic']: change
        }))
    }

    // 处理选择变化
    const handleSelectChange = (e: { target: { name: any; value: any; }; }) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };
    const handelFormChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, key: string) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            [key]: event.target.value
        }))
    }
    // 点击卡片时切换复选框状态
    const handleCardClick = (name: string, value: string) => {
        const isSelected = formData[name].includes(value);
        setFormData((prevData) => {
            if (isSelected) {
                return {
                    ...prevData,
                    [name]: (prevData[name] as string[]).filter((item: string) => item !== value),
                };
            } else {
                return { ...prevData, [name]: [...prevData[name] as string[], value] };
            }
        });
    };

    // 提交表单并验证内容是否勾选至少 3 个
    const handleSubmit = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        if (formData.content.length < 3) {
            setErrorMessage('请至少选择三个页面内容');
        } else {
            setErrorMessage('');
            console.log(formData);  // 在这里可以处理表单提交的逻辑
            let queryParams;
            if(byAI){
                queryParams = new URLSearchParams({
                    byAI:'1',
                    content: formData.content.join(','),
                    style: formData.style,
                    layout: formData.layout,
                    interactive: formData.interactive.join(','),
                }).toString();
            }
            else{
                queryParams = new URLSearchParams({
                    byAI:'0',
                    name:formData.name,
                    price:formData.price,
                    pic:formData.pic.join(','),
                    desc:formData.desc,
                    spec:formData.spec,
                    content: formData.content.join(','),
                    style: formData.style,
                    layout: formData.layout,
                    interactive: formData.interactive.join(','),
                }).toString();
            }

            const url = `/web-generator/result/1?${queryParams}`
            window.open(url, '_blank');

        }
    };


    return (
        <div className="max-w-3xl mx-auto p-6 bg-gray-50 shadow-md rounded-lg">
            <h1 className="text-3xl font-bold text-center mb-6">生成电商产品详情页</h1>
            <form onSubmit={handleSubmit}>
                <Card className='w-full max-w-2xl p-6 space-y-6 bg-card '>
                    <ExpandableCheckboxContent className=''
                        byAI={byAI}
                        content='由ai生成:'
                        value='由ai生成:'
                        formData={formData}
                        onChange={handleAI}
                    >
                        <Basic_Form byAI={byAI} handleBasicFormChange={handelFormChange} handleFileChange={handleFileChange} />
                    </ExpandableCheckboxContent>
                    {/* <div className='space-y-2 grid grid-4'>
                        <label>商品名称：</label>
                        <input className='rounded-md border border-input px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground
                             focus-visible:ring-ring ring-offset-2 disabled:cursor-not-allowed ' />
                    </div >
                    <div className="space-y-2 grid grid-4">
                        <label>商品价格：</label>
                        <input className=' rounded-sm border-2 h-10 px-3 py-2' type='number' />
                    </div>
                    <div className='space-y-2 grid grid-4 m-4'>
                        <UploadQiNiu onFileContentRead={handleFileChange} />
                    </div>
                    <div className="space-y-2 grid grid-4">
                        <label>商品详情：</label>
                        <textarea className='min-h-[80px] rounded-md border border-input px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground
                             focus-visible:ring-ring ring-offset-2 disabled:cursor-not-allowed max-h-40' placeholder='精选高品质纯棉面料，柔软透气，舒适亲肤。经典简约设计，百搭必备，适合各种场合穿搭，让你时尚又舒适。' />
                    </div>
                    <div className="space-y-2 grid grid-4">
                        <label>商品规格：</label>
                        <textarea className='min-h-[80px] rounded-md border border-input px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground
                             focus-visible:ring-ring ring-offset-2 disabled:cursor-not-allowed max-h-40' placeholder='材质:100%羊毛;版型:宽松型' />
                    </div> */}


                    {/* 步骤 1: 选择页面内容 */}
                    <div className="mb-6">
                        <label className="block text-lg font-medium text-gray-700 mb-2">
                            选择需要生成的页面内容 <span className="text-red-500">*</span>:
                        </label>
                        <div className="grid     gap-4">
                            {product_detail.map(({ content, value, children }) => (
                                // <ExpandableCheckboxContent className=''
                                // content={content}
                                // value={value}
                                // formData={formData}
                                // onChange={handleCheckboxChange}
                                // >
                                //     {children}
                                // </ExpandableCheckboxContent>
                                <div
                                    key={value}
                                    className="relative flex flex-col items-center border p-4 rounded-lg shadow-md hover:bg-gray-200 cursor-pointer transition-transform transform hover:scale-105"
                                    onClick={() => handleCardClick('content', value)}  // 卡片点击触发
                                >
                                    {/* 复选框放在左上角 */}
                                    <input
                                        type="checkbox"
                                        id={value}
                                        name="content"
                                        value={value}
                                        onChange={handleCheckboxChange}
                                        checked={formData.content.includes(value)}
                                        className="absolute top-2 left-2"
                                    />
                                    {/* 标题样式：放置在卡片的偏上部分 */}
                                    <label className="text-gray-600 font-semibold  select-none">
                                        {content}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 错误提示 */}
                    {errorMessage && <p className="text-red-500 text-sm mb-4">{errorMessage}</p>}

                    {/* 步骤 2: 选择页面风格 */}
                    <div className="mb-6">
                        <label className="block text-lg font-medium text-gray-700 mb-2">
                            选择页面风格：
                        </label>
                        <select
                            name="style"
                            value={formData.style}
                            onChange={handleSelectChange}
                            className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg"
                        >
                            {product_style.map(({ content, value }) => (
                                <option key={value} value={value}>
                                    {content}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* 步骤 3: 选择布局风格 */}
                    <div className="mb-6">
                        <label className="block text-lg font-medium text-gray-700 mb-2">
                            选择布局风格 <span className="text-red-500">*</span>:
                        </label>
                        <div className="flex space-x-4">
                            {product_layout.map(({ content, value }) => (
                                <div key={value} className="flex items-center">
                                    <input
                                        type="radio"
                                        id={value}
                                        name="layout"
                                        value={value}
                                        onChange={handleSelectChange}
                                        className="mr-2"
                                        required
                                    />
                                    <label htmlFor={value} className="text-gray-600">
                                        {content}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 步骤 4: 互动性选项 */}
                    <div className="mb-6">
                        <label className="block text-lg font-medium text-gray-700 mb-2">
                            选择互动性选项：
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                            {product_interaction.map(({ content, value }) => (
                                <div
                                    key={value}
                                    className="relative flex flex-col items-center border p-4 rounded-lg shadow-md hover:bg-gray-200 cursor-pointer transition-transform transform hover:scale-105"
                                    onClick={() => handleCardClick('interactive', value)}  // 卡片点击触发
                                >
                                    <input
                                        type="checkbox"
                                        id={value}
                                        name="interactive"
                                        value={value}
                                        onChange={handleCheckboxChange}
                                        checked={formData.interactive.includes(value)}
                                        className="absolute top-2 left-2"
                                    />
                                    <label htmlFor={value} className="text-gray-600 font-semibold ">{content}</label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <Button
                        variant="default"
                        type="submit"
                        className="w-full bg-slate-600 hover:bg-slate-700 "
                    >
                        生成页面
                    </Button>
                </Card>
            </form>
        </div>
    );
};
