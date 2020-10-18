

export function getHostUrl(): string{


    if (process.env.NODE_ENV === 'production'){

        return process.env.ASSETS_URI;
        
    }else if (process.env.NODE_ENV === 'development'){
        return `http://localhost:${process.env.PORT}`;
    }
}