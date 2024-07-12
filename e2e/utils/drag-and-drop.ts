import { Page } from '@playwright/test';
import { readFileSync } from 'fs';

export async function dragAndDropFile(
    page: Page,
    selector: string,
    filePath: string,
    fileName: string,
    fileType = ''
) {
    const buffer = readFileSync(filePath).toString('base64');

    const dataTransfer = await page.evaluateHandle(
        async ({ bufferData, localFileName, localFileType }) => {
            const dt = new DataTransfer();

            const blobData = await fetch(bufferData).then((res) => res.blob());

            const file = new File([blobData], localFileName, { type: localFileType });
            dt.items.add(file);
            return dt;
        },
        {
            bufferData: `data:application/octet-stream;base64,${buffer}`,
            localFileName: fileName,
            localFileType: fileType,
        }
    );

    await page.dispatchEvent(selector, 'drop', { dataTransfer });
};

export async function dragAndDropFiles(
    page: Page,
    selector: string,
    filePaths: string[]
) {

    const base64Data = filePaths.map((filePath) => {
        return readFileSync(filePath).toString('base64')
    })

    const dataTransfer = await page.evaluateHandle(
        async ({ localFilePaths, localBase64Data }) => {
            const dataTransfer = new DataTransfer();

            for (let i = 0; i < localFilePaths.length; i++) {
                const bufferData = `data:application/octet-stream;base64,${localBase64Data[i]}`
                const fileName = localFilePaths[i].split('/').pop() as string
                const blobData = await fetch(bufferData).then((res) => res.blob());
                const file = new File([blobData], fileName);
                dataTransfer.items.add(file);
            }

            return dataTransfer;
        },
        {
            localFilePaths: filePaths,
            localBase64Data: base64Data
        }
    );

    await page.dispatchEvent(selector, 'drop', { dataTransfer });
};