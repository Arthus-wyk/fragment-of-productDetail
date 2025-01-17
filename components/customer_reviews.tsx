'use client'
import { useState } from "react";
import { Button } from "./ui/button";
import { string } from "zod";
import { Input } from "./ui/input";

export default function Customer_reviews() {
    const [isSelected, setIsSelected] = useState(false); // 本地选中状态 
    const content='由ai生成'
    const handleCheckboxChange = () => {
        setIsSelected(!isSelected); // 切换选中状态
        if(isSelected)
            setReview_list([''])
      };
    const [review_list,setReview_list]=useState<string[]>([''])
    const addNewReview=()=>{
        setReview_list([...review_list,''])
        
    }
    const handleReviewChange=(event: React.ChangeEvent<HTMLInputElement>, index: number)=>{
        const newReview=[...review_list];
        newReview[index]=event.target.value;
        setReview_list(newReview)
        
    }
        
    

    return (
        <div>
            <div>
                <input
                    type="checkbox"
                    id={content}
                    name="content"
                    value={content}
                    onChange={handleCheckboxChange}
                    checked={isSelected}
                />
                {/* 标题样式：放置在卡片的偏上部分 */}
                <label className="text-gray-600 font-semibold  select-none">
                    {content}
                </label>
            </div>
            {!isSelected && 
            <div>
                <label>用户自己填写</label>
                {review_list.map((value,index)=>(
                    <div key={index} className="grid gap-2 grid-cols-10 my-2">
                        <Input className="col-span-9"  onChange={(e) => handleReviewChange(e, index)}/>
                        {index==review_list.length-1 &&
                            <Button className="col-span-1" variant='default' onClick={addNewReview} disabled={value.length==0}>+</Button>
                        }
                    </div>
                ))}
            </div>
            }
        </div>
    )
}