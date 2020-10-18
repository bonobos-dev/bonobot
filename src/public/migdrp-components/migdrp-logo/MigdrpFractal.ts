



export interface Point{
    x:number,
    y:number
}

export enum Fractals {
    Quartet ='quartet',
    Gosper = 'gosper'
}

/** The Migdrp Fractal class */
export class MigdrpFractal {

    private fractals = {
        quartet:{
            axiom:'A',
            angle:90,
            rules:[
                { 
                    char:'A',
                    value:'A+B-A-AB+'
                },
                { 
                    char:'B',
                    value:'-AB+B+A-B'
                }
            ],
        },
        gosper:{
            axiom:'A',
            angle:60,
            rules:[
                { 
                    char:'A',
                    value:'A-B--B+A++AA+B-'
                },
                { 
                    char:'B',
                    value:'+A-BB--B-A++A+B'
                }
            ],
        }
    };

    public levelReductionPoints: Array<Array<Point>> = [];
    public levelExpansionPoints: Array<Array<Point>> = [];
    public levelPathPoints:Array<Array<Point>> = [];

    private levelString:  Array<string> = [];
    private levelLenghts: number[] = [];
    private levelAngles:  number[] = [];


    private maxLevel:number;
    private segmentLenght:number;
    private angle:number;





    /** Creates a new Migdrp Fractal */
    public constructor(maxLevel:number, segmentLenght:number, fractal:Fractals){
        
        this.maxLevel = maxLevel;
        this.segmentLenght = segmentLenght;
        this.angle = this.fractals[fractal].angle;

        this.generateSegmentVariables();

        this.generateFractalStrings(fractal);

        this.generateFractalPoints();

        this.middlePoint();
    }


    private generateSegmentVariables(){


        let currentLenght = this.segmentLenght;
        let currentAngle = ((Math.atan(this.segmentLenght / (this.segmentLenght*2))) * 180/Math.PI);

        let nextLenght:number ;
        let nextAngle:number ;

        for(var n = 0; n < this.maxLevel; n++){

            if (n === 0 ){
                this.levelLenghts.push(this.segmentLenght);
                this.levelAngles.push( 0 );
            }else{
                nextLenght = ((currentLenght *  Math.cos( currentAngle * Math.PI/180 )  ) / 2 );
                nextAngle  = ((Math.atan(currentLenght / (currentLenght*2))) * 180/Math.PI);
    
                this.levelLenghts.push(Math.abs(nextLenght));
                this.levelAngles.push( nextAngle*n );
    
                currentLenght = nextLenght;
                currentAngle = nextAngle;
            }
            
           

            

        }
    }

    private generateFractalStrings(fractal:Fractals){

        const axiom:string = this.fractals[fractal].axiom;

        var currentString: string = axiom;
        var nextFractalString:string = '';

        for(var i = 0; i < this.maxLevel; i++){
            nextFractalString = '';
            for(var n = 0; n < currentString.length; n++){
                let currentchar = currentString.charAt(n);

                if(currentchar == this.fractals[fractal].rules[0].char){
                    nextFractalString += this.fractals[fractal].rules[0].value;
                }

                else if(currentchar == this.fractals[fractal].rules[1].char){
                    nextFractalString += this.fractals[fractal].rules[1].value;
                }
                else {
                    nextFractalString += currentchar;
                }
            }
            currentString = nextFractalString;
            this.levelString.push(currentString);
        }
        return nextFractalString
    }

    private generatePathPoints(fractalString:string, level:number ){

        let points:Point[] = [];
        let currentAngle:number = this.levelAngles[level] - this.levelAngles[4];
        let segmentLenght:number = this.levelLenghts[level];

        //console.log(`Segment lenght ${segmentLenght} for level ${level} with angle ${currentAngle}`);
        let lastPoint:Point =  { x:15.799027262255214, y:-0.5989504671700984 };
        let fractal = fractalString;

        //console.log("fractal: ",fractal);
        points.push(lastPoint);
        for(let i = 0; i < fractal.length; i++){
            if(fractal.charAt(i) === 'A' || fractal.charAt(i) === 'B'){
                lastPoint = this.newSegmentPoint(currentAngle, segmentLenght, lastPoint);
                points.push(lastPoint);
                //console.log(`Step:${i}, Char:${fractal.charAt(i)}, Point:(${lastPoint.x},${lastPoint.x}), Angle:${currentAngle}`)
            }
            else if(fractal.charAt(i) === '+'){
                currentAngle += this.angle;
                //console.log(`Step:${i}, Char:${fractal.charAt(i)}, Point:(${lastPoint.x},${lastPoint.x}), Angle:${currentAngle}`)
            }
            
            else if(fractal.charAt(i) === '-'){
                currentAngle -= this.angle;
                //console.log(`Step:${i}, Char:${fractal.charAt(i)}, Point:(${lastPoint.x},${lastPoint.x}), Angle:${currentAngle}`)
            }
        }
        /*
        for (let i = 0; i < steps; i++){
            this.
        }
        */
        //console.log("ShapePoints Aray: ", points);
        return points;
        
    }

