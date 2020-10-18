

export function getHostUrl(): string{


    if (process.env.NODE_ENV === 'production'){

        return `https://localhost:${process.env.PORT}`;
        
    }else if (process.env.NODE_ENV === 'development'){
        return `http://localhost:${process.env.PORT}`;
    }
}