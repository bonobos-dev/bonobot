

export function getHostUrl(): string{


    if (process.env.NODE_ENV === 'production'){

        return `https://bonobot-290604.uc.r.appspot.com`;
        
    }else if (process.env.NODE_ENV === 'development'){
        return `http://localhost:${process.env.PORT}`;
    }
}