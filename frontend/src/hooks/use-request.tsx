import axios, { AxiosRequestConfig } from "axios";

import { AxiosResponse, AxiosError } from "axios";
import { imageConfigDefault } from "next/dist/shared/lib/image-config";
import { useEffect, useState } from "react"

// T is the expected type to be returned and converted as props for rendering component.
// T = any makes it optional to provide a generic. Good for post requests
export type ApiResponse<T = any> = {
    status: number,
    statusText: string,
    data: T | null,
    error: any,
    loading: boolean    
};


export function useFetch<T>(url: string, options?: AxiosRequestConfig): ApiResponse<T> {
    const [status, setStatus] = useState<number>(0);
    const [statusText, setStatusText] = useState<string>('');
    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);

    let config = {
        ...options, //include additional configs passed if there are
        withCredentials: true //include the cookies on all request
    };

    // This method is used for firing the get request
    const fireGetRequest = async () => {
        setLoading(true);

        try{
            const response: AxiosResponse = await axios.get(url, config);
            setStatus(response.status);
            setStatusText(response.statusText);
            setData(response.data);
        } catch(error: unknown){
            setError(error)
        } finally{
            setLoading(false);
        }
      }

    useEffect(() => {
        setTimeout(()=>{fireGetRequest();}, 3000)
    }, [url]); // run when url is changed

    return {status, statusText, data, error, loading};    
}

export function usePost(url: string, data?: string, options?: AxiosRequestConfig ): ApiResponse {
    const [status, setStatus] = useState<number>(0);
    const [statusText, setStatusText] = useState<string>('');
    const [error, setError] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);

    let config = {
        ...options,  //include other options
        headers: {
            ...options?.headers, //include other header 
            'Content-Type': options?.headers?.['Content-Type'] || 'application/json' //default application/json
        },
        withCredentials: true //include the cookies on all request
    };

    // This method is used for firing the get request
    const firePostRequest = async () => {
        setLoading(true);

        try{
            const response: AxiosResponse = await axios.post(url, data, config);
            setStatus(response.status);
            setStatusText(response.statusText);
        } catch(error: unknown){
            setError(error)
        } finally{
            setLoading(false);
        }
      }

    useEffect(() => {
        setTimeout(()=>{firePostRequest();}, 3000)
    }, [url, data]); // run when url is changed

    return {status, statusText, data, error, loading};    
}