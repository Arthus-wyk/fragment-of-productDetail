import React from 'react';
import { Progress } from 'antd';

interface UploadProgressProps {
    parent: string;
}

const UploadProgress: React.FC<UploadProgressProps> = ({ parent }) => {
    return (
        <Progress 
            percent={30} 
            size="small" 
            status="active"
            strokeColor={{
                '0%': '#108ee9',
                '100%': '#87d068',
            }}
        />
    );
};

export default UploadProgress;