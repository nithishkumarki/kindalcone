"use client";
import React, { useEffect, useState } from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import Navbar from "@/components/Navbar";
import styles from "./Read.module.css";
import { useParams } from 'next/navigation';

const apiurl = process.env.NEXT_PUBLIC_API_URL;

const ReadPage = () => {
    const { bookid } = useParams();
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const defaultLayoutPluginInstance = defaultLayoutPlugin();

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const response = await fetch(`${apiurl}/api/books/${bookid}`);
                if (!response.ok) throw new Error("Failed to fetch book data");
                const data = await response.json();
                if (data.pdf) setPdfUrl(`${apiurl}/${data.pdf}`);
            } catch (error) {
                console.error("Error fetching PDF:", error);
            }
        };
        fetchBook();
    }, [bookid]);

    return (
        <div className={styles.main}>
            <Navbar />
            <div className={styles.container}>
                <div className={styles.viewer}>
                    {pdfUrl ? (
                        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                            <Viewer
                                fileUrl={pdfUrl}
                                plugins={[defaultLayoutPluginInstance]}
                                theme="dark"
                            />
                        </Worker>
                    ) : (
                        <p>Loading PDF...</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReadPage;
