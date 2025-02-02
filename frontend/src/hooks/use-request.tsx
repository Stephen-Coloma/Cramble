import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { useEffect, useState } from "react"

// T is the expected type to be returned and converted as props for rendering component.
// T = any makes it optional to provide a generic. Good for post requests
export type ApiResponse<T = any> = {
    status: number,
    statusText: string,
    data?: T | null,
    error: any,
    loading: boolean,
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

// This type is an extension of the ApiResponse type where a callback 
// function is provided so that posts requests will only be triggered 
// when it is invoked in the component usePost is used
export type PostApiResponse = ApiResponse & {
    callback: (dataToSend: any) => Promise<void>
}

export function usePost(url: string, options?: AxiosRequestConfig ): PostApiResponse {
    const [status, setStatus] = useState<number>(0);
    const [statusText, setStatusText] = useState<string>('');
    const [data, setData] = useState<null>(null);
    const [error, setError] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);

    let config = {
        ...options,  //include other options
        headers: {
            ...options?.headers, //include other header 
            'Content-Type': options?.headers?.['Content-Type'] || 'application/json' //default application/json
        },
        withCredentials: true //include the cookies on all request
    };

    // This method is used for firing the put request
    const callback = async (dataToSend: any) => {
        setLoading(true);
        
        try{
            const response: AxiosResponse = await axios.post(url, dataToSend, config);
            setStatus(response.status);
            setStatusText(response.statusText);
        } catch(error: unknown){
            setError(error)
        } finally{
            setLoading(false);
        }
    }

    return {status, statusText, data, error, loading, callback };    
}