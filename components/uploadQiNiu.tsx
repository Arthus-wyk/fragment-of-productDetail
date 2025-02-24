'use client';
import React, { useState, useEffect } from 'react';
import { Upload, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import { UploadFiles } from '@/lib/UploadFiles';

export interface UploadQiNiuProps {
  value?: string[]; // 用于接收外部传入的值
  onChange?: (value: string[]) => void; // 用于通知外部值的变化
}

export const UploadQiNiu: React.FC<UploadQiNiuProps> = ({ value = [], onChange }) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);


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

        // 更新 fileList
        const newFileList: UploadFile[] = [
          ...fileList,
          {
            uid: file.uid,
            name: file.name,
            status: 'done', // 确保 status 是符合 UploadFileStatus 类型的值
            url: uploadedUrl,
            percent: 100, // 添加进度信息
          },
        ];
        setFileList(newFileList);

        // 通知外部组件更新 value
        if (onChange) {
          onChange(newFileList.map((file) => file.url as string));
        }

        // 通知上传成功
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
    const newFileList = fileList.filter((item) => item.uid !== file.uid);
    setFileList(newFileList);

    // 通知外部组件更新 value
    if (onChange) {
      onChange(newFileList.map((file) => file.url as string));
    }
  };

  return (
    <Upload
      listType="picture-card"
      fileList={fileList}
      customRequest={customRequest}
      showUploadList={true}
      onRemove={handleRemove}
    >
      {fileList.length >= 8 ? null : (
        <div>
          <PlusOutlined />
          <div style={{ marginTop: 8 }}>Upload</div>
        </div>
      )}
    </Upload>
  );
};

export default UploadQiNiu;
