import { notification } from 'antd';

export function fetchplus(url,data,resultfn,error){
    fetch(url,{
        method: 'POST',
        mode: 'cors',
        headers: new Headers({
            'Content-Type': 'application/json;charset=utf-8', // 指定提交方式
            'Accept': 'application/json' // 指定获取的数据格式
        }),
        body: JSON.stringify( data )
    }).then( function(response) {
        if(response.status == 200) {
            return response.text()
        }else {
            console.log("报错状态码是："+response.status)
            notification.error({
                message: '网络出错',
                description: '网络连接错误',
            })
        }
    }).then( function(result){
        resultfn(result)
    }).catch( e => {
        error()
    });
}

export function dictionaryList(url,data,resultfn,error){
    fetch(url,{
        method: 'POST',
        mode: 'cors',
        headers: new Headers({
            'Content-Type': 'application/json;charset=utf-8', // 指定提交方式
            'Accept': 'application/json' // 指定获取的数据格式
        }),
        body: JSON.stringify( data )
    }).then( function(response) {
        console.log(response);
        if(response.status == 200) {
            return response.text()
        }else {
            console.log("报错状态码是："+response.status)
            notification.error({
                message: '网络出错',
                description: '网络连接错误',
            })
        }
    }).then( function(result){
        resultfn(result)
    }).catch( e => {
        error()
    })
}

export const urlplus = 
// 'http://private-fd1d15-dictionary10.apiary-mock.com/'
'https://private-fd1d15-dictionary10.apiary-mock.com/'
// 'http://10.42.0.219:8089/GYJK/'
// 'http://10.31.28.236:8080/GYJK/'
// 'http://10.37.1.36:8080/GYJK/'

export const urlcourse = 
'http://10.42.0.168:9099/jk/efk/'
// 'http://10.37.1.36:9099/jk/efk/'