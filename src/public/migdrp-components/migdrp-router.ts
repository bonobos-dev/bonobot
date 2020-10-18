

export class MigdrpRouter {
    private routes = [];
    private mode:string = null;
    private root:string = '/';
    private current:string = undefined;

    public constructor(options:{ mode?:string, root?:string }){
        this.mode = window.history.pushState ? 'history' : 'hash';
        if(options.mode) this.mode =  options.mode;
        if(options.root) this.root =  options.root;
        
        window.addEventListener('popstate', this.listen());

        window.onload = () => {
            console.log("mode: ",this.mode)
            this.current = this.getFragment();

            this.routes.forEach(route => {
                const match = this.current.match(route.path);
                if (match) {
                  match.shift();
                  route.cb.apply({}, match);
                  return match;
                }
                return false;
            });

            console.log(this.routes)


        }

    }

    private listen(){
        return (event:any) => {
            console.log('Fragment: ', this.getFragment());
            console.log('Current: ', this.current);
            console.log("location: " + document.location + ", state: " + JSON.stringify(event));
            console.log("mode: ",this.mode)

            
            if (this.current === this.getFragment()) return;
            this.current = this.getFragment();


            this.routes.forEach(route => {
                if(route.path === this.current){
                    route.cb();
                }
                
                const match = this.current.match(route.path);
                if (match) {
                  match.shift();
                  route.cb.apply({}, match);
                  return match;
                }
                return false;
            });
        }
    }

    public add(path, cb){
        this.routes.push({ path,cb });
        return this;
    }

    public remove(path) {
        for (var i = 0; i < this.routes.length; i++){
            if(this.routes[i].path === path){
                this.routes.splice(i,1);
                return this
            }
        }
        return this
    }

    public flush(){
        this.routes = [];
        return this;
    }

    public clearSlashes(path:any){
        return path.toString().replace(/\/$/,'').replace(/^\//,'');
    }

    public getFragment(){
        let fragment = '';
        if (this.mode === 'history') {
            
            console.log("From get fragment: ", fragment)
          fragment = this.clearSlashes(decodeURI(window.location.pathname + window.location.search));
          
        console.log("From get fragment: ", fragment)
          fragment = fragment.replace(/\?(.*)$/, '');
          
        console.log("From get fragment: ", fragment)
          fragment = this.root !== '/' ? fragment.replace(this.root, '') : fragment;
          
        } else {
            const match = window.location.href.match(/#(.*)$/);
            fragment = match ? match[1] : '';
        }
        console.log("From get fragment: ", fragment)
        return this.clearSlashes(fragment);
    }

    public navigate(path = ''){
        if (this.mode === 'history') {
            window.history.pushState(null, null, this.root + this.clearSlashes(path));
        } else {
            window.location.href = `${window.location.href.replace(/#(.*)$/, '')}#${path}`;
        }
        return this;
    }

    
}
