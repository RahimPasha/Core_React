import axios, { AxiosResponse } from 'axios'
import { request } from 'http';
import { Activity } from '../models/activity';

const sleep = (delay: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, delay)
    })
}


axios.defaults.baseURL = 'http://localhost:5000/api';
/*
axios.interceptors.response.use(response => {
    return sleep(1000).then(()=> {
        return response;
    }).catch((err) => {
        console.log(err);
        return Promise.reject(err);
    })
})
*/
//The bellow is the await-async version of the above which is using promise
axios.interceptors.response.use(async response => {
    try {
        await sleep(1000);
        return response;
    } catch (err) {
        console.log(err);
        return await Promise.reject(err);
    }
})
const responseBody = <T> (response: AxiosResponse<T>) => response.data;

const requests = {
    get: <T> (url: string) => axios.get<T>(url).then(responseBody),
    post: <T> (url: string, body:{}) => axios.post<T>(url, body).then(responseBody),
    put: <T> (url: string, body:{}) => axios.put<T>(url, body).then(responseBody),
    del: <T> (url: string) => axios.delete<T>(url).then(responseBody)
}

const Activities = {
    list: () => requests.get<Activity[]>('/activities'),
    details: (id: string) => requests.get<Activity>(`/activities/${id}`),
    create: (activity: Activity) => axios.post<void>('/activities',activity),
    update: (activity: Activity) => axios.put<void>(`/activities/${activity.id}`,activity),
    delete: (id: string) => requests.del<void>(`/activities/${id}`)
}

const agent = {
    Activities
}

export default agent; 