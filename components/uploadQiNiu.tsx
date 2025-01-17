'use client'
import React, { useState } from 'react';
import { Upload, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import { UploadFiles, UploadUrlFiles } from '@/lib/UploadFiles';
import UploadProgress from './uploadProgress';

export interface UploadQiNiuProps {
    onFileContentRead: (content: string[]) => void;
}

export const UploadQiNiu: React.FC<UploadQiNiuProps> = ({ onFileContentRead }) => {
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [srcs, setSrcs] = useState<string[]>([])
    const handleUpload = async (file: RcFile) => {
        try {
            const url = await UploadFiles(file); // 上传文件，返回文件的 URL
            return url; // 成功返回 URL
        } catch (error) {
            console.error('Error uploading file', error);
            throw error; // 上传失败抛出错误
        }

    };
    const customRequest = async ({ file, onSuccess, onError, onProgress }: any) => {
        try {
            const uploadedUrl = await handleUpload(file);
            if (uploadedUrl) {
                onProgress({ percent: 100 });
                // 更新 src 列表
                setSrcs((prevSrcs) => [...prevSrcs, uploadedUrl]);
                onFileContentRead([...srcs, uploadedUrl]);

                // 更新 fileList
                setFileList((prevFileList) => [
                    ...prevFileList,
                    {
                        uid: file.uid,
                        name: file.name,
                        status: 'done',
                        url: uploadedUrl,
                        percent: 100 // 添加进度信息
                    },
                ]);

                // 通知成功
                onSuccess(null, file);
            }
        } catch (error) {
            console.error('Upload failed', error);
            onError(error); // 通知上传失败
            message.error(`Upload failed: ${file.name}`);
        }
    };
    // 自定义删除逻辑
    const handleRemove = async (file: UploadFile) => {
        const index = fileList.findIndex((item) => item.uid === file.uid);
        try {
            setFileList((prevList) => prevList.filter((item) => item.uid !== file.uid));
            const newSrcs = srcs.filter((_, i) => i !== index);
            setSrcs(newSrcs)
            // onFileContentRead(newSrcs);
            console.log('删除成功', newSrcs)
        } catch (error) {
            console.log('删除失败')
        }
    };


    return (
        <div>
            <Upload
                listType="picture-card"
                fileList={fileList}
                customRequest={customRequest}
                showUploadList={true}
                onRemove={handleRemove}
                
            >
                {
                    <div>
                        <PlusOutlined />
                        <div style={{ marginTop: 8 }}>Upload</div>
                    </div>

                }
            </Upload>

        </div>
    )
};

export default UploadQiNiu;
