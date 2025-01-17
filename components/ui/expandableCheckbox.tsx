
import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import { Label } from "./label";
interface ExpandableCheckboxContentProps extends React.HTMLAttributes<HTMLDivElement> {
    byAI: boolean;
    content: string; // 新增 label 属性
    value: string; // 必须的 value 属性
    formData: { content: string[] }; // formData 属性
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void; // onChange 事件
}

const ExpandableCheckboxContent = React.forwardRef<HTMLDivElement, ExpandableCheckboxContentProps>(
    ({ className, byAI, content, value, formData, onChange, children, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "rounded-xl border bg-card text-card-foreground shadow p-4",
                    className
                )}
                {...props}
            >
                <div className="flex items-center mb-6">
                    <input
                        type="checkbox"
                        id={value}
                        name="content"
                        value={value}
                        onChange={(e) => {
                            onChange(e);
                        }}
                        className="mr-2"
                        checked={byAI}
                    />
                    <Label htmlFor={value}>{content}</Label>
                </div>
                {children}
            </div>
        );
    }
);
ExpandableCheckboxContent.displayName = "ExpandableCheckboxContent";

export { ExpandableCheckboxContent }