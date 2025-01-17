import { RcFile, UploadFile } from "antd/es/upload/interface";
import { v4 as uuidv4 } from 'uuid';
export const UploadFiles = async (file: RcFile) => {
    const key = uuidv4();
    let uploadData:{ key: string, token: string };
    const formData = new FormData();
    try {
        await fetch(`/api/token/upload-token?key=${key}`, {
            method: 'POST',
        })
            .then((res) => res.json())
            .then((res) => {
                uploadData=({
                    key,
                    token: res.data,
                });
                formData.append('file', file);
            formData.append('token', uploadData.token);
            formData.append('key', file.name);
            });
            
            const response = await fetch('https://up-cn-east-2.qiniup.com', {
                method: 'POST',
                body: formData,
            });
            let url = '';
            if (response.ok) {
                const data = await response.json();
                console.log('key:' + data.key);
                url = 'https://image1.juramaia.com/' + data.key;
            } else {
                console.log('Upload failed');
            }
            return url;

    } catch (error) {
        console.log('Error uploading file', error);
        return null;
    }

};
export function UploadUrlFiles  (imageUrl: string,index:number) {
        const fileName = imageUrl.split('/').pop() || `image-from-url-${Date.now()}`;
        const newFile: UploadFile = {
            uid: `${Date.now()}-${index}`,
            name: fileName,
            status: 'done',
            url: imageUrl, // 将输入的 URL 作为图片的 URL
        };
        return {fileName,newFile};
}