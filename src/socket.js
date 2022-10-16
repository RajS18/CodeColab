import {io} from 'socket.io-client';
export const initSocket = async ()=>{
    const options={
        'force new connection': true,
        reconnectionAttempt: 'Infinite',//ttc
        timeout:10000,//ttl
        transport:['websocket']//prefered connction protocol
    }
    return io(process.env.REACT_APP_BACKEND_URL,options);
}