    private generateReductionPoints(fractalString:string, level:number ){

        let points:Point[] = [];
        let currentAngle:number = this.levelAngles[level] - this.levelAngles[4];
        let segmentLenght:number = this.levelLenghts[level];

        //console.log(`Segment lenght ${segmentLenght} for level ${level} with angle ${currentAngle}`);
        let lastPoint:Point =  { x:15.799027262255214, y:-0.5989504671700984 };
        let fractal = fractalString;

        //console.log("fractal: ",fractal);

        points.push(lastPoint);
        for(let i = 0; i < fractal.length; i++){
            if(fractal.charAt(i) === 'A' || fractal.charAt(i) === 'B'){

                lastPoint = this.newSegmentPoint(currentAngle, segmentLenght, lastPoint);

                if( i < fractal.length - 1){
                    if( fractal.charAt(i+1) === 'A' || fractal.charAt(i+1) === 'B'){

                    }
                    else{
                        points.push(lastPoint);
                    }
                }
                else{
                    points.push(lastPoint);
                }

                
                //console.log(`Step:${i}, Char:${fractal.charAt(i)}, Point:(${lastPoint.x},${lastPoint.x}), Angle:${currentAngle}`)
            }
            else if(fractal.charAt(i) === '+'){
                
                currentAngle += this.angle;
                //console.log(`Step:${i}, Char:${fractal.charAt(i)}, Point:(${lastPoint.x},${lastPoint.x}), Angle:${currentAngle}`)
            }
            
            else if(fractal.charAt(i) === '-'){
                
                currentAngle -= this.angle;
                //console.log(`Step:${i}, Char:${fractal.charAt(i)}, Point:(${lastPoint.x},${lastPoint.x}), Angle:${currentAngle}`)
            }
        }
        /*
        for (let i = 0; i < steps; i++){
            this.
        }
        */

        //console.log("ShapePoints Aray: ", points);
        return points;
        
    }

    private generateExpansionPoints(pathPoints:Point[]){

        var subdividedPoints:Point[] = [];

        for(let i = 0; i < pathPoints.length - 1; i++){
    
            var middlePoint:Point = { x:0 , y:0 };
            var secondPoint:Point = { x:0 , y:0 };
            var thirdPoint:Point  = { x:0 , y:0 };
    
            var pointA:Point = { x:pathPoints[i].x   , y: pathPoints[i].y   }
            var pointB:Point = { x:pathPoints[i+1].x , y: pathPoints[i+1].y }
    
            middlePoint.x = ( pointA.x + pointB.x ) /2;
            middlePoint.y = ( pointA.y + pointB.y ) /2;
    
            secondPoint.x = ( pointA.x + middlePoint.x ) /2;
            secondPoint.y = ( pointA.y + middlePoint.y ) /2;
    
            thirdPoint.x = ( middlePoint.x + pointB.x ) /2;
            thirdPoint.y = ( middlePoint.y + pointB.y ) /2;
    
            subdividedPoints.push(pointA);
            subdividedPoints.push(secondPoint);
            subdividedPoints.push(middlePoint);
            subdividedPoints.push(thirdPoint);
    
            if (i === pathPoints.length - 2){
                subdividedPoints.push(pointB);
            }
        }
    
        return subdividedPoints;

        
    }

    private generateFractalPoints(){
        for (var n = 0; n < this.maxLevel; n++){
            var newPathPoints = this.generatePathPoints(this.levelString[n], n);
            var newReductionPoints = this.generateReductionPoints(this.levelString[n], n);
            var newExpansionPoints = this.generateExpansionPoints(newPathPoints);

            this.levelPathPoints.push(newPathPoints);
            this.levelReductionPoints.push(newReductionPoints);
            this.levelExpansionPoints.push(newExpansionPoints);
        }
    }

    private newSegmentPoint(angle:number, lenght:number, point:Point){
        let rads = angle * Math.PI/180;

        //console.log(`L:${lenght}, Deg:${angle}, Rad:${rads}`);

        
        let senAngle = Math.sin(rads);
        let consAngle =  Math.cos(rads);
        //console.log(`Sen:${senAngle}, Cos:${consAngle} `);

        let CO = lenght * senAngle;
        let CA = lenght * consAngle;
        let newPoint:Point = { x:point.x + CO , y:point.y + CA }

        //console.log(`CO:${CO}, CA:${CA}`);

        //console.log(`Res:(x:${newPoint.x}, y:${newPoint.y}) `);

        return newPoint;
    }

    private middlePoint(){
        let totalx:number = 0;
        let totaly:number = 0;

        for (var n = 0; n < this.levelPathPoints[this.maxLevel-1].length; n++){
            totalx += this.levelPathPoints[this.maxLevel-1][n].x;
            totaly += this.levelPathPoints[this.maxLevel-1][n].y;
        }

        totalx /= this.levelPathPoints[this.maxLevel-1].length;
        totaly /= this.levelPathPoints[this.maxLevel-1].length;

        //console.log(`Point = (${totalx},${totaly})`)
    }

    public getMaxLevel(){
        return this.maxLevel;
    }

}